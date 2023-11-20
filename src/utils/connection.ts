import conectarDB from "../config/db";
import { Request, Response } from "express";



const handleDatabaseConnection = async (
    callback: (connection: ReturnType<typeof conectarDB>) => Promise<void>,
    req: Request,
    res: Response
  ) => {
    try {
      const connection = await conectarDB();
      if (!connection) {
        return res.status(500).json({ msg: 'Error al conectar con la base de datos' });
      }
  
      await callback(connection);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  };

export default handleDatabaseConnection;