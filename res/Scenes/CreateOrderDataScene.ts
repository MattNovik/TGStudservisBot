import { Scenes } from "telegraf";
import { makeRequestToCrm } from "../api.js";
import { ACTION_SCENE_OUT } from "../data.js";
import { regexEmail } from "../utils.js";
import DateCalendar from "../calendar.js";

let TYPES_OF_WORK: any = [];

const createOrderDataWizard = new Scenes.WizardScene(
  'CREATE_ORDER_SCENE',
  (ctx: any) => {
    console.log('firstStep');
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

    makeRequestToCrm('getTypesOfWork', 'POST').then((data: any) => {
      console.log(data);
      if (data && data.list) {
        TYPES_OF_WORK = data.list;
        ctx.reply('Какой тип работы вам необходим?', {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: TYPES_OF_WORK.map((item: any) => [{ text: item.name }]),
          },
        });

        return ctx.wizard.next();
      }
    });

  },
  (ctx: any) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.wizard.state.createOrderData.type_of_work = ctx.message.text;

      if (ctx.message.text !== 'Курсовая работа') {
        ctx.reply('Неверный тип работы (по секрету: для проверки сделали только Курсовые. Лучше выберите их)', {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: TYPES_OF_WORK.map((item: any) => [{ text: item.name }]),
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
  (ctx: any) => {
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
  (ctx: any) => {
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
  (ctx: any) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      ctx.wizard.state.createOrderData.pages = ctx.message.text;
      DateCalendar.startNavCalendar(ctx);
      return ctx.wizard.next();
    } else {

      return ctx.scene.leave();
    }
  },
  (ctx: any) => {
    if (ctx.callbackQuery.message.message_id == DateCalendar.chats.get(ctx.callbackQuery.message.chat.id)) {
      let res: any;
      res = DateCalendar.clickButtonCalendar(ctx.callbackQuery);
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
  (ctx: any) => {
    if ((ctx && ctx.message && ctx.message.text) || ACTION_SCENE_OUT[ctx.callbackQuery.data]) {
      if (regexEmail.test(ctx.message.text)) {
        ctx.wizard.state.createOrderData.email = ctx.message.text;
        let orderData = ctx.wizard.state.createOrderData;
        console.log(ctx.wizard.state.createOrderData);
        fetch('https://tgbotstud.free.beeceptor.com/order', {
          method: 'POST',
          body: JSON.stringify(orderData)
        })
          .then((response: any) => response.text())
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

export default createOrderDataWizard;