var tipHeight;
var tipWidth;
var imageAdjust;

function showTooltip(el) {
    var image = document.getElementById(el).getElementsByTagName("img")[0];
    document.getElementById(el).style.display = "block";
    document.getElementById(el).style.opacity = "1";
    tipHeight = document.getElementById(el).clientHeight;
    tipWidth = document.getElementById(el).clientWidth;
    if (document.getElementById(el).getElementsByTagName('img').length > 0) {
        document.getElementById(el).style.padding = "10px 10px 10px 55px;";

    } else {
        document.getElementById(el).style.padding = "10px";
    }
    document.getElementById(el).style.top = -Math.abs(tipHeight) - 25 + 'px';
    setTimeout(
        function() {
            hideTooltip(el);
        }, 3000);
}

function hideTooltip(el) {
    document.getElementById(el).style.display = "none";
    document.getElementById(el).style.opacity = "0";
}

function mouseMove() {
    var tip = document.querySelectorAll('.tooltip');

    function mouseX(evt) {
        if (evt.pageX) return evt.pageX;
        if (evt.clientX) return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        return 0;
    }

    function mouseY(evt) {
        if (evt.pageY) return evt.pageY;
        if (evt.clientY) return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        return 0;
    }

    function follow(evt) {
        var scrollRight = document.documentElement.scrollLeft; /*how far the windows is scrolled to the right*/
        var viewportwidth = window.innerWidth; /*The width of the browser window*/
        var viewportheight = window.innerHeight; /*The height of the browser window*/
        var offX = -Math.abs(tipWidth / 2); /*Half the total popup width as an offset from the mouse cursor to hover in the centre*/
        var offY = -Math.abs(tipHeight) - 25; /*The total popup height + 25px as an offset from the mouse cursor to hover above the cursor*/
        var stopOffscreenLeft = Math.abs(offX); /* The popup width (halved) as a positive figure to use to stop the popup going offscreen to the left*/
        var stopOffscreenTop = Math.abs(offY); /* The popup high (plus Y offset) as a positive figure to use to stop the popup going offscreen to the top*/
        var mousePosX = evt.clientX; /* The mouse cursor Position on the X*/
        evt = evt || window.event;
        for (var i = 0; i < tip.length; ++i) {
            var tooltipList = tip[i];
            tooltipList.style.left = (parseInt(mouseX(evt)) + offX) + 'px';
            tooltipList.style.top = (parseInt(mouseY(evt)) + offY) + 'px';
            if (mousePosX <= stopOffscreenLeft + 10) { /*Stop the popup going off the screen on the left*/
                tooltipList.style.left = (10 + scrollRight) + 'px';
            }
            if (mousePosX >= viewportwidth - stopOffscreenLeft - 20) { /*Stop the popup going off the screen on the right allowing for scrollbar width*/
                tooltipList.style.left = (viewportwidth + (offX * 2) + scrollRight - 25) + 'px';
            }
            if (evt.clientY <= stopOffscreenTop) { /*Stop the popup going off the top of the screen by switching it to beneath the cursor*/
                tooltipList.style.top = (parseInt(mouseY(evt)) + 20) + 'px';
            }
            tooltipList.style.width = viewportwidth - 100 + "px"; /*Resize the tooltip width if the browser widow is narrow*/
        }
    }
    document.onmousemove = follow;
}
mouseMove();