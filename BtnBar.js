import React from 'react';
import CmpStyle from 'styled-components';

const Btn = CmpStyle.a`
    background-color: ${({ theme }) => theme.btnBgToolBar};
    border: 1px solid ${({ theme }) => theme.btnBrdToolBar};
    text-decoration: none;
    margin-right: 5px;
    width: 45px;
    padding: 6px 10px;
    color: ${({ theme }) => theme.btnClrToolBar};
    :hover{
     color:${({ theme }) => theme.btnClrToolBarHover};
    }
`;

export const BtnBar = ({ iconCls, onClick, href, className }) => {
    return (
        <Btn className={className} onClick={onClick ? () => onClick() : null} href={href ? href : null}><i className={iconCls}></i></Btn>
    );
}

//export default BtnBar;