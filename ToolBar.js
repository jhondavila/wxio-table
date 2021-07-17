import React from 'react';

export const ToolBar = ({children}) => {
    return (
        <div className="toolbar d-flex">
            {children}
        </div>
    );
};