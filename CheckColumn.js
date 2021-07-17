import React, {useState, useEffect} from 'react';
import Styled from 'styled-components';
import moment from 'moment';
import {FormCheck} from "react-bootstrap"

const Col = Styled.div`
    display: inline-block;
    margin: 10px;
    width: ${({width})=>width+"px"};
    cursor:"pointer"
`

const Text = Styled.div`
    white-space: nowrap;
    overflow   : hidden;
    text-align : ${({align})=>align};
    text-overflow: ellipsis;
    flex: 1
`

export const CheckColumn = ({width=50, text, format = "string", dataIndex, align="left" , checked , onChecked,data}) => {
        
    return ( 
        <Col className="col" width={width} onClick={(e)=>{
            e.stopPropagation();
            onChecked(!checked,data)
        }}>
            <Text align={align}>
                <input type="checkbox" checked={checked} onChange={(e)=>{e.stopPropagation()}}>
                </input>
            </Text>            
        </Col>
    );
}

//onChecked(e.target.value,data)
//={rt deft Col;