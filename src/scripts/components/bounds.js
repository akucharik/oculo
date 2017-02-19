'use strict';

import React         from 'react';
import data          from '../data/data';
import actions       from '../actions';
import cameraActions from '../cameraActions';
import DropdownList  from '../containers/dropdownList';

const Bounds = () => (
    <div>
        <div>
            <label>Bounds</label>
            <DropdownList items={data.boundsList} valueKey='bounds' onChange={actions.updateBounds} />
        </div>
        <div className="demo-cpanel-behavior-actions">
            <button type="button" className="button expanded" onClick={cameraActions.setBounds}>Set Bounds</button>
        </div>
    </div>
);

export default Bounds;