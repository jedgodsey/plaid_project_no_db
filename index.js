require ('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cors = require('cors');
const plaid = require('plaid');

const app = express();
app.use(cors())
app.use(bodyParser.json());



const PORT = proces.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
