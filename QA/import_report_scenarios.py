import json
import base64
import os
import time

BASE_DIR = r"c:\Users\abkss\Desktop\לימודים\GitHub"
DB_FILE = os.path.join(r"c:\Users\abkss\Desktop\לימודים\GitHub\QA", "data", "std-realtime-db.json")

# Helper to read image as base64 data url
def get_image_base64(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "rb") as f:
            data = f.read()
            b64 = base64.b64encode(data).decode("utf-8")
            return f"data:image/png;base64,{b64}"
    return None

# Load images
img_admin = get_image_base64("ss_01_admin.png")
img_ravshatz = get_image_base64("ss_02_ravshatz.png")
img_existing_fault = get_image_base64("ss_03_existing_fault.png")
img_fault_modal = get_image_base64("ss_04_fault_modal.png")
img_faults_tab = get_image_base64("ss_05_faults_tab.png")
img_technician = get_image_base64("ss_06_technician.png")
img_contact = get_image_base64("ss_07_contact.png")
img_inspection = get_image_base64("ss_08_inspection.png")
img_exam_dialog = get_image_base64("ss_09_exam_dialog.png")
img_dispatch = get_image_base64("ss_10_dispatch.png")

print(f"Loaded screenshots: admin={bool(img_admin)}, ravshatz={bool(img_ravshatz)}, tech={bool(img_technician)}, dispatch={bool(img_dispatch)}")

# Test cases definition from HTML report and CSV
raw_scenarios = [
    {
        "id": "TC-01",
        "num": "1",
        "category": "ניהול והרשאות",
        "name": "אימות זהות והרשאת משתמש (Role 99)",
        "scenario": "בדיקת נתוני המשתמש המחובר, תפקיד ניהולי והרשאות מערכת מלאות",
        "actual": "משתמש מאומת: שמעון אבקסיס | הרשאת על (Super-User - Role 99)",
        "duration": "1.08s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_admin
    },
    {
        "id": "TC-02",
        "num": "2",
        "category": "ניהול והרשאות",
        "name": "מסך ניהול מרכזי ומודולים ראשיים",
        "scenario": "בדיקת דף בחירת המודולים, כותרת המערכת וקיום כרטיסי רבש\"צ, טכנאי ומוקד",
        "actual": "כל שלושת המודולים מוצגים ונגישים בהצלחה",
        "duration": "3.36s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_admin
    },
    {
        "id": "TC-03",
        "num": "3",
        "category": "ניהול והרשאות",
        "name": "חסינות ניתובים ודפי שגיאה",
        "scenario": "ניסיון גלישה לנתיב שאינו קיים ווידוא שהאפליקציה מטפלת בו ללא קריסת SPA",
        "actual": "האפליקציה מטפלת בנתיב שגוי בצורה חלקה ומאובטחת",
        "duration": "2.22s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_admin
    },
    {
        "id": "TC-04",
        "num": "4",
        "category": "מודול רבש\"צ",
        "name": "טעינת מצבת נשקים מלאה",
        "scenario": "אימות טעינת כלל כלי הנשק מסוג ערד המשויכים ליישוב",
        "actual": "נטענו בהצלחה 27 כלי נשק מסוג ערד במצבת היישוב",
        "duration": "3.92s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_ravshatz
    },
    {
        "id": "TC-05",
        "num": "5",
        "category": "מודול רבש\"צ",
        "name": "עמידה בהנחיות ב\"ם - הצפנת שמות יישובים",
        "scenario": "וידוא איסור הצגת שמות יישובים בגרסה האזרחית ושימוש בלעדי בקוד היררכי (2.16)",
        "actual": "עמידה מלאה בדרישות ב\"ם (סעיף 7.3) - קוד יישוב מוצפן בלבד ללא חשיפת שמות",
        "duration": "0.01s",
        "bam": "תקין (קוד 2.16)",
        "severity": "קריטית",
        "image": img_ravshatz
    },
    {
        "id": "TC-06",
        "num": "6",
        "category": "מודול רבש\"צ",
        "name": "מנוע חיפוש וסינון נשקים לפי מסט\"ב",
        "scenario": "בדיקת סינון בזמן אמת של רשימת הנשקים לפי מספר מסט\"ב ואיפוס החיפוש",
        "actual": "סינון מדויק – כרטיס בודד זוהה מיד, ואיפוס החזיר את כלל המצאי",
        "duration": "1.81s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_ravshatz
    },
    {
        "id": "TC-07",
        "num": "7",
        "category": "מודול רבש\"צ",
        "name": "חיפוש שלילי (מסט\"ב שאינו קיים)",
        "scenario": "הזנת מספר מסט\"ב שאינו קיים במערכת ווידוא קבלת תוצאה ריקה ללא קריסות",
        "actual": "רשימה ריקה הוצגה כהלכה עבור מסט\"ב לא קיים",
        "duration": "1.50s",
        "bam": "תקין",
        "severity": "נמוכה",
        "image": img_ravshatz
    },
    {
        "id": "TC-08",
        "num": "8",
        "category": "מודול רבש\"צ",
        "name": "זרימת כלי עם תקלה קיימת (מעקב וטיפול)",
        "scenario": "פתיחת חלונית ייעודית לנשק עם תקלה פתוחה ווידוא הצגת פרטי התקלה ואפשרות ביטול/דיווח",
        "actual": "חלונית ניהול תקלה פתוחה מוצגת בהצלחה כנדרש בסעיף 5.1",
        "duration": "5.16s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_existing_fault
    },
    {
        "id": "TC-09",
        "num": "9",
        "category": "מודול רבש\"צ",
        "name": "ולידציה וחסימת שליחת דיווח ריק",
        "scenario": "וידוא שכפתור 'שלח דיווח' מושבת כל עוד המשתמש לא בחר תקלה מתוך הקטלוג",
        "actual": "מנגנון הולידציה חוסם דיווח ללא בחירת תקלה כהלכה (Disabled State)",
        "duration": "1.45s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_fault_modal
    },
    {
        "id": "TC-10",
        "num": "10",
        "category": "מודול רבש\"צ",
        "name": "עמידה בב\"ם - קטלוג תקלות סגור ומאושר",
        "scenario": "וידוא שהתקלות נבחרות מקטלוג צה\"ל סגור ללא חשיפת שדות חופשיים אסורים",
        "actual": "זוהו 7 תקלות מאושרות בקטלוג (דוגמה: חליצה, הפלטה, דריכה)",
        "duration": "0.66s",
        "bam": "תקין (סגור)",
        "severity": "קריטית",
        "image": img_fault_modal
    },
    {
        "id": "TC-11",
        "num": "11",
        "category": "מודול רבש\"צ",
        "name": "סינון ובחירת תקלה מקטלוג והפעלת טופס",
        "scenario": "בדיקת חיפוש פנימי בתוך קטלוג התקלות, בחירת תקלה והפיכת כפתור השליחה לפעיל",
        "actual": "נבחרה תקלה מהקטלוג וכפתור השליחה הופעל בהצלחה (Enabled)",
        "duration": "1.85s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_fault_modal
    },
    {
        "id": "TC-12",
        "num": "12",
        "category": "מודול רבש\"צ",
        "name": "דשבורד תקלות ותיאומים כולל סטטוסים",
        "scenario": "אימות מבנה דף התקלות היישובי, סטטוסי ביקור טכנאי וריכוז שגרת אחזקה מונעת",
        "actual": "כל שלושת המקטעים מוצגים כהלכה ומסונכרנים מול נתוני המערכת",
        "duration": "5.92s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_faults_tab
    },
    {
        "id": "TC-13",
        "num": "13",
        "category": "מודול טכנאי",
        "name": "לוח משימות יומי ומדדי כשירות גזרתיים",
        "scenario": "בדיקת כניסה לממשק הטכנאי, בדיקת מדדי כשירות ותקלות גזרתיות",
        "actual": "לוח המשימות נטען ומציג 27 כלי נשק כשירים ו-0 תקלות פתוחות",
        "duration": "8.04s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_technician
    },
    {
        "id": "TC-14",
        "num": "14",
        "category": "מודול טכנאי",
        "name": "יצירת קשר מהירה ועמידה בב\"ם",
        "scenario": "אימות לחצני התקשרות ו-SMS לרבש\"צ, ווידוא הצגת קוד יישוב בלבד (2.16) ללא חשיפת שם היישוב",
        "actual": "דרישות ב\"ם מתקיימות במלואן: כפתורי חיוג ו-SMS פעילים עם קוד יישוב מוצפן",
        "duration": "6.76s",
        "bam": "תקין (2.16 בלבד)",
        "severity": "קריטית",
        "image": img_contact
    },
    {
        "id": "TC-15",
        "num": "15",
        "category": "מודול טכנאי",
        "name": "ממשק בחינה יזומה שנתית ומצבת כלים",
        "scenario": "בדיקת טעינת מסך הבחינה השנתית היזומה של כלי הנשק ביישוב, מונה התקדמות ורשימת כלים",
        "actual": "מסך הבחינה הפעילה נטען בהצלחה ומכיל 28 כלים לבדיקה (0% התקדמות התחלתית)",
        "duration": "1.88s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_inspection
    },
    {
        "id": "TC-16",
        "num": "16",
        "category": "מודול טכנאי",
        "name": "חלונית בדיקת ציוד פרטנית לכלי",
        "scenario": "אימות חלונית סימון תוצאת בחינה לכלי בודד עם אפשרויות קטלוגיות סגורות (תקין / תקלה)",
        "actual": "חלונית הבדיקה נפתחת ומציגה את האפשרויות הסגורות כנדרש בסעיף 5.2",
        "duration": "2.15s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_exam_dialog
    },
    {
        "id": "TC-17",
        "num": "17",
        "category": "מודול טכנאי",
        "name": "אכיפת חובת בדיקה מלאה (אי-אפשרות שידור חלקי)",
        "scenario": "וידוא שהמערכת חוסמת שידור או סיום משימה ביישוב כל עוד לא כל המסט\"בים קיבלו סימון עדכני",
        "actual": "חוק עסקי נאכף: כפתור שידור למוקד חסום עד לסיום 100% מהכלים",
        "duration": "0.03s",
        "bam": "תקין",
        "severity": "קריטית",
        "image": img_exam_dialog
    },
    {
        "id": "TC-18",
        "num": "18",
        "category": "מודול מוקד",
        "name": "לוח בקרה משלח ומוני עבודה מרכזיים",
        "scenario": "בדיקת דשבורד מוקד, תצוגת חלוקת תקלות (פתוחות, בטיפול, ממתין לחלפים) ומצב גזרתי",
        "actual": "דשבורד המוקד פעיל ומציג מוני תקלות שבר ואחזקה מעודכנים",
        "duration": "2.97s",
        "bam": "תקין",
        "severity": "גבוהה",
        "image": img_dispatch
    },
    {
        "id": "TC-19",
        "num": "19",
        "category": "מודול מוקד",
        "name": "עמידה בהנחיות ב\"ם - מידור גזרתי במוקד",
        "scenario": "אימות שהמערכת מאכפת תצוגת גזרה בודדת וחוסמת חשיפת נתונים אגרגטיביים רוחביים בממשק האזרחי",
        "actual": "עמידה מלאה בהנחיית ב\"ם 7.2: הממשק האזרחי מבודד ואינו מרכז נתונים רוחביים",
        "duration": "0.02s",
        "bam": "תקין (ממודר)",
        "severity": "קריטית",
        "image": img_dispatch
    },
    {
        "id": "TC-20",
        "num": "20",
        "category": "תשתית ו-APIs",
        "name": "שלמות ומהירות תגובה של כלל קריאות ה-Backend",
        "scenario": "ביצוע תשאול ישיר של כלל ה-Endpoints המרכזיים במערכת, בדיקת סטטוס 200 ומדידת Latency",
        "actual": "כל 7 ה-APIs החזירו 200 OK בזמני תגובה ממוצעים הנמוכים מ-200ms",
        "duration": "0.66s",
        "bam": "תקין",
        "severity": "בינונית",
        "image": img_admin
    }
]

SYSTEM_NAME = "נישקי ערד דוח"

# Read DB
with open(DB_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)

# Ensure system exists
if "systems" not in db:
    db["systems"] = []
if SYSTEM_NAME not in db["systems"]:
    db["systems"].append(SYSTEM_NAME)

# Filter out old issues for this system if re-running
existing_issues = [iss for iss in db.get("issues", []) if iss.get("system") != SYSTEM_NAME]

now_ms = int(time.time() * 1000)

new_issues = []
for idx, s in enumerate(raw_scenarios):
    iss_id = f"std-e2e-report-{idx+1:02d}-{int(time.time())}"
    desc = (
        f"🔹 קטגוריה ומודול: {s['category']}\n"
        f"📋 תרחיש הבדיקה: {s['scenario']}\n"
        f"✅ תוצאה בפועל: {s['actual']}\n"
        f"⏱️ משך ריצה: {s['duration']}\n"
        f"🔒 עמידה בב\"ם: {s['bam']}"
    )
    
    screenshots = [s["image"]] if s["image"] else []
    
    issue_obj = {
        "id": iss_id,
        "system": SYSTEM_NAME,
        "testCaseId": s["num"],
        "platform": "מחשב",
        "severity": s["severity"],
        "subject": f"[{s['id']}] {s['name']}",
        "description": desc,
        "status": "נבדק תקין",
        "screenshots": screenshots,
        "comments": [
            {
                "id": f"c-e2e-{idx+1}",
                "author": "סוויטת בדיקות E2E מדור נחשון",
                "role": "qa",
                "text": f"בדיקה אוטומטית {s['id']} עברה בהצלחה מלאה (PASS). תוצאה: {s['actual']}. עמידה בב\"ם: {s['bam']}.",
                "createdAt": now_ms - (20 - idx) * 60000
            }
        ],
        "auditLog": [
            {
                "id": f"aud-e2e-{idx+1}",
                "actor": "שמעון אבקסיס מנהל מערכת",
                "action": f"ייבא דוח בדיקות קבלה E2E עבור תרחיש {s['id']}",
                "timestamp": now_ms - (20 - idx) * 60000
            }
        ],
        "createdBy": "שמעון אבקסיס (מנהל מערכת)",
        "createdAt": now_ms - (20 - idx) * 60000,
        "updatedAt": now_ms - (20 - idx) * 60000
    }
    new_issues.append(issue_obj)

db["issues"] = existing_issues + new_issues

with open(DB_FILE, "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully imported {len(new_issues)} scenarios into system '{SYSTEM_NAME}' in {DB_FILE}!")
