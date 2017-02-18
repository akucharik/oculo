/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import throttle from 'lodash/throttle';
import Utils    from './utils';

/**
* Description.
* 
* @class Oculo.WheelControl
* @constructor
* @param {string|Element} target - The target.
* @param {Object} [options] - An object of configuration options.
* @param {function} [options.onWheel] - The function to call every time the wheel event occurs.
* @param {array} [options.onWheelParams] - The parameters to pass to the callback.
* @param {object} [options.onWheelScope] - What 'this' refers to inside the callback.
*
* @example
* var myWheelControl = new Oculo.WheelControl('#camera', {  
*   onWheel: function () { 
*     console.log('wheeling'); 
*   }
* });
*/
class WheelControl {
    constructor (target, {
        onWheel = function () {},
        onWheelParams = [],
        onWheelScope = this
    } = {}) {
        /**
        * @property {object} - The configuration.
        */
        this.config = { onWheel, onWheelParams, onWheelScope };

        /**
        * @property {Element} - The target.
        * @readonly
        */
        this.target = Utils.DOM.parseView(target);
        
        /**
        * @property {WheelEvent} - The last wheel event that affected the instance.
        * @readonly
        */
        this.wheelEvent = {};
        
        /**
        * @property {WheelEvent} - The previous wheel event that affected the instance.
        * @readonly
        */
        this.previousWheelEvent = {};
        
        /**
        * @property {boolean} - Whether it is enabled or not.
        * @private
        */
        this._enabled = true;
        
        /**
        * The throttled wheel event handler.
        * @private
        */
        this._throttledOnWheel = throttle(function (event) {
            this.previousWheelEvent = this.wheelEvent;
            this.wheelEvent = event;
            this.config.onWheel.apply(this.config.onWheelScope, this.config.onWheelParams);
        }, Utils.Time.getFPSDuration(30, 'ms'));

        /**
        * The wheel event handler.
        * @private
        */
        this._onWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this._throttledOnWheel(event);
        };
        
        this.enable();
    }

    /**
    * @property {boolean} - Whether it is enabled or not.
    * @readonly
    * @default true
    */
    get enabled () {
        return this._enabled;
    }
    
    /**
    * Destroys the control and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        this.disable();
        this.config = {};
        this.target = null;
        
        return this;
    }
    
    /**
    * Disables the control.
    *
    * @returns {this} self
    */
    disable () {
        this.target.removeEventListener('wheel', this._onWheel);
        this._enabled = false;

        return this;
    }
    
    /**
    * Enables the control.
    *
    * @returns {this} self
    */
    enable () {
        this.target.addEventListener('wheel', this._onWheel);
        this._enabled = true;

        return this;
    }
}

export default WheelControl;