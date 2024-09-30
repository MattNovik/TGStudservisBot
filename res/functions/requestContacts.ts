const requestContact = (ctx: any) => {
  return ctx.reply('Пожалуйста поделитесь вашим номером, для того что бы мы могли отправить вам информацию по заказу', {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [{
          text: "Номер телефона",
          request_contact: true
        },
        {
          text: "Отмена"
        }],
      ],
    }
  })
};

export { requestContact };