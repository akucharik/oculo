/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import isElement            from 'lodash/isElement';
import isFunction           from 'lodash/isFunction';
import isObject             from 'lodash/isObject';
import { originKeyword }    from './constants';
import Vector2              from './math/vector2';

/**
* Description.
* 
* @namespace Oculo.Utils
*/
const Utils = {
    /**
    * Get the CSS transform value for an element.
    *
    * @param {Element} el - The element for which to get the CSS transform value.
    * @returns {string} The CSS transform value.
    */
    getCssTransform: function (el) {
        let value = window.getComputedStyle(el).getPropertyValue('transform');

        // Remove 'matrix()' and all whitespace. Then separate into an array.
        value = value.replace(/^\w+\(/,'').replace(/\)$/,'').replace(/\s+/g, '').split(',');

        return value;
    },

    // TODO: This super simplistic and only handles 2D matrices.
    getTransformMatrix: function (el) {
        var styleValue = utils.getCssTransform(el);
        var matrix = [];
        
        if (styleValue[0] === 'none') {
            matrix = [1, 0, 0, 1, 0, 0]
        }
        else {
            styleValue.forEach(function (item) {
                matrix.push(parseFloat(item));
            });
        }
        
        return matrix;
    },
    
    /**
    * Set the CSS transform value for an element.
    *
    * @param {Element} el - The element for which to set the CSS transform value.
    * @param {Object} options - An object of CSS transform values.
    * @param {string} [options.scale] - A valid CSS transform 'scale' function value to apply to both X and Y axes.
    * @param {string} [options.scaleX] - A valid CSS transform 'scale' function value to apply to the X axis.
    * @param {string} [options.scaleY] - A valid CSS transform 'scale' function value to apply to the Y axis.
    * @param {string} [options.skewX] - A valid CSS transform 'skew' function value to apply to the X axis.
    * @param {string} [options.skewY] - A valid CSS transform 'skew' function value to apply to the Y axis.
    * @param {string} [options.translate] - A valid CSS transform 'translate' function value to apply to both X and Y axes.
    * @param {string} [options.translateX] - A valid CSS transform 'translate' function value to apply to the X axis.
    * @param {string} [options.translateY] - A valid CSS transform 'translate' function value to apply to the Y axis.
    * @param {Object} [tracker] - The object that is tracking the transition. 'isTransitioning' on the object will be set to 'true'.
    * @returns {Element} The element.
    */

    // TODO: This is a very simplistic solution.
    // Ideally would handle 'rotate' option.
    // Ideally would handle 3D Matrix.
    setCssTransform: function (el, options, tracker) {
        options = options || {};
        
        let value = utils.getCssTransform(el);
        const CSS_TRANSFORM_KEYWORDS = ['inherit', 'initial', 'none', 'unset'];
        const DEFAULT_MATRIX_2D = [1, 0, 0, 1, 0, 0];
        const MATRIX_2D = {
            scaleX: 0,
            scaleY: 3,
            skewY: 1,
            skewX: 2,
            translateX: 4,
            translateY: 5
        };

        if (options.scale) {
            options.scaleX = options.scaleY = options.scale;
        }

        if (options.translate) {
            options.translateX = options.translateY = options.translate;
        }

        // If the transform value is a keyword, use a default matrix.
        if (CSS_TRANSFORM_KEYWORDS.indexOf(value[0])) {
            value = DEFAULT_MATRIX_2D;
        }
        
        for (let key in MATRIX_2D) {
            if (options[key]) {
                if (_.isFinite(options[key])) {
                    value[MATRIX_2D[key]] = options[key];
                }
                else {
                    throw new Error('Cannot set an invalid CSS matrix value');
                }

            }
        }
        
        el.style.transform = 'matrix(' + value.join(', ') + ')';
        
        if (tracker) {
            tracker.isTransitioning = true;
            
            // If transition duration is 0, 'transitionend' event which handles 'isTransitioning' will not fire.
            if (parseFloat(window.getComputedStyle(el).getPropertyValue('transition-duration')) === 0) {
                tracker.isTransitioning = false;
            }
        }
        
        return el;
    },
    
    /**
    * Set the CSS transition properties for an element.
    *
    * @param {Element} el - The element for which to set the CSS transition properties.
    * @param {Object} properties - A camera {@link CameraModel.defaults.transition|transition} object.
    * @returns {Element} The element.
    */
    setCssTransition: function (el, properties) {
        properties = properties || {};
        
        let cssTransitionProperties = {
            transitionDelay: properties.delay || '0s',
            transitionDuration: properties.duration || '0s',
            transitionProperty: properties.property || 'all',
            transitionTimingFunction: properties.timingFunction || 'ease'
        };
        
        for (let key in cssTransitionProperties) {
            el.style[key] = cssTransitionProperties[key];
        }
        
        return el;
    },
    
    /**
    * Throttling using requestAnimationFrame.
    *
    * @param {Function} func - The function to throttle.
    * @returns {Function} A new function throttled to the next Animation Frame.
    */
    throttleToFrame: function (func) {
        let _this, args;
        let isProcessing = false;

        return function () {
            _this = this;
            args = arguments;

            if (!isProcessing) {
                isProcessing = true;

                window.requestAnimationFrame(function(timestamp) {
                    Array.prototype.push.call(args, timestamp);
                    func.apply(_this, args);
                    isProcessing = false;
                });    
            }
        };
    },
    
    /**
    * Parse the origin of the given input.
    *
    * @private
    * @param {string|Element|Object} [input] - The origin to parse.
    * @param {Oculo.Scene} world - The world.
    * @param {Matrix2} projectionMatrix - The camera's projection matrix.
    * @returns {string|Object} The parsed origin.
    */
    parseOrigin: function (input, world, projectionMatrix) {
        var origin = originKeyword.AUTO;
        var position = Utils.parsePosition(input, world, projectionMatrix);
        
        if (position !== null) {
            origin = position;
        }
        
        return origin;
    },
    
    /**
    * Parse the position of the given input within the world.
    *
    * @private
    * @param {string|Element|Object} [input] - The input to parse.
    * @param {Oculo.Scene} world - The world.
    * @param {Matrix2} projectionMatrix - The camera's projection matrix.
    * @returns {Object} The parsed position as an x/y position object.
    */
    parsePosition: function (input, world, projectionMatrix) {
        var objectPosition;
        var position = null;
        
        if (isFunction(input)) {
            input = input();
        }
        
        if (typeof input === 'string') {
            input = world.view.querySelector(input);
        }
        
        if (isElement(input)) {
            objectPosition = Utils.DOM.getObjectWorldPosition(input, world, projectionMatrix);
            position = new Vector2(objectPosition.x, objectPosition.y);
        }
        else if (isObject(input)) {
            position = new Vector2(input.x, input.y);
        }
        
        return position;
    }
};

Utils.DOM = {
    /**
    * Get an object's position in the world.
    *
    * @param {Element} object - The object.
    * @param {Oculo.Scene} world - The world.
    * @param {Matrix2} projectionMatrix - The camera's projection matrix.
    * @returns {Vector2} The object's position.
    */
    getObjectWorldPosition: function (object, world, projectionMatrix) {
        var objectRect = object.getBoundingClientRect();
        var objectCenter = new Vector2(objectRect.left + objectRect.width * 0.5, objectRect.top + objectRect.height * 0.5);
        var worldRect = world.view.getBoundingClientRect();
        var worldCenter = new Vector2(worldRect.left + worldRect.width * 0.5, worldRect.top + worldRect.height * 0.5);
        var positionFromCenter = objectCenter.subtract(worldCenter).transform(projectionMatrix.getInverse());

        return positionFromCenter.add(new Vector2(world.width * 0.5, world.height * 0.5));
    },
    
    /**
    * Parse a view parameter.
    *
    * @param {string|Element} input - The view parameter.
    * @returns {Element} The view.
    */
    parseView: function (input) {
        var output = null;
        
        if (typeof input === 'string') {
            output = document.querySelector(input);
        }
        else if (isElement(input)) {
            output = input;
        }
        
        return output;
    }
};

Utils.Time = {
    /**
    * Gets a time duration given FPS and the desired unit.
    * @param {number} fps - The frames per second.
    * @param {string} unit - The unit of time.
    * @return {number} - The duration.
    */
    getFPSDuration: (fps, unit) => {
        var duration = 0;
        
        switch (unit) {
            case 's':
                duration = (1000 / fps) / 1000;
                break;
            case 'ms':
                duration = 1000 / fps;
                break;
        }
        
        return duration;
    }
};

export default Utils;