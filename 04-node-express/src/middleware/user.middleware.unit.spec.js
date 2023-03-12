// DEPENDENCIES
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// BUILDERS
import { buildError, buildNext, buildReq } from '~/builders';

// MIDDLEWARE
import { get } from './user.middleware';

// SERVICES
import * as service from '@/database/service';

jest.mock('@/database/service');

describe('Middleware > User', () => {
  const error = buildError(
    StatusCodes.UNPROCESSABLE_ENTITY,
    `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should throw an error when an email is NOT provided in the request headers.', () => {
    const req = buildReq({ headers: {} });

    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when an email is provided but it is not VALID.', () => {
    const req = buildReq({
      headers: {
        email: 'leo.adamoli @gmail.com',
      },
    });

    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return an user object when a valid email is given.', async () => {
    const req = buildReq();

    const { email } = req.headers;

    const response = {
      id: 1,
      email,
    };

    const next = buildNext();

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([response]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual(response);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing! */);
  });

  it('Should throw an error when service.findOrSave fails.', async () => {
    const req = buildReq();

    delete req.user;

    const next = buildNext();

    jest
      .spyOn(service, 'findOrSave')
      .mockRejectedValueOnce(ReasonPhrases.INTERNAL_SERVER_ERROR);

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(ReasonPhrases.INTERNAL_SERVER_ERROR);
  });
});
