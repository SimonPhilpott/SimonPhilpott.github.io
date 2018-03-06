function lightBox() {
    var lightBoxCount = document.getElementsByClassName('lightbox');
    for (var i = 0; i < lightBoxCount.length; i++) {
        var items = lightBoxCount[i];
        var imageText = document.createElement('span');
        var closeIcon = document.createElement('span');
        imageText.className = "imageTxt";
        imageText.innerHTML = "Click to view a larger version";
        closeIcon.className = "close";
        closeIcon.innerHTML = "&times;";
        items.appendChild(imageText);
        items.appendChild(closeIcon);
        var image = items.getElementsByTagName('img')[0];
        image.onmouseover = function() {
            this.style.opacity = 0.7;
        }
        image.onmouseout = function() {
            this.style.opacity = 1;
        }
        imageText.onmouseover = function() {
            this.parentNode.getElementsByTagName('img')[0].style.opacity = 0.7;
        }
        imageText.onclick = function() {
            resizeImage = this.parentNode.getElementsByTagName('img')[0];
            this.parentNode.className += " modal";
            //resizeImage.style.width = resizeImage.naturalWidth + "px";
            resizeImage.style.height = resizeImage.naturalHeight + "px";
            resizeImage.style.marginTop = "50px";
            document.body.style.overflow = "hidden";
        }
        image.onclick = function() {
            this.parentNode.className += " modal";
            //this.style.width = this.naturalWidth + "px";
            this.style.height = this.naturalHeight + "px";
            this.style.marginTop = "50px";
            document.body.style.overflow = "hidden";
        }
        closeIcon.onclick = function() {
            resizeImage = this.parentNode.getElementsByTagName('img')[0];
            this.parentNode.className = "lightbox";
            //resizeImage.style.width = "300px";
            resizeImage.style.height = "225px";
            resizeImage.style.marginTop = 0;
            document.body.style.overflow = "scroll";
        };
    };
}
lightBox();

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slideshow = document.getElementsByClassName("slideshow")[0];
    if (slideshow) {
        var slides = slideshow.getElementsByClassName("lightbox");
        if (slides && n > slides.length) { slideIndex = 1 }
        if (slides && n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }
}