const fs = require('fs');

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

function getSurveyList() {
    let data = fs.readFileSync("./db/surveys.json");
    let surveyList = JSON.parse(data);
    return surveyList;
}

module.exports = {
    createSurvey: createSurvey,
    getSurveyList: getSurveyList
};