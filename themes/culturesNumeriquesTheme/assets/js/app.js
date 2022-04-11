import { EventManager } from "./shims/eventManager";

const eventManager = new EventManager('#events-homepage');

document.getElementById('eventManager-paginatePrevious').addEventListener('click', ()=>eventManager.paginatePrevious());
document.getElementById('eventManager-paginateNext').addEventListener('click', ()=>eventManager.paginateNext());
document.getElementById('eventManager-loadMore').addEventListener('click', ()=>eventManager.loadMore());


var date = 2000;
const dateInput = document.getElementById("date-input");
const datePrevious = document.getElementById("date-previous");
const dateNext = document.getElementById("date-next");
setDate(date);

function setDate(d) {
    date=d;
    dateInput.value = date;
    datePrevious.innerHTML = date - 1;
    dateNext.innerHTML = date + 1;
    eventManager.filterByYear(date).clear().render();
}
dateInput.addEventListener('change', ({target})=>{setDate(parseInt(target.value))})
document.getElementById('eventManager-yearPrevious').addEventListener('click', ()=>setDate(date-1));
document.getElementById('eventManager-yearNext').addEventListener('click', ()=>setDate(date+1));


eventManager.fetchAll().then(()=>eventManager.render());