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

const payCommand = (ctx: any) => {
  ctx.reply(
    `Вы вносите предоплату через личный кабинет, на сайте и автор приступает к выполнению задания. Далее готовая работа загружается в личный кабинет - Вам на почту приходит уведомление об этом. После внесения остатка по оплате, Вы можете скачивать готовую работу. Если потребуются какие-либо корректировки, то они бесплатные и бессрочные по первоначальным требованиям. Если у Вас имеются какие-либо ещё вопросы - сообщите`
  );
};

const managerCommand = (ctx: any) => {
  ctx.reply(
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

const startCommand = (ctx: any) => {
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
};

const docCommand = (ctx: any) => {
  ctx.reply(
    `Договор заключается автоматически в момент внесения предоплаты. При заказе на сайте с договором Вы можете ознакомиться в личном кабинете, нажав кнопку «оплатить».`
  );
};

const reviewCommand = (ctx: any) => {
  ctx.reply(
    `Приведем пару ссылок на независимые площадки:
    - https://www.yell.ru/spb/com/studservis_10770463/
    - https://otzyvaka.ru`
  );
};

const downloadCommand = (ctx: any) => {
  ctx.reply(
    `Когда всё будет готово, Вам поступит уведомление, что заказ исполнен и ожидает оплаты. Останется доплатить вторую часть суммы, после чего файлы можно будет скачать и открыть.`
  );
};

const garantyCommand = (ctx: any) => {
  ctx.reply(
    `При оформлении заказа мы заключаем Договор, в котором прописаны все условия и требования к заказу, что является официальным доказательством наших обязательств перед Вами. При заказе на сайте с Договором Вы можете ознакомиться в личном кабинете, нажав кнопку «оплатить» в заказе. Мы официально зарегистрированная организация с юридическим адресом и телефонами. Работаем на рынке данных услуг уже более 17 лет, то есть имеем большой опыт в написании подобных работ.
     С нами сотрудничают уже более 3000 экспертов, которые являются действующими преподавателями ВУЗов`
  );
};

const expensiveCommand = (ctx: any) => {
  ctx.reply(
    `При низкой цене велик риск попасть на некомпетентного автора. Мы много сейчас получаем заказов на исправление чужих ошибок, когда заказывали в другом месте и подешевле - в итоге таким клиентам приходится доплачивать ещё и за срочность доработок`
  );
};

const downloadWorkCommand = (ctx: any) => {
  ctx.reply(
    `Когда всё будет готово, Вам поступит уведомление, что заказ исполнен и ожидает оплаты. Останется доплатить вторую часть суммы, после чего файлы можно будет скачать и открыть.`
  );
};

const authorCommand = (ctx: any) => {
  ctx.reply(
    `Вашу работу будет выполнять преподаватель из высшего учебного заведения, работающий на соответствующей кафедре`
  );
};

const correctionsCommand = (ctx: any) => {
  ctx.reply(
    `Мы ведём Вас до успешной сдачи: все корректировки в рамках начальных требований - бесплатны. Эти гарантии прописаны в договоре-оферте, который Вы заключаете с нами. Ознакомиться с ним можно на нашем сайте по ссылке https://studservis.ru/dogovor-oferty/`
  );
};

const enterCreateOrderScene = (ctx: any) => {
  console.log('create');
  ctx.scene.enter('CREATE_ORDER_SCENE')
};

const enterOrderScene = (ctx: any) => ctx.scene.enter('ORDER_ID_SCENE');

export { enterCreateOrderScene, enterOrderScene, correctionsCommand, authorCommand, downloadWorkCommand, helpCommand, managerCommand, nextCommand, startCommand, payCommand, docCommand, reviewCommand, downloadCommand, garantyCommand, expensiveCommand };