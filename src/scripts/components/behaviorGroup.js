'use strict';

import React    from 'react';
import Animate  from '../components/animateControls';
import Bounds   from '../components/bounds';
import MoveTo   from '../components/moveToControls';
import RotateAt from '../components/rotateAtControls';
import RotateTo from '../components/rotateToControls';
import SetSize  from '../components/setSizeControls';
import Shake    from '../components/shakeControls';
import ZoomAt   from '../components/zoomAtControls';
import ZoomTo   from '../components/zoomToControls';

const BehaviorGroup = ({ behaviorGroup }) => (
    <div>
        {behaviorGroup === 'animate' &&
            <Animate />
        }
        {behaviorGroup === 'bounds' &&
            <Bounds />
        }
        {behaviorGroup === 'moveTo' &&
            <MoveTo />
        }
        {behaviorGroup === 'rotateAt' &&
            <RotateAt />
        }
        {behaviorGroup === 'rotateTo' &&
            <RotateTo />
        }
        {behaviorGroup === 'setSize' &&
            <SetSize />
        }
        {behaviorGroup === 'shake' &&
            <Shake />
        }
        {behaviorGroup === 'zoomAt' &&
            <ZoomAt />
        }
        {behaviorGroup === 'zoomTo' &&
            <ZoomTo />
        }
    </div>
);

BehaviorGroup.propTypes = {
    behaviorGroup: React.PropTypes.string.isRequired
};

export default BehaviorGroup;