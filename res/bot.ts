import './instrument';
import { Scenes, session } from 'telegraf';
import { checkorderInfoRequest, checkCreateOrderRequest, checkRequest, helpCommand, startCommand, managerCommand, nextCommand, payCommand, docCommand, reviewCommand, downloadCommand, garantyCommand, expensiveCommand, downloadWorkCommand, authorCommand, correctionsCommand, enterOrderScene, enterCreateOrderScene } from './functions/commandFunction';
import { BOT_COMMANDS } from './data';
import BOT from './initBot';
import createOrderDataWizard from './Scenes/CreateOrderDataScene';
import orderDataWizard from './Scenes/OrderDataScene';
import express from "express";

let helpState: number = 1;
const app = express();
const port = 3080;

if (BOT) {
  BOT.command('ping', ctx => {
    ctx.reply('Pong!')
  });

  BOT.telegram.setMyCommands(BOT_COMMANDS);

  BOT.action('start', startCommand);
  BOT.command('start', startCommand);

  // main command
  BOT.command('help', (ctx: any) => {
    helpState = 1;
    helpCommand(ctx);
  });
  BOT.action('help', (ctx: any) => {
    helpState = 1;
    helpCommand(ctx);
  });

  BOT.command('manager', managerCommand);
  BOT.action('manager', managerCommand);


  BOT.command('checkRequest', checkRequest);
  BOT.action('checkRequest', checkRequest);

  BOT.command('checkCreateOrderRequest', checkCreateOrderRequest);
  BOT.action('checkCreateOrderRequest', checkCreateOrderRequest);

  BOT.command('checkorderInfoRequest', (ctx) => checkorderInfoRequest(ctx, { telegram_id: null, order_id: 1 }));
  BOT.action('checkorderInfoRequest', (ctx) => checkorderInfoRequest(ctx, { telegram_id: null, order_id: 1 }));

  BOT.action('next', (ctx: any) => {
    nextCommand(ctx, helpState);
    helpState++;
  });

  BOT.action('pay', payCommand);
  BOT.action('doc', docCommand);
  BOT.action('review', reviewCommand);
  BOT.action('download', downloadCommand);
  BOT.action('garanty', garantyCommand);
  BOT.action('expensive', expensiveCommand);
  BOT.action('downloadWork', downloadWorkCommand);
  BOT.action('author', authorCommand);
  BOT.action('corrections', correctionsCommand);

  const stage = new Scenes.Stage([orderDataWizard, createOrderDataWizard]);

  BOT.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
  BOT.use(stage.middleware());

  BOT.action('state', enterOrderScene);
  BOT.command('state', enterOrderScene);

  BOT.action('create', enterCreateOrderScene);
  BOT.command('create', enterCreateOrderScene);

  BOT.launch();

  console.log('start app v.09');
} else {
  console.log('no bot intered');
}

app.get("/health", (req: any, res: any) => res.send({ status: "ok" }));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
