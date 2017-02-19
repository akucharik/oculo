'use strict';

import data  from './data/data';

const actions = {
    type: {
        // UI properties
        UPDATE_BEHAVIOR_GROUP: 'UPDATE_BEHAVIOR_GROUP',
        UPDATE_BEHAVIOR_GROUP_LIST_VISIBILITY: 'UPDATE_BEHAVIOR_GROUP_LIST_VISIBILITY',
        
        // Camera properties
        UPDATE_BOUNDS: 'UPDATE_BOUNDS',
        UPDATE_HEIGHT: 'UPDATE_HEIGHT',
        UPDATE_WIDTH: 'UPDATE_WIDTH',
        
        // Animation properties
        UPDATE_POSITION: 'UPDATE_POSITION',
        UPDATE_ROTATION: 'UPDATE_ROTATION',
        UPDATE_ZOOM: 'UPDATE_ZOOM',
        UPDATE_ORIGIN: 'UPDATE_ORIGIN',
        UPDATE_DURATION: 'UPDATE_DURATION',
        UPDATE_EASE: 'UPDATE_EASE',
        UPDATE_SHAKE_INTENSITY: 'UPDATE_SHAKE_INTENSITY',
        UPDATE_SHAKE_DIRECTION: 'UPDATE_SHAKE_DIRECTION',
        UPDATE_SHAKE_EASEIN: 'UPDATE_SHAKE_EASEIN',
        UPDATE_SHAKE_EASEOUT: 'UPDATE_SHAKE_EASEOUT'
    }
};

// UI properties
actions.updateBehaviorGroup = function (group) {
    return {
        type: actions.type.UPDATE_BEHAVIOR_GROUP,
        group: group
    };
};

actions.updateBehaviorGroupListVisibility = function (isVisible) {
    return {
        type: actions.type.UPDATE_BEHAVIOR_GROUP_LIST_VISIBILITY,
        isVisible: isVisible
    };
};

// Camera properties
actions.updateBounds = function (bounds) {
    return {
        type: actions.type.UPDATE_BOUNDS,
        bounds: bounds
    };
};

actions.updateHeight = function (height) {
    return {
        type: actions.type.UPDATE_HEIGHT,
        height: height
    };
};

actions.updateWidth = function (width) {
    return {
        type: actions.type.UPDATE_WIDTH,
        width: width
    };
};

// Animation properties
actions.updatePosition = function (position) {
    return {
        type: actions.type.UPDATE_POSITION,
        position: position
    };
};

actions.updateRotation = function (rotation) {
    return {
        type: actions.type.UPDATE_ROTATION,
        rotation: rotation
    };
};

actions.updateZoom = function (zoom) {
    return {
        type: actions.type.UPDATE_ZOOM,
        zoom: zoom
    };
};

actions.updateOrigin = function (origin) {
    return {
        type: actions.type.UPDATE_ORIGIN,
        origin: origin
    };
};

actions.updateDuration = function (duration) {
    return {
        type: actions.type.UPDATE_DURATION,
        duration: duration
    };
};

actions.updateEase = function (ease) {
    return {
        type: actions.type.UPDATE_EASE,
        ease: ease
    };
};

actions.updateShakeIntensity = function (intensity) {
    return {
        type: actions.type.UPDATE_SHAKE_INTENSITY,
        intensity: intensity
    };
};

actions.updateShakeDirection = function (direction) {
    return {
        type: actions.type.UPDATE_SHAKE_DIRECTION,
        direction: direction
    };
};

actions.updateShakeEaseIn = function (ease) {
    return {
        type: actions.type.UPDATE_SHAKE_EASEIN,
        easeIn: ease
    };
};

actions.updateShakeEaseOut = function (ease) {
    return {
        type: actions.type.UPDATE_SHAKE_EASEOUT,
        easeOut: ease
    };
};

export default actions;