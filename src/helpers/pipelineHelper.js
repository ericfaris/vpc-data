const { ObjectId } = require("mongodb");

class ScorePipelineHelper {
  constructor(tableName, authorName, versionNumber) {
    this.pipelineScoresByTable = [
      { $unwind: "$authors" },
      { $unwind: { "path": "$authors.versions", "preserveNullAndEmptyArrays": true } },
      { $unwind: { "path": "$authors.versions.scores", "preserveNullAndEmptyArrays": true } },
      { $project: {
        tableId: '$_id',
        tableName: '$tableName',
        authorId: '$authors._id',
        authorName: "$authors.authorName",
        versionId: '$authors.versions._id',
        versionNumber: '$authors.versions.versionNumber',
        scoreId: '$authors.versions.scores._id',
        user: '$authors.versions.scores.user',
        userName: '$authors.versions.scores.username',
        score: '$authors.versions.scores.score',
        posted: '$authors.versions.scores.createdAt',
        postUrl: '$authors.versions.scores.postUrl',
        _id: 0
      }},
      { $sort: {tableName: 1, score: -1} },
      { $group: {
        _id: {
          tableId: "$tableId",
          tableName: "$tableName",
        },
        scores: {
          $push: {
            authorId: '$authorId',
            authorName: '$authorName',
            versionId: '$versionId',
            versionNumber: '$versionNumber',
            scoreId: '$scoreId',
            user: '$user',
            userName: '$username',
            score: '$score',
            posted: '$posted',
            postUrl: '$postUrl'
          }
        }
      }},
      { $project: {
        tableId: '$_id.tableId',
        tableName: '$_id.tableName',
        scores: "$scores",
        _id: 0
      }},
      { $sort: {tableName: 1} }
    ];

    if (tableName) { this.pipelineScoresByTable.splice(4, 0, { $match: {'tableName': tableName}})};

    this.pipelineScoresByTableAndAuthor = [
      { $unwind: "$authors" },
      { $unwind: { "path": "$authors.versions", "preserveNullAndEmptyArrays": true } },
      { $unwind: { "path": "$authors.versions.scores", "preserveNullAndEmptyArrays": true } },
      { $project: {
        tableId: '$_id',
        tableName: '$tableName',
        authorId: '$authors._id',
        authorName: "$authors.authorName",
        versionId: '$authors.versions._id',
        versionNumber: '$authors.versions.versionNumber',
        scoreId: '$authors.versions.scores._id',
        user: '$authors.versions.scores.user',
        userName: '$authors.versions.scores.username',
        score: '$authors.versions.scores.score',
        posted: '$authors.versions.scores.createdAt',
        postUrl: '$authors.versions.scores.postUrl',
        _id: 0
      }},
      { $sort: {tableName: 1, authorName: 1, score: -1} },
      { $group: {
        _id: {
          tableId: "$tableId",
          tableName: "$tableName",
          authorId: '$authorId',
          authorName: "$authorName",  
        },
        scores: { 
          $push: {
            $cond: [
              {$gt: ['$scoreId', 0]},
              {
                versionId: '$versionId',
                versionNumber: '$versionNumber',
                scoreId: '$scoreId',
                user: '$user',
                userName: '$username',
                score: '$score',
                posted: '$posted',
                postUrl: '$postUrl'
              },
              null
            ]            
          }
        }
      }},
      { $project: {
        tableId: '$_id.tableId',
        tableName: '$_id.tableName',
        authorId: '$_id.authorId',
        authorName: '$_id.authorName',
        scores: {$setDifference: ['$scores', [null]]},
        _id: 0
      }},
      { $sort: {tableName: 1, authorName: 1} },
    ];

    if (tableName && authorName) { this.pipelineScoresByTableAndAuthor
      .splice(4, 0, { $match: {'tableName': tableName, 'authorName': authorName}})};

    this.pipelineScoresByTableAndAuthorAndVersion = [
      { $unwind: "$authors" },
      { $unwind: { "path": "$authors.versions", "preserveNullAndEmptyArrays": true } },
      { $unwind: { "path": "$authors.versions.scores", "preserveNullAndEmptyArrays": true } },
      { $project: {
        tableId: '$_id',
        tableName: '$tableName',
        authorId: '$authors._id',
        authorName: "$authors.authorName",
        versionId: '$authors.versions._id',
        versionNumber: '$authors.versions.versionNumber',
        scoreId: '$authors.versions.scores._id',
        user: '$authors.versions.scores.user',
        userName: '$authors.versions.scores.username',
        score: '$authors.versions.scores.score',
        posted: '$authors.versions.scores.createdAt',
        postUrl: '$authors.versions.scores.postUrl',
        _id: 0
      }},
      { $sort: {tableName: 1, authorName: 1, score: -1} },
      { $group: {
        _id: {
          tableId: "$tableId",
          tableName: "$tableName",
          authorId: '$authorId',
          authorName: "$authorName",
          versionId: '$versionId',
          versionNumber: '$versionNumber',  
        },
        scores: {
          $push: {
            scoreId: '$scoreId',
            user: '$user',
            userName: '$username',
            score: '$score',
            posted: '$posted',
            postUrl: '$postUrl'
          }
        }
      }},
      { $project: {
        tableId: '$_id.tableId',
        tableName: '$_id.tableName',
        authorId: '$_id.authorId',
        authorName: '$_id.authorName',
        versionId: '$_id.versionId',
        versionNumber: '$_id.versionNumber',  
        scores: "$scores",
        _id: 0
      }},
      { $sort: {tableName: 1, authorName: 1, versionNumber: -1} },
    ];

    if (tableName && authorName && versionNumber) { this.pipelineScoresByTableAndAuthorAndVersion
      .splice(4, 0, { $match: {'tableName': tableName, 'authorName': authorName, 'versionNumber': versionNumber}})};
  }
}

class ScorePipelineHelper2 {
  constructor(vpsId) {
    this.pipelineScoresByVpsId = [
      { $unwind: "$authors" },
      { $unwind: { "path": "$authors.versions", "preserveNullAndEmptyArrays": true } },
      { $unwind: { "path": "$authors.versions.scores", "preserveNullAndEmptyArrays": true } },
      { $project: {
        tableId: '$_id',
        tableName: '$tableName',
        authorId: '$authors._id',
        authorName: "$authors.authorName",
        vpsId: "$authors.vpsId",
        comment: "$authors.comment",
        versionId: '$authors.versions._id',
        versionNumber: '$authors.versions.versionNumber',
        scoreId: '$authors.versions.scores._id',
        user: '$authors.versions.scores.user',
        userName: '$authors.versions.scores.username',
        score: '$authors.versions.scores.score',
        posted: '$authors.versions.scores.createdAt',
        postUrl: '$authors.versions.scores.postUrl',
        _id: 0
      }},
      { $sort: {tableName: 1, score: -1} },
      { $group: {
        _id: {
          tableName: '$tableName',
          authorName: '$authorName',
          vpsId: '$vpsId',
          comment: '$comment'
        },
        scores: { 
          $push: {
            $cond: [
              {$gt: ['$scoreId', 0]},
              {
                tableId: "$tableId",
                tableName: "$tableName",
                authorId: '$authorId',
                authorName: "$authorName",                 
                versionId: '$versionId',
                versionNumber: '$versionNumber',
                scoreId: '$scoreId',
                user: '$user',
                userName: '$username',
                score: '$score',
                posted: '$posted',
                postUrl: '$postUrl'
              },
              null
            ]            
          }
        }
      }},
      { $project: {
        vpsId: '$_id.vpsId',
        tableName: '$_id.tableName',
        authorName: '$_id.authorName',
        comment: '$_id.comment',
        scores: {$setDifference: ['$scores', [null]]},
        _id: 0
      }},
      { $sort: {tableName: 1, authorName: 1} },
    ];

    if (vpsId) { this.pipelineScoresByVpsId.splice(4, 0, { $match: {'vpsId': vpsId}})};
  }
}

class SearchPipelineHelper {
  constructor(searchTerm) {
    this.pipelineScoresByTableAndAuthorUsingFuzzyTableSearch = [
      { $match: { tableName: { $regex: `.*${searchTerm}*`, $options: 'i' } } },
      { $unwind: "$authors" },
      { $unwind: { "path": "$authors.versions", "preserveNullAndEmptyArrays": true } },
      { $unwind: { "path": "$authors.versions.scores", "preserveNullAndEmptyArrays": true } },
      {
        $project: {
          tableId: '$_id',
          tableName: '$tableName',
          authorId: '$authors._id',
          authorName: "$authors.authorName",
          vpsId: "$authors.vpsId",
          versionId: '$authors.versions._id',
          versionNumber: '$authors.versions.versionNumber',
          scoreId: '$authors.versions.scores._id',
          user: '$authors.versions.scores.user',
          userName: '$authors.versions.scores.username',
          score: '$authors.versions.scores.score',
          posted: '$authors.versions.scores.createdAt',
          postUrl: '$authors.versions.scores.postUrl',
          _id: 0
        }
      },
      { $sort: { tableName: 1, vpsId: 1, score: -1 } },
      {
        $group: {
          _id: {
            tableId: "$tableId",
            tableName: "$tableName",
            authorId: '$authorId',
            authorName: "$authorName",
            vpsId: '$vpsId'
          },
          scores: {
            $push: {
              $cond: [
                { $gt: ['$scoreId', 0] },
                {
                  versionId: '$versionId',
                  versionNumber: '$versionNumber',
                  scoreId: '$scoreId',
                  user: '$user',
                  userName: '$username',
                  score: '$score',
                  posted: '$posted',
                  postUrl: '$postUrl'
                },
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          tableId: '$_id.tableId',
          tableName: '$_id.tableName',
          authorId: '$_id.authorId',
          authorName: "$_id.authorName",
          vpsId: '$_id.vpsId',
          scores: { $setDifference: ['$scores', [null]] },
          _id: 0
        }
      },
      { $sort: { tableName: 1, vpsId: 1 } },
    ]; 
  }
}
class AllPipelineHelper {
  constructor() {
      this.pipelineTablesWithAuthorVersion = [
          { $unwind: "$authors" },
          { $unwind: { "path": "$authors.versions", "preserveNullAndEmptyArrays": true } },
          { $project: {
            tableId: { $toString: "$_id" },
            tableName: '$tableName',
            authorId: { $toString: "$authors._id" },
            authorName: "$authors.authorName",
            versionId: { $toString: "$authors.versions._id" },
            versionNumber: '$authors.versions.versionNumber',
            tableUrl: '$authors.versions.versionUrl',
            scores: '$authors.versions.scores',
            postUrl: '$authors.versions.scores.postUrl',
            _id: 0
          }},
          { $sort: { tableName: 1, authorName: -1, versionNumber: -1 } },
          { $group: {
            _id: {
              tableId: "$tableId",
              tableName: "$tableName",
              authorId: '$authorId',
              authorName: "$authorName",  
            },
            versionId: { $first: '$versionId' },
            versionNumber: { $first: '$versionNumber' },
            tableUrl: { $first: '$tableUrl' },
            scores: { $first: '$scores' },
            postUrl: { $first: '$postUrl' },
          }},
          { $project: {
            tableId: "$_id.tableId",
            tableName: "$_id.tableName",
            authorId: '$_id.authorId',
            authorName: "$_id.authorName",  
            versionId: '$versionId',
            versionNumber: '$versionNumber',
            tableUrl: '$tableUrl',
            scores: '$scores',
            postUrl: '$postUrl',
            _id: 0
          }},
          { $sort: { tableName: 1, authorName: -1, versionNumber: -1 } }
      ];
  }
}

module.exports = { ScorePipelineHelper, ScorePipelineHelper2, SearchPipelineHelper, AllPipelineHelper }