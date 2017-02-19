'use strict';

import debounce      from 'lodash/debounce';
import random        from 'lodash/random';
import React         from 'react';
import ReactDOM      from 'react-dom';
import { Provider }  from 'react-redux';
import actions       from './actions';
import camera        from './camera';
import data          from './data/data';
import store         from './store';
import App           from './components/app';

function resizeCamera () {
    if (window.innerWidth >= 1024) {
        camera.setSize(600);
    }
    else {
        let rowStyle = window.getComputedStyle(camera.view.parentElement.parentElement.parentElement);
        camera.setSize(window.innerWidth - parseInt(rowStyle.paddingLeft) - parseInt(rowStyle.paddingRight));
    }
}



// Set up miscellaneous bits
// --------------------
document.getElementById('copyrightYear').innerHTML = new Date().getFullYear();
prettyPrint();
data.scrollItems.forEach(function (item) {
    document.querySelector(item.trigger).addEventListener('click', function () {
        event.preventDefault();
        TweenLite.to(window, 0.7, { scrollTo: item.target, ease: Power2.easeOut });
    })
});



// Set up home banner animation
// --------------------
let homeBannerGraphic = document.getElementById('homeBannerGraphic');
let graphicAnimation = new TimelineMax({ paused: true });
let animationPlayControl = new TimelineMax({ repeat: -1 });

TweenLite.fromTo(homeBannerGraphic, 0.75, { opacity: 0 }, { opacity: 1, rotation: 360, y: -200, ease: Power3.easeOut });

graphicAnimation
    .to(homeBannerGraphic, 0.5, { rotation: function () { return '-=' + random(1, 3) }, ease: Power2.easeOut, force3D: true})
    .to(homeBannerGraphic, 1.0, { rotation: function () { return '+=' + random(3, 7) }, ease: Power3.easeOut, force3D: true });

animationPlayControl.add(graphicAnimation.tweenFromTo(0, graphicAnimation.duration(), { onComplete: function () { this.target.invalidate(); }}), 4);
animationPlayControl.add(graphicAnimation.tweenFromTo(0, graphicAnimation.duration(), { onComplete: function () { this.target.invalidate(); }}), 12);
animationPlayControl.add(graphicAnimation.tweenFromTo(0, graphicAnimation.duration(), { onComplete: function () { this.target.invalidate(); }}), 20);



// Set up camera
// --------------------
camera.setSize(600, 500).setView('#camera');

// Initialize scenes
camera.addScene('scene1', new Oculo.Scene('#scene1', 1350, 900));
camera.addScene('scene2', new Oculo.Scene('#scene2', 1827, 1215));
camera.addScene('scene3', '#scene3');

data.elements.forEach(function (item) {
    let htmlElement = document.createElement('div');
    htmlElement.className = 'element ' + item.metalCategory.toLowerCase();
    htmlElement.setAttribute('id', item.name);
    htmlElement.innerHTML = '<div class="element-number">' + item.atomicNumber + '</div><div class="element-symbol">' + item.symbol + '</div><div class="element-name">' + item.name + '</div><div class="element-weight">' + item.weight + '</div>';
    htmlElement.style.top = (item.col - 1) * 90 + 'px';
    htmlElement.style.left = (item.row - 1) * 75 + 'px';
    camera.scenes.get('scene1').view.appendChild(htmlElement);
});

camera.setScene('scene1');

// Initialize animations
const animations = [{
    name: 'intro',
    keyframes: [{
        duration: 0,
        position: function () {
            return {
                x: camera.scene.width * 0.5,
                y: camera.scene.height * 0.5
            }
        }, 
        zoom: 2,
        options: {
            onComplete: function () { this.camera.play('delayedZoomOut'); }
        }
    }]
}, {
    name: 'delayedZoomOut',
    keyframes: [{ 
        zoom: 0.4, 
        duration: 0.6,
        options: {
            ease: Power2.easeInOut,
            delay: 0.5
        }
    }]
}];

animations.forEach(function (item) {
    camera.addAnimation(item.name, item);
});

//camera.addAnimation('moveTo2000', new Oculo.Animation(camera).animate({position: {x:2000, y:500}, zoom: 1.5}, 2));
//camera.addAnimation('rotateAt200', new Oculo.Animation(camera).rotateAt({x:200, y:200}, -50, 5));
//camera.addAnimation('rotateTo20', new Oculo.Animation(camera).rotateTo(-20, 2));
//camera.addAnimation('shakeEaseNone', new Oculo.Animation(camera).shake(0.1, 2, Oculo.Animation.shake.direction.BOTH));
//camera.addAnimation('shakeEase', new Oculo.Animation(camera).shake(0.1, 2, Oculo.Animation.shake.direction.BOTH, { ease: Power2.easeIn }));
//camera.addAnimation('shakeEaseIn', new Oculo.Animation(camera).shake(0.1, 2, Oculo.Animation.shake.direction.BOTH, { easeIn: Power2.easeIn }));
//camera.addAnimation('shakeEaseOut', new Oculo.Animation(camera).shake(0.1, 2, Oculo.Animation.shake.direction.BOTH, { easeOut: Power2.easeOut }));
//camera.addAnimation('shakeEaseInOut', new Oculo.Animation(camera).shake(0.1, 4, Oculo.Animation.shake.direction.BOTH, { easeIn: Power2.easeIn, easeOut: Power2.easeOut }));
//camera.addAnimation('shakeNoBounds', new Oculo.Animation(camera).shake(0.1, 2, Oculo.Animation.shake.direction.BOTH, { enforceBounds: false }));
//camera.addAnimation('zoomTo50', new Oculo.Animation(camera).zoomTo(0.5, 2));
//camera.addAnimation('zoomTo200', new Oculo.Animation(camera).zoomTo(2, 2));
//camera.addAnimation('instantZoom', new Oculo.Animation(camera).zoomTo(2, 0));
//camera.addAnimation('instantShake', new Oculo.Animation(camera).shake(0.1, 0));
//camera.addAnimation('backAndForth', new Oculo.Animation(camera).animate({position: '#Hydrogen', rotation:20, zoom: 1.5}, 1.5, {ease: Power4.easeOut}).animate({position: 'previous', rotation: 'previous', zoom: 'previous'}, 1.5, {ease: Power3.easeOut}));
//window.camera = camera;

// Manage size
resizeCamera();
window.addEventListener('resize', debounce(resizeCamera, 200, { maxWait: 400 }));

// Render
camera.render();
camera.play('intro');


// Set up React app
// --------------------
//console.log('initial state: ', store.getState());
//
//let subscription = store.subscribe(() => 
//    console.log('state: ', store.getState())
//);

// Hide behavior menu
document.addEventListener('click', function () {
    store.dispatch(actions.updateBehaviorGroupListVisibility(false));
});

// Initialize React app
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('app')
);



// Initialize background circles
// --------------------
let max = 15;
let circles = [];
let homeBannerCircles = document.getElementById('homeBannerCircles');

while (max > 0) {
    circles.push(document.createElement('div'));
    max--;
}

circles.forEach(function (item) {
    item.className = 'home-banner-circle';

    TweenLite.set(item, {
        opacity: random(0, 1) === 0 ? 0 : random(0.01, 0.05),
        scale: random(0.1, 1),
        xPercent: -50,
        yPercent: -50,
        top: random(30, 110) + '%',
        left: random(0, 100) + '%'
    });

    homeBannerCircles.appendChild(item);

    TweenMax.to(item, random(5, 10), { 
        opacity: random(0.01, 0.07), 
        delay: random(0, 3), 
        repeat: -1, 
        repeatDelay: random(0, 3), 
        yoyo: true, 
        ease: Power1.easeInOut 
    });
    TweenMax.to(item, random(10, 15), { 
        x: random(-150, 150), 
        delay: random(0, 3), 
        repeat: -1, 
        repeatDelay: random(0, 3), 
        yoyo: true, 
        ease: Power2.easeInOut 
    });
    TweenMax.to(item, random(10, 15), { 
        xPercent: random(-80, -20),
        delay: random(0, 3), 
        repeat: -1, 
        repeatDelay: random(0, 3), 
        yoyo: true, 
        ease: Power2.easeInOut 
    });
    TweenMax.to(item, random(10, 15), { 
        y: random(-150, 150), 
        delay: random(0, 3), 
        repeat: -1, 
        repeatDelay: random(0, 3), 
        yoyo: true, 
        ease: Power2.easeInOut 
    });
    TweenMax.to(item, random(10, 15), { 
        yPercent: random(-80, -20),
        delay: random(0, 3), 
        repeat: -1, 
        repeatDelay: random(0, 3), 
        yoyo: true, 
        ease: Power2.easeInOut 
    });
});