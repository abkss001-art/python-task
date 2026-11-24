export interface McpPersonalTokenPayload {
  v: 1;
  rt: string; // Firebase Auth personal refreshToken (revocable, no plaintext password)
  ac: string; // Firebase App Check Debug Token (configured once by Admin in Developer Vault)
  apiKey: string;
  dbUrl: string;
  projectId: string;
  appId: string;
}

const TOKEN_PREFIX = 'tzv_mcp_v1.';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidAppCheckDebugToken(raw: string | undefined | null): boolean {
  if (typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  return UUID_RE.test(trimmed) || /^[A-Za-z0-9_-]{24,128}$/.test(trimmed);
}

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUtf8(b64url: string): string {
  const padded = b64url.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64url.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeMcpPersonalToken(payload: McpPersonalTokenPayload): string {
  const json = JSON.stringify({
    v: 1,
    rt: payload.rt.trim(),
    ac: payload.ac.trim(),
    apiKey: payload.apiKey.trim(),
    dbUrl: payload.dbUrl.trim().replace(/\/+$/, ''),
    projectId: payload.projectId.trim(),
    appId: payload.appId.trim()
  });
  return TOKEN_PREFIX + utf8ToBase64Url(json);
}

export function decodeMcpPersonalToken(rawToken: string): McpPersonalTokenPayload | null {
  if (typeof rawToken !== 'string') return null;
  const trimmed = rawToken.trim();
  if (!trimmed.startsWith(TOKEN_PREFIX)) return null;
  try {
    const jsonStr = base64UrlToUtf8(trimmed.slice(TOKEN_PREFIX.length));
    const parsed = JSON.parse(jsonStr);
    if (
      !parsed ||
      parsed.v !== 1 ||
      typeof parsed.rt !== 'string' ||
      !parsed.rt.trim() ||
      typeof parsed.ac !== 'string' ||
      !parsed.ac.trim() ||
      typeof parsed.apiKey !== 'string' ||
      !parsed.apiKey.trim() ||
      typeof parsed.dbUrl !== 'string' ||
      !parsed.dbUrl.trim() ||
      typeof parsed.projectId !== 'string' ||
      !parsed.projectId.trim() ||
      typeof parsed.appId !== 'string' ||
      !parsed.appId.trim()
    ) {
      return null;
    }
    return {
      v: 1,
      rt: parsed.rt.trim(),
      ac: parsed.ac.trim(),
      apiKey: parsed.apiKey.trim(),
      dbUrl: parsed.dbUrl.trim().replace(/\/+$/, ''),
      projectId: parsed.projectId.trim(),
      appId: parsed.appId.trim()
    };
  } catch {
    return null;
  }
}

export function normalizeScriptPathForConfig(rawPath: string): string {
  const trimmed = rawPath.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) return 'C:/Users/YOUR_USER/Downloads/tzavman-mcp.mjs';
  return trimmed.replace(/\\/g, '/');
}

export function buildMcpServerConfigJson(scriptPath: string, personalToken: string): string {
  const cleanPath = normalizeScriptPathForConfig(scriptPath);
  return JSON.stringify(
    {
      mcpServers: {
        'tzavman-qa': {
          command: 'node',
          args: [cleanPath],
          env: {
            TZAVMAN_MCP_TOKEN: personalToken
          }
        }
      }
    },
    null,
    2
  );
}

export function buildClaudeCodeAddCommand(scriptPath: string, personalToken: string): string {
  const cleanPath = normalizeScriptPathForConfig(scriptPath);
  return `claude mcp add tzavman-qa -e TZAVMAN_MCP_TOKEN=${personalToken} -- node "${cleanPath}"`;
}

export function getMcpScriptDownloadUrl(): string {
  if (typeof window === 'undefined') return './tzavman-mcp.mjs';
  try {
    const url = new URL('./tzavman-mcp.mjs', window.location.href);
    return url.toString();
  } catch {
    return './tzavman-mcp.mjs';
  }
}

export function maskMcpTokenForDisplay(token: string): string {
  if (!token || token.length < 24) return token;
  return `${token.slice(0, 18)}••••••••••••${token.slice(-8)}`;
}
