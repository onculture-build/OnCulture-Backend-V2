import { Injectable } from '@nestjs/common';
import {
  buildMessage,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import moment from 'moment';

@Injectable()
@ValidatorConstraint({ name: 'IsBirthDate', async: true })
export class IsBirthDateRule implements ValidatorConstraintInterface {
  async validate(value: Date) {
    const theDate = moment(value);
    return theDate.isValid() && theDate.add(1, 'day').isBefore(moment());
  }

  defaultMessage(args: ValidationArguments) {
    const messageBuilder = buildMessage(
      (prefix) =>
        `${prefix}$property is not valid!!! ${prefix}$property must be less than today's date`,
    );

    return messageBuilder(args);
  }
}

export function IsBirthDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBirthDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsBirthDateRule,
    });
  };
}

export function isBirthDate(value?: Date) {
  const theDate = moment(value);
  return theDate.isValid() && theDate.add(1, 'day').isBefore(moment());
}
