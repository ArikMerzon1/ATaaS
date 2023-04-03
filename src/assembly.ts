// import AWS, { DynamoDB, SNS } from "aws-sdk";
import { Handler } from "@receeve-gmbh/sqs-handler";
// import { MessageEmitter } from "@receeve-gmbh/emit-message";

// import DynamoRunningTestSuiteDAO from "./dao/DynamoRunningTestSuiteDAO";
// import DynamoTestSuiteDefinitionDAO from "./dao/DynamoTestSuiteDefinitionDAO";
// import CmdTestSuiteCheckV1Handler from "./handlers/cmd.testSuite.check.v1";
// import CmdTestSuiteSetV1Handler from "./handlers/cmd.testSuite.set.v1";
// import CmdTestSuiteDeleteV1Handler from "./handlers/cmd.testSuite.delete.v1";
// import CmdTestSuiteStartV1Handler from "./handlers/cmd.testSuite.start.v1";
// import EventTestSuiteSetV1Handler from "./handlers/event.testSuite.set.v1";
// import EventTestSuiteDeleteV1Handler from "./handlers/event.testSuite.deleted.v1";
// import EventTestStepExecutedV1Handler from "./handlers/event.testStep.executed.v1";
// import QueryTestSuiteGetV1Handler from "./handlers/query.testSuite.get.v1";
// import QueryTestSuiteListGetV1Handler from "./handlers/query.testSuiteList.get.v1";

// AWS.config.update({
//   httpOptions: { connectTimeout: 10000, timeout: 5000 },
//   maxRetries: 3,
//   retryDelayOptions: { base: 500 },
// });

// const sns: SNS = new SNS();
// const dynamoDB = new DynamoDB.DocumentClient({
//   convertEmptyValues: true,
// });

// const testSuiteDefinitionDAO = new DynamoTestSuiteDefinitionDAO(
//   dynamoDB,
//   `${process.env.DEFINITION_TABLE_NAME}`
// );
// const runningTestSuiteDAO = new DynamoRunningTestSuiteDAO(
//   dynamoDB,
//   `${process.env.RUNNING_TABLE_NAME}`
// );
// const messageEmitter = new MessageEmitter({ sns });

interface Handlers {
  [handlerName: string]: Handler<unknown>;
}

const handlers: Handlers = {
  // "cmd.testSuite.start.v1": new CmdTestSuiteStartV1Handler(
  //   testSuiteDefinitionDAO,
  //   runningTestSuiteDAO,
  //   messageEmitter
  // ),
  // "cmd.testSuite.check.v1": new CmdTestSuiteCheckV1Handler(runningTestSuiteDAO, messageEmitter),
  // "cmd.testSuite.set.v1": new CmdTestSuiteSetV1Handler(messageEmitter),
  // "cmd.testSuite.delete.v1": new CmdTestSuiteDeleteV1Handler(messageEmitter),
  // "event.testSuite.set.v1": new EventTestSuiteSetV1Handler(testSuiteDefinitionDAO),
  // "event.testStep.executed.v1": new EventTestStepExecutedV1Handler(runningTestSuiteDAO),
  // "event.testSuite.deleted.v1": new EventTestSuiteDeleteV1Handler(testSuiteDefinitionDAO),
  // "query.testSuite.get.v1": new QueryTestSuiteGetV1Handler(testSuiteDefinitionDAO),
  // "query.testSuiteList.get.v1": new QueryTestSuiteListGetV1Handler(testSuiteDefinitionDAO),
};

const allowedDirectHandlers: Handlers = [
  "cmd.testSuite.start.v1",
  "cmd.testSuite.set.v1",
  "cmd.testSuite.delete.v1",
  "query.testSuite.get.v1",
  "query.testSuiteList.get.v1",
].reduce(
  (handlerAggregator, allowedHandlerName) => ({
    ...handlerAggregator,
    [allowedHandlerName]: handlers[allowedHandlerName],
  }),
  {}
);

export default {
  getMessageHandler: (messageName: string) => handlers[messageName],
  getDirectMessageHandler: (messageName: string) => allowedDirectHandlers[messageName],
};
