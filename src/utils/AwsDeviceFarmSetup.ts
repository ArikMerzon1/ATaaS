import { inject, injectable } from "tsyringe";
import * as AWS from "aws-sdk";
import { HttpProvider } from "./httpProvider";
import { ITestGridSessions } from "./ITestGridSessions";
import { IAWSArtifact } from "./IAWSArtifact";

@injectable()
export default class AwsDeviceFarmSetup {
  private deviceFarm!: AWS.DeviceFarm;

  constructor(@inject(HttpProvider) private readonly httpProvider: HttpProvider) {}

  async getArtifacts(): Promise<IAWSArtifact[]> {
    const sessionParams = {
      projectArn: process.env.AWS_DF_ARN as string,
      status: "ACTIVE",
    };

    let sessionArn;
    const listTestGridSessions = await this.deviceFarm.listTestGridSessions(sessionParams).promise();
    if (listTestGridSessions.testGridSessions) {
      const jsonArn = JSON.parse(JSON.stringify(listTestGridSessions.testGridSessions)) as ITestGridSessions[];
      sessionArn = jsonArn[0].arn;
      console.log(`session ARN: ${jsonArn[0].arn}`);
    } else {
      throw Error("listTestGridSessions is empty!");
    }

    const artifactsParams = {
      sessionArn: `${sessionArn}`,
    };

    let artifacts: IAWSArtifact[];
    const listTestGridSessionArtifacts = await this.deviceFarm.listTestGridSessionArtifacts(artifactsParams).promise();
    if (await listTestGridSessionArtifacts.artifacts) {
      artifacts = JSON.parse(JSON.stringify(await listTestGridSessionArtifacts.artifacts));
      console.log(artifacts);
      return artifacts;
    }

    console.error("No artifacts found");
    throw Error("No artifacts found");
  }

  async deviceFarmSetup(): Promise<{
    path: string;
    hostname: string;
    protocol: string;
    port: number;
  }> {
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
    const AWS_DF_ARN = process.env.AWS_DF_ARN as string;

    const awsParams = {
      region: "us-west-2",
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };

    try {
      const testGrid = {
        hostname: `testgrid-devicefarm.${awsParams.region}.amazonaws.com`,
        port: 443,
        protocol: "https",
        path: "",
      };

      this.deviceFarm = new AWS.DeviceFarm(awsParams);
      const projectParams = {
        expiresInSeconds: 86400, // 14 minutes for `WebDriverError: URL has expired`
        projectArn: AWS_DF_ARN,
      };

      const data = await this.deviceFarm.createTestGridUrl(projectParams).promise();

      testGrid.path = data.url ? data.url : "";
      console.log(`Test Grid: ${testGrid.path}`);
      console.log(`Test Hostname: ${testGrid.hostname}`);
      return testGrid;
    } catch (error) {
      console.error(`ERROR: ${error}`);
      throw Error(error);
    }
  }
}
