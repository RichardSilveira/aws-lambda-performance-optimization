import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export const options:Options = {
  vus: 50,
  duration: '10s',
};

const userRequest = {
  name: 'Richard Silveira',
  dob: '1986-07-10T17:12:19.688Z',
};

const urlBase = 'https://35bjvm3l7l.execute-api.us-east-2.amazonaws.com/dev/';

export default () => {
  const url = `${urlBase}/v1/users`;
  const res = http.post(url, JSON.stringify(userRequest));
  check(res, {
    'status is 200': () => res.status === 200,
  });
  sleep(1);
};
