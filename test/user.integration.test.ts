import { SharedIniFileCredentials } from 'aws-sdk';
import { createOrUpdateUser } from '../src/userHandlerV1';

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
});
