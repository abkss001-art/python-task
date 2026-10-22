import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution'; 
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    // טיפוס הדרגתי ל-50 משתמשים כדי לראות מתי השרת נחנק מפעולות כתיבה
    { duration: '3m', target: 50 }, 
    { duration: '30s', target: 50 }, 
    { duration: '15s', target: 0 },
  ]
};

// הכתובת שאליה נשלחים הנתונים לשמירה
const URL = 'https://haktzaot.preprod.digital.idf.il/ords/wwv_flow.accept?p_context=haktzaot/user-new-request/6482027115360';

export default function () {
  // בניית גוף הבקשה (ה-Payload) בדיוק כפי שהדפדפן שלח
  const payload = {
    p_flow_id: '50199',
    p_flow_step_id: '20',
    p_instance: '6482027115360',
    p_debug: '',
    p_request: 'CREATE',
    p_reload_on_submit: 'S',
    p_page_submission_id: 'Mjk0NDY5NDM2MDI3Njg0MTE2NDk2Mzk0ODE4MjcyODgxMjY4MjQz/ay7SSwedFZDTScRo46dE77hFy5kLGAONmhzHPqg8pDFuGLEXIpb-4gWUm7Um7suWslHyN5aGRCqeWVElyXV8sg',
    p_json: JSON.stringify({
      "pageItems": {
        "itemsToSubmit": [
          {"n":"P20_ID","v":"","ck":"9Mywfo9lm1W5aEaJ_ZKan5dIXAuzo1SZV1S7lDbAxoFkloLXUNz0jKp8VYCi1Tba3_RT4SDsphL4Kd-BCDmKvg"},
          {"n":"P20_USER_ID","v":"209","ck":"TFoFvU1nqhf2S3P4eRBsztMJBk7PUZXvfakCtzoaTzlILzQzqXgpSfQLLQdZivAqYhMOEF-Ng59mv56EA1nsEQ"},
          {"n":"P20_CURRENT_UVO_ID","v":"246","ck":"Auil9p0xApBvj1MXDW-0ODqHOeBGDtklKUoEpVoCixK2UBsFTcYySncsMNIHfNrbdochwJ6N5kJH1Y-07FRT4g"},
          {"n":"P20_STATUS_ID","v":"1","ck":"7o_-wHRxrVhW_jv7aPGOrbf3B2BDLlrQmBQOJJq6RD7vDVhNrNIVMYAXvSsK8XANKN5O2U0HPEQgexVvnrWOow"},
          {"n":"P20_START_DATE","v":"12/10/2026 15:00"},
          {"n":"P20_END_DATE","v":"14/10/2026 15:00"},
          {"n":"P20_REQ_CATEGORY_ID","v":"149"},
          {"n":"P20_MIN_SEATS","v":"5"},
          {"n":"P20_REQ_CATEGORY_NAME","v":"משימה"}
        ],
        "protected": "UDIwX0lEOlAyMF9VU0VSX0lEOlAyMF9DVVJSRU5UX1VWT19JRDpQMjBfU1RBVFVT.,X0lE/gZJCpPbnn-w-neLGH98ERVsFQ9P9cewL-vwYwjBRIDq_ADlq_pQYoBO2IH8-R86HxuAE6QHos7mWCl0v1sfSGw",
        "rowVersion": "",
        "formRegionChecksums": []
      },
      "salt": "294469436027684116496394818272881268243"
    })
  };

  const params = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': 'ORA_WWV_APP_50199=ORA_WWV-F2ch8YhRk83PqhKWERodyVVG; _ga=GA1.1.837745803.1787579758; _ga_BKDCTV66F4=GS2.1.s1788772463$o9$g1$t1788772464$j59$l0$h0'
    },
    timeout: '15s',
  };

  // שליחת בקשת POST שמכילה את נתוני הטופס
  const res = http.post(URL, payload, params);
  
  if (res.status !== 200) { 
    console.log(`\n>>> STOP! Server blocked us at ${exec.instance.vusActive} users with error ${res.status} <<<\n`);
    exec.test.abort('Server limit reached. Aborting test.');
  }

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(5);
}

export function handleSummary(data) {
  return {
    "cargo-load-report.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}