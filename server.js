require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000;

require('dotenv').config()
require('./startup/logging')();
require('./services/database.service')();
require('./startup/routes')(app);


app.listen(port, () => console.log(`SERVER LISTENING ON PORT ${port}`));
