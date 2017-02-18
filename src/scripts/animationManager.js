/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import Animation from './animation';
import { Type }  from './constants';

/**
* Description.
* 
* @class Oculo.AnimationManager
* @constructor
* @param {Object} camera - The camera that owns this AnimationManager.
*/
class AnimationManager {
    constructor (camera) {
        /**
        * @property {Object} - The camera that owns this AnimationManager.
        * @readonly
        */
        this.camera = camera;
        
        /**
        * @property {Oculo.Animation} - The active animation.
        * @readonly
        */
        this.currentAnimation = null;
        
        /**
        * @property {Object} - An object for storing the Animation instances.
        * @private
        */
        this._animations = {};
    }
    
    /**
    * @name AnimationManager#isAnimating
    * @property {boolean} - Whether the current animation is running or not.
    * @readonly
    */
    get isAnimating () {
        var progress = this.currentAnimation ? this.currentAnimation.progress() : 0;
        return progress > 0 && progress < 1;
    }
    
    /**
    * @name AnimationManager#isPaused
    * @property {boolean} - Whether the current animation is paused or not.
    * @readonly
    */
    get isPaused () {
        return this.currentAnimation ? this.currentAnimation.paused() : false;
    }
    
    /**
    * Adds an animation.
    *
    * @param {string} name - The name to give the animation.
    * @param {object|Oculo.Animation} animation - The animation. It can be an actual animation instance or an object representing the animation.
    * @returns {this} self
    *
    * @example <caption>As an animation instance</caption>
    * myAnimationManager.add('zoomInOut', new Oculo.Animation(myCamera).animate({zoom: 2}, 2, {ease: Power2.easeIn}).animate({zoom: 1}, 2, {ease: Power2.easeOut}));
    * 
    * @example <caption>As an object representing an animation</caption>
    * myAnimationManager.add('zoomInAndOut', { 
    *   keyframes: [{ 
    *     zoom: 2, 
    *     duration: 2, 
    *     options: { 
    *       ease: Power2.easeIn 
    *     }
    *   }, {
    *     zoom: 1,
    *     duration: 2,
    *     options: {
    *       ease: Power2.easeOut
    *     }
    *   }]
    * });
    */        
    add (name, animation) {
        let newAnimation;
        
        if (this._animations[name]) {
            this._animations[name].destroy();
        }
        
        if (animation.type === Type.ANIMATION) {
            newAnimation = animation;
        }
        else {
            newAnimation = new Animation(this.camera, animation.options);
            animation.keyframes.forEach((keyframe) => {
                newAnimation.animate({
                    fadeOpacity: keyframe.fadeOpacity,
                    origin: keyframe.origin,
                    position: keyframe.position,
                    rotation: keyframe.rotation,
                    shakeIntensity: keyframe.shakeIntensity,
                    zoom: keyframe.zoom
                }, keyframe.duration, keyframe.options);
            });
            
        }
        
        this._animations[name] = newAnimation;
        
        return this;
    }
    
    /**
    * Destroys the AnimationManager and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        for (let key in this._animations) {
            this._animations[key].destroy();
        }
        
        this.camera = null;
        this.currentAnimation = null;
        this._animations = {};
        
        return this;
    }
    
    /**
    * Gets an animation.
    *
    * @param {string} name - The name of the animation.
    * @returns {Oculo.Animation} The animation.
    */
    get (name) {
        return this._animations[name];
    }
    
    /**
    * Pauses the active animation.
    *
    * @see {@link external:TimelineMax|TimelineMax}
    * @returns {this} self
    */
    pause () {
        if (this.currentAnimation) {
            this.currentAnimation.pause(null, false);
        }

        return this;
    }

    /**
    * Plays the current or provided animation forward from the current playhead position.
    * @param {string} [name] - The name of the animation to play.
    *
    * @returns {this} self
    */
    play (name) {
        var animation;
        
        if (typeof name === 'string') {
            animation = this._animations[name];
        }
        
        if (animation) {
            this.currentAnimation = animation;
            this.currentAnimation.invalidate().restart(true);
        } 
        else if (name === undefined && this.currentAnimation) {
            this.currentAnimation.play(null, false);
        }
        
        return this;
    }
    
    /**
    * Resumes playing the animation from the current playhead position.
    *
    * @see {@link external:TimelineMax|TimelineMax}
    * @returns {this} self
    */
    resume () {
        if (this.currentAnimation) {
            this.currentAnimation.resume(null, false);
        }
        
        return this;
    }
    
    /**
    * Reverses playback of an animation.
    *
    * @param {string} [name=null] - The name of the animation. If none is specified, the current animation will be reversed.
    * @returns {this} self
    */
    reverse (name = null) {
        var animation;
        
        if (typeof name === 'string') {
            animation = this._animations[name];
        }
        
        if (animation) {
            this.currentAnimation = animation;
            this.currentAnimation.invalidate().reverse(0, false);
        } 
        else if (name === null && this.currentAnimation) {
            let time = this.currentAnimation.time();
            this.currentAnimation.reverse();
        }
        
        return this;
    }
}

export default AnimationManager;