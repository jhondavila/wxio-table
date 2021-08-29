import Utils from "./Utils";
import * as  _ from "lodash";
import XLSX from "sheetjs-style";
import moment from "moment";
export default {
    headerStyle() {
        return {
            alignment: {
                vertical: "center",
                horizontal: "center"
            },
            font: {
                color: { rgb: "FFFFFFFF" },
                bold: true
            },
            fill: {
                patternType: "solid",
                fgColor: { rgb: "FF1B1464" }
            },
            border: {
                top: { style: "thin", color: { rgb: "FFFFFFFF" } },
                left: { style: "thin", color: { rgb: "FFFFFFFF" } },
                right: { style: "thin", color: { rgb: "FFFFFFFF" } },
                bottom: { style: "thin", color: { rgb: "FFFFFFFF" } }
            }
        };
    },
    export(opts) {
        let { columns, data } = opts;

        let styleHeader = this.headerStyle();
        let merges = [];
        let colsWidth = [];
        let sheetPos = { row: 0, col: 0 };
        let header = Utils.buildHeader({ columns, merges, styleHeader, sheetPos });
        let dataOut = Utils.buildData(columns, colsWidth, data);

        // console.log(colsWidth)
        let wb = XLSX.utils.book_new();
        let ws_name = "Data";
        let rows = [...header, ...dataOut];
        var ws = XLSX.utils.aoa_to_sheet(rows, {});
        if (!ws["!merges"]) {
            ws["!merges"] = [];
        }
        ws["!merges"] = ws["!merges"].concat(merges);

        if (!ws["!cols"]) {
            ws["!cols"] = [];
        }
        // ws["!cols"]
        ws["!cols"] = ws["!cols"].concat(colsWidth);
        // console.log(ws)

        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        XLSX.writeFile(wb, `${opts.filename || "Report"}.xlsx`, {
            showGridLines: false

        });
    },
}