import { Telegraf } from "telegraf";
import dotenv from 'dotenv';

dotenv.config();
const BOT = new Telegraf(process.env.BOT_TOKEN);
console.log(BOT.telegram.token === process.env.BOT_TOKEN);

export default BOT;