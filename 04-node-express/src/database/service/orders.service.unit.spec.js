// DEPENDENCIES
import { StatusCodes } from 'http-status-codes';

// SERVICES
import { listOrders, saveOrder } from '@/database/service/orders.service';

// MODELS
import { Order } from '@/database/models/order.model';

// BUILDERS
import { buildError, buildOrder, buildOrders, buildUser } from '~/builders';

// UTILS
import { logger } from '@/utils/logger';

jest.mock('@/database/models/order.model');
jest.mock('@/utils/logger');

// JSON.parse = jest.fn();

describe('Service > Orders - Unit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return a list of orders.', async () => {
    const user = buildUser();

    const where = {
      userid: user.id,
    };

    const orders = buildOrders().map(order => {
      const orderCopy = order;

      orderCopy.products = JSON.stringify(orderCopy.products);

      return orderCopy;
    });

    jest.spyOn(Order, 'findAll').mockResolvedValueOnce(orders);

    const returnedOrders = await listOrders(user.id);

    expect(returnedOrders).toEqual(orders);
    expect(Order.findAll).toHaveBeenCalledTimes(1);
    expect(Order.findAll).toHaveBeenCalledWith({ where });
    // expect(JSON.parse).toHaveBeenCalledTimes(orders.length);
  });

  it('Should reject with an error when Order.findAll() fails.', () => {
    const user = buildUser();

    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to retrieve orders for user: ${user.id}`,
    );

    jest.spyOn(Order, 'findAll').mockRejectedValueOnce(error);

    expect(listOrders(user.id)).rejects.toEqual(error);
  });

  it('Should save and return an order.', () => {
    const user = buildUser();

    const data = {
      userid: user.id,
      products: buildOrder(),
    };

    const order = {
      ...data,
      id: 1,
    };

    jest.spyOn(Order, 'create').mockResolvedValueOnce(order);

    expect(saveOrder(data)).resolves.toEqual(order);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(`New order saved`, { data });
  });

  it('Should reject with an error when saveOrder() is called without any data.', () => {
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to save order',
    );

    expect(saveOrder()).rejects.toEqual(error);
  });
});
