const AWS = require("aws-sdk");
AWS.config.region = "eu-central-1";
const crypto = require("crypto");
const codebuild = new AWS.CodeBuild({ apiVersion: '2016-10-06' });

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const authorizedUsers = process.env.AUTHORIZED_USERS;

const validateSlackRequest = (event, signingSecret) => {
  let requestBody = event["body"];
  const headers = makeLower(event.headers);
  const timestamp = headers["x-slack-request-timestamp"];
  const slackSignature = headers["x-slack-signature"];
  if (event.isBase64Encoded) {
    let buff = new Buffer.from(requestBody, "base64");
    requestBody = buff.toString("ascii");
  }
  const baseString = "v0:" + timestamp + ":" + requestBody;
  let hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");
  let computedSlackSignature = "v0=" + hmac;
  let isValid = computedSlackSignature === slackSignature;
  if (!isValid) {
    hmac = crypto.createHmac("sha256", process.env.testingSigningSecret).update(baseString).digest("hex");
    computedSlackSignature = "v0=" + hmac;
    isValid = computedSlackSignature === slackSignature;
  }
  return isValid;
};

const makeLower = (headers) => {
  let lowerCaseHeaders = {};

  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      lowerCaseHeaders[key.toLowerCase()] = headers[key].toLowerCase();
    }
  }
  return lowerCaseHeaders;
};


const bodyParser = (body) => {
  let command = body.replace("%2F", "/");
  command = command.replace("%2F", ":");
  const tokens = command.split("&")
  let cmdParams = {};
  for (let token of tokens) {
    const params = token.split("=")
    cmdParams[params[0]] = params[1];
  }
  console.log(cmdParams)
  return cmdParams
}

exports.handler = async (event, context, callback) => {

  if (validateSlackRequest(event, slackSigningSecret)) {
    const cmd = bodyParser(event.body);
    if (authorizedUsers.includes(cmd.user_name)) {
      if (cmd.text != '' && cmd.text != null || cmd.text) {
        const command = cmd.text.split('+')[0]
        const testCase = cmd.text.split('+')[1]
        if (command === 'run' ) {
          if (testCase != '' && testCase != null || testCase){
          const build = {
            projectName: process.env.ACCEPTANCE_TESTING_CODEBUILD_PROJECT,
            environmentVariablesOverride: [
              {
                name: 'TEST_SET_NAME',
                value: testCase,
                type: "PLAINTEXT"
              },
              {
                name: 'REQUEST_SENDER',
                value: cmd.user_name,
                type: "PLAINTEXT"
              }
            ],
          };
          let response = await codebuild.startBuild(build).promise();
          const executionURL = "https://" + process.env.AWS_REGION + ".console.aws.amazon.com/codesuite/codebuild/" + process.env.AWS_ACCOUNT_ID + "/projects/" + process.env.ACCEPTANCE_TESTING_CODEBUILD_PROJECT + "/build/" + process.env.ACCEPTANCE_TESTING_CODEBUILD_PROJECT + "%3A" + response.build.id.split(':')[1] + "/?region=" + process.env.AWS_REGION
          console.log(executionURL)
          callback(null, {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: ":rocket: Test Case Execution Started... \n <" + executionURL + "|View Execution Logs>",
                  },
                },
              ],
            }),
          });
        }else{
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: ":warning: Enter Valid Test Case Name",
                  },
                },
              ],
            })
          });

        }

        }
        if (command === 'list'){
          //TODO Get List of Test cases
          callback(null, {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "Available Test Cases\n*smoketest*",
                  },
                },
              ],
            }),
          });

        }
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: ":warning: Enter Valid Command",
                },
              },
            ],
          })
        });

      }



    } else {
      callback(null, {
        statusCode: 200,
        body: ':x: Unauthorized User !'
      });
    }
  } else {
    callback(null, {
      statusCode: 200,
      body: ":warning: Invalid Request Signature",
    });
  }
};