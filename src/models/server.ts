import 'reflect-metadata'
import express, { Application } from "express";
import authRouter from "../routes/authRouter";
import conectarDB from "../config/db";
import dataSource from '../config/db';

class Server {
  private app: Application;
  private port: string;
  private routes = {
    auth: "/api/auth",
  };
  constructor() {
    this.app = express();
    // this.connectDB();
    this.middlewares();
    this.routing();
    this.port = "8081"; //env file not available
  }

  routing = () => {
    this.app.use(this.routes.auth, authRouter);
  };


  listen = () => {
    this.app.listen(this.port, () => {
      console.log("Server is running on port 5000");
    });
  };

  middlewares = () => {
    this.app.use(express.json());
  };
}

export default Server;
