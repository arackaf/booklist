System.registerDynamic("applicationRoot/rootComponents/mainNavigation.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
      var object = _x,
          property = _x2,
          receiver = _x3;
      desc = parent = getter = undefined;
      _again = false;
      if (object === null)
        object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);
      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
          return undefined;
        } else {
          _x = parent;
          _x2 = property;
          _x3 = receiver;
          _again = true;
          continue _function;
        }
      } else if ('value' in desc) {
        return desc.value;
      } else {
        var getter = desc.get;
        if (getter === undefined) {
          return undefined;
        }
        return getter.call(receiver);
      }
    }
  };
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  var Navbar = ReactBootstrap.Navbar;
  var Nav = ReactBootstrap.Nav;
  var NavItem = ReactBootstrap.NavItem;
  var MainNavigationBar = (function(_React$Component) {
    _inherits(MainNavigationBar, _React$Component);
    function MainNavigationBar() {
      _classCallCheck(this, MainNavigationBar);
      _get(Object.getPrototypeOf(MainNavigationBar.prototype), 'constructor', this).apply(this, arguments);
    }
    _createClass(MainNavigationBar, [{
      key: 'logout',
      value: function logout() {
        ajaxUtil.post('/react-redux/logout', {}, function() {
          return reactStartup.forceLogin();
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var isBookEntry = this.props.isBookEntry,
            isBookList = this.props.isBookList;
        return React.createElement(Navbar, {
          style: {
            borderRadius: 0,
            borderRight: 0,
            borderLeft: 0,
            borderTop: 0
          },
          fluid: true
        }, React.createElement(Navbar.Header, null, React.createElement(Navbar.Brand, null, React.createElement('a', {style: {cursor: 'default'}}, 'Book Tracker')), React.createElement(Navbar.Toggle, null)), React.createElement(Navbar.Collapse, null, React.createElement(Nav, null, React.createElement(NavItem, {
          active: isBookEntry,
          href: isBookEntry ? undefined : '#scan'
        }, 'Book entry'), React.createElement(NavItem, {
          active: isBookList,
          href: isBookList ? undefined : '#books'
        }, 'Your books'), React.createElement(NavItem, {onClick: this.logout}, 'Logout'))));
      }
    }]);
    return MainNavigationBar;
  })(React.Component);
  exports['default'] = MainNavigationBar;
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("modules/books/actions/bookSubjectModify/actionCreators.js", ["./actionNames"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  exports.cancelBookSubjectModification = cancelBookSubjectModification;
  exports.setBooksSubjects = setBooksSubjects;
  exports.toggleSubjectModificationAdd = toggleSubjectModificationAdd;
  exports.toggleSubjectModificationRemove = toggleSubjectModificationRemove;
  exports.enableSubjectModificationSingleBook = enableSubjectModificationSingleBook;
  exports.enableSubjectModificationToggledBooks = enableSubjectModificationToggledBooks;
  exports.subjectModificationClearSubjects = subjectModificationClearSubjects;
  var _actionNames = $__require('./actionNames');
  function cancelBookSubjectModification() {
    return {type: _actionNames.CANCEL_BOOKS_SUBJECT_MODIFICATION};
  }
  function setBooksSubjects(books, add, remove) {
    return function(dispatch, getState) {
      dispatch({type: _actionNames.SETTING_BOOKS_SUBJECTS});
      ajaxUtil.post('/bookBulk/setSubjects', {
        books: books,
        add: add,
        remove: remove
      }, function(resp) {
        dispatch({
          type: _actionNames.SET_BOOKS_SUBJECTS,
          books: books,
          add: add,
          remove: remove
        });
        dispatch({type: _actionNames.FINISHED_SUBJECT_MODIFICATION});
      });
    };
  }
  function toggleSubjectModificationAdd(_id) {
    return {
      type: _actionNames.TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION,
      _id: _id
    };
  }
  function toggleSubjectModificationRemove(_id) {
    return {
      type: _actionNames.TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION,
      _id: _id
    };
  }
  function enableSubjectModificationSingleBook(_id) {
    return {
      type: _actionNames.ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK,
      _id: _id
    };
  }
  function enableSubjectModificationToggledBooks() {
    return {type: _actionNames.ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS};
  }
  function subjectModificationClearSubjects() {
    return {type: _actionNames.CLEAR_SUBJECT_MODIFICATION_SUBJECTS};
  }
  return module.exports;
});

System.registerDynamic("modules/books/actions/actionCreators.js", ["./actionNames", "./bookSubjectModify/actionCreators"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  exports.loadSubjects = loadSubjects;
  exports.loadBooks = loadBooks;
  exports.booksSearch = booksSearch;
  exports.booksResults = booksResults;
  exports.editSubjectsForBook = editSubjectsForBook;
  exports.addSubjectToBook = addSubjectToBook;
  exports.editSubjects = editSubjects;
  exports.setNewSubjectName = setNewSubjectName;
  exports.setNewSubjectParent = setNewSubjectParent;
  exports.stopEditingSubjects = stopEditingSubjects;
  exports.editSubject = editSubject;
  exports.newSubject = newSubject;
  exports.createOrUpdateSubject = createOrUpdateSubject;
  exports.deleteSubject = deleteSubject;
  exports.toggleSelectBook = toggleSelectBook;
  exports.setFilters = setFilters;
  var _actionNames = $__require('./actionNames');
  var _bookSubjectModifyActionCreators = $__require('./bookSubjectModify/actionCreators');
  Object.defineProperty(exports, 'enableSubjectModificationSingleBook', {
    enumerable: true,
    get: function get() {
      return _bookSubjectModifyActionCreators.enableSubjectModificationSingleBook;
    }
  });
  Object.defineProperty(exports, 'enableSubjectModificationToggledBooks', {
    enumerable: true,
    get: function get() {
      return _bookSubjectModifyActionCreators.enableSubjectModificationToggledBooks;
    }
  });
  function loadSubjects() {
    return function(dispatch, getState) {
      dispatch({type: _actionNames.LOAD_SUBJECTS});
      Promise.resolve(ajaxUtil.get('/subject/all')).then(function(subjectsResp) {
        dispatch({
          type: _actionNames.LOAD_SUBJECTS_RESULTS,
          subjects: subjectsResp.results
        });
      });
    };
  }
  function loadBooks() {
    return function(dispatch, getState) {
      dispatch({type: _actionNames.LOAD_BOOKS});
      Promise.resolve(booksSearch(getState().books.bookSearch)).then(function(booksResp) {
        return dispatch(booksResults(booksResp));
      });
    };
  }
  function booksSearch(bookSearchState) {
    return ajaxUtil.get('/book/searchBooks', {
      search: bookSearchState.searchText,
      subjects: Object.keys(bookSearchState.subjects),
      searchChildSubjects: bookSearchState.searchChildSubjects
    });
  }
  function booksResults(resp) {
    return {
      type: _actionNames.LOAD_BOOKS_RESULTS,
      books: resp.results
    };
  }
  function editSubjectsForBook(index) {
    return {
      type: EDIT_SUBJECTS_FOR,
      index: index
    };
  }
  function addSubjectToBook(subject) {
    return function(dispatch, getState) {
      dispatch({type: MODIFY_SUBJECTS});
      setTimeout(function() {
        return dispatch({
          type: MODIFY_SUBJECTS_RESULTS,
          subject: subject
        });
      }, 1000);
    };
  }
  function editSubjects() {
    return {type: _actionNames.EDIT_SUBJECTS};
  }
  function setNewSubjectName(newName) {
    return {
      type: _actionNames.SET_NEW_SUBJECT_NAME,
      value: newName
    };
  }
  function setNewSubjectParent(newParent) {
    return {
      type: _actionNames.SET_NEW_SUBJECT_PARENT,
      value: newParent
    };
  }
  function stopEditingSubjects() {
    return {type: _actionNames.STOP_EDITING_SUBJECTS};
  }
  function editSubject(_id) {
    return {
      type: _actionNames.EDIT_SUBJECT,
      _id: _id
    };
  }
  function newSubject() {
    return {type: _actionNames.NEW_SUBJECT};
  }
  function createOrUpdateSubject() {
    return function(dispatch, getState) {
      var _getState$books$subjects$editSubjectsPacket = getState().books.subjects.editSubjectsPacket;
      var editingSubject = _getState$books$subjects$editSubjectsPacket.editingSubject;
      var newName = _getState$books$subjects$editSubjectsPacket.newSubjectName;
      var newParent = _getState$books$subjects$editSubjectsPacket.newSubjectParent;
      var request = {
        _id: editingSubject ? editingSubject._id : null,
        newName: newName,
        newParent: newParent
      };
      ajaxUtil.post('/subject/setInfo', request, function(resp) {
        dispatch({
          type: _actionNames.UPDATE_SUBJECT_RESULTS,
          newName: newName,
          newParent: newParent,
          affectedSubjects: resp.affectedSubjects
        });
      });
    };
  }
  function deleteSubject() {
    return function(dispatch, getState) {
      var request = {_id: getState().books.subjects.editSubjectsPacket.editingSubject._id + ''};
      ajaxUtil.post('/subject/delete', request, function(resp) {
        dispatch({
          type: _actionNames.SUBJECT_DELETED,
          subjectId: request._id,
          booksUpdated: resp.booksUpdated
        });
      });
    };
  }
  function toggleSelectBook(_id, selected) {
    return {
      type: _actionNames.TOGGLE_SELECT_BOOK,
      _id: _id,
      selected: selected
    };
  }
  function setFilters(text, subjects, searchChildSubjects) {
    return {
      type: _actionNames.SET_FILTERS,
      text: text,
      subjects: subjects,
      searchChildSubjects: searchChildSubjects
    };
  }
  return module.exports;
});

System.registerDynamic("util/responsiveUiLoaders.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var responsiveBsSizes = ['xs', 'sm', 'md', 'lg'];
  function responsiveMobileDesktopMixin(self, stateName, config) {
    var currentlyMobile = undefined;
    var cutoff = config.cutoff || 'sm';
    var mobileCutoffIndex = responsiveBsSizes.indexOf(cutoff);
    if (!self.state) {
      self.state = _defineProperty({}, stateName, null);
    } else {
      self.state[stateName] = null;
    }
    self.responsiveNotifier = new ResponsiveNotifier(function(val) {
      return checkSize(val);
    });
    self.switchToMobile = function() {
      this.overridden = true;
      loadComponent.call(self, config.mobile, true);
    };
    self.switchToDesktop = function() {
      this.overridden = true;
      loadComponent.call(self, config.desktop, false);
    };
    var originalComponentWillDismount = self.componentWillUnmount;
    self.componentWillUnmount = function() {
      this.responsiveNotifier.dispose();
      typeof originalComponentWillDismount === 'function' && originalComponentWillDismount.call(this);
    };
    function checkSize(currentSize) {
      if (self.overridden)
        return;
      var isMobile = responsiveBsSizes.indexOf(currentSize) <= mobileCutoffIndex;
      if (isMobile !== currentlyMobile) {
        currentlyMobile = isMobile;
        loadComponent(currentlyMobile ? config.mobile : config.desktop, isMobile);
      }
    }
    function loadComponent(componentObjOrPath, isMobile) {
      var componentPath = undefined,
          connectComponentWith = undefined,
          mapDispatchWith = undefined;
      if (typeof componentObjOrPath === 'object') {
        componentPath = componentObjOrPath.path;
        connectComponentWith = componentObjOrPath.connectWith;
        mapDispatchWith = componentObjOrPath.mapDispatchWith;
      } else {
        componentPath = componentObjOrPath;
      }
      System['import'](componentPath).then(function(component) {
        var _self$setState;
        if (connectComponentWith) {
          component = ReactRedux.connect(connectComponentWith, mapDispatchWith)(component);
        }
        self.setState((_self$setState = {}, _defineProperty(_self$setState, stateName, component), _defineProperty(_self$setState, 'isMobile', isMobile), _self$setState));
      });
    }
  }
  module.exports = {responsiveMobileDesktopMixin: responsiveMobileDesktopMixin};
  return module.exports;
});

System.registerDynamic("modules/books/components/bookViewList.js", ["../../../applicationRoot/rootComponents/mainNavigation", "../actions/actionCreators", "../../../util/responsiveUiLoaders", "../reducers/reducer"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
      var object = _x,
          property = _x2,
          receiver = _x3;
      desc = parent = getter = undefined;
      _again = false;
      if (object === null)
        object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);
      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
          return undefined;
        } else {
          _x = parent;
          _x2 = property;
          _x3 = receiver;
          _again = true;
          continue _function;
        }
      } else if ('value' in desc) {
        return desc.value;
      } else {
        var getter = desc.get;
        if (getter === undefined) {
          return undefined;
        }
        return getter.call(receiver);
      }
    }
  };
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj['default'] = obj;
      return newObj;
    }
  }
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  var _applicationRootRootComponentsMainNavigation = $__require('../../../applicationRoot/rootComponents/mainNavigation');
  var _applicationRootRootComponentsMainNavigation2 = _interopRequireDefault(_applicationRootRootComponentsMainNavigation);
  var _actionsActionCreators = $__require('../actions/actionCreators');
  var actionCreators = _interopRequireWildcard(_actionsActionCreators);
  var _require = $__require('../actions/actionCreators');
  var loadBooks = _require.loadBooks;
  var loadSubjects = _require.loadSubjects;
  var editSubjectsForBook = _require.editSubjectsForBook;
  var addSubjectToBook = _require.addSubjectToBook;
  var loadBooksAndSubjects = _require.loadBooksAndSubjects;
  var _require2 = $__require('../../../util/responsiveUiLoaders');
  var responsiveMobileDesktopMixin = _require2.responsiveMobileDesktopMixin;
  var _require3 = $__require('../reducers/reducer');
  var selector = _require3.selector;
  function BookListLoading() {
    return React.createElement('div', {style: {height: '150'}}, 'Loading ', React.createElement('i', {className: 'fa fa-spinner fa-spin'}));
  }
  function BookListNoResults() {
    return React.createElement('div', {style: {height: '150'}}, 'No results');
  }
  var BookViewingList = (function(_React$Component) {
    _inherits(BookViewingList, _React$Component);
    function BookViewingList() {
      _classCallCheck(this, BookViewingList);
      _get(Object.getPrototypeOf(BookViewingList.prototype), 'constructor', this).call(this);
      responsiveMobileDesktopMixin(this, 'listComponent', {
        mobile: {
          path: './modules/books/components/bookViewList-mobile',
          connectWith: selector
        },
        desktop: {
          path: './modules/books/components/bookViewList-desktop',
          connectWith: selector,
          mapDispatchWith: actionCreators
        }
      });
    }
    _createClass(BookViewingList, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.props.dispatch(loadSubjects());
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(newProps) {
        if (newProps.bookSearch.isDirty) {
          this.props.dispatch(loadBooks());
        }
      }
    }, {
      key: 'addSubject',
      value: function addSubject(subject) {
        this.props.dispatch(addSubjectToBook(subject));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this = this;
        return React.createElement('div', null, React.createElement(_applicationRootRootComponentsMainNavigation2['default'], {isBookList: true}), React.createElement('div', {
          className: 'panel panel-default',
          style: {margin: '10'}
        }, React.createElement('div', {
          className: 'panel-body',
          style: {padding: 0}
        }, !this.state.listComponent ? React.createElement(BookListLoading, null) : React.createElement(this.state.listComponent, {addSubject: function addSubject(s) {
            return _this.addSubject(s);
          }}))), React.createElement('div', {className: 'well well-sm'}, React.createElement('img', {
          width: '16',
          height: '16',
          src: '/static/main-icon.png'
        }), React.createElement('span', null, 'Track my books'), this.state.isMobile ? React.createElement('a', {
          onClick: function() {
            return _this.switchToDesktop();
          },
          className: 'pull-right'
        }, 'Desktop site') : null));
      }
    }]);
    return BookViewingList;
  })(React.Component);
  module.exports = BookViewingList;
  return module.exports;
});

System.registerDynamic("modules/books/reducers/booksReducer.js", ["../../../util/reselect", "../actions/actionNames", "../actions/bookSubjectModify/actionNames", "../util/booksSubjectsHelpers"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var _require = $__require('../../../util/reselect');
  var createSelector = _require.createSelector;
  var _require2 = $__require('../actions/actionNames');
  var LOAD_BOOKS = _require2.LOAD_BOOKS;
  var LOAD_BOOKS_RESULTS = _require2.LOAD_BOOKS_RESULTS;
  var TOGGLE_SELECT_BOOK = _require2.TOGGLE_SELECT_BOOK;
  var SELECT_ALL_BOOKS = _require2.SELECT_ALL_BOOKS;
  var DE_SELECT_ALL_BOOKS = _require2.DE_SELECT_ALL_BOOKS;
  var SUBJECT_DELETED = _require2.SUBJECT_DELETED;
  var _require3 = $__require('../actions/bookSubjectModify/actionNames');
  var SET_BOOKS_SUBJECTS = _require3.SET_BOOKS_SUBJECTS;
  var _require4 = $__require('../util/booksSubjectsHelpers');
  var setBookResultsSubjects = _require4.setBookResultsSubjects;
  var initialBooksState = {
    booksHash: {},
    loading: false,
    selectedBooks: {}
  };
  function booksReducer(state, action) {
    if (state === undefined)
      state = initialBooksState;
    switch (action.type) {
      case LOAD_BOOKS:
        return Object.assign({}, state, {loading: true});
      case LOAD_BOOKS_RESULTS:
        return Object.assign({}, state, {
          loading: false,
          booksHash: createBooksHash(action.books)
        });
      case TOGGLE_SELECT_BOOK:
        return Object.assign({}, state, {selectedBooks: _extends({}, state.selectedBooks, _defineProperty({}, action._id, !state.selectedBooks[action._id]))});
      case SELECT_ALL_BOOKS:
        var newBookList = state.list.map(function(b) {
          return Object.assign({}, b, {selected: true});
        });
        return Object.assign({}, state, {
          list: newBookList,
          selectedCount: newBookList.length
        });
      case DE_SELECT_ALL_BOOKS:
        var newBookList = state.list.map(function(b) {
          return Object.assign({}, b, {selected: false});
        });
        return Object.assign({}, state, {
          list: newBookList,
          selectedCount: 0
        });
      case SET_BOOKS_SUBJECTS:
        var newBookHash = _extends({}, state.booksHash);
        action.books.forEach(function(_id) {
          var book = _extends({}, newBookHash[_id]),
              booksSubjectsHash = {};
          book.subjects.forEach(function(_id) {
            return booksSubjectsHash[_id] = true;
          });
          action.add.forEach(function(sAdd) {
            return booksSubjectsHash[sAdd] = true;
          });
          action.remove.forEach(function(sAdd) {
            return booksSubjectsHash[sAdd] = false;
          });
          book.subjects = Object.keys(booksSubjectsHash).filter(function(_id) {
            return booksSubjectsHash[_id];
          });
          newBookHash[_id] = book;
        });
        return Object.assign({}, state, {booksHash: newBookHash});
      case SUBJECT_DELETED:
        var newBookHash = Object.assign({}, state.booksHash);
        action.booksUpdated.forEach(function(_id) {
          var bookEntry = newBookHash[_id];
          newBookHash[_id] = _extends({}, bookEntry, {subjects: bookEntry.subjects.filter(function(sid) {
              return sid != action.subjectId;
            })});
        });
        return Object.assign({}, state, {booksHash: newBookHash});
    }
    return state;
  }
  function createBooksHash(booksArr) {
    var result = {};
    booksArr.forEach(function(book) {
      return result[book._id] = book;
    });
    return result;
  }
  var booksWithSubjectsSelector = createSelector([function(state) {
    return state.books.booksHash;
  }, function(state) {
    return state.subjects.subjectHash;
  }], setBookResultsSubjects);
  var booksSelector = function booksSelector(state) {
    return Object.assign({}, state.books, {
      list: booksWithSubjectsSelector(state),
      selectedBooksCount: Object.keys(state.books.selectedBooks).filter(function(k) {
        return state.books.selectedBooks[k];
      }).length
    });
  };
  module.exports = {
    booksReducer: booksReducer,
    booksSelector: booksSelector
  };
  return module.exports;
});

System.registerDynamic("modules/books/util/booksSubjectsHelpers.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  exports.setBookResultsSubjects = setBookResultsSubjects;
  exports.stackAndGetTopLevelSubjects = stackAndGetTopLevelSubjects;
  exports.allSubjectsSorted = allSubjectsSorted;
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0,
          arr2 = Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  function setBookResultsSubjects(booksHash, subjectsHash) {
    var books = Object.keys(booksHash).map(function(_id) {
      return booksHash[_id];
    });
    books.forEach(function(b) {
      return b.subjectObjects = b.subjects.map(function(s) {
        return subjectsHash[s] || {name: '<subject not found>'};
      });
    });
    return books;
  }
  function stackAndGetTopLevelSubjects(subjectsHash) {
    var subjects = Object.keys(subjectsHash).map(function(_id) {
      return subjectsHash[_id];
    });
    subjects.forEach(function(s) {
      var _s$children;
      s.children = [];
      (_s$children = s.children).push.apply(_s$children, _toConsumableArray(subjects.filter(function(sc) {
        return new RegExp(',' + s._id + ',$').test(sc.path);
      })));
    });
    return subjects.filter(function(s) {
      return s.path == null;
    });
  }
  function allSubjectsSorted(subjectsHash) {
    var subjects = Object.keys(subjectsHash).map(function(_id) {
      return subjectsHash[_id];
    });
    return subjects.sort(function(_ref, _ref2) {
      var name1 = _ref.name;
      var name2 = _ref2.name;
      var name1After = name1.toLowerCase() > name2.toLowerCase(),
          bothEqual = name1.toLowerCase() === name2.toLowerCase();
      return bothEqual ? 0 : name1After ? 1 : -1;
    });
  }
  return module.exports;
});

System.registerDynamic("modules/books/reducers/subjectsReducer.js", ["../actions/actionNames", "../util/booksSubjectsHelpers", "../../../util/reselect"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  var _actionsActionNames = $__require('../actions/actionNames');
  var _utilBooksSubjectsHelpers = $__require('../util/booksSubjectsHelpers');
  var _require = $__require('../../../util/reselect');
  var createSelector = _require.createSelector;
  var initialSubjectsState = {
    subjectHash: {},
    editSubjectsPacket: null,
    loaded: false
  };
  function subjectsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialSubjectsState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    switch (action.type) {
      case _actionsActionNames.LOAD_SUBJECTS_RESULTS:
        return Object.assign({}, state, {
          subjectHash: subjectsToHash(action.subjects),
          loaded: true
        });
      case _actionsActionNames.EDIT_SUBJECTS:
        return Object.assign({}, state, {editSubjectsPacket: {
            newSubjectName: '',
            newSubjectParent: '',
            editingSubjectId: ''
          }});
      case _actionsActionNames.SET_NEW_SUBJECT_NAME:
        return Object.assign({}, state, {editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, {newSubjectName: action.value})});
      case _actionsActionNames.SET_NEW_SUBJECT_PARENT:
        return Object.assign({}, state, {editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, {newSubjectParent: action.value})});
      case _actionsActionNames.STOP_EDITING_SUBJECTS:
        return Object.assign({}, state, {editSubjectsPacket: null});
      case _actionsActionNames.NEW_SUBJECT:
        var eligibleParents = flattenedSubjects(state.subjectHash);
        return Object.assign({}, state, {editSubjectsPacket: {
            editing: true,
            newSubjectName: '',
            newSubjectParent: '',
            editingSubject: null,
            eligibleParents: eligibleParents
          }});
      case _actionsActionNames.EDIT_SUBJECT:
        var editingSubject = state.subjectHash[action._id],
            newSubjectParent,
            eligibleParents = flattenedSubjects(state.subjectHash).filter(function(s) {
              return s._id !== action._id && !new RegExp(',' + action._id + ',').test(s.path);
            });
        if (editingSubject.path == null) {
          newSubjectParent = null;
        } else {
          var hierarchy = editingSubject.path.split(',');
          newSubjectParent = hierarchy[hierarchy.length - 2];
        }
        return Object.assign({}, state, {editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, {
            editing: true,
            newSubjectName: editingSubject.name,
            newSubjectParent: newSubjectParent || '',
            editingSubject: editingSubject,
            eligibleParents: eligibleParents
          })});
      case _actionsActionNames.UPDATE_SUBJECT_RESULTS:
        var changedSubjects = subjectsToHash(action.affectedSubjects);
        return Object.assign({}, state, {
          editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, {
            editing: false,
            editingSubject: null
          }),
          subjectHash: Object.assign({}, state.subjectHash, changedSubjects)
        });
      case _actionsActionNames.SUBJECT_DELETED:
        var editSubjectsPacket = Object.assign({}, state.editSubjectsPacket, {editing: false});
        var subjectHash = _extends({}, state.subjectHash);
        delete subjectHash[action.subjectId];
        return Object.assign({}, state, {
          editSubjectsPacket: editSubjectsPacket,
          subjectHash: subjectHash
        });
    }
    return state;
  }
  function subjectsToHash(subjects) {
    var hash = {};
    subjects.forEach(function(s) {
      return hash[s._id] = s;
    });
    return hash;
  }
  function flattenedSubjects(subjects) {
    return Object.keys(subjects).map(function(k) {
      return subjects[k];
    });
  }
  var stackedSubjectsSelector = createSelector([function(state) {
    return state.subjectHash;
  }], function(subjectHash) {
    return {
      list: (0, _utilBooksSubjectsHelpers.stackAndGetTopLevelSubjects)(subjectHash),
      allSubjectsSorted: (0, _utilBooksSubjectsHelpers.allSubjectsSorted)(subjectHash)
    };
  });
  var subjectsSelector = function subjectsSelector(state) {
    return Object.assign({}, state.subjects, _extends({}, stackedSubjectsSelector(state.subjects)));
  };
  module.exports = {
    subjectsReducer: subjectsReducer,
    subjectsSelector: subjectsSelector
  };
  return module.exports;
});

System.registerDynamic("modules/books/actions/actionNames.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    LOAD_BOOKS: 'LOAD_BOOKS',
    LOAD_BOOKS_RESULTS: 'LOAD_BOOKS_RESULTS',
    LOAD_SUBJECTS: 'LOAD_SUBJECTS',
    LOAD_SUBJECTS_RESULTS: 'LOAD_SUBJECTS_RESULTS',
    TOGGLE_SELECT_BOOK: 'TOGGLE_SELECT_BOOK',
    SELECT_ALL_BOOKS: 'SELECT_ALL_BOOKS',
    DE_SELECT_ALL_BOOKS: 'DE_SELECT_ALL_BOOKS',
    EDIT_SUBJECT: 'EDIT_SUBJECT',
    NEW_SUBJECT: 'NEW_SUBJECT',
    EDIT_SUBJECTS: 'EDIT_SUBJECTS',
    SET_NEW_SUBJECT_NAME: 'SET_NEW_SUBJECT_NAME',
    SET_NEW_SUBJECT_PARENT: 'SET_NEW_SUBJECT_PARENT',
    STOP_EDITING_SUBJECTS: 'STOP_EDITING_SUBJECTS',
    UPDATE_SUBJECT: 'UPDATE_SUBJECT',
    UPDATE_SUBJECT_RESULTS: 'UPDATE_SUBJECT_RESULTS',
    CANCEL_PENDING_FILTERED_SUBJECTS: 'CANCEL_PENDING_FILTERED_SUBJECTS',
    CLEAR_SUBJECT_MODIFICATION_SUBJECTS: 'CLEAR_SUBJECT_MODIFICATION_SUBJECTS',
    CANCEL_SUBJECT_MODIFICATION: 'CANCEL_SUBJECT_MODIFICATION',
    SET_FILTERS: 'SET_FILTERS',
    SUBJECT_DELETED: 'SUBJECT_DELETED'
  };
  return module.exports;
});

System.registerDynamic("modules/books/reducers/bookSearchReducer.js", ["../actions/actionNames"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  var _actionsActionNames = $__require('../actions/actionNames');
  var initialState = {
    searchText: '',
    subjects: {},
    searchChildSubjects: false,
    isDirty: false
  };
  function bookSearchReducer(state, action) {
    if (state === undefined)
      state = initialState;
    switch (action.type) {
      case _actionsActionNames.SET_FILTERS:
        var newIsDirty = state.searchText != action.text || subjectsDifferent(state.subjects, action.subjects) || state.searchChildSubjects != action.searchChildSubjects;
        return Object.assign({}, state, {
          searchText: action.text,
          subjects: _extends({}, action.subjects),
          searchChildSubjects: action.searchChildSubjects,
          isDirty: newIsDirty
        });
      case _actionsActionNames.LOAD_BOOKS:
        return Object.assign({}, state, {isDirty: false});
    }
    return state;
  }
  function subjectsDifferent(oldSubjects, newSubjects) {
    return Object.keys(oldSubjects).filter(function(k) {
      return oldSubjects[k];
    }).sort().join('-') !== Object.keys(newSubjects).filter(function(k) {
      return newSubjects[k];
    }).sort().join('-');
  }
  function projectselectedSubjects(selectedSubjectsIds, subjects) {
    return Object.keys(selectedSubjectsIds).filter(function(k) {
      return selectedSubjectsIds[k];
    }).map(function(_id) {
      return subjects[_id];
    }).filter(function(s) {
      return s;
    });
  }
  var bookSearchSelector = function bookSearchSelector(state) {
    return Object.assign({}, state.bookSearch, {selectedSubjects: projectselectedSubjects(state.bookSearch.subjects, state.subjects.subjectHash)});
  };
  module.exports = {
    bookSearchReducer: bookSearchReducer,
    bookSearchSelector: bookSearchSelector
  };
  return module.exports;
});

System.registerDynamic("modules/books/actions/bookSubjectModify/actionNames.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  var ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK = 'ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK';
  exports.ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK = ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK;
  var ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS = 'ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS';
  exports.ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS = ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS;
  var TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION = 'TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION';
  exports.TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION = TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION;
  var TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION = 'TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION';
  exports.TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION = TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION;
  var SETTING_BOOKS_SUBJECTS = 'SETTING_BOOKS_SUBJECTS';
  exports.SETTING_BOOKS_SUBJECTS = SETTING_BOOKS_SUBJECTS;
  var SET_BOOKS_SUBJECTS = 'SET_BOOKS_SUBJECTS';
  exports.SET_BOOKS_SUBJECTS = SET_BOOKS_SUBJECTS;
  var CANCEL_BOOKS_SUBJECT_MODIFICATION = 'CANCEL_BOOKS_SUBJECT_MODIFICATION';
  exports.CANCEL_BOOKS_SUBJECT_MODIFICATION = CANCEL_BOOKS_SUBJECT_MODIFICATION;
  var CLEAR_SUBJECT_MODIFICATION_SUBJECTS = 'CLEAR_SUBJECT_MODIFICATION_SUBJECTS';
  exports.CLEAR_SUBJECT_MODIFICATION_SUBJECTS = CLEAR_SUBJECT_MODIFICATION_SUBJECTS;
  var FINISHED_SUBJECT_MODIFICATION = 'FINISHED_SUBJECT_MODIFICATION';
  exports.FINISHED_SUBJECT_MODIFICATION = FINISHED_SUBJECT_MODIFICATION;
  return module.exports;
});

System.registerDynamic("util/reselect.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  exports.defaultMemoize = defaultMemoize;
  exports.createSelectorCreator = createSelectorCreator;
  exports.createSelector = createSelector;
  exports.createStructuredSelector = createStructuredSelector;
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0,
          arr2 = Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  function defaultEqualityCheck(a, b) {
    return a === b;
  }
  function defaultMemoize(func) {
    var equalityCheck = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCheck : arguments[1];
    var lastArgs = null;
    var lastResult = null;
    return function() {
      for (var _len = arguments.length,
          args = Array(_len),
          _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (lastArgs !== null && args.every(function(value, index) {
        return equalityCheck(value, lastArgs[index]);
      })) {
        return lastResult;
      }
      lastArgs = args;
      lastResult = func.apply(undefined, args);
      return lastResult;
    };
  }
  function getDependencies(funcs) {
    var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
    if (!dependencies.every(function(dep) {
      return typeof dep === 'function';
    })) {
      var dependencyTypes = dependencies.map(function(dep) {
        return typeof dep;
      }).join(', ');
      throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
    }
    return dependencies;
  }
  function createSelectorCreator(memoize) {
    for (var _len2 = arguments.length,
        memoizeOptions = Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1; _key2 < _len2; _key2++) {
      memoizeOptions[_key2 - 1] = arguments[_key2];
    }
    return function() {
      for (var _len3 = arguments.length,
          funcs = Array(_len3),
          _key3 = 0; _key3 < _len3; _key3++) {
        funcs[_key3] = arguments[_key3];
      }
      var recomputations = 0;
      var resultFunc = funcs.pop();
      var dependencies = getDependencies(funcs);
      var memoizedResultFunc = memoize.apply(undefined, [function() {
        recomputations++;
        return resultFunc.apply(undefined, arguments);
      }].concat(memoizeOptions));
      var selector = function selector(state, props) {
        for (var _len4 = arguments.length,
            args = Array(_len4 > 2 ? _len4 - 2 : 0),
            _key4 = 2; _key4 < _len4; _key4++) {
          args[_key4 - 2] = arguments[_key4];
        }
        var params = dependencies.map(function(dependency) {
          return dependency.apply(undefined, [state, props].concat(args));
        });
        return memoizedResultFunc.apply(undefined, _toConsumableArray(params));
      };
      selector.recomputations = function() {
        return recomputations;
      };
      return selector;
    };
  }
  function createSelector() {
    return createSelectorCreator(defaultMemoize).apply(undefined, arguments);
  }
  function createStructuredSelector(selectors) {
    var selectorCreator = arguments.length <= 1 || arguments[1] === undefined ? createSelector : arguments[1];
    if (typeof selectors !== 'object') {
      throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
    }
    var objectKeys = Object.keys(selectors);
    return selectorCreator(objectKeys.map(function(key) {
      return selectors[key];
    }), function() {
      for (var _len5 = arguments.length,
          values = Array(_len5),
          _key5 = 0; _key5 < _len5; _key5++) {
        values[_key5] = arguments[_key5];
      }
      return values.reduce(function(composition, value, index) {
        composition[objectKeys[index]] = value;
        return composition;
      }, {});
    });
  }
  return module.exports;
});

System.registerDynamic("modules/books/reducers/booksSubjectModifierReducer.js", ["../actions/bookSubjectModify/actionNames", "../../../util/reselect"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var _actionsBookSubjectModifyActionNames = $__require('../actions/bookSubjectModify/actionNames');
  var _require = $__require('../../../util/reselect');
  var createSelector = _require.createSelector;
  var bookSubjectManagerInitialState = {
    singleBookModify: null,
    selectedBooksModify: false,
    addingSubjects: {},
    removingSubjects: {},
    settingBooksSubjects: false
  };
  function bookSubjectManagerReducer(state, action) {
    if (state === undefined)
      state = bookSubjectManagerInitialState;
    switch (action.type) {
      case _actionsBookSubjectModifyActionNames.SETTING_BOOKS_SUBJECTS:
        return Object.assign({}, state, {settingBooksSubjects: true});
      case _actionsBookSubjectModifyActionNames.SET_BOOKS_SUBJECTS:
        return Object.assign({}, state, {settingBooksSubjects: false});
      case _actionsBookSubjectModifyActionNames.ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK:
        return Object.assign({}, state, {singleBookModify: action._id});
      case _actionsBookSubjectModifyActionNames.ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS:
        return Object.assign({}, state, {selectedBooksModify: true});
      case _actionsBookSubjectModifyActionNames.CLEAR_SUBJECT_MODIFICATION_SUBJECTS:
        return Object.assign({}, state, {
          addingSubjects: {},
          removingSubjects: {}
        });
      case _actionsBookSubjectModifyActionNames.CANCEL_BOOKS_SUBJECT_MODIFICATION:
        return Object.assign({}, state, {
          singleBookModify: null,
          selectedBooksModify: false
        });
      case _actionsBookSubjectModifyActionNames.TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION:
        return Object.assign({}, state, {addingSubjects: _extends({}, state.addingSubjects, _defineProperty({}, action._id, !state.addingSubjects[action._id]))});
      case _actionsBookSubjectModifyActionNames.FINISHED_SUBJECT_MODIFICATION:
        return Object.assign({}, state, {
          addingSubjects: {},
          removingSubjects: {},
          singleBookModify: null,
          selectedBooksModify: false
        });
      case _actionsBookSubjectModifyActionNames.TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION:
        return Object.assign({}, state, {removingSubjects: _extends({}, state.removingSubjects, _defineProperty({}, action._id, !state.removingSubjects[action._id]))});
    }
    return state;
  }
  var modifyingBooksSelector = createSelector([function(state) {
    return state.booksSubjectsModifier.singleBookModify;
  }, function(state) {
    return state.booksSubjectsModifier.selectedBooksModify;
  }, function(state) {
    return state.books;
  }], function(singleBookModify, selectedBooksModify, books) {
    var modifyingBookIds = singleBookModify ? [singleBookModify] : selectedBooksModify ? Object.keys(books.selectedBooks).filter(function(k) {
      return books.selectedBooks[k];
    }) : [];
    return modifyingBookIds.filter(function(_id) {
      return _id;
    }).map(function(_id) {
      return books.booksHash[_id];
    });
  });
  var addingSubjectsSelector = createSelector([function(state) {
    return state.booksSubjectsModifier.addingSubjects;
  }, function(state) {
    return state.subjects.subjectHash;
  }], function(adding, subjects) {
    return Object.keys(adding).filter(function(_id) {
      return adding[_id];
    }).map(function(_id) {
      return subjects[_id];
    });
  });
  var removingSubjectsSelector = createSelector([function(state) {
    return state.booksSubjectsModifier.removingSubjects;
  }, function(state) {
    return state.subjects.subjectHash;
  }], function(removing, subjects) {
    return Object.keys(removing).filter(function(_id) {
      return removing[_id];
    }).map(function(_id) {
      return subjects[_id];
    });
  });
  var booksSubjectsModifierSelector = createSelector([function(state) {
    return state.booksSubjectsModifier;
  }, modifyingBooksSelector, addingSubjectsSelector, removingSubjectsSelector], function(booksSubjectsModifier, modifyingBooks, addingSubjects, removingSubjects) {
    return {
      addingSubjectIds: booksSubjectsModifier.addingSubjects,
      removingSubjectIds: booksSubjectsModifier.removingSubjects,
      settingBooksSubjects: booksSubjectsModifier.settingBooksSubjects,
      modifyingBooks: modifyingBooks,
      addingSubjects: addingSubjects,
      removingSubjects: removingSubjects
    };
  });
  module.exports = {
    bookSubjectManagerReducer: bookSubjectManagerReducer,
    booksSubjectsModifierSelector: booksSubjectsModifierSelector
  };
  return module.exports;
});

System.registerDynamic("modules/books/reducers/reducer.js", ["./booksReducer", "./subjectsReducer", "./bookSearchReducer", "./booksSubjectModifierReducer"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _require = $__require('./booksReducer');
  var books = _require.booksReducer;
  var booksSelector = _require.booksSelector;
  var _require2 = $__require('./subjectsReducer');
  var subjects = _require2.subjectsReducer;
  var subjectsSelector = _require2.subjectsSelector;
  var _require3 = $__require('./bookSearchReducer');
  var bookSearch = _require3.bookSearchReducer;
  var bookSearchSelector = _require3.bookSearchSelector;
  var _require4 = $__require('./booksSubjectModifierReducer');
  var booksSubjectsModifier = _require4.bookSubjectManagerReducer;
  var booksSubjectsModifierSelector = _require4.booksSubjectsModifierSelector;
  var reducer = Redux.combineReducers({
    books: books,
    subjects: subjects,
    bookSearch: bookSearch,
    booksSubjectsModifier: booksSubjectsModifier
  });
  var bookListSelector = function bookListSelector(state) {
    return {
      subjects: subjectsSelector(state.books),
      books: booksSelector(state.books),
      bookSearch: bookSearchSelector(state.books),
      booksSubjectsModifier: booksSubjectsModifierSelector(state.books)
    };
  };
  module.exports = {
    reducer: reducer,
    selector: bookListSelector
  };
  return module.exports;
});

System.registerDynamic("modules/books/books.js", ["./components/bookViewList", "./reducers/reducer"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var BookViewList = $__require('./components/bookViewList');
  var _require = $__require('./reducers/reducer');
  var reducer = _require.reducer;
  var selector = _require.selector;
  BookViewList = ReactRedux.connect(selector)(BookViewList);
  module.exports = {
    name: 'books',
    reducer: reducer,
    component: React.createElement(BookViewList, null)
  };
  return module.exports;
});
