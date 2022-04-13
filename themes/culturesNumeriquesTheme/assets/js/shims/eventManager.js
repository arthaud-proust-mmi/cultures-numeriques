class EventManager {
    constructor(rootElementSelector) {
        this.rootEl = document.querySelector(rootElementSelector);
        this.eventTemplate = document.querySelector("template#event-template");

        this.events = {
            fetched: [],
            filtered: []
        }

        this.filters = {}
        this.filtersAvailable = [
            'year',
            'thematique',
            'kind'
        ]
        
        this.pagination = {
            enabled: true,
            countPerPage: 6,
            currentPageN: 0,
            pages: [[]],
            currentPage: ()=>this.pagination.pages[this.pagination.currentPageN]
        };

        return this;
    }



    /**
     * Retourne l'élément html template
     * 
     * @returns {DOMElement} Template évènement 
     */

    getTemplateEl() {
        return document.importNode(this.eventTemplate.content, true)
    }



    /**
     * Récupère tous les évènements
     * 
     * @returns {Promise(EventManager)} Promise
     */
    async fetchAll() {
        let blob = await fetch('/events/index.json');
        let json = await blob.json();
        this.events.fetched = json.data;
        this.clearFilter();
        return this;
    }



    /**
     * Remets dans la liste tous les évènements
     * 
     * @returns {EventManager} EventManager
     */
    clearFilter() {
        this.filters = {};
        this.pagination.currentPageN = 0;
        this.events.filtered = this.events.fetched;

        return this;
    }



    /**
     * Retourne si l'évènement passe le filtre
     * 
     * @param {string} filter
     * @param {object} event
     * 
     * @returns {boolean} pass
     */
    passFilter(filterName, event) {
        const eventValue = event[filterName];
        const filterValue = this.filters[filterName];
        const isFilterArray = Array.isArray(filterValue);
        const isEventFilterArray = Array.isArray(eventValue);

        switch(true) {
            case isEventFilterArray && isFilterArray :
                return [...new Set([...filterValue, ...eventValue])].length > 0;

            case !isEventFilterArray && isFilterArray :
                return filterValue.includes(eventValue);

            case isEventFilterArray && !isFilterArray :
                return eventValue.includes(filterValue);

            case !isEventFilterArray && !isFilterArray :
                return eventValue == filterValue;

            default:
                return false;
        }
    }



    /**
     * Filtre les évènements selon les filtres ajoutés
     * 
     * @returns {EventManager} EventManager
     */
    filter() {
        const eventsToFilter = [...this.events.fetched];
        this.events.filtered = [];

        for(let event of eventsToFilter) {
            if(
                // (this.filters.hasOwnProperty('year')
                // && event.year != this.filters.year)
                // ||
                // (this.filters.hasOwnProperty('thematique')
                // && event.thematique != this.filters.thematique)
                (this.filters.hasOwnProperty('year')
                && !this.passFilter('year', event))
                ||
                (this.filters.hasOwnProperty('thematique')
                && !this.passFilter('thematique', event))
            ) {
                // on ajoute pas l'event
                continue;
            }
            this.events.filtered.push(event);
        }
        return this;
    }



    /**
     * Ajoute le filtre avec la valeur passée
     * 
     * @param {string} filter
     * @param {string} value
     * 
     * @returns {EventManager} EventManager
     */
    addFilter(filter, value) {
        if(this.filtersAvailable.includes(filter)) {
            this.filters[filter] = value;
        }
        console.log(this.filters);

        return this;
    }



    /**
     * Retire le filtre donné
     * 
     * @param {string} filter
     * 
     * @returns {EventManager} EventManager
     */
    removeFilter(filter) {
        delete this.filters[filter];

        return this;
    }
    
    

    /**
     * Vide le DOM de l'élément root
     * 
     * @returns {EventManager} EventManager
     */
    clearDOM() {
        while (this.rootEl.lastElementChild) {
            this.rootEl.removeChild(this.rootEl.lastElementChild);
        }

        return this;
    }



    /**
     * Ajoute à l'élément root un élément event rempli avec les données fournies
     * 
     * @param {object} eventData
     * 
     * @returns {EventManager} EventManager
     */
    renderEventDOM(eventData) {
        let el = this.getTemplateEl();
        el.querySelector('.event-summary-title').innerText = eventData.title;
        el.querySelector('.event-summary-year').innerText = eventData.year;
        el.querySelector('.event-summary-abstract').innerText = eventData.abstract;
        el.querySelector('.event-summary-image').src = eventData.image;
        el.querySelector('.event-summary-permalink').href = eventData.permalink;
        this.rootEl.append(el);

        return this;
    }



    /**
     * Actualise le DOM de l'élément root
     * 
     * @returns {EventManager} EventManager
     */
    renderDOM() {
        if(this.pagination.enabled) {
            for(const eventData of this.pagination.currentPage() ) {
                this.renderEventDOM(eventData)
            }
        } else {
            for(const eventData of this.events.filtered) {
                this.renderEventDOM(eventData)
            }
        }
        

        return this;
    }



    /**
     * Crée les différentes pages et rend utilisable les fonctions paginate*()
     */
    createPagination() {
        this.pagination.enabled = true;
        this.pagination.pages = [[]];

        let pageI = 0;
        let pageCount = 0;
        for (let i=0; i<this.events.filtered.length; i++) {
            if(pageCount>=this.pagination.countPerPage) {
                pageCount = 0;
                pageI++;
                this.pagination.pages[pageI] = [];
            }
            
            pageCount++;
            this.pagination.pages[pageI].push(this.events.filtered[i]);
        }

        return this;
    }



    canPaginateNext() {return this.pagination.currentPageN+1 < this.pagination.pages.length}
    canPaginatePrevious() {return this.pagination.currentPageN-1 >= 0}
    canPaginateTo(pageN) {return 0 <= pageN && pageN < this.pagination.pages.length}

    /**
     * Affiche les résultats de la page 
     * 
     * @param {integer} 
     * @returns {EventManager} EventManager
     */
    paginateTo(pageN) {
        if(this.canPaginateTo(pageN)) {
            this.pagination.currentPageN = pageN;
            this.clearDOM().renderDOM();
        }

        return this;
    }



    /**
     * Affiche les résultats de la page précédente si on est pas au début
     * 
     * @returns {EventManager} EventManager
     */
    paginatePrevious() {
        if( this.canPaginatePrevious() ) {
            this.pagination.currentPageN--;
            this.clearDOM().renderDOM();
        }

        return this;
    }



    /**
     * Affiche les résultats de la page suivante
     * 
     * @returns {EventManager} EventManager
     */
    paginateNext() {
        if( this.canPaginateNext() ) {
            this.pagination.currentPageN++;
            this.clearDOM().renderDOM();
        }

        return this;
    }



    /**
     * Affiche les résultats de la page suivante page suivante sans effacer le reste
     * 
     * @returns {EventManager} EventManager
     */
    loadMore() {
        this.pagination.currentPageN++;
        this.renderDOM();

        return this;
    }
}

module.exports = { EventManager };
