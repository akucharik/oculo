/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import { zoomDirection }    from './constants';

/**
* Description.
* 
* @class Oculo.CSSRenderer
* @constructor
*
* @example
* var myRenderer = new CSSRenderer(myCamera);
*/
class CSSRenderer {
    constructor (camera) {
        /**
        * @property {Object} - The camera.
        * @readonly
        */
        this.camera = camera;
    }
    
    /**
    * Destroys the renderer and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        this.camera = null;
        
        return this;
    }
    
    /**
    * Render the scene.
    *
    * returns {this} self
    */
    render () {
        var offset = this.camera._convertPositionToOffset(this.camera.position, this.camera.center, this.camera.transformOrigin, this.camera.transformation);
        var rasterIncrement = 0.3;
        var scaleFactor = (this.camera.zoom >= 1) ? Math.floor(this.camera.zoom) : 0.5;

        // Ensure scene is visible. In order for scene auto-size to work, it must have been included during browser layout.
        this.camera.scene.view.style.visibility = 'visible';

        // Control rasterization to maintain clarity when zooming
        if (this.camera.zoom === this.camera.maxZoom || (this.camera.zoomDirection === zoomDirection.IN && this.camera.zoom > this.camera._rasterScale + rasterIncrement * scaleFactor) ) {
            this.camera._rasterScale = this.camera.zoom;
            this.camera.scenes.view.style.willChange = 'auto';
        }
        else {
            this.camera.scenes.view.style.willChange = 'transform';
        }

        TweenLite.set(this.camera.scenes.view, { 
            css: {
                transformOrigin: this.camera.transformOrigin.x + 'px ' + this.camera.transformOrigin.y + 'px',
                opacity: this.camera.fadeOpacity,
                rotation: -this.camera.rotation,
                scaleX: this.camera.zoom,
                scaleY: this.camera.zoom,
                x: -offset.x,
                y: -offset.y
            }
        });
        
        if (this.camera.isRendered === false) {
            this.renderSize();
            this.camera.view.style.display = 'block';
            this.camera.isRendered = true;
        }
    }
    
    /**
    * Render the dimensions/size.
    *
    * returns {this} self
    */
    renderSize () {
        TweenLite.set(this.camera.view, { 
            css: { 
                height: this.camera.height,
                width: this.camera.width
            }
        });
    }
}

export default CSSRenderer;