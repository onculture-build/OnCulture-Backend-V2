import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { BrowserEvents, MediaTypes } from '../enums';
import { GeneratePdfOptions } from '../interfaces';
import puppeteer from 'puppeteer';
import { customAlphabet } from 'nanoid';
import * as _ from 'lodash';
import 'reflect-metadata';

const CUSTOM_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class AppUtilities {
  public static generateShortCode(charLen = 6): string {
    const nanoid = customAlphabet(CUSTOM_CHARS, charLen);

    return nanoid();
  }

  public static secondsToMilliseconds(seconds: number) {
    return seconds * 1000;
  }

  public static generatePassword(passLen = 15): string {
    const specialChars = [
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '-',
      '_',
      '+',
      '=',
      '<',
      '>',
      '?',
    ];
    const uppercase = faker.string.alpha({ length: 1, casing: 'upper' });
    const lowercase = faker.string.alpha({ length: 1, casing: 'lower' });
    const digit = faker.string.numeric(1);
    const specialChar = faker.helpers.arrayElement(specialChars);

    const allChars = uppercase + lowercase + digit + specialChar;

    const remainingChars = faker.string.alphanumeric(passLen - allChars.length);

    const password = faker.helpers.shuffle(
      (allChars + remainingChars).split(''),
    );

    return password.join('');
  }

  public static convertEnumToObject(enumData: any) {
    return Object.entries(enumData).map(([key, value]) => ({
      label: value as string,
      value: key,
    }));
  }

  private removeIdSuffix(key: string, suffix = 'Id'): string {
    const val = key.endsWith(suffix) ? key.slice(0, -suffix.length) : key;

    return val.trim();
  }

  public static cleanCourses(courses: any[]): any[] {
    return courses.reduce((arr, cur) => {
      if (cur.module.length) {
        const course = {
          id: cur._id,
          createdAt: cur._createdAt,
          title: cur.title,
          author: cur.author?.name,
          modules: cur.module.map((mod) => ({
            id: mod._id,
            moduleName: mod.moduleName,
            moduleTitle: mod.moduleTitle,
            lessons: mod.lesson.map((lesson) => ({
              id: lesson._id,
              type: lesson._type,
              lessonName: lesson.lessonName,
              lessonTitle: lesson.lessonTitle,
            })),
          })),
        };

        arr.push(course);
      }
      return arr;
    }, []);
  }

  public static async streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return Buffer.concat(chunks);
  }

  public static toCamelCase(str: string) {
    str = str.toLowerCase().trim();
    str = str.replace(/[\s_]+/g, '-');
    return str.replace(/(^|-)([a-z])/g, (_, separator, letter, index) =>
      index === 0 ? letter : letter.toUpperCase(),
    );
  }

  public static unflatten = (flattedObject: any) => {
    const result = {};
    _.keys(flattedObject).forEach(function (key) {
      _.set(result, key, flattedObject[key]);
    });
    return result;
  };

  public static handleException(error: any): Error {
    console.error(AppUtilities.requestErrorHandler(error));

    const errorCode: string = error.code;
    const message: string = error.meta
      ? error.meta.cause
        ? error.meta.cause
        : error.meta.field_name
          ? error.meta.field_name
          : error.meta.column
            ? error.meta.table
            : error.meta.table
      : error.message;
    switch (errorCode) {
      case 'P0000':
      case 'P2003':
      case 'P2004':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        return new NotFoundException(message);
      case 'P2005':
      case 'P2006':
      case 'P2007':
      case 'P2008':
      case 'P2009':
      case 'P2010':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2014':
      case 'P2016':
      case 'P2017':
      case 'P2019':
      case 'P2020':
      case 'P2021':
      case 'P2022':
      case 'P2023':
      case 'P2026':
      case 'P2027':
        return new BadRequestException(message);
      case 'P2024':
        return new RequestTimeoutException(message);
      case 'P0001':
        return new UnauthorizedException(message);
      case 'P2002':
        const msg = `Conflict Exception: '${error.meta?.target?.[0]}' already exists!`;
        return new ConflictException(error.meta?.target?.[0] ? msg : message);
      default:
        console.error(message);
        if (!!message && message.toLocaleLowerCase().includes('arg')) {
          return new BadRequestException(
            'Invalid/Unknown field was found in the data set!',
          );
        } else {
          return error;
        }
    }
  }

  public static async hashAuthSecret(secret: string) {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(secret, salt);
  }

  public static async validatePassword(
    password: string,
    hashedPassword: string,
  ) {
    return bcrypt.compare(password, hashedPassword);
  }

  public static removeExtraSpacesAndLowerCase(item: string) {
    return item
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  public static removeSensitiveData(
    data: any,
    deleteKeys: any,
    remove?: boolean,
  ) {
    if (typeof data != 'object') return;
    if (!data) return;

    for (const key in data) {
      if (deleteKeys.includes(key)) {
        remove ? delete data[key] : (data[key] = '*************');
      } else {
        this.removeSensitiveData(data[key], deleteKeys, remove);
      }
    }

    return data;
  }

  public static transformObject(
    sourceObject: Record<string, any>,
    mappings: Record<string, any>,
  ): Record<string, any> {
    const transformedObject = {};

    Object.keys(mappings).forEach((key) => {
      const value = mappings[key];

      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedTransformed = AppUtilities.transformObject(
          sourceObject,
          value,
        );
        if (Object.keys(nestedTransformed).length > 0) {
          transformedObject[key] = nestedTransformed;
        }
      } else if (sourceObject.hasOwnProperty(value)) {
        transformedObject[key] = sourceObject[value];
      }
    });

    return transformedObject;
  }

  public static requestErrorHandler = (response: any = {}) => {
    const {
      message: errorMessage,
      response: serverResp,
      isCancel,
      isNetwork,
      config,
    } = response;

    let message = errorMessage,
      data: any = {},
      isServerError = false;

    if (serverResp?.data) {
      isServerError = true;
      message =
        serverResp.data?.error ||
        serverResp.data?.message ||
        'Unexpected error occurred!';
      data =
        typeof serverResp.data === 'object'
          ? { ...serverResp.data }
          : { data: serverResp.data };
      delete data.message;
    } else if (isCancel) {
      message = 'Request timed out.';
    } else if (isNetwork) {
      message = 'Network not available!';
    }

    const errorData = {
      message,
      isServerError,
      ...(isServerError && {
        data: {
          ...data,
          errorMessage,
          api: {
            method: config?.method,
            url: config?.url,
            baseURL: config?.baseURL,
          },
        },
      }),
    };

    return errorData;
  };

  public static async generatePdfFromUrl(
    url: string,
    options?: GeneratePdfOptions,
  ): Promise<Buffer> {
    // if (Array.isArray(url)) {
    //   return Promise.all(
    //     url.map((url) => AppUtilities.generatePdf({ url, options })),
    //   );
    // }
    return this.generatePdf({ url, options });
  }

  public static async generatePdfFromHtml(
    html: string,
    options?: GeneratePdfOptions,
  ): Promise<Buffer> {
    // if (Array.isArray(html)) {
    //   return Promise.all(
    //     html.map((content) =>
    //       AppUtilities.generatePdf({ html: content, options }),
    //     ),
    //   );
    // }
    return this.generatePdf({ html, options });
  }

  private static async generatePdf({
    html,
    url,
    options,
  }: {
    html?: string;
    url?: string;
    options?: GeneratePdfOptions;
  }) {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    if (html) {
      await page.setContent(html, {
        waitUntil: BrowserEvents.NETWORK_IDLE,
      });
    } else if (url) {
      await page.goto(url, { waitUntil: BrowserEvents.LOADED });
    }

    await page.emulateMediaType(MediaTypes.SCREEN);
    const pdf = await page.pdf(options);
    // close
    browser.close();

    return pdf;
  }

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data, encoding).toString();
  }
}
