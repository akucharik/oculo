'use strict';

import React from 'react';

const Textbox = ({ value, onChange }) => (
    <input type="text" value={value} onChange={onChange} />
);

Textbox.propTypes = {
    value: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ]).isRequired,
    onChange: React.PropTypes.func
};

export default Textbox;