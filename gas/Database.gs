const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');

function getWorker(workerId) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('workers');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(workerId).trim()) {
      return { worker_id: data[i][0], name: data[i][1], department: data[i][2], active: data[i][3] };
    }
  }
  return null;
}

function getDailyCount(workerId, dateStr) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('daily_quota');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(workerId) && String(data[i][1]) === dateStr) {
      return Number(data[i][2]);
    }
  }
  return 0;
}

function incrementDailyCount(workerId, dateStr) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('daily_quota');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(workerId) && String(data[i][1]) === dateStr) {
      sheet.getRange(i + 1, 3).setValue(Number(data[i][2]) + 1);
      return;
    }
  }
  sheet.appendRow([workerId, dateStr, 1]);
}

function logUsage(workerId, name, language, question, responsePreview) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('usage_log');
  const timestamp = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss');
  sheet.appendRow([timestamp, workerId, name, language, question, responsePreview]);
}
