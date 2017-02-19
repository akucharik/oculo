'use strict';

import React from 'react';

const DropdownList = ({ items, itemTextKey, itemValueKey, value, onChange }) => (
    <select value={value} onChange={onChange}> 
        {items.map(item => 
            <option key={item[itemValueKey]} value={item[itemValueKey]}> {item[itemTextKey]} </option>
        )}
    </select>
);

DropdownList.propTypes = {
    items: React.PropTypes.array,
    itemTextKey: React.PropTypes.string,
    itemValueKey: React.PropTypes.string,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
};

DropdownList.defaultProps = {
    items: [],
    itemTextKey: 'text',
    itemValueKey: 'value'
};

export default DropdownList;