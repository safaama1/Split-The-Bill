const express = require('express');
const app = express();
const path = require('path');
app.use('/assets', express.static('static-assets'));


app.listen(3000);
