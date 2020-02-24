// Readit
// Larry Tseng

const redditBase = "https://reddit.com/";
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";

let currentSubreddit = "";

/**
 * REFERENCE:
 * id: post.name,
 * url: post.permalink,
 * title: post.title,
 * author: post.author,
 * body: text,
 * showImage: showImage,
 * thumbnail: image,
 * alt: post.title
 */

/**
 * Concatenates a Reddit sub-path with a CORS proxy and appends .json.
 *
 * @param item - the path excluding the domain
 * @param after
 * @returns string
 */
function urlToJSON(item, after) {
    return corsAnywhere + redditBase + item + ".json" + after;
}

/**
 * Calls the Reddit API via JQuery/AJAX.
 *
 * @param subreddit - a string of the subreddit to call
 * @param after
 * @param successFn - a callback upon success
 * @param failureFn - a callback upon failure
 * @param alwaysFn - a callback that cleans up any left over process, always called
 */
function getSubreddit(subreddit, after, successFn, failureFn, alwaysFn) {
    $.ajax(urlToJSON("r/" + subreddit, after), {
        type: 'GET',
        crossDomain: true,
        success: successFn,
        error: failureFn,
        complete: alwaysFn
    })
}

function checkImageURL(url) {
    if (url === undefined) {
        return false;
    }
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
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
        let image = post.thumbnail;
        if (checkImageURL(image)) {
            showImage = true;
        } else {
            if (checkImageURL(post.url)) {
                showImage = true;
                image = post.url;
            }
        }
        if (text.length > 250) {
            text = text.slice(0, 250) + "...";
        }
        postArray.push({
            id: post.name,
            url: post.permalink,
            title: post.title,
            author: post.author,
            body: text,
            showImage: showImage,
            thumbnail: image,
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
 * @param newFeed
 */
function renderContent(template, content, location, newFeed) {
    let html = document.getElementById(template).innerHTML;
    if (newFeed) {
        document.getElementById(location).innerHTML = "";
    }
    document.getElementById(location).innerHTML += Mustache.render(html, content);
}

// Document is ready
$(document).ready(() => {
    console.log("Document is ready.");

    // Enter "popular" into the feed and get results (so it's not a blank page)
    $("#subreddit-field").val("popular");
    $("#subreddit-submit").click();
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

    currentSubreddit = $("#subreddit-field").val();
    if (currentSubreddit === "") {
        failFn();
        afterFn();
        return;
    }

    console.log("Getting subreddit: " + currentSubreddit);

    // animate submit button to loading
    $("#subreddit-submit").html("<i class='fas fa-cog fa-spin'></i>");

    getSubreddit(currentSubreddit, "", (data) => {
        console.log("Successfully completed the AJAX request.");

        // reset color
        $("#subreddit-field").removeClass("is-invalid");
        $("#subreddit-submit").removeClass("btn-outline-danger");

        if (data.data.children.length > 0) {
            renderContent("post-template", cleanUpJSON(data), "posts", true);
        } else {
            failFn();
            afterFn();
        }

        $("#load-more").prop("disabled", false);

    }, () => {
        console.error("Unable to complete the request.");
        failFn();
    }, () => {
        console.log("Done with request.");
        afterFn();
    });
});

// Fetch more posts from Reddit if requested
$("#load-more").click(() => {
    if (currentSubreddit !== "" && $("#posts").children().length > 0) {
        // Get ID of last post
        let after = $(".post").last().prop("id");

        // prevents elements that are loaded from re-animating upon new data
        $(".card").removeClass("animated");

        // Call getSubreddit(...) and render posts
        getSubreddit(currentSubreddit, "?after=" + after, (data) => {
            console.log("Loading more posts was successful");
            if (data.data.children.length > 0) {
                renderContent("post-template", cleanUpJSON(data), "posts", false);
            }
        }, () => {
            console.error("Could not load more posts");
            $("#load-more").prop("disabled", true);
        })
    }
});

// TESTS
console.assert(urlToJSON("r/popular", "") === "https://cors-anywhere.herokuapp.com/https://reddit.com/r/popular.json", "URL matching");
