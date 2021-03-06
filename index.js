// set environment variables
require('dotenv').config();

// import third-party
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const https = require('https');

// import local file
const { MAX } = require('./src/constant');
const corsConfig = require('./src/configs/cors.config');
const wordApi = require('./src/apis/word.api');
const commonApi = require('./src/apis/common.api');
const sentenceApi = require('./src/apis/sentence.api');

// ================== set port ==================
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 3000);

// ================== setup ==================
app.use(express.static(path.join(__dirname, '/src/build')));

const dev = app.get('env') !== 'production';

if (!dev) {
  app.disable('x-powered-by');
  app.use(morgan('common'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/build', 'index.html'));
  });
} else {
  app.use(morgan('dev'));
}

// ================== Connect mongodb with mongoose ==================
const mongoose = require('mongoose');
const MONGO_URL = dev ? process.env.MONGO_URL : process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// ================== config ==================
app.use(express.json({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(express.urlencoded({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(cookieParser());
app.use(cors());

// ================== Listening ... ==================
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} !!`);
});

// ================== Apis ==================
const BASE_URL = '/apis';
app.use(`${BASE_URL}/word`, wordApi);
app.use(`${BASE_URL}/common`, commonApi);
app.use(`${BASE_URL}/sentence`, sentenceApi);
//app.use(`${BASE_URL}/blog`, blogApi);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/build', 'index.html'));
});
