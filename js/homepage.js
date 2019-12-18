/*HP constants*/
const hpProps = {
    navHeight: document.querySelector(".nav").clientHeight - 32,
    header: document.querySelector('.section__header.contact__details'),
    welcome: document.querySelector('.section__header.contact__details+.section__content'),
    // removed TimelineMax() / gsap.timeline()
    tl: new TimelineMax()
};
//removed TweenLite / gsap
gsap.fromTo([hpProps.header, hpProps.welcome], 1, { opacity: 0, y: 25 }, { opacity: 1, y: 0 });
let h = document.querySelector('.animated_homepage').clientHeight;
const makeParticles = () => {
    Math.randMinMax = function(t, n, a) {
        var r = t + Math.random() * (n - t)
        return a && (r = Math.round(r)), r
    }
    let w = window.innerWidth,
        numberOfParticles = 25,
        PosX = 0,
        PosY = 0;
    for (i = 0; i < numberOfParticles; i++) {
        const particlesNew = document.createElement('div'),
            PosX = Math.floor(Math.random() * w),
            PosY = h;
        let size = Math.floor(Math.random() * 5);
        particlesNew.className = 'particle';
        document.querySelector('.animated_homepage').append(particlesNew);
        //removed TweenLite / gsap
            TweenLite.set(particlesNew, {
            x: PosX,
            y: PosY - (size * 10),
            force3D: true,
            width: size,
            height: size,
            autoAlpha: 1
        })

        hpProps.tl.to(particlesNew, Math.randMinMax(5, 7), {
                x: PosX,
                y: -(h + (size * 2)),
                autoAlpha: 0,
                repeat: -1,
                repeatDelay: Math.randMinMax(0, 1),
                ease: Linear.easeNone
            },
            Math.randMinMax(0, 4))
    }
}
makeParticles();
/*is the animated homepage header in view? then animate*/
const animateHomepage = () => {
    const selector = document.querySelector('.animated_homepage'),
        selectorTop = selector.getBoundingClientRect().top,
        selectorHeight = selector.clientHeight;
    if (selectorTop + selectorHeight >= 0) {
        hpProps.tl.play();
    } else {
        hpProps.tl.remove();
    }
}


window.addEventListener('resize', function() {
    h = document.querySelector('.animated_homepage').clientHeight;
}, false);
//Removed TimelineMax() / gsap.timeline();
var tlBorder = new TimelineMax();

tlBorder.to(".animated_homepage", 1, { borderWidth: 10, ease: Back.easeInOut }, 0);
//Removed TweenLite / gsap
TweenLite.fromTo(".homepage__heading", 2, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, delay: 1 });
