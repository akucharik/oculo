'use strict';

import React         from 'react';
import data          from '../data/data';
import actions       from '../actions';
import cameraActions from '../cameraActions';
import DropdownList  from '../containers/dropdownList';
import Textbox       from '../containers/textbox';

const ZoomToControls = () => (
    <div>
        <div>
            <label>Zoom</label>
            <Textbox valueKey='zoom' onChange={actions.updateZoom} />
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
            <button type="button" className="button expanded" onClick={cameraActions.zoomTo}>Zoom</button>
        </div>
    </div>
);

export default ZoomToControls;