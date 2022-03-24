import React from 'react';
import { Column, CheckColumn } from './';
import Styled from 'styled-components';

const row = Styled.div

export const Row = React.forwardRef((props, ref) => {
    let { columns, data, onClick, onDoubleClick, selected, selectable, onChecked, editing, editingErrors, onConfirm, onCancelEdit, dataLength, index, appendRow, onCellDoubleClick, table, disabledChangeIndicator=false } = props;
    if (Array.isArray(columns)) {
        return (
            <div ref={ref} className={`row-body ${data._isValid === false && "row-invalid"} ${!disabledChangeIndicator && data.phantom ? "row-body-phantom" : "" } ${selected && "selected"}`} onClick={onClick} onDoubleClick={onDoubleClick}>

                {
                    !disabledChangeIndicator && data.phantom ? <div className={"arrow-corner"}></div> : null
                }

                {
                    selectable ?
                        <CheckColumn data={data} width={50} align={"center"} checked={selected} onChecked={onChecked} />
                        : null
                }
                {
                    columns.map((col, colIndex) => {
                        let key = col.id;
                        return (<Column
                            key={key}
                            type={col.type}
                            format={col.format}
                            value={data.get ? data.get(col.dataIndex) || "" : data[col.dataIndex]}
                            dataIndex={col.dataIndex}
                            width={col.width}
                            align={col.align}
                            render={col.render}
                            col={col}
                            table={table}
                            record={data}
                            colIndex={colIndex}
                            rowIndex={index}
                            editing={editing}
                            editingErrors={editingErrors}
                            onConfirm={onConfirm}
                            onCancelEdit={onCancelEdit}
                            onDoubleClick={(e) => {
                                onCellDoubleClick({
                                    e,
                                    value: data.get ? data.get(col.dataIndex) || "" : data[col.dataIndex],
                                    dataIndex: col.dataIndex,
                                    table: table,
                                    record: data,
                                    rowIndex: index,
                                    colIndex,
                                    col
                                })
                            }
                            }
                        />)
                    })
                }
                {
                    appendRow && appendRow({ data, columns, index, dataLength, selected, selected })
                    // (dataLength == index && appendRow) && customAddRow
                }
            </div>
        );
    } else {
        return <div></div>;
    }
}

    // <button ref={ref} className="FancyButton">
    //     {props.children}
    // </button>
);
