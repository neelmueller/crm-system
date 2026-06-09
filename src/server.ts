import express from 'express';
import {config} from "./config/env";
console.log(config.port, config.node_env, config.database_url, config.jwt_secret)

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.send({status: 'ok', timpestemp: new Date()})
})
app.listen(port, () => {
    console.log('funktioniert');
})