let mapArray = [];
let mineArray = [];
let gameLevel;
let gameType = 0;
let cellsNumber;
let minNumber;
let firstMinNumber;
let percent;
let timer;
let minutes;
let seconds;
let checkTimerIsOnOrOff;
let val;
let remainingTime=0;
let t;
/////////////
function mineMap(id, status) {
    this.id = id;
    this.status = status;
}
////////////////
function chooseMineCells(num) {
    mineArray = [];
    for (let i = 0; i < num; i++) {
        let randomNumber = Math.floor(Math.random() * cellsNumber) + 1;
        if (mineArray.includes(randomNumber) === false) {
            mineArray.push(randomNumber);
        } else {
            i--;
        }
    }
    return mineArray;
}
///////////////////////////////////////
function startTimer() {
    if (timer !== null) {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        if (minutes < 1 && seconds <= 30) {
            $("#time").css("color", "red");
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        $("#time").html(minutes + ":" + seconds);
        timer--;
        if (timer === 0) {
            for (let i = 0; i < mineArray.length; i++) {
                $(`#${mineArray[i]}`).css("background-color", "red");
            }
            $("#time").html("00:00");
            onclickRemover();
            $("#alert").slideDown();
            $("#alert-text").css("color", "red");
            $("#alert-text").html("زمان شما به پایان رسید");
        }
    }
}
/////////////////////////////////////////
function onclickRemover() {
    let divWithCellClass = document.getElementsByClassName("cell");
    for (i = 0; i < divWithCellClass.length; i++) {
        divWithCellClass[i].removeAttribute("onclick");
        divWithCellClass[i].removeAttribute("onmousedown");
        clearInterval(t);
    }
}
//////////////////////////////////////////
function winFunc() {
    for (let i = 0; i < mineArray.length; i++) {
        $(`#${mineArray[i]}`).css("background-color", "Gold");
    }
    onclickRemover()
    $("#alert").slideDown();
    $("#alert-text").css("color", "green");
    $("#alert-text").html("هورااا برنده شدید");
}
//////////////////////////////////////////
function RightClick(event, id) {
    if (event.which === 3) {
        if ($(`#${id}`).css("background-color") === "rgb(47, 255, 47)") {
            $(`#${id}`).css("background-color", "rgb(255, 192, 203)");
            $(`#${id}`).removeAttr("onclick");
        } else
        if ($(`#${id}`).css("background-color") === "rgb(255, 192, 203)") {
            $(`#${id}`).css("background-color", "rgb(47, 255, 47)")
            $(`#${id}`).removeAttr("style");
            $(`#${id}`).attr("onclick", `findMine(${id})`);
        }
    }
}
///////////////////////////////
function calXAround(x) {
    let numberOfAroundMine = 0;
    let around = [];
    let aroundX = [];
    if (x % val === 0) {
        around = [x - (val + 1), x - val, x - 1, x + val, x + (val - 1)];
    } else if (x % val === 1) {
        around = [x - val, x - (val - 1), x + 1, x + val, x + (val + 1)];
    } else {
        around = [x - (val + 1), x - val, x - (val - 1), x - 1, x + 1, x + (val - 1), x + val, x + (val + 1)];
    }
    for (i = 0; i < around.length; i++) {
        if ($(`#${around[i]}`).attr("class") !== "cell not-mine") {
            aroundX.push(around[i]);
        }
    }
    for (let i = 0; i < aroundX.length; i++) {
        if (aroundX[i] <= 0 || aroundX[i] > cellsNumber) {
            aroundX.splice(i, 1);
            i--;
        } else if (mineArray.includes(aroundX[i])) {
            numberOfAroundMine++;
        }
    }
    let XValues = {
        numberOfAroundMine: numberOfAroundMine,
        aroundX: aroundX
    }
    return XValues;
}
//////////////////////////////////////////
function generateGrid() {
    mapArray = [];
    let j = 1;
    let flag = "OK";
    if (checkTimerIsOnOrOff) {
        if(val<=15){
            timer = percent * 5 + (Math.floor(cellsNumber / 25) * 10) + 45+remainingTime;
        }else{
            timer = percent * 7 + (Math.floor(cellsNumber / 25) * 10)+remainingTime;
        }
        t = setInterval(startTimer, 1000);
    } else {
        $("#about").html("");
        timer = null;
    }
    chooseMineCells(minNumber);
    for (let i = 1; i <= cellsNumber; i++) {
        if (mineArray.includes(i)) {
            flag = "mine";
        } else {
            flag = "Ok";
        }
        mapArray.push(new mineMap(j++, flag));
    }
    document.getElementById("main").innerHTML = "";
    for (i = 0; i < cellsNumber; i++) {
        document.getElementById("main").innerHTML += `<div id="${mapArray[i].id}" class="cell" onclick="findMine(${mapArray[i].id})" onmousedown="RightClick(event,${mapArray[i].id})"></div>`;
    }
    $("#alert").slideUp();
    $("#time").css("color", "white");
}
/////////////////////////////////////
function findMine(x) {
    if (mineArray.includes(x)) {
        for (let i = 0; i < mineArray.length; i++) {
            $(`#${mineArray[i]}`).css("background-color", "red");
        }
        onclickRemover();
        $("#alert").slideDown();
        $("#alert-text").css("color", "red");
        $("#alert-text").html("متاسفانه باختید");
    } else {
        $(`#${x}`).html(calXAround(x).numberOfAroundMine);
        $(`#${x}`).addClass("not-mine");
        let y = calXAround(x).aroundX;
        if (calXAround(x).numberOfAroundMine === 0) {
            y.forEach(element => {
                $(`#${element}`).html(calXAround(element).numberOfAroundMine);
                $(`#${element}`).addClass("not-mine");
                if (calXAround(element).numberOfAroundMine === 0) {
                    findMine(element);
                }
            });
        }
    }
    if ($(".not-mine").length === cellsNumber - mineArray.length) {
        if (gameType === 1) {
            winFunc();
        } else {
            gameLevel++;
            if (gameLevel <= 4) {
                $("#showLevel").html(`مرحله: ${gameLevel}`)
                remainingTime=timer;
                minNumber += firstMinNumber;
                percent += 7;
                clearInterval(t);
                generateGrid()
            } else {
                winFunc();
            }
        }
    }
}
////////////////UI-PART///////////////////
$("#btn-start1").click(function () {
    val = parseInt($("#cells-number1").val());
    if ($("#cells-number1").val() === "" || val < 5 || val > 30) {
        $("#cells-number1").val("");
        alert("یک عدد از 5 تا 30 وارد کنید")
    } else {
        gameType = 1;
        checkTimerIsOnOrOff = $("#time-check1").prop("checked");
        cellsNumber = val * val;
        percent = $("#range").val() * 7;
        minNumber = (percent * cellsNumber) / 100;
        $("#parent").css("display", "none");
        $("#back").css("height", "auto");
        $("#back").css("width", "auto");
        $("#back").css("display", "flex");
        $("#back").css("flex-direction", "row");
        $("#back").css("align-items", "start");
        $("#main").css("width", val * 30);
        $('#game-info-parent').css('display', 'block');
        switch (percent) {
            case 7:
                $("#showLevel").html("سطح بازی :آسان")
                break;
            case 14:
                $("#showLevel").html("سطح بازی: متوسط")
                break;
            case 21:
                $("#showLevel").html("سطح بازی: سخت")
                break;
            case 28:
                $("#showLevel").html("سطح بازی: بسیار سخت")
                break;
        }
        generateGrid();
    }
});
////////////////////////////////////////////////
$("#btn-start2").click(function () {
    val = parseInt($("#cells-number2").val());
    if ($("#cells-number2").val() === "" || val < 5 || val > 30) {
        $("#cells-number2").val("");
        alert("یک عدد از 5 تا 30 وارد کنید")
    } else {
        gameType = 2;
        checkTimerIsOnOrOff = $("#time-check2").prop("checked");
        gameLevel = 1;
        cellsNumber = val * val;
        firstMinNumber = (10 * cellsNumber) / 100;
        minNumber = firstMinNumber;
        percent = 7;
        $("#parent").css("display", "none");
        $("#back").css("height", "auto");
        $("#back").css("width", "auto");
        $("#back").css("display", "flex");
        $("#back").css("flex-direction", "row");
        $("#back").css("align-items", "start");
        $("#main").css("width", val * 30);
        $('#game-info-parent').css('display', 'block');
        $("#about").html("زمان ذخیره شده هر مرحله به مرحله بعد اضافه میشود");
        $("#about").css("color","yellow");
        $("#showLevel").html(`مرحله: ${gameLevel}`);
        generateGrid();
    }
});
//////////////////////////////////////////////////
$("#startAgain").click(function () {
    if (gameType === 2) {
        percent = 7;
        minNumber = firstMinNumber;
        gameLevel = 1;
        $("#showLevel").html(`مرحله: ${gameLevel}`);
    }
    clearInterval(t);
    generateGrid();
})
///////////////////////////////////////////////
$(document).ready(function () {
    $("#btn1").click(function () {
        $("#one-level-div").slideDown();
        $("#multiple-level-div").slideUp();

    });
    $("#btn2").click(function () {
        $("#one-level-div").slideUp();
        $("#multiple-level-div").slideDown();

    });
});