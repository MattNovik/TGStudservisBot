import dotenv from 'dotenv';
import { Telegraf, Markup, Scenes, session } from 'telegraf';
import Calendar from 'telegram-inline-calendar/src/Calendar.js';
import { apiClient } from './api.js';
import { message } from 'telegraf/filters';
import fetch from 'node-fetch';
import md5 from 'js-md5';

dotenv.config();

const fromTypes = {
  all: 'all',
  catBot: 'catBot',
  after: 'after',
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ACTION_SCENE_OUT = {
  '/start': true,
  '/manager': true
}

let createOrderData;
let activeFrom;
let helpState = 1;
let orderState = 1;

const getAllOrdersData = async () => {
  let result;
  fetch('https://tgbotstud.free.beeceptor.com/orders/', {
    method: 'GET',
  })
    .then(response => response.text())
    .then(data => {
      console.log(data)
      result = data;
    })
    .catch(error => {
      console.error(error);
      result = error;
    });
  return await result;
};

const requestOrderNumberKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    force_reply: true,
  },
};

const makeRequestToCrm = async (method) => {

  let data = {
    action: 'StudBotApi',
    method: method,
  };

  data.token = md5(`${API_TOKEN}${md5(JSON.stringify(data))}`);

  let response = await fetch(`${SECOND_API_URL}`, {
    header: { "Content-Type": "application/json", },
    method: 'POST',
    body: JSON.stringify(data)
  });
  return await response.json();
};

// const requestLocationKeyboard = {
//   reply_markup: {
//     one_time_keyboard: true,
//     keyboard: [
//       [
//         {
//           text: 'My location',
//           request_location: true,
//           one_time_keyboard: true,
//         },
//       ],
//       ['Cancel'],
//     ],
//   },
// };

// Date object
const date = new Date();

let currentDay = String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

let currentYear = date.getFullYear();

// we will display the date as DD-MM-YYYY 

let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_URL = process.env.API_URL;
const SECOND_API_URL = process.env.SECOND_API_URL;
const API_TOKEN = process.env.API_TOKEN;

let TYPES_OF_WORK = [];

const calendar = new Calendar(bot, {
  date_format: 'DD-MM-YYYY',
  language: 'ru',
  bot_api: 'telegraf',
  start_date: currentDate
});


/* bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
  let data = answerInlineQuery({
    type: 'article',
    id: 'someID',
    title: 'someTitle',
    description: 'someDesc',
    thumb_url: 'img_url',
    url: 'url',
  });
  console.log(data);
  return data;
}); */

bot.action('start', (ctx) => {
  if (
    ctx.message.text.split(' ')[ctx.message.text.split(' ').length - 1] !==
    '/start'
  ) {
    activeFrom = fromTypes.catBot;
  }

  if (activeFrom === 'catBot') {
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Ваш заказ ${ctx.message.text.split(' ')[ctx.message.text.split(' ').length - 1]
      } успешно создан, если у вас есть вопросы, задайте их`,
      {}
    );
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Есть ли у вас какие-нибудь вопросы к нам?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Хочу собаку!',
                callback_data: 'dog',
              },
              {
                text: 'Хочу кота!',
                callback_data: 'cat',
              },
            ],
          ],
        },
      }
    );
  } else {
    ctx.reply(
      `Здравствуйте ${ctx.message.from.username}, меня зовут Студень. Это бот компании Студсервис. Здесь вы можете:`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Узнать статус вашего заказа', callback_data: '/state' }],
            [
              {
                text: 'Создать заказ',
                callback_data: '/create',
              },
            ],
            [{ text: 'Cвязаться с менеджером', callback_data: '/manager' }],
          ],
        },
      }
    );
    /* setTimeout(() =>
      bot.telegram.sendMessage(ctx.chat.id, `Хотите посмотреть на ужасы бренного мира??!!`, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Да хочу! Присылайте!",
              callback_data: 'photo'
            },
            {
              text: "Не хочу, но присылайте вашу гомосятину...",
              callback_data: 'photo'
            }
            ],

          ]
        }
      }), 1000); */
  }
});

// main comman

bot.command('/help', (ctx) => {
  helpState = 1;
  ctx.reply('Какой вопрос вас интересует?', {
    reply_markup: {
      inline_keyboard: [
        /* Inline buttons. 2 side-by-side */
        [
          { text: 'Как оплатить заказ?', callback_data: 'pay' },
          { text: 'Договор', callback_data: 'doc' },
        ],
        /* Inline buttons. 2 side-by-side */
        [
          { text: 'Отзывы', callback_data: 'review' },
          { text: 'Далее', callback_data: 'next' },
        ],
      ],
    },
  });
});

bot.action('/help', (ctx) => {
  helpState = 1;
  ctx.reply('Какой вопрос вас интересует?', {
    reply_markup: {
      inline_keyboard: [
        /* Inline buttons. 2 side-by-side */
        [
          { text: 'Как оплатить заказ?', callback_data: 'pay' },
          { text: 'Договор', callback_data: 'doc' },
        ],
        /* Inline buttons. 2 side-by-side */
        [
          { text: 'Отзывы', callback_data: 'review' },
          { text: 'Далее', callback_data: 'next' },
        ],
      ],
    },
  });
});

bot.command('/manager', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Для связи с менеджером передейте по ссылке повторите ваш вопрос.\nДва варианта: или даем ссылку на менеджера или отправляем запрос в нашу CRM и позволяем общаться с менеджером через ТГ.\nНо эта задача ложнее`
  );
});

bot.action('/manager', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Для связи с менеджером передейте по ссылке повторите ваш вопрос.\nДва варианта: или даем ссылку на менеджера или отправляем запрос в нашу CRM и позволяем общаться с менеджером через ТГ.\nНо эта задача ложнее`
  );
});

// commad for help button

bot.action('next', (ctx) => {
  if (helpState === 1) {
    ctx.reply('Какой вопрос вас интересует?', {
      reply_markup: {
        inline_keyboard: [
          /* Inline buttons. 2 side-by-side */
          [
            { text: 'Где скачать работу?', callback_data: 'download' },
            { text: 'Гарантии', callback_data: 'garanty' },
          ],
          /* Inline buttons. 2 side-by-side */
          [
            { text: 'Почему так дорого?', callback_data: 'expensive' },
            { text: 'Далее', callback_data: 'next' },
          ],
        ],
      },
    });
    helpState++;
  } else if (helpState === 2) {
    ctx.reply('Какой вопрос вас интересует?', {
      reply_markup: {
        inline_keyboard: [
          /* Inline buttons. 2 side-by-side */
          [
            {
              text: 'Как и где я получу работу?',
              callback_data: 'downloadWork',
            },
            { text: 'Кто будет писать работу?', callback_data: 'author' },
          ],
          /* Inline buttons. 2 side-by-side */
          [{ text: 'Корректировки', callback_data: 'corrections' }],
        ],
      },
    });
    helpState++;
  }
});

//first step

bot.action('pay', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Вы вносите предоплату через личный кабинет, на сайте и автор приступает к выполнению задания. Далее готовая работа загружается в личный кабинет - Вам на почту приходит уведомление об этом. После внесения остатка по оплате, Вы можете скачивать готовую работу. Если потребуются какие-либо корректировки, то они бесплатные и бессрочные по первоначальным требованиям. Если у Вас имеются какие-либо ещё вопросы - сообщите`
  );
});

bot.action('doc', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Договор заключается автоматически в момент внесения предоплаты. При заказе на сайте с договором Вы можете ознакомиться в личном кабинете, нажав кнопку «оплатить».`
  );
});

bot.action('review', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Приведем пару ссылок на независимые площадки:
    - https://www.yell.ru/spb/com/studservis_10770463/
    - https://otzyvaka.ru`
  );
});

//second step

bot.action('download', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Когда всё будет готово, Вам поступит уведомление, что заказ исполнен и ожидает оплаты. Останется доплатить вторую часть суммы, после чего файлы можно будет скачать и открыть.`
  );
});

bot.action('garanty', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `При оформлении заказа мы заключаем Договор, в котором прописаны все условия и требования к заказу, что является официальным доказательством наших обязательств перед Вами. При заказе на сайте с Договором Вы можете ознакомиться в личном кабинете, нажав кнопку «оплатить» в заказе. Мы официально зарегистрированная организация с юридическим адресом и телефонами. Работаем на рынке данных услуг уже более 17 лет, то есть имеем большой опыт в написании подобных работ.
     С нами сотрудничают уже более 3000 экспертов, которые являются действующими преподавателями ВУЗов`
  );
});

bot.action('expensive', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `При низкой цене велик риск попасть на некомпетентного автора. Мы много сейчас получаем заказов на исправление чужих ошибок, когда заказывали в другом месте и подешевле - в итоге таким клиентам приходится доплачивать ещё и за срочность доработок`
  );
});

//third step

bot.action('downloadWork', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Когда всё будет готово, Вам поступит уведомление, что заказ исполнен и ожидает оплаты. Останется доплатить вторую часть суммы, после чего файлы можно будет скачать и открыть.`
  );
});

bot.action('author', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Вашу работу будет выполнять преподаватель из высшего учебного заведения, работающий на соответствующей кафедре`
  );
});

bot.action('corrections', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Мы ведём Вас до успешной сдачи: все корректировки в рамках начальных требований - бесплатны. Эти гарантии прописаны в договоре-оферте, который Вы заключаете с нами. Ознакомиться с ним можно на нашем сайте по ссылке https://studservis.ru/dogovor-oferty/`
  );
});

/* bot.action('cat', ctx => {
  bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/cat.jpeg"
  })
  setTimeout(() => bot.telegram.sendMessage(ctx.chat.id, `Хотите ещё собачку или котика?`, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "Хочу собаку!",
          callback_data: 'dog'
        },
        {
          text: "Хочу кота!",
          callback_data: 'cat'
        }
        ],

      ]
    }
  }), 1000);
});

bot.action('photo', ctx => {
  apiClient.get('/photos/random').then(response => {
    bot.telegram.sendPhoto(ctx.chat.id, response.data.urls.small);
  }).catch(error => console.log(error))
})

bot.action('dog', ctx => {
  bot.telegram.sendPhoto(ctx.chat.id, {
    source: "res/dog.jpeg"
  })
  setTimeout(() => bot.telegram.sendMessage(ctx.chat.id, `Хотите ещё собачку или котика?`, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "Хочу собаку!",
          callback_data: 'dog'
        },
        {
          text: "Хочу кота!",
          callback_data: 'cat'
        }
        ],

      ]
    }
  }), 1000);
}) */

/* bot.hears('animals', (ctx) => {
  console.log(ctx.from);
  let animalMessage = `great, here are pictures of animals you would love`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'dog',
            callback_data: 'dog',
          },
          {
            text: 'cat',
            callback_data: 'cat',
          },
        ],
      ],
    },
  });
});

bot.hears('phone', (ctx, next) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    'Can we get access to your phone number?',
    requestPhoneKeyboard
  );
});

bot.hears('location', (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    'Can we access your location?',
    requestLocationKeyboard
  );
}); */

/* const contactDataWizard = new Scenes.WizardScene(
  'CONTACT_DATA_WIZARD_SCENE_ID', // first argument is Scene_ID, same as for BaseScene
  (ctx) => {
    ctx.reply('What is your name?');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    if (ctx.message.text.length < 2) {
      ctx.reply('Please enter name for real');
      return;
    }
    ctx.wizard.state.contactData.fio = ctx.message.text;
    ctx.reply('Enter your e-mail');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.contactData.email = ctx.message.text;
    ctx.reply('Thank you for your replies, we`ll contact your soon');
    // await mySendContactDataMomentBeforeErase(ctx.wizard.state.contactData);
    console.log(ctx.wizard.state.contactData);
    return ctx.scene.leave();
  }
); */

const orderDataWizard = new Scenes.WizardScene(
  'ORDER_ID_SCENE',
  (ctx) => {
    ctx.reply('Для авторизации введите ваш email (любой, пока нет авторизации)');
    return ctx.wizard.next();
  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text)) {
      if (regexEmail.test(ctx.message.text)) {
        ctx.reply('Введите номер заказа (любые 6 цифр)');
        ctx.wizard.state.orderData = {
          order_id: null
        };
        return ctx.wizard.next();
      } else {
        ctx.reply('Неверный email');
      }
    } else {
      ctx.scene.leave();
    }

  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text)) {
      if (ctx.message.text.length < 6 || isNaN(Number(ctx.message.text))) {
        ctx.reply('Пожалуйста введине реальный номер заказа');
        return;
      }
      ctx.wizard.state.orderData.order_id = ctx.message.text;
      ctx
        .reply('Вертим шестеренки и проверяем данные')
        .then(() => {
          fetch('https://tgbotstud.free.beeceptor.com/order/', {
            method: 'GET',
          })
            .then(response => response.json())
            .then(data => {
              let result = data.orders[getRndInteger(0, data.orders.length - 1)];
              console.log(JSON.stringify(data));
              console.log(result)
              ctx.reply(
                `Статус заказа - ${result.status};\nСтоимость заказа - ${result.summ} руб.;\nОписание - ${result.description};
              `
              );
              return ctx.scene.leave();
            })
            .catch(error => {
              console.log(error)
              ctx.reply(
                `Ошибка, попробуйте ещё раз!
              `
              );
              return ctx.scene.leave();
            });
        });
    } else {
      ctx.scene.leave();
    }
  }
);



const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const createOrderDataWizard = new Scenes.WizardScene(
  'CREATE_ORDER_SCENE',
  (ctx) => {
    ctx.wizard.state.createOrderData = {
      type_of_work: null,
      theme: null,
      course: null,
      email: null,
      phone: null,
      name: null,
      pages: null,
      date: null
    };

    makeRequestToCrm('getTypesOfWork').then((data) => {
      if (data && data.list) {
        TYPES_OF_WORK = data.list;
        ctx.reply('Какой тип работы вам необходим?', {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: TYPES_OF_WORK.map((item) => [{ text: item.name }]),
          },
        });

        return ctx.wizard.next();
      }
    });

  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.wizard.state.createOrderData.type_of_work = ctx.message.text;

      if (ctx.message.text !== 'Курсовая работа') {
        ctx.reply('Неверный тип работы (по секрету: для проверки сделали только Курсовые. Лучше выберите их)', {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: TYPES_OF_WORK.map((item) => [{ text: item.name }]),
          },
        });
      } else {
        ctx.reply('Введите тему работу', {
          reply_markup: { remove_keyboard: true },
        });
        return ctx.wizard.next();
      }
    } else {

      return ctx.scene.leave();
    }

  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.wizard.state.createOrderData.theme = ctx.message.text;

      ctx.reply('Выберите предмет из предложенных или введите свой', {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [
              { text: 'Математика' },
              { text: 'Физика' },
              { text: 'Химия' },
            ],
            [
              { text: 'НАУЧПОП' },
              { text: 'Инженер' },
              { text: 'География' }
            ],
          ],
        },
      });

      return ctx.wizard.next();
    } else {

      return ctx.scene.leave();
    }
  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.wizard.state.createOrderData.course = ctx.message.text;

      ctx.reply('Примерный объем работы', {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [
              { text: '10-15' },
              { text: '16-25' },
              { text: '26-35' },
            ],
            [
              { text: '36-45' },
              { text: '46-55' },
              { text: '56-65' }
            ],
          ],
        },
      });

      return ctx.wizard.next();
    } else {

      return ctx.scene.leave();
    }
  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.wizard.state.createOrderData.pages = ctx.message.text;
      calendar.startNavCalendar(ctx);
      return ctx.wizard.next();
    } else {

      return ctx.scene.leave();
    }
  },
  (ctx) => {
    if (ctx.callbackQuery.message.message_id == calendar.chats.get(ctx.callbackQuery.message.chat.id)) {
      var res;
      res = calendar.clickButtonCalendar(ctx.callbackQuery);
      if (res !== -1) {
        ctx.reply("Вы выбрали: " + res, {
          reply_markup: { remove_keyboard: true },
        });
        ctx.wizard.state.createOrderData.date = res;
        setTimeout(() => {
          ctx.reply('Укажите email на который неуобходимо будет отправить работу');
          return ctx.wizard.next();
        }, 0)
      }

    } else if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.reply('Любая информация');
    } else {
      return ctx.scene.leave();
    }
  },
  (ctx) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      if (regexEmail.test(ctx.message.text)) {
        ctx.wizard.state.createOrderData.email = ctx.message.text;
        let orderData = ctx.wizard.state.createOrderData;
        console.log(ctx.wizard.state.createOrderData);
        fetch('https://tgbotstud.free.beeceptor.com/order', {
          method: 'POST',
          body: JSON.stringify(orderData)
        })
          .then(response => response.text())
          .then(data => {
            console.log(data);
            ctx.reply('Отлично ваш заказ НЕ создан, но скоро с вами свяжутся');
            ctx.reply(`Информация по вашему заказу:\nСроки - ${orderData.date}\nКол-во страниц - ${orderData.pages}\nТема работы - ${orderData.theme}\nТип работы - ${orderData.type_of_work}\nПредмет - ${orderData.course}`);
            return ctx.scene.leave();
          })
          .catch(error => {
            console.error(error);
            ctx.reply('Ошибка заказа!');
            return ctx.scene.leave();
          });
      } else {
        ctx.reply('Неверный email');
      }
    } else {
      return ctx.scene.leave();
    }
  }
);

orderDataWizard.action('/create', Scenes.Stage.enter('CREATE_ORDER_SCENE'));
createOrderDataWizard.action('/state', Scenes.Stage.enter('ORDER_ID_SCENE'));

orderDataWizard.command('/create', Scenes.Stage.enter('CREATE_ORDER_SCENE'));
createOrderDataWizard.command('/state', Scenes.Stage.enter('ORDER_ID_SCENE'));

/* createOrderDataWizard.leave((ctx) => ctx.reply(' ')); */

const stage = new Scenes.Stage([orderDataWizard, createOrderDataWizard]);

bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.use(stage.middleware());

bot.action('/state', Scenes.Stage.enter('ORDER_ID_SCENE'));
bot.command('/state', Scenes.Stage.enter('ORDER_ID_SCENE'));

bot.action('/create', Scenes.Stage.enter('CREATE_ORDER_SCENE'));
bot.command('/create', Scenes.Stage.enter('CREATE_ORDER_SCENE'));

bot.launch();
