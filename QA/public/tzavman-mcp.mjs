#!/usr/bin/env node
/**
 * Tzav Man (צב מן) - Standalone Zero-Dependency MCP Server (stdio, JSON-RPC 2.0)
 * Compatible with Antigravity, Claude Code, Claude Desktop, Cursor, Windsurf, and VS Code.
 *
 * Requirements: Node.js >= 18 (uses built-in fetch, fs, path, readline — zero npm install needed).
 * Auth: Set env TZAVMAN_MCP_TOKEN to your personal token generated inside the Tzav Man web app.
 * Security: Runs strictly under the logged-in team member's own Firebase Auth identity & RTDB Rules.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const SERVER_NAME = 'tzavman-qa';
const SERVER_VERSION = '1.0.0';
const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const TOKEN_PREFIX = 'tzv_mcp_v1.';
const VALID_PLATFORMS = ['מחשב', 'IOS', 'אנדרואיד'];
const VALID_SEVERITIES = ['קריטית', 'גבוהה', 'בינונית', 'נמוכה'];
const VALID_STATUSES = ['פתוח', 'בטיפול', 'ניתן לבדוק שוב', 'נבדק תקין'];
const MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXT_MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
};

function logErr(msg) {
  process.stderr.write(`[tzavman-mcp] ${msg}\n`);
}

function sendJsonRpc(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function sendResult(id, result) {
  sendJsonRpc({ jsonrpc: '2.0', id, result });
}

function sendError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  sendJsonRpc({ jsonrpc: '2.0', id, error });
}

function encodeFirebaseSystemKey(system) {
  return encodeURIComponent(String(system)).replace(/\./g, '%2E');
}

function buildRtdbUrl(dbUrl, pathSegments, idToken) {
  const encodedPath = pathSegments.map((seg) => encodeURIComponent(String(seg))).join('/');
  return `${dbUrl}/${encodedPath}.json?auth=${encodeURIComponent(idToken)}`;
}

function decodePersonalToken(rawToken) {
  if (typeof rawToken !== 'string') return null;
  const trimmed = rawToken.trim();
  if (!trimmed.startsWith(TOKEN_PREFIX)) return null;
  try {
    const b64 = trimmed.slice(TOKEN_PREFIX.length).replace(/-/g, '+').replace(/_/g, '/');
    const pad = '==='.slice((b64.length + 3) % 4);
    const jsonStr = Buffer.from(b64 + pad, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonStr);
    if (
      !parsed ||
      parsed.v !== 1 ||
      !parsed.rt ||
      !parsed.ac ||
      !parsed.apiKey ||
      !parsed.dbUrl ||
      !parsed.projectId ||
      !parsed.appId
    ) {
      return null;
    }
    return {
      rt: String(parsed.rt).trim(),
      ac: String(parsed.ac).trim(),
      apiKey: String(parsed.apiKey).trim(),
      dbUrl: String(parsed.dbUrl).trim().replace(/\/+$/, ''),
      projectId: String(parsed.projectId).trim(),
      appId: String(parsed.appId).trim()
    };
  } catch {
    return null;
  }
}

function decodeProtectedDriveUrl(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const trimmed = raw.trim();
  const validRe = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/i;
  if (validRe.test(trimmed)) return trimmed;
  if (trimmed.startsWith('tzv_enc_v1:')) {
    try {
      const key = 'TzavMan_Nahshon_QA_Shield_2026';
      const bin = Buffer.from(trimmed.slice('tzv_enc_v1:'.length), 'base64').toString('binary');
      let out = '';
      for (let i = 0; i < bin.length; i++) {
        out += String.fromCharCode(bin.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      if (validRe.test(out)) return out;
    } catch {
      return null;
    }
  }
  return null;
}

function normalizePlatform(raw) {
  if (!raw || typeof raw !== 'string') return 'מחשב';
  const t = raw.trim().toLowerCase();
  if (t === 'ios' || t === 'iphone' || raw.includes('אייפון')) return 'IOS';
  if (t === 'android' || raw.includes('אנדרואיד')) return 'אנדרואיד';
  return 'מחשב';
}

function normalizeSeverity(raw) {
  if (typeof raw === 'string' && VALID_SEVERITIES.includes(raw.trim())) {
    return raw.trim();
  }
  return 'בינונית';
}

function normalizeStatus(raw) {
  if (typeof raw === 'string' && VALID_STATUSES.includes(raw.trim())) {
    return raw.trim();
  }
  return 'פתוח';
}

class TzavManClient {
  constructor(rawToken) {
    this.config = decodePersonalToken(rawToken);
    this.idToken = null;
    this.idTokenExpiresAt = 0;
    this.uid = null;
    this.appCheckToken = null;
    this.appCheckExpiresAt = 0;
    this.cachedProfile = null;
    this.profileFetchedAt = 0;
    this.cachedPrivateConfig = null;
    this.privateConfigFetchedAt = 0;
    this.clientId = `mcp-${Math.random().toString(36).slice(2, 9)}`;
  }

  ensureConfigured() {
    if (!this.config) {
      throw new Error(
        'משתנה הסביבה TZAVMAN_MCP_TOKEN חסר או לא תקין. פתח את אפליקציית "צב מן", לחץ על "סוכן AI" והעתק את ההגדרות המעודכנות.'
      );
    }
  }

  async getIdToken(forceRefresh = false) {
    this.ensureConfigured();
    const now = Date.now();
    if (!forceRefresh && this.idToken && this.uid && now < this.idTokenExpiresAt - 120_000) {
      return { idToken: this.idToken, uid: this.uid };
    }
    const res = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(this.config.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.config.rt
        }).toString()
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.id_token || !data.user_id) {
      throw new Error(
        `אימות המשתמש נכשל (${res.status}): ייתכן שהסיסמה שונתה או שההתחברות פגה. הפק טוקן חדש מתוך "צב מן".`
      );
    }
    this.idToken = String(data.id_token);
    this.uid = String(data.user_id);
    const ttlSec = Math.max(300, Number(data.expires_in || 3600));
    this.idTokenExpiresAt = now + ttlSec * 1000;
    return { idToken: this.idToken, uid: this.uid };
  }

  async getAppCheckToken(forceRefresh = false) {
    this.ensureConfigured();
    const now = Date.now();
    if (!forceRefresh && this.appCheckToken && now < this.appCheckExpiresAt - 120_000) {
      return this.appCheckToken;
    }
    const url = `https://firebaseappcheck.googleapis.com/v1/projects/${encodeURIComponent(
      this.config.projectId
    )}/apps/${encodeURIComponent(this.config.appId)}:exchangeDebugToken?key=${encodeURIComponent(
      this.config.apiKey
    )}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ debug_token: this.config.ac })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.token) {
      throw new Error(
        `אימות App Check נכשל (${res.status}): ייתכן שטוקן ה-MCP בוטל ע״י המנהל או שאינו מוגדר כ-Debug Token ב-Firebase Console.`
      );
    }
    this.appCheckToken = String(data.token);
    const ttlMatch = String(data.ttl || '3600s').match(/^(\d+(?:\.\d+)?)s$/);
    const ttlSec = ttlMatch ? Math.max(300, Math.floor(Number(ttlMatch[1]))) : 3600;
    this.appCheckExpiresAt = now + ttlSec * 1000;
    return this.appCheckToken;
  }

  async rtdbRequest(method, pathSegments, { body, etag, requestEtag = false } = {}) {
    const attempt = async (forceRefresh) => {
      const [{ idToken }, acToken] = await Promise.all([
        this.getIdToken(forceRefresh),
        this.getAppCheckToken(forceRefresh)
      ]);
      const url = buildRtdbUrl(this.config.dbUrl, pathSegments, idToken);
      const headers = {
        'X-Firebase-AppCheck': acToken
      };
      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }
      if (requestEtag) {
        headers['X-Firebase-ETag'] = 'true';
      }
      if (etag !== undefined) {
        headers['If-Match'] = etag;
      }
      return fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined
      });
    };

    let res = await attempt(false);
    if (res.status === 401) {
      res = await attempt(true);
    }
    const respEtag = res.headers.get('etag') || undefined;
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    return { status: res.status, ok: res.ok, data: json, etag: respEtag, rawText: text };
  }

  async getUserContext(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this.cachedProfile && now - this.profileFetchedAt < 45_000) {
      return this.cachedProfile;
    }
    const { uid } = await this.getIdToken(false);
    const [profileRes, privRes] = await Promise.all([
      this.rtdbRequest('GET', ['std_users', uid]),
      this.rtdbRequest('GET', ['std_private_config'])
    ]);
    if (!profileRes.ok || !profileRes.data || !profileRes.data.role || !profileRes.data.fullName) {
      throw new Error(
        'המשתמש אינו מאושר במערכת "צב מן" (או שההרשאות הוסרו ע״י המנהל).'
      );
    }
    const priv = privRes.ok && privRes.data ? privRes.data : {};
    this.cachedPrivateConfig = priv;
    this.privateConfigFetchedAt = now;

    if (priv.mcpEnabled === false) {
      throw new Error('חיבור סוכני AI מושבת כרגע ע״י מנהל המערכת.');
    }
    if (priv.mcpAppCheckToken && String(priv.mcpAppCheckToken).trim() !== this.config.ac) {
      throw new Error(
        'טוקן החיבור שלך אינו מעודכן (המנהל החליף מפתח). הפק טוקן חדש מתוך כפתור "סוכן AI" באפליקציה.'
      );
    }

    const p = profileRes.data;
    const role = p.role === 'admin' || p.role === 'dev' ? p.role : 'qa';
    const roleTitle =
      role === 'admin' ? 'מנהל מערכת' : role === 'dev' ? 'צוות פיתוח' : 'צוות בדיקות';
    const profile = {
      uid,
      fullName: String(p.fullName).trim(),
      email: p.email ? String(p.email).trim() : '',
      role,
      formattedAuthor: `${String(p.fullName).trim()} ${roleTitle}`,
      allSystems: role === 'admin' || p.allSystems === true,
      allowedSystems: Array.isArray(p.allowedSystems) ? p.allowedSystems.map(String) : [],
      allowedSystemKeys:
        p.allowedSystemKeys && typeof p.allowedSystemKeys === 'object' ? p.allowedSystemKeys : {}
    };
    this.cachedProfile = profile;
    this.profileFetchedAt = now;
    return profile;
  }

  isSystemPermitted(profile, systemName) {
    if (profile.role === 'admin' || profile.allSystems) return true;
    const key = encodeFirebaseSystemKey(systemName);
    if (profile.allowedSystemKeys && profile.allowedSystemKeys[key] === true) return true;
    return profile.allowedSystems.includes(systemName);
  }

  async getMetaAndPermittedSystems() {
    const profile = await this.getUserContext();
    const metaRes = await this.rtdbRequest('GET', ['std_meta']);
    if (!metaRes.ok || !metaRes.data) {
      throw new Error(`לא ניתן לקרוא את רשימת המערכות (${metaRes.status}).`);
    }
    const meta = metaRes.data;
    const rawSystems = Array.isArray(meta.systems)
      ? meta.systems
      : meta.systems && typeof meta.systems === 'object'
      ? Object.values(meta.systems)
      : [];
    const activeSystems = rawSystems.map(String).filter(Boolean);
    const permittedSystems = activeSystems.filter((s) => this.isSystemPermitted(profile, s));
    return { profile, meta, permittedSystems };
  }

  resolveSystemName(requestedName, permittedSystems) {
    const trimmed = String(requestedName || '').trim();
    const exact = permittedSystems.find((s) => s === trimmed);
    if (exact) return exact;
    const ci = permittedSystems.find((s) => s.toLowerCase() === trimmed.toLowerCase());
    if (ci) return ci;
    throw new Error(
      `המערכת "${trimmed}" אינה קיימת או שאין לך הרשאה אליה. מערכות זמינות עבורך: ${
        permittedSystems.join(', ') || 'אין מערכות זמינות'
      }`
    );
  }

  async fetchSystemIssues(systemName) {
    const sysKey = encodeFirebaseSystemKey(systemName);
    const res = await this.rtdbRequest('GET', ['std_systems', sysKey], { requestEtag: true });
    if (!res.ok) {
      throw new Error(`אין גישה למערכת "${systemName}" (HTTP ${res.status}).`);
    }
    const raw = res.data || {};
    const list = Array.isArray(raw.issues)
      ? raw.issues
      : raw.issues && typeof raw.issues === 'object'
      ? Object.values(raw.issues)
      : [];
    return {
      sysKey,
      raw,
      issues: list.filter((i) => i && i.id),
      etag: res.etag
    };
  }

  async uploadLocalScreenshot(filePath, systemName, testCaseId) {
    const resolved = path.resolve(String(filePath));
    if (!fs.existsSync(resolved)) {
      throw new Error(`קובץ צילום המסך לא נמצא: ${resolved}`);
    }
    const stat = fs.statSync(resolved);
    if (!stat.isFile()) {
      throw new Error(`הנתיב אינו קובץ תמונה תקין: ${resolved}`);
    }
    if (stat.size > MAX_SCREENSHOT_BYTES) {
      throw new Error(`קובץ התמונה גדול מ-8MB: ${path.basename(resolved)}`);
    }
    const ext = path.extname(resolved).toLowerCase();
    const mime = ALLOWED_EXT_MIME[ext];
    if (!mime) {
      throw new Error(`פורמט תמונה לא נתמך (${ext}). נתמך: PNG, JPG, WEBP, GIF.`);
    }
    const b64 = fs.readFileSync(resolved).toString('base64');
    const dataUrl = `data:${mime};base64,${b64}`;

    const driveUrl = decodeProtectedDriveUrl(this.cachedPrivateConfig?.googleDriveUrl);
    if (!driveUrl) {
      if (stat.size <= 350 * 1024) {
        return dataUrl;
      }
      throw new Error(
        `Google Drive אינו מחובר והתמונה ${path.basename(resolved)} גדולה מ-350KB.`
      );
    }

    const [{ idToken }, acToken] = await Promise.all([
      this.getIdToken(false),
      this.getAppCheckToken(false)
    ]);
    const apiSecret =
      typeof this.cachedPrivateConfig?.apiSecret === 'string'
        ? this.cachedPrivateConfig.apiSecret.trim()
        : '';
    const fileName = `מערכת_${systemName}_תסריט_${testCaseId}_${Date.now()}`;
    const body = {
      action: 'UPLOAD_IMAGE',
      ...(apiSecret ? { secret: apiSecret } : {}),
      firebaseIdToken: idToken,
      firebaseAppCheckToken: acToken,
      dataUrl,
      system: systemName,
      fileName
    };
    const res = await fetch(driveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });
    if (!res.ok) {
      throw new Error(`העלאת צילום המסך ל-Drive נכשלה (HTTP ${res.status}).`);
    }
    const json = await res.json().catch(() => null);
    if (json && json.ok && json.imageUrl) {
      return String(json.imageUrl);
    }
    throw new Error(json?.error || 'העלאת צילום המסך ל-Drive נכשלה.');
  }

  async bumpMetaAndAudit(profile, nextRevision, actionSummary, category, target) {
    const now = Date.now();
    await this.rtdbRequest('PATCH', ['std_meta'], {
      body: {
        revision: nextRevision,
        updatedAt: now,
        lastUpdatedBy: profile.fullName,
        lastAction: actionSummary,
        clientId: this.clientId
      }
    }).catch(() => {});

    const audId = `aud-${now}-${Math.random().toString(36).slice(2, 7)}`;
    await this.rtdbRequest('PUT', ['std_audit_log', audId], {
      body: {
        id: audId,
        action: `[MCP] ${actionSummary}`.slice(0, 300),
        category,
        actorUid: profile.uid,
        actorName: profile.fullName.slice(0, 120),
        ...(profile.email ? { actorEmail: profile.email } : {}),
        ...(target ? { target: String(target).slice(0, 120) } : {}),
        createdAt: now
      }
    }).catch(() => {});
  }

  async atomicUpdateSystem(systemName, mutator) {
    const { profile, meta, permittedSystems } = await this.getMetaAndPermittedSystems();
    const resolvedSystem = this.resolveSystemName(systemName, permittedSystems);

    for (let attempt = 0; attempt < 5; attempt++) {
      const { sysKey, raw, issues, etag } = await this.fetchSystemIssues(resolvedSystem);
      const outcome = await mutator({ profile, meta, systemName: resolvedSystem, issues });
      const now = Date.now();
      const nextPayload = {
        system: resolvedSystem,
        issues: outcome.nextIssues,
        updatedAt: now,
        revision: Math.max(Number(raw?.revision || 0), Number(meta?.revision || 0)) + 1,
        lastUpdatedBy: profile.fullName,
        clientId: this.clientId
      };
      const putRes = await this.rtdbRequest('PUT', ['std_systems', sysKey], {
        body: nextPayload,
        etag
      });
      if (putRes.status === 412) {
        // Concurrent write detected by Firebase ETag — re-read cleanly and retry!
        continue;
      }
      if (!putRes.ok) {
        throw new Error(`שמירת הנתונים ב-"צב מן" נכשלה (HTTP ${putRes.status}).`);
      }
      await this.bumpMetaAndAudit(
        profile,
        nextPayload.revision,
        outcome.actionSummary,
        'issue',
        outcome.auditTarget || resolvedSystem
      );
      return outcome.result;
    }
    throw new Error('התרחשו יותר מדי עדכונים במקביל במערכת זו. נסה שוב בעוד רגע.');
  }

  getNextTestCaseId(issues) {
    let maxNum = 0;
    const used = new Set();
    for (const iss of issues) {
      const raw = String(iss.testCaseId || '').trim();
      if (raw) used.add(raw.toLowerCase());
      const m = raw.match(/\d+/);
      if (m) {
        const n = parseInt(m[0], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    }
    let next = maxNum + 1;
    while (used.has(String(next))) next++;
    return String(next);
  }
}

const TOOLS = [
  {
    name: 'tzavman_whoami',
    description:
      'מחזיר את פרטי המשתמש המחובר ב-"צב מן", התפקיד שלו (מנהל / בודק QA / מפתח), ההרשאות והמערכות הפתוחות עבורו.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'tzavman_list_systems',
    description:
      'מחזיר את רשימת כל המערכות הפעילות שהמשתמש מורשה לגשת אליהן ב-"צב מן", כולל כמות תקלות כוללת ופתוחות לכל מערכת.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'tzavman_list_issues',
    description:
      'מחפש ושולף תקלות קיימות במערכת מסוימת (או בכל המערכות המורשות). מומלץ להריץ לפני פתיחת תקלה חדשה כדי למנוע כפילויות.',
    inputSchema: {
      type: 'object',
      properties: {
        system: {
          type: 'string',
          description: 'שם המערכת לסינון (אופציונלי — אם לא מועבר, ישלוף מכל המערכות המורשות).'
        },
        status: {
          type: 'string',
          enum: VALID_STATUSES,
          description: 'סינון לפי סטטוס תקלה (אופציונלי).'
        },
        platform: {
          type: 'string',
          enum: VALID_PLATFORMS,
          description: 'סינון לפי פלטפורמה (אופציונלי).'
        },
        severity: {
          type: 'string',
          enum: VALID_SEVERITIES,
          description: 'סינון לפי חומרה (אופציונלי).'
        },
        search: {
          type: 'string',
          description: 'חיפוש טקסט חופשי בנושא, תיאור או מספר תסריט (אופציונלי).'
        },
        limit: {
          type: 'number',
          description: 'כמות תקלות מרבית להחזרה (ברירת מחדל: 30, מקסימום: 100).'
        }
      },
      additionalProperties: false
    }
  },
  {
    name: 'tzavman_create_issue',
    description:
      'פותח תקלה חדשה ב-"צב מן" בזמן אמת (זמין לבודקי QA ומנהלים בלבד). ממספר תסריט אוטומטית ומעלה צילומי מסך מקומיים ל-Drive אם צוינו.',
    inputSchema: {
      type: 'object',
      properties: {
        system: {
          type: 'string',
          description: 'שם המערכת המדויק (מתוך tzavman_list_systems).'
        },
        subject: {
          type: 'string',
          description: 'כותרת קצרה וממוקדת של התקלה.'
        },
        description: {
          type: 'string',
          description: 'פירוט מהות השגיאה, צעדי שחזור ותוצאה צפויה מול בפועל.'
        },
        platform: {
          type: 'string',
          enum: VALID_PLATFORMS,
          description: 'פלטפורמה (ברירת מחדל: "מחשב").'
        },
        severity: {
          type: 'string',
          enum: VALID_SEVERITIES,
          description: 'חומרת התקלה (ברירת מחדל: "בינונית").'
        },
        status: {
          type: 'string',
          enum: VALID_STATUSES,
          description: 'סטטוס התחלתי (ברירת מחדל: "פתוח").'
        },
        initialComment: {
          type: 'string',
          description: 'הערה ראשונית אופציונלית לצוות.'
        },
        screenshotPaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'נתיבים מקומיים לקובצי צילום מסך (PNG/JPG/WEBP) שיועלו אוטומטית לתקלה.'
        }
      },
      required: ['system', 'subject', 'description'],
      additionalProperties: false
    }
  },
  {
    name: 'tzavman_update_issue',
    description:
      'מעדכן סטטוס ו/או מוסיף תגובה לתקלה קיימת ב-"צב מן" (זמין לבודקי QA, מפתחים ומנהלים במערכות המורשות).',
    inputSchema: {
      type: 'object',
      properties: {
        system: {
          type: 'string',
          description: 'שם המערכת שבה נמצאת התקלה.'
        },
        testCaseId: {
          type: 'string',
          description: 'מספר התסריט בתוך המערכת (למשל "12"). חובה להעביר testCaseId או issueId.'
        },
        issueId: {
          type: 'string',
          description: 'מזהה התקלה הפנימי (std-...). אופציונלי אם הועבר testCaseId.'
        },
        status: {
          type: 'string',
          enum: VALID_STATUSES,
          description: 'סטטוס חדש לעדכון (אופציונלי).'
        },
        comment: {
          type: 'string',
          description: 'תגובה חדשה להוספה לתקלה (אופציונלי).'
        },
        screenshotPath: {
          type: 'string',
          description: 'נתיב מקומי לצילום מסך אופציונלי שיצורף לתגובה.'
        }
      },
      required: ['system'],
      additionalProperties: false
    }
  }
];

const client = new TzavManClient(process.env.TZAVMAN_MCP_TOKEN || '');

async function handleToolCall(name, args = {}) {
  if (name === 'tzavman_whoami') {
    const { profile, permittedSystems } = await client.getMetaAndPermittedSystems();
    return {
      fullName: profile.fullName,
      email: profile.email,
      role: profile.role,
      canCreateIssues: profile.role === 'admin' || profile.role === 'qa',
      canUpdateStatusAndComment: true,
      permittedSystems
    };
  }

  if (name === 'tzavman_list_systems') {
    const { permittedSystems } = await client.getMetaAndPermittedSystems();
    const summaries = await Promise.all(
      permittedSystems.map(async (sys) => {
        const { issues } = await client.fetchSystemIssues(sys);
        const openCount = issues.filter((i) => i.status !== 'נבדק תקין').length;
        const criticalCount = issues.filter(
          (i) => i.severity === 'קריטית' && i.status !== 'נבדק תקין'
        ).length;
        return {
          system: sys,
          totalIssues: issues.length,
          openIssues: openCount,
          criticalOpenIssues: criticalCount
        };
      })
    );
    return { count: summaries.length, systems: summaries };
  }

  if (name === 'tzavman_list_issues') {
    const { permittedSystems } = await client.getMetaAndPermittedSystems();
    const targetSystems = args.system
      ? [client.resolveSystemName(args.system, permittedSystems)]
      : permittedSystems;
    const allLists = await Promise.all(targetSystems.map((s) => client.fetchSystemIssues(s)));
    let items = allLists.flatMap((x) => x.issues);

    if (args.status) items = items.filter((i) => i.status === args.status);
    if (args.platform) items = items.filter((i) => i.platform === args.platform);
    if (args.severity) items = items.filter((i) => i.severity === args.severity);
    if (args.search && String(args.search).trim()) {
      const q = String(args.search).trim().toLowerCase();
      items = items.filter(
        (i) =>
          String(i.subject || '').toLowerCase().includes(q) ||
          String(i.description || '').toLowerCase().includes(q) ||
          String(i.testCaseId || '').toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    const limit = Math.min(100, Math.max(1, Number(args.limit || 30)));
    const sliced = items.slice(0, limit).map((i) => ({
      id: i.id,
      system: i.system,
      testCaseId: i.testCaseId,
      platform: i.platform,
      severity: i.severity || 'בינונית',
      status: i.status,
      subject: i.subject,
      description: i.description,
      screenshotsCount: Array.isArray(i.screenshots) ? i.screenshots.length : 0,
      commentsCount: Array.isArray(i.comments) ? i.comments.length : 0,
      createdBy: i.createdBy,
      updatedAt: i.updatedAt
    }));
    return { totalMatched: items.length, returned: sliced.length, issues: sliced };
  }

  if (name === 'tzavman_create_issue') {
    const { profile, permittedSystems } = await client.getMetaAndPermittedSystems();
    if (profile.role !== 'admin' && profile.role !== 'qa') {
      throw new Error(
        'אין הרשאה: משתמש בתפקיד מפתח (Dev) יכול לקרוא תקלות, להגיב ולעדכן סטטוס — פתיחת תקלות חדשות מותרת לבודקי QA ומנהלים בלבד.'
      );
    }
    const resolvedSystem = client.resolveSystemName(args.system, permittedSystems);
    const subject = String(args.subject || '').trim();
    const description = String(args.description || '').trim();
    if (!subject || !description) {
      throw new Error('חובה להעביר subject (נושא) ו-description (מהות השגיאה).');
    }
    const platform = normalizePlatform(args.platform);
    const severity = normalizeSeverity(args.severity);
    const status = normalizeStatus(args.status);
    const screenshotPaths = Array.isArray(args.screenshotPaths) ? args.screenshotPaths : [];

    // Pre-upload screenshots once outside the retry loop (only after system permission verified)
    const uploadedScreenshots = [];
    for (let i = 0; i < screenshotPaths.length; i++) {
      const url = await client.uploadLocalScreenshot(
        screenshotPaths[i],
        resolvedSystem,
        `mcp_${i + 1}`
      );
      uploadedScreenshots.push(url);
    }

    return client.atomicUpdateSystem(resolvedSystem, ({ profile: p, systemName, issues }) => {
      const now = Date.now();
      const testCaseId = client.getNextTestCaseId(issues);
      const comments = [];
      if (args.initialComment && String(args.initialComment).trim()) {
        comments.push({
          id: `c-${now}`,
          author: p.formattedAuthor,
          role: p.role,
          text: String(args.initialComment).trim(),
          createdAt: now
        });
      }
      const newIssue = {
        id: `std-${now}-${Math.random().toString(36).slice(2, 6)}`,
        system: systemName,
        testCaseId,
        platform,
        severity,
        subject,
        description,
        status,
        screenshots: uploadedScreenshots,
        comments,
        auditLog: [
          {
            id: `aud-${now}`,
            actor: p.formattedAuthor,
            action: `פתח תקלה חדשה דרך סוכן AI בסטטוס "${status}" (חומרה: ${severity})`,
            timestamp: now
          }
        ],
        createdBy: p.formattedAuthor,
        createdAt: now,
        updatedAt: now
      };
      return {
        nextIssues: [newIssue, ...issues],
        actionSummary: `תקלה חדשה בתסריט #${testCaseId} (${systemName})`,
        auditTarget: `${systemName} #${testCaseId}`,
        result: {
          created: true,
          id: newIssue.id,
          system: systemName,
          testCaseId,
          platform,
          severity,
          status,
          screenshotsUploaded: uploadedScreenshots.length
        }
      };
    });
  }

  if (name === 'tzavman_update_issue') {
    const newStatus = args.status ? normalizeStatus(args.status) : null;
    const commentText = args.comment ? String(args.comment).trim() : '';
    if (!newStatus && !commentText) {
      throw new Error('חובה להעביר לפחות status חדש או comment להוספה.');
    }
    if (!args.testCaseId && !args.issueId) {
      throw new Error('חובה לציין testCaseId או issueId לזיהוי התקלה.');
    }

    const { permittedSystems } = await client.getMetaAndPermittedSystems();
    const resolvedSystem = client.resolveSystemName(args.system, permittedSystems);

    let uploadedCommentScreenshot;
    if (args.screenshotPath) {
      uploadedCommentScreenshot = await client.uploadLocalScreenshot(
        args.screenshotPath,
        resolvedSystem,
        String(args.testCaseId || 'comment')
      );
    }

    return client.atomicUpdateSystem(resolvedSystem, ({ profile: p, systemName, issues }) => {
      const targetIdx = issues.findIndex((iss) => {
        if (args.issueId && iss.id === String(args.issueId).trim()) return true;
        if (
          args.testCaseId &&
          String(iss.testCaseId || '').trim().toLowerCase() ===
            String(args.testCaseId).trim().toLowerCase()
        ) {
          return true;
        }
        return false;
      });
      if (targetIdx === -1) {
        throw new Error(
          `לא נמצאה תקלה תואמת (${args.testCaseId ? `#${args.testCaseId}` : args.issueId}) במערכת "${systemName}".`
        );
      }

      const now = Date.now();
      const target = issues[targetIdx];
      const nextComments = Array.isArray(target.comments) ? [...target.comments] : [];
      const nextAudit = Array.isArray(target.auditLog) ? [...target.auditLog] : [];
      const actions = [];

      if (newStatus && newStatus !== target.status) {
        actions.push(`סטטוס שונה מ-"${target.status}" ל-"${newStatus}"`);
        nextAudit.push({
          id: `aud-${now}-st`,
          actor: p.formattedAuthor,
          action: `שינה סטטוס ל-"${newStatus}" דרך סוכן AI`,
          timestamp: now
        });
      }
      if (commentText) {
        nextComments.push({
          id: `c-${now}-${Math.random().toString(36).slice(2, 5)}`,
          author: p.formattedAuthor,
          role: p.role,
          text: commentText,
          ...(uploadedCommentScreenshot ? { screenshot: uploadedCommentScreenshot } : {}),
          createdAt: now
        });
        actions.push('נוספה הערה');
        nextAudit.push({
          id: `aud-${now}-cm`,
          actor: p.formattedAuthor,
          action: 'הוסיף תגובה דרך סוכן AI',
          timestamp: now
        });
      }

      const updatedIssue = {
        ...target,
        status: newStatus || target.status,
        comments: nextComments,
        auditLog: nextAudit,
        updatedAt: now
      };
      const nextIssues = issues.map((iss, idx) => (idx === targetIdx ? updatedIssue : iss));

      return {
        nextIssues,
        actionSummary: `תסריט #${target.testCaseId} (${systemName}): ${
          actions.join(' • ') || 'עודכן'
        }`,
        auditTarget: `${systemName} #${target.testCaseId}`,
        result: {
          updated: true,
          id: updatedIssue.id,
          system: systemName,
          testCaseId: updatedIssue.testCaseId,
          status: updatedIssue.status,
          commentsCount: updatedIssue.comments.length
        }
      };
    });
  }

  throw new Error(`כלי לא מוכר: ${name}`);
}

async function handleMessage(msg) {
  if (!msg || typeof msg !== 'object' || msg.jsonrpc !== '2.0') {
    if (msg && msg.id !== undefined) {
      sendError(msg.id, -32600, 'Invalid JSON-RPC 2.0 request');
    }
    return;
  }

  const { id, method, params } = msg;

  // Notifications have no id and MUST NOT receive a response
  if (id === undefined || id === null) {
    return;
  }

  try {
    if (method === 'initialize') {
      const requestedVersion = params?.protocolVersion;
      const negotiatedVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion)
        ? requestedVersion
        : SUPPORTED_PROTOCOL_VERSIONS[SUPPORTED_PROTOCOL_VERSIONS.length - 1];
      sendResult(id, {
        protocolVersion: negotiatedVersion,
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      });
      return;
    }

    if (method === 'ping') {
      sendResult(id, {});
      return;
    }

    if (method === 'tools/list') {
      sendResult(id, { tools: TOOLS });
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      try {
        const data = await handleToolCall(toolName, toolArgs);
        sendResult(id, {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
          isError: false
        });
      } catch (toolErr) {
        sendResult(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { error: toolErr?.message || String(toolErr) },
                null,
                2
              )
            }
          ],
          isError: true
        });
      }
      return;
    }

    sendError(id, -32601, `Method not found: ${method}`);
  } catch (err) {
    sendError(id, -32603, err?.message || 'Internal error');
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    sendError(null, -32700, 'Parse error');
    return;
  }
  void handleMessage(parsed);
});

rl.on('close', () => {
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  logErr(`Uncaught error: ${err?.stack || err}`);
});
process.on('unhandledRejection', (err) => {
  logErr(`Unhandled rejection: ${err?.stack || err}`);
});
