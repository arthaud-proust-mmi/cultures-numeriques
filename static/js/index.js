const dateInput = document.getElementById("date-input");
const datePrevious = document.getElementById("date-previous");
const dateNext = document.getElementById("date-next");

function setYear(year) {
    dateInput.value = year;
    datePrevious.innerHTML = year - 1;
    dateNext.innerHTML = year + 1;
}

function previousYear() {
    setYear(parseInt(dateInput.value) - 1);
}

function nextYear() {
    setYear(parseInt(dateInput.value) + 1);
}

function onInputSet() {
    setYear(parseInt(dateInput.value));
}