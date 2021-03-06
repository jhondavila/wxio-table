import React, { useState, useEffect, useRef } from 'react';
import { Overlay, Tooltip } from "react-bootstrap"
const IntegerEditor = (props) => {
    let { onConfirm, onCancelEdit, dataIndex, value, record, col, table,errors, autoFocus, editing, editingErrors } = props;
    let [internalValue, setInternalValue] = useState(value);
    // let errors = editingErrors ? editingErrors[dataIndex] : null;

    const [show, setShow] = useState(false);
    const target = useRef(null);

    return (
        <>
            <input
                value={internalValue}
                ref={target}
                onChange={(e) => {
                    console.log(e.target.value)
                    setInternalValue(e.target.value)
                }}
                autoFocus={autoFocus}
                type="number"
                // name="num"
                // min="1"
                // step="1"
                pattern="[0-9]"
                onInput={function () {
                    target.current.value = (parseInt(target.current.value) || "")
                    internalValue = (parseInt(target.current.value) || "");
                }}
                className={`${errors && "is-invalid"} form-control form-control-sm`}
                onBlur={(e) => {
                    e.preventDefault();
                    if (editing.mode == "cell") {
                        onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                    } else if (editing.mode == "row") {
                        if (e.relatedTarget && e.relatedTarget.nodeName.toLowerCase() == "input") {
                            onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing, isTab: true })
                        } else {
                            onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
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
                onKeyPress={(e) => {
                    console.log({ dataIndex, value: internalValue })
                }}
                onKeyUp={(e) => {
                    console.log(e.keyCode);
                    // if (e.keyCode == 9) {
                    //     e.stopPropagation();
                    //     onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing, isTab: true })
                    // }
                    if (e.keyCode == 27) {
                        // e.stopPropagation();
                        onCancelEdit({ dataIndex, record, col, table, e, editing })
                    }
                    if (e.keyCode == 13 && onConfirm) {
                        onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                    }
                }} />

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
    IntegerEditor
}