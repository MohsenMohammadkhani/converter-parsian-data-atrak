import React, { useState } from "react";

export default function ConvertorTest() {
  const [countMount, setCountMount] = useState(0);
  const [countNewMount, setCountNewMount] = useState(0);
  const [total, setTotal] = useState(0);
  function calculateMonthPrice() {
    let totalValue = 0;
    for (let index = 1; index <= countMount; index++) {
      let value = parseInt(document.querySelector(`#month-${index}`).value);
      totalValue = totalValue + value;
    }
    setTotal(totalValue);
  }

  function generateMonth() {
    const elements = [];
    for (let index = 1; index <= countMount; index++) {
      elements.push(
        <div className="p-2">
          <hr />
          <label className="form-label">ماه {index}</label>
          <input
            className="form-control"
            id={`month-${index}`}
            defaultValue="0"
            type="number"
            onWheel={(e) => e.target.blur()}
          />
        </div>
      );
    }
    return (
      <form>
        <div>
          <span>هزینه کل ماه :</span>
          <span> {total}</span>
        </div>
        {elements}
      </form>
    );
  }

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
        parseInt(document.querySelector(`#month-${divider}`).value) /
        differenceMonth;
    }
    return newMonthsPrice;
  }

  function calculateNewMonthPriceFloat(differenceMonth) {
    const monthsObjects = {};
    const differenceMonthDays = Math.ceil(differenceMonth * 30);
    const countDifferenceMonthDays = Math.floor(differenceMonthDays / 30);
    let daysRestFromMonth = differenceMonthDays % 30;

    for (let counter = 1; counter <= countMount; counter++) {
      monthsObjects[counter] = {};
      const valueOnDay = Math.ceil(
        parseInt(document.querySelector(`#month-${counter}`).value) /
          differenceMonthDays
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
    console.log("===1===");
    console.log(newMonthsPrice);
    console.log("===1===");
    const differenceMonth = countNewMount / countMount;
    if (isInt(differenceMonth)) {
      for (let index = 1; index <= countNewMount; index++) {
        elements.push(
          <div className="p-2">
            <hr />
            <label for="exampleFormControlInput1" className="form-label">
              ماه {index + 1}
            </label>
            <input
              type="number"
              className="form-control"
              id={`new-month-${index}`}
              value={Math.ceil(newMonthsPrice[index])}
              onWheel={(e) => e.target.blur()}
            />
          </div>
        );
      }
      return (
        <form>
          <div>
            <span>هزینه کل ماه :</span>
            <span>
              {" "}
              {newMonthsPrice.reduce((partialSum, a) => partialSum + a, 0)}
            </span>
          </div>
          {elements}
        </form>
      );
    }

    const newMonthsPriceArray = [];
    let counter = 1;
    let count = 1;
    for (let key in newMonthsPrice) {
      key = parseInt(key);
      for (let keySecond in newMonthsPrice[key]) {
        const day = keySecond.split("-")[1];
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
    let total = 0;
    for (let index = 0; index <= newMonthsPriceArray.length; index++) {
      
      if (!newMonthsPriceArray[index]) {
        continue;
      }
      const value = Math.ceil(
        newMonthsPriceArray[index][Object.keys(newMonthsPriceArray[index])[0]]
      );
      total = value + total;
      elements.push(
        <div className="p-2">
          <hr />
          <label for="exampleFormControlInput1" className="form-label">
            ماه {index + 1}
          </label>
          <input
            type="number"
            className="form-control"
            id={`new-month-${index + 1}`}
            value={value}
            onWheel={(e) => e.target.blur()}
          />
        </div>
      );
    }
    return (
      <form>
        <div>
          <span>هزینه کل ماه :</span>
          <span> {total}</span>
        </div>
        {elements}
      </form>
    );
  }

  function fillFakeInput() {
    let value = 0;
    for (let counter = 1; counter <= countMount; counter++) {
      document.querySelector("#month-" + counter).value = counter + "00";
      value = value + parseInt(counter + "00");
    }
    setTotal(value);
  }

  function resetFiled() {
    setCountMount(0);
    setCountNewMount(0);
    document.querySelector("#count-month").value = "0";
    document.querySelector("#count-new-month").value = "0";
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-3">
          <div className="pt-3">
            <span
              className="btn btn-primary"
              onClick={(e) => {
                fillFakeInput();
              }}
            >
              fill fake{" "}
            </span>
          </div>

          <div className="mb-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCountMount(document.querySelector("#count-month").value);
              }}
            >
              <label className="form-label">تعداد ماه</label>
              <div class="input-group mb-3">
                <button
                  class="btn btn-primary"
                  type="button"
                  onClick={(e) => {
                    setCountMount(document.querySelector("#count-month").value);
                  }}
                >
                  اعمال
                </button>
                <input
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  id="count-month"
                  class="form-control"
                />
              </div>
            </form>
          </div>
          <div className="bg-info">{countMount > 0 && generateMonth()}</div>
        </div>
        <div className="col-3">
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
          <div className="mb-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCountNewMount(
                  document.querySelector("#count-new-month").value
                );
              }}
            >
              <label className="form-label">تعداد ماه جدید</label>
              <div class="input-group mb-3">
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
          <div className="bg-warning">
            {countNewMount > 0 && generateNewMonth()}
          </div>
        </div>
      </div>
    </div>
  );
}
