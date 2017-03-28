import React from 'react';

export default ({...rest}) => (
    <div {...rest} className="wait-for-loading">
        <i className="fa fa-5x fa-spin fa-spinner"></i>
    </div>
);