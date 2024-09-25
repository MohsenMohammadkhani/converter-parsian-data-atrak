import React from "react";
import * as XLSX from "xlsx";
import helper from "./helper";

export default function DownloadExcel() {
  function downloadExcel() {
    const data = [];
    const projectName = document.querySelector(".btn.btn-warning").innerHTML;
    const table = document.querySelector("#table-price-converted tbody");
    const workbook = XLSX.utils.book_new();
    for (let counter = 1; counter <= table.rows.length; counter++) {
      let objectExample = {};
      objectExample["ماه"] = helper.toEnglishNumber(
        document.querySelector(`#new-month-value-${counter}`).innerHTML
      );
      objectExample["پروژه"] =
        document.querySelector(".btn.btn-warning").innerHTML;
      objectExample["هزینه"] = helper.toEnglishNumber(
        document.querySelector(`#new-month-english-${counter}`).value
      );
      data.push(objectExample);
    }
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws);
    XLSX.writeFile(workbook, projectName + ".xlsx");
  }

  return (
    <span className="ps-3">
      <span className="btn btn-danger" onClick={downloadExcel}>
        دانلود فایل excel
      </span>
    </span>
  );
}
