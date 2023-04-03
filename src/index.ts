import { handlerDecorator } from "@exness/logger";
import sqsHandlerFactory from "@exness/sqs-handler";

import assembly from "./assembly";

export const handler = handlerDecorator(sqsHandlerFactory(assembly.getMessageHandler));

export default handler;
