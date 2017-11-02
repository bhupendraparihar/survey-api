var pollOrganizer = (function () {

    var postNewPollToServer = function (postData) {
        console.info('Creating new poll request to the server');
        return $.ajax ({
            type: 'POST',
            url: 'http://localhost:8080/survey/create',
            data: postData
        });
    },
    getallPollsFromServer = function (meetingId) {
        console.info('Get all the surveys for a meetig by meetingID from the server');
        return $.ajax ({
            type: 'GET',
            url: 'http://localhost:8080/api/survey/meeting/' + meetingId
        });
    },
    getPollDetailsByIdFromServer = function (pollId) {
        console.info('Get poll details by pollId from server');
        return $.ajax ({
            type: 'GET',
            url: 'http://localhost:8080/api/survey/' + pollId
        });
    },
    surveryList = [];


    return {
        init: function(){
            this.cacheElements();
            this.bindEvents();
            this.showPollList();
        },
        cacheElements: function(){
            this.pollListElement = document.getElementById('pollListEntries');
            this.createPollSection = document.getElementById('createPollSection');
            this.pollListSection = document.getElementById('pollListSection');
            this.showPollSection = document.getElementById('showPollSection');
        },
        bindEvents : function(){

        },
        displaySectionById: function (id) {
            this.createPollSection.style.display = 'none';
            this.pollListSection.style.display = 'none';
            this.showPollSection.style.display = 'none';
            switch (id) {
                case 'createPollSection': {
                    this.createPollSection.style.display = 'block';
                    break;
                }
                case 'pollListSection': {
                    this.pollListSection.style.display = 'block';
                    break;
                } case 'showPollSection': {
                    this.showPollSection.style.display = 'block';
                    break;
                }
                default: break;
            }
        },
        showPollList: function () {
            this.displaySectionById('pollListSection');
            this.showPollListEntries();
        },
        showPollListEntries: function (pollList) {
            var getPolls = this.getallPollsFromServer('123'),
            that = this;
            this.pollListElement.innerHTML = '';
            getPolls.then (function (pollList) {
                console.log(pollList);
                console.info('Successfully received all the polls for the meeting');
                var i = 0;
                pollList.forEach(function (entry) {
                    var newElement = document.createElement('div'),
                        newButton = document.createElement('button');
                    i ++;
                    newElement.innerHTML = 'survey' + i;
                    newButton.innerHTML = "VIEW";
                    newButton.addEventListener('click', function () {
                        pollOrganizer.showPollDetailsByPollId('123T1507868285014');
                    });
                    newElement.appendChild(newButton);
                    that.pollListElement.appendChild(newElement);
                }); 
            }, function (err) {
                console.error('Could not get all the surveys for the meeting');
            });
        },
        createNewPoll: function () {
            this.displaySectionById('createPollSection');
        },
        submitNewPoll: function () {
            var data = {
                survey_id: 123456,
                question: '',
                answers: [],
                meeting_id: 123,
                presenter_id: 123
            },
            newPoll, pollStatement,
            pollOptions = [],
            pollOptionsArr = [],
            that = this;

            pollStatement = $('#createPollSection .poll-statement textarea')[0].value;
            pollOptionsArr  = $('#createPollSection .poll-options li');
            for (var i = 0; i < pollOptionsArr.length; i++) {
                pollOptions.push(pollOptionsArr[i].getElementsByTagName('input')[0].value);
            }
            if (pollStatement && pollOptions) {
                data.question = pollStatement;
                data.answers = pollOptions;
                newPoll = this.postNewPollToServer(data);
                newPoll.then (function (message) {
                    console.log(message);
                    console.info('Successfully created new poll');
                    that.showPollList();
                }, function (err) {
                    console.error('Could not create new poll');
                });
            } else {
                console.error('Provide options and poll statement');
            }
        },
        showPollDetailsByPollId : function (pollId) {
            var getPoll = this.getPollDetailsByIdFromServer(pollId),
                that = this;
            getPoll.then (function (pollItem) {
                var poll = pollItem[0];
                console.log(poll);
                console.info('Successfully received poll details from the server');
                that.displaySectionById('showPollSection');
                $('#showPollSection .poll-statement')[0].innerHTML = poll.question;
                let pollOptionsArr  = $('#showPollSection .poll-options li');
                for (var i = 0; i < pollOptionsArr.length; i++) {
                    pollOptionsArr[i].getElementsByTagName('input')[0].value = poll.answers[i].text;
                }
            }, function (err) {
                console.error('Failed to get the poll details from server');
            });
        },
        postNewPollToServer: postNewPollToServer,
        getallPollsFromServer: getallPollsFromServer,
        getPollDetailsByIdFromServer: getPollDetailsByIdFromServer,
        surveryList: surveryList
    }
})();

pollOrganizer.init();


// var pollData = {
//     pollStatement: '',
//     pollOptions: [] 
// };

// function createPoll () {
//     var pollOptions = $('.poll-options li');
//     pollData.pollStatement = document.getElementById('pollStatement').value;
//     pollData.pollOptions.push()
// }