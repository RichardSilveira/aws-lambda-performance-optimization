import { APIGatewayProxyEvent } from 'aws-lambda';
import { SharedIniFileCredentials } from 'aws-sdk';
import { createUser, listUsers } from '../src/userHandler';

const credentials = new SharedIniFileCredentials({ profile: 'default' });

describe('Create User scenarios', () => {
  const context = { customCredentials: credentials };

  it('Given a valid user inputs, should create a new user', async () => {
    const userRequest = {
      name: 'Richard Silveira',
      dob: '1986-07-10T17:12:19.688Z',
    };

    const event = { body: { ...userRequest } };
    const createUserCommand = createUser;

    const { statusCode, body } = await createUserCommand(event, context);

    const { data } = JSON.parse(body);
    console.log(data);

    expect(statusCode).toBe(200);

    expect(data?.name)
      .toBe(userRequest.name);
  });
});
describe('Unit tests for the hello function to check the overall template\' setup integrity', () => {
  it('When the hello function is invoked, Should returns a \'200\' success status code', async () => {
    const event: APIGatewayProxyEvent = {
      httpMethod: 'GET',
      queryStringParameters: {
        foo: 'bar',
      },
    } as any;

    const result = await listUsers(event);

    expect(result.statusCode).toEqual(200);
  });
});
