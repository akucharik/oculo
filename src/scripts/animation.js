/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

// TODO: Move animation properties from config into data object on animation
// TODO: Move core tween properties into data object on tween

import isElement            from 'lodash/isElement';
import isFinite             from 'lodash/isFinite';
import isFunction           from 'lodash/isFunction';
import pick                 from 'lodash/pick';
import isNil                from 'lodash/isNil';
import isObject             from 'lodash/isObject';
import { zoomDirection }    from './constants';
import _Math                from './math/math';
import Matrix2              from './math/matrix2';
import { originKeyword }    from './constants';
import { Type }             from './constants';
import Utils                from './utils';
import Vector2              from './math/vector2';

const animation = {
    type: {
        CORE: 1
    }
};
const animationCustomOptions = [
    'destroyOnComplete',
    'disableDrag', 
    'disableWheel'
];
const animationTimelineOptions = [
    'delay',
    'paused', 
    'useFrames', 
    'repeat', 
    'repeatDelay', 
    'yoyo',
    'onComplete', 
    'onCompleteParams',
    'onStart', 
    'onStartParams',
    'onUpdate',
    'onUpdateParams',
    'onRepeat',
    'onRepeatParams',
    'onReverseComplete',
    'onReverseCompleteParams',
    'callbackScope'
];
const animationOptions = animationCustomOptions.concat(animationTimelineOptions);
const keyframeCustomOptions = [
    'enforceBounds',
    'fadeDelay',
    'fadeDuration',
    'fadeEase',
    'shakeDelay',
    'shakeDirection',
    'shakeDuration',
    'shakeEase',
    'shakeEaseIn',
    'shakeEaseOut'
];
const keyframeTweenOptions = [
    'delay',
    'ease',
    'overwrite'
];
const keyframeEventCallbackOptions = [
    'onComplete', 
    'onCompleteParams',
    'onStart', 
    'onStartParams',
    'onUpdate',
    'onUpdateParams',
    'onReverseComplete',
    'onReverseCompleteParams',
    'callbackScope'
];
const keyframeOptions = keyframeCustomOptions.concat(keyframeTweenOptions, keyframeEventCallbackOptions);
const keyframeOptionsNoEventCallbacks = keyframeCustomOptions.concat(keyframeTweenOptions);

/**
* Description.
* 
* @class Oculo.Animation
* @constructor
* @extends external:TimelineMax
* @param {Camera} camera - The camera to be animated.
* @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
* @param {Object} [options.destroyOnComplete] - Whether the animation should be destroyed once it has completed.
*
* @example
* var myAnimation = new Oculo.Animation(myCamera, { 
*   destroyOnComplete: true
* }).zoomTo(2, 1).shake(0.1, 2).play();
*/
class Animation extends TimelineMax {
    constructor (camera, options) {
        options = Object.assign({
            paused: true
        }, pick(options, animationOptions));
        
        super(Object.assign({}, options));

        /**
        * @property {object} - The initial configuration.
        * @default {};
        */
        this.config = options;
        
        /**
        * @property {number} - The type of this object.
        * @readonly
        */
        this.type = Type.ANIMATION;
        
        /**
        * @property {Camera} - The camera on which the animation will be applied.
        */
        this.camera = camera || null;
        
        /**
        * @property {array} - The core tweens of this animation in order of execution.
        */
        this.coreTweens = [];
        
        /**
        * @property {TimelineLite} - The current active sub-animation consisting of the core camera animation and effect animations.
        */
        this.currentKeyframe = null;
        
        /**
        * @property {boolean} - Whether the animation should be destroyed once it has completed.
        */
        this.destroyOnComplete = options.destroyOnComplete ? true : false;
        
        /**
        * @property {boolean} - Whether the animation should disable wheel while playing or not.
        */
        this.disableWheel = options.disableWheel !== false ? true : false;
        
        /**
        * @property {object} - The camera values of the previous sub-animation.
        */
        this.previousProps = {};
        
        /**
        * Called when the animation has started.
        *
        * @private
        * @param {boolean} isRepeating - Whether the animation is repeating or not.
        */
        this._onStart = function (isRepeating = false) {
            this._initCoreTween(this.coreTweens[0]);
            this.camera.isAnimating = true;
            
            if (this.disableWheel) {
                this.camera.disableWheelToZoom();
            }
            
            if (this.config.onStart !== undefined && !isRepeating) {
                this.config.onStart.apply(this, this.config.onStartParams);
            }
        }
        
        /**
        * Called when the animation has updated.
        *
        * @private
        */
        this._onUpdate = function () {
            if (this.config.onUpdate !== undefined) {
                this.config.onUpdate.apply(this, this.config.onUpdateParams);
            }
            
            this.camera.render();
        }
        
        /**
        * Called when the animation has completed.
        *
        * @private
        */
        this._onComplete = function () {
            this.camera.isAnimating = false;
            this.camera.enableWheelToZoom();

            if (this.config.onComplete !== undefined) {
                this.config.onComplete.apply(this, this.config.onCompleteParams);
            }

            if (this.destroyOnComplete) {
                this.destroy();
            }
        },
            
        /**
        * Called when the animation has repeated.
        *
        * @private
        */
        this._onRepeat = function () {
            this._onStart(true);
            
            if (this.config.onRepeat !== undefined) {
                this.config.onRepeat.apply(this, this.config.onRepeatParams);
            }
        }
        
        this.eventCallback('onStart', this._onStart);
        this.eventCallback('onUpdate', this._onUpdate);
        this.eventCallback('onComplete', this._onComplete);
        this.eventCallback('onRepeat', this._onRepeat);
    }
    
    /**
    * Filters out event callback options for keyframes.
    *
    * @private
    * @param {Object} options - The provided options.
    * @returns {Object} - The filtered options.
    */
    static _filterKeyframeEventCallbackOptions (options) {
        return pick(options, keyframeOptionsNoEventCallbacks);
    }
    
    /**
    * Animate the camera.
    *
    * @private
    * @param {Object} props - The properties to animate.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    */
    _animate (props, duration, options = {}) {
        options = pick(options, keyframeOptions);
        
        var mainTimeline = new TimelineLite({
            data: {
                onStart: options.onStart,
                onStartParams: options.onStartParams,
                onUpdate: options.onUpdate,
                onUpdateParams: options.onUpdateParams,
                onComplete: options.onComplete,
                onCompleteParams: options.onCompleteParams,
                onReverseComplete: options.onReverseComplete,
                onReverseCompleteParams: options.onReverseCompleteParams
            },
            callbackScope: this,
            onStartParams: ['{self}'],
            onStart: function (self) {
                this.currentKeyframe = self;
                if (self.data.onStart !== undefined) {
                    self.data.onStart.apply(this, self.data.onStartParams);
                }
            },
            onUpdateParams: ['{self}'],
            onUpdate: function (self) {
                if (self.data.onUpdate !== undefined) {
                    self.data.onUpdate.apply(this, self.data.onUpdateParams);
                }
            },
            onCompleteParams: ['{self}'],
            onComplete: function (self) {
                if (self.data.onComplete !== undefined) {
                    self.data.onComplete.apply(this, self.data.onCompleteParams);
                }
            },
            onReverseCompleteParams: ['{self}'],
            onReverseComplete: function (self) {
                if (self.data.onReverseComplete !== undefined) {
                    self.data.onReverseComplete.apply(this, self.data.onReverseCompleteParams);
                }
            }
        });
        var fade = this._parseFade(props, duration, options);
        var shakeTimeline = null;
        var shake = this._parseShake(props, duration, options);
        
        // Delete event callback options so children don't pick them up, but get other options
        keyframeEventCallbackOptions.forEach(option => {
            delete options[option];
        });
        
        // Tween core camera properties
        if (props.origin || props.position || props.rotation || props.rotation === 0 || props.zoom) {
            var coreTween = TweenMax.to(this.camera, duration === 0 ? 0.016 : duration, Object.assign({}, options, {
                data: {
                    enforceBounds: (options.enforceBounds === false) ? false : true
                },
                _rawOffsetX: 0,
                _rawOffsetY: 0,
                _rawScaleOffsetX: 0,
                _rawScaleOffsetY: 0,
                rotation: 0,
                zoom: 0,
                immediateRender: false,
                callbackScope: this,
                onStartParams: ['{self}'],
                onStart: function (self) {
                    var zDirection = zoomDirection.NONE;
                    
                    if (self.props.to.zoom > this.camera.zoom) {
                        zDirection = zoomDirection.IN;
                    }
                    else if (self.props.to.zoom < this.camera.zoom) {
                        zDirection = zoomDirection.OUT;
                    }
                    
                    this.camera.zoomDirection = zDirection;
                    
                    // Origin must be set in case animation was reversed (origin was reverted)
                    this.camera.setTransformOrigin(self.props.to.origin);
                    self.timeline.core = self;
                },
                onUpdateParams: ['{self}'],
                onUpdate: function (self) {
                    var offset = this.camera._rawOffset;
                    var position;
                    
                    // Handle direct offset tweening, then apply rotation
                    if (self.props.to.isOriginAuto && self.props.to.isPositionChanging && self.props.to.isRotationChanging) {
                        position = this.camera._convertOffsetToPosition(this.camera._rawScaleOffset, this.camera.center, this.camera.transformOrigin, this.camera.scaleTransformation);
                        offset = this.camera._convertPositionToOffset(position, this.camera.center, this.camera.transformOrigin, this.camera.transformation);
                    }
                    
                    // Position is manually maintained so animations can smoothly continue when camera is resized
                    this.camera.setPosition(this.camera._convertOffsetToPosition(offset, this.camera.center, this.camera.transformOrigin, this.camera.transformation), self.data.enforceBounds);
                },
                onCompleteParams: ['{self}'],
                onComplete: function (self) {
                    this._initCoreTween(this.coreTweens[self.index + 1], self.props.end);
                },
                onReverseCompleteParams: ['{self}'],
                onReverseComplete: function (self) {
                    this.camera.setTransformOrigin(self.props.start.origin);
                }
            }));
            
            coreTween.type = animation.type.CORE;
            coreTween.props = {
                source: {},
                parsed: {},
                to: {},
                start: {},
                end: {}
            };
            coreTween.props.source.origin = props.origin;
            coreTween.props.source.position = props.position;
            coreTween.props.source.rotation = props.rotation;
            coreTween.props.source.zoom = props.zoom;
            coreTween.index = this.coreTweens.length;
            this.coreTweens.push(coreTween);
            mainTimeline.add(coreTween, 0);
        }
        
        // Fade effect
        if (fade.opacity) {
            mainTimeline.to(this.camera, fade.duration === 0 ? 0.016 : fade.duration, Object.assign({}, options, {
                fadeOpacity: fade.opacity,
                ease: fade.ease,
                delay: fade.delay
            }, 0));
        }
        
        // Tween shake effect
        if (shake.duration > 0 && shake.intensity > 0) {
            shakeTimeline = new TimelineLite(Object.assign({}, options, {
                data: {
                    intensity: 0,
                    direction: shake.direction,
                    enforceBounds: (options.enforceBounds === false) ? false : true
                },
                delay: shake.delay,
                callbackScope: this,
                onStartParams: ['{self}'],
                onStart: function (self) {
                    self.timeline.shake = self;
                },
                onUpdateParams: ['{self}'],
                onUpdate: function (self) {
                    var isFirstFrame = self.progress() === 0;
                    var isFinalFrame = self.progress() === 1;
                    var offsetX = 0;
                    var offsetY = 0;
                    var position = this.camera._clampPosition(this.camera._convertOffsetToPosition(this.camera._rawOffset, this.camera.center, this.camera.transformOrigin, this.camera.transformation));
                    
                    if (self.data.direction === Animation.shake.direction.HORIZONTAL || self.data.direction === Animation.shake.direction.BOTH) {
                        // Ensure shake position starts/ends at the original position even when reversed
                        if (!isFirstFrame && !isFinalFrame) {
                            offsetX = Math.random() * self.data.intensity * this.camera.width * 2 - self.data.intensity * this.camera.width;
                            position.x += offsetX;
                        }
                    }

                    if (self.data.direction === Animation.shake.direction.VERTICAL || self.data.direction === Animation.shake.direction.BOTH) {
                        // Ensure shake position starts/ends at the original position even when reversed
                        if (!isFirstFrame && !isFinalFrame) {
                            offsetY = Math.random() * self.data.intensity * this.camera.height * 2 - self.data.intensity * this.camera.height;
                            position.y += offsetY;
                        }
                    }
                    
                    this.camera.setPosition(position, self.data.enforceBounds);
                },
                onCompleteParams: ['{self}']
            }));
            
            // Ease in/out
            if (shake.easeIn && shake.easeOut) {
                shakeTimeline.fromTo(shakeTimeline.data, shake.duration * 0.5, {
                    intensity: 0
                }, {
                    intensity: shake.intensity,
                    ease: shake.easeIn
                }, 0);

                shakeTimeline.to(shakeTimeline.data, shake.duration * 0.5, { 
                    intensity: 0,
                    ease: shake.easeOut
                }, shake.duration * 0.5);
            }
            // Ease in
            else if (shake.easeIn && !shake.easeOut) {
                shakeTimeline.fromTo(shakeTimeline.data, shake.duration, {
                    intensity: 0
                }, {
                    intensity: shake.intensity,
                    ease: shake.easeIn
                }, 0);
            }
            // Ease out
            else if (!shake.easeIn && shake.easeOut) {
                shakeTimeline.fromTo(shakeTimeline.data, shake.duration, {
                    intensity: shake.intensity
                }, {
                    intensity: 0,
                    ease: shake.easeOut
                }, 0);
            }
            // Ease
            else if (shake.ease) {
                shakeTimeline.fromTo(shakeTimeline.data, shake.duration, {
                    intensity: 0
                }, {
                    intensity: shake.intensity,
                    ease: shake.ease
                }, 0);
            }
            // No ease
            else {
                shakeTimeline.data.intensity = shake.intensity;
                shakeTimeline.to(shakeTimeline.data, shake.duration, {}, 0);
            }
            
            mainTimeline.add(shakeTimeline, 0);
        }
        
        this.add(mainTimeline);
        
        return this;
    }
    
    /**
    * Calculates the "to" property values.
    *
    * @private
    * @param {Object|Vector2} sourceOrigin - The source origin.
    * @param {Object|Vector2} sourcePosition - The source position.
    * @param {number} sourceRotation - The source rotation.
    * @param {number} sourceZoom - The source zoom.
    * @param {Oculo.Camera} camera - The camera.
    * @returns {Object} - The end properties.
    */
    _calculateToProps (parsed, start) {
        var source = {
            origin: (parsed.origin !== originKeyword.AUTO) ? parsed.origin : {},
            position: (parsed.position !== null) ? parsed.position : {},
            rotation: parsed.rotation,
            zoom: parsed.zoom
        }
        
        var isAnchored = false;
        
        // Changing to same origin is necessary for wheel zoom
        var isOriginAuto = parsed.origin === originKeyword.AUTO;
        var isOriginXChanging = Number.isFinite(source.origin.x);
        var isOriginYChanging = Number.isFinite(source.origin.y);
        var isOriginChanging = isOriginXChanging || isOriginYChanging;
        
        // Changing to same position is necessary for camera resize
        var isPositionXChanging = Number.isFinite(source.position.x);
        var isPositionYChanging = Number.isFinite(source.position.y);
        var isPositionChanging = isPositionXChanging || isPositionYChanging;
        var isOffsetChanging = isPositionChanging;
        var isRotationChanging = Number.isFinite(source.rotation) && source.rotation !== start.rotation;
        var isZoomChanging = Number.isFinite(source.zoom) && source.zoom !== start.zoom;

        var fovPosition = this.camera.center;
        var startTransformation = new Matrix2().scale(start.zoom, start.zoom).rotate(_Math.degToRad(-start.rotation));
        var toScaleOffset;
        var toOffset;
        var toOrigin = new Vector2(isOriginXChanging ? source.origin.x : start.origin.x, isOriginYChanging ? source.origin.y : start.origin.y);
        var toPosition = new Vector2(isPositionXChanging ? source.position.x : start.position.x, isPositionYChanging ? source.position.y : start.position.y);
        var toRotation = isRotationChanging ? source.rotation : start.rotation;
        var toZoom = isZoomChanging ? source.zoom : start.zoom;
        var toScaleTransformation = new Matrix2().scale(toZoom, toZoom);
        var toTransformation = new Matrix2().scale(toZoom, toZoom).rotate(_Math.degToRad(-toRotation));
        
        // rotateTo, zoomTo
        if (isOriginAuto && !isPositionChanging) {
            isAnchored = true;
            toOrigin.copy(start.position);
        }
        // rotateAt, zoomAt
        else if (isOriginChanging && !isPositionChanging) {
            isAnchored = true;
            isPositionChanging = true;
            fovPosition = this.camera._convertScenePositionToFOVPosition(toOrigin, start.position, this.camera.center, startTransformation);
            toPosition = this.camera._convertScenePositionToCameraPosition(toOrigin, fovPosition, this.camera.center, toOrigin, toTransformation);
        }
        // animate (with auto origin)
        else if (isOriginAuto && isPositionChanging && isRotationChanging) {
            toOrigin.copy(toPosition);
        }
        
        toScaleOffset = this.camera._convertPositionToOffset(toPosition, this.camera.center, toOrigin, toScaleTransformation);
        toOffset = this.camera._convertPositionToOffset(toPosition, this.camera.center, toOrigin, toTransformation);
        
        return {
            isOriginAuto: isOriginAuto,
            isPositionChanging: isPositionChanging,
            isRotationChanging: isRotationChanging,
            scaleOffsetX: isOffsetChanging ? toScaleOffset.x : null,
            scaleOffsetY: isOffsetChanging ? toScaleOffset.y : null,
            offsetX: isOffsetChanging ? toOffset.x : null,
            offsetY: isOffsetChanging ? toOffset.y : null,
            origin: isAnchored || isOriginChanging || (isOriginAuto && isPositionChanging && isRotationChanging) ? toOrigin : null,
            position: isPositionChanging ? toPosition : null,
            rotation: isRotationChanging ? toRotation : null,
            zoom: isZoomChanging ? toZoom : null
        };
    }
    
    /**
    * Gets the starting property values.
    *
    * @private
    * @returns {Object} - The starting properties.
    */
    _getStartProps () {
        return {
            origin: this.camera.transformOrigin.clone(),
            position: this.camera.position.clone(),
            rotation: this.camera.rotation,
            zoom: this.camera.zoom
        };
    }
    
    /**
    * Gets the ending property values.
    *
    * @private
    * @returns {Object} - The ending properties.
    */
    _getEndProps (to, start) {
        return {
            origin: (to.origin !== null) ? to.origin : start.origin,
            position: (to.position !== null) ? to.position : start.position,
            rotation: (to.rotation !== null) ? to.rotation : start.rotation,
            zoom: (to.zoom !== null) ? to.zoom : start.zoom
        };
    }
    
    /**
    * Initializes a core tween.
    *
    * @private
    * @param {TweenMax} tween - The tween.
    * @returns {this} self
    */
    _initCoreTween (tween, startProps) {
        if (tween !== undefined) {
            tween.invalidate();
            startProps = (startProps !== undefined) ? startProps : this._getStartProps();
            
            var parsedProps = this._parseProps(tween.props.source);
            var toProps = this._calculateToProps(parsedProps, startProps);
            var endProps = this._getEndProps(toProps, startProps);

            this.previousProps = startProps;
            tween.props.start = startProps;
            tween.props.end = endProps;
            tween.props.parsed = parsedProps;
            tween.props.to = toProps;
            
            // Ensure offset matches current position before tween starts
            this.camera._updateRawOffset();
            
            // Origin and offset must be updated before tween starts
            this.camera.setTransformOrigin(toProps.origin);
            
            tween.vars._rawOffsetX = toProps.offsetX;
            tween.vars._rawOffsetY = toProps.offsetY;
            tween.vars._rawScaleOffsetX = toProps.scaleOffsetX;
            tween.vars._rawScaleOffsetY = toProps.scaleOffsetY;
            tween.vars.rotation = toProps.rotation;
            tween.vars.zoom = toProps.zoom;
        }
        
        return this;
    }
    
    /**
    * Parses the core animation properties.
    *
    * @private
    * @param {Object} origin - The origin.
    * @param {Object} position - The origin.
    * @param {number} rotation - The rotation.
    * @param {number} zoom - The zoom.
    * @returns {Object} - The parsed properties.
    */
    _parseProps ({
        origin = null, 
        position = null, 
        rotation = null, 
        zoom = null 
    } = {}) {
        if (position === 'previous' && this.previousProps.position) {
            position = this.previousProps.position;
        }
        
        if (rotation === 'previous' && !isNil(this.previousProps.rotation)) {
            rotation = this.previousProps.rotation;
        }
        
        if (zoom === 'previous' && Number.isFinite(this.previousProps.zoom)) {
            zoom = this.previousProps.zoom;
        }
        
        return { 
            origin: Utils.parseOrigin(origin, this.camera.scene, this.camera.transformation),
            position: Utils.parsePosition(position, this.camera.scene, this.camera.transformation),
            rotation: isFunction(rotation) ? rotation() : rotation,
            zoom: isFunction(zoom) ? zoom() : zoom
        };
    }
    
    /**
    * Parses the fade properties.
    *
    * @private
    * @param {Object} props - The properties.
    * @param {number} duration - The duration.
    * @param {Object} options - The options.
    * @returns {Object} - The parsed fade effect.
    */
    _parseFade (props = {}, duration, options = {}) {
        return {
            opacity: Number.isFinite(props.fadeOpacity) ? props.fadeOpacity : null,
            delay: Number.isFinite(options.fadeDelay) ? options.fadeDelay : options.delay || 0,
            duration: Number.isFinite(options.fadeDuration) ? options.fadeDuration : duration,
            ease: options.fadeEase ? options.fadeEase : options.ease || null
        };
    }
    
    /**
    * Parses the shake properties.
    *
    * @private
    * @param {Object} props - The properties.
    * @param {number} duration - The duration.
    * @param {Object} options - The options.
    * @returns {Object} - The parsed shake effect.
    */
    _parseShake (props = {}, duration, options = {}) {
        return {
            intensity: Number.isFinite(props.shakeIntensity) ? props.shakeIntensity : null,
            delay: Number.isFinite(options.shakeDelay) ? options.shakeDelay : options.delay || 0,
            direction: options.shakeDirection ? options.shakeDirection : Animation.shake.direction.BOTH,
            duration: Number.isFinite(options.shakeDuration) ? options.shakeDuration : duration,
            ease: options.shakeEase ? options.shakeEase : options.ease || null,
            easeIn: options.shakeEaseIn,
            easeOut: options.shakeEaseOut
        };
    }
    
    /**
    * Stops the animation and releases it for garbage collection.
    *
    * @returns {this} self
    *
    * @example
    * myAnimation.destroy();
    */
    destroy () {
        super.kill();
        this.camera = null;
        this.currentKeyframe = null;
        this.previousProps = null;
    }
    
    /**
    * Animate the camera.
    *
    * @param {Object} props - The properties to animate.
    * @param {string|Element|Object} [props.position] - The location to move to. It can be a selector, an element, or an object with x/y coordinates.
    * @param {number} [props.position.x] - The x coordinate on the raw scene.
    * @param {number} [props.position.y] - The y coordinate on the raw scene.
    * @param {string|Element|Object} [props.origin] - The location for the zoom's origin. It can be a selector, an element, or an object with x/y coordinates.
    * @param {number} [props.origin.x] - The x coordinate on the raw scene.
    * @param {number} [props.origin.y] - The y coordinate on the raw scene.
    * @param {number|string} [props.rotation] - The rotation.
    * @param {Object} [props.shake] - An object of shake effect properties.
    * @param {number} [props.shake.intensity] - A {@link Camera#shakeIntensity|shake intensity}.
    * @param {Oculo.Animation.shake.direction} [props.shake.direction=Oculo.Animation.shake.direction.BOTH] - A shake direction. 
    * @param {Object} [props.shake.easeIn] - An {@link external:Easing|Easing}.
    * @param {Object} [props.shake.easeOut] - An {@link external:Easing|Easing}.
    * @param {number} [props.zoom] - A zoom value.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.animate({position: '#box100', zoom: 2}, 1);
    * myAnimation.animate({position: {x: 200, y: 50}, zoom: 2}, 1);
    * myAnimation.animate({origin: '#box100', zoom: 2}, 1);
    * myAnimation.animate({origin: {x: 200, y: 50}, zoom: 2}, 1);
    */
    animate (props, duration, options) {
        this._animate({
            fadeOpacity: props.fadeOpacity,
            origin: props.origin,
            position: props.position,
            rotation: props.rotation,
            shakeIntensity: props.shakeIntensity,
            zoom: props.zoom
        }, duration, options);

        return this;
    }
    
    /**
    * Fades the camera.
    *
    * @param {number} opacity - An opacity value.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TimelineMax|TimelineMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.fadeTo(0, 2);
    */
    fadeTo (opacity, duration, options) {
        this._animate({
            fadeOpacity: opacity
        }, duration, options);

        return this;
    }
    
    /**
    * Move to a specific position.
    *
    * @param {string|Element|Object} position - The position to move to. It can be a selector, an element, or an object with x/y coordinates.
    * @param {number} [position.x] - The x coordinate on the raw scene.
    * @param {number} [position.y] - The y coordinate on the raw scene.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.moveTo('#box100', 1);
    * myAnimation.moveTo(document.getElementById('box100'), 1);
    * myAnimation.moveTo({x:200, y: 50}, 1);
    * myAnimation.moveTo({x: 200}, 1);
    * myAnimation.moveTo({y: 200}, 1);
    */
    moveTo (position, duration, options) {
        this._animate({
            position: position
        }, duration, options);

        return this;
    }
    
    /**
    * Rotate at the specified location.
    *
    * @param {number|string} rotation - The rotation.
    * @param {string|Element|Object} origin - The location for the rotation's origin. It can be a selector, an element, or an object with x/y coordinates.
    * @param {number} [origin.x] - The x coordinate on the raw scene.
    * @param {number} [origin.y] - The y coordinate on the raw scene.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.rotateAt(20, '#box100', 1);
    * myAnimation.rotateAt(20, document.getElementById('box100'), 1);
    * myAnimation.rotateAt(20, {x: 200, y: 50}, 1);
    */
    rotateAt (rotation, origin, duration, options) {
        this._animate({
            origin: origin,
            rotation: rotation
        }, duration, options);

        return this;
    }
    
    /**
    * Rotate at the current position.
    *
    * @param {number|string} rotation - The rotation.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.rotateTo(20, 1);
    */
    rotateTo (rotation, duration, options) {
        this._animate({
            rotation: rotation
        }, duration, options);

        return this;
    }
    
    /**
    * Shake the camera.
    *
    * @param {number} intensity - A {@link Camera#shakeIntensity|shake intensity}.
    * @param {number} duration - A duration.
    * @param {Oculo.Animation.shake.direction} [direction=Oculo.Animation.shake.direction.BOTH] - A shake direction. 
    * @param {Object} [options] - An object of {@link external:TimelineMax|TimelineMax} options plus:
    * @param {Object} [options.easeIn] - An {@link external:Easing|Easing}.
    * @param {Object} [options.easeOut] - An {@link external:Easing|Easing}.
    * @returns {this} self
    *
    * @example
    * myAnimation.shake(0.1, 4);
    * myAnimation.shake(0.1, 4, Oculo.Animation.shake.direction.HORIZONTAL, { easeIn: Power2.easeIn, easeOut: Power2.easeOut })
    */
    shake (intensity, duration, options) {
        this._animate({
            shakeIntensity: intensity
        }, duration, options);

        return this;
    }
    
    /**
    * Zoom in/out at a specific location.
    *
    * @param {number} zoom - A zoom value.
    * @param {string|Element|Object} origin - The location for the zoom's origin. It can be a selector, an element, or an object with x/y coordinates.
    * @param {number} [origin.x] - The x coordinate on the raw scene.
    * @param {number} [origin.y] - The y coordinate on the raw scene.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.zoomAt(2, '#box100', 1);
    * myAnimation.zoomAt(2, document.getElementById('box100'), 1);
    * myAnimation.zoomAt(2, {x: 200, y: 50}, 1);
    */
    zoomAt (zoom, origin, duration, options) {
        this._animate({
            origin: origin,
            zoom: zoom
        }, duration, options);
        
        return this;
    }
    
    /**
    * Zoom in/out at the current position.
    *
    * @param {number} zoom - A zoom value.
    * @param {number} duration - A duration.
    * @param {Object} [options] - An object of {@link external:TweenMax|TweenMax} options.
    * @returns {this} self
    *
    * @example
    * myAnimation.zoomTo(2, 1);
    */
    zoomTo (zoom, duration, options) {
        this._animate({ 
            zoom: zoom 
        }, duration, options);

        return this;
    }
}

/**
* Shake directions.
* @enum {number}
*/
Animation.shake = {
    direction: {
        /**
        * Both the x and y axes.
        */
        BOTH: 0,
        /**
        * The x axis.
        */
        HORIZONTAL: 1,
        /**
        * The y axis.
        */
        VERTICAL: 2
    }
}

export default Animation;