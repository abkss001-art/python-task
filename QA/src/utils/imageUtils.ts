/**
 * דחיסה חכמה של צילום מסך תוך שמירה על חדות טקסטים קטנים (למשל צילומי מסך ממובייל)
 * כדי להבטיח סנכרון מיידי ומהיר בענן
 */
export async function processScreenshotFile(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('שגיאה בקריאת קובץ התמונה'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        const MAX_DIM = 1280;
        let { width, height } = img;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt webp first for optimal size/clarity balance
        let compressed = canvas.toDataURL('image/webp', 0.82);

        // If browser does not support webp export (falls back to uncompressed png) or size > 200KB:
        if (compressed.startsWith('data:image/png') || compressed.length > 200_000) {
          compressed = canvas.toDataURL('image/jpeg', 0.8);
        }
        if (compressed.length > 220_000) {
          compressed = canvas.toDataURL('image/jpeg', 0.68);
        }
        resolve(compressed);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * חילוץ סינכרוני של קובצי תמונה מתוך אירוע הדבקה (Ctrl + V) לפני כל await,
 * כדי ש-preventDefault יעבוד תמיד והדפדפן לא יאבד את הנתונים מה-ClipboardData
 */
export function getRawImageFilesFromClipboardEvent(
  e: ClipboardEvent | React.ClipboardEvent
): File[] {
  const dt = e.clipboardData;
  if (!dt) return [];

  const imageFiles: File[] = [];

  // 1. Check clipboardData.items
  if (dt.items && dt.items.length > 0) {
    for (let i = 0; i < dt.items.length; i++) {
      const item = dt.items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }
  }

  // 2. Fallback: check clipboardData.files (e.g. copied image file from Explorer/Finder)
  if (imageFiles.length === 0 && dt.files && dt.files.length > 0) {
    for (let i = 0; i < dt.files.length; i++) {
      const f = dt.files[i];
      if (f.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(f.name)) {
        imageFiles.push(f);
      }
    }
  }

  return imageFiles;
}

/**
 * חילוץ תמונות מאירוע הדבקה (Ctrl + V או תפריט הדבק בנייד) מהלוח (Clipboard)
 */
export async function extractImagesFromClipboardEvent(
  e: ClipboardEvent | React.ClipboardEvent
): Promise<string[]> {
  const imageFiles = getRawImageFilesFromClipboardEvent(e);
  if (imageFiles.length > 0) {
    e.preventDefault();
    e.stopPropagation();

    const results: string[] = [];
    for (const file of imageFiles) {
      const processed = await processScreenshotFile(file);
      results.push(processed);
    }
    return results;
  }

  // Fallback: check for HTML data with embedded base64 or text containing data URL
  const dt = 'clipboardData' in e ? e.clipboardData : null;
  if (dt) {
    const html = dt.getData('text/html');
    if (html) {
      const match = html.match(/src=["'](data:image\/[a-zA-Z0-9+.-]+;base64,[^"']+)["']/i);
      if (match && match[1]) {
        e.preventDefault();
        e.stopPropagation();
        return [match[1]];
      }
    }

    const text = dt.getData('text/plain');
    if (text && text.trim().startsWith('data:image/')) {
      e.preventDefault();
      e.stopPropagation();
      return [text.trim()];
    }
  }

  return [];
}

/**
 * קריאה יזומה של תמונה מהלוח בלחיצת כפתור (תמיכה מלאה במחשב ובמכשירים ניידים)
 */
export async function readImagesFromSystemClipboard(): Promise<string[]> {
  const results: string[] = [];

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.read) {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const processed = await processScreenshotFile(blob);
          results.push(processed);
        } else if (item.types.includes('text/html')) {
          try {
            const htmlBlob = await item.getType('text/html');
            const htmlText = await htmlBlob.text();
            const match = htmlText.match(/src=["'](data:image\/[a-zA-Z0-9+.-]+;base64,[^"']+)["']/i);
            if (match && match[1]) {
              results.push(match[1]);
            }
          } catch {
            // ignore html read error
          }
        }
      }
    } catch {
      // Permission restricted or gesture required
    }
  }

  // Fallback: check clipboard text if it contains a data URL
  if (results.length === 0 && typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().startsWith('data:image/')) {
        results.push(text.trim());
      }
    } catch {
      // ignore text read error
    }
  }

  if (results.length > 0) {
    return results;
  }

  throw new Error('לא זוהתה תמונה ישירה בלוח');
}
