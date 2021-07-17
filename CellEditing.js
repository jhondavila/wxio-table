import React from 'react';

import { Col, Row, Container, Image, Button, Form, Tabs, Tab, Table } from "react-bootstrap"


const CellEditting = ({ editing, row, property, record, onConfirm }) => {

        return (
        <td>
            {
                editing ?
                    <input type="text" class="form-control" value={record.get(property)} onBlur={onConfirm} onKeyUp={(e) => {
                        debugger
                        console.log(e)
                    }} />
                    :
                    record ? record.get(property) : ""
            }
        </td>
    );
}

export {
    CellEditting
}