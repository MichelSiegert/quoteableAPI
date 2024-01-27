const express = require('express');
const axios = require('axios');
const winston = require('winston');
const {Translate} = require('@google-cloud/translate').v2;

let PORT = process.env.PORT;
const KEY = process.env.APIKEY;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: {service: 'Quote-Translater'},
    transports: [
        new winston.transports.File({filename: './logs/error.log', level: 'error'}),
        new winston.transports.File({filename: './logs/combined.log'}),
    ],
});

if(!PORT) {
    logger.warn('No Port has been found in the configuration. port has defaulted to 3000.');
    PORT = 3000;
}
if(!KEY)  {
    logger.error('No API Key has been found! please check the configuration!');
    console.error('No API Key has been found! please check the configuration!');
    return 1;
}

const app = express();
const translate = new Translate({key: KEY});

app.get('/api/quote/:tag?', async (req, res) => {
    const tag = req.params.tag;
    const path = undefined !== tag ? '?tags=' + tag : '';
    try {
        const quoteRequest = (await axios.get('https://api.quotable.io/random' + path)).data;
        const author = quoteRequest.author;
        const quote = quoteRequest.content;

        const translationRequest = await translate.translate(quote, 'de');
        const translation = translationRequest[0];

        res.json({
            "content": translation,
            "author": author
        });

    } catch (e) {
        logger.error(e);
        res.json(e);
    }
});

app.listen(PORT, () => {
    logger.info(': Server listening on port ' + PORT);
});
