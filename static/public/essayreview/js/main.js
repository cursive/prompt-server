
var fakeMode = false;
if (window.location.hostname === 'localhost') {
    fakeMode = false;
}
var jsonData;
var remoteRoot = "https://prompt-server--danielnacamuli.repl.co/";
var localRoot = "http://localhost:3000/";
var baseURL = window.location.hostname === 'localhost' ? localRoot : remoteRoot;

var allPrompts
var allRubrics
var promptDropdown = document.getElementById('promptDropdown');
var rubricDropdown = document.getElementById('rubricDropdown');

//Init and events
$(function () {

    initButtons()
    populateText()
    getPrompts()
    if (fakeMode) {
        fakeIt();
    }




});


function initButtons() {

    $(".bigButton").click(function () {
        $('.bigButton').off('click.mynamespace');
        ai()
    })

    $(".test").click(function () {
        testSimple()
    })
    $(".showrubric,.close").click(function () {
        toggleRubric()
    });
    $("#rubricDropdown").change(function () {
        updateRubric($(this).prop('selectedIndex') - 1);
    });

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
    $(document).on('mouseenter', '.comment', function () {
        $('.quote[data-id="' + $(this).data('id') + '"]').addClass('triggeredhover');
    });

    $(document).on('mouseleave', '.comment', function () {
        $('.quote[data-id="' + $(this).data('id') + '"]').removeClass('triggeredhover');
    });
    $(document).on('mouseenter', '.quote', function () {
        $('.comment[data-id="' + $(this).data('id') + '"]').addClass('triggeredhover');
    });

    $(document).on('mouseleave', '.quote', function () {
        $('.comment[data-id="' + $(this).data('id') + '"]').removeClass('triggeredhover');
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
    // $("#instructions").val(inst)
    //$("#article").val(art)
}

function createJsonGTP3(data) {
    console.log("create json")
    console.log(data)
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

function createJson(data) {
    console.log("create json")
    console.log(data)
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







function getPrompts() {
    console.log("getting prompts..")
    fetch(baseURL + 'api/getAllPrompts')
        .then(response => response.json())
        .then(data => {
            // Populate the dropdown with prompts

            data.forEach((prompt, index) => {
                var option = document.createElement('option');
                option.value = prompt.uuid;
                option.text = prompt.title;
                promptDropdown.appendChild(option);
                if (index === 0) {
                    option.selected = true;
                }
            });
            allPrompts = data;
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
    console.log("getting rubrics..")
    fetch(baseURL + 'api/getAllRubrics')
        .then(response => response.json())
        .then(data => {
            // Populate the dropdown with prompts

            data.forEach((rubric, index) => {
                var option = document.createElement('option');
                option.value = rubric.uuid;
                option.text = rubric.title;
                rubricDropdown.appendChild(option);
                if (index === 0) {
                    option.selected = true;
                }
            });
            allRubrics = data;
            console.log(data);
            updateRubric(0)
        })
        .catch(error => console.error('Error:', error));

}

function ai() {
    console.log("sending..")
    console.log(promptDropdown.selectedIndex)
    $(".bigButton").addClass("loading")
    fetch(baseURL + 'api/openai', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        //body: JSON.stringify({ essay: document.getElementById("essayTextArea").value }),
        body: JSON.stringify({

            prompt: allPrompts[promptDropdown.selectedIndex - 1].description,
            rubric: allRubrics[rubricDropdown.selectedIndex - 1].description

        }),
    })
        .then(response => {
            if (response.status !== 200) {
                console.log(response);
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received");

            cleanData(data);
            $(".bigButton").removeClass("loading");
            $(".bigButton").addClass("loaded");
        })
        .catch(error => {
            console.error(error);
            alert(error.message);
        });
}

function cleanData(data) {
    console.log("cleaning data");
    console.log("data:\n", data);

    // Parse the content as JSON
    const parsedData = JSON.parse(data.result.content);

    // Check if fullResults is present
    if (parsedData.fullResults) {
        // Assign the targetedFeedback and overallFeedback properties to jsonData
        const { targetedFeedback, overallFeedback } = parsedData.fullResults;
        jsonData = { targetedFeedback, overallFeedback };
    } else {
        // If fullResults is not present, assign the parsedData object to jsonData
        jsonData = parsedData;
    }

    console.log("jsonData:\n", jsonData);

    wrapQuotes();
    processPartials();
}

function wrapQuotes() {

    console.log("wrap quotes");
    const quotes = jsonData.targetedFeedback.map((feedback) => feedback.quote);
    console.log(fromStudent.innerHTML);
    console.log("quotes");
    console.log(quotes);
    var i = 0;
    quotes.forEach((quote) => {
        console.log("quote", quote)
        const regex = new RegExp(quote.replace(/\W/g, '\\$&'), "g");
        //const regex = new RegExp(quote.replace(/[^\w\s]/g, '\\$&'), 'g');
        fromStudent.innerHTML = fromStudent.innerHTML.replace(
            regex,
            `<span data-id='` + i + `'class="quote">${quote}</span>`
        );
        i++;
    });
}


function updateRubric(id) {
    console.log(id, "dsa", allRubrics)
    $(".rubric h4").text(allRubrics[id].title + " rubric");
    $(".showrubric").text(allRubrics[id].title + " rubric");
    $(".rubric p").text(allRubrics[id].description);
}

function toggleRubric() {
    console.log("toggle rubric")
    //use jquery to toggle the dispaly of the rubric when the button  .toggle is clicked
    $(".rubric").toggleClass("hidden")

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
    var c = "<div data-id='" + i + "' class='comment animate__animated animate__fadeIn animate__delay-" + (i - i) + "s   " + "score" + score + "'><div class='content'><img class='migo' src='img/migo.png'><img class='teacher' src='img/teacher.png'>" + dimension + "<div class='feedback'>" + feedback + "</div><div class='buttons actions'><i class='ph ph-pencil'></i><i class='ph ph-thumbs-up'></i><i class='ph ph-thumbs-down'></i></div><div class='edits buttons hidden'><i class='ph ph-check'></i><i class='ph ph-x'></i></div></div></div>"
    return c;
}

function drawFeedback(i, score, dimension, feedback) {
    var c = " <div class='feedback'><h3>" + dimension + ": " + score + "</h3><p>" + feedback + "</p> </div > "
    return c;
}



function processFull() {
    console.log("process full")
    //loop through the overallFeedback in the jsonData object the feedback content to the p tag in the review div
    for (var i = 0; i < jsonData.overallFeedback.length; i++) {
        var dimension = jsonData.overallFeedback[i].dimension;
        var feedback = jsonData.overallFeedback[i].feedback;
        var score = jsonData.overallFeedback[i].score;
        $(".review").append(drawFeedback(i, score, dimension, feedback));

    }
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
    processFull();
}