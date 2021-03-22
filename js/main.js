/* global ga:false */

(function(window, undefined) {

    'use strict';

    var document = window.document;

    // -----------------------------------------------------------------
    // | Google Universal Analytics                                    |
    // -----------------------------------------------------------------

    // Check if an element or any of its parents has the specified attribute
    function hasAttr(element, attribute) {

        if (element.hasAttribute(attribute) === true) {
            return element;
        } else if (element.parentNode !== document.body) {
            return hasAttr(element.parentNode, attribute);
        }

        return undefined;
    }

    function handleClickEvent(e) {

        var action;
        var category;
        var label;
        var target = hasAttr(e.target, 'data-ga-action');
        var url;
        var value;

        var openInNewTab = false;

        if (target !== undefined) {

            action = target.getAttribute('data-ga-action') || undefined; // required
            category = target.getAttribute('data-ga-category') || undefined; // required
            label = target.getAttribute('data-ga-label') || undefined;
            url = target.getAttribute('href');
            value = parseInt(target.getAttribute('data-ga-value'), 10) || undefined;

            if (ga !== undefined &&
                category !== undefined &&
                action !== undefined) {

                // Handle outbound links manually to ensure that
                // they are registered with Google Analytics
                e.preventDefault();

                // 1. Ensure that links which need to be open in a new
                //    tab, are so.
                //
                //  These include:
                //
                //  * `Download` links
                //
                //     The `Download` links aren't directing the user
                //     away from the page, so using `window.location.href`
                //     in this case may cause unwanted problems.
                //
                //     E.g: If the user clicks on a `Download` link
                //     before all the page's content is downloaded, the
                //     browser will abort any remaining downloads. This
                //     happens because the browser considers that it no
                //     longer needs to download anything from current
                //     page and should start downloading the next page
                //     and its content.
                //
                //  * Outbound links that are opened by the user using
                //    ctrl+click (or cmd+click on Macintosh)
                //
                //  * Center button clicks

                if (category === 'Download' ||
                    e.ctrlKey === true ||
                    e.metaKey === true ||
                    e.which === 2) {

                    openInNewTab = true;
                    window.open(url); // This is done here, and not
                    // in `hitCallback` so that it
                    // prevents the browser popup
                    // blocking behavior
                }

                (function(url) {

                    var timeout;

                    // Register the event
                    ga('send', 'event', category, action, label, value, {

                        // 2. Ensure that outbound links are registered
                        //    before navigating away from the current page
                        //    https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#hitCallback

                        'hitCallback': function() {
                            if (openInNewTab === false) {
                                if (timeout !== undefined) {
                                    clearTimeout(timeout);
                                }
                                window.location = url;
                            }
                        }

                    });

                    // In case `hitCallback` takes too long
                    timeout = setTimeout(function() {
                        if (openInNewTab === false) {
                            window.location.href = url;
                        }
                    }, 1000);

                }(url));

            }
        }
    }

    // More information about the Google Universal Analytics:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/
    // https://mathiasbynens.be/notes/async-analytics-snippet#universal-analytics

    function loadGoogleAnalytics() {

        /* jshint ignore:start */
        (function(b, o, i, l, e, r) {
            b.GoogleAnalyticsObject = l;
            b[l] || (b[l] = function() {
                (b[l].q = b[l].q || []).push(arguments)
            });
            b[l].l = +new Date;
            e = o.createElement(i);
            r = o.getElementsByTagName(i)[0];
            e.src = 'https://www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e, r)
        }(window, document, 'script', 'ga'));
        /* jshint ignore:end */

        // Create tracker object
        ga('create', 'UA-17904194-1', 'auto');

        // Send a page view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
        ga('send', 'pageview');

        // Track events
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        window.document.addEventListener('click', handleClickEvent);

    }

    // -----------------------------------------------------------------
    // | Twitter                                                       |
    // -----------------------------------------------------------------

    // Tweet Buttons
    // https://dev.twitter.com/web/tweet-button

    function loadTweetButtons() {
        /* jshint ignore:start */
        ! function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = 'https://platform.twitter.com/widgets.js';
                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, 'script', 'twitter-wjs');
        /* jshint ignore:end */
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    loadGoogleAnalytics();
    window.onload = loadTweetButtons;

}(window));
// -----------------------------------------------------------------
// | Instagram API                                           |
// -----------------------------------------------------------------

async function instaRequest(num) {
    try {
	const accessTopken = "IGQVJXSDBIUU90MlpnZA2VZAeUtTaHc5SVJZAMTRNazMwTkJTQXdZALUw5Sm5YX2JMaHRWY1h2R2dUQ21XR2xBSTBMSjVYZA0M2VXpQMnpra0s4VHdseVU5elBTaFV5NTE0N1cxb0RmRjlocUNsclBOTzVMMAZDZD";
	const result = await fetch(`https://graph.instagram.com/me/media?access_token=${accessToken}&fields=media_url,media_type,caption,permalink`, {  
            method: 'GET',
        });
        let instaData = await result.json();
	    console.log(result)
        /*for (let i = 0; i < instaData.data.length; i++) {
            const container = document.getElementById('instafeed');
            let imgURL = instaData.data[i].images.standard_resolution.url;
            let imgDirectLink = instaData.data[i].link;
            const div = document.createElement('div');
            div.setAttribute('class', 'instapic');
            container.appendChild(div);
            const imgLink = document.createElement('a');
            const img = document.createElement('img');
            img.setAttribute('src', imgURL)
            imgLink.setAttribute('href', imgDirectLink)
            div.appendChild(imgLink);
            imgLink.appendChild(img);
        }*/
        console.log("retrieving instagram posts");
    } catch (error) {
        console.log(error);
    }
}
instaRequest(8);


// -----------------------------------------------------------------
// | Nightscout REST API                                           |
// -----------------------------------------------------------------

async function getGlucose() {
    try {
        const result = await fetch('https://cors-anywhere.herokuapp.com/https://simon-philpott-nightscout.herokuapp.com/api/v1/entries/sgv.json?count=1&token=PoppyBurrpott', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        const data = await result.json();
        /*** FOR TESTING ***/
        //const BGmmol = 3.1;
        //const BGmmol = 3.2;
        //const BGmmol = 5.5;
        const BGmmol = Math.round((data[0].sgv / 18) * 10) / 10;
        const BGtrend = data[0].direction;
        let correction = Math.round((BGmmol - 5.5) / 1.25)
        const goodBG = "<strong>Live</strong>: Simon is doing okay <i class='far fa-thumbs-up'></i>";
        const highBG = "<strong>Live</strong>: Simon could do with some insulin <i class='fas fa-syringe'></i>(" + correction + " units)";
        const lowBG = "<strong>Live</strong>: Simon could do with a biscuit <i class='fas fa-cookie-bite'></i>(" + Math.abs(correction) * 10 + " grams)";
        document.querySelector('#bg').innerText = BGmmol;
        console.log("polling for BG");
        if (BGmmol < 3.9) {
            document.querySelector('#man').style.color = "#ffc000";
            document.querySelector('#summary').innerHTML = lowBG;
        } else if (BGmmol > 3.9 && BGmmol < 7.5) {
            document.querySelector('#man').style.color = "#AFBD38";
            document.querySelector('#summary').innerHTML = goodBG;
        } else {
            document.querySelector('#man').style.color = "#f5591d";
            document.querySelector('#summary').innerHTML = highBG;
        }
        if (BGtrend == "Flat") {
            document.querySelector('#bg').innerHTML = document.querySelector('#bg').innerHTML + "<div id='direction'>→</div>";
        } else if (BGtrend == "SingleUp") {
            document.querySelector('#bg').innerHTML = document.querySelector('#bg').innerHTML + "<div id='direction'>↑</div>";
        } else if (BGtrend == "DoubleUp") {
            document.querySelector('#bg').innerHTML = document.querySelector('#bg').innerHTML + "<div id='direction'>↑↑</div>";
        } else if (BGtrend == "SingleDown") {
            document.querySelector('#bg').innerHTML = document.querySelector('#bg').innerHTML + "<div id='direction'>↓</div>";
        } else if (BGtrend == "DoubleDown") {
            document.querySelector('#bg').innerHTML = document.querySelector('#bg').innerHTML + "<div id='direction'>↓↓</div>";
        }
    } catch (error) {
        console.log(error);
    }
} {
    let minutes = 5;
    const timer = minutes * 60 * 1000;
    let glucoseRetrieve = setInterval(() => getGlucose(), timer);
}
getGlucose();
