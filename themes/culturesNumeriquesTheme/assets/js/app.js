import { EventManager } from "./shims/eventManager";

const eventManager = new EventManager('#events-homepage');

const paginationActualText = document.getElementById("eventManager-paginationActual");
const paginationPreviousBtn = document.getElementById("eventManager-paginationPrevious");
const paginationNextBtn = document.getElementById("eventManager-paginationNext");
const eventTypeFilters = document.querySelectorAll("#eventManager-type-filters input");


eventManager.fetchAll().then(()=>{
    // eventManager.renderDOM();
    eventManager
        // .addFilter('year', 2000)
        .addFilter('kind', 'inventions')
        .filter();
    console.log(eventManager.pagination);
    eventManager
        .createPagination()
        .clearDOM()
        .renderDOM();

    updatePagination();

    return;
    

    eventTypeFilters.forEach(filterCheckbox=>filterCheckbox.addEventListener('change', e=>{
        if(e.target.checked) {
            eventManager.addFilter("type", e.target.dataset.type);
        } else {
            eventManager.removeFilter("type", e.target.dataset.type);
        }
    }))
    // document.getElementById('eventManager-loadMore').addEventListener('click', ()=>eventManager.loadMore());

    paginationPreviousBtn.addEventListener('click', ()=>{
        eventManager.paginatePrevious();
        updatePagination();
    })

    paginationNextBtn.addEventListener('click', ()=>{
        eventManager.paginateNext();
        updatePagination();
    })
});






function getPageDates(pageN) {
    const start = eventManager.pagination.pages[pageN][0].year,
        end = eventManager.pagination.pages[pageN][eventManager.pagination.pages[pageN].length-1].year;
    return {
        start,
        end, 
        readable: `${start}-${end}`
    }
}

function updatePagination() {
    currPageDates = getPageDates(eventManager.pagination.currentPageN);

    if(eventManager.canPaginateNext()) {
        paginationNextBtn.classList.remove('disabled');
        paginationNextBtn.innerText = getPageDates(eventManager.pagination.currentPageN+1).readable
    } else {
        paginationNextBtn.classList.add('disabled');
    }


    if(eventManager.canPaginatePrevious()) {
        paginationPreviousBtn.classList.remove('disabled');
        paginationPreviousBtn.innerText = getPageDates(eventManager.pagination.currentPageN-1).readable
    } else {
        paginationPreviousBtn.classList.add('disabled');
    }

    paginationActualText.innerText = currPageDates.readable;
}
