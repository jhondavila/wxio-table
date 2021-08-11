import React, { useState, useEffect, useRef } from 'react';
import { Overlay, Tooltip } from "react-bootstrap";
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';



const mapEditors = {
    select: Select,
    creatable: Creatable
    // text: TextEditor,
    // int: IntegerEditor,
    // integer: IntegerEditor,
    // datetime: DatetimeEditor,
    // combobox: ComboboxEditor
};

class ComboboxEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            menuOpen: false,
            isLoading: false,
            // creating: false,
            options: [],
            internalValue: this.props.value
        };
        this.timeoutBlur = null;
        this.timeoutKeyPress = null;
        this.creating = false;
        this.target = React.createRef();
    }

    componentDidMount() {
        let { store } = this.props;

        if (store) {
            this.updateOptions();

            store.on("load", this.updateOptions);
            store.on("add", this.updateOptions);
            store.on("update", this.updateOptions);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.store !== this.props.store) {
            this.updateOptions();
        }
    }
    updateOptions = () => {
        let { store, displayField, valueField } = this.props;

        let items = store.map(i => {
            return {
                value: i[valueField],
                label: i[displayField]
            }
        });
        this.setState({
            options: items
        })
    }
    setIsLoading(value) {
        this.setState({
            isLoading: value
        })
    }
    setValue(value, options = {}) {
        this.setState({
            internalValue: value
        })
    }
    render() {

        let { onConfirm, onCancelEdit, dataIndex, value, record, col, table, errors, autoFocus, editing, editingErrors, store, displayField, valueField, placeholder, creatable, onCreateOption, isValidNewOption } = this.props;

        let {
            show,
            menuOpen,
            isLoading,
            creating,
            options,
            internalValue,
        } = this.state;


        const EditorCmp = creatable ? mapEditors["creatable"] : mapEditors["select"];
        console.log("rendercombobox")

        return (
            <>
                <EditorCmp
                    ref={this.target}
                    value={options.find(i => i.value == internalValue)}
                    onChange={(item, e) => {
                        this.setState({
                            internalValue: item.value
                        })
                    }}
                    options={options}
                    allowCreateWhileLoading={true}

                    placeholder={placeholder}
                    ignoreCase={true}
                    ignoreAccents={true}
                    matchFrom={'any'}
                    autoFocus={autoFocus}
                    // menuIsOpen={true}


                    isDisabled={isLoading}
                    isLoading={isLoading}
                    isValidNewOption={isValidNewOption}


                    onCreateOption={async (inputValue) => {
                        if (this.timeoutBlur) {
                            clearTimeout(this.timeoutBlur)
                            this.timeoutBlur = null;
                        }
                        if (this.timeoutKeyPress) {
                            clearTimeout(this.timeoutKeyPress)
                            this.timeoutKeyPress = null;
                        }
                        this.creating = true;
                        await onCreateOption({

                            inputValue,
                            setLoading: this.setIsLoading.bind(this),
                            setValue: this.setValue.bind(this),


                        });
                        this.creating = false;
                    }}


                    innerProps={
                        {
                            onMouseEnter: () => {
                                console.log("onMouseEnter")
                                if (errors) {
                                    this.setState({
                                        show: true
                                    })
                                }
                            },
                            onMouseLeave: () => {
                                console.log("onMouseLeave")
                                this.setState({
                                    show: false
                                })
                            }
                        }
                    }
                    className={`${errors && "is-invalid"} form-control form-control-sm form-control-combobox-fix`}
                    onMenuOpen={() => this.setState({ menuOpen: true })}
                    onMenuClose={() => this.setState({ menuOpen: false })}
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
                        console.log("onBlur")

                        if (this.creating) {
                            return;
                        }

                        let relatedTarget = e.relatedTarget;
                        let relatedTargetType = e.relatedTarget && e.relatedTarget.nodeName.toLowerCase() ? e.relatedTarget.nodeName.toLowerCase() : null
                        let timeout = setTimeout(() => {
                            if (editing.mode == "cell") {
                                onConfirm({ dataIndex, value: internalValue, record, col, table, editing })
                            } else if (editing.mode == "row") {
                                // console.log(e.relatedTarget)
                                if (relatedTarget && relatedTargetType == "input") {
                                    onConfirm({ dataIndex, value: internalValue, record, col, table, editing, isTab: true })
                                } else {
                                    onConfirm({ dataIndex, value: internalValue, record, col, table, editing })
                                }
                            }
                            this.timeoutBlur = null;
                        }, 30);
                        this.timeoutBlur = timeout;
                    }}
                    onKeyDown={(e) => {
                        console.log("onKeyDown")
                        let keyCode = e.keyCode;
                        let timeout = setTimeout(() => {
                            if (keyCode == 27) {
                                onCancelEdit({ dataIndex, record, col, table, editing });
                            }
                            if (keyCode == 13 && onConfirm) {
                                if (!menuOpen) {
                                    onConfirm({ dataIndex, value: internalValue, record, col, table, editing })
                                }
                            }
                            this.timeoutKeyPress = null

                        }, 30)
                        this.timeoutKeyPress = timeout


                    }}
                />
                <Overlay target={this.target.current} show={show} placement="bottom">
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
}
export {
    ComboboxEditor
}