

import './instrument';
import { Scenes, session } from 'telegraf';
import { helpCommand, startCommand, managerCommand, nextCommand } from './functions/commandFunction';
import { FROM_TYPES } from './data';
import BOT from './initBot';
import createOrderDataWizard from './Scenes/CreateOrderDataScene';
import orderDataWizard from './Scenes/OrderDataScene';

let activeFrom: undefined | string;
let helpState: number = 1;

if (BOT) {
  BOT.telegram.setMyCommands([
    {
      command: 'start',
      description: 'Начало общения',
    },
    {
      command: 'create',
      description: 'Создать заказ',
    },
    {
      command: 'state',
      description: 'Информация по заказу',
    },
    {
      command: 'manager',
      description: 'Общение с менеджером',
    },
    {
      command: 'cancel',
      description: 'Выйти из меню',
    },
  ]);

  BOT.action('/start', (ctx: any) => {

    if (
      ctx.message.text.split(' ')[ctx.message.text.split(' ').length - 1] !==
      '/start'
    ) {
      activeFrom = FROM_TYPES.catBot;
    }
    startCommand(ctx, activeFrom, BOT);
  });

  BOT.command('/start', (ctx: any) => {
    console.log(ctx);
    if (
      ctx.message.text.split(' ')[ctx.message.text.split(' ').length - 1] !==
      '/start'
    ) {
      activeFrom = FROM_TYPES.catBot;
    }
    startCommand(ctx, activeFrom, BOT);
  });

  // main command
  BOT.command('/help', (ctx: any) => {
    helpState = 1;
    helpCommand(ctx);
  });

  BOT.action('/help', (ctx: any) => {
    helpState = 1;
    helpCommand(ctx);
  });

  BOT.command('/manager', (ctx: any) => {
    managerCommand(ctx, BOT);
  });

  BOT.action('/manager', (ctx: any) => {
    managerCommand(ctx, BOT);
  });

  BOT.action('/next', (ctx: any) => {
    nextCommand(ctx, helpState);
    helpState++;
  });

  BOT.action('/pay', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Вы вносите предоплату через личный кабинет, на сайте и автор приступает к выполнению задания. Далее готовая работа загружается в личный кабинет - Вам на почту приходит уведомление об этом. После внесения остатка по оплате, Вы можете скачивать готовую работу. Если потребуются какие-либо корректировки, то они бесплатные и бессрочные по первоначальным требованиям. Если у Вас имеются какие-либо ещё вопросы - сообщите`
    );
  });

  BOT.action('/doc', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Договор заключается автоматически в момент внесения предоплаты. При заказе на сайте с договором Вы можете ознакомиться в личном кабинете, нажав кнопку «оплатить».`
    );
  });

  BOT.action('/review', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Приведем пару ссылок на независимые площадки:
      - https://www.yell.ru/spb/com/studservis_10770463/
      - https://otzyvaka.ru`
    );
  });

  BOT.action('/download', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Когда всё будет готово, Вам поступит уведомление, что заказ исполнен и ожидает оплаты. Останется доплатить вторую часть суммы, после чего файлы можно будет скачать и открыть.`
    );
  });

  BOT.action('/garanty', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `При оформлении заказа мы заключаем Договор, в котором прописаны все условия и требования к заказу, что является официальным доказательством наших обязательств перед Вами. При заказе на сайте с Договором Вы можете ознакомиться в личном кабинете, нажав кнопку «оплатить» в заказе. Мы официально зарегистрированная организация с юридическим адресом и телефонами. Работаем на рынке данных услуг уже более 17 лет, то есть имеем большой опыт в написании подобных работ.
       С нами сотрудничают уже более 3000 экспертов, которые являются действующими преподавателями ВУЗов`
    );
  });

  BOT.action('/expensive', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `При низкой цене велик риск попасть на некомпетентного автора. Мы много сейчас получаем заказов на исправление чужих ошибок, когда заказывали в другом месте и подешевле - в итоге таким клиентам приходится доплачивать ещё и за срочность доработок`
    );
  });

  BOT.action('downloadWork', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Когда всё будет готово, Вам поступит уведомление, что заказ исполнен и ожидает оплаты. Останется доплатить вторую часть суммы, после чего файлы можно будет скачать и открыть.`
    );
  });

  BOT.action('/author', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Вашу работу будет выполнять преподаватель из высшего учебного заведения, работающий на соответствующей кафедре`
    );
  });

  BOT.action('/corrections', (ctx: any) => {
    BOT.telegram.sendMessage(
      ctx.chat.id,
      `Мы ведём Вас до успешной сдачи: все корректировки в рамках начальных требований - бесплатны. Эти гарантии прописаны в договоре-оферте, который Вы заключаете с нами. Ознакомиться с ним можно на нашем сайте по ссылке https://studservis.ru/dogovor-oferty/`
    );
  });

/*   orderDataWizard.action('/create', (ctx: any) => {
    ctx.scene.enter('ORDER_ID_SCENE');
  });
  createOrderDataWizard.action('/state', (ctx: any) => {
    ctx.scene.enter('CREATE_ORDER_SCENE')
  });

  orderDataWizard.command('/create', (ctx: any) => {
    ctx.scene.enter('ORDER_ID_SCENE');
  });
  createOrderDataWizard.command('/state', (ctx: any) => {
    ctx.scene.enter('CREATE_ORDER_SCENE')
  }); */

  const stage = new Scenes.Stage([orderDataWizard, createOrderDataWizard]);

  BOT.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
  BOT.use(stage.middleware());

  BOT.action('/state', (ctx: any) => ctx.scene.enter('ORDER_ID_SCENE'));
  BOT.command('/state', (ctx: any) => ctx.scene.enter('ORDER_ID_SCENE'));

  BOT.action('/create', (ctx: any) => {
    console.log('create');
    ctx.scene.enter('CREATE_ORDER_SCENE')
  });

  BOT.command('/create', (ctx: any) => {
    console.log('create');
    ctx.scene.enter('CREATE_ORDER_SCENE')
  });
  BOT.launch();

  console.log('start app v.09');
} else {
  console.log('no bot inted');
}
