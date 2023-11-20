import { DataSource } from "typeorm";
import User from "../models/User";



const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "test",
    database: "test",
    synchronize: true,
    entities: [User],
});

dataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
})
.catch((err) => {
    console.error("Error during Data Source initialization", err)
})

export default dataSource;

