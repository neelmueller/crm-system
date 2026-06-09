import express from 'express';
import {config} from "./config/env";
import { query } from './config/database';

async function startServer(){
    try {
        const result = await query('SELECT NOW()', []);
        console.log('Datebank verbunden:', result);
    }catch (error){
        console.error('Server konnte nicht gestartet werden', error);
        process.exit(1);
    }
}
startServer();
console.log(config.port, config.node_env, config.database_url, config.jwt_secret)

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.send({status: 'ok', timpestemp: new Date()})
})
app.listen(port, () => {
    console.log('funktioniert');
})
