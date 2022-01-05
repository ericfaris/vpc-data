// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const PORT = process.env.PORT || 80;
const v1Router = require('./routers/api.v1')

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use('/api/v1', v1Router);

// starting the server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});