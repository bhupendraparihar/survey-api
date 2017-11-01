const fs = require('fs');
let surveyList = JSON.parse(fs.readFileSync("./db/surveys.json"));

function createSurvey(configObj) {

    let timeStamp = Date.now();

    function createAnswersObject(answersArray) {
        var answers = [];
        answersArray.forEach(function(answer, index) {
            answers.push({
                id: index,
                text: answer
            });
        });

        return answers;
    }

    if (configObj.meeting_id === "" || !configObj.meeting_id) {
        throw { "Error": "No meeting id provided" };
    }

    var newSurveyObject = {
        survey_id: configObj.meeting_id + 'T' + timeStamp,
        question: configObj.question,
        answers: createAnswersObject(configObj.answers),
        meeting_id: configObj.meeting_id,
        presenter_id: configObj.presenter_id,
        timeStamp: timeStamp,
        published: false,
        end: false
    }

    let surveysList = getSurveyList();
    surveysList.push(newSurveyObject);
    fs.writeFileSync("./db/surveys.json", JSON.stringify(surveysList), 'utf8');

    return newSurveyObject;
}

function getSurveyById(survey_id) {
    return surveyList.filter(function(survey) {
        return survey.survey_id == survey_id;
    });
}

function getSurveyList() {
    let data = fs.readFileSync("./db/surveys.json");
    let surveyList = JSON.parse(data);
    return surveyList;
}

function getSurveysByMeetingId(meeting_id) {
    return surveyList.filter(function(survey) {
        return survey.meeting_id == meeting_id;
    });
}

function getSurveysByPresenterId(presenter_id) {
    return surveyList.filter(function(survey) {
        return survey.presenter_id == presenter_id;
    });
}

function getLatestSurveyByMeetingId(meeting_id) {

    latestSurvey = [];

    let surveys = surveyList.filter(function(survey) {
        return survey.meeting_id == meeting_id && !survey.published && !survey.end;
    });

    if (surveys.length) {
        latestSurvey = surveys.reduce(function(prev, current) {
            return (prev.timeStamp > current.timeStamp) ? prev : current
        });
        return latestSurvey;
    }

    return latestSurvey;
    // let maxTimeStamp = Math.max.apply(Math,surveys.map(function(o){return o.y;}));

}

function getSubmittedAnswer() {
    let data = fs.readFileSync("./db/answers.json");
    let submittedAnswers = JSON.parse(data);
    return submittedAnswers;
}

function surveryAnswerSubmit(ansObj) {
    let submittedAnswers = getSubmittedAnswer();
    submittedAnswers.push(ansObj);

    fs.writeFileSync("./db/answers.json", JSON.stringify(submittedAnswers), 'utf8');
    return ansObj;
}

module.exports = {
    createSurvey: createSurvey,
    getSurveyList: getSurveyList,
    getSurveyById: getSurveyById,
    getSurveysByMeetingId: getSurveysByMeetingId,
    getSurveysByPresenterId: getSurveysByPresenterId,
    getLatestSurveyByMeetingId: getLatestSurveyByMeetingId,
    surveryAnswerSubmit: surveryAnswerSubmit
};