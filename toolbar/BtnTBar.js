import React from 'react';
import { Dropdown } from "react-bootstrap";
import './BtnTBar.scss';


export const BtnTBar = ({ iconCls, menu=[], href, className, children, title }) => {
  return (
    <>
      <Dropdown >
        <Dropdown.Toggle className="btn-toogle-bar" >
          <i className={iconCls}></i>
        </Dropdown.Toggle>
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