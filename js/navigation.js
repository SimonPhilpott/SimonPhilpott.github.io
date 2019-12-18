/*Nav constants*/
const menuProps = {
    navHeight: document.querySelector(".nav").clientHeight - 32,
    smallNavHeight: "2.5rem",
    longAnim: "all 0.5s ease-out",
    shortAnim: "all 0.25s ease-out",
    noAmim: "all 0s ease-out",
    navDown: "fas fa-angle-down",
    navUp: "fas fa-angle-up",
    navBar: document.querySelector(".nav"),
    menuItems: document.querySelector('.nav .nav__menu'),
    menuLinks: document.querySelectorAll('.nav .nav__item a'),
    menuArrow: document.querySelector(".menu__arrow"),
    closeExpNav: document.querySelector(".menu__close"),
    closeExpNavToggle: document.querySelector(".menu__close i"),
    pages: document.querySelectorAll('article.section'),
    mediaQueryRes: "(min-width: 1024px)"
};
let shrunkNav = false;

/*Move the arrow*/
const menuArrowMove = (position) => {
    TweenLite.to(menuProps.menuArrow, 0.5, { top: position, force3D: true });
}

for (let i = 0; i < menuProps.menuLinks.length; i++) {
    //console.log(menuProps.menuLinks[i].innerText + " top: " + menuProps.menuLinks[i].getBoundingClientRect().top + " height: " + menuProps.menuLinks[i].offsetHeight);
    let offsetYPos = menuProps.menuLinks[i].offsetHeight /2;
    menuProps.menuLinks[i].addEventListener('click', function() {
        //menuArrowMove(this, menuProps.menuLinks[i].getBoundingClientRect().top - offsetYPos+"px");
        menuArrowMove(menuProps.menuLinks[i].getBoundingClientRect().top - offsetYPos+"px");
    });
}

/*is the page header in view? then update the menu arrow*/
const matchPageToMenu = () => {
    const offsetY = window.innerHeight / 2;
    for (let i = 0; i < menuProps.pages.length; i++) {
        let selector = menuProps.pages[i].id,
            selectorTop = document.querySelector(`"#${selector}"`).getBoundingClientRect().top;
        console.log(document.querySelector(`"#${selector}"`));
        
        /*,
            targetMenuItem = document.querySelector(`[data-identity='${selector}']`),
            targetMenuItemState = targetMenuItem.getAttribute("data-state");
            console.log("selector: " + selector + " selectorTop: " + selectorTop +  "targetMenuItem: " + targetMenuItem)*/
        /*if (selectorTop >= 0 && selectorTop <= (window.innerHeight - offsetY)) {
            if (targetMenuItemState != "true") {
                console.log(selector);
                targetMenuItem.setAttribute("data-state", "true");
                let offsetYPos = targetMenuItem.offsetHeight /2;
                console.log("offsetYPos "+ offsetYPos + " targetMenuItem.getBoundingClientRect().top "+ targetMenuItem.getBoundingClientRect().top )
                //menuArrowMove(targetMenuItem, targetMenuItem.getBoundingClientRect().top - offsetYPos+"px")
                menuArrowMove(targetMenuItem.getBoundingClientRect().top - offsetYPos+"px")
            }
        } else {
            targetMenuItem.setAttribute("data-state", "false");
        }*/
    }
}

/* On first load*/

document.addEventListener("DOMContentLoaded", function() {
    /*if (location.hash){
        let targetMenuItem = `[data-identity='${location.hash.substr(1)}']`;
        console.log(targetMenuItem);
        document.querySelector(targetMenuItem).click();
    }    */
    if (window.matchMedia('(min-width: 1024px)').matches) {
        //Wide viewport
        //matchPageToMenu();
    } else {
        //Small viewport
        checkPosition();
    }
}, false);

/* Attach event handlers to window resize */
window.addEventListener('resize', function() {
    animateHomepage();
    if (window.matchMedia(menuProps.mediaQueryRes).matches) {
        //Wide viewport
        //Activate the navigation arrow. Restore the menu if the window has been resized from a small size. 
        restoreNav();
        matchPageToMenu();
        shrunkNav = false;
    } else {
        //Small viewport
        checkPosition();
    }
}, false);

/* Attach event handlers to window scrolling, to trigger animation etc. */

const checkPosition = () => {
    let windowY = window.scrollY;
    /* If at the TOP of the page, restore the full menu*/
    if (windowY == 0) {
        menuProps.navBar.style.position = "relative";
        menuProps.navBar.style.overflow = "visible";
        menuProps.navBar.style.height = "auto";
        if (menuProps.closeExpNavToggle.className == menuProps.navDown) {
            expandNav();
        }
    } else {
        // Scrolling DOWN
        menuProps.navBar.style.position = "fixed";
        menuProps.navBar.style.overflow = "hidden";
        shrinkNav();
    }
    scrollPos = windowY;
}

window.addEventListener('scroll', function() {
    animateHomepage();
    if (window.matchMedia(menuProps.mediaQueryRes).matches) {
        //Wide viewport
        //Activate the navigation arrow. Reset the menu if the window has been resized from a small size. 
        matchPageToMenu();
    } else {
        //Small viewport;
        checkPosition();
    }
}, false);

/* Attach event handlers to menu open/collapse/hide and restore for wide viewports */

const restoreNav = () => {
    console.log("restoreNav");
    menuProps.navBar.style.position = "fixed";
    menuProps.navBar.style.overflow = "visible";
    menuProps.navBar.style.height = "100vh";
    TweenLite.to(menuProps.menuItems, 0.2, { y: 0 });
    menuProps.menuItems.style.opacity = 1;
    menuProps.menuItems.style.visibility = "visible";
};

const expandNav = () => {
    console.log("expandNav");
    TweenLite.to(menuProps.closeExpNav, 0.2, { top: "2rem" })
    menuProps.closeExpNavToggle.className = menuProps.navUp;
    TweenLite.set(menuProps.navBar, { height: "auto" });
    TweenLite.from(menuProps.navBar, 0.2, { height: menuProps.smallNavHeight });
    TweenLite.to(menuProps.menuItems, 0.2, { y: 0, autoAlpha: 1 });
    shrunkNav = false;
};

const shrinkNav = () => {
    if (shrunkNav == false) {
        console.log("shrinkNav");
        TweenLite.to(menuProps.closeExpNav, 0.2, { top: "0rem" })
        menuProps.closeExpNavToggle.className = menuProps.navDown;
        TweenLite.to(menuProps.navBar, 0.2, { height: menuProps.smallNavHeight });
        TweenLite.to(menuProps.menuItems, 0.2, { y: `-${menuProps.navHeight}`, autoAlpha: 0 });
        shrunkNav = true;
    }
};



menuProps.closeExpNav.addEventListener("click", () => {
    if (menuProps.closeExpNavToggle.className == menuProps.navUp) {
        shrinkNav();
    } else {
        expandNav();
    }
});


/*Grow the vine*/
/*const growVine = (leaves) => {
        const vinePot = document.querySelector('.menu__vine');
        let leafCount = vinePot.querySelectorAll('.fa-seedling');
        const newLeaves = document.createElement("i");
        newLeaves.className = "fas fa-seedling";
        let leafSize = function(num) {
                const lv = (num / 5) + .3;
                if (lv < 1) {
                    return lv;
                } else {
                    return 1;
                }
            }
            //const leafStartPosititon = leafCount * leafSize(i);
            //const leafEndPosititon = leafStartPosititon + leafSize(i);
        vinePot.append(newLeaves);
        //TweenLite.fromTo(newLeaves, 2, { opacity: 0, y: leafStartPosititon, scale: "0" }, { opacity: 1, y: leafEndPosititon, scale: `${leafSize(i)}` });

    }*/
