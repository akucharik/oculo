'use strict';

import React         from 'react';
import data          from '../data/data';
import actions       from '../actions';
import cameraActions from '../cameraActions';
import DropdownList  from '../containers/dropdownList';
import Textbox       from '../containers/textbox';

const RotateAtControls = () => (
    <div>
        <div>
            <label>Rotation</label>
            <Textbox valueKey='rotation' onChange={actions.updateRotation} />
        </div>
        <div>
            <label>Origin</label>
            <DropdownList items={data.originList} valueKey='origin' onChange={actions.updateOrigin} />
        </div>
        <div>
            <label>Duration</label>
            <DropdownList items={data.durationList} valueKey='duration' onChange={actions.updateDuration} />
        </div>
        <div>
            <label>Ease</label>
            <DropdownList items={data.easeList} valueKey='ease' onChange={actions.updateEase} />
        </div>
        <div className="demo-cpanel-behavior-actions">
            <button type="button" className="button expanded" onClick={cameraActions.rotateAt}>Rotate</button>
        </div>
    </div>
);

export default RotateAtControls;