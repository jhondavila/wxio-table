import DateTimePicker from 'react-datetime-picker'
import React, { useState, useEffect, useRef } from 'react';
import { Overlay, Tooltip } from "react-bootstrap"
import moment from "moment";
const DatetimeEditor = (props) => {
    let { onConfirm, onCancelEdit, dataIndex, value, record, col, table, errors, autoFocus, editing, editingErrors } = props;
    value = value && value instanceof moment ? value.toDate() : value;
    let [internalValue, setInternalValue] = useState(value);
    let [calendarStatus, setCalendarStatus] = useState(false);
    // let errors = editingErrors ? editingErrors[dataIndex] : null;
    const [show, setShow] = useState(false);
    const target = useRef(null);

    const picker = useRef(null);

    return (
        <>
            <DateTimePicker
                ref={picker}
                className={`${errors && "is-invalid"} form-control form-control-sm`}

                format={"dd/MM/y h:mm"}
                autoFocus={autoFocus}
                calendarIcon={false}
                // clearIcon={false}
                disableCalendar={true}
                disableClock={true}
                onCalendarClose={() => {
                    setCalendarStatus(false);
                }}
                onCalendarOpen={() => {
                    setCalendarStatus(true);
                }}
                // onClick={()=>{
                //     // console.log("onClick")

                // }}
                onBlur={(e) => {
                    e.persist()
                    let container = picker.current.wrapper;
                    if (container.contains(e.relatedTarget)) {

                    } else {
                        if (editing.mode == "cell") {
                            onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                        } else if (editing.mode == "row") {
                            if (e.relatedTarget && e.relatedTarget.nodeName.toLowerCase() == "input") {
                                onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing, isTab: true })
                            } else {
                                onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                            }
                        }
                    }
                }}
                onMouseEnter={() => {
                    if (errors) {
                        setShow(true);
                    }
                }}
                onMouseLeave={() => {
                    setShow(false);
                }}
                onKeyUp={(e) => {
                    if (e.keyCode == 27) {
                        onCancelEdit({ dataIndex, record, col, table, e, editing })
                    }
                    if (e.keyCode == 13 && onConfirm) {
                        onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                    }
                }}
                onChange={value => {
                    setInternalValue(value)
                }}
                value={internalValue}
            />


            <Overlay target={target.current} show={show} placement="bottom">
                {(props) => (
                    <Tooltip className={"my-table-tooltip my-table-tooltip-error"} {...props}>
                        {
                            errors ?
                                col.editorMessage ?
                                    col.editorMessage({ errors }) :
                                    errors.map(i => {
                                        return i.message
                                    }).join("\n")
                                : null
                        }
                    </Tooltip>

                )}
            </Overlay>

        </>

    )
}
export {
    DatetimeEditor
}