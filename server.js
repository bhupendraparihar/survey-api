var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

var surveyFactory = require('./factory/survey_factory.js');
// var surveysList = surveyFactory.getSurveyList();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enabling CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// GET Requests(accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/survey/:survey_id')
    .get(function(req, res) {
        let survey = surveyFactory.getSurveyById(req.params.survey_id);
        res.send(survey);
    });

router.route('/survey/meeting/:meeting_id')
    .get(function(req, res) {
        let surveys = surveyFactory.getSurveysByMeetingId(req.params.meeting_id);
        res.send(surveys);
    });

router.route('/survey/presenter/:presenter_id')
    .get(function(req, res) {
        let surveys = surveyFactory.getSurveysByPresenterId(req.params.presenter_id);
        res.send(surveys);
    });

router.route('/survey/latest/meeting/:meeting_id')
    .get(function(req, res) {
        res.send({})
    });

router.route('/survey/latest/presenter/:presenter_id')
    .get(function(req, res) {
        res.send({})
    });


// POST Requests

app.post('/survey/create', function(req, res) {
    console.log(req.body);
    try {
        let surveyObject = surveyFactory.createSurvey(req.body);
        let surveysList = surveyFactory.getSurveyList();
        res.send(surveysList);
    } catch (err) {
        res.status(500);
        res.send(err);
    }
});


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);