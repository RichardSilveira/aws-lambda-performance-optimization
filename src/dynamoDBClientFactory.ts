/* eslint-disable import/no-extraneous-dependencies */
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Credentials, DynamoDB } from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

export const createDataMapperInstance = (region: string, credentials?: Credentials) => {
  let dynamoDBOptions: DynamoDB.ClientConfiguration = {
    region,
    httpOptions: {
      timeout: 3000,
    },
    maxRetries: 1,
    logger: console,
  };

  if (credentials) {
    dynamoDBOptions = {
      ...dynamoDBOptions, credentials,
    };
  }

  console.log(dynamoDBOptions);
  const client = new DynamoDB(dynamoDBOptions);
  AWSXRay.captureAWSClient(client);

  return new DataMapper({
    client, // the SDK client used to execute operations
  });
};
