'use strict';

import { connect }  from 'react-redux';
import store        from '../store';
import Component    from '../components/customDropdownList';

const mapStateToProps = (state, ownProps) => {
    return {
        value: state[ownProps.valueKey],
        isListVisible: state[ownProps.listVisibilityKey]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    let getState = store.getState;
    
    return {
        onItemClick: (event) => {
            event.nativeEvent.stopImmediatePropagation();
            dispatch(ownProps.onChange(event.target.getAttribute('data-value')));
            dispatch(ownProps.onClick(false));
        },
        onSelectedItemClick: (event) => {
            event.nativeEvent.stopImmediatePropagation();
            dispatch(ownProps.onClick(getState()[ownProps.listVisibilityKey] ? false : true));
        }
    };
};

const DropdownList = connect(mapStateToProps, mapDispatchToProps)(Component);

export default DropdownList;