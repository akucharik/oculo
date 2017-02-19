'use strict';

import data    from './data/data';
import actions from './actions';

const reducers = {};

// UI properties
reducers.behaviorGroup = function (value, action) {
    if (value === undefined) {
        value = 'moveTo';
    }
    
    switch (action.type) {
        case actions.type.UPDATE_BEHAVIOR_GROUP:
            return action.group;
        default: 
            return value;
    }
};

reducers.behaviorGroupListIsVisible = function (value, action) {
    if (value === undefined) {
        value = false;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_BEHAVIOR_GROUP_LIST_VISIBILITY:
            return action.isVisible;
        default: 
            return value;
    }
};

// Camera properties
reducers.bounds = function (value, action) {
    if (value === undefined) {
        value = data.boundsList[data.lookups.boundsList['None']].value;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_BOUNDS:
            return action.bounds;
        default: 
            return value;
    }
};

reducers.height = function (value, action) {
    if (value === undefined) {
        value = '500';
    }
    
    switch (action.type) {
        case actions.type.UPDATE_HEIGHT:
            return action.height;
        default: 
            return value;
    }
};

reducers.width = function (value, action) {
    if (value === undefined) {
        value = '500';
    }
    
    switch (action.type) {
        case actions.type.UPDATE_WIDTH:
            return action.width;
        default: 
            return value;
    }
};

// Animation properties
reducers.position = function (value, action) {
    if (value === undefined) {
        value = data.targetList[data.lookups.targetList['Actinium']].value;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_POSITION:
            return action.position;
        default: 
            return value;
    }
};

reducers.rotation = function (value, action) {
    if (value === undefined) {
        value = 0;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_ROTATION:
            return action.rotation;
        default: 
            return value;
    }
};

reducers.zoom = function (value, action) {
    if (value === undefined) {
        value = 1;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_ZOOM:
            return action.zoom;
        default: 
            return value;
    }
};

reducers.origin = function (value, action) {
    if (value === undefined) {
        value = data.originList[data.lookups.originList['auto']].value;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_ORIGIN:
            return action.origin;
        default: 
            return value;
    }
};

reducers.duration = function (value, action) {
    if (value === undefined) {
        value = data.durationList[data.lookups.durationList['1']].value;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_DURATION:
            return action.duration;
        default: 
            return value;
    }
};

reducers.ease = function (value, action) {
    if (value === undefined) {
        value = data.ease.None;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_EASE:
            return action.ease;
        default: 
            return value;
    }
};

reducers.shakeIntensity = function (value, action) {
    if (value === undefined) {
        value = data.shakeIntensityList[data.lookups.shakeIntensityList['0.05']].value;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_SHAKE_INTENSITY:
            return action.intensity;
        default: 
            return value;
    }
};

reducers.shakeDirection = function (value, action) {
    if (value === undefined) {
        value = data.shakeDirectionList[data.lookups.shakeDirectionList.Both].value;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_SHAKE_DIRECTION:
            return action.direction;
        default: 
            return value;
    }
};

reducers.shakeEaseIn = function (value, action) {
    if (value === undefined) {
        value = data.ease.None;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_SHAKE_EASEIN:
            return action.easeIn;
        default: 
            return value;
    }
};

reducers.shakeEaseOut = function (value, action) {
    if (value === undefined) {
        value = data.ease.None;
    }
    
    switch (action.type) {
        case actions.type.UPDATE_SHAKE_EASEOUT:
            return action.easeOut;
        default: 
            return value;
    }
};

// App
reducers.app = function (state, action) {
    if (state === undefined) {
        state = {};
    }

    return {
        // UI properties
        behaviorGroup: reducers.behaviorGroup(state.behaviorGroup, action),
        behaviorGroupListIsVisible: reducers.behaviorGroupListIsVisible(state.behaviorGroupListIsVisible, action),
        
        // Camera properties
        bounds: reducers.bounds(state.bounds, action),
        height: reducers.height(state.height, action),
        width: reducers.width(state.width, action),
        
        // Animation properties
        position: reducers.position(state.position, action),
        rotation: reducers.rotation(state.rotation, action),
        zoom: reducers.zoom(state.zoom, action),
        origin: reducers.origin(state.origin, action),
        duration: reducers.duration(state.duration, action),
        ease: reducers.ease(state.ease, action),
        shakeIntensity: reducers.shakeIntensity(state.shakeIntensity, action),
        shakeDirection: reducers.shakeDirection(state.shakeDirection, action),
        shakeEaseIn: reducers.shakeEaseIn(state.shakeEaseIn, action),
        shakeEaseOut: reducers.shakeEaseOut(state.shakeEaseOut, action)
    };
};

export default reducers;