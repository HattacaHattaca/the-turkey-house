/* The Turkey House — order tracker (Google Apps Script). Paste into a Google Sheet's Apps Script editor.
   Setup steps are in order-tracker/README.md. Change PIN below before deploying. */
const PIN = "CHANGE-ME-1234";           // the dashboard password Brother Love types in
const SHEET = "Orders";
const HEAD = ["Time","Code","Name","Phone","Pickup","Items","Total","Payment","Car","Notes","Status"];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEAD);
  return sh;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clip_(v, n) { return String(v == null ? "" : v).slice(0, n); }

function doPost(e) {
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var b = JSON.parse(e.postData.contents), sh = sheet_();
    if (b.action === "create") {                       // called by the public website
      var o = b.order || {};
      if (!o.code || !o.name || !o.phone) return out_({ error: "bad" });
      sh.appendRow([new Date(), clip_(o.code, 12), clip_(o.name, 80), clip_(o.phone, 30), clip_(o.pickup, 60),
        clip_(o.items, 800), Number(o.total) || 0, clip_(o.payment, 20), clip_(o.car, 80), clip_(o.notes, 400), "New"]);
      return out_({ ok: true });
    }
    if (b.pin !== PIN) { Utilities.sleep(1500); return out_({ error: "auth" }); }   // everything below needs the PIN
    if (b.action === "list") {
      var n = sh.getLastRow(); if (n < 2) return out_({ orders: [] });
      var rows = sh.getRange(Math.max(2, n - 199), 1, Math.min(200, n - 1), HEAD.length).getValues();
      var orders = rows.map(function (r) { var o = {}; HEAD.forEach(function (h, i) { o[h.toLowerCase()] = r[i]; }); return o; }).reverse();
      return out_({ orders: orders });
    }
    if (b.action === "status") {
      var codes = sh.getRange(2, 2, Math.max(1, sh.getLastRow() - 1), 1).getValues();
      for (var i = codes.length - 1; i >= 0; i--) if (codes[i][0] === b.code) { sh.getRange(i + 2, 11).setValue(clip_(b.status, 20)); return out_({ ok: true }); }
      return out_({ error: "notfound" });
    }
    return out_({ error: "bad" });
  } catch (err) { return out_({ error: "server" }); }
  finally { lock.releaseLock(); }
}
function doGet() { return out_({ ok: true, service: "turkey-house-orders" }); }
