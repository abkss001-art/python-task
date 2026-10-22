import random
import re
from datetime import datetime, timedelta
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "https://cargo.preprod.digital.idf.il/ords/r/atal/cargo"

# טוען אוטומטית את החיבור השמור שלך בכל הרצה
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "storage_state": "auth.json"
    }

def test_create_new_vehicle_request(page: Page) -> None:
    # 1. כניסה ישירה למערכת (כבר מחובר!)
    page.goto(BASE_URL)

    used_reasons = set()

    # לולאה ליצירת 3 בקשות שונות ברצף
    for i in range(3):
        # 2. לחיצה על "+ בקשה חדשה"
        new_req_btn = page.get_by_role("button", name="בקשה חדשה")
        new_req_btn.wait_for(state="visible", timeout=30000)
        new_req_btn.click()

        # בדיקה אם החלונית בתוך iframe או ישירות בדף
        page.wait_for_timeout(1500)
        if page.locator("iframe").count() > 0:
            modal = page.frame_locator("iframe").first
        else:
            modal = page

        start_input = modal.locator("#P20_START_DATE_input")
        start_input.wait_for(state="visible", timeout=15000)

        # חישוב תאריכים עתידיים מתגלגלים ואקראיים (מהיום קדימה)
        today = datetime.now()
        start_date = today + timedelta(days=random.randint(1, 7))
        end_date = start_date + timedelta(days=random.randint(1, 5))

        # 3. בחירת "מתאריך"
        start_input.click()
        cal_dialog = page.locator(".ui-dialog-datepicker:visible")
        cal_dialog.wait_for(state="visible", timeout=10000)
        if start_date.month != today.month:
            cal_dialog.locator("button.a-DatePicker-nav--next").click()
        cal_dialog.locator("td:not(.is-disabled)").filter(
            has_text=re.compile(rf"^\s*{start_date.day}\s*$")
        ).first.click()
        cal_dialog.locator("button.a-DatePicker--close").click()

        # 4. בחירת "עד תאריך"
        modal.locator("#P20_END_DATE_input").click()
        cal_dialog = page.locator(".ui-dialog-datepicker:visible")
        cal_dialog.wait_for(state="visible", timeout=10000)
        if end_date.month != start_date.month:
            cal_dialog.locator("button.a-DatePicker-nav--next").click()
        cal_dialog.locator("td:not(.is-disabled)").filter(
            has_text=re.compile(rf"^\s*{end_date.day}\s*$")
        ).first.click()
        cal_dialog.locator("button.a-DatePicker--close").click()

        # 5. קריאת כל האפשרויות מהרשימה הנפתחת (סיבה) ובחירת אופציה אקראית שונה בכל פעם
        category_field = modal.locator("#P20_REQ_CATEGORY_ID")
        category_field.click()
        lov_items = page.locator(".a-IconList-item:visible")
        lov_items.first.wait_for(state="visible", timeout=10000)

        all_reasons = [
            item.get_attribute("data-id")
            for item in lov_items.all()
            if item.get_attribute("data-id")
        ]
        available_reasons = [r for r in all_reasons if r not in used_reasons]
        if not available_reasons:
            available_reasons = all_reasons

        chosen_reason = random.choice(available_reasons)
        used_reasons.add(chosen_reason)
        page.locator(f".a-IconList-item:visible[data-id='{chosen_reason}']").first.click()

        # 6. מילוי מס' מושבים אקראי בטווח 2 עד 8
        random_seats = str(random.randint(2, 8))
        seats = modal.locator("#P20_MIN_SEATS")
        seats.click()
        seats.fill(random_seats)

        # 7. שליחת הבקשה ואישור
        modal.get_by_role("button", name="שלח בקשה").click()

        confirm_btn = page.get_by_role("button", name="אישור")
        confirm_btn.wait_for(state="visible", timeout=10000)
        confirm_btn.click()

        # המתנה לסגירת החלונית ולרענון הדף לפני האיטרציה הבאה
        expect(page.locator("iframe")).to_be_hidden(timeout=15000)
        page.wait_for_timeout(2000)
        expect(new_req_btn).to_be_visible(timeout=15000)