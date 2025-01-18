import { Request } from 'express';

export type RequestWithUriParams<T> = Request<T, {}, {}, {}>;