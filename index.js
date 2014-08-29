var _ = require('underscore');

var Streak = require('streakapi');

var config = require('./config.json');

Streak.init(config.key);

var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  Streak.Pipelines.getAll(function (pipelines) {
    res.render('pipelines', {
      config: config,
      pipelines: pipelines,
      pretty: true
    });
  });
});

app.get('/pipeline/:key', function (req, res) {
  var key = req.param('key');
  Streak.Pipelines.getOne(key, function (pipeline) {
    Streak.Pipelines.Stages.getAll(key, function (stages) {
      Streak.Pipelines.getBoxes(key, function (boxes) {
        _.each(stages, function (stage) {
          stage.boxes = [];
        });
        _.each(boxes, function (box) {
          stages[box.stageKey].boxes.push(box);
        });

        res.render('pipeline', {
          config: config,
          pipeline: pipeline,
          boxes: boxes,
          stages: stages,
          pretty: true
        });
      });
    });
  });
});

var server = app.listen(config.port, function () {
  console.log('streakshow running on port %d', server.address().port);
});
