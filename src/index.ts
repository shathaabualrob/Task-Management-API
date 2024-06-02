import express from "express";
import { createConnection } from "typeorm";
import { json } from "body-parser";

const app = express();
app.use(json());

createConnection().then(() => {
    app.listen(3000, ()=> {
        console.log("Server is listening on port 3000...");
    });
}).catch(error => console.log(error));
