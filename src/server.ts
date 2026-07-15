import express from 'express';
import {config} from "./config/env";
import { query } from './config/database';
import authRouter from './modules/auth/auth.controller'
import appointmentRouter from './modules/appointments/appointment.controller';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;
app.use(express.json(), express.static('public'));
app.use(cookieParser())
app.use('/auth', authRouter);
app.use('/appointments', appointmentRouter);

async function startServer(){
    try {
        const result = await query('SELECT NOW()', []);
        app.listen(port, () => {
            console.log('5. Server läuft');
        })
    } catch (error){
        console.error('Fehler:', error);
        process.exit(1);
    }
}
startServer();

app.get('/health', (req, res) => {
    res.send({status: 'ok', timpestemp: new Date()})
});


