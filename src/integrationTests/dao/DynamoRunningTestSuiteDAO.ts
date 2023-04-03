import logger from "@exness/logger";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

import moment from "moment";
import IRunningTestSuiteDAO from "./IRunningTestSuiteDAO";
import RunningTestSuite, { SerializedRunningTestSuite } from "../entities/RunningTestSuite";

const log = logger("dao:DynamoRunningTestSuiteDAO");

const KEY_SEPARATOR = "_";
const EXPIRES_AT = { minutes: 10 };

export default class DynamoRunningTestSuiteDAO implements IRunningTestSuiteDAO {
  public constructor(readonly dynamoDB: DocumentClient, readonly tableName: string) {}

  private serialize(clientId: string, { id, ...rest }: RunningTestSuite): SerializedRunningTestSuite {
    return {
      ...rest,
      clientIdANDExternalClaimRef: `${clientId}${KEY_SEPARATOR}${id}`,
    };
  }

  private deserialize({
    clientIdANDExternalClaimRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expiresAt, // extract but don't send, as it's dynamo specific
    ...rest
  }: SerializedRunningTestSuite): RunningTestSuite {
    return {
      ...rest,
      id: clientIdANDExternalClaimRef.split(KEY_SEPARATOR).pop() || "",
    };
  }

  public async upsert(clientId: string, data: RunningTestSuite): Promise<void> {
    console.log("Inserting running test suite", { clientId, data });
    const serializedData = this.serialize(clientId, data);
    serializedData.expiresAt = moment().add(serializedData.timeout).add(EXPIRES_AT).unix();

    await this.dynamoDB
      .put({
        TableName: this.tableName,
        Item: serializedData,
      })
      .promise();
  }

  public async update(clientId: string, data: RunningTestSuite): Promise<void> {
    console.log("Updating running test suite", { clientId, data });
    const serialized = this.serialize(clientId, data);
    const { clientIdANDExternalClaimRef, stepName, ...patch } = serialized;

    // Ref: https://github.com/exness/LandingPage/blob/master/ReadSide/src/dao/ReadSideDynamoDAO.ts
    let updateExpressionString = "SET";
    const expressionAttributeNames: { [s: string]: string } = {};
    const expressionAttributeValues: { [s: string]: string } = {};
    let isFirst = true;

    Object.entries(patch)
      .filter(([, item]) => item !== undefined && item !== "")
      .forEach(([key, item]) => {
        updateExpressionString = isFirst ? `${updateExpressionString} #${key} = :${key}` : `${updateExpressionString}, #${key} = :${key}`;
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = item as string;
        isFirst = false;
      });

    await this.dynamoDB
      .update({
        TableName: this.tableName,
        Key: {
          clientIdANDExternalClaimRef,
          stepName,
        },
        ReturnValues: "ALL_NEW",
        UpdateExpression: updateExpressionString,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise();
  }

  public async find(clientId: string, externalClaimRef: string, stepName: string): Promise<RunningTestSuite | null> {
    console.log("Searching running test suite", { clientId, externalClaimRef, stepName });

    try {
      const queryResult = await this.dynamoDB
        .get({
          TableName: this.tableName,
          Key: {
            clientIdANDExternalClaimRef: `${clientId}${KEY_SEPARATOR}${externalClaimRef}`,
            stepName,
          },
        })
        .promise();

      if (!queryResult.Item) {
        return null;
      }

      return this.deserialize(queryResult.Item as SerializedRunningTestSuite);
    } catch (error) {
      return null;
    }
  }

  public async *getRunningTestSuites(
    clientId: string,
    testSuiteId: string,
    options?: {
      limit: number;
    }
  ): AsyncGenerator<RunningTestSuite[]> {
    const { limit = 5000 } = options || {};

    try {
      let startKey: DocumentClient.Key | undefined;

      do {
        const params = {
          Limit: Math.max(limit, 0),
          TableName: this.tableName,
          ExclusiveStartKey: startKey,
          IndexName: "runningTestSuiteLookup",
          KeyConditionExpression: "#clientId= :clientId AND #testSuiteId= :testSuiteId",
          ExpressionAttributeNames: {
            "#clientId": "clientId",
            "#testSuiteId": "testSuiteId",
          },
          ExpressionAttributeValues: {
            ":clientId": clientId,
            ":testSuiteId": testSuiteId,
          },
        };

        console.log("Fetch running Test Suite steps params", { params });

        // eslint-disable-next-line no-await-in-loop
        const { Items, LastEvaluatedKey } = await this.dynamoDB.query(params).promise();

        if (!Items || !Items.length) {
          break;
        }

        yield Items.map((item) => this.deserialize(item as SerializedRunningTestSuite));

        startKey = LastEvaluatedKey;
      } while (startKey);
    } catch (error) {
      log.error("Error requesting running test suite steps from the table", {
        error,
        testSuiteId,
        limit,
      });
      throw error;
    }
  }
}
