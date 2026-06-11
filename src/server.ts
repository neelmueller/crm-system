import express from 'express';
import {config} from "./config/env";
import { query } from './config/database';
import prisma from './config/prisma'

const app = express();
const port = 3000;

async function startServer(){
    try {
        const result = await query('SELECT NOW()', []);
        app.listen(port, () => {
            console.log('5. Server läuft');
        })
    } catch (error){
        console.error('Fehler:', (error as Error).message);
        process.exit(1);
    }
}
startServer();
console.log(config.port, config.node_env, config.database_url, config.jwt_secret)


app.get('/health', (req, res) => {
    res.send({status: 'ok', timpestemp: new Date()})
})

