jest.dontMock('../lib/translate.service');
import { TranslateService } from '../lib/translate.service';
import { createMock } from '@testing-library/angular/jest-utils';

export const langChangeUnsubscribeMock = jest.fn();
export const langChangeSubscribeMock = jest.fn(() => ({
  unsubscribe: langChangeUnsubscribeMock,
}));
export const translationChangeUnsubscribeMock = jest.fn();
export const translationChangeSubscribeMock = jest.fn(() => ({
  unsubscribe: translationChangeUnsubscribeMock,
}));

export const translateSer = createMock(TranslateService);
(translateSer as any).onLangChange = {
  subscribe: langChangeSubscribeMock,
};
(translateSer as any).onTranslationChange = {
  subscribe: translationChangeSubscribeMock,
};

export const getSafeMock = jest.fn(() => ({
  subscribe: jest.fn((resolve) => {
    resolve('translated');
  }),
}));
(translateSer as any).getSafe = getSafeMock;

export const getMock = jest.fn(() => ({
  subscribe: jest.fn((resolve) => {
    resolve('translated');
  }),
}));
(translateSer as any).get = getMock;
