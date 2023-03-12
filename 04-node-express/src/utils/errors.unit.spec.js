// DEPENDENCIES
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

// UTILS
import { appError } from './errors';
import { logger } from './logger';

jest.mock('./logger');
jest.mock('http-errors');

describe('Utils > Erros - Unit', () => {
  const DEFAULT_ERROR_MESSAGE = 'DEFAULT_ERROR_MESSAGE';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should execute logger.error.', () => {
    appError(DEFAULT_ERROR_MESSAGE);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(DEFAULT_ERROR_MESSAGE);
  });

  it('Should execute createError with message and default status code.', () => {
    appError(DEFAULT_ERROR_MESSAGE);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
      DEFAULT_ERROR_MESSAGE,
    );
  });

  it('Should execute createError with message and a given status code.', () => {
    appError(DEFAULT_ERROR_MESSAGE, StatusCodes.UNPROCESSABLE_ENTITY);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.UNPROCESSABLE_ENTITY,
      DEFAULT_ERROR_MESSAGE,
    );
  });
});
