import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { apiClient } from './api.js';
dotenv.config();

const fromTypes = {
  all: 'all',
  catBot: 'catBot',
  after: 'after',
};

let activeFrom;

/* const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: 'My phone number',
          request_contact: true,
          one_time_keyboard: true,
        },
      ],
      ['Cancel'],
    ],
  },
};

const requestOrderNumberKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: 'Номер заказа',
          one_time_keyboard: true,
        },
      ],
      ['Cancel'],
    ],
  },
};

const requestLocationKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: 'My location',
          request_location: true,
          one_time_keyboard: true,
        },
      ],
      ['Cancel'],
    ],
  },
}; */

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  if (
    ctx.message.text.split(' ')[ctx.message.text.split(' ').length - 1] !==
    '/start'
  ) {
    activeFrom = fromTypes.catBot;
  }

  if (activeFrom === 'catBot') {
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Ваш заказ ${
        ctx.message.text.split(' ')[ctx.message.text.split(' ').length - 1]
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
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Здравствуйте ${ctx.message.from.username}, это бот компании Студсервис. Здесь вы можете задать интересующие вас вопросы(/help), узнать статус вашего заказа(/orderStatus), связаться с менеджером (/manager)?`
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
  /* bot.telegram.sendMessage(ctx.chat.id, `хотите получить информацию по вашему заказу?`, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "Ввести номер заказа",
          callback_data: 'orderNumber'
        }],
      ]
    }
  }); */
});

bot.command('/help', (ctx) => {
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

bot.action('pay', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Вы вносите предоплату через личный кабинет, на сайте и автор приступает к выполнению задания. Далее готовая работа загружается в личный кабинет - Вам на почту приходит уведомление об этом. После внесения остатка по оплате, Вы можете скачивать готовую работу. Если потребуются какие-либо корректировки, то они бесплатные и бессрочные по первоначальным требованиям. Если у Вас имеются какие-либо ещё вопросы - сообщите`
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

bot.action('orderNumber', (ctx, match) => {
  bot.telegram
    .sendMessage(
      ctx.chat.id,
      'Для уточнения статуса заказа, необходим номер заказа(отправьте след. сообщением)',
      requestOrderNumberKeyboard
    )
    .then(() =>
      bot.on('message', (ctx) => {
        bot.telegram.sendMessage(
          ctx.chat.id,
          'Спасибо, информация по вашему заказу' + ctx.message.text
        );
      })
    );
});

bot.hears('animals', (ctx) => {
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
});

bot.launch();
