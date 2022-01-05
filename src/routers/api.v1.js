const mongoHelper = require('../helpers/mongoHelper');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('API Home Page');
})

router.get('/tables', async (req, res) => {
    const tables = await mongoHelper.getAll('tables');
    res.send(tables);
});

// get table scores
router.get('/scores', async (req, res) => {
    let tableName = req.query.tableName;
    let authorName = req.query.authorName;
    let version = req.query.version;
    let pipeline = (new SearchPipelineHelper(tableName, authorName, version)).pipeline;

    const tables = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(tables);
});


module.exports = router;