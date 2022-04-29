import { RequestHandler } from 'express';

export const indexRouteGetHandler: RequestHandler = (_, res) => {
  res.send({ data: 'Hello from the node template API.' });
};
