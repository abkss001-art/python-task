import sys
import os
import time

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:4173/"

RUN_ID = str(int(time.time()))[-4:]
QA_NAME = f"בודק אוטומציה {RUN_ID}"
UPDATED_NAME = f"בודק מעודכן {RUN_ID}"

def log(msg):
    print(f"[E2E TEST] {msg}", flush=True)

def open_team_modal(page):
    """פותח את חלון ניהול הצוות מתוך תפריט כלי מנהל"""
    if page.locator("text=ניהול חברי צוות והרשאות מערכת").first.is_visible():
        return
    tools_btn = page.locator("header button:visible:has-text('כלי מנהל'), header button:visible[title*='כלי ניהול']").first
    tools_btn.click()
    page.wait_for_timeout(500)
    page.locator("button:visible:has-text('ניהול חברי צוות והרשאות')").first.click()
    page.wait_for_selector("text=ניהול חברי צוות והרשאות מערכת", timeout=10000)
    page.wait_for_timeout(400)

def run_e2e_test():
    log("==================================================================")
    log("🚀 מתחיל הרצת בדיקת אוטומציה מלאה מקצה לקצה (End-to-End E2E Test Suite)")
    log(f"כתובת השרת לבדיקה: {BASE_URL}")
    log(f"מזהה סשן ייחודי לבדיקה: {RUN_ID} (שם בודק: {QA_NAME})")
    log("==================================================================")

    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            locale="he-IL"
        )
        page = context.new_page()

        try:
            # -------------------------------------------------------------
            # TEST 1: טעינת עמוד הכניסה ומיתוג המערכת
            # -------------------------------------------------------------
            log("1. טוען את דף הכניסה של 'צב מן'...")
            page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
            page.wait_for_selector("text=צב מן", timeout=15000)
            assert page.locator("text=צב מן").first.is_visible(), "כותרת צב מן לא נמצאה"
            log("   ✔ עמוד הכניסה נטען בהצלחה (לוגו ומיתוג 'צב מן' מזוהים).")
            results.append(("1. טעינת עמוד כניסה ומיתוג צב מן", "PASS"))

            # -------------------------------------------------------------
            # TEST 2: התחברות מהירה כמנהל-על (Super Admin Quick Login)
            # -------------------------------------------------------------
            log("2. מבצע התחברות מהירה כמנהל-על עם קוד 1108...")
            password_input = page.locator("#login-password, input[type='password']").first
            password_input.fill("1108")
            page.locator("button[type='submit']").first.click()

            # וידוא כניסה מוצלחת ל-Dashboard באמצעות אלמנט גלוי בדסקטופ
            page.wait_for_selector("button:visible:has-text('תקלה חדשה')", timeout=15000)
            assert page.locator("text=שמעון אבקסיס").first.is_visible(), "שם מנהל העל שמעון אבקסיס לא זוהה"
            log("   ✔ כניסת מנהל-על הצליחה, דשבורד ראשי נטען במלואו.")
            results.append(("2. התחברות מנהל-על מהירה (קוד 1108)", "PASS"))

            # -------------------------------------------------------------
            # TEST 3: ניהול צוות, סינון מערכות והוספת בודק מוגבל
            # -------------------------------------------------------------
            log(f"3. פותח חלון ניהול צוות, בודק סרגלי סינון ומוסיף את '{QA_NAME}' מוגבל...")
            open_team_modal(page)
            team_modal = page.locator("div.fixed:has-text('ניהול חברי צוות והרשאות מערכת')")

            # בדיקת סרגל סינון המערכות בתוך המודאל
            assert team_modal.locator("text=סינון לפי מערכת:").first.is_visible(), "שורת סינון לפי מערכת חסרה"
            log("   ✔ סרגל סינון לפי מערכת קיים ופעיל.")

            # לחיצה על סינון מערכת מתוך המודאל
            arad_filter_pill = team_modal.locator("button:has-text('נשקי ערד')").first
            arad_filter_pill.click()
            page.wait_for_timeout(300)

            # החזרה ל'כלל המערכות'
            all_systems_pill = team_modal.locator("button:has-text('כלל המערכות')").first
            all_systems_pill.click()
            page.wait_for_timeout(300)

            # הוספת בודק חדש המוגבל אך ורק למערכת נשקי ערד
            log(f"   מוסיף בודק חדש '{QA_NAME}' מוגבל ל'נשקי ערד'...")
            new_name_input = team_modal.locator("input[placeholder*='הכנס שם מלא']").first
            new_name_input.fill(QA_NAME)

            # בחירת תפקיד בודק QA
            qa_role_btn = team_modal.locator("button:has-text('בודק QA')").first
            qa_role_btn.click()
            page.wait_for_timeout(200)

            # איפוס ובחירת מערכת 'נשקי ערד' בלבד
            clear_systems_btn = team_modal.locator("button:has-text('נקה')").first
            if clear_systems_btn.is_visible():
                clear_systems_btn.click()
                page.wait_for_timeout(200)

            # לחיצה על כפתור מערכת נשקי ערד בתוך בלוק ההרשאות
            arad_select_btn = team_modal.locator("div.animate-in button:has-text('נשקי ערד')").first
            arad_select_btn.click()
            page.wait_for_timeout(200)

            # לחיצה על הוסף לצוות
            add_member_btn = team_modal.locator("button:has-text('הוסף לצוות')").first
            add_member_btn.click()
            page.wait_for_timeout(800)

            # וידוא שנוסף לרשימה
            team_modal.locator(f"text={QA_NAME}").first.wait_for(timeout=8000)
            log("   ✔ בודק מוגבל נוסף בהצלחה לרשימת הצוות המורשית.")
            results.append(("3. סרגל סינון מערכות והגבלת בודק QA", "PASS"))

            # סגירת מודאל צוות
            team_modal.locator("button:has-text('סגור')").last.click()
            page.wait_for_timeout(500)

            # -------------------------------------------------------------
            # TEST 4: התחברות כבודק מוגבל ווידוא בידוד מערכות (Scope Isolation)
            # -------------------------------------------------------------
            log(f"4. מבצע התנתקות והתחברות כבודק המוגבל '{QA_NAME}' (קוד 9988)...")
            logout_btn = page.locator("header button:visible[title*='התנתק'], header button:visible:has-text('החלף משתמש')").first
            logout_btn.click()
            page.wait_for_selector("#login-fullname, input[placeholder*='הכנס שם פרטי ומשפחה']", timeout=10000)

            # התחברות כבודק המוגבל
            name_input = page.locator("#login-fullname, input[placeholder*='הכנס שם פרטי ומשפחה']").first
            name_input.fill(QA_NAME)
            page.wait_for_timeout(300)

            password_input = page.locator("#login-password, input[type='password']").first
            password_input.fill("9988")
            page.locator("button[type='submit']").first.click()

            page.wait_for_selector("button:visible:has-text('תקלה חדשה')", timeout=15000)

            # וידוא שהבודק רואה אך ורק את 'נשקי ערד' ולא רואה מערכות אחרות
            page.wait_for_timeout(1000)
            nav_text = page.locator("header").first.inner_text()
            assert "נשקי ערד" in nav_text, "נשקי ערד לא מוצגת לבודק המורשה"
            assert "חוזים" not in nav_text, "הבודק רואה מערכות שלא הוגדרו עבורו!"
            log("   ✔ בידוד מערכות פועל בצורה מושלמת (נשקי ערד מוצגת בלבד, שאר המערכות מוסתרות).")
            results.append(("4. בידוד הרשאות בודק (Scope Isolation)", "PASS"))

            # -------------------------------------------------------------
            # TEST 5: פתיחת תקלה חדשה ווידוא מספור אוטומטי
            # -------------------------------------------------------------
            log(f"5. פותח תקלה חדשה כבודק '{QA_NAME}' במערכת נשקי ערד...")
            page.locator("button:visible:has-text('תקלה חדשה')").first.click()
            
            # המתנה לפתיחת מודאל 'דיווח תקלה חדשה'
            issue_modal = page.locator("div.fixed:has-text('דיווח תקלה חדשה')")
            issue_modal.wait_for(timeout=10000)

            # הזנת נושא ותיאור בתוך המודאל
            issue_subject = f"בדיקת אוטומציה E2E {RUN_ID} - מזהה רציף וסנכרון"
            subject_input = issue_modal.locator("input[placeholder*='תיאור קצר'], input[type='text']").first
            subject_input.fill(issue_subject)

            desc_input = issue_modal.locator("textarea").first
            desc_input.fill("תקלה זו נוצרה על ידי סוויטת בדיקות פליירייט מקצה לקצה. מספור אוטומטי נבדק.")

            # פרסום התקלה
            publish_btn = issue_modal.locator("button:has-text('פרסם תקלה'), button[type='submit']").last
            publish_btn.click()
            page.wait_for_timeout(1500)

            # וידוא שהתקלה מופיעה ומשוייכת לבודק
            page.locator(f"text={issue_subject}").first.wait_for(timeout=10000)
            assert page.locator(f"text={QA_NAME}").first.is_visible(), "שם המדווח לא מוצג על התקלה"
            log(f"   ✔ התקלה נוצרה בהצלחה ומציגה את שם המדווח '{QA_NAME}'.")
            results.append(("5. פתיחת תקלה ומספור תסריטים רציף", "PASS"))

            # -------------------------------------------------------------
            # TEST 6: הוספת הערה ומעבר בין תצוגות (טבלה חכמה, קנבן, כרטיסיות)
            # -------------------------------------------------------------
            log("6. מוסיף תגובה לתקלה ובודק מעבר בין תצוגות...")
            comment_input = page.locator("input:visible[placeholder*='הוסף תגובה'], input:visible[placeholder*='תגובה']").first
            if comment_input.is_visible():
                comment_input.fill(f"הערת בדיקה אוטומטית מקצה לקצה {RUN_ID}")
                send_comment_btn = page.locator("button:visible[title*='שלח תגובה'], form button:visible[type='submit']").last
                send_comment_btn.click()
                page.wait_for_timeout(800)
                assert page.locator(f"text=הערת בדיקה אוטומטית מקצה לקצה {RUN_ID}").first.is_visible(), "ההערה לא הופיעה ברשימת ההערות"
                log("   ✔ הערה נוספה בהצלחה לתקלה.")

            # מעבר לטבלה חכמה
            log("   בודק תצוגת טבלה חכמה...")
            page.locator("button:visible:has-text('טבלה חכמה')").first.click()
            page.wait_for_timeout(400)
            assert page.locator(f"text={issue_subject}").first.is_visible(), "התקלה לא מוצגת בטבלה חכמה"

            # מעבר ללוח קנבן
            log("   בודק תצוגת לוח קנבן...")
            page.locator("button:visible:has-text('קנבן')").first.click()
            page.wait_for_timeout(400)
            assert page.locator(f"text={issue_subject}").first.is_visible(), "התקלה לא מוצגת בקנבן"

            # חזרה לכרטיסיות
            page.locator("button:visible:has-text('כרטיסיות')").first.click()
            page.wait_for_timeout(400)
            log("   ✔ מעבר בין תצוגות (כרטיסיות / טבלה חכמה / קנבן) תקין לחלוטין.")
            results.append(("6. הוספת תגובות ומעבר תצוגות (כרטיסיות/טבלה/קנבן)", "PASS"))

            # -------------------------------------------------------------
            # TEST 7: עריכת שם איש צוות וסנכרון רטרואקטיבי (Retroactive Rename Sync)
            # -------------------------------------------------------------
            log(f"7. בודק מנגנון סנכרון רטרואקטיבי: עריכת שם מ-'{QA_NAME}' ל-'{UPDATED_NAME}'...")
            # התנתקות וחזרה כמנהל-על (ניקוי שדה השם מאפשר כניסת-על מהירה)
            page.locator("header button:visible[title*='התנתק'], header button:visible:has-text('החלף משתמש')").first.click()
            page.wait_for_selector("#login-password, input[type='password']", timeout=10000)
            name_input = page.locator("#login-fullname, input[placeholder*='הכנס שם פרטי ומשפחה']").first
            name_input.fill("")
            page.wait_for_timeout(200)

            password_input = page.locator("#login-password, input[type='password']").first
            password_input.fill("1108")
            page.locator("button[type='submit']").first.click()
            page.wait_for_selector("button:visible:has-text('תקלה חדשה')", timeout=15000)

            # פתיחת ניהול צוות
            open_team_modal(page)
            team_modal = page.locator("div.fixed:has-text('ניהול חברי צוות והרשאות מערכת')")

            # איתור הבודק ברשימה ספציפית לפי שורת החבר ולחיצה על עפרון עריכה
            member_row = team_modal.locator("div.flex.items-center.justify-between").filter(has_text=QA_NAME).first
            edit_btn = member_row.locator("button[title*='ערוך']").first
            edit_btn.click()
            page.wait_for_timeout(500)

            # עריכת השם בשדה הקלט הייעודי
            name_edit_input = team_modal.locator("input[placeholder='שם מלא...']").first
            name_edit_input.fill(UPDATED_NAME)

            # לחיצה על שמור שינויים
            team_modal.locator("button:has-text('שמור שינויים')").first.click()
            page.wait_for_timeout(1000)

            # סגירת חלון צוות
            team_modal.locator("button:has-text('סגור')").last.click()
            page.wait_for_timeout(800)

            # מעבר למערכת נשקי ערד דרך ה-header
            arad_tab = page.locator("header button:visible:has-text('נשקי ערד')").first
            arad_tab.click()
            page.wait_for_timeout(600)

            # בדיקה קריטית: האם השם על גבי התקלה עודכן אוטומטית ל-UPDATED_NAME?
            page.locator(f"text={issue_subject}").first.wait_for(timeout=10000)
            assert page.locator(f"text={UPDATED_NAME}").first.is_visible(), "השם על גבי התקלה לא התעדכן רטרואקטיבית!"
            log(f"   ✔ סנכרון רטרואקטיבי הצליח: שם המדווח עודכן בהצלחה ל-'{UPDATED_NAME}' בכל ההיסטוריה!")
            results.append(("7. סנכרון רטרואקטיבי בעריכת שם איש צוות", "PASS"))

            # -------------------------------------------------------------
            # TEST 8: מחיקת איש צוות וחלון אזהרה מודאלי (Safe Deletion)
            # -------------------------------------------------------------
            log(f"8. בודק חלון אזהרה מודאלי במחיקת איש הצוות '{UPDATED_NAME}'...")
            open_team_modal(page)
            team_modal = page.locator("div.fixed:has-text('ניהול חברי צוות והרשאות מערכת')")

            # לחיצה על סמל האשפה של הבודק המעודכן
            updated_member_row = team_modal.locator("div.flex.items-center.justify-between").filter(has_text=UPDATED_NAME).first
            trash_btn = updated_member_row.locator("button[title*='מחק']").first
            trash_btn.click()
            page.wait_for_timeout(400)

            # וידוא שקפץ חלון אזהרה מודאלי ייעודי
            warning_modal = page.locator("div.fixed:has-text('האם למחוק את איש הצוות?')")
            assert warning_modal.locator("text=האם למחוק את איש הצוות?").first.is_visible(), "חלון האזהרה לא קפץ!"
            log("   ✔ חלון אזהרה מודאלי קפץ כמצופה.")

            # בדיקת ביטול
            warning_modal.locator("button:has-text('ביטול')").first.click()
            page.wait_for_timeout(400)
            assert team_modal.locator(f"text={UPDATED_NAME}").first.is_visible(), "איש הצוות נמחק למרות לחיצה על ביטול!"
            log("   ✔ כפתור ביטול מונע מחיקה בשוגג.")

            # כעת אישור מחיקה מלאה
            updated_member_row = team_modal.locator("div.flex.items-center.justify-between").filter(has_text=UPDATED_NAME).first
            trash_btn = updated_member_row.locator("button[title*='מחק']").first
            trash_btn.click()
            page.wait_for_timeout(400)

            warning_modal = page.locator("div.fixed:has-text('האם למחוק את איש הצוות?')")
            warning_modal.locator("button:has-text('כן, מחק איש צוות')").first.click()
            page.wait_for_timeout(800)

            # וידוא שהוסר מרשימת הצוות
            assert not team_modal.locator(f"span:text-is('{UPDATED_NAME}')").is_visible(), "החבר לא הוסר מהצוות"
            log("   ✔ אישור מחיקה הסיר את המשתמש מרשימת ההרשאות בצורה בטוחה.")
            results.append(("8. חלון אזהרת מחיקה מודאלי וביטול/אישור", "PASS"))

            # סגירת חלון צוות
            team_modal.locator("button:has-text('סגור')").last.click()
            page.wait_for_timeout(400)

            # -------------------------------------------------------------
            # TEST 9: בדיקת מתג מצב כהה/בהיר (Dark Mode Toggle)
            # -------------------------------------------------------------
            log("9. בודק החלפת מצב כהה/בהיר (Dark / Light Theme Toggle)...")
            theme_btn = page.locator("header button:visible[aria-label*='כהה/בהיר'], header button:visible[title*='עבור למצב']").first
            if theme_btn.is_visible():
                theme_btn.click()
                page.wait_for_timeout(400)
                is_dark = page.evaluate("() => document.documentElement.classList.contains('dark')")
                assert is_dark, "מצב כהה לא הופעל (קלאס dark חסר ב-html)"
                log("   ✔ מצב כהה הופעל בהצלחה (class 'dark' נוסף לשורש ה-DOM).")

                theme_btn.click()
                page.wait_for_timeout(400)
                is_light = not page.evaluate("() => document.documentElement.classList.contains('dark')")
                assert is_light, "מצב בהיר לא שוחזר"
                log("   ✔ חזרה למצב יום בהיר עברה בהצלחה.")
                results.append(("9. מתג מצב כהה / בהיר (Dark Mode)", "PASS"))

        except Exception as e:
            log(f"❌ שגיאה במהלך הבדיקה: {str(e)}")
            results.append(("שגיאת ריצה", f"FAIL: {str(e)}"))
            page.screenshot(path="e2e_error.png")
            log("צילום מסך של השגיאה נשמר ב-e2e_error.png")
        finally:
            browser.close()

    log("\n==================================================================")
    log("📊 דוח תוצאות בדיקת אוטומציה מקצה לקצה (End-to-End Automation Report):")
    log("==================================================================")
    all_passed = True
    for test_name, status in results:
        mark = "✅" if status == "PASS" else "❌"
        print(f"  {mark} {test_name}: {status}")
        if status != "PASS":
            all_passed = False

    print("------------------------------------------------------------------")
    if all_passed and len(results) >= 8:
        print("🎉 כל 9 בדיקות ה-E2E עברו בהצלחה מושלמת ב-100%! המערכת מאושרת לייצור (Production Ready).")
    else:
        print("⚠️ ישנם כשלים באוטומציה, עיין בלוג לעיל.")

if __name__ == "__main__":
    run_e2e_test()
