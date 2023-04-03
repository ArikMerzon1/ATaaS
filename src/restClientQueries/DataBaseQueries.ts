import { injectable } from "tsyringe";
import { Claim } from "@exness/account-api/Claim";
import { AWSError, DynamoDB, SNS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

@injectable()
export default class DataBaseQueries {
  dynamoDB = new DynamoDB.DocumentClient();
  tableName = process.env.ACCOUNT_CLAIM_DB;
  sns: SNS = new SNS();

  async *findAllClaims(clientId: string): AsyncGenerator<Claim[]> {
    console.log("findAllClaims");
    let ExclusiveStartKey;
    do {
      // noinspection JSUnusedAssignment
      const queryResult = (await this.dynamoDB
        .query({
          ExclusiveStartKey,
          TableName: "Account-Claim-DEV",
          KeyConditionExpression: "clientId = :clientId",
          ExpressionAttributeValues: {
            ":clientId": clientId,
          },
        })
        .promise()) as PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>;
      yield queryResult.Items as Claim[];

      ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } while (ExclusiveStartKey);
  }

  async *findClaim(clientId: string, externalClaimRef: string): AsyncGenerator<Claim[]> {
    let ExclusiveStartKey;

    do {
      // noinspection JSUnusedAssignment
      const queryResult = (await this.dynamoDB
        .query({
          ExclusiveStartKey,
          TableName: "Account-Claim-DEV",
          KeyConditionExpression: "clientId = :clientId and externalClaimRef = :externalClaimRef",
          ExpressionAttributeValues: {
            ":clientId": clientId,
            ":externalClaimRef": externalClaimRef,
          },
        })
        .promise()) as PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>;
      yield (queryResult.Items as Claim[]) || [];

      ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } while (ExclusiveStartKey);
  }
}
