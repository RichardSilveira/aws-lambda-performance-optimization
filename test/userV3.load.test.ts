import { check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export const options:Options = {
  scenarios: {
    ramp_up: {
      executor: 'per-vu-iterations',
      vus: 20,
      iterations: 3,
      maxDuration: '5m',
      startTime: '0s',
    },
    cold_start: {
      executor: 'per-vu-iterations',
      vus: 10,
      iterations: 2,
      startTime: '15m',
    },
    ramp_down: {
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 1,
      startTime: '20m',
    },
  },
};

const userRequest = {
  name: 'Richard Silveira',
  dob: '1986-07-10T17:12:19.688Z',
};

const urlBase = 'https://35bjvm3l7l.execute-api.us-east-2.amazonaws.com/dev/';

export default () => {
  const url = `${urlBase}/v3/users`;
  const res = http.post(url, JSON.stringify(userRequest));
  check(res, {
    'status is 200': () => res.status === 200,
  });
  // sleep(1);
};
