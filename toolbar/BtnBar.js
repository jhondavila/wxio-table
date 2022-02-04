import React from 'react';
import CmpStyle from 'styled-components';

const Btn = CmpStyle.a`
    background-color: ${({ theme }) => theme.btnBgToolBar ? theme.btnBgToolBar : '#f5f5f5'};
    border: 1px solid ${({ theme }) => theme.btnBrdToolBar ? theme.btnBrdToolBar :  "#ddd"} !important;
    text-decoration: none;
    margin-right: 5px;
    width: 45px;
    padding: 6px 10px;
    color: ${({ theme }) => theme.btnClrToolBar ? theme.btnClrToolBar : "#929292"} !important;
    :hover{
        border: 1px solid ${({ theme }) => theme.btnToolBrdHover ? theme.btnToolBrdHover :  "#417cb9"} !important;
        color:${({ theme }) => theme.btnClrToolBarHover ? theme.btnClrToolBarHover : "#417cb9"} !important;
    
    };
    [title]:hover{
        background-color: 'black';
        color:'white';
    }

`;

export const BtnBar = ({ iconCls, onClick, href, className, children, title }) => {
    return (
        <Btn className={className} onClick={onClick ? () => onClick() : null} href={href ? href : null} title={title}><i className={iconCls}></i>{children}</Btn>
    );
}

//export default BtnBar;