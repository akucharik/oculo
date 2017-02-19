'use strict';

import React         from 'react';
import data          from '../data/data';
import actions       from '../actions';
import cameraActions from '../cameraActions';
import Textbox       from '../containers/textbox';

const SetSizeControls = () => (
    <div>
        <div>
            <label>Width</label>
            <Textbox valueKey='width' onChange={actions.updateWidth} />
        </div>
        <div>
            <label>Height</label>
            <Textbox valueKey='height' onChange={actions.updateHeight} />
        </div>
        <div className="demo-cpanel-behavior-actions">
            <button type="button" className="button expanded" onClick={cameraActions.setSize}>Resize</button>
        </div>
    </div>
);

export default SetSizeControls;