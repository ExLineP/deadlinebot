const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const JSONdb = require('simple-json-db');
const token = '6115036788:AAE-85QeqELMoD3S5aTY0I3Q78V9Kfk2XOw';
const db = new JSONdb('./db/storage.json');
const bot = new TelegramBot(token, {polling: true});

function checkTodaysDate(jsonData) {
  let today = new Date();
  today.setDate(today.getDate() - 2)
  today = today.toLocaleDateString()
  for (const key in jsonData) {
    if (Date.parse(jsonData[key]) === Date.parse(today)) {
      bot.sendMessage(261472549, `Блин блинский, дедлайн по ${key} через два дня`);
      console.log(key)
      break;
      
    }
  }
}

bot.onText(/\/deadline (.+) on (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const description = match[1];
  if (db.has(match[1])) {
    bot.sendMessage(chatId, `Дедлайн уже есть в списке`)
  } else {
  const deadline = new Date(match[2]);
  const notificationTime = new Date(deadline.toDateString());
  console.log(notificationTime)
  db.set(match[1], match[2]);
}
});
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, JSON.stringify(db.JSON()).replace(/[{}]/g, '').replace(/,/g, '\n'))
})

bot.onText(/\/delete (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if (db.has(match[1])) {
    db.delete(match[1]);
    bot.sendMessage(chatId, `Удалено`)
  } else {
  bot.sendMessage(chatId, `Такого дедлайна нет`)
}
});

schedule.scheduleJob('2 0 10 * * *', function(){
  checkTodaysDate(db.JSON())
});

bot.on("polling_error", console.log);

