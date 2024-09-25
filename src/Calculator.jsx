import React, { useState } from "react";
import helper from "./helper";
import DownloadExcel from "./DownloadExcel";

export default function Calculator({ setCountMount, countMount }) {
  const [countNewMount, setCountNewMount] = useState(0);

  function isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  function calculateNewMonthPriceInteger(differenceMonth) {
    const newMonthsPrice = [];
    newMonthsPrice[0] = 0;
    for (let counter = 1; counter <= countNewMount; counter++) {
      const divider = Math.floor((counter - 1) / differenceMonth) + 1;
      newMonthsPrice[counter] =
        parseInt(
          helper.toEnglishNumber(
            removeCommaInNumber(
              document.querySelector(`#month-${divider}`).value
            )
          )
        ) / differenceMonth;
    }
    return newMonthsPrice;
  }

  function removeCommaInNumber(number) {
    return number.replace(/[, ]+/g, "").trim();
  }

  function calculateNewMonthPriceFloat(differenceMonth) {
    const monthsObjects = {};

    const differenceMonthDays = Math.ceil(differenceMonth * 30);
    const countDifferenceMonthDays = Math.floor(differenceMonthDays / 30);
    let daysRestFromMonth = differenceMonthDays % 30;

    for (let counter = 1; counter <= countMount; counter++) {
      monthsObjects[counter] = {};

      const valueOnDay = Math.ceil(
        parseInt(
          helper.toEnglishNumber(
            removeCommaInNumber(
              document.querySelector(`#month-${counter}`).value
            )
          )
        ) / differenceMonthDays
      );

      for (
        let counterSecond = 1;
        counterSecond <= countDifferenceMonthDays + 1;
        counterSecond++
      ) {
        if (counter == 1) {
          if (counterSecond == 1) {
            monthsObjects[1]["1-30"] = valueOnDay * 30;
          } else {
            if (counterSecond == countDifferenceMonthDays + 1) {
              monthsObjects[1][counterSecond + "-" + daysRestFromMonth] =
                valueOnDay * daysRestFromMonth;
            } else {
              monthsObjects[1][counterSecond + "-30"] = valueOnDay * 30;
            }
          }
          continue;
        }

        if (counterSecond == 1) {
          const previewObject = monthsObjects[counter - 1];
          const keyObjectLast = Object.keys(previewObject).pop();

          const countDays = keyObjectLast.split("-")[1];
          if (countDays == 30) {
            monthsObjects[counter][counterSecond + "-30"] = 30 * valueOnDay;
            continue;
          }
          monthsObjects[counter][counterSecond + "-" + (30 - countDays)] =
            (30 - countDays) * valueOnDay;
          continue;
        }

        if (counterSecond == countDifferenceMonthDays + 1) {
          let total = 0;
          Object.keys(monthsObjects[counter]).forEach(function (key, index) {
            total = total + parseInt(key.split("-")[1]);
          });
          let daysRestFromMonth = differenceMonthDays - total;
          if (daysRestFromMonth > 30) {
            monthsObjects[counter][counterSecond + "-" + 30] = 30 * valueOnDay;
            monthsObjects[counter][
              counterSecond + 1 + "-" + (daysRestFromMonth - 30)
            ] = (daysRestFromMonth - 30) * valueOnDay;
            continue;
          }
          monthsObjects[counter][counterSecond + "-" + daysRestFromMonth] =
            daysRestFromMonth * valueOnDay;
        } else {
          monthsObjects[counter][counterSecond + "-30"] = valueOnDay * 30;
        }
      }
    }
    return monthsObjects;
  }

  function calculateNewMonthPrice() {
    const differenceMonth = countNewMount / countMount;
    if (isInt(differenceMonth)) {
      return calculateNewMonthPriceInteger(differenceMonth);
    }

    if (isFloat(differenceMonth)) {
      return calculateNewMonthPriceFloat(differenceMonth);
    }
  }

  function generateNewMonth() {
    const newMonthsPrice = calculateNewMonthPrice();
    const elements = [];
    const differenceMonth = countNewMount / countMount;
    const firstMonth = parseInt(
      helper.toEnglishNumber(
        document.querySelector("#month-value-1").innerHTML.split("-")[1]
      )
    );
    const firstYear = parseInt(
      helper.toEnglishNumber(
        document.querySelector("#month-value-1").innerHTML.split("-")[0]
      )
    );

    if (isInt(differenceMonth)) {
      let newYear = firstYear;
      for (let index = 1; index <= countNewMount; index++) {
        let newMonth = firstMonth + index - 1;
        if (newMonth >= 13) {
          newMonth = newMonth % 12;
          if (newMonth == 0) {
            newMonth = 12;
          }
          if (newMonth == 1) {
            newYear++;
          }
        }
        const item = newYear + "-" + newMonth;
        elements.push(
          <tr>
            <td>{index}</td>
            <td>
              <div
                className="number-finance"
                id={`new-month-value-${parseInt(index)}`}
              >
                {helper.toFarsiNumber(item)}
              </div>
              <div className="font-size-20">
                <span className="number-finance pe-2">
                  {helper.toFarsiNumber(item.split("-")[0])}
                </span>
                {helper.getMonthNameWithMonthNumber(
                  parseInt(item.split("-")[1])
                )}
              </div>
            </td>
            <td>
              <div class="input-group">
                <button
                  class="btn btn-primary"
                  type="button"
                  onClick={function () {
                    navigator.clipboard.writeText(
                      helper.toFarsiNumber(
                        Math.ceil(newMonthsPrice[index]).toLocaleString()
                      )
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
                    Math.ceil(newMonthsPrice[index]).toLocaleString()
                  )}
                  id={`new-month-persian-${index}`}
                />
              </div>

              <div class="input-group ">
                <button
                  class="btn btn-primary"
                  type="button"
                  onClick={function () {
                    navigator.clipboard.writeText(
                      Math.ceil(newMonthsPrice[index]).toLocaleString()
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
                  value={Math.ceil(newMonthsPrice[index]).toLocaleString()}
                  id={`new-month-english-${index}`}
                />
              </div>
            </td>
          </tr>
        );
      }
      return (
        <>
          <div className="py-2">
            <span>هزینه کل :</span>
            <span className="number-finance">
              {helper.toFarsiNumber(
                newMonthsPrice
                  .reduce((partialSum, a) => partialSum + a, 0)
                  .toLocaleString()
              )}
            </span>
            <DownloadExcel />
          </div>
          <table class="table table-warning table-striped rounded">
            <thead>
              <tr>
                <td>شماره</td>
                <td>ماه</td>
                <td>هزینه</td>
              </tr>
            </thead>
            <tbody>{elements}</tbody>
          </table>
        </>
      );
    }

    const newMonthsPriceArray = prepareForTableHtml(newMonthsPrice);

    let total = 0;
    let newYear = firstYear;

    for (let index = 0; index <= newMonthsPriceArray.length; index++) {
      if (!newMonthsPriceArray[index]) {
        continue;
      }
      const value = Math.ceil(
        newMonthsPriceArray[index][Object.keys(newMonthsPriceArray[index])[0]]
      );
      total = value + total;

      let newMonth = firstMonth + index;
      if (newMonth >= 13) {
        newMonth = newMonth % 12;
        if (newMonth == 0) {
          newMonth = 12;
        }
        if (newMonth == 1) {
          newYear++;
        }
      }
      const item = newYear + "-" + newMonth;

      elements.push(
        <tr>
          <td>{index + 1}</td>
          <td className="">
            <div
              className="number-finance"
              id={`new-month-value-${parseInt(index + 1)}`}
            >
              {helper.toFarsiNumber(item)}
            </div>
            <div className="font-size-20">
              <span className="number-finance pe-2">
                {helper.toFarsiNumber(item.split("-")[0])}
              </span>
              {helper.getMonthNameWithMonthNumber(parseInt(item.split("-")[1]))}
            </div>
          </td>
          <td>
            <div class="input-group ">
              <button
                class="btn btn-primary"
                type="button"
                onClick={function () {
                  navigator.clipboard.writeText(
                    helper.toFarsiNumber(
                      helper.toFarsiNumber(value.toLocaleString())
                    )
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
                value={helper.toFarsiNumber(value.toLocaleString())}
                id={`new-month-persian-${index + 1}`}
              />
            </div>

            <div class="input-group ">
              <button
                class="btn btn-primary"
                type="button"
                onClick={function () {
                  navigator.clipboard.writeText(value.toLocaleString());
                }}
              >
                کپی
              </button>
              <input
                dir="ltr"
                className="form-control number-finance"
                type="text"
                disabled
                value={value.toLocaleString()}
                id={`new-month-english-${index + 1}`}
              />
            </div>
          </td>
        </tr>
      );
    }
    return (
      <form>
        <div className="py-2">
          <span>هزینه کل:</span>
          <span className="number-finance">
            {helper.toFarsiNumber(total.toLocaleString())}
          </span>
          <DownloadExcel />
        </div>
        <table
          class="table table-warning table-striped rounded"
          id="table-price-converted"
        >
          <thead>
            <tr>
              <td>شماره</td>
              <td>ماه</td>
              <td>هزینه</td>
            </tr>
          </thead>
          <tbody>{elements}</tbody>
        </table>
      </form>
    );
  }

  function prepareForTableHtml(newMonthsPrice) {
    console.log("==1==");
    console.log(newMonthsPrice);
    console.log("==1==");
    const newMonthsPriceArray = [];
    let counter = 1;
    let count = 1;
    for (let key in newMonthsPrice) {
      key = parseInt(key);
      for (let keySecond in newMonthsPrice[key]) {
        const day = parseInt(keySecond.split("-")[1]);
        if (day == 30) {
          let newKey = keySecond + "-" + counter;
          let objectSample = {};
          objectSample[newKey] = newMonthsPrice[key][keySecond];
          newMonthsPriceArray.push(objectSample);
          counter++;
        } else {
          if (count) {
            if (!newMonthsPrice[parseInt(key) + 1]) {
              continue;
            }
            let value1 = newMonthsPrice[key][keySecond];
            let value2 = newMonthsPrice[key + 1]["1-" + (30 - day)];
            if (!newMonthsPrice[parseInt(key) + 1]) {
              continue;
            }
            let newKey = keySecond + "-" + counter;
            let objectSample = {};
            objectSample[newKey] = value1 + value2;
            newMonthsPriceArray.push(objectSample);
            count = 0;
          } else {
            count = 1;
          }
        }
        if (Object.keys(newMonthsPrice).length == key) {
          const lastMonthsPrice = newMonthsPrice[key];
          const lastMonthsPriceKey =
            Object.keys(lastMonthsPrice)[
              Object.keys(lastMonthsPrice).length - 1
            ];
          const lastMonthsPriceValue =
            lastMonthsPrice[
              Object.keys(lastMonthsPrice)[
                Object.keys(lastMonthsPrice).length - 1
              ]
            ];
          let newKey = lastMonthsPriceKey + "-" + parseInt(counter);
          let objectSample = {};
          objectSample[newKey] = lastMonthsPriceValue;
          newMonthsPriceArray.push(objectSample);
        }
      }
    }
    console.log("==2==");
    console.log(newMonthsPriceArray);
    console.log("==2==");
    return newMonthsPriceArray;
  }

  function resetFiled() {
    setCountMount(0);
    setCountNewMount(0);
    document.querySelector("#count-new-month").value = "0";
  }

  return (
    <>
      <div className="pt-3">
        <span
          className="btn btn-primary"
          onClick={(e) => {
            resetFiled();
          }}
        >
          Reset{" "}
        </span>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCountNewMount(document.querySelector("#count-new-month").value);
          }}
        >
          <label className="form-label">تعداد ماه جدید</label>
          <div class="input-group ">
            <button
              class="btn btn-primary"
              type="button"
              onClick={(e) => {
                setCountNewMount(
                  document.querySelector("#count-new-month").value
                );
              }}
            >
              اعمال
            </button>
            <input
              onWheel={(e) => e.target.blur()}
              type="number"
              id="count-new-month"
              class="form-control"
            />
          </div>
        </form>
      </div>
      <div>{countNewMount > 0 && generateNewMonth()}</div>
    </>
  );
}
