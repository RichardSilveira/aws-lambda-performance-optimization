import { SharedIniFileCredentials } from 'aws-sdk';
import { createOrUpdateUser } from '../src/userHandlerV1';
import User from '../src/user';
import { getDummyUser } from '../src/common';
import { createDataMapperInstance } from '../src/dynamoDBClientFactory';

const credentials = new SharedIniFileCredentials({ profile: 'default' });

describe('Create User scenarios', () => {
  const context = { customCredentials: credentials };

  it('Given a valid user inputs, should create a new user', async () => {
    const userRequest = {
      name: 'Richard Silveira',
      dob: '1986-07-10T17:12:19.688Z',
    };

    const event = { body: JSON.stringify(userRequest) };
    const createUserCommand = createOrUpdateUser;

    const { statusCode, body } = await createUserCommand(event, context);

    const { data } = JSON.parse(body);
    console.log(data);

    expect(statusCode).toBe(200);

    expect(data?.name)
      .toBe(userRequest.name);
  });

  it('Should make a dummy invocation to be used in the INIT context', async () => {
    const mapper = createDataMapperInstance(process.env.REGION, false, credentials);
    const receivedDummyUser = await mapper.get<User>(getDummyUser());
    expect(receivedDummyUser.name).toBe('Richard Silveira'); // Dummy PK
  });
});
