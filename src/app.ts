import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import './database/connection';
import cors from 'cors';

import routes from './routes';

class App {
  server: express.Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
