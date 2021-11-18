/* eslint-disable import/no-extraneous-dependencies */
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Credentials, DynamoDB } from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

import https from 'https';

const AWS = AWSXRay.captureAWS(require('aws-sdk'));

export const createDataMapperInstance = (region: string, keepAlive: boolean, credentials: Credentials = new AWS.EnvironmentCredentials('AWS')) => {
  let dynamoDBOptions: AWS.DynamoDB.ClientConfiguration = {
    region,
    credentials,
    maxRetries: 1,
    logger: console,
  };

  if (keepAlive) {
    const agent = new https.Agent({
      keepAlive: true,
      // Infinity is read as 50 sockets
      maxSockets: Infinity,
    });

    dynamoDBOptions = {
      ...dynamoDBOptions,
      httpOptions: {
        agent,
      },
    };
  }

  console.time('DynamoDB-create-instance');
  const client = new DynamoDB(dynamoDBOptions);
  const mapper = new DataMapper({ client });
  console.timeEnd('DynamoDB-create-instance');

  const { httpOptions } = client.config;
  console.log({ httpOptions, mapper });

  return mapper;
};
