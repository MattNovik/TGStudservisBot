import fetch from 'node-fetch';
import { md5 } from 'js-md5';

const API_URL = process.env.API_URL;
const SECOND_API_URL = process.env.SECOND_API_URL;
const API_TOKEN = process.env.API_TOKEN;

const makeRequestToCrm = async (route: string, method: string) => {
  let data: any = {
    action: 'StudBotApi',
    method: route,
  };

  // Генерирую токен для передачи (разворачивается на стороне crm)
  data.token = md5(`${API_TOKEN}${md5(JSON.stringify(data))}`);

  let response = await fetch(`${SECOND_API_URL}`, {
    headers: { "Content-Type": "application/json", },
    method: method ?? 'POST',
    body: JSON.stringify(data)
  });
  return await response.json();
};


export { makeRequestToCrm };