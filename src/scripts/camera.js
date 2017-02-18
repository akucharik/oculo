/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

// TODO:
// 1) Ensure directional rotation plugin works

import clamp                from 'lodash/clamp';
import isFunction           from 'lodash/isFunction';
import { zoomDirection }    from './constants';
import { EventEmitter }     from 'fbemitter';
import Animation            from './animation';
import AnimationManager     from './animationManager';
import CSSRenderer          from './cssRenderer';
import _Math                from './math/math';
import Matrix2              from './math/matrix2';
import Scene                from './scene';
import SceneManager         from './sceneManager';
import TrackControl         from './trackControl';
import Utils                from './utils';
import Vector2              from './math/vector2';

const animationName = {
    ANONYMOUS: '_anonymous'
};

/**
* Description.
* 
* @class Oculo.Camera
* @constructor
* @param {Object} [options] - An object of options.
* @param {function|Object} [options.bounds] - The bounds.
* @param {boolean} [options.dragToMove] - Whether the camera's position is draggable or not.
* @param {number} [options.minZoom] - The {@link Camera.minZoom|minimum zoom}.
* @param {number} [options.maxZoom] - The {@link Camera.maxZoom|maximum zoom}.
* @param {string|Element|null} [options.view] - The camera's view.
* @param {boolean} [options.wheelToZoom] - Whether wheeling can be used to zoom or not.
* @param {number} [options.wheelToZoomIncrement] - The base {@link Camera.wheelToZoomIncrement|zoom increment}.
* @param {number|string} [options.width] - The camera's {@link Camera.width|width}.
* @param {number|string} [options.height] - The camera's {@link Camera.height|height}.
*
* @example
* var myCamera = new Oculo.Camera({ 
*   view: '#camera',
*   bounds: Oculo.Camera.bounds.WORLD_EDGE,
*   dragToMove: true,
*   minZoom: 0.5,
*   maxZoom: 3,
*   wheelToZoom: true,
*   wheelToZoomIncrement: 0.5,
*   width: 1000,
*   height: 500
* });
*/
class Camera {
    constructor ({ 
        bounds = null, 
        dragToMove = false, 
        height = 0, 
        maxZoom = 3, 
        minZoom = 0.5, 
        onInitialize = null,
        onBeforeRender = null,
        onRender = null,
        view = null, 
        wheelToZoom = false, 
        wheelToZoomIncrement = 0.01, 
        width = 0
    } = {}) {
        
        /**
        * @property {Oculo.AnimationManager} - An object for managing animations.
        * @readonly
        */
        this.animations = new AnimationManager(this);
        
        /**
        * @property {null|function|Object} - The camera's bounds. The minimum and maximum position values for the camera. Set to null if no bounds are desired.
        * @readonly
        * @default null
        *
        * @example <caption>As a stock bounds</caption>
        * Oculo.Camera.bounds.WORLD
        *
        * @example <caption>As a bounds object</caption>
        * { 
        *   minX: 0, 
        *   minY: 0, 
        *   maxX: myCamera.scene.width, 
        *   maxY: myCamera.scene.height
        * }
        *
        * @example <caption>As a function that returns a bounds object</caption>
        * function () { 
        *   var transformation = this.scaleTransformation.getInverse();
        *   var min = this.center.clone().transform(transformation);
        *   var max = new Vector2(this.scene.width, this.scene.height).transform(this.scaleTransformation).subtract(this.center).transform(transformation);
        * 
        *   return {
        *     minX: min.x,
        *     minY: min.y,
        *     maxX: max.x,
        *     maxY: max.y
        *   }
        * }
        */
        this.bounds = bounds;
        
        /**
        * @property {Vector2} - The center of the camera's FOV.
        * @readonly
        */
        this.center = new Vector2(width, height).multiplyScalar(0.5);
        
        /**
        * @property {boolean} - Whether the camera's position is draggable or not.
        * @default false
        */
        this.dragToMove = (dragToMove === true) ? true : false;

        /**
        * @property {number} - The height.
        * @readonly
        * @default 0
        */
        this.height = height;
        
        /**
        * @property {boolean} - Whether the camera is animating or not.
        * @readonly
        * @default
        */
        this.isAnimating = false;
        
        /**
        * @property {boolean} - Whether the camera has been rendered or not.
        * @readonly
        * @default
        */
        this.isRendered = false;
        
        /**
        * @property {null|number} - The minimum X position after bounds are applied.
        * @readonly
        */
        this.minPositionX = null;
        
        /**
        * @property {null|number} - The minimum Y position after bounds are applied.
        * @readonly
        */
        this.minPositionY = null;
        
        /**
        * @property {null|number} - The maximum X position after bounds are applied.
        * @readonly
        */
        this.maxPositionX = null;
        
        /**
        * @property {null|number} - The maximum Y position after bounds are applied.
        * @readonly
        */
        this.maxPositionY = null;
        
        /**
        * The minimum value the camera can be zoomed.
        * @property {number} - See {@link Camera.zoom|zoom}.
        * @default 0.5
        */
        this.minZoom = minZoom;
        
        /**
        * The maximum value the camera can be zoomed.
        * @property {number} - See {@link Camera.zoom|zoom}.
        * @default 3
        */
        this.maxZoom = maxZoom;
        
        /**
        * @property {number} - The fade opacity.
        */
        this.fadeOpacity = 1;
        
        /**
        * @property {number} - The position of the camera on the scene.
        * @readonly
        */
        this.position = new Vector2(0, 0);
        
        /**
        * @property {number} - The renderer.
        * @readonly
        */
        this.renderer = new CSSRenderer(this);
        
        /**
        * @property {number} - The amount of rotation in degrees.
        * @readonly
        * @default 0
        */
        this.rotation = 0;
        
        /**
        * @property {Oculo.SceneManager} - An object for managing scenes.
        * @readonly
        */
        this.scenes = new SceneManager();
        
        /**
        * @property {TrackControl} - The track control.
        * @readonly
        * @default
        */
        this.trackControl = null;

        /**
        * @property {Vector2} - The transformation origin.
        * @readonly
        */
        this.transformOrigin = new Vector2(0, 0);
        
        /**
        * @private
        * @property {Element} - The view.
        */
        this.view = null;
        
        /**
        * @property {boolean} - Whether wheeling can be used to zoom or not.
        * @default false
        */
        this.wheelToZoom = (wheelToZoom === true) ? true : false;
        
        /**
        * @property {number} - The base increment at which the camera will be zoomed. See {@link Camera.zoom|zoom}.
        * @default 0.01
        */
        this.wheelToZoomIncrement = wheelToZoomIncrement;
        
        /**
        * @property {number} - The width.
        * @readonly
        * @default 0
        */
        this.width = width;
        
        /**
        * @property {number} - The zoom direction.
        * @readonly
        * @default 0
        */
        this.zoomDirection = zoomDirection.NONE;
        
        /**
        * @private
        * @property {EventEmitter} - The internal event emitter.
        */
        this._events = new EventEmitter();
        
        /**
        * @private
        * @property {number} - The scale at which the scene is rasterized.
        */
        this._rasterScale = 1;
        
        /**
        * @private
        * @property {Vector2} - The offset of the camera's top left corner relative to the scene without clamping or effects applied. Used to animate the camera.
        */
        this._rawOffset = new Vector2(0, 0);
        
        /**
        * @private
        * @property {Vector2} - The offset of the camera's top left corner relative to the scene without clamping or effects applied and only taking scale into account. Used to animate the camera.
        */
        this._rawScaleOffset = new Vector2(0, 0);
        
        /**
        * @private
        * @property {Vector2} - The offset of the scene's transform origin from 0,0.
        */
        this._transformOriginOffset = new Vector2(0, 0);
        
        /**
        * @private
        * @property {number} - The internally managed zoom.
        */
        this._zoom = 1;
        
        // Initialize position
        this.setPosition(new Vector2(width * 0.5, height * 0.5));
        
        // Initialize events
        if (onInitialize !== null) {
            this.onInitialize = onInitialize;
        }
        
        if (onBeforeRender !== null) {
            this.onBeforeRender = onBeforeRender;
        }
        
        if (onRender !== null) {
            this.onRender = onRender;
        }
        
        this.onResize = () => {
            // Maintain camera position and update the current animation
            if (this.view !== null) {
                this.renderer.renderSize();
                
                new Animation(this, { 
                    destroyOnComplete: true, 
                    paused: false, 
                    onComplete: function (wasPaused) {
                        if (this.camera.animations.currentAnimation) {
                            // 'this' is bound to the Animation via the Animation class
                            var animation = this.camera.animations.currentAnimation;
                            var time = animation.time();

                            if (animation.totalProgress() > 0) {
                                animation.seek(0).invalidate();

                                if (animation.coreTweens[0]) {
                                    this.camera.setPosition(animation.coreTweens[0].props.start.position);
                                }

                                animation.seek(time, false);
                            }

                            if (!wasPaused) {
                                this.camera.resume();
                            }
                        }
                    },
                    onCompleteParams: [this.animations.isPaused]
                }).moveTo(this.position, 0, { overwrite: false });
            }
        }
        
        // Initialize event listeners
        this._events.addListener('change:size', this.onResize);
        
        // Initialize view
        this.setView(view);
        
        this.onInitialize(arguments[0]);
    }
    
    /**
    * @name Camera#isRotated
    * @property {boolean} - Whether the camera is rotated or not.
    * @readonly
    */
    get isRotated () {
        return (Math.abs(this.rotation / 360) % 1) > 0;
    }
    
    /**
    * @name Camera#isZoomed
    * @property {boolean} - Whether the camera is zoomed or not.
    * @readonly
    */
    get isZoomed () {
        return this.zoom !== 1;
    }
    
    /**
    * @name Camera#_rawOffsetX
    * @property {Vector2} - The X offset of the camera's top left corner relative to the scene without clamping or effects applied.
    */
    get _rawOffsetX () {
        return this._rawOffset.x;
    }
    
    set _rawOffsetX (value) {
        this._rawOffset.x = value;
    }
    
    /**
    * @name Camera#_rawOffsetY
    * @property {Vector2} - The Y offset of the camera's top left corner relative to the scene without clamping or effects applied.
    */
    get _rawOffsetY () {
        return this._rawOffset.y;
    }
    
    set _rawOffsetY (value) {
        this._rawOffset.y = value;
    }
    
        /**
    * @name Camera#_rawScaleOffsetX
    * @property {Vector2} - The X offset of the camera's top left corner relative to the scene without clamping or effects applied and only taking scale into account.
    */
    get _rawScaleOffsetX () {
        return this._rawScaleOffset.x;
    }
    
    set _rawScaleOffsetX (value) {
        this._rawScaleOffset.x = value;
    }
    
    /**
    * @name Camera#_rawScaleOffsetY
    * @property {Vector2} - The Y offset of the camera's top left corner relative to the scene without clamping or effects applied and only taking scale into account.
    */
    get _rawScaleOffsetY () {
        return this._rawScaleOffset.y;
    }
    
    set _rawScaleOffsetY (value) {
        this._rawScaleOffset.y = value;
    }
    
    /**
    * @name Camera#scene
    * @property {Oculo.Scene} - The active scene.
    * @readonly
    */
    get scene () {
        return this.scenes.activeScene;
    }
    
    /**
    * @name Camera#scaleTransformation
    * @property {Matrix2} - The scale transformation of the scene.
    * @readonly
    */
    get scaleTransformation () {
        return new Matrix2().scale(this.zoom, this.zoom);
    }
    
    /**
    * @name Camera#transformation
    * @property {Matrix2} - The transformation of the scene.
    * @readonly
    */
    get transformation () {
        return new Matrix2().scale(this.zoom, this.zoom).rotate(_Math.degToRad(-this.rotation));
    }
    
    /**
    * @name Camera#zoom
    * @property {number} - The amount of zoom. A ratio where 1 = 100%.
    * @readonly
    * @default 1
    */
    get zoom () {
        return this._zoom;
    }
        
    set zoom (value) {
        this._zoom = this._clampZoom(value);
        this._updateBounds();
    };
    
    /**
    * Clamps the position.
    *
    * @private
    * @param {Vector2} position - The position.
    * @returns {Vector2} The clamped position.
    */
    _clampPosition (position) {
        return position.clone().set(this._clampPositionX(position.x), this._clampPositionY(position.y));
    }
    
    /**
    * Clamps the X position.
    *
    * @private
    * @param {number} x - The position.
    * @returns {number} The clamped position.
    */
    _clampPositionX (x) {
        if (this.bounds !== null) {
            x = clamp(x, this.minPositionX, this.maxPositionX);
        }
        
        return x;
    }
    
    /**
    * Clamps the Y position.
    *
    * @private
    * @param {number} y - The position.
    * @returns {number} The clamped position.
    */
    _clampPositionY (y) {
        if (this.bounds !== null) {
            y = clamp(y, this.minPositionY, this.maxPositionY);
        }
        
        return y;
    }
    
    /**
    * Clamps the zoom.
    *
    * @private
    * @param {number} zoom - The zoom.
    * @returns {number} The clamped zoom.
    */
    _clampZoom (zoom) {
        return clamp(zoom, this.minZoom, this.maxZoom);
    }
    
    /**
    * Converts a FOV position to a scene position.
    *
    * @private
    * @param {Vector2} cameraFOVPosition - The point in the camera's FOV.
    * @param {Vector2} cameraPosition - The camera's position.
    * @param {Vector2} cameraCenter - The center of the camera's FOV.
    * @param {Matrix2} transformation - The transformation matrix.
    * @returns {Vector2} The scene position.
    */
    _convertFOVPositionToScenePosition (cameraFOVPosition, cameraPosition, cameraCenter, transformation) {
        return cameraPosition.clone().transform(transformation).subtract(cameraCenter.clone().subtract(cameraFOVPosition)).transform(transformation.getInverse());
    }
    
    /**
    * Converts a scene position to a FOV position.
    *
    * @private
    * @param {Vector2} scenePosition - The raw point on the scene.
    * @param {Vector2} cameraPosition - The camera's position.
    * @param {Vector2} cameraCenter - The center of the camera's FOV.
    * @param {Matrix2} transformation - The transformation matrix.
    * @returns {Vector2} The FOV position.
    */
    _convertScenePositionToFOVPosition (scenePosition, cameraPosition, cameraCenter, transformation) {
        return cameraCenter.clone().add(scenePosition.clone().transform(transformation).subtract(cameraPosition.clone().transform(transformation)));
    }
    
    /**
    * Converts a scene position located at a FOV position to a camera position.
    *
    * @private
    * @param {Vector2} scenePosition - The raw point on the scene.
    * @param {Vector2} cameraFOVPosition - The point in the camera's FOV.
    * @param {Vector2} cameraCenter - The center of the camera's FOV.
    * @param {Vector2} transformOrigin - The transform origin.
    * @param {Matrix2} transformation - The transformation matrix.
    * @returns {Vector2} The camera position.
    */
    _convertScenePositionToCameraPosition (scenePosition, cameraFOVPosition, cameraCenter, transformOrigin, transformation) {
        var transformOriginOffset = this._getTransformOriginOffset(transformOrigin, transformation);
        var offset = scenePosition.clone().transform(transformation).subtract(transformOriginOffset).subtract(cameraFOVPosition);

        return this._convertOffsetToPosition(offset, cameraCenter, transformOrigin, transformation);
    }
    
    /**
    * Converts a camera offset to a camera position.
    *
    * @private
    * @param {Vector2} cameraOffset - The camera's offset on the scene.
    * @param {Vector2} cameraCenter - The center of the camera's FOV.
    * @param {Vector2} transformOrigin - The transform origin.
    * @param {Matrix2} transformation - The transformation matrix.
    * @returns {Vector2} The camera position.
    */
    _convertOffsetToPosition (cameraOffset, cameraCenter, transformOrigin, transformation) {
        var transformOriginOffset = this._getTransformOriginOffset(transformOrigin, transformation);

        return cameraOffset.clone().add(transformOriginOffset).add(cameraCenter).transform(transformation.getInverse());
    }
    
    /**
    * Converts a camera position to a camera offset.
    *
    * @private
    * @param {Vector2} cameraPosition - The camera's position on the scene.
    * @param {Vector2} cameraCenter - The center of the camera's FOV.
    * @param {Vector2} transformOrigin - The transform origin.
    * @param {Matrix2} transformation - The transformation matrix.
    * @returns {Vector2} The camera offset.
    */
    _convertPositionToOffset (cameraPosition, cameraCenter, transformOrigin, transformation) {
        var transformOriginOffset = this._getTransformOriginOffset(transformOrigin, transformation);

        return cameraPosition.clone().transform(transformation).subtract(transformOriginOffset).subtract(cameraCenter);
    }
    
    /**
    * Gets the offset of the transform origin.
    *
    * @private
    * @param {Vector2} transformOrigin - The transformation origin.
    * @param {Matrix2} transformation - The transformation matrix.
    * @returns {Vector2} The offset.
    */
    _getTransformOriginOffset (transformOrigin, transformation) {
        return transformOrigin.clone().transform(transformation).subtract(transformOrigin);
    }
    
    /**
    * Resets the camera to the default state.
    *
    * @private
    * @returns {this} self
    */
    _reset () {
        this.transformOrigin.set(0, 0);
        this.setPosition(new Vector2(this.width * 0.5, this.height * 0.5));
        this.rotation = 0;
        this.zoom = 1;
        this._rasterScale = 1;
        this._updateRawOffset();
        
        return this;
    }
    
    /**
    * Updates the bounds.
    *
    * @private
    * returns {this} self
    */
    _updateBounds () { 
        var bounds;
        
        if (this.bounds === null) {
            bounds = {
                minX: null,
                minY: null,
                maxX: null,
                maxY: null
            };
        }
        else if (isFunction(this.bounds)) {
            bounds = this.bounds.call(this);
        }
        else {
            bounds = this.bounds;
        }

        this.minPositionX = bounds.minX;
        this.minPositionY = bounds.minY;
        this.maxPositionX = bounds.maxX;
        this.maxPositionY = bounds.maxY;
        
        return this;
    }
    
    /**
    * Updates the raw offset.
    *
    * @private
    * @returns {this} self
    */
    _updateRawOffset () {
        this._rawOffset.copy(this._convertPositionToOffset(this.position, this.center, this.transformOrigin, this.transformation));
        this._rawScaleOffset.copy(this._convertPositionToOffset(this.position, this.center, this.transformOrigin, this.scaleTransformation)); 
        
        return this;
    }
    
    /**
    * Adds an animation to the camera.
    *
    * @see Oculo.AnimationManager.add
    * returns {this} self
    */
    addAnimation (name, animation) {
        this.animations.add(name, animation);
        
        return this;
    }
    
    /**
    * Gets an animation.
    *
    * @see Oculo.AnimationManager.get
    */
    getAnimation (name) {
        return this.animations.get(name);
    }
    
    /**
    * Adds a scene to the camera.
    *
    * @see Oculo.SceneManager.add
    * @returns {this} self
    */
    addScene (name, scene) {
        this.scenes.add(name, scene);
        
        return this;
    }
    
    /**
    * Gets a scene.
    *
    * @see Oculo.SceneManager.get
    */
    getScene (name) {
        return this.scenes.get(name);
    }
    
    /**
    * Sets the active scene.
    *
    * @param {string} name - The name of the scene.
    * @returns {this} self
    */
    setScene (name) {
        this.scenes.setActiveScene(name);
        this._reset();

        return this;
    }
    
    /**
    * Applies new bounds or the current bounds.
    *
    * @param {null|function|Object} [bounds] - The new bounds. The minimum and maximum position values for the camera. Set to null if no bounds are desired.
    * returns {this} self
    */
    applyBounds (bounds) { 
        if (bounds !== undefined) {
            this.bounds = bounds;
            this._updateBounds();
        }
        
        this.setPosition(this.position);
        
        return this;
    }
    
    /**
    * Destroys the camera and prepares it for garbage collection.
    *
    * @returns {this} self
    */
    destroy () {
        this.setView(null);
        this.animations.destroy();
        this.renderer.destroy();
        this.scenes.destroy();
        this._events.removeAllListeners();
        
        return this;
    }
    
    /**
    * Disables drag-to-move.
    *
    * @returns {this} self
    */
    disableDragToMove () {
        if (this.trackControl && this.dragToMove) {
            this.trackControl.disableDrag();
        }
            
        return this;
    }

    /**
    * Enables drag-to-move.
    *
    * @returns {this} self
    */
    enableDragToMove () {
        if (this.trackControl && this.dragToMove) {
            this.trackControl.enableDrag();
        }

        return this;
    }
    
    /**
    * Disables wheel-to-zoom.
    *
    * @returns {this} self
    */
    disableWheelToZoom () {
        if (this.trackControl && this.wheelToZoom) {
            this.trackControl.disableWheel();
        }
        
        return this;
    }

    /**
    * Enables wheel-to-zoom.
    *
    * @returns {this} self
    */
    enableWheelToZoom () {
        if (this.trackControl && this.wheelToZoom) {
            this.trackControl.enableWheel();
        }

        return this;
    }
    
    /**
    * Get an element's position in the scene.
    *
    * @param {string|Element} element - The element. This can be a selector or an element.
    * @returns {Vector2} The position.
    */
    getElementPosition (element) {
        return Utils.DOM.getObjectWorldPosition(Utils.DOM.parseView(element), this.scene, this.transformation);
    }

    /**
    * Called when the camera has been initialized. The default implementation is a no-op. Override this function with your own code.
    *
    * @param {Object} [options] - The options passed to the constructor when the camera was created.
    */
    onInitialize (options) {
        
    }

    /**
    * Called before the camera has rendered. The default implementation is a no-op. Override this function with your own code.
    */
    onBeforeRender () {

    }

    /**
    * Called after the camera has rendered. The default implementation is a no-op. Override this function with your own code.
    */
    onRender () {

    }

    /**
    * Render the camera. If you need to manipulate how the camera renders, use {@link Camera#onBeforeRender|onBeforeRender} and {@link Camera#onRender|onRender}.
    *
    * @returns {this} self
    */
    render () {
        this.onBeforeRender();
        
        if (this.view !== null) {
            this.renderer.render();
        }
        
        this.onRender();

        return this;
    }
    
    /**
    * Sets the position.
    *
    * @param {Vector2} position - The new position.
    * @param {boolean} enforceBounds - Whether to enforce bounds or not.
    * @returns {this} self
    */
    setPosition (position, enforceBounds = true) {
        if (enforceBounds) {
            this.position.set(this._clampPositionX(position.x), this._clampPositionY(position.y));
        }
        else {
            this.position.set(position.x, position.y);
        }
        
        return this;
    }
    
    /**
    * Sets the size of the camera.
    *
    * @param {number|string} width - The width.
    * @param {number|string} height - The height.
    * @returns {this} self
    */
    setSize (width, height) {
        var hasChanged = false;
        
        if (Number.isFinite(width) && (width !== this.width)) {
            this.width = width;
            this.center.x = width * 0.5;
            hasChanged = true;
        }
        
        if (Number.isFinite(height) && (height !== this.height)) {
            this.height = height;
            this.center.y = height * 0.5;
            hasChanged = true;
        }
        
        if (hasChanged) {
            this._events.emit('change:size');
        }
        
        return this;
    }
    
    /**
    * Sets the transformOrigin.
    *
    * @private
    * @param {Vector2} origin - The origin.
    * @returns {this} self
    */
    setTransformOrigin (origin) {
        if (origin && !origin.equals(this.transformOrigin)) {
            this.transformOrigin.copy(origin);

            if (this.isRotated || this.isZoomed) {
                this._updateRawOffset();
            }
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
        
        if (this.view) {
            if (this.view.parentNode) {
                this.view.parentNode.removeChild(this.view);
            }
            
            this.trackControl.destroy();
            this.trackControl = null;
            this.view = null;
            this.isRendered = false;
            this._rasterScale = this.zoom;
        }
        
        if (view) {
            this.view = view;
            this.scenes.ensureView();
            this.view.style.display = 'none';
            this.view.style.overflow = 'hidden';
            this.view.style.position = 'relative';
            this.view.appendChild(this.scenes.view);
            this.trackControl = new TrackControl(this, {
                draggable: this.dragToMove,
                onDrag: function (camera) {
                    var position = camera._convertOffsetToPosition(new Vector2(-this.x, -this.y), camera.center, camera.transformOrigin, camera.transformation);

                    camera.moveTo(position, 0, { 
                        onCompleteParams: [this],
                        onComplete: function (dragControl) {
                            dragControl.update();
                        }
                    });
                },
                onPress: function (camera) { 
                    // Must cancel drag to disable dragging during animation to avoid frame rate issues caused when drag control is re-enabled
                    if (camera.isAnimating) { 
                        this._endDrag(this.pointerEvent);
                    };
                },
                wheelable: this.wheelToZoom,
                onWheel: function (camera) {
                    const ZOOM_IN = 1;
                    const ZOOM_OUT = 0;
                    var velocity = Math.abs(this.wheelEvent.deltaY);
                    var direction = this.wheelEvent.deltaY > 0 ? ZOOM_OUT : ZOOM_IN;
                    var previousDirection = this.previousWheelEvent.deltaY > 0 ? ZOOM_OUT : ZOOM_IN;
                    var cameraRect;
                    var cameraFOVPosition = new Vector2();
                    var scenePosition = new Vector2();
                    var origin = camera.transformOrigin;
                    var zoom = camera.zoom + camera.zoom * camera.wheelToZoomIncrement * (velocity > 1 ? velocity * 0.5 : 1) * (direction === ZOOM_IN ? 1 : -1);

                    // Performance Optimization: If zoom has not changed because it's at the min/max, don't zoom.
                    if (direction === previousDirection && camera._clampZoom(zoom) !== camera.zoom) { 
                        cameraRect = camera.view.getBoundingClientRect();
                        cameraFOVPosition.set(this.wheelEvent.clientX - cameraRect.left, this.wheelEvent.clientY - cameraRect.top);
                        scenePosition = camera._convertFOVPositionToScenePosition(cameraFOVPosition, camera.position, camera.center, camera.transformation);

                        if (Math.floor(origin.x) !== Math.floor(scenePosition.x) || Math.floor(origin.y) !== Math.floor(scenePosition.y)) {
                            origin = scenePosition;
                        }

                        camera.zoomAt(zoom, origin, 0, { disableWheel: false });
                    }
                }
            });
        }
        
        return this;
    }
    
    /**
    * Pauses the camera animation.
    *
    * @see {@link external:TimelineMax|TimelineMax}
    * @returns {this} self
    */
    pause () {
        this.animations.pause();

        return this;
    }

    /**
    * Plays the camera animation forward from the current playhead position.
    *
    * @see {@link external:TimelineMax|TimelineMax}
    * @returns {this} self
    */
    play (animation) {
        this.animations.play(animation);

        return this;
    }
    
    /**
    * Resumes playing the camera animation from the current playhead position.
    *
    * @see {@link external:TimelineMax|TimelineMax}
    * @returns {this} self
    */
    resume () {
        this.animations.resume();

        return this;
    }
    
    /**
    * Reverses playback of an animation.
    *
    * @param {string} [name] - The name of the animation. If none is specified, the current animation will be reversed.
    * @returns {this} self
    */
    reverse (name) {
        this.animations.reverse(name);
        
        return this;
    }

    /**
    * Immediately animate the camera.
    *
    * @see {@link Camera.Animation#animate|Animation.animate}
    * @returns {this} self
    */
    animate (props, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).animate(props, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }

    /**
    * Immediately fade to an opacity.
    *
    * @see {@link Camera.Animation#fadeTo|Animation.fadeTo}
    * @returns {this} self
    */
    fadeTo (opacity, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).fadeTo(opacity, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }
    
    /**
    * Immediately move to a specific position.
    *
    * @see {@link Camera.Animation#moveTo|Animation.moveTo}
    * @returns {this} self
    */
    moveTo (position, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).moveTo(position, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }

    /**
    * Immediately rotate at the specified location.
    *
    * @see {@link Camera.Animation#rotateAt|Animation.rotateAt}
    * @returns {this} self
    */
    rotateAt (rotation, origin, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).rotateAt(rotation, origin, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }

    /**
    * Immediately rotate at the current position.
    *
    * @see {@link Camera.Animation#rotateTo|Animation.rotateTo}
    * @returns {this} self
    */
    rotateTo (rotation, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).rotateTo(rotation, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }

    /**
    * Immediately shake the camera.
    *
    * @see {@link Camera.Animation#shake|Animation.shake}
    * @returns {this} self
    */
    shake (intensity, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this).shake(intensity, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }

    /**
    * Immediately zoom in/out at a specific location.
    *
    * @see {@link Camera.Animation#zoomAt|Animation.zoomAt}
    * @returns {this} self
    */
    zoomAt (zoom, origin, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).zoomAt(zoom, origin, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);
        
        return this;
    }

    /**
    * Immediately zoom in/out at the current position.
    *
    * @see {@link Camera.Animation#zoomTo|Animation.zoomTo}
    * @returns {this} self
    */
    zoomTo (zoom, duration, options) {
        this.animations.add(animationName.ANONYMOUS, new Animation(this, options).zoomTo(zoom, duration, Animation._filterKeyframeEventCallbackOptions(options)));
        this.animations.play(animationName.ANONYMOUS);

        return this;
    }
}

Camera.bounds = {
    NONE: null,
    WORLD: function () {
        var transformation = this.scaleTransformation.getInverse();
        var min = this.center.clone().transform(transformation);
        var max = new Vector2(this.scene.width, this.scene.height).transform(this.scaleTransformation).subtract(this.center).transform(transformation);

        return {
            minX: min.x,
            minY: min.y,
            maxX: max.x,
            maxY: max.y
        };
    },
    WORLD_EDGE: function () {
        return {
            minX: 0,
            minY: 0,
            maxX: this.scene.width,
            maxY: this.scene.height
        };
    },
};

export default Camera;