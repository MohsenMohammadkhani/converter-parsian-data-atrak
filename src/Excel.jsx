import React, { useState } from "react";
import * as XLSX from "xlsx";
import helper from "./helper";

export default function Excel({ setCountMount }) {
  const [projectsInfo, setProjectsInfo] = useState();
  const [projectSelectInfo, setProjectSelectInfo] = useState([]);
  const [total, setTotal] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      let data = {};

      for (const key in sheetData) {
        const item = sheetData[key];
        const keysData = Object.keys(data);
        const projectName = item["پروژه"];
        if (!projectName) {
          continue;
        }
        if (!keysData.includes(item["پروژه"])) {
          data[projectName] = [];
        }
        let price = item["هزینه"];
        if (price == undefined) {
          price = 0;
        }
        data[projectName].push({
          price: Math.trunc(price * Math.pow(10, 9)),
          month: item["ماه"],
        });
      }
      setProjectsInfo(data);
    };

    reader.readAsBinaryString(file);
  };

  function removeClassBtnActive() {
    const projectsNameArray = Object.keys(projectsInfo);
    projectsNameArray.forEach(function (projectsName, index) {
      document.querySelector(`#button-project-${index + 1}`).className =
        "btn btn-primary";
    });
  }

  function generateData() {
    const projectsNameArray = Object.keys(projectsInfo);
    return projectsNameArray.map(function (projectsName, index) {
      return (
        <span className="pe-2">
          <span
            id={`button-project-${index + 1}`}
            className="btn btn-primary"
            onClick={function (e) {
              removeClassBtnActive();
              e.target.className = "btn btn-warning";
              setProjectSelectInfo(projectsInfo[projectsName]);
              setCountMount(projectsInfo[projectsName].length);
            }}
          >
            {projectsName}
          </span>
        </span>
      );
    });
  }

  function generateProjectSelectInfo() {
    const total = projectSelectInfo.reduce(function (a, b) {
      return a + b["price"];
    }, 0);

    return (
      <div className="pt-2">
        <div>
          <span>تعداد ماه = </span>
          <span id="count-month">
            {helper.toFarsiNumber(projectSelectInfo.length)}
          </span>
        </div>
        <div className="pb-4">
          <span> هزینه کل = </span>
          <span className="number-finance">
            {helper.toFarsiNumber(total.toLocaleString())}
          </span>
        </div>
        <table class="table table-success table-striped rounded">
          <thead>
            <tr>
              <td>شماره</td>
              <td>ماه</td>
              <td>هزینه</td>
            </tr>
          </thead>
          <tbody>
            {projectSelectInfo.map(function (item, index) {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <div
                      className="number-finance"
                      id={`month-value-${parseInt(index + 1)}`}
                    >
                      {helper.toFarsiNumber(item.month)}
                    </div>
                    <div className="font-size-20">
                      <span className="number-finance pe-2">
                        {helper.toFarsiNumber(item.month.split("-")[0])}
                      </span>
                      {helper.getMonthNameWithMonthNumber(
                        parseInt(item.month.split("-")[1])
                      )}
                    </div>
                  </td>
                  <td>
                    <div class="input-group ">
                      <button
                        class="btn btn-primary"
                        type="button"
                        onClick={function () {
                          navigator.clipboard.writeText(
                            helper.toFarsiNumber(item.price.toLocaleString())
                          );
                        }}
                      >
                        کپی
                      </button>
                      <input
                        dir="ltr"
                        className="form-control number-finance"
                        type="text"
                        disabled
                        value={helper.toFarsiNumber(
                          item.price.toLocaleString()
                        )}
                        id={`month-${index + 1}`}
                      />
                    </div>

                    <div class="input-group ">
                      <button
                        class="btn btn-primary"
                        type="button"
                        onClick={function () {
                          navigator.clipboard.writeText(
                            item.price.toLocaleString()
                          );
                        }}
                      >
                        کپی
                      </button>
                      <input
                        dir="ltr"
                        className="form-control number-finance"
                        type="text"
                        disabled
                        value={item.price.toLocaleString()}
                        id={`month-${index + 1}`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="p-2">
      <input type="file" id="file" onChange={handleFileUpload} />
      {projectsInfo && <div className="d-flex pt-3">{generateData()}</div>}
      {projectSelectInfo.length > 0 && generateProjectSelectInfo()}
    </div>
  );
}
