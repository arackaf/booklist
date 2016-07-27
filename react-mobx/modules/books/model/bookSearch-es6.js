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
    @observable pendingSearch = new BookSearchFields()
    @observable activeSearch = new BookSearchFields()

    setSearchFields(packet){
        Object.assign(this.activeSearch);
        this.pendingSearch = this.activeSearch;
    }
    setPendingSearch(){
        this.activeSearch = this.pendingSearch;
    }
    
}

export default BookSearch;