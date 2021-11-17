import User from './user';

export const sleep = async (time: number) => new Promise((res) => setTimeout(res, time));
export const getDummyUser = () => Object.assign(new User(), { name: 'Richard Silveira' });
