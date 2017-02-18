/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

/**
* GSAP's Draggable.
* @external Draggable
* @see http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable/
*/

import Utils from './utils';

/**
* Description.
* 
* @class Oculo.DragControl
* @constructor
* @requires {@link external:Draggable}
* @param {string|Element} target - The target.
* @param {Object} [options] - An object of configuration options.
* @param {string|Element} [options.dragProxy] - The element that controls/initiates the drag events.
* @param {function} [options.onDrag] - The function to call every time the drag event occurs.
* @param {array} [options.onDragParams] - The parameters to pass to the callback.
* @param {object} [options.onDragScope] - What 'this' refers to inside the callback.
*
* @example
* var myDragControl = new Oculo.DragControl('#scene', {  
*   onDrag: function () { 
*     console.log('dragging'); 
*   }
* });
*/
class DragControl {
    constructor (target, {
        dragProxy = target,
        onDrag = function () {},
        onDragParams = [],
        onDragScope = this,
        onPress = function () {},
        onPressParams = []
    } = {}) {
        /**
        * @property {object} - The configuration.
        */
        this.config = { dragProxy, onDrag, onDragParams, onDragScope, onPress, onPressParams };
        
        /**
        * @property {Draggable} - The object that handles the drag behavior.
        * @readonly
        */
        this.control = new Draggable(target, {
            callbackScope: onDragScope,
            onDrag: onDrag,
            onDragParams: onDragParams,
            onPress: onPress,
            onPressParams: onPressParams,
            zIndexBoost: false
        });
        
        /**
        * @property {Element} - The element that controls/initiates the drag events.
        * @readonly
        */
        this.dragProxy = Utils.DOM.parseView(dragProxy);
        
        /**
        * @property {boolean} - Whether it is dragging or not.
        * @readonly
        */
        this.isDragging = false;

        /**
        * @property {boolean} - Whether it is pressed or not.
        * @readonly
        */
        this.isPressed = false;
        
        /*
        * @private
        */
        this._onDragstart = (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            return false;
        };
        
        /*
        * @private
        */
        this._onDragRelease = (event) => {
            this._endDrag(event);
        };

        /*
        * @private
        */
        this._onDragLeave = (event) => {
            this._endDrag(event);
        };

        /*
        * @private
        */
        this._onDragMove = (event) => { 
            if (this.isPressed && !this.isDragging) {
                this.control.startDrag(event);
                this.isDragging = true;
            }
        };

        /*
        * @private
        */
        this._endDrag = (event) => {
            this.control.endDrag(event);
            this.dragProxy.removeEventListener('mouseup', this._onDragRelease);
            this.dragProxy.removeEventListener('mouseleave', this._onDragLeave);
            this.dragProxy.removeEventListener('mousemove', this._onDragMove);
            this.dragProxy.removeEventListener('touchend', this._onDragRelease);
            this.dragProxy.removeEventListener('touchcancel', this._onDragRelease);
            this.dragProxy.removeEventListener('touchmove', this._onDragMove);
            this.isDragging = false;
        };
        
        /*
        * @private
        */
        this._onPress = (event) => { 
            this.dragProxy.addEventListener('mouseup', this._onDragRelease);
            this.dragProxy.addEventListener('mouseleave', this._onDragLeave);
            this.dragProxy.addEventListener('mousemove', this._onDragMove);
            this.dragProxy.addEventListener('touchend', this._onDragRelease);
            this.dragProxy.addEventListener('touchcancel', this._onDragRelease);
            this.dragProxy.addEventListener('touchmove', this._onDragMove);
            this.isPressed = true;
            this.config.onPress.apply(this, this.config.onPressParams);
        };

        /*
        * @private
        */
        this._onRelease = (event) => {
            this._release();
        };

        /*
        * @private
        */
        this._onLeave = (event) => {
            this._release();
        };

        /*
        * @private
        */
        this._release = () => {
            this.isPressed = false;
        };
        
        this.enable();
    }

    /**
    * @property {boolean} - Whether it is enabled or not.
    * @readonly
    */
    get enabled () {
        return this.control.enabled();
    }
    
    /**
    * @property {Object} - The last pointer event that affected the instance.
    * @readonly
    */
    get pointerEvent () {
        return this.control.pointerEvent;
    }
    
    /**
    * @property {number} - The x position of the last pointer event that affected the instance.
    * @readonly
    */
    get pointerX () {
        return this.control.pointerX;
    }
    
    /**
    * @property {number} - The y position of the last pointer event that affected the instance.
    * @readonly
    */
    get pointerY () {
        return this.control.pointerY;
    }
    
    /**
    * @property {Element} - The target.
    * @readonly
    */
    get target () {
        return this.control.target;
    }
    
    /**
    * @property {number} - The current x position.
    * @readonly
    */
    get x () {
        return this.control.x;
    }
    
    /**
    * @property {number} - The current y position.
    * @readonly
    */
    get y () {
        return this.control.y;
    }
    
    /**
    * Destroys the control and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        this.disable();
        this.control.kill();
        this.config = {};
        this.dragProxy = null;
        
        return this;
    }
    
    /**
    * Disables the control.
    *
    * @returns {this} self
    */
    disable () {
        this.control.disable();
        this.dragProxy.removeEventListener('dragstart', this._onDragstart);
        this.dragProxy.removeEventListener('mousedown', this._onPress);
        this.dragProxy.removeEventListener('mouseup', this._onRelease);
        this.dragProxy.removeEventListener('mouseleave', this._onLeave);
        this.dragProxy.removeEventListener('touchstart', this._onPress);
        this.dragProxy.removeEventListener('touchend', this._onRelease);
        this.dragProxy.removeEventListener('touchcancel', this._onRelease);
        this.dragProxy.style.cursor = null;

        return this;
    }
    
    /**
    * Enables the control.
    *
    * @returns {this} self
    */
    enable () {
        this.control.enable();
        this.dragProxy.addEventListener('dragstart', this._onDragstart);
        this.dragProxy.addEventListener('mousedown', this._onPress);
        this.dragProxy.addEventListener('mouseup', this._onRelease);
        this.dragProxy.addEventListener('mouseleave', this._onLeave);
        this.dragProxy.addEventListener('touchstart', this._onPress);
        this.dragProxy.addEventListener('touchend', this._onRelease);
        this.dragProxy.addEventListener('touchcancel', this._onRelease);
        this.dragProxy.style.cursor = 'move';
        return this;
    }
    
    /**
    * Updates the control's x and y properties to reflect the target's position.
    *
    * @returns {this} self
    */
    update () {
        return this.control.update();
    }
}

export default DragControl;