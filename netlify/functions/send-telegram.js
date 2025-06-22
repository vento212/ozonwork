const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Получаем токен и Chat ID из переменных окружения Netlify
  const { BOT_TOKEN, CHAT_ID } = process.env;

  // --- НАЧАЛО ДИАГНОСТИКИ ---
  console.log('--- DIAGNOSTIC LOGS ---');
  console.log('BOT_TOKEN:', BOT_TOKEN ? `Найден, длина: ${BOT_TOKEN.length}` : 'НЕ НАЙДЕН');
  console.log('CHAT_ID:', CHAT_ID ? `Найден, значение: ${CHAT_ID}` : 'НЕ НАЙДЕН');
  console.log('--- END DIAGNOSTIC LOGS ---');
  // --- КОНЕЦ ДИАГНОСТИКИ ---
  
  const data = JSON.parse(event.body);

  const { firstName, lastName, email, contact } = data;


  const message = `📝 *Новая заявка на работу в OZON!*\n\n` +
                  `👤 *Имя:* ${firstName}\n` +
                  `👤 *Фамилия:* ${lastName}\n` +
                  `📧 *Email:* ${email}\n` +
                  `📱 *Telegram:* ${contact}\n\n` +
                  `⏰ *Дата:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Заявка успешно отправлена!' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Ошибка отправки заявки.' }),
    };
  }
}; 