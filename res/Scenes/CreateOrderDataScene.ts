import { Scenes } from "telegraf";
import { makeRequestToCrm } from "../api";
import { ACTION_SCENE_OUT } from "../data";
import { regexEmail } from "../utils";
import DateCalendar from "../calendar";

interface ORDER_DATA {
  type_of_work: null | string | number,
  theme: null | string,
  course: null | string | number,
  email: null | string,
  phone: null | string | number,
  name: null | string,
  pages: null | string | number,
  date: null | string | number | Date
}

let TYPES_OF_WORK: any = [];

const createOrderDataWizard = new Scenes.WizardScene(
  'CREATE_ORDER_SCENE',
  (ctx: {
    reply?: any,
    wizard?: {
      next?: any,
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    console.log('firstStep');
    console.log(ctx);
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
  (ctx: {
    reply?: any,
    scene?: any,
    message?: any,
    callbackQuery?: any,
    wizard?: {
      next?: any,
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
      ctx.wizard.state.createOrderData.type_of_work = ctx.message.text;
      console.log(ctx?.message?.text);
      ctx.reply('Введите тему работу', {
        reply_markup: { remove_keyboard: true },
      });
      return ctx.wizard.next();
    } else {
      console.log('leave');
      ctx.reply('Возврат в начало меню');
      ctx.reply({ reply_markup: { remove_keyboard: true } });
      return ctx.scene.leave();
    }
  },
  (ctx: {
    reply?: any,
    scene?: any,
    message?: any,
    callbackQuery?: any,
    wizard?: {
      next?: any,
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
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
              { text: 'Наука' },
              { text: 'Инженер' },
              { text: 'География' }
            ],
          ],
        },
      });

      return ctx.wizard.next();
    } else {
      ctx.reply('Возврат в начало меню');
      ctx.reply({ reply_markup: { remove_keyboard: true } });
      return ctx.scene.leave();
    }
  },
  (ctx: {
    reply?: any,
    scene?: any,
    message?: any,
    callbackQuery?: any,
    wizard?: {
      next?: any,
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
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
      ctx.reply('Возврат в начало меню');
      ctx.reply({ reply_markup: { remove_keyboard: true } });
      return ctx.scene.leave();
    }
  },
  (ctx: {
    reply?: any,
    scene?: any,
    message?: any,
    callbackQuery?: any,
    wizard?: {
      next?: any,
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
      ctx.wizard.state.createOrderData.pages = ctx.message.text;
      DateCalendar.startNavCalendar(ctx);
      return ctx.wizard.next();
    } else {
      ctx.reply('Возврат в начало меню');
      ctx.reply({ reply_markup: { remove_keyboard: true } });
      return ctx.scene.leave();
    }
  },
  (ctx: {
    reply?: any,
    scene?: any,
    message?: any,
    callbackQuery?: any,
    wizard?: {
      next?: any,
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    if (ctx.callbackQuery.message.message_id == DateCalendar.chats.get(ctx.callbackQuery.message.chat.id)) {
      const res: any = DateCalendar.clickButtonCalendar(ctx.callbackQuery);
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

    } else if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
      ctx.reply('Любая информация');
    } else {
      ctx.reply('Возврат в начало меню');
      ctx.reply({ reply_markup: { remove_keyboard: true } });
      return ctx.scene.leave();
    }
  },
  (ctx: {
    reply?: any,
    scene?: any,
    message?: any,
    callbackQuery?: any,
    wizard?: {
      state?: {
        createOrderData?: ORDER_DATA
      }
    }
  }) => {
    if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
      if (regexEmail.test(ctx.message.text)) {
        ctx.wizard.state.createOrderData.email = ctx.message.text;
        const orderData: any = ctx.wizard.state.createOrderData;
        orderData.email = ctx.message.text;
        console.log(orderData)
        console.log(ctx.wizard.state.createOrderData);
        const formData = new FormData();
        for (var key in orderData) {
          formData.append(key, orderData[key]);
        }

        fetch('https://wizard.studcrm.ru/api/createOrderFull/', {
          method: 'POST',
          body: formData
        })
          .then((response: any) => response.text())
          .then(data => {
            console.log(data);
            ctx.reply('Отлично ваш заказ создан, скоро с вами свяжется наш менедеджер');
            ctx.reply(`Информация по вашему заказу:\nСроки - ${orderData.date}\nКол-во страниц - ${orderData.pages}\nТема работы - ${orderData.theme}\nТип работы - ${orderData.type_of_work}\nПредмет - ${orderData.course}`);
            return ctx.scene.leave();
          })
          .catch(error => {
            console.error(error);
            ctx.reply('Ошибка заказа!');
            ctx.reply({ reply_markup: { remove_keyboard: true } });
            return ctx.scene.leave();
          });
      } else {
        ctx.reply('Неверный email');
      }
    } else {
      ctx.reply('Возврат в начало меню');
      ctx.reply({ reply_markup: { remove_keyboard: true } });
      return ctx.scene.leave();
    }
  }
);

export default createOrderDataWizard;