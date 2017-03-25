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