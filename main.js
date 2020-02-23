const redditBase = "https://reddit.com/";
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";

/**
 * Concatenates a Reddit sub-path with a CORS proxy and appends .json.
 *
 * @param item - the path excluding the domain
 * @returns string
 */
function urlToJSON(item) {
    return corsAnywhere + redditBase + item + ".json";
}

/**
 * Calls the Reddit API via JQuery/AJAX.
 *
 * @param subreddit - a string of the subreddit to call
 * @param successFn - a callback upon success
 * @param failureFn - a callback upon failure
 * @param alwaysFn - a callback that cleans up any left over process, always called
 */
function getSubreddit(subreddit, successFn, failureFn, alwaysFn) {
    $.ajax(urlToJSON("r/" + subreddit), {
        type: 'GET',
        crossDomain: true,
        success: successFn,
        error: failureFn,
        complete: alwaysFn
    })
}

/**
 *
 * @param posts
 * @returns {posts: []} containing all the posts
 */
function cleanUpJSON(posts) {
    let postArray = [];
    posts.data.children.forEach((p) => {
        let post = p.data;
        let showImage = false;
        let text = post.selftext;
        if (post.thumbnail !== "" && post.thumbnail !== "self" && post.thumbnail !== "default") {
            showImage = true;
        }
        if (text.length > 250) {
            text = text.slice(0, 250) + "...";
        }
        postArray.push({
            url: post.permalink,
            title: post.title,
            author: post.author,
            body: text,
            showImage: showImage,
            thumbnail: post.thumbnail,
            alt: post.title
        });
    });
    let finalObject = {
        "posts" : postArray
    };
    console.log(finalObject);
    return finalObject;
}

/**
 * Renders a template with actual information from Reddit. Uses Mustache.js.
 *
 * @param template - the HTML template to be rendered (string matching ID)
 * @param content - an object of objects with post information
 * @param location
 */
function renderContent(template, content, location) {
    let html = document.getElementById(template).innerHTML;
    document.getElementById(location).innerHTML = Mustache.render(html, content);
}

// Document is ready
$(document).ready(() => {
    console.log("Document is ready.");
    $("#subreddit-field").val("popular");
    // $("#subreddit-submit").click();
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
        $("#subreddit-submit").html("Readit");

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
        console.log("Successfully completed the AJAX request.");

        // reset color
        $("#subreddit-field").removeClass("is-invalid");
        $("#subreddit-submit").removeClass("btn-outline-danger");

        if (data.data.children.length > 0) {
            renderContent("post-template", cleanUpJSON(data), "posts");
        } else {
            failFn();
            afterFn();
        }


    }, () => {
        console.error("Unable to complete the request.");
        failFn();
    }, () => {
        console.log("Done with request.");
        afterFn();
    });
});
