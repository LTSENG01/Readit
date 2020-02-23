const redditBase = "https://reddit.com/";
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";

function urlToJSON(item) {
    return corsAnywhere + redditBase + item + ".json";
}

function getSubreddit(subreddit, successFn, failureFn, alwaysFn) {
    $.ajax(urlToJSON("r/" + subreddit), {
        type: 'GET',
        crossDomain: true,
        success: successFn,
        error: failureFn,
        complete: alwaysFn
    })
}

// Document is ready
$(document).ready(() => {
    console.log("Document is ready.");
});


// On submit, UI changes and parse data
$("#subreddit-submit").click(() => {

    let failFn = () => {
        // highlight text input as red and shake the input group
        $("#subreddit-input-group").addClass("animated shake");
        $("#subreddit-field").addClass("is-invalid");
        $("#subreddit-submit").addClass("btn-outline-danger");
    };

    let afterFn = () => {
        // reset submit button
        $("#subreddit-submit").html("Find Subreddit");

        // remove animation
        const element =  document.querySelector('#subreddit-input-group');
        element.addEventListener('animationend', () => element.classList.remove("animated", "shake"));
    };

    let subreddit = $("#subreddit-field").val();
    if (subreddit === "") {
        failFn();
        afterFn();
        return;
    }

    console.log("Getting subreddit: " + subreddit);

    // animate submit button to loading
    $("#subreddit-submit").html("<i class='fas fa-cog fa-spin'></i>");

    let result;
    getSubreddit(subreddit, (data) => {
        console.log("Successfully completed the request.");

        // reset color
        $("#subreddit-field").removeClass("is-invalid");
        $("#subreddit-submit").removeClass("btn-outline-danger");

    }, () => {
        console.error("Unable to complete the request.");
        failFn();
    }, () => {
        console.log("Done with request.");
        afterFn();
    });
});
