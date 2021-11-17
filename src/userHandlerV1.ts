import User from './user';
import { createDataMapperInstance } from './dynamoDBClientFactory';
import { sleep } from './common';

const { REGION } = process.env;

function logMetadata() {
  console.log('environment variables:', { REGION });
}

export const createOrUpdateUser = async (event, context) => {
  let mapper = createDataMapperInstance(REGION);
  logMetadata();
  console.log(event.body);

  // Integration tests - To allow us override both credentials + mapper instance
  if (context?.customCredentials) {
    mapper = createDataMapperInstance(REGION, context.customCredentials);
  }

  const userRequest = JSON.parse(event.body);

  const newUser = User.Factory.createUser({ ...userRequest });

  const registeredUser = await mapper.put(newUser);
  console.log(userRequest, registeredUser);

  await sleep(1000);

  console.log('second request just to check the dynamoDb latency');
  await mapper.put(newUser);
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: registeredUser,
    }),
  };
};
