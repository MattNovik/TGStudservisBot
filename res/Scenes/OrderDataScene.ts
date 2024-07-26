import { orderFirstStep, orderSecondStep, orderThirdStep } from "../functions/scenesSteps.js";
import { Scenes } from "telegraf";

const orderDataWizard = new Scenes.WizardScene(
  'ORDER_ID_SCENE',
  (ctx: any) => orderFirstStep(ctx),
  (ctx: any) => orderSecondStep(ctx),
  (ctx: any) => orderThirdStep(ctx)
);

export default orderDataWizard;