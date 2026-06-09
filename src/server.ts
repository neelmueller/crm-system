import express from 'express';

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.send({status: 'ok', timpestemp: new Date()})
})
app.listen(port, () => {
    console.log('funktioniert');
})