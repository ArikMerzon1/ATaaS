import { handlerDecorator } from "@receeve-gmbh/logger";
import sqsHandlerFactory from "@receeve-gmbh/sqs-handler";

import assembly from "./assembly";

export const handler = handlerDecorator(sqsHandlerFactory(assembly.getMessageHandler));

export default handler;
