import React, { useState, useEffect, useRef } from 'react';
import { Overlay, Tooltip } from "react-bootstrap";
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';

const ComboboxEditor = (props) => {
    let { onConfirm, onCancelEdit, dataIndex, value, record, col, table, errors, autoFocus, editing, editingErrors, store, displayField, valueField,placeholder } = props;
    let [internalValue, setInternalValue] = useState(value);

    // let errors = editingErrors ? editingErrors[dataIndex] : null;

    const [show, setShow] = useState(true);

    const [menuOpen, setMenuOpen] = useState(false);


    const [options, setOptions] = useState([]);

    const target = useRef(null);

    const updateOptions = () => {
        let items = store.map(i => {
            return {
                value: i[valueField],
                label: i[displayField]
            }
        });
        setOptions(items);
    }

    const debug = false;
    useEffect(() => {
        updateOptions();
        if (store) {
            store.on("load", updateOptions);
            store.on("add", updateOptions);
            store.on("update", updateOptions);
        }
    }, [])

    return (
        <>
            <Select
                ref={target}
                value={options.find(i => i.value == internalValue)}
                onChange={(item, e) => {
                    setInternalValue(item.value);
                }}
                options={options}
                allowCreateWhileLoading={true}

                placeholder={placeholder}
                ignoreCase={true}
                ignoreAccents={true}
                matchFrom={'any'}
                autoFocus={autoFocus}
                // menuIsOpen={true}
                innerProps={
                    {
                        onMouseEnter: () => {
                            console.log("onMouseEnter")
                            if (errors) {
                                setShow(true);
                            }
                        },
                        onMouseLeave: () => {
                            console.log("onMouseLeave")
                            setShow(false);
                        }
                    }
                }
                className={`${errors && "is-invalid"} form-control form-control-sm form-control-combobox-fix`}
                onMenuOpen={() => setMenuOpen(true)}
                onMenuClose={() => setMenuOpen(false)}
                menuPosition={"fixed"}
                styles={{
                    menu: (provided, state) => {
                        return {
                            ...provided
                        };
                    }
                }}
                onBlur={(e) => {
                    e.preventDefault();
                    if(debug){
                        return;
                    }
                    if (editing.mode == "cell") {
                        onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                    } else if (editing.mode == "row") {
                        console.log(e.relatedTarget)
                        if (e.relatedTarget && e.relatedTarget.nodeName.toLowerCase() == "input") {
                            onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing, isTab: true })
                        } else {
                            onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                        }
                    }
                }}
                onKeyDown={(e) => {
                    if (e.keyCode == 27) {
                        onCancelEdit({ dataIndex, record, col, table, e, editing });
                    }
                    if (e.keyCode == 13 && onConfirm) {
                        if (!menuOpen) {
                            onConfirm({ dataIndex, value: internalValue, record, col, table, e, editing })
                        }
                    }
                }}
            />
            <Overlay target={target.current} show={show} placement="bottom">
                {(props) => (
                    <Tooltip className={"my-table-tooltip my-table-tooltip-error"} {...props}>
                        {





                        }
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
    ComboboxEditor
}