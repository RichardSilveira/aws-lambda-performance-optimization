/* eslint-disable import/no-extraneous-dependencies */
import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { AttributeValue } from 'aws-sdk/clients/dynamodb';
import { CustomType } from '@aws/dynamodb-data-marshaller';

const dateType: CustomType<Date> = {
  type: 'Custom',
  marshall: (input: Date): AttributeValue => ({ S: input.toISOString() }),
  unmarshall: (persistedValue: AttributeValue): Date => new Date(persistedValue.S!),
};

@table('users-table')
export default class User {
  @hashKey()
  name: string;

  @attribute(dateType)
  dob?: Date;

  @attribute(dateType)
  createdAt:Date;

  @attribute(dateType)
  updatedAt?:Date;

  static Factory = {
    createUser({
      name, dob,
    }:{ name:string, dob?:Date }) {
      const user = new User();
      user.name = name;

      if (dob) {
        if (dob > new Date()) throw new Error('You should not inform a birth date greater than today date unless you came from the future, but the app isn\'t prepared for that yet, sorry. Go back to your original timeline, please');
        user.dob = new Date(dob);
      }

      user.createdAt = new Date(Date.now());

      return user;
    },
  };
}
// parameterless constructor required by the lib
