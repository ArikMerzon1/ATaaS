const AWS = require("aws-sdk");
AWS.config.region = "eu-central-1";
const codebuild = new AWS.CodeBuild({ apiVersion: '2016-10-06' });
const axios = require("axios");

exports.handler = async (event, context) => {
    const slackWebhookURL = process.env.ACCEPTANCE_TESTING_SLACK_WEBHOOK
    const build = {
    projectName: process.env.ACCEPTANCE_TESTING_CODEBUILD_PROJECT,
    environmentVariablesOverride: [
        {
            name: 'TEST_SET_NAME',
            value: 'smoketest',
            type: "PLAINTEXT"
        },
        {
            name: 'REQUEST_SENDER',
            value: "Job Scheduler",
            type: "PLAINTEXT"
        }
    ],
    };
    const response = await codebuild.startBuild(build).promise();
    const executionURL = "https://" + process.env.AWS_REGION + ".console.aws.amazon.com/codesuite/codebuild/" + process.env.AWS_ACCOUNT_ID + "/projects/" + process.env.ACCEPTANCE_TESTING_CODEBUILD_PROJECT + "/build/" + process.env.ACCEPTANCE_TESTING_CODEBUILD_PROJECT + "%3A" + response.build.id.split(':')[1] + "/?region=" + process.env.AWS_REGION
    console.log(executionURL)
    let text = ":rocket: Automated Test Case Execution Started... Testcase: *smoketest*\n <" + executionURL + "|View Execution Logs>"
    await axios.post(slackWebhookURL, {text: text});

}

    