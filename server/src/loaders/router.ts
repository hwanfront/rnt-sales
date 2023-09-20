import { Application } from "express";

import config from "../config";
import router from "../api";

export default ({ app }: { app: Application }) => {
  app.use(config.api.prefix, router());
}
