import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import moment from 'moment';
import { format as numberFormat } from "./number/index"

import { TextEditor, IntegerEditor, DatetimeEditor } from "./editors"

// import React, { useState, useEffect, useRef } from 'react';
import { Overlay, Tooltip } from "react-bootstrap"
import * as _ from "lodash"
import Path from "../util/Path"


const mapEditors = {
	text: TextEditor,
	int: IntegerEditor,
	integer: IntegerEditor,
	datetime: DatetimeEditor
};
export class Column extends React.Component {

	render() {

		let { width = 200, value, type, onCancelEdit, format, dataIndex, editing, editingErrors, colIndex, rowIndex, align = "left", onConfirm, onDoubleClick, render, col, table, record, hidden = false } = this.props;


		let errors = dataIndex && record._validationErrors ? Path.getValue(dataIndex, record._validationErrors) : null;

		let messageError = errors ?
			col.editorMessage ?
				col.editorMessage({ errors }) :
				_.uniq(errors.map(i => {
					return `${i.message}`.replaceAll(dataIndex, col.text);
				})).join("\n")
			: null;


		// let isError = errors ? true : false;


		if (!hidden) {
			if (render) {
				if (col.editor && editing && editing.mode == "cell" && editing.dataIndex == dataIndex) {
					return (
						<div className="col col-mytable mx-0 px-0" style={{ width: `${width}px` }} onDoubleClick={onDoubleClick}>
							{
								col.editor({ value, dataIndex, col, table, record, rowIndex, colIndex, editing, onConfirm, onCancelEdit })
							}
						</div>
					)
				} else {
					return (
						<div
							onDoubleClick={onDoubleClick}
							className={`col ${errors && "cell-error"} col-mytable mx-0 px-0`} style={{ width: `${width}px` }}>
							<div className={"inner-cell p-3 p-sm-3 p-md-3 p-lg-2"}>
								{render({ value, dataIndex, col, table, record, rowIndex, colIndex })}
							</div>
						</div>
					);
				}
			} else if (col.editor && editing && editing.mode == "row") {
				// debugger
				let EditorCmp = mapEditors[col.editor] || mapEditors["text"];
				return (
					<div className="col col-mytable mx-0 px-0" style={{ width: `${width}px` }}>
						<EditorCmp
							onConfirm={onConfirm}
							onCancelEdit={onCancelEdit}
							dataIndex={dataIndex}
							value={value}
							record={record}
							col={col}
							table={table}
							autoFocus={editing.dataIndex == dataIndex}
							editingErrors={editingErrors}
							editing={editing}
							errors={errors}
						/>
					</div>
				)
			} else if (col.editor && editing && editing.mode == "cell" && editing.dataIndex == dataIndex) {
				let EditorCmp = mapEditors[col.editor] || mapEditors["text"];
				return (
					<div className="col col-mytable mx-0 px-0" style={{ width: `${width}px` }}>
						<EditorCmp
							onConfirm={onConfirm}
							onCancelEdit={onCancelEdit}
							dataIndex={dataIndex}
							value={value}
							record={record}
							col={col}
							table={table}
							autoFocus={true}
							editing={editing}
							editingErrors={editingErrors}
							errors={errors}
						// onBlur={(e) => {
						// 	onConfirm({ dataIndex, value: internalValue, record, col, table, e })
						// }}
						/>
					</div>
				)
			} else {
				if (type == "number") {
					format = format || "#,###.00";
					value = numberFormat(format, value);
				} else if (type == "date") {
					format = format || "DD/MM/YYYY";
					value = (moment(value).format(format));
				} else {
					value = String(value);
				}


				return (
					<div
						ref={c => this.cell = c}
						onMouseEnter={() => {
							if (errors) {
								this.setState({
									show: true
								})
							}
						}}
						onMouseLeave={() => {
							if (errors || (!errors && this.state && this.state.show)) {
								this.setState({
									show: false
								})
							}
						}}
						onDoubleClick={onDoubleClick}
						className={`col ${errors && "cell-error"} col-mytable mx-0 px-0 ${col.editor && "col-editable"}`} style={{ width: `${width}px` }}>
						<div className={"inner-cell p-3 p-sm-3 p-md-3 p-lg-2"}>
							<div className={`text-${align} text-ellipsis`} >
								{value ? value : <>&nbsp;</>}
							</div>
						</div>
						{
							errors && <Overlay target={this.cell} show={this.state && this.state.show} placement="bottom">
								{(props) => (
									<Tooltip className={"my-table-tooltip my-table-tooltip-error"} {...props}>
										{messageError}
									</Tooltip>
								)}
							</Overlay>
						}
					</div>

				);
			}

		}
	}
}