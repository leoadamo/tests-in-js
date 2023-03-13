// DEPENDENCIES
import app from '@/app';
import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

// BUILDERS
import { buildUser } from '~/builders';

const request = supertest(app);

describe('Router > Home - Integration', () => {
  it('Should return status 200 and a welcome message.', async () => {
    const res = await request.get('/api').set('email', buildUser().email);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toEqual({ welcome: 'Welcome Stranger!' });
  });
});
