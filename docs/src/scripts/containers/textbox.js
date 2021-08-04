'use strict';

import { connect } from 'react-redux';
import actions     from '../actions';
import TextboxView from '../components/textbox';

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

const Textbox = connect(mapStateToProps, mapDispatchToProps)(TextboxView);

export default Textbox;