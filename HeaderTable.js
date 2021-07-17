import React, { useRef } from 'react';
import Styled from 'styled-components';
import { ColumnHeader } from './ColumnHeader';

//let headerEl = useRef(null);

const Header = Styled.div`
    display: inline-block;
    width: ${({ myWidth }) => myWidth + "px"};
`

const HeaderContainer = Styled.div`
    height: 38px;
    background-color: white;
    border-bottom: 2px solid #e1e1e1;
    overflow: hidden;
    cursor: default;
`


export const HeaderTable = ({ columns = [], myWidth=100 }) => {

    return (
        <HeaderContainer>
            <Header myWidth={myWidth}>
                {
                    columns ?
                        (
                            columns.map((c, index) => {
                                return (<ColumnHeader key={index} width={c.width} text={c.text} align={c.align} />);
                            })
                        ) : null
                }
            </Header>
        </HeaderContainer>
    );
}
