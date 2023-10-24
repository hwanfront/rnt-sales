import router from "../api";
import config from "../config";
import { logger } from "./logger";
import HttpException from "../utils/HttpException";

import type { Application, NextFunction, Request, Response } from "express";

export default ({ app }: { app: Application }) => {
  app.use(config.api.prefix, router());

  app.use((_: Request, __: Response, next: NextFunction) => {
    const error = new HttpException(404, 'Not Found');
    next(error);
  })

  app.use((error: Error, _: Request, res: Response) => {
    if(error instanceof HttpException) {
      logger.error('[Error Code: %n] | %s', error.statusCode, error.message)
      return res.status(error.statusCode).send(error.message);
    }
    logger.error('[Error] | %o', error);
    res.status(500).json({
      message: error.message,
      error,
    })
  })
}
