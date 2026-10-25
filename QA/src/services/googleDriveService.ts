const GDRIVE_URL_STORAGE_KEY = 'std_qa_gdrive_webapp_url';

export interface GoogleDriveUploadResult {
  ok: boolean;
  fileId?: string;
  imageUrl?: string;
  webViewLink?: string;
  error?: string;
}

/**
 * הקוד המוכן להדבקה ב-Google Apps Script בחשבון ה-Google Drive (5TB) של המנהל
 */
export const GOOGLE_APPS_SCRIPT_CODE = `// ============================================================================
// "צב מן" - מנוע אחסון אוטומטי של צילומי מסך וגיבויים ב-Google Drive (5TB)
// ============================================================================
var MAIN_FOLDER_NAME = "צב מן - צילומי מסך וגיבויים";

function getOrCreateMainFolder() {
  var folders = DriveApp.getFoldersByName(MAIN_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  var folder = DriveApp.createFolder(MAIN_FOLDER_NAME);
  return folder;
}

function getOrCreateSystemFolder(mainFolder, systemName) {
  if (!systemName) return mainFolder;
  var cleanName = String(systemName).replace(/[\\\\/:*?"<>|]/g, "_").trim();
  if (!cleanName) return mainFolder;
  var subFolders = mainFolder.getFoldersByName(cleanName);
  if (subFolders.hasNext()) {
    return subFolders.next();
  }
  return mainFolder.createFolder(cleanName);
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "ping";
  var mainFolder = getOrCreateMainFolder();
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    action: action,
    folderName: mainFolder.getName(),
    folderUrl: mainFolder.getUrl()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var body = JSON.parse(raw);
    var mainFolder = getOrCreateMainFolder();

    // 1. בדיקת חיבור מהירה
    if (body.action === "PING") {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        folderName: mainFolder.getName(),
        folderUrl: mainFolder.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. העלאת צילום מסך ושמירתו בתיקיית המערכת ב-Google Drive
    if (body.action === "UPLOAD_IMAGE") {
      var dataUrl = String(body.dataUrl || "");
      var parts = dataUrl.split(",");
      var base64Data = parts.length > 1 ? parts[1] : parts[0];
      var mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
      var mimeType = mimeMatch ? mimeMatch[1] : "image/webp";
      var ext = mimeType.indexOf("png") !== -1 ? "png" : mimeType.indexOf("jpeg") !== -1 || mimeType.indexOf("jpg") !== -1 ? "jpg" : "webp";

      var targetFolder = getOrCreateSystemFolder(mainFolder, body.system || "כללי");
      var fileName = (body.fileName || ("צילום_מסך_" + new Date().getTime())) + "." + ext;

      var decoded = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decoded, mimeType, fileName);
      var file = targetFolder.createFile(blob);

      // מתן הרשאת צפייה בקישור כדי שכל המכשירים והטלפונים יראו את התמונה מיד בטבלה
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var fileId = file.getId();

      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        fileId: fileId,
        imageUrl: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1600",
        webViewLink: file.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. שמירת קובץ גיבוי אוטומטי של מסד הנתונים ב-Google Drive
    if (body.action === "SAVE_BACKUP") {
      var backupName = "tzavman_auto_backup.json";
      var existing = mainFolder.getFilesByName(backupName);
      var content = JSON.stringify(body.payload, null, 2);
      if (existing.hasNext()) {
        var f = existing.next();
        f.setContent(content);
      } else {
        mainFolder.createFile(backupName, content, MimeType.PLAIN_TEXT);
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export function getSavedGoogleDriveUrl(): string {
  try {
    return (localStorage.getItem(GDRIVE_URL_STORAGE_KEY) || '').trim();
  } catch {
    return '';
  }
}

export function setSavedGoogleDriveUrl(url: string) {
  try {
    const cleaned = url.trim();
    if (cleaned) {
      localStorage.setItem(GDRIVE_URL_STORAGE_KEY, cleaned);
    } else {
      localStorage.removeItem(GDRIVE_URL_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function isDataUrlImage(str: string): boolean {
  return typeof str === 'string' && str.startsWith('data:image/');
}

/**
 * בודק חיבור מול ה-Web App של Google Drive ומחזיר את שם התיקייה והקישור אליה
 */
export async function testGoogleDriveConnection(
  scriptUrl: string
): Promise<{ ok: boolean; folderName?: string; folderUrl?: string; error?: string }> {
  const cleaned = scriptUrl.trim();
  if (!cleaned.startsWith('https://script.google.com/')) {
    return {
      ok: false,
      error: 'הכתובת חייבת להתחיל ב-https://script.google.com/macros/s/...'
    };
  }

  try {
    const res = await fetch(cleaned, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'PING' }),
      redirect: 'follow'
    });
    if (!res.ok) {
      return { ok: false, error: `שגיאת שרת (${res.status})` };
    }
    const data = await res.json();
    if (data && data.ok) {
      return {
        ok: true,
        folderName: data.folderName,
        folderUrl: data.folderUrl
      };
    }
    return { ok: false, error: data?.error || 'תגובה לא תקינה מהסקריפט' };
  } catch (err: any) {
    return {
      ok: false,
      error:
        err?.message ||
        'לא ניתן להתחבר לסקריפט. ודא שהגדרת "Who has access: Anyone" בעת הפרסום (Deploy).'
    };
  }
}

/**
 * מעלה צילום מסך בודד (Base64) ל-Google Drive ומחזיר קישור קל ומהיר לתמונה
 */
export async function uploadImageToGoogleDrive(
  dataUrl: string,
  meta?: { system?: string; testCaseId?: string; label?: string }
): Promise<string> {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl || !isDataUrlImage(dataUrl)) {
    return dataUrl;
  }

  try {
    const fileName = `מערכת_${meta?.system || 'כללי'}_תסריט_${meta?.testCaseId || '0'}_${Date.now()}`;
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'UPLOAD_IMAGE',
        dataUrl,
        system: meta?.system || 'כללי',
        fileName
      }),
      redirect: 'follow'
    });

    if (!res.ok) return dataUrl;
    const json = (await res.json()) as GoogleDriveUploadResult;
    if (json && json.ok && json.imageUrl) {
      return json.imageUrl;
    }
    return dataUrl;
  } catch {
    // במידה ואין חיבור רגעי, שומר את התמונה המקורית כך ששום מידע לא הולך לאיבוד
    return dataUrl;
  }
}

/**
 * מעלה מערך של צילומי מסך ל-Google Drive (רק אלו שעדיין ב-Base64) ומחזיר מערך קישורים קלים
 */
export async function uploadScreenshotsArrayToGoogleDrive(
  screenshots: string[],
  meta?: { system?: string; testCaseId?: string }
): Promise<string[]> {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl || !Array.isArray(screenshots) || screenshots.length === 0) {
    return screenshots;
  }

  const results = await Promise.all(
    screenshots.map((img, idx) => {
      if (!isDataUrlImage(img)) return Promise.resolve(img);
      return uploadImageToGoogleDrive(img, {
        system: meta?.system,
        testCaseId: `${meta?.testCaseId || '0'}_תמונה_${idx + 1}`
      });
    })
  );

  return results;
}

/**
 * שומר גיבוי אוטומטי ברקע של מסד הנתונים לתיקיית ה-Google Drive
 */
export function saveAutoBackupToGoogleDrive(payload: unknown) {
  const scriptUrl = getSavedGoogleDriveUrl();
  if (!scriptUrl) return;

  fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'SAVE_BACKUP',
      payload
    }),
    redirect: 'follow'
  }).catch(() => {});
}
