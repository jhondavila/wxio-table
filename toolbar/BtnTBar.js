import React from 'react';
import { Dropdown, ButtonGroup, Button  } from "react-bootstrap";
import './BtnTBar.scss';


export const BtnTBar = ({ iconCls, menu=[], href, className, children, title }) => {
  return (
    <>
      <Dropdown as={ButtonGroup} className={'drpgrp'}>
        <Button ><i className={iconCls}></i></Button>
        
        <Dropdown.Toggle split id="dropdown-split-basic"/>
        
        <Dropdown.Menu>
          {
            menu.map((item, index)=>{
              return (<Dropdown.Item key={index} onClick={item.action}>{item.title}</Dropdown.Item>)
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}