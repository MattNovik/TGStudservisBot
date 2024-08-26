import { regexEmail, getRndInteger } from "../utils";
import { ACTION_SCENE_OUT } from "../data";

const orderFirstStep = (ctx: any) => {
  ctx.reply('Для авторизации введите ваш email (любой, пока нет авторизации)');
  return ctx.wizard.next();
};

const orderSecondStep = (ctx: any) => {
  if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
    if (regexEmail.test(ctx.message.text)) {
      ctx.reply('Введите номер заказа (любые 6 цифр)');
      ctx.wizard.state.orderData = {
        order_id: null
      };
      return ctx.wizard.next();
    } else {
      return ctx.reply('Неверный email');
    }
  } else {
    console.log('leave here');
    ctx.reply('Возврат в начало меню');
    ctx.reply({ reply_markup: { remove_keyboard: true } });
    return ctx.scene.leave();

  }

};

const orderThirdStep = (ctx: any) => {
  if (ctx && ctx.message && ctx.message.text && !ACTION_SCENE_OUT.includes(ctx?.message?.text)) {
    if (ctx.message.text.length < 6 || isNaN(Number(ctx.message.text))) {
      return ctx.reply('Пожалуйста введине реальный номер заказа');

    }
    ctx.wizard.state.orderData.order_id = ctx.message.text;
    ctx
      .reply('Вертим шестеренки и проверяем данные')
      .then(() => {
        fetch('https://tgbotstudv2.free.beeceptor.com/order/', {
          method: 'GET',
        })
          .then((response: any) => response.json())
          .then((data: any) => {
            const result = data.orders[getRndInteger(0, data.orders.length - 1)];
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
            ctx.reply({ reply_markup: { remove_keyboard: true } });
            return ctx.scene.leave();
          });
      });
  } else {
    ctx.reply('Возврат в начало меню');
    ctx.reply({ reply_markup: { remove_keyboard: true } });
    return ctx.scene.leave();
  }
}

export { orderFirstStep, orderSecondStep, orderThirdStep };