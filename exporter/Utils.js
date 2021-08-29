import * as  _ from "lodash";
import UtilsExport from "./Utils";
import XLSX from "sheetjs-style";
import moment from "moment"
export default {

    getArrayDepth(obj) {
        if (Array.isArray(obj)) {
            return 1 + Math.max(...obj.map(t => this.getArrayDepth(t.columns)))
        } else {
            return 0
        }
    },
    getColsDataIndex(obj) {
        if (Array.isArray(obj)) {
            let status = _.concat(...obj.map(t => {
                return t.columns ? this.getColsDataIndex(t.columns) : t.dataIndex;
            }))
            return status;
        } else {
            return obj.dataIndex;
        }
    },
    getCols(obj) {
        if (Array.isArray(obj)) {
            let status = _.concat(...obj.map(t => {
                return t.columns ? this.getCols(t.columns) : t;
            }))
            return status;
        } else {
            return obj;
        }
    },
    getMaxCols(obj) {
        if (Array.isArray(obj)) {
            let status = _.sum([...obj.map(t => {
                return this.getMaxCols(t.columns);
            })])
            return status;
        } else {
            return 1
        }
    },
    getColsWidth(obj) {
        if (Array.isArray(obj)) {
            let status = _.concat(...obj.map(t => {
                return t.columns ? this.getColsWidth(t.columns) : { wpx: t.width || 90 };
            }))
            return status;
        } else {
            return { wpx: obj.width || 90 };
        }
    },
    buildHeader({ columns, merges, styleHeader, sheetPos }) {

        let maxDeep = this.getArrayDepth(columns);
        let maxColumns = this.getMaxCols(columns);

        let rows = [];

        for (let r = 0; r < maxDeep; r++) {
            let row = [];
            rows.push(row);
            for (let c = 0; c < maxColumns; c++) {
                row.push({
                    v: "",
                    t: "s",
                    s: styleHeader
                });
            }
        }
        // console.log(rows);
        let r = 0;
        let c = 0;
        for (let x = 0; x < columns.length; x++) {

            let col = columns[x];
            rows[r][c] = {
                v: col.text,
                t: "s",
                s: styleHeader
            };
            if (col.columns) {
                let cPos = this.buildChildColumns(col.columns, rows, r + 1, c, merges, maxDeep, styleHeader, sheetPos);
                merges.push({
                    s: { r: sheetPos.row, c: c }, e: { r: sheetPos.row, c: cPos - 1 }
                })
                c = cPos - 1;
            } else {
                merges.push({
                    s: { r: sheetPos.row, c: c }, e: { r: sheetPos.row + maxDeep - 1, c: c }
                })
            }
            c++;
        }

        sheetPos.row = sheetPos.row + maxDeep;
        sheetPos.col = 0;
        return rows;
    },
    buildChildColumns(columns, rows, r, c, merges, maxDeep, styleHeader, sheetPos) {
        for (let x = 0; x < columns.length; x++) {
            let col = columns[x];
            // rows[r][c] = col.text;
            rows[r][c] = {
                v: col.text,
                t: "s",
                s: styleHeader
            };
            if (col.columns) {
                let cPos = this.buildChildColumns(col.columns, rows, r + 1, c, merges, maxDeep, styleHeader);
                merges.push({
                    s: { r: sheetPos.row + r, c: c }, e: { r: sheetPos.row + r, c: cPos - 1 }
                });
                c = cPos - 1;
            } else {
                merges.push({
                    s: { r: sheetPos.row + r, c: c }, e: { r: sheetPos.row + maxDeep - 1, c: c }
                });
            }
            c++;
        }
        return c;
    },
    repeatSpace(array, repeat, value) {
        for (let x = 0; x < repeat; x++) {
            array.push(value);
        }
    },
    repeatSpaceLeft(array, repeat, value) {
        for (let x = 0; x < repeat; x++) {
            array.unshift(value);
        }
    },

    buildData(columns, colsWidth, data) {
        let mapCols = this.getCols(columns);
        colsWidth.push(...this.getColsWidth(columns));
        let list = data.map(i => {
            return mapCols.map(c => {
                if (c.format) {
                    return moment(i[c.dataIndex]).format(c.format)
                } else if (c.renderExport) {
                    return c.renderExport({ value: i[c.dataIndex], dataIndex: c.dataIndex, col: c })
                } else if (c.render) {
                    return c.render({ value: i[c.dataIndex], dataIndex: c.dataIndex, col: c })
                } else {
                    return i[c.dataIndex];
                }
            });
        });
        return list;
    },
    addLeftCols({ rowsOut, mergesOut, colsWidthOut, cols }) {

        rowsOut.forEach(row => {
            this.repeatSpaceLeft(row, cols, "");
        });
        mergesOut.forEach(row => {
            row.s.c += cols;
            row.e.c += cols;
        });

        // colsWidthOut.forEach(row => {
        this.repeatSpaceLeft(colsWidthOut, cols, { wpx: 100 });
        // });
        // for(let x = 0 ;x  < )
    },
    addEmptyRows({ rowsOut, size, sheetPos, resetCol }) {
        // let spaces = [];
        for (let x = 0; x < size; x++) {
            rowsOut.push([]);
            sheetPos.row++;
        }
        if (resetCol) {
            sheetPos.col = 0;
        }
        // = 
        // return spaces;
    }
};