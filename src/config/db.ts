import { DataSource } from "typeorm";
import User from "../models/User";


const conectarDB = async () => {
    try {
        const dataSource =  new DataSource({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "1233",
            database: "test",
            synchronize: true,
            entities: [User],           
        });

        await dataSource.initialize();
        return dataSource;

    } catch (error) {
        throw error
    }
}


export default conectarDB;