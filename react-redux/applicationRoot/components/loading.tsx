import React from 'react';

export default ({...rest}) => (
    <div {...rest} className="wait-for-loading">
        <i className="fa fa-5x fa-spin fa-spinner"></i>
    </div>
);

export const SectionLoading = ({...rest}) => (
    <i style={{ position: 'absolute', top: '50%', left: '50%', opacity: 0.2, transform: 'translate(-50%,-50%)' }} className="fa fa-5x fa-spin fa-spinner"></i>
)