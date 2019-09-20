var select = function(s) {
        return document.querySelector(s);
    },
    selectAll = function(s) {
        return document.querySelectorAll(s);
    },
    tl = new TimelineMax({ delay: 2 }),
    svg = select('svg'),
    pinetrees = selectAll('.pinetree'),
    trees = selectAll('.tree'),
    treeMain = select('.tree-main'),
    treeMainLeaves = select('.tree-main__leaves'),
    bushes = selectAll('.bush'),
    cabins = selectAll('.cabin'),
    sun = select('.sun'),
    // Snow
    snow = select('.snow'),
    // Snowflakes
    snowflakes = selectAll('.snowflake'),
    // Text
    text = select('.text'),
    // Steam
    steams = selectAll('.steam'),
    steamCabinRed = select('.steam-cabin-red'),
    steamCabinBlue = select('.steam-cabin-blue');

// Set
TweenMax.set(svg, { css: { visibility: 'visible' } });
TweenMax.set([snow, pinetrees, trees, bushes, cabins], { scale: 0, transformOrigin: 'center bottom' });
TweenMax.set(sun, { x: -150, y: 100, scale: 0 });
TweenMax.set(text, { y: 660 });
TweenMax.set([steams, steamCabinRed, steamCabinBlue], { autoAlpha: 0 });

// Timeline
tl
    .add('snowflakes')
    .to(snow, .8, { scale: 1, ease: Sine.easeOut })
    .staggerTo(pinetrees, 1, { scale: 1, ease: Elastic.easeOut }, .2)
    .staggerTo(trees, 1, { scale: 1, ease: Elastic.easeOut }, .2, '-=1.5')
    .staggerTo(bushes, 1, { scale: 1, ease: Elastic.easeOut }, 0, '-=.5')
    .to(treeMainLeaves, 1.5, { rotation: 360, transformOrigin: 'center', ease: Elastic.easeOut }, '-=.5')
    .to(sun, 1, { x: '+=150', y: '-=100', scale: 1, ease: Bounce.easeOut }, '-=1.5')
    .add('text')
    .staggerTo(cabins, 1, { scale: 1, ease: Elastic.easeOut }, 1.15, '-=.5')
    .to(steamCabinBlue, 1.5, { autoAlpha: .25 }, '-=1.5')
    .add('cabinBlue')
    .to(steamCabinRed, 1.5, { autoAlpha: .25 })
    .add('cabinRed')
    .add('steams')
    .fromTo(steamCabinRed, 3, { scaleX: .8, skewX: 2, transformOrigin: 'center bottom' }, { scaleX: 1, skewX: -2, repeat: -1, yoyo: true, ease: Power1.easeInOut }, 'cabinRed-=2')
    .fromTo(steamCabinBlue, 3, { scaleX: .95, skewX: 2, transformOrigin: 'center bottom' }, { scaleX: 1, skewX: -2, repeat: -1, yoyo: true, ease: Power1.easeInOut }, 'cabinBlue-=2')
    .to(steams, 4, { autoAlpha: .25 }, 'steams')
    .to(text, 9.75, { y: 0, ease: Power2.easeOut }, 'text-=2')

.staggerTo('.snowflakes1 path', 18, {
    cycle: {
        x: function(i) {
            return (Math.random() * 2 - 1) * i;
        },
        y: function(i) {
            return (Math.random() * 2 - 1) * i;
        }
    },
    repeat: -1,
    yoyo: true,
    ease: Power0.easeInOut
}, 0, 'snowflakes')

// Restart on click
svg.onclick = function() {
    tl.restart();
};