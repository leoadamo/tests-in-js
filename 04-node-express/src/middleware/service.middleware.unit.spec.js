// MIDDLEWARE
import { get } from './service.middleware';

// BUILDERS
import { buildNext, buildReq } from '~/builders';

describe('Middleware > Service - Unit', () => {
  it('Should add services to the request.', () => {
    const req = buildReq({});

    const next = buildNext();

    get(req, null, next);

    expect(req.service).toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing! */);
  });
});
