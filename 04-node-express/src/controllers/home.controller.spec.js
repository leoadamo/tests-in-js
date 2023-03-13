// DEPENDENCIES
import { StatusCodes } from 'http-status-codes';

// CONTROLLERS
import { index } from './home.controller';

describe('Controllers > Home - Unit', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };

  it('Should return status code 200 with a message when accessing the endpoint.', async () => {
    await index(null, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ welcome: 'Welcome Stranger!' });
  });
});
