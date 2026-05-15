function callClaude(userMessage, skillContent, lang) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  const url = 'https://api.anthropic.com/v1/messages';

  const langInstruction = lang === 'vi'
    ? 'You MUST reply in Vietnamese (Tiếng Việt). Do not use Chinese or English.'
    : 'You MUST reply in Traditional Chinese (繁體中文). Do not use Vietnamese or English.';

  const systemPrompt = `You are a factory assistant helping workers with technical questions. ${langInstruction}

Answer ONLY based on the knowledge in the SKILLs below. If the question is outside these SKILLs, say you don't know in the appropriate language. Keep answers concise and practical.

${skillContent}`;

  const payload = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMessage }]
  };

  const options = {
    method: 'post',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-beta': 'prompt-caching-2024-07-31'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  if (data.error) throw new Error('Claude API error: ' + data.error.message);
  return data.content[0].text;
}
