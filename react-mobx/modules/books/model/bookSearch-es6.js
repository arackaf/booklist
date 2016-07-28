import { observable, computed } from 'mobx';
import { observer } from "mobx-react";

class BookSearchFields{
    @observable search = ''
    @observable subjects = []
    @observable tags = []
    @observable searchChildSubjects = false
    @observable sort = ''
    @observable sortDirection = ''
    @observable author = ''
    @observable publisher = ''
    @observable pages = ''
    @observable pagesOperator = ''
    @observable userId = ''
}

class BookSearch{
    @observable searchChanging = false
    beginSearchChange = () => this.searchChanging = true;
    endSearchChange = () => this.searchChanging = false;

    @observable pendingSearch = new BookSearchFields()
    @observable activeSearch = new BookSearchFields()

    setPendingSearchChildSubjects = evt => this.pendingSearch.searchChildSubjects = evt.target.checked;
    setPendingPagesOperator = evt => this.pendingSearch.pagesOperator = evt.target.value;
    setPendingField(property, evt){
        this.pendingSearch[property] = evt.target.value;
    }

    setSearchFieldsFromHashPacket(hashPacket){
        Object.assign(this.activeSearch, this.getNextFilters(hashPacket));
        this.pendingSearch = this.activeSearch;
    }

    getNextFilters(hashPacket) {
        return Object.assign({}, hashPacket, {
            subjects: this.idStringToObject(hashPacket.subjects),
            tags: this.idStringToObject(hashPacket.tags),
            searchChildSubjects: hashPacket.searchChildSubjects ? true : null,
            sortDirection: hashPacket.sortDirection == 'asc' ? 1 : -1
        });
    }

    idStringToObject(str = '') {
        return str.split('-').filter(s => s).reduce((obj, val) => (obj[val] = true, obj), {});
    }

    setPendingSearch(){
        this.activeSearch = this.pendingSearch;
    }
    
}

export default BookSearch;