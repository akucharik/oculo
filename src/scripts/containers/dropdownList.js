'use strict';

import { connect }      from 'react-redux';
import actions          from '../actions';
import DropdownListView from '../components/dropdownList';

const mapStateToProps = (state, props) => {
    return {
        value: state[props.valueKey]
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onChange: (event) => {
            dispatch(props.onChange(event.target.value));
        }
    };
};

const DropdownList = connect(mapStateToProps, mapDispatchToProps)(DropdownListView);

export default DropdownList;