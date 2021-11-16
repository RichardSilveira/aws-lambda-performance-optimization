/* eslint-disable import/no-extraneous-dependencies */
// import AWS from 'aws-sdk';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import User from './user';
import { createDataMapperInstance } from './dynamoDBClientFactory';

// const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// AWS.config.logger = console;

const { REGION } = process.env;

function logMetadata() {
  console.log('environment variables:', { REGION });
}

// const defaultCredentials = new AWS.EnvironmentCredentials('AWS');

// To reuse this instance across multiple invocations of this lambda function (Cold start issue)
// let mapper = createDataMapperInstance(REGION, defaultCredentials);
let mapper = createDataMapperInstance(REGION);

export const createUser = async (event, context) => {
  logMetadata();
  console.log(event.body);

  try {
  // Integration tests - To allow us override both credentials + mapper instance
    if (context?.customCredentials) {
      mapper = createDataMapperInstance(REGION, context.customCredentials);
    }

    const userRequest = JSON.parse(event.body);
    console.log(userRequest);

    const newUser = User.Factory.createUser({ ...userRequest });

    console.log({ userRequest, newUser });
    console.log(JSON.stringify(mapper));

    const registeredUser = await mapper.put(newUser);
    console.log(registeredUser);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: registeredUser,
      }),
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const listUsers = async (): Promise<APIGatewayProxyResult> => {
  logMetadata();

  // const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: REGION });
  const docClient = new DynamoDB.DocumentClient({ region: REGION });
  const tableName = 'users-table';

  const params = {
    TableName: tableName,
    Key: {
      name: 'Mario Duran',
    },
  };

  console.log('getting results...');
  let result:any = {};
  try {
    console.log(docClient);
    result = await docClient.get(params).promise();
  } catch (e) {
    console.log(e);
  }
  console.log(result, result);
  const items = result.Item;

  return {
    statusCode: 200,
    body: JSON.stringify({
      items,
    },
    null,
    2),
  };
};
