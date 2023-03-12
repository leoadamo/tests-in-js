// DEPENDENCIES
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// UTILS
import { appError } from '@/utils';

// MIDDLEWARE
import { get } from './user.middleware';

// SERVICES
import * as service from '@/database/service';

jest.mock('@/database/service');

describe('Middleware > User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should throw an error when an email is NOT provided in the request headers.', () => {
    const req = { headers: {} };

    const next = jest.fn().mockName('next');

    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when an email is provided but it is not VALID.', () => {
    const req = {
      headers: {
        email: 'leo.adamoli @gmail.com',
      },
    };

    const next = jest.fn().mockName('next');

    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return an user object when a valid email is given.', async () => {
    const email = 'leo.adamoli@gmail.com';

    const req = {
      headers: {
        email,
      },
    };

    const next = jest.fn().mockName('next');

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([
      {
        id: 1,
        email,
      },
    ]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual({
      id: 1,
      email,
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing! */);
  });

  it('Should throw an error when service.findOrSave fails.', async () => {
    const email = 'leo.adamoli@gmail.com';

    const req = {
      headers: {
        email,
      },
    };

    const next = jest.fn().mockName('next');

    jest
      .spyOn(service, 'findOrSave')
      .mockRejectedValueOnce(ReasonPhrases.INTERNAL_SERVER_ERROR);

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(ReasonPhrases.INTERNAL_SERVER_ERROR);
  });
});
