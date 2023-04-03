import logger from "@receeve-gmbh/logger";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

import ITestSuiteDefinitionDAO from "./ITestSuiteDefinitionDAO";
import TestSuite from "../entities/TestSuite";

const log = logger("dao:DynamoTestSuiteDefinitionDAO");

export default class DynamoTestSuiteDefinitionDAO implements ITestSuiteDefinitionDAO {
  public constructor(readonly dynamoDB: DocumentClient, readonly tableName: string) {}

  public async upsert(clientId: string, data: TestSuite): Promise<void> {
    console.log("Inserting test suite definition", { clientId, data });

    await this.dynamoDB
      .put({
        TableName: this.tableName,
        Item: {
          ...data,
          clientId,
        },
      })
      .promise();
  }

  public async update(clientId: string, data: TestSuite): Promise<void> {
    const { testSuiteId, ...patch } = data;
    console.log("Updating test suite definition", { clientId, data });

    // Ref: https://github.com/receeve-gmbh/LandingPage/blob/master/ReadSide/src/dao/ReadSideDynamoDAO.ts
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

    try {
      await this.dynamoDB
        .update({
          TableName: this.tableName,
          Key: {
            clientId,
            testSuiteId,
          },
          ReturnValues: "ALL_NEW",
          UpdateExpression: updateExpressionString,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        })
        .promise();
    } catch (error) {
      log.error("Update error", {
        error,
        updateExpressionString,
        expressionAttributeNames,
        expressionAttributeValues,
      });
    }
  }

  public async find(clientId: string, testSuiteId: string): Promise<TestSuite | null> {
    console.log("Searching test suite definition", { clientId, testSuiteId });

    try {
      const queryResult = await this.dynamoDB
        .get({
          TableName: this.tableName,
          Key: {
            clientId,
            testSuiteId,
          },
        })
        .promise();

      if (!queryResult.Item) {
        return null;
      }

      return queryResult.Item as TestSuite;
    } catch (error) {
      log.error("Find error", { error });
      return null;
    }
  }

  public async findAll(clientId: string): Promise<TestSuite[]> {
    const query: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#clientId= :clientId",
      ExpressionAttributeNames: {
        "#clientId": "clientId",
      },
      ExpressionAttributeValues: {
        ":clientId": clientId,
      },
    };

    try {
      const { Items } = await this.dynamoDB.query(query).promise();

      console.log("FindAll", { query, Items });

      if (!Items) {
        return [];
      }

      return Items as TestSuite[];
    } catch (error) {
      log.error("FindAll error", { query, error });
      return [];
    }
  }

  public async delete(clientId: string, testSuiteId: string): Promise<void> {
    console.log("Deleting Test Suite definition", { clientId, testSuiteId });

    try {
      await this.dynamoDB
        .delete({
          TableName: this.tableName,
          Key: {
            clientId,
            testSuiteId,
          },
        })
        .promise();
    } catch (error) {
      log.error(error.message || error, { clientId, testSuiteId });

      throw error;
    }
  }
}
