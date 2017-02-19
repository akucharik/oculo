'use strict';

import React from 'react';
import data  from '../data/data';

const DropdownList = ({ items, itemTextKey, itemValueKey, dataKey, value, isListVisible, onItemClick, onSelectedItemClick }) => (
    <div className='custom-dropdown'>
        <span className='custom-dropdown-input' onClick={onSelectedItemClick}>{data[dataKey][data.lookups[dataKey][value]].text} <i className={!isListVisible ? 'custom-dropdown-arrow fa fa-caret-down' : 'custom-dropdown-arrow fa fa-caret-down fa-rotate-180'}></i></span>
        <ul className='custom-dropdown-popup-list no-bullet' style={{display: isListVisible ? 'block' : 'none' }}>
            {items.map(item => 
                <li key={item[itemValueKey]} data-value={item[itemValueKey]} onClick={onItemClick}> {item[itemTextKey]} </li>
            )}
        </ul>
    </div>
);

DropdownList.propTypes = {
    items: React.PropTypes.array,
    itemTextKey: React.PropTypes.string,
    itemValueKey: React.PropTypes.string,
    value: React.PropTypes.string.isRequired,
    listIsVisible: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired
};

DropdownList.defaultProps = {
    items: [],
    itemTextKey: 'text',
    itemValueKey: 'value'
};

export default DropdownList;