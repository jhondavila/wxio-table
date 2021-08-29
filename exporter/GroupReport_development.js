import Utils from "./Utils";
import * as  _ from "lodash";
import XLSX from "sheetjs-style";
import moment from "moment";
export default {

    export(data, columns, parseData) {

        let wb = XLSX.utils.book_new();

        data.forEach(zone => {
            if (zone.type === "zone") {
                let rowsOut = [];
                let mergesOut = [];
                let colsWidthOut = [];
                let ws_name = zone.name;

                colsWidthOut.push(...Utils.getColsWidth(columns));
                let sheetPos = {
                    row: 0,
                    col: 0
                };
                zone.children = zone.children || [];
                zone.children.forEach(folder => {

                    if (folder.type === "folder") {
                        folder.children = folder.children || [];
                        folder.children.forEach(point => {

                            // sheetPos.row = sheetPos.row + 1;
                            Utils.addEmptyRows({ rowsOut, size: 1, sheetPos, resetCol: true });
                            this.addTitle({ rowsOut, point, sheetPos, mergesOut });

                            Utils.addEmptyRows({ rowsOut, size: 2, sheetPos, resetCol: true });

                            this.formatHeader({ rowsOut, mergesOut, sheetPos, columns });

                            this.formatData({ rowsOut, sheetPos, mergesOut, data: point.contents, columns, parseData })

                            Utils.addEmptyRows({ rowsOut, size: 5, sheetPos, resetCol: true });
                        });
                    }
                });

                // Utils.addLeftCols({ rowsOut, mergesOut, colsWidthOut, cols: 2 });

                var ws = XLSX.utils.aoa_to_sheet(rowsOut, {});
                if (!ws["!merges"]) {
                    ws["!merges"] = [];
                }
                ws["!merges"] = ws["!merges"].concat(mergesOut);

                if (!ws["!cols"]) {
                    ws["!cols"] = [];
                }
                ws["!cols"] = ws["!cols"].concat(colsWidthOut);



                XLSX.utils.book_append_sheet(wb, ws, ws_name);
            }
        });


        XLSX.writeFile(wb, "Reporte Cliente.xlsx", {
            showGridLines: false

        });
    },


    addTitle({ rowsOut, point, sheetPos, mergesOut }) {
        // console.log("addTitle")
        let row = [];
        Utils.repeatSpace(row, 5, "");
        row.push({
            v: point.name,
            t: "s",
            s: {
                font: {
                    color: { rgb: "FF000000" },
                    bold: true
                },
                alignment: {
                    vertical: "center",
                    horizontal: "right"
                }
            }
        });
        rowsOut.push(row);
        sheetPos.col = row.length - 1;

        mergesOut.push({
            s: { r: sheetPos.row, c: sheetPos.col }, e: { r: sheetPos.row, c: row.length + 3 }
        });
        sheetPos.row++;
        sheetPos.col = 0;
    },

    formatHeader({ rowsOut, mergesOut, sheetPos, columns }) {

        // let columns = this.columnsDetail();

        let styleHeader = this.headerStyle();
        let header = Utils.buildHeader({
            columns,
            merges: mergesOut,
            styleHeader,
            sheetPos
        });

        rowsOut.push(...header);
    },

    formatData({ rowsOut, sheetPos, mergesOut, data, columns, parseData }) {
        let mapColDataIndex = Utils.getColsDataIndex(columns);
        let summary = {};

        let stylesRows = {
            border: {
                top: { style: "hair", color: { rgb: "FF000000" } },
                left: { style: "hair", color: { rgb: "FF000000" } },
                right: { style: "hair", color: { rgb: "FF000000" } },
                bottom: { style: "hair", color: { rgb: "FF000000" } }
            },
            alignment: {
                vertical: "center",
                horizontal: "center"
            }
        };

        let stylesSummary = {
            font: {
                bold: true
            },
            border: {
                top: { style: "hair", color: { rgb: "FF000000" } },
                left: { style: "hair", color: { rgb: "FF000000" } },
                right: { style: "hair", color: { rgb: "FF000000" } },
                bottom: { style: "hair", color: { rgb: "FF000000" } }
            },
            alignment: {
                vertical: "center",
                horizontal: "center"
            }
        };


        data = data.map((content) => {
            return parseData(content, summary)
        });

        let list = data.map(i => {
            return mapColDataIndex.map(c => {
                return {
                    v: i[c] || "",
                    t: "s",
                    s: stylesRows
                };
            });
        });
        if (list.length > 0) {
            rowsOut.push(...list);

            let rowSummary = mapColDataIndex.map(c => {
                // if(summary[c])
                return summary[c] ? {
                    v: summary[c] || "",
                    t: "s",
                    s: stylesSummary
                } : "";
            });
            sheetPos.row++;
            rowsOut.push(rowSummary);
        } else {
            let row = [
                {
                    v: "Sin registros",
                    t: "s",
                    s: stylesRows
                }
            ];
            Utils.repeatSpace(row, mapColDataIndex.length - 1, {
                v: "",
                t: "s",
                s: stylesRows
            });
            rowsOut.push(row);
            mergesOut.push({
                s: { r: sheetPos.row, c: sheetPos.col }, e: { r: sheetPos.row, c: row.length - 1 }
            });
            sheetPos.row++;
        }

        sheetPos.row += data.length;
        sheetPos.col = 0;
    },

    headerStyle() {
        return {
            alignment: {
                vertical: "center",
                horizontal: "center"
            },
            font: {
                color: { rgb: "FFFFFFFF" },
                bold: false
            },
            alignment: {
                vertical: "center",
                horizontal: "center"
            },
            fill: {
                patternType: "solid",
                fgColor: { rgb: "FF0070C0" }
            },
            border: {
                top: { style: "hair", color: { rgb: "FF000000" } },
                left: { style: "hair", color: { rgb: "FF000000" } },
                right: { style: "hair", color: { rgb: "FF000000" } },
                bottom: { style: "hair", color: { rgb: "FF000000" } }
            }
        };
    },
}