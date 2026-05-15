function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action, worker_id, name, message, lang } = body;
    if (action === 'validate') return handleValidate(worker_id, name);
    if (action === 'chat') return handleChat(worker_id, name, message, lang || 'zh');
    return jsonResponse({ ok: false, error: 'unknown_action' });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'server_error', detail: err.message });
  }
}

function handleValidate(workerId, name) {
  const worker = getWorker(workerId);
  if (!worker || worker.active !== 'Y') return jsonResponse({ ok: false, error: 'not_found' });
  if (worker.name.trim() !== String(name).trim()) return jsonResponse({ ok: false, error: 'name_mismatch' });
  const today = getTodayStr();
  const count = getDailyCount(workerId, today);
  if (count >= 30) return jsonResponse({ ok: false, error: 'quota_exceeded' });
  return jsonResponse({ ok: true, name: worker.name, remaining: 30 - count });
}

function handleChat(workerId, name, message, lang) {
  const worker = getWorker(workerId);
  if (!worker || worker.active !== 'Y') return jsonResponse({ ok: false, error: 'not_found' });
  const today = getTodayStr();
  const count = getDailyCount(workerId, today);
  if (count >= 30) return jsonResponse({ ok: false, error: 'quota_exceeded' });
  const skillContent = getSkillsForMessage(message);
  const reply = callClaude(message, skillContent, lang);
  incrementDailyCount(workerId, today);
  logUsage(workerId, name, lang, message, reply.substring(0, 100));
  return jsonResponse({ ok: true, reply: reply, remaining: 30 - count - 1 });
}

function getTodayStr() {
  return Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
