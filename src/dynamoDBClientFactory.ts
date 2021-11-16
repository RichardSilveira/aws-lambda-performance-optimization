/* eslint-disable import/no-extraneous-dependencies */
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Credentials, DynamoDB } from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

const AWS = AWSXRay.captureAWS(require('aws-sdk'));

export const createDataMapperInstance = (region: string, credentials: Credentials = new AWS.EnvironmentCredentials('AWS')) => {
  const dynamoDBOptions: AWS.DynamoDB.ClientConfiguration = {
    region,
    credentials,
    maxRetries: 1,
    logger: console,
  };

  console.log(dynamoDBOptions);

  console.time('DynamoDB-INIT');
  const client = new DynamoDB(dynamoDBOptions);
  console.timeEnd('DynamoDB-INIT');

  return new DataMapper({ client });
};
