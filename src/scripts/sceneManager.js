/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import Scene    from './scene';

/**
* Creates a scene manager.
* 
* @class Oculo.SceneManager
* @constructor
*/
class SceneManager {
    constructor () {
        /**
        * @property {Oculo.Scene} - The active scene.
        * @readonly
        */
        this.activeScene = null;
        
        /**
        * @property {Element} - The view. An HTML element.
        */
        this.view = null;
        
        /**
        * @property {Object} - An object for storing the managed Scene instances.
        * @private
        */
        this._scenes = {};
    }
    
    /**
    * Adds a scene.
    *
    * @param {string} name - The name to give the scene.
    * @param {Oculo.Scene} scene - The scene.
    * @returns {this} self
    */
    add (name, scene) {
        if (typeof scene === 'string') {
            scene = new Scene(scene);
        }
        
        this._scenes[name] = scene;
        
        return this;
    }
    
    /**
    * Destroys the SceneManager and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        for (let key in this._scenes) {
            this._scenes[key].destroy();
        }
        
        this.activeScene = null;
        this.view = null;
        this._scenes = {};
        
        return this;
    }
    
    /**
    * Ensures a view is ready.
    *
    * @returns {this} self
    */
    ensureView () {
        if (!this.view) {
            this.view = document.createElement('div');
            this.view.style.position = 'absolute';
        }
        
        return this;
    }
    
    /**
    * Gets a scene.
    *
    * @param {string} name - The name of the scene.
    * @returns {Oculo.Scene} The scene.
    */
    get (name) {
        return this._scenes[name];
    }
    
    /**
    * Sets the active scene.
    *
    * @returns {this} self
    */
    setActiveScene (name) {
        if (this.activeScene) {
            this.activeScene.removeView();
        }
        
        this.activeScene = this._scenes[name];
        
        if (this.view) {
            this.activeScene.activateView();
            this.view.appendChild(this.activeScene.view);
            this.view.style.width = this.activeScene.width + 'px';
            this.view.style.height = this.activeScene.height + 'px';
        }
        
        return this;
    }
}

export default SceneManager;