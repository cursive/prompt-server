
var fakeMode = false;
var jsonData;

//Init and events
$(function () {
    if (fakeMode) {
        fakeIt();
    }
    initButtons()
    populateText()



});


function initButtons() {
    $(".bigButton").click(function () {
        $('.bigButton').off('click.mynamespace');
        ai()
    })
    $(".test").click(function () {
        testSimple()
    })


    $(document).on('click', '.ph-pencil', function () {
        editComment($(this).parent().parent().parent().data("id"))
    });
    $(document).on('click', '.feedback', function () {
        editComment($(this).parent().parent().data("id"))
    });
    $(document).on('click', '.ph-check', function () {
        approveComment($(this).parent().parent().parent().data("id"))
    });
    $(document).on('click', '.ph-thumbs-up', function () {
        approveComment($(this).parent().parent().parent().data("id"))
    });
    $(document).on('click', '.ph-thumbs-down', function () {
        rejectComment($(this).parent().parent().parent().data("id"))
    });
}



function fakeIt() {
    console.log("fake it")
    jsonData = mockData
    wrapQuotes();
    processPartials();
}

// /api/prompt

function populateText() {
    $("#fromStudent").html(ess);
    $("#instructions").val(inst)
    $("#article").val(art)
}

function createJson(data) {
    console.log("create json")
    var str = data
    var startIndex = str.indexOf('{'); // find the starting index of the JSON object
    var endIndex = str.lastIndexOf('}'); // find the ending index of the JSON object
    var jsonStr = str.substring(startIndex, endIndex + 1); // extract the JSON object as a string
    jsonData = JSON.parse(jsonStr); // parse the JSON object string into a JavaScript object
    console.log("-------")
    //console.log(jsonStr)
    console.log("-------")
    console.log(jsonData)
    wrapQuotes();
    processPartials();


}

function wrapQuotes() {
    console.log("wrap quotes");
    const quotes = jsonData.targetedFeedback.map((feedback) => feedback.quote);
    var i = 0;
    quotes.forEach((quote) => {
        const regex = new RegExp(quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
        fromStudent.innerHTML = fromStudent.innerHTML.replace(
            regex,
            `<span data-id='` + i + `'class="quote">${quote}</span>`
        );
        i++;
    });
}




function processPartials() {
    console.log("process partials")
    for (var i = 0; i < jsonData.targetedFeedback.length; i++) {
        var dimension = jsonData.targetedFeedback[i].dimension;
        var score = jsonData.targetedFeedback[i].score;
        var feedback = jsonData.targetedFeedback[i].feedback;
        $(".quote:nth-of-type(" + (i + 1) + ")").addClass(dimension)
        $(".quote:nth-of-type(" + (i + 1) + ")").addClass("score" + score)
        $(".comments").append(drawComment(i, score, dimension, feedback));
    }
    $(".quote").hover(
        function () {
            // This is the function that will be called on mouseenter
            console.log("hover")
            // $(".comment:nth-of-type(" + ($(this).index() + 0) + ")").addClass("hovering")
        },
        function () {
            // $(".comment:nth-of-type(" + ($(this).index() + 0) + ")").removeClass("hovering")
            // This is the function that will be called on mouseleave
            // You can leave this empty if you don't want anything to happen on mouseleave
        }
    );
    processFull();
}


function processFull() {
    //loop through the overallFeedback in the jsonData object the feedback content to the p tag in the review div
    for (var i = 0; i < jsonData.overallFeedback.length; i++) {
        var feedback = jsonData.overallFeedback[i].feedback;
        var score = jsonData.overallFeedback[i].score;
        $(".review p:nth-of-type(" + (i + 1) + ")").html(feedback)
        if (i < 3) {
            $(".review h3:nth-of-type(" + (i + 1) + ")").append(" " + score + "/4")
        }
    }
}

var remoteRoot = "https://prompt-server--danielnacamuli.repl.co/"
var localRoot = "https://prompt-server--danielnacamuli.repl.co/"
var baseURL = remoteRoot


function testSimple() {
    console.log("sending to simple..")
    fetch(baseURL + 'api/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Add any request data if needed
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Process the response data
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function ai() {
    console.log("sending..")
    $(".bigButton").addClass("loading")
    fetch(baseURL + 'api/message', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        //body: JSON.stringify({ essay: document.getElementById("essayTextArea").value }),
        body: JSON.stringify({
            instructions: document.getElementById("instructions").value,
            article: document.getElementById("article").value,
            essay: document.getElementById("fromStudent").textContent

        }),
    })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received")
            console.log(data.result)
            $(".bigButton").removeClass("loading")
            $(".bigButton").addClass("loaded")
            createJson(data.result)
        })
        .catch(error => {
            console.error(error);
            alert(error.message);
        });
}


function rejectComment(commentID) {
    $(".comment[data-id='" + commentID + "']").removeClass("animate__animated animate__fadeIn animate__delay-0s")
    $(".comment[data-id='" + commentID + "']").addClass("rejected")
    $("span.quote[data-id='" + commentID + "']").addClass("rejected")
    //removes comment from the dom

}

function approveComment(commentID) {
    console.log("approve comment", commentID)
    //selct comment with same ID and add class approved
    $(".comment[data-id='" + commentID + "']").addClass("approved")
    $(".comment[data-id='" + commentID + "'] .actions").removeClass("hidden")
    $(".comment[data-id='" + commentID + "'] .edits").addClass("hidden")





}

function editComment(commentID) {
    console.log("edit comment", commentID)
    $(".comment[data-id='" + commentID + "'] .actions").addClass("hidden")
    $(".comment[data-id='" + commentID + "'] .edits").removeClass("hidden")
    $(".comment[data-id='" + commentID + "'] .feedback").attr("contenteditable", "true");
    $(".comment[data-id='" + commentID + "'] .feedback").focus();
}

function submitComment(commentID) {
    console.log("complete comment edit", commentID)
    $(".comment[data-id='" + commentID + "'] .actions").removeClass("hidden")
    $(".comment[data-id='" + commentID + "'] .edits").addClass("hidden")
    $(".comment[data-id='" + commentID + "'] .feedback").attr("contenteditable", "false");
}

function removeComment(id) {
    //removes comment and highlight wiht same ID from the dom
}

function drawComment(i, score, dimension, feedback) {
    var c = "<div data-id='" + i + "' class='comment animate__animated animate__fadeIn animate__delay-" + (i - i) + "s   " + "score" + score + "'><div class='content'><img class='migo' src='img/migo.png'><img class='teacher' src='img/teacher.png'><div class='dimension'>" + dimension + "</div><div class='feedback'>" + feedback + "</div><div class='buttons actions'><i class='ph ph-pencil'></i><i class='ph ph-thumbs-up'></i><i class='ph ph-thumbs-down'></i></div><div class='edits buttons hidden'><i class='ph ph-check'></i><i class='ph ph-x'></i></div></div></div>"
    return c;
}


