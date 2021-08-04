'use strict';

import React         from 'react';
import cameraActions from '../cameraActions';

const Controls = () => (
    <div className="demo-cpanel-controls-actions">
        <button type="button" className="button" onClick={cameraActions.pause}>Pause</button>
        <button type="button" className="button" onClick={cameraActions.play}>Play</button>
        <button type="button" className="button" onClick={cameraActions.resume}>Resume</button>
        <button type="button" className="button" onClick={cameraActions.reverse}>Reverse</button>
    </div>
);

export default Controls;