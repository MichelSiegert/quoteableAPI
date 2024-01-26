const express = require('express');
const axios = require('axios');
const winston = require('winston');

const app = express();

//NOTE if this project was bigger I would seperate The express part from the Axios part or the logger.
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

app.get('/api/quote/:tag?', async (req, res) => {
    let tag = req.params.tag;
    let path = undefined !== tag ? '?tags=' + tag : '';
    try {
        let result = (await axios.get('https://api.quotable.io/random' + path)).data;
        res.json(result);
    } catch (e) {
        let errorMessage = new Date().toISOString() + ': '+ e;
        logger.error(errorMessage);
        res.json(errorMessage);
    }
});

app.listen(3000, () => {
    logger.info(new Date().toISOString() + ': Server listening on port 3000');
});