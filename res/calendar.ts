import Calendar from "telegram-inline-calendar/src/Calendar";
import BOT from "./initBot";

const date = new Date();

const currentDay = String(date.getDate()).padStart(2, '0');

const currentMonth = String(date.getMonth() + 1).padStart(2, "0");

const currentYear = date.getFullYear();

// we will display the date as DD-MM-YYYY 

const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

const DateCalendar: any = new Calendar(BOT, {
  date_format: 'DD-MM-YYYY',
  language: 'ru',
  bot_api: 'telegraf',
  start_date: currentDate
});

export default DateCalendar;