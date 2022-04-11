class EventManager {
    constructor(rootElementSelector) {
        this.rootEl = document.querySelector(rootElementSelector);

        this.events = {
            fetched: [],
            filtered: []
        }
        
        this.eventTemplate = document.querySelector("template#event-template");
        
        this.pagination = {
            enabled: true,
            countPerPage: 6,
            actualPage: 0
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
        this.pagination.actualPage = 0;
        this.events.filtered = this.events.fetched;

        return this;
    }

    /**
     * Filtre les évènements selon l'année donnée
     * 
     * @param {string} year
     * @param {string} filterFetched - Si true filtre la liste events.fetched
     * 
     * @returns {EventManager} EventManager
     */
    filterByYear(year, filterFetched=true) {
        const eventsToFilter = filterFetched ? [...this.events.fetched] : [...this.events.filtered];
        this.events.filtered = [];

        for(let event of eventsToFilter) {
            if(event.year == year) {
                this.events.filtered.push(event);
            }
        }

        return this;
    }

    /**
     * Filtre les évènements selon la thématique donnée
     * 
     * @param {string} thematique
     * @param {string} filterFetched - Si true filtre la liste events.fetched
     * 
     * @returns {EventManager} EventManager
     */
    filterByThematique(thematique, filterFetched) {
        const eventsToFilter = filterFetched ? [...this.events.fetched] : [...this.events.filtered];
        this.events.filtered = [];

        for(let event of eventsToFilter) {
            if(event.thematique == thematique) {
                this.events.filtered.push(event);
            }
        }
        return this;
    }

    orderBy() {

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
        let iStart, iMax;
        if(!this.pagination.enabled) {
            iStart = 0;
            iMax = this.events.filtered.length;
        } else {
            iStart = this.pagination.actualPage * this.pagination.countPerPage;
            iMax = Math.min(iStart+this.pagination.countPerPage, this.events.filtered.length);
        }
        for(let i=iStart; i<iMax; i++) {
            this.renderEventDOM(this.events.filtered[i])
        }

        return this;
    }


    /**
     * Affiche les résultats de la page 
     * 
     * @param {integer} 
     * @returns {EventManager} EventManager
     */
    paginateTo(page) {
        if(page>=0) {
            this.pagination.actualPage = page;
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
        if(this.pagination.actualPage>0) {
            this.pagination.actualPage--;
            this.clearDOM().renderDOM();
        }

        return this;
    }

    /**
     * Affiche les résultats de la page suivante page suivante
     * 
     * @returns {EventManager} EventManager
     */
    paginateNext() {
        this.pagination.actualPage++;
        this.clearDOM().renderDOM();

        return this;
    }


    /**
     * Affiche les résultats de la page suivante page suivante sans effacer le reste
     * 
     * @returns {EventManager} EventManager
     */
    loadMore() {
        this.pagination.actualPage++;
        this.renderDOM();

        return this;
    }
}

module.exports = { EventManager };
