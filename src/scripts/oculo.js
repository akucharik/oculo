/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

/**
* GSAP's TimelineMax.
* @external TimelineMax
* @see http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/
*/

/**
* GSAP's TweenMax.
* @external TweenMax
* @see http://greensock.com/docs/#/HTML5/GSAP/TweenMax/
*/

/**
* GSAP's Easing.
* @external Easing
* @see http://greensock.com/docs/#/HTML5/GSAP/Easing/
*/

import Animation     from './animation';
import Camera        from './camera';
import CSSRenderer   from './cssRenderer';
import Math          from './math/math';
import Matrix2       from './math/matrix2';
import Scene         from './scene';
import SceneManager  from './sceneManager';
import Utils         from './utils';
import Vector2       from './math/vector2';
import version       from './version';


/**
* @namespace Oculo
*/
const Oculo = {
    Animation: Animation,
    Camera: Camera,
    CSSRenderer: CSSRenderer,
    Math: Math,
    Matrix2: Matrix2,
    Scene: Scene,
    SceneManager: SceneManager,
    Utils: Utils,
    Vector2: Vector2,
    version: version
};

module.exports = Oculo;