'use strict';

import React         from 'react';
import data          from '../data/data';
import actions       from '../actions';
import cameraActions from '../cameraActions';
import DropdownList  from '../containers/dropdownList';

const ShakeControls = () => (
    <div>
        <div>
            <label>Intensity</label>
            <DropdownList items={data.shakeIntensityList} valueKey='shakeIntensity' onChange={actions.updateShakeIntensity} />
        </div>
        <div>
            <label>Duration</label>
            <DropdownList items={data.durationList} valueKey='duration' onChange={actions.updateDuration} />
        </div>
        <div>
            <label>Direction</label>
            <DropdownList items={data.shakeDirectionList} valueKey='shakeDirection' onChange={actions.updateShakeDirection} />
        </div>
        <div>
            <label>Ease</label>
            <DropdownList items={data.easeList} valueKey='ease' onChange={actions.updateEase} />
        </div>
        <div>
            <label>Ease in</label>
            <DropdownList items={data.easeList} valueKey='shakeEaseIn' onChange={actions.updateShakeEaseIn} />
        </div>
        <div>
            <label>Ease out</label>
            <DropdownList items={data.easeList} valueKey='shakeEaseOut' onChange={actions.updateShakeEaseOut} />
        </div>
        <div className="demo-cpanel-behavior-actions">
            <button type="button" className="button expanded" onClick={cameraActions.shake}>Shake</button>
        </div>
    </div>
);

export default ShakeControls;