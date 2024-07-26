const helpCommand = (ctx: any) => {
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
};

const managerCommand = (ctx: any, bot: any) => {
  console.log('manger command')
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Для связи с менеджером передейте по ссылке повторите ваш вопрос.\nДва варианта: или даем ссылку на менеджера или отправляем запрос в нашу CRM и позволяем общаться с менеджером через ТГ.\nНо эта задача ложнее`
  );
};

const nextCommand = (ctx: any, helpState: number) => {
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
  }
}

const startCommand = (ctx: any, activeFrom: string, bot: any) => {
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
  }
};

export { helpCommand, managerCommand, nextCommand, startCommand };