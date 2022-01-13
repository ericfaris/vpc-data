const mongoHelper = require('../helpers/mongoHelper');
const { ScorePipelineHelper, SearchPipelineHelper, AllPipelineHelper } = require('../helpers/pipelineHelper');
const express = require('express');
const router = express.Router();
const {CanvasHelper} = require('../helpers/canvasHelper')

router.get('/', function (req, res) {
    res.send('vpc-data');
})

router.post('/convert', async (req, res) => {
    let canvasHelper = new CanvasHelper();
    let textToConvert = req.body.text;
    let imageOptions = {
        maxWidth: 1400,
        fontSize: 30,
        fontFamily: 'monospace',
        // fontPath: './resources/ponde___.ttf',
        lineHeight: 40,
        margin: 60,
        bgColor: 'black',
        textColor: 'yellow',
        keepSpaces: true,
    };
    const dataUri = await canvasHelper.generate(textToConvert, imageOptions);
    res.send(dataUri);
});

router.get('/tables', async (req, res) => {
    const tables = await mongoHelper.getAll('tables');
    res.send(tables);
});

router.get('/tablesWithAuthorVersion', async (req, res) => {
    let pipeline = (new AllPipelineHelper()).pipelineTablesWithAuthorVersion;
    const tables = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(tables);
});

router.get('/scoresByTable', async (req, res) => {
    let tableName = req.query.tableName;
    let pipeline = (new ScorePipelineHelper(tableName, null, null)).pipelineScoresByTable;
    const table = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(table);
});

router.get('/scoresByTable', async (req, res) => {
    let tableName = req.query.tableName;
    let pipeline = (new ScorePipelineHelper(tableName, null, null)).pipelineScoresByTable;
    const table = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(table);
});

router.get('/scoresByTableAndAuthor', async (req, res) => {
    let tableName = req.query.tableName;
    let authorName = req.query.authorName;
    let pipeline = (new ScorePipelineHelper(tableName, authorName, null)).pipelineScoresByTableAndAuthor;
    const table = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(table);
});

router.get('/scoresByTableAndAuthorUsingFuzzyTableSearch', async (req, res) => {
    let tableSearchTerm = req.query.tableSearchTerm;
    let pipeline = (new SearchPipelineHelper(tableSearchTerm)).pipelineScoresByTableAndAuthorUsingFuzzyTableSearch;
    const table = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(table);
});

router.get('/scoresByTableAndAuthorAndVersion', async (req, res) => {
    let tableName = req.query.tableName;
    let authorName = req.query.authorName;
    let versionNumber = req.query.versionNumber;
    let pipeline = (new ScorePipelineHelper(tableName, authorName, versionNumber)).pipelineScoresByTableAndAuthorAndVersion;
    const table = await mongoHelper.aggregate(pipeline, 'tables');
    res.send(table);
});

router.get('/weeks', async (req, res) => {
    const weeks = await mongoHelper.getAll('weeks');
    res.send(weeks);
});

router.get('/currentWeek', async (req, res) => {
    const week = await mongoHelper.findCurrentWeek('weeks');
    res.send(week);
});

module.exports = router;