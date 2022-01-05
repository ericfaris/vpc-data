// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoHelper = require('./helpers/mongoHelper');

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', async (req, res) => {
  res.send(ads);
});

// get all tables
app.get('/tables', async (req, res) => {
  const tables = await mongoHelper.getAll('tables');
  res.send(tables);
});

// get table scores
app.get('/scores', async (req, res) => {
  let tableName = req.query.tableName;
  let authorName = req.query.authorName;
  let version = req.query.version;
  let pipeline = (new SearchPipelineHelper(tableName, authorName, version)).pipeline;

  const tables = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(tables);
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});