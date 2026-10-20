import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

function realtimeSyncServerPlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), 'data');
  const dbFile = path.join(dataDir, 'std-realtime-db.json');
  const clients = new Set<ServerResponse>();

  const ensureDb = () => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dbFile)) {
      const initialData = {
        systems: ['CARGO', 'נשקי ערד'],
        firebaseConfig: null,
        issues: [
          {
            id: 'std-101',
            system: 'CARGO',
            testCaseId: '10',
            platform: 'אייפון',
            subject: 'כפתור אישור משלוח נחתך במסך סיכום הזמנה',
            description: 'בעת גלילה לתחתית מסך סיכום המשלוח במכשיר אייפון 15, כפתור "אשר ושלח" מוסתר חלקית על ידי סרגל הניווט התחתון ולא ניתן ללחוץ עליו במצב אנכי.',
            status: 'פתוח',
            screenshots: [],
            comments: [
              {
                id: 'c-1',
                author: 'דניאל (בודק)',
                role: 'qa',
                text: 'שוחזר גם באייפון 14 וגם באייפון 15 Pro בגרסת iOS 17.4.',
                createdAt: Date.now() - 3600000 * 3
              },
              {
                id: 'c-2',
                author: 'רועי (מפתח)',
                role: 'dev',
                text: 'בודק את ה-Safe Area padding בתחתית המסך, מעלה תיקון לסביבת הבדיקות בקרוב.',
                createdAt: Date.now() - 3600000
              }
            ],
            createdBy: 'דניאל (בודק)',
            createdAt: Date.now() - 3600000 * 4,
            updatedAt: Date.now() - 3600000
          },
          {
            id: 'std-102',
            system: 'CARGO',
            testCaseId: '11',
            platform: 'Chrome',
            subject: 'שגיאת חישוב משקל כולל בעת הוספת מכולה שנייה',
            description: 'כאשר מוסיפים שתי מכולות באותה תעודת משלוח, השדה "משקל כולל (ק"ג)" מציג רק את המשקל של המכולה האחרונה במקום סכום המשקלים.',
            status: 'בטיפול',
            screenshots: [],
            comments: [
              {
                id: 'c-3',
                author: 'מיכל (בודקת)',
                role: 'qa',
                text: 'שימו לב שזה קורה רק כשמזינים משקל עם נקודה עשרונית.',
                createdAt: Date.now() - 7200000
              }
            ],
            createdBy: 'מיכל (בודקת)',
            createdAt: Date.now() - 8600000,
            updatedAt: Date.now() - 7200000
          },
          {
            id: 'std-103',
            system: 'CARGO',
            testCaseId: '12',
            platform: 'Safari',
            subject: 'ייצוא תעודת משלוח ל-PDF מציג גופן הפוך בעברית',
            description: 'בלחיצה על "הורד PDF" בדפדפן Safari במק, כותרות הטבלה בעברית מודפסות משמאל לימין.',
            status: 'ניתן לבדוק שוב',
            screenshots: [],
            comments: [
              {
                id: 'c-4',
                author: 'רועי (מפתח)',
                role: 'dev',
                text: 'עודכן הפונט המוטמע ב-PDF ותוקן כיוון ה-RTL. אשמח לבדיקה חוזרת ב-Safari.',
                createdAt: Date.now() - 1800000
              }
            ],
            createdBy: 'דניאל (בודק)',
            createdAt: Date.now() - 14400000,
            updatedAt: Date.now() - 1800000
          },
          {
            id: 'std-201',
            system: 'נשקי ערד',
            testCaseId: '10',
            platform: 'מחשב',
            subject: 'איטיות בטעינת קטלוג דגמים בחיפוש לפי מספר סידורי',
            description: 'חיפוש מספר סידורי מלא בטבלת המלאי לוקח מעל 6 שניות וגורם לקפיאה זמנית של הממשק.',
            status: 'נבדק תקין',
            screenshots: [],
            comments: [
              {
                id: 'c-5',
                author: 'אלון (מפתח)',
                role: 'dev',
                text: 'נוסף אינדקס לחיפוש מהיר ובוצע Debounce לשדה החיפוש.',
                createdAt: Date.now() - 5400000
              },
              {
                id: 'c-6',
                author: 'מיכל (בודקת)',
                role: 'qa',
                text: 'נבדק שוב – התוצאות עולות תוך פחות מ-200ms. תקין!',
                createdAt: Date.now() - 2400000
              }
            ],
            createdBy: 'מיכל (בודקת)',
            createdAt: Date.now() - 18000000,
            updatedAt: Date.now() - 2400000
          }
        ],
        lastUpdatedBy: 'מערכת',
        lastAction: 'אתחול ראשוני',
        updatedAt: Date.now()
      };
      fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  };

  const readDb = () => {
    ensureDb();
    try {
      return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    } catch {
      return { systems: ['CARGO', 'נשקי ערד'], firebaseConfig: null, issues: [] };
    }
  };

  const broadcast = (payload: unknown) => {
    const dataStr = `data: ${JSON.stringify(payload)}\n\n`;
    for (const client of clients) {
      try {
        client.write(dataStr);
      } catch {
        clients.delete(client);
      }
    }
  };

  const setupMiddleware = (middlewares: any) => {
    middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (!req.url) return next();

      if (req.url.startsWith('/api/std-stream') && req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });
        const current = readDb();
        res.write(`data: ${JSON.stringify({ type: 'SYNC_STATE', payload: current, onlineCount: clients.size + 1 })}\n\n`);
        clients.add(res);
        broadcast({ type: 'PRESENCE', onlineCount: clients.size });

        req.on('close', () => {
          clients.delete(res);
          broadcast({ type: 'PRESENCE', onlineCount: clients.size });
        });
        return;
      }

      if (req.url.startsWith('/api/std-state') && req.method === 'GET') {
        const current = readDb();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ...current, onlineCount: clients.size }));
        return;
      }

      if (req.url.startsWith('/api/std-state') && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const incoming = JSON.parse(body);
            const current = readDb();
            const updated = {
              systems: incoming.systems ?? current.systems,
              archivedSystems: incoming.archivedSystems ?? current.archivedSystems ?? [],
              firebaseConfig: incoming.firebaseConfig !== undefined ? incoming.firebaseConfig : current.firebaseConfig,
              issues: incoming.issues ?? current.issues,
              lastUpdatedBy: incoming.lastUpdatedBy ?? 'חבר צוות',
              lastAction: incoming.lastAction ?? 'עדכון נתונים',
              clientId: incoming.clientId ?? '',
              updatedAt: Date.now()
            };
            fs.writeFileSync(dbFile, JSON.stringify(updated, null, 2), 'utf-8');
            broadcast({
              type: 'SYNC_STATE',
              payload: updated,
              onlineCount: clients.size
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, updatedAt: updated.updatedAt }));
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        });
        return;
      }

      next();
    });
  };

  return {
    name: 'realtime-std-sync-server',
    configureServer(server) {
      setupMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      setupMiddleware(server.middlewares);
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), realtimeSyncServerPlugin()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true
  }
});
