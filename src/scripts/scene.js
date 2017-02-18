/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import Utils     from './utils';

const sceneSize = {
    AUTO: 'auto'
};

/**
* Creates a scene.
* 
* @class Oculo.Scene
* @constructor
* @param {string|Element} [view=null] - The view for the scene. It can be a selector or an element.
* @param {number} [width='auto'] - The width of the scene.
* @param {number} [height='auto'] - The height of the scene.
*/
class Scene {
    constructor (view = null, width = 'auto', height = 'auto') {
        /**
        * @property {Element} - The view. An HTML element.
        */
        this.view = null;
        
        /**
        * @private
        * @property {number|string} - The width.
        */
        this._width = width;
        
        /**
        * @private
        * @property {number|string} - The height.
        */
        this._height = height;
        
        // Set up view
        this.setView(view);
    }
    
    /**
    * @name Scene#width
    * @property {number} - The width.
    */
    get width () {
        return this._width !== sceneSize.AUTO ? this._width : (this.view ? this.view.offsetWidth : 0);
    }
    
    set width (value) {
        this._width = value;
    }

    /**
    * @name Scene#height
    * @property {number} - The height.
    */
    get height () {
        return this._height !== sceneSize.AUTO ? this._height : (this.view ? this.view.offsetHeight : 0);
    }
    
    set height (value) {
        this._height = value;
    }
    
    /**
    * Activates the view.
    *
    * @returns {this} self
    */
    activateView () {
        if (!this.view) {
            this.view = document.createElement('div');
        }
        
        this.view.style.visibility = 'hidden';
        this.view.style.display = 'block';
        
        return this;
    }
    
    /**
    * Destroys the scene and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        this.removeView();
        this.view = null;
        
        return this;
    }
    
    /**
    * Removes the view from the document.
    *
    * @param {Element} view - The view.
    * @returns {this} self
    */
    removeView () {
        if (this.view && this.view.parentNode) {
            this.view.parentNode.removeChild(this.view);
        }
        
        return this;
    }
    
    /**
    * Sets the view.
    *
    * @param {string|Element} view - The view. This can be a selector or an element.
    * @returns {this} self
    */
    setView (view) {
        view = Utils.DOM.parseView(view);
        
        this.removeView();
        this.view = view;
        // Ensure the new view is not in the DOM if it originated there
        this.removeView();
    }
}

export default Scene;