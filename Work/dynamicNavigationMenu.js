//Build Dynamic Page Bookmark Menu
var bookmarkSlideoutMenu = document.getElementById("bookmarkMenu");
if (bookmarkSlideoutMenu) { /*If the bookmark menu is on the page*/
    bookmarkSlideoutMenu.innerHTML = "<span class='rotate'>Page bookmarks</span><div id='slideout_inner' class='shadow'><ul></ul></div>"
    var bookmarkContainer = bookmarkSlideoutMenu.getElementsByTagName("ul")[0];
    var pageBookmarks = [].slice.call(document.querySelectorAll(".bookmark"));
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
        newBookmarkLink.className = "bookmarkLink";
    }
    /*Build the back to top link*/
    var backToTopBookmark = document.createElement("li");
    backToTopBookmark.innerHTML = "<a class='bookmarkLink' href='#pageBookmarkMenu'>Back to the top</a>";
    bookmarkContainer.appendChild(backToTopBookmark);
}