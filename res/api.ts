
import { md5 } from 'js-md5';

/* const API_URL = process.env.API_URL; */
const SECOND_API_URL = process.env.SECOND_API_URL;
const THIRD_API_URL = process.env.THIRD_API_URL;

const API_TOKEN = process.env.API_TOKEN;
const SECOND_API_TOKEN = process.env.SECOND_API_TOKEN;


const makeRequestToCrm = async (route: string, method: string) => {
  const data: any = {
    action: 'StudBotApi',
    method: route,
  };
  // Генерирую токен для передачи (разворачивается на стороне crm)
  data.token = md5(`${process.env.API_TOKEN}${md5(JSON.stringify(data))}`);

  const response = await fetch(`${process.env.SECOND_API_URL}`, {
    headers: { "Content-Type": "application/json", },
    method: method ?? 'POST',
    body: JSON.stringify(data)
  });
  return await response.json();
};

const secondMakeRequestToCrm: any = async (link: string, route: string, data: any, returnType: string) => {
  const response = await fetch(`http://crm.local/${link}`, {
    headers: { Authorization: `Bearer Ipo4EChkQ7CAEWtFC5ZmZ9yo9O50ALMDq2CMLMy21SAOA7LcesUgeLJ6fH4lrRdv` },
    method: route ?? 'POST',
    body: JSON.stringify(data)
  });

  return await returnType === 'text' ? response.text() : response.json();
};


export { makeRequestToCrm, secondMakeRequestToCrm };