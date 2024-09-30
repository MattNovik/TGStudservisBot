import './instrument';
import { Scenes, session } from 'telegraf';
import { helpCommand, startCommand, managerCommand, nextCommand, payCommand, docCommand, reviewCommand, downloadCommand, garantyCommand, expensiveCommand, downloadWorkCommand, authorCommand, correctionsCommand, stateOrderInfo, enterCreateOrderScene } from './functions/commandFunction';
import { BOT_COMMANDS } from './data';
import BOT from './initBot';
import createOrderDataWizard from './Scenes/CreateOrderDataScene';
import orderDataWizard from './Scenes/OrderDataScene';
import { requestContact } from './functions/requestContacts';

let helpState: number = 1;

if (BOT) {
  BOT.command('ping', (ctx: any) => {
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

  BOT.action('state', stateOrderInfo);
  BOT.command('state', stateOrderInfo);

  BOT.action('create', enterCreateOrderScene);
  BOT.command('create', enterCreateOrderScene);

  BOT.action('contact', requestContact);
  BOT.command('contact', requestContact);

  BOT.launch();

  console.log('start app v.09');
} else {
  console.log('no bot intered');
}
