//Build Dynamic Page Bookmark Menu
var bookmarkSlideoutMenu = document.getElementById("bookmarkMenu");
if (bookmarkSlideoutMenu) { /*If the bookmark menu is on the page*/
    bookmarkSlideoutMenu.innerHTML = "<span class='rotate'><img src='/ttintra/KMInfoOnLine2006.nsf/attlibweb/upDownIconpng/$file/upDownIcon.png' id='jumpIcon'>Page bookmarks</span><div id='slideout_inner' class='shadow'><ul></ul></div>"
    var bookmarkContainer = bookmarkSlideoutMenu.getElementsByTagName("ul")[0];
    var pageBookmarks = [].slice.call(document.querySelectorAll(".icon"));
    var bookMarkTitles = [];
    var bookmarkIDs = [];
    /* Remove the duplicate values*/
    for (i = 0; i < pageBookmarks.length; ++i) {
        bookMarkTitles.push(pageBookmarks[i].innerText);
        bookmarkIDs.push(pageBookmarks[i].id);
    }
    var uniqueBookMarkTitles = bookMarkTitles.filter(function(elem, pos) {
        return bookMarkTitles.indexOf(elem) == pos;
    });
    var uniqueBookmarkIDs = bookmarkIDs.filter(function(elem, pos) {
        return bookmarkIDs.indexOf(elem) == pos;
    });
    /*Build the bookmark links*/
    for (i = 0; i < uniqueBookMarkTitles.length; ++i) {
        var newBookmark = document.createElement("li");
        var newBookmarkLink = document.createElement("a");
        bookmarkContainer.appendChild(newBookmark);
        newBookmark.appendChild(newBookmarkLink);
        newBookmarkLink.innerText = uniqueBookMarkTitles[i];
        newBookmarkLink.href = "#" + uniqueBookmarkIDs[i];
        newBookmarkLink.className = "TThotspot";
    }
    /*Build the back to top link*/
    var backToTopBookmark = document.createElement("li");
    backToTopBookmark.innerHTML = "<a class='TThotspot' href='#contentPage'>Back to the top</a>";
    bookmarkContainer.appendChild(backToTopBookmark);
}