'use strict';

import { connect }       from 'react-redux';
import actions           from '../actions';
import BehaviorGroupView from '../components/behaviorGroup';

const mapStateToProps = (state, props) => {
    return {
        behaviorGroup: state.behaviorGroup
    };
};

const BehaviorGroup = connect(mapStateToProps)(BehaviorGroupView);

export default BehaviorGroup;