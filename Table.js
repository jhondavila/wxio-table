import React from 'react';
import { ColumnHeader, HeaderTable, Row, Pagin, CheckColumn } from './';
// import { Loading } from '../';
import Menu from "../menu/index";

import { Row as RowB } from 'react-bootstrap';
import "./Style.scss";

import {
	Exporter
} from "../exporter/Exporter";

import equal from "fast-deep-equal";
import Path from "../util/Path"

let colCountId = 0;
class Table extends React.Component {
	constructor(opts) {
		super(opts);

		this.state = {
			myData: [],
			selection: {},
			loadingData: true,
			tblColumns: [],
			widthTable: "",
			widthHeader: "",
			checkedAll: false,
			editing: null,
			editingErrors: null,

		}
		window.mytable = this;

		this._nodes = new Map();
	}

	scrollEnd() {
		this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
	}
	crearColumnas() {
		let newWidth = 0;
		let tableColums = [];
		let cols = this.props.columns ? this.props.columns : this.props.children;
		cols = cols || [];


		cols = cols.filter(i => i.hidden !== true);

		if (this.props.selectionMode == "multiple") {
			//console.log("Hola");
			newWidth = newWidth + 100;
		}

		cols.map((col) => {
			let width = col.props ? parseInt(col.props.width) : parseInt(col.width);
			newWidth = newWidth + width;

			let addColl = col.props ? col.props : col;
			tableColums.push(addColl);
			if (!col.dataIndex) {
				colCountId++;
				col.id = `col-${colCountId}`
			} else {
				col.id = col.dataIndex;
			}
		})
		this.setState({
			tblColumns: tableColums,
			widthTable: newWidth + 1,
			widthHeader: newWidth + 1
		}, () => {
			this.fixSizeScroll();
		});


	}
	addHooks(store) {
		store.on("add", this.onAddStore);
		store.on("loading", this.onLoadingStore);
		store.on("remove", this.onRemoveStore);
	}
	removeHooks(store) {
		store.removeListener("add", this.onAddStore);
		store.removeListener("loading", this.onLoadingStore);
		store.removeListener("remove", this.onLoadingStore);
	}
	onRemoveStore = (store) => {
		this.setState({
			myData: store.data
		});
	}
	onAddStore = (store) => {
		this.setState({
			myData: store.data
		});
	}
	onLoadingStore = (store, loading) => {
		this.setState({
			myData: store.data
		});

		if (this.bodyEl) {
			this.bodyEl.scrollTop = 0;
		}
		this.setState({
			loadingData: loading,
			order: store && store.sorters ? store.sorters[0] : null
		});
	}
	componentWillUnmount() {
		if (this.props.store) {
			this.removeHooks(this.props.store);
		}
	}
	async componentDidUpdate(prevProps) {
		if (prevProps.store !== this.props.store) {
			if (this.props.store) {
				this.addHooks(this.props.store)
				let data = await this.props.store.getData();
				this.setState({
					myData: data,
				});
			} else if (prevProps.store) {
				this.removeHooks(prevProps.store);
			}
		}
		if (prevProps.columns !== this.props.columns) {
			this.crearColumnas();
		}
		if (equal(prevProps.staticFilters, this.props.staticFilters) == false) {
			console.log(prevProps.staticFilters, this.props.staticFilters);

			this.props.store.setStaticFilters(this.props.staticFilters)
			this.props.store.load();
		}

	}
	async componentDidMount() {
		this.crearColumnas();
		// this.headerMenu = new Menu();
		// console.log(this.headerMenu)

		if (this.props.store) {
			this.addHooks(this.props.store);
			// console.log()
			if (this.props.store.modelParent && this.props.store.modelParent.phantom) {
				this.setState({
					myData: [],
					loadingData: false
				});
			} else {
				if (this.props.staticFilters) {
					this.props.store.setStaticFilters(this.props.staticFilters)
				}
				if (this.props.autoLoad) {
					await this.props.store.load();
				} else {
					let data = await this.props.store.getData();
					this.setState({
						myData: data,
						loadingData: false
					});
				}
			}
			let data = await this.props.store.getData();
			// console.log(data);


		} else if (this.props.data) {
			this.setState({
				myData: this.props.data,
				loadingData: false
			});
		} else {
			this.setState({
				myData: [],
				loadingData: false
			})
		}
	}

	onScroll = (...args) => {
		let lBodyScroll = this.bodyEl.scrollLeft;
		let lHeaderScroll = this.headerEl.scrollLeft;

		this.fixSizeScroll();
		if (lBodyScroll !== lHeaderScroll) {
			this.headerEl.scrollLeft = lBodyScroll
		}

	}

	fixSizeScroll(callback) {

		let scrollbarWidth = (this.bodyEl.offsetWidth - this.bodyEl.clientWidth);

		if (this.state.widthTable + scrollbarWidth !== this.state.widthHeader) {
			this.setState({
				widthHeader: this.state.widthTable + scrollbarWidth
			}, () => {
				if (callback) {
					callback();
				}
			});
		}
	}

	selectionModel = (e, row) => {
		if (this.props.onClickRow) {
			this.props.onClickRow(row);
		}
		if (this.props.selectionMode === "multiple") {
			this.setState({
				checkedAll: false,
				selection: {
					[row.getId()]: true
				}
			}, () => {
				this.selectionChange()
			});
		} else {
			if (!this.state.selection[row.getId()]) {
				this.setState({
					checkedAll: false,
					selection: {
						[row.getId()]: true
					}
				}, () => {
					this.selectionChange()
				});
			}
		}
	}
	selectionChange() {
		if (this.props.onSelectionChange) {
			let selection = [];
			if (this.state.checkedAll) {
				selection.push(...this.props.store.data);
			} else {
				for (let p in this.state.selection) {
					let record = this.props.store.getById(p);
					selection.push(record);
				}
			}
			this.props.onSelectionChange(selection)
		}
	}
	onDblClickRow(row) {
		console.log("onDblClickRow")
		if (this.props.onDblClickRow) {
			this.props.onDblClickRow(row);
		}
	}

	sort = async (dataIndex, direction) => {
		let sorters = this.props.store.sorters;
		if (!direction) {
			let find = sorters.find(i => i.property = dataIndex);
			// let direction = "ASC";
			direction = "ASC";
			if (find) {
				if (find.direction == "DESC") {
					direction = "ASC";
				} else {
					direction = "DESC";
				}
			}
		}

		this.props.store.setSorters([{
			property: dataIndex,
			direction: direction
		}]);

		if (this.props.store.remoteSorters) {
			await this.props.store.load();
		}

		this.setState({
			myData: this.props.store.data,
			order: this.props.store.sorters[0]
		})

	}
	onChecked = (value, data) => {
		console.log(value)
		if (data) {
			//console.log(data)
			if (value) {
				this.setState({
					selection: {
						...this.state.selection,
						[data.getId()]: true
					}
				}, () => {
					this.selectionChange()
				});

			} else {
				let selection = Object.assign({}, this.state.selection);

				if (this.state.checkedAll) {

					for (let p in this.props.store.mapping) {
						selection[p] = true;
					}
				}
				delete selection[data.getId()];
				this.setState({
					checkedAll: false,
					selection: selection
				}, () => {
					this.selectionChange()
				});

			}

		}

	}
	onCheckedAll(value) {
		this.setState({
			checkedAll: value,
			selection: {}
		}, () => {
			this.selectionChange();
		});
	}
	showMenuColumn(e, column) {
		this.columnMenu = column;
		this.menu.show(e);

	}
	sortAsc() {
		let column = this.columnMenu;
		this.sort(column.dataIndex, "ASC")
		// console.log("sortAsc", )
	}
	sortDesc() {
		let column = this.columnMenu;
		this.sort(column.dataIndex, "DESC")
		// console.log("sortDesc", this.columnMenu)
	}
	resizeColumnDrag(column, data, colClientRect) {
		let clientRect = this.headerEl.getBoundingClientRect();
		let headerXPos = data.x;
		// console.log(clientRect)
		this.setState({
			resizerColPos: colClientRect.x - clientRect.x + headerXPos
		});
	}
	resizeColumnStart(column, data, colClientRect) {
		console.log(data)
		// console.log({dom :this.headerEl})
		let clientRect = this.headerEl.getBoundingClientRect();
		let headerXPos = data.x;
		// console.log(clientRect)

		this.setState({
			resizerColPos: colClientRect.x - clientRect.x + headerXPos
		});
	}

	export(opts = {}) {
		this.exporter.exportXLS(opts);
	}
	onResizeColumnEnd(column, width) {
		// console.log(column,column.width)
		column.width = width;
		let newWidth = 0;
		let cols = this.state.tblColumns;
		// this.setState({

		// });

		// let tableColums = [];
		// let cols = this.props.columns ? this.props.columns : this.props.children;

		if (this.props.selectionMode == "multiple") {
			//console.log("Hola");
			newWidth = newWidth + 100;
		}

		cols.map((col) => {
			let width = col.props ? parseInt(col.props.width) : parseInt(col.width);
			newWidth = newWidth + width;
			// let addColl = col.props ? col.props : col;
			// tableColums.push(addColl);
		})
		this.setState({
			// tblColumns: tableColums,
			widthTable: newWidth + 1,
			widthHeader: newWidth + 1,
			tblColumns: this.state.tblColumns,
			resizerColPos: -1000
		}, () => {
			this.fixSizeScroll();
		});
	}

	onCellDoubleClick(params) {
		if (this.props.onCellDoubleClick) {
			this.props.onCellDoubleClick();
		}

		if (this.props.clicksToEdit == 2) {
			this.startEdit({
				record: params.record,
				dataIndex: params.dataIndex
			})
		}

	}
	async startEdit({ record, dataIndex, mode }) {
		// console.log(this.state.editing)
		record = Array.isArray(record) && record.length == 1 ? record[0] : record;
		if (this.props.onBeforeEdit && await this.props.onBeforeEdit({ record, dataIndex, mode, currentEditing: this.state.editing, grid: this }) === false) {
			return;
		}


		if (this.state.editing) {
			let record = this.state.editing.record;
			await record.clearInvalidFields();
		}
		record = Array.isArray(record) ? record[0] : record;
		let editing = {
			mode: mode || this.props.editMode,
			record: record,
			dataIndex
		};

		this.setState({
			editing,
			editingErrors: null
		});
	}
	onCancelEdit = async ({ e, record, col, dataIndex }) => {
		let validation = await record.getValidation();


		let keys = Object.keys(validation);
		for (let x = 0; x < keys.length; x++) {
			record.set(keys[x], null);
		}
		this.setState({
			editing: null,
			editingErrors: null
		});
	}
	onConfirm = async ({ e, record, col, dataIndex, value, isTab }) => {
		let oldValue = record.get(dataIndex);
		let changes = {};
		Path.setValue(changes, value, dataIndex);
		record.set(changes);
		let validation = await record.getValidation({
			store: this.props.store
		});

		let keys = Object.keys(validation);
		if (this.state.editing) {
			if (this.state.editing.mode == "row") {
				let include = false;
				// let columns = 
				for (let x = 0; x < this.state.tblColumns.length; x++) {
					let i = this.state.tblColumns[x];
					if (i.dataIndex) {
						let val = Path.getValue(i.dataIndex, validation);
						if (val) {
							include = true;
							break;
						}
					}
				}

				if (isTab) {
					this.setState({
						editingErrors: validation
					});
					this.onEditConfirm({ oldValue, value, record, dataIndex, e })
				} else if (!include) {
					this.setState({
						editing: null,
						editingErrors: null
					});
					this.onEditConfirm({ oldValue, value, record, dataIndex, e })
				} else {
					this.setState({
						editingErrors: validation
					});
				}
			} else if (this.state.editing.mode == "cell") {
				if (Path.getValue(col.dataIndex, validation)) {
					this.setState({
						editingErrors: validation
					});
				} else {
					this.setState({
						editing: null,
						editingErrors: null
					});
					this.onEditConfirm({ oldValue, value, record, dataIndex, e })
				}
			}
		}
		// }
	}
	onEditConfirm(params) {
		if (this.props.onEdit) {
			this.props.onEdit(params)
		}
	}
	render() {
		return (
			<div className="table flex-fill">
				<Exporter columns={this.state.tblColumns} store={this.props.store} ref={c => this.exporter = c}></Exporter>
				<Menu ref={c => this.menu = c} >
					<RowB className="wx-item" onClick={this.sortAsc.bind(this)}>
						<div className="wx-item-icon">
							<i className="fas fa-sort-alpha-up"></i>
						</div>
						Orden Ascendente
					</RowB>
					<RowB className="wx-item" onClick={this.sortDesc.bind(this)}>
						<div className="wx-item-icon">
							<i className="fas fa-sort-alpha-down-alt"></i>
						</div>
						Orden Descendente
					</RowB>
				</Menu>

				<div className="mytable flex-fill" style={this.props.toolPage && this.props.store ? { height: "calc(100% - 45px)" } : null} >
					<div className="wx-table-resizer" style={{ left: this.state.resizerColPos }}></div>
					<div className="theader" ref={c => { this.headerEl = c }}>
						<div style={{ width: this.state.widthHeader + 'px' }}>
							{
								//<ColumnHeader />

								this.props.selectionMode === "multiple" ? (
									<CheckColumn width={50} text={""}

										onChecked={this.onCheckedAll.bind(this)}
										checked={this.state.checkedAll}

									/>
								) : null

							}
							{
								this.state.tblColumns ?
									(
										this.state.tblColumns.map((c, index) => {
											return (<ColumnHeader
												key={index}
												width={c.width}
												text={c.text}
												dataIndex={c.dataIndex}
												align={c.align}
												headerAlign={c.headerAlign}
												onOrder={this.sort}
												order={this.state.order}
												colMenu={this.showMenuColumn.bind(this)}
												resizeColumnEnd={this.onResizeColumnEnd.bind(this)}
												resizeColumnStart={this.resizeColumnStart.bind(this)}
												resizeColumnDrag={this.resizeColumnDrag.bind(this)}
												config={c}
											/>);
										})
									) : null
							}
						</div>

					</div>
					<div className="tbody flex-fill" onScroll={this.onScroll} ref={(c) => { this.bodyEl = c }}>
						{/* {this.state.loadingData ? <Loading height={this.props.toolPage && this.props.store ? "calc(100% - 38px)" : null} mensaje="Cargando datos...!!!" /> : null} */}
						<div className="tbodycapa flex-column" style={{ width: this.state.widthTable + 'px' }}>
							{typeof (this.state.myData) == 'undefined' || this.state.myData.length > 0 ? null : <div style={{ display: 'inline-block', width: this.state.widthTable + 'px', height: '0px !importan' }}></div>}
							{
								this.state.myData ? this.state.myData.map((row, index) => {

									let key = row._isModel ? row.getId() : row[this.props.keyId];
									let ref = React.createRef();
									this._nodes.set(row, ref)

									return (
										<Row
											ref={ref}
											key={key}
											index={index}
											appendRow={this.props.appendRow}
											dataLength={this.state.myData.length}
											editing={(this.state.editing && this.state.editing.record == row) && this.state.editing}
											editingErrors={(this.state.editing && this.state.editing.record == row) && this.state.editingErrors}

											onConfirm={this.onConfirm}
											onCancelEdit={this.onCancelEdit}
											columns={this.state.tblColumns}
											selected={this.state.selection[row.getId()] || this.state.checkedAll ? true : false}
											onChecked={this.onChecked}
											data={row}
											table={this}
											selectable={this.props.selectionMode === "multiple" ? true : false}
											onClick={(e) => {
												this.selectionModel(e, row)
											}}
											onDoubleClick={this.onDblClickRow.bind(this, row)}
											onCellDoubleClick={this.onCellDoubleClick.bind(this)}
										/>
									)
								}) : null
							}

							<div className={`row-body `}>
								{
									this.props.buttonAddRow && this.state.tblColumns.map((col, colIdx) => {
										let width = col.width;
										// let render
										return (
											<div key={col.id}
												className="col col-mytable p-3 p-sm-3 p-md-3 p-lg-2" style={{ width: `${width}px` }}>

												{
													colIdx == this.state.tblColumns.length - 1 && this.props.buttonAddRow()
												}
											</div>
										);
									})
								}
							</div>

						</div>
					</div>
				</div>
				{
					this.props.toolPage && this.props.store ? (
						<Pagin store={this.props.store} />
					) :
						null
				}
			</div>
		);
	}
}

Table.defaultProps = {
	autoLoad: true,
	editMode: "cell",
	clicksToEdit: 0
};

export {
	Table
}