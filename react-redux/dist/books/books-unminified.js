System.registerDynamic("react-redux/modules/books/components/booklist-menubar/hierarchicalSelectableSubjectList.js", [], true, function($__require, exports, module) {
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
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
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
      } else if ("value" in desc) {
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
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
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
  var Collapse = ReactBootstrap.Collapse;
  var HierarchicalSelectableSubjectItem = (function(_React$Component) {
    _inherits(HierarchicalSelectableSubjectItem, _React$Component);
    function HierarchicalSelectableSubjectItem() {
      _classCallCheck(this, HierarchicalSelectableSubjectItem);
      _get(Object.getPrototypeOf(HierarchicalSelectableSubjectItem.prototype), "constructor", this).call(this);
      this.state = {childrenVisible: false};
    }
    _createClass(HierarchicalSelectableSubjectItem, [{
      key: "toggleChildren",
      value: function toggleChildren() {
        this.setState({childrenVisible: !this.state.childrenVisible});
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;
        var childrenVisible = this.state.childrenVisible;
        return React.createElement("li", {key: this.props._id}, React.createElement("div", null, React.createElement("div", {
          className: "checkbox",
          style: {
            display: 'inline-block',
            marginTop: 0,
            marginBottom: 0
          }
        }, React.createElement("label", null, React.createElement("input", {
          type: "checkbox",
          onChange: function() {
            return _this.props.toggleFilteredSubject(_this.props._id);
          },
          checked: this.props.selectedSubjects[this.props._id]
        }), this.props.name), this.props.children.length ? React.createElement("a", {
          style: {marginLeft: 5},
          onClick: function() {
            return _this.toggleChildren();
          }
        }, React.createElement("i", {className: 'fa fa-' + (childrenVisible ? 'angle-double-up' : 'angle-double-down')})) : null), this.props.children.length ? React.createElement(Collapse, {"in": childrenVisible}, React.createElement("div", null, React.createElement(HierarchicalSelectableSubjectList, {
          style: {paddingLeft: 25},
          selectedSubjects: this.props.selectedSubjects,
          toggleFilteredSubject: this.props.toggleFilteredSubject,
          subjects: this.props.subjects,
          subjects: this.props.children
        }))) : null));
      }
    }]);
    return HierarchicalSelectableSubjectItem;
  })(React.Component);
  var HierarchicalSelectableSubjectList = (function(_React$Component2) {
    _inherits(HierarchicalSelectableSubjectList, _React$Component2);
    function HierarchicalSelectableSubjectList() {
      _classCallCheck(this, HierarchicalSelectableSubjectList);
      _get(Object.getPrototypeOf(HierarchicalSelectableSubjectList.prototype), "constructor", this).apply(this, arguments);
    }
    _createClass(HierarchicalSelectableSubjectList, [{
      key: "render",
      value: function render() {
        var _this2 = this;
        return React.createElement("ul", {style: _extends({}, this.props.style || {}, {listStyle: 'none'})}, this.props.subjects.map(function(s) {
          return React.createElement(HierarchicalSelectableSubjectItem, _extends({
            selectedSubjects: _this2.props.selectedSubjects,
            toggleFilteredSubject: _this2.props.toggleFilteredSubject,
            subjects: _this2.props.subjects,
            key: s._id
          }, s));
        }));
      }
    }]);
    return HierarchicalSelectableSubjectList;
  })(React.Component);
  module.exports = HierarchicalSelectableSubjectList;
  return module.exports;
});

System.registerDynamic("utils/hashManager.js", [], true, function($__require, exports, module) {
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
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var SerializedHash = (function() {
    function SerializedHash(module, submodule, parameters) {
      _classCallCheck(this, SerializedHash);
      this.module = module || '';
      this.submodule = submodule || '';
      this.parameters = parameters || {};
    }
    _createClass(SerializedHash, [{
      key: 'addOrSetValue',
      value: function addOrSetValue(key, value) {
        if (value == null || value === '')
          return;
        if (this.parameters.hasOwnProperty(key)) {
          this.addValue(key, value);
        } else {
          this.setValue(key, value);
        }
      }
    }, {
      key: 'addValue',
      value: function addValue(key, newValue) {
        if (!this.parameters.hasOwnProperty(key)) {
          this.setValue(key, [newValue]);
        } else {
          var priorParameterValue = this.findParameterWithKey(key);
          if (!Array.isArray(priorParameterValue)) {
            this.setValue(key, [priorParameterValue]);
          }
          this.parameters[key].push(newValue);
        }
      }
    }, {
      key: 'setValue',
      value: function setValue(key, value) {
        this.parameters[key] = value;
      }
    }, {
      key: 'removeValue',
      value: function removeValue(key) {
        delete this.parameters[key];
      }
    }, {
      key: 'getValue',
      value: function getValue(key) {
        return this.parameters[key];
      }
    }, {
      key: 'findParameterWithKey',
      value: function findParameterWithKey(key) {
        return this.parameters[key];
      }
    }]);
    return SerializedHash;
  })();
  var HashUtility = (function() {
    function HashUtility() {
      _classCallCheck(this, HashUtility);
    }
    _createClass(HashUtility, [{
      key: 'parseHashTag',
      value: function parseHashTag(hash) {
        if (hash.indexOf('#') > -1) {
          hash = hash.split("#")[1];
        }
        if (hash.charAt(hash.length - 1) === '/') {
          hash = hash.substr(0, hash.length - 1);
        }
        var modSubmodSection = hash.indexOf("?") > -1 ? hash.split("?")[0] : hash;
        var queryStringSection = hash.indexOf("?") > -1 ? hash.split("?")[1] : null;
        var modSections = modSubmodSection.split("/");
        var result = new SerializedHash(modSections[0], modSections[1]);
        if (queryStringSection) {
          var pairs = queryStringSection.split('&');
          for (var i = 0,
              max = pairs.length; i < max; i++) {
            var keyValuePair = pairs[i].split('=');
            var key = keyValuePair[0];
            var value = keyValuePair.length > 1 ? decodeURIComponent(keyValuePair[1]) : undefined;
            result.addOrSetValue(key, value);
          }
        }
        return result;
      }
    }, {
      key: 'createHashTag',
      value: function createHashTag(hashObject) {
        var result = '';
        if (hashObject.module) {
          result += hashObject.module;
        }
        if (hashObject.submodule) {
          result += '/' + hashObject.submodule;
        }
        var allPairs = [];
        if (hashObject.parameters) {
          Object.keys(hashObject.parameters).forEach(function(k) {
            if (Array.isArray(hashObject.parameters[k])) {
              hashObject.parameters[k].forEach(function(val) {
                return allPairs.push(k + '=' + encodeURIComponent(val));
              });
            } else {
              if (hashObject.parameters[k] !== '' && hashObject.parameters[k] != null) {
                allPairs.push(k + '=' + encodeURIComponent(hashObject.parameters[k]));
              }
            }
          });
        }
        if (allPairs.length) {
          result += '/?' + allPairs.join('&');
        }
        return result;
      }
    }, {
      key: 'removeFromHash',
      value: function removeFromHash() {
        var hashInfo = this.parseHashTag(window.location.hash);
        for (var _len = arguments.length,
            keys = Array(_len),
            _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }
        keys.forEach(function(key) {
          return hashInfo.removeValue(key);
        });
        this.setHash(hashInfo);
      }
    }, {
      key: 'addValueOf',
      value: function addValueOf(key, value) {
        var hashInfo = this.parseHashTag(window.location.hash);
        hashInfo.addValue(key, value);
        this.setHash(hashInfo);
      }
    }, {
      key: 'setValueOf',
      value: function setValueOf(key, value) {
        var hashInfo = this.parseHashTag(window.location.hash);
        hashInfo.setValue(key, value);
        this.setHash(hashInfo);
      }
    }, {
      key: 'setValues',
      value: function setValues() {
        var hashInfo = this.parseHashTag(window.location.hash);
        for (var _len2 = arguments.length,
            pairs = Array(_len2),
            _key2 = 0; _key2 < _len2; _key2++) {
          pairs[_key2] = arguments[_key2];
        }
        for (var i = 0; i < pairs.length; i += 2) {
          hashInfo.setValue(pairs[i], pairs[i + 1]);
        }
        this.setHash(hashInfo);
      }
    }, {
      key: 'setHash',
      value: function setHash(hashInfo) {
        var oldHash = window.location.hash,
            newHash = this.createHashTag(hashInfo);
        window.location.hash = newHash;
      }
    }, {
      key: 'getCurrentHashInfo',
      value: function getCurrentHashInfo() {
        return this.parseHashTag(window.location.hash);
      }
    }, {
      key: 'getCurrentHashValueOf',
      value: function getCurrentHashValueOf(name) {
        var hashObject = this.parseHashTag(window.location.hash);
        return hashObject.getValue(name);
      }
    }, {
      key: 'getCurrentHashParameters',
      get: function get() {
        return this.parseHashTag(window.location.hash).parameters;
      }
    }]);
    return HashUtility;
  })();
  module.exports = HashUtility;
  return module.exports;
});

System.registerDynamic("react-redux/modules/books/components/booklist-menubar/booksMenuBar.js", ["../../actions/actionCreators", "./hierarchicalSelectableSubjectList", "root-components/bootstrapButton", "global-utils/hashManager", "../../reducers/bookSearchReducer"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
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
  var _actionsActionCreators = $__require('../../actions/actionCreators');
  var bookSearchActionCreators = _interopRequireWildcard(_actionsActionCreators);
  var Modal = ReactBootstrap.Modal;
  var Navbar = ReactBootstrap.Navbar;
  var Nav = ReactBootstrap.Nav;
  var NavItem = ReactBootstrap.NavItem;
  var NavDropdown = ReactBootstrap.NavDropdown;
  var DropDownButton = ReactBootstrap.DropDownButton;
  var MenuItem = ReactBootstrap.MenuItem;
  var HierarchicalSelectableSubjectList = $__require('./hierarchicalSelectableSubjectList');
  var BootstrapButton = $__require('root-components/bootstrapButton');
  var hashUtil = $__require('global-utils/hashManager');
  var _require = $__require('../../reducers/bookSearchReducer');
  var bookSearchSelector = _require.bookSearchSelector;
  var BooksMenuBar = (function(_React$Component) {
    _inherits(BooksMenuBar, _React$Component);
    function BooksMenuBar(props) {
      var _this = this;
      _classCallCheck(this, BooksMenuBar);
      _get(Object.getPrototypeOf(BooksMenuBar.prototype), 'constructor', this).call(this);
      this.togglePendingSubject = this.togglePendingSubject.bind(this);
      this.hashManager = new hashUtil();
      this.state = {
        pendingSubjects: {},
        menuOpen: false
      };
      this._hashChangeSubscription = function() {
        var subjectsSelected = {},
            selectedSubjectsHashString = _this.hashManager.getCurrentHashValueOf('filterSubjects');
        if (selectedSubjectsHashString) {
          selectedSubjectsHashString.split('-').forEach(function(_id) {
            return subjectsSelected[_id] = true;
          });
        }
        _this.props.setFilters(_this.hashManager.getCurrentHashValueOf('bookSearch') || '', subjectsSelected, _this.hashManager.getCurrentHashValueOf('searchChildSubjects') ? 'true' : null);
      };
      window.addEventListener("hashchange", this._hashChangeSubscription);
    }
    _createClass(BooksMenuBar, [{
      key: 'removeFilterSubject',
      value: function removeFilterSubject(_id) {
        var _this2 = this;
        var selectedSubjectsHashString = this.hashManager.getCurrentHashValueOf('filterSubjects'),
            subjectsArr = selectedSubjectsHashString.split('-');
        subjectsArr = subjectsArr.filter(function(sId) {
          return sId != _id;
        });
        var filterSubjectsVal = subjectsArr.join('-');
        this.hashManager.setValues('filterSubjects', filterSubjectsVal, 'searchChildSubjects', this.props.searchChildSubjects && filterSubjectsVal ? 'true' : null);
        if (!subjectsArr.length) {
          setTimeout(function() {
            return _this2.setState({menuOpen: false});
          }, 1);
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._hashChangeSubscription();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(newProps) {
        if (this.props.searchText !== newProps.searchText) {
          this.refs.searchInput.value = newProps.searchText;
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener("hashchange", this._hashChangeSubscription);
      }
    }, {
      key: 'openSubjectsFilterModal',
      value: function openSubjectsFilterModal() {
        this.setState({
          subjectFiltersModalOpen: true,
          pendingSubjects: this.props.subjects,
          searchChildSubjects: this.props.searchChildSubjects
        });
      }
    }, {
      key: 'closeSubjectsFilterModal',
      value: function closeSubjectsFilterModal() {
        this.setState({subjectFiltersModalOpen: false});
      }
    }, {
      key: 'applySubjectsFilters',
      value: function applySubjectsFilters() {
        var _this3 = this;
        this.setState({subjectFiltersModalOpen: false});
        var filterSubjectsVal = Object.keys(this.state.pendingSubjects).filter(function(k) {
          return _this3.state.pendingSubjects[k];
        }).join('-');
        this.hashManager.setValues('filterSubjects', filterSubjectsVal, 'searchChildSubjects', this.state.searchChildSubjects && filterSubjectsVal ? 'true' : null);
      }
    }, {
      key: 'togglePendingSubject',
      value: function togglePendingSubject(_id) {
        this.setState({pendingSubjects: _extends({}, this.state.pendingSubjects, _defineProperty({}, _id, !this.state.pendingSubjects[_id]))});
      }
    }, {
      key: 'dropdownToggle',
      value: function dropdownToggle(newValue) {
        if (this._forceOpen) {
          this.setState({menuOpen: true});
          this._forceOpen = false;
        } else {
          this.setState({menuOpen: newValue});
        }
      }
    }, {
      key: 'menuItemClickedThatShouldntCloseDropdown',
      value: function menuItemClickedThatShouldntCloseDropdown() {
        this._forceOpen = true;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;
        var selectedSubjectsCount = this.props.selectedSubjects.length,
            selectedSubjectsHeader = 'Searching ' + selectedSubjectsCount + ' Subject' + (selectedSubjectsCount === 1 ? '' : 's');
        return React.createElement('div', null, React.createElement(Navbar, {
          style: {
            border: 0,
            borderRadius: 0
          },
          fluid: true
        }, React.createElement(Navbar.Header, null, React.createElement(Navbar.Brand, null, React.createElement('a', {style: {cursor: 'default'}}, 'Your books')), React.createElement(Navbar.Toggle, null)), React.createElement(Navbar.Collapse, null, React.createElement(Nav, null, React.createElement(NavItem, {
          onClick: this.props.enableSubjectModificationToggledBooks,
          disabled: !this.props.selectedBooksCount
        }, 'Set subjects'), React.createElement(NavItem, {onClick: this.props.editSubjects}, 'Edit subjects')), React.createElement(Navbar.Header, null, React.createElement(Navbar.Brand, null, React.createElement('a', {style: {cursor: 'default'}}, 'Filters'))), React.createElement(Navbar.Form, {pullLeft: true}, React.createElement('div', {className: 'form-group'}, React.createElement('div', {className: 'input-group'}, React.createElement('span', {className: 'input-group-btn'}, React.createElement(BootstrapButton, {
          preset: 'default',
          onClick: function() {
            return _this4.openSubjectsFilterModal();
          }
        }, 'By subject')), React.createElement('input', {
          className: 'form-control',
          placeholder: 'Title search',
          onKeyDown: function(evt) {
            return _this4.searchFilterKeyDown(evt);
          },
          ref: 'searchInput'
        }), React.createElement('span', {className: 'input-group-btn'}, React.createElement('button', {
          className: 'btn btn-default',
          onClick: function() {
            return _this4.setSearchText();
          },
          type: 'button'
        }, React.createElement('i', {className: 'fa fa-search'})))))), selectedSubjectsCount ? React.createElement(Nav, null, React.createElement(NavDropdown, {
          open: this.state.menuOpen,
          onToggle: function(val) {
            return _this4.dropdownToggle(val);
          },
          title: selectedSubjectsHeader,
          id: 'sel-subjects-dropdown'
        }, this.props.selectedSubjects.map(function(s) {
          return React.createElement(MenuItem, {
            onClick: function() {
              return _this4.menuItemClickedThatShouldntCloseDropdown();
            },
            className: 'default-cursor no-hover',
            key: s._id
          }, React.createElement('span', {className: 'label label-default'}, React.createElement('span', {
            onClick: function() {
              return _this4.removeFilterSubject(s._id);
            },
            style: {cursor: 'pointer'}
          }, 'X'), React.createElement('span', {style: {
              marginLeft: 5,
              paddingLeft: 5,
              borderLeft: '1px solid white'
            }}, s.name)));
        }), !!this.props.searchChildSubjects ? React.createElement(MenuItem, {divider: true}) : null, !!this.props.searchChildSubjects ? React.createElement(MenuItem, {
          onClick: function() {
            return _this4.menuItemClickedThatShouldntCloseDropdown();
          },
          className: 'default-cursor no-hover'
        }, React.createElement('span', {className: 'label label-primary'}, 'Searching child subjects')) : null)) : null)), React.createElement(Modal, {
          show: this.state.subjectFiltersModalOpen,
          onHide: function() {
            return _this4.closeSubjectsFilterModal();
          }
        }, React.createElement(Modal.Header, {closeButton: true}, React.createElement(Modal.Title, null, 'Filter subjects')), React.createElement(Modal.Body, null, React.createElement('label', null, 'Also search child subjects ', React.createElement('input', {
          type: 'checkbox',
          onChange: function(evt) {
            return _this4.setState({searchChildSubjects: evt.target.checked});
          },
          checked: this.state.searchChildSubjects
        })), React.createElement(HierarchicalSelectableSubjectList, {
          style: {paddingLeft: 5},
          toggleFilteredSubject: this.togglePendingSubject,
          subjects: this.props.allSubjects,
          selectedSubjects: this.state.pendingSubjects
        }), this.props.selectedSubjects.length ? React.createElement('span', null, 'Selected subjects: ', React.createElement('span', null, this.props.selectedSubjects.map(function(s) {
          return s.name;
        }).join(', '))) : null), React.createElement(Modal.Footer, null, React.createElement(BootstrapButton, {
          preset: 'primary',
          className: 'pull-left',
          onClick: function() {
            return _this4.applySubjectsFilters();
          }
        }, 'Filter'), React.createElement(BootstrapButton, {
          preset: 'default',
          onClick: function() {
            return _this4.closeSubjectsFilterModal();
          }
        }, 'Close'))));
      }
    }, {
      key: 'searchFilterKeyDown',
      value: function searchFilterKeyDown(evt) {
        if (evt.which == 13) {
          this.hashManager.setValueOf('bookSearch', evt.target.value);
        }
      }
    }, {
      key: 'setSearchText',
      value: function setSearchText() {
        this.hashManager.setValueOf('bookSearch', this.refs.searchInput.value);
      }
    }]);
    return BooksMenuBar;
  })(React.Component);
  var BooksMenuBarConnected = ReactRedux.connect(function(state) {
    return bookSearchSelector(state.books);
  }, _extends({}, bookSearchActionCreators))(BooksMenuBar);
  exports['default'] = BooksMenuBarConnected;
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/rootComponents/ajaxButton.js", ["./bootstrapButton"], true, function($__require, exports, module) {
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
  var BootstrapButton = $__require('./bootstrapButton');
  var AjaxButton = (function(_BootstrapButton) {
    _inherits(AjaxButton, _BootstrapButton);
    function AjaxButton() {
      _classCallCheck(this, AjaxButton);
      _get(Object.getPrototypeOf(AjaxButton.prototype), 'constructor', this).apply(this, arguments);
    }
    _createClass(AjaxButton, [{
      key: 'render',
      value: function render() {
        var result = this.props.running ? React.createElement('button', {
          className: this.state.btnCss,
          disabled: true
        }, React.createElement('i', {className: 'fa fa-fw fa-spin fa-spinner'}), this.props.runningText || this.props.text ? ' ' + this.props.runningText || this.props.text : this.props.children) : React.createElement('button', {
          className: this.state.btnCss,
          onClick: this.props.onClick
        }, this.props.children);
        return result;
      }
    }]);
    return AjaxButton;
  })(BootstrapButton);
  exports['default'] = AjaxButton;
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("react-redux/modules/books/components/bookSubjectSetter-desktop.js", ["../actions/bookSubjectModify/actionCreators", "root-components/bootstrapButton", "root-components/ajaxButton", "../reducers/booksSubjectModifierReducer"], true, function($__require, exports, module) {
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
  var _actionsBookSubjectModifyActionCreators = $__require('../actions/bookSubjectModify/actionCreators');
  var bookSubjectActionCreators = _interopRequireWildcard(_actionsBookSubjectModifyActionCreators);
  var BootstrapButton = $__require('root-components/bootstrapButton');
  var Modal = ReactBootstrap.Modal;
  var AjaxButton = $__require('root-components/ajaxButton');
  var _require = $__require('../reducers/booksSubjectModifierReducer');
  var booksSubjectsModifierSelector = _require.booksSubjectsModifierSelector;
  var BookSubjectSetterDesktopUnConnected = (function(_React$Component) {
    _inherits(BookSubjectSetterDesktopUnConnected, _React$Component);
    function BookSubjectSetterDesktopUnConnected() {
      _classCallCheck(this, BookSubjectSetterDesktopUnConnected);
      _get(Object.getPrototypeOf(BookSubjectSetterDesktopUnConnected.prototype), 'constructor', this).apply(this, arguments);
    }
    _createClass(BookSubjectSetterDesktopUnConnected, [{
      key: 'setBooksSubjects',
      value: function setBooksSubjects() {
        this.props.setBooksSubjects(this.props.modifyingBooks.map(function(b) {
          return b._id;
        }), this.props.addingSubjects.map(function(s) {
          return s._id;
        }), this.props.removingSubjects.map(function(s) {
          return s._id;
        }));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this = this;
        return React.createElement(Modal, {
          show: !!this.props.modifyingBooks.length,
          onHide: this.props.cancelBookSubjectModification
        }, React.createElement(Modal.Header, {closeButton: true}, React.createElement(Modal.Title, null, 'Edit subjects for:', React.createElement('div', null, this.props.modifyingBooks.map(function(book) {
          return React.createElement('h5', {key: book._id}, book.title);
        })))), React.createElement(Modal.Body, null, React.createElement('div', null, React.createElement(BootstrapButton, {
          preset: 'primary-xs',
          className: 'pull-right',
          onClick: this.props.subjectModificationClearSubjects
        }, 'Reset subjects')), React.createElement('br', null), React.createElement('div', null, React.createElement('b', null, 'Add'), ' ', this.props.addingSubjects.map(function(subject) {
          return React.createElement('span', {
            className: 'label label-primary',
            style: {
              marginRight: 5,
              display: 'inline-block'
            },
            key: subject._id
          }, subject.name);
        })), React.createElement('div', {
          className: 'panel panel-default',
          style: {
            maxHeight: 150,
            overflow: 'scroll'
          }
        }, React.createElement('div', {
          className: 'panel-body',
          style: {paddingTop: 0}
        }, this.props.subjects.allSubjectsSorted.map(function(s) {
          return React.createElement('div', {
            className: 'checkbox',
            key: s._id
          }, React.createElement('label', null, React.createElement('input', {
            type: 'checkbox',
            checked: !!_this.props.addingSubjectIds[s._id],
            onChange: function() {
              return _this.props.toggleSubjectModificationAdd(s._id);
            }
          }), ' ', s.name));
        }))), React.createElement('div', null, React.createElement('b', null, 'Remove'), ' ', this.props.removingSubjects.map(function(subject) {
          return React.createElement('span', {
            className: 'label label-primary',
            style: {
              marginRight: 5,
              display: 'inline-block'
            },
            key: subject._id
          }, subject.name);
        })), React.createElement('div', {
          className: 'panel panel-default',
          style: {
            maxHeight: 150,
            overflow: 'scroll'
          }
        }, React.createElement('div', {
          className: 'panel-body',
          style: {paddingTop: 0}
        }, this.props.subjects.allSubjectsSorted.map(function(s) {
          return React.createElement('div', {
            className: 'checkbox',
            key: s._id
          }, React.createElement('label', null, React.createElement('input', {
            type: 'checkbox',
            checked: !!_this.props.removingSubjectIds[s._id],
            onChange: function() {
              return _this.props.toggleSubjectModificationRemove(s._id);
            }
          }), ' ', s.name));
        })))), React.createElement(Modal.Footer, null, React.createElement(AjaxButton, {
          preset: 'primary',
          running: this.props.settingBooksSubjects,
          runningText: 'Setting',
          onClick: function() {
            return _this.setBooksSubjects();
          }
        }, 'Set'), React.createElement(BootstrapButton, {
          preset: '',
          onClick: this.props.cancelBookSubjectModification
        }, 'Cancel')));
      }
    }]);
    return BookSubjectSetterDesktopUnConnected;
  })(React.Component);
  var BookSubjectSetterDesktop = ReactRedux.connect(function(state) {
    return booksSubjectsModifierSelector(state.books);
  }, _extends({}, bookSubjectActionCreators))(BookSubjectSetterDesktopUnConnected);
  module.exports = BookSubjectSetterDesktop;
  return module.exports;
});

System.registerDynamic("react-redux/modules/books/components/subject-edit/hierarchicalSubjectList.js", ["root-components/bootstrapButton"], true, function($__require, exports, module) {
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
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
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
      } else if ("value" in desc) {
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
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
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
  var BootstrapButton = $__require('root-components/bootstrapButton');
  var Collapse = ReactBootstrap.Collapse;
  var HierarchicalSubjectItem = (function(_React$Component) {
    _inherits(HierarchicalSubjectItem, _React$Component);
    function HierarchicalSubjectItem() {
      _classCallCheck(this, HierarchicalSubjectItem);
      _get(Object.getPrototypeOf(HierarchicalSubjectItem.prototype), "constructor", this).call(this);
      this.state = {childrenVisible: false};
    }
    _createClass(HierarchicalSubjectItem, [{
      key: "toggleChildren",
      value: function toggleChildren() {
        this.setState({childrenVisible: !this.state.childrenVisible});
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;
        return React.createElement("li", {key: this.props._id}, this.props.children.length ? React.createElement("div", null, React.createElement("a", {onClick: function() {
            return _this.props.onEdit(_this.props._id);
          }}, React.createElement("i", {className: "fa fa-edit"})), " ", React.createElement("a", {onClick: function() {
            return _this.toggleChildren();
          }}, this.props.name), React.createElement(Collapse, {"in": this.state.childrenVisible}, React.createElement("div", null, React.createElement(HierarchicalSubjectList, {
          style: {paddingLeft: 25},
          onEdit: this.props.onEdit,
          subjects: this.props.children
        })))) : React.createElement("div", null, React.createElement("a", {onClick: function() {
            return _this.props.onEdit(_this.props._id);
          }}, React.createElement("i", {className: "fa fa-edit"})), " ", React.createElement("span", null, this.props.name)));
      }
    }]);
    return HierarchicalSubjectItem;
  })(React.Component);
  var HierarchicalSubjectList = (function(_React$Component2) {
    _inherits(HierarchicalSubjectList, _React$Component2);
    function HierarchicalSubjectList() {
      _classCallCheck(this, HierarchicalSubjectList);
      _get(Object.getPrototypeOf(HierarchicalSubjectList.prototype), "constructor", this).apply(this, arguments);
    }
    _createClass(HierarchicalSubjectList, [{
      key: "render",
      value: function render() {
        var _this2 = this;
        return React.createElement("div", null, React.createElement("ul", {style: _extends({}, this.props.style || {}, {listStyle: 'none'})}, this.props.subjects.map(function(s) {
          return React.createElement(HierarchicalSubjectItem, _extends({
            onEdit: _this2.props.onEdit,
            key: s._id
          }, s));
        })));
      }
    }]);
    return HierarchicalSubjectList;
  })(React.Component);
  module.exports = HierarchicalSubjectList;
  return module.exports;
});

System.registerDynamic("react-redux/modules/books/components/subject-edit/subjectEditModal.js", ["root-components/bootstrapButton", "../../actions/actionCreators", "./hierarchicalSubjectList"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
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
  var _rootComponentsBootstrapButton = $__require('root-components/bootstrapButton');
  var _rootComponentsBootstrapButton2 = _interopRequireDefault(_rootComponentsBootstrapButton);
  var _actionsActionCreators = $__require('../../actions/actionCreators');
  var actionCreators = _interopRequireWildcard(_actionsActionCreators);
  var _hierarchicalSubjectList = $__require('./hierarchicalSubjectList');
  var _hierarchicalSubjectList2 = _interopRequireDefault(_hierarchicalSubjectList);
  var Modal = ReactBootstrap.Modal;
  var subjectEditModal = (function(_React$Component) {
    _inherits(subjectEditModal, _React$Component);
    function subjectEditModal() {
      _classCallCheck(this, subjectEditModal);
      _get(Object.getPrototypeOf(subjectEditModal.prototype), 'constructor', this).apply(this, arguments);
    }
    _createClass(subjectEditModal, [{
      key: 'render',
      value: function render() {
        var _this = this;
        var editSubjectsPacket = this.props.editSubjectsPacket;
        return React.createElement(Modal, {
          show: !!editSubjectsPacket,
          onHide: this.props.stopEditingSubjects
        }, React.createElement(Modal.Header, {closeButton: true}, React.createElement(Modal.Title, null, 'Edit subjects')), React.createElement(Modal.Body, null, React.createElement(_rootComponentsBootstrapButton2['default'], {
          onClick: this.props.newSubject,
          preset: 'info-xs'
        }, 'New subject'), React.createElement('br', null), React.createElement('br', null), React.createElement(_hierarchicalSubjectList2['default'], {
          style: {paddingLeft: 5},
          subjects: this.props.subjects,
          onEdit: function(_id) {
            return _this.props.editSubject(_id);
          }
        }), editSubjectsPacket && editSubjectsPacket.editing ? React.createElement('div', {className: 'panel panel-info'}, React.createElement('div', {className: 'panel-heading'}, editSubjectsPacket.editingSubject ? 'Edit ' + editSubjectsPacket.editingSubject.name : 'New Subject'), React.createElement('div', {className: 'panel-body'}, React.createElement('form', null, React.createElement('div', {className: 'form-group'}, React.createElement('label', null, 'Subject name'), React.createElement('input', {
          className: 'form-control',
          value: editSubjectsPacket.newSubjectName,
          onChange: function(e) {
            return _this.props.setNewSubjectName(e.target.value);
          }
        })), React.createElement('div', {className: 'form-group'}, React.createElement('label', null, 'Parent'), React.createElement('select', {
          className: 'form-control',
          value: editSubjectsPacket.newSubjectParent,
          onChange: function(e) {
            return _this.props.setNewSubjectParent(e.target.value);
          }
        }, React.createElement('option', {value: ''}, 'None'), editSubjectsPacket.eligibleParents.map(function(s) {
          return React.createElement('option', {
            key: s._id,
            value: s._id
          }, s.name);
        }))), React.createElement(_rootComponentsBootstrapButton2['default'], {
          preset: 'primary',
          onClick: function(e) {
            _this.props.createOrUpdateSubject();
            e.preventDefault();
          }
        }, 'Save'), React.createElement(_rootComponentsBootstrapButton2['default'], {
          className: 'pull-right',
          preset: 'danger',
          onClick: function(e) {
            _this.props.deleteSubject();
            e.preventDefault();
          }
        }, 'Delete')))) : null), React.createElement(Modal.Footer, null, React.createElement(_rootComponentsBootstrapButton2['default'], {onClick: this.props.stopEditingSubjects}, 'Close')));
      }
    }]);
    return subjectEditModal;
  })(React.Component);
  var subjectEditModalConnected = ReactRedux.connect(function(state) {
    return state;
  }, _extends({}, actionCreators))(subjectEditModal);
  exports['default'] = subjectEditModalConnected;
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/rootComponents/bootstrapButton.js", [], true, function($__require, exports, module) {
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
  var cssPresets = {};
  var buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
  var buttonSizes = ['lg', 'sm', 'xs'];
  buttonTypes.forEach(function(t) {
    cssPresets[t] = 'btn-' + t;
    buttonSizes.forEach(function(s) {
      cssPresets[t + '-' + s] = 'btn-' + t + ' btn-' + s;
    });
  });
  var BootstrapButton = (function(_React$Component) {
    _inherits(BootstrapButton, _React$Component);
    function BootstrapButton(props) {
      _classCallCheck(this, BootstrapButton);
      _get(Object.getPrototypeOf(BootstrapButton.prototype), 'constructor', this).call(this);
      this.state = {btnCss: (props.className || '') + ' btn ' + (cssPresets[props.preset] || props.css || '')};
    }
    _createClass(BootstrapButton, [{
      key: 'render',
      value: function render() {
        return React.createElement('button', {
          className: this.state.btnCss,
          style: _extends({}, this.props.style),
          onClick: this.props.onClick,
          disabled: this.props.disabled
        }, this.props.children);
      }
    }]);
    return BootstrapButton;
  })(React.Component);
  module.exports = BootstrapButton;
  return module.exports;
});

System.registerDynamic("react-redux/modules/books/components/bookViewList-desktop.js", ["./booklist-menubar/booksMenuBar", "./bookSubjectSetter-desktop", "./subject-edit/subjectEditModal", "root-components/bootstrapButton"], true, function($__require, exports, module) {
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
  var _booklistMenubarBooksMenuBar = $__require('./booklist-menubar/booksMenuBar');
  var _booklistMenubarBooksMenuBar2 = _interopRequireDefault(_booklistMenubarBooksMenuBar);
  var _bookSubjectSetterDesktop = $__require('./bookSubjectSetter-desktop');
  var _bookSubjectSetterDesktop2 = _interopRequireDefault(_bookSubjectSetterDesktop);
  var _subjectEditSubjectEditModal = $__require('./subject-edit/subjectEditModal');
  var _subjectEditSubjectEditModal2 = _interopRequireDefault(_subjectEditSubjectEditModal);
  var _rootComponentsBootstrapButton = $__require('root-components/bootstrapButton');
  var _rootComponentsBootstrapButton2 = _interopRequireDefault(_rootComponentsBootstrapButton);
  var Modal = ReactBootstrap.Modal;
  var BookViewListDesktop = (function(_React$Component) {
    _inherits(BookViewListDesktop, _React$Component);
    function BookViewListDesktop(props) {
      _classCallCheck(this, BookViewListDesktop);
      _get(Object.getPrototypeOf(BookViewListDesktop.prototype), 'constructor', this).call(this);
      this.state = {
        booksSubjectsModalShown: false,
        editSubjectsFor: [],
        subjectsAdding: [],
        subjectsRemoving: [],
        editingSubject: null
      };
    }
    _createClass(BookViewListDesktop, [{
      key: 'render',
      value: function render() {
        var _this = this;
        var editSubjectsPacket = this.props.subjects.editSubjectsPacket;
        return React.createElement('div', null, React.createElement(_booklistMenubarBooksMenuBar2['default'], {
          selectedBooksCount: this.props.books.selectedBooksCount,
          allSubjects: this.props.subjects.list
        }), this.props.books.list.length ? React.createElement('div', {style: {
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 15
          }}, React.createElement('table', {className: 'table table-striped'}, React.createElement('thead', null, React.createElement('tr', null, React.createElement('th', null, '    '), React.createElement('th', null), React.createElement('th', null, 'Title'), React.createElement('th', null, 'Author'), React.createElement('th', null, 'Genres'), React.createElement('th', null, 'ISBN'), React.createElement('th', null, 'Published'), React.createElement('th', null, 'Pages'))), React.createElement('tbody', null, this.props.subjects.loaded ? this.props.books.list.map(function(book) {
          return React.createElement('tr', {key: book._id}, React.createElement('td', null, React.createElement('input', {
            type: 'checkbox',
            onClick: function() {
              return _this.props.toggleSelectBook(book._id);
            },
            checked: _this.props.books.selectedBooks[book._id]
          })), React.createElement('td', null, React.createElement('img', {src: book.smallImage})), React.createElement('td', null, book.title), React.createElement('td', null, book.author), React.createElement('td', null, book.subjectObjects.map(function(s) {
            return React.createElement('div', {key: s._id}, React.createElement('span', {className: 'label label-default'}, s.name));
          }), React.createElement('div', {style: {marginTop: 5}}, React.createElement('button', {
            className: 'btn btn-default btn-xs',
            onClick: function() {
              return _this.props.enableSubjectModificationSingleBook(book._id);
            }
          }, 'Modify'))), React.createElement('td', null, book.isbn), React.createElement('td', null, book.publicationDate), React.createElement('td', null, book.pages));
        }) : null))) : this.props.loading ? React.createElement('div', {className: 'alert alert-warning'}, 'No books found') : null, React.createElement(_bookSubjectSetterDesktop2['default'], {subjects: this.props.subjects}), React.createElement(_subjectEditSubjectEditModal2['default'], {
          editSubjectsPacket: this.props.subjects.editSubjectsPacket,
          subjects: this.props.subjects.list
        }));
      }
    }]);
    return BookViewListDesktop;
  })(React.Component);
  exports['default'] = BookViewListDesktop;
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/rootComponents/header.js", ["application-root/store"], true, function($__require, exports, module) {
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
  var Provider = ReactRedux.Provider;
  var _require = $__require('application-root/store');
  var store = _require.store;
  function projectState(state) {
    return state;
  }
  var Header = (function(_React$Component) {
    _inherits(Header, _React$Component);
    function Header() {
      _classCallCheck(this, Header);
      _get(Object.getPrototypeOf(Header.prototype), 'constructor', this).apply(this, arguments);
    }
    _createClass(Header, [{
      key: 'render',
      value: function render() {
        return React.createElement('div', null, this.props.root.module);
      }
    }]);
    return Header;
  })(React.Component);
  Header = ReactRedux.connect(projectState)(Header);
  module.exports = Header;
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/renderUI.js", ["./rootComponents/header", "application-root/store"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var Provider = ReactRedux.Provider;
  var Header = $__require('./rootComponents/header');
  var _require = $__require('application-root/store');
  var store = _require.store;
  function clearUI() {
    ReactDOM.render(React.createElement('div', null), document.getElementById('home'));
  }
  function renderUI(component) {
    ReactDOM.render(React.createElement(Provider, {store: store}, React.createElement('div', null, component)), document.getElementById('home'));
  }
  module.exports = {
    renderUI: renderUI,
    clearUI: clearUI
  };
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/rootReducer.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var applicationData = Object.defineProperties({}, {module: {
      get: function get() {
        return 'Book entry';
      },
      configurable: true,
      enumerable: true
    }});
  function rootReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return Object.assign({}, applicationData);
  }
  module.exports = rootReducer;
  return module.exports;
});

System.registerDynamic("react-redux/util/redux-thunk.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  exports.__esModule = true;
  exports['default'] = thunkMiddleware;
  function thunkMiddleware(_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function(next) {
      return function(action) {
        return typeof action === 'function' ? action(dispatch, getState) : next(action);
      };
    };
  }
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/store.js", ["./rootReducer", "./../util/redux-thunk"], true, function($__require, exports, module) {
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
  var rootReducer = $__require('./rootReducer');
  var thunkMiddleware = $__require('./../util/redux-thunk');
  function getNewReducer(reducerObj) {
    var _Redux$combineReducers;
    if (!reducerObj)
      return Redux.combineReducers({root: rootReducer});
    store.replaceReducer(function() {
      return {root: rootReducer()};
    });
    store.replaceReducer(Redux.combineReducers((_Redux$combineReducers = {}, _defineProperty(_Redux$combineReducers, reducerObj.name, reducerObj.reducer), _defineProperty(_Redux$combineReducers, 'root', rootReducer), _Redux$combineReducers)));
  }
  var createStoreWithMiddleware = Redux.applyMiddleware(thunkMiddleware)(Redux.createStore);
  var store = createStoreWithMiddleware(getNewReducer());
  module.exports = {
    store: store,
    getNewReducer: getNewReducer
  };
  return module.exports;
});

System.registerDynamic("utils/ajaxUtil.js", [], false, function($__require, $__exports, $__module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal($__module.id, null, null);
  (function() {
    this["_defineProperty"] = _defineProperty;
    'use strict';
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
    window.ajaxUtil = _defineProperty({post: function post(url, data) {
        var callback = arguments.length <= 2 || arguments[2] === undefined ? function() {
          return null;
        } : arguments[2];
        var errorCallback = arguments.length <= 3 || arguments[3] === undefined ? function() {
          return null;
        } : arguments[3];
        return $.ajax(url, {
          method: 'post',
          data: data,
          success: callback,
          error: errorCallback
        });
      }}, 'get', function get(url, data) {
      var callback = arguments.length <= 2 || arguments[2] === undefined ? function() {
        return null;
      } : arguments[2];
      var errorCallback = arguments.length <= 3 || arguments[3] === undefined ? function() {
        return null;
      } : arguments[3];
      return $.ajax(url, {
        method: 'get',
        data: data,
        success: callback,
        error: errorCallback
      });
    });
  })();
  return _retrieveGlobal();
});

System.registerDynamic("react-redux/reactStartup.js", ["application-root/renderUI", "application-root/store", "global-utils/ajaxUtil"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  Object.defineProperty(exports, '__esModule', {value: true});
  var _require = $__require('application-root/renderUI');
  var renderUI = _require.renderUI;
  var clearUI = _require.clearUI;
  var _require2 = $__require('application-root/store');
  var store = _require2.store;
  var getNewReducer = _require2.getNewReducer;
  $__require('global-utils/ajaxUtil');
  var currentModule = undefined;
  window.onhashchange = function() {
    loadCurrentModule();
  };
  loadCurrentModule();
  function loadCurrentModule() {
    var hash = window.location.hash.replace('#', ''),
        module = hash.split('/')[0] || 'books';
    var loggedIn = /logged_in/ig.test(document.cookie);
    if (!loggedIn) {
      forceLogin();
      return;
    }
    if (module === currentModule)
      return;
    currentModule = module;
    System['import']('react-redux/modules/' + module + '/' + module).then(function(module) {
      clearUI();
      getNewReducer({
        name: module.name,
        reducer: module.reducer
      });
      renderUI(module.component);
    });
  }
  function forceLogin() {
    currentModule = null;
    System['import']('./modules/authenticate/loginScreen').then(function(login) {
      clearUI();
      renderUI(React.createElement(login));
    });
  }
  exports['default'] = {
    loadCurrentModule: loadCurrentModule,
    forceLogin: forceLogin
  };
  module.exports = exports['default'];
  return module.exports;
});

System.registerDynamic("react-redux/applicationRoot/rootComponents/mainNavigation.js", ["react-startup"], true, function($__require, exports, module) {
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
  var _reactStartup = $__require('react-startup');
  var _reactStartup2 = _interopRequireDefault(_reactStartup);
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
          return _reactStartup2['default'].forceLogin();
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

System.registerDynamic("react-redux/modules/books/actions/bookSubjectModify/actionCreators.js", ["./actionNames"], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/actions/actionCreators.js", ["./actionNames", "./bookSubjectModify/actionCreators"], true, function($__require, exports, module) {
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

System.registerDynamic("utils/responsiveChangeNotifier.js", [], true, function($__require, exports, module) {
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
        if ("value" in descriptor)
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
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var ResponsiveNotifier = (function() {
    function ResponsiveNotifier(cb) {
      _classCallCheck(this, ResponsiveNotifier);
      this.notifySize = function notifySize() {
        if (ResponsiveBootstrapToolkit.is("xs")) {
          cb('xs');
        }
        if (ResponsiveBootstrapToolkit.is("sm")) {
          cb('sm');
        }
        if (ResponsiveBootstrapToolkit.is("md")) {
          cb('md');
        }
        if (ResponsiveBootstrapToolkit.is(">md")) {
          cb('lg');
        }
      };
      $(window).on('resize', this.notifySize);
      this.notifySize();
    }
    _createClass(ResponsiveNotifier, [{
      key: "dispose",
      value: function dispose() {
        $(window).off('resize', this.notifySize);
      }
    }]);
    return ResponsiveNotifier;
  })();
  module.exports = ResponsiveNotifier;
  return module.exports;
});

System.registerDynamic("react-redux/util/responsiveUiLoaders.js", ["global-utils/responsiveChangeNotifier"], true, function($__require, exports, module) {
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
  var ResponsiveNotifier = $__require('global-utils/responsiveChangeNotifier');
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

System.registerDynamic("react-redux/modules/books/components/bookViewList.js", ["./bookViewList-desktop", "root-components/mainNavigation", "../actions/actionCreators", "react-redux-util/responsiveUiLoaders", "../reducers/reducer"], true, function($__require, exports, module) {
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
  var _bookViewListDesktop = $__require('./bookViewList-desktop');
  var _bookViewListDesktop2 = _interopRequireDefault(_bookViewListDesktop);
  var _rootComponentsMainNavigation = $__require('root-components/mainNavigation');
  var _rootComponentsMainNavigation2 = _interopRequireDefault(_rootComponentsMainNavigation);
  var _actionsActionCreators = $__require('../actions/actionCreators');
  var actionCreators = _interopRequireWildcard(_actionsActionCreators);
  var _require = $__require('../actions/actionCreators');
  var loadBooks = _require.loadBooks;
  var loadSubjects = _require.loadSubjects;
  var editSubjectsForBook = _require.editSubjectsForBook;
  var addSubjectToBook = _require.addSubjectToBook;
  var loadBooksAndSubjects = _require.loadBooksAndSubjects;
  var _require2 = $__require('react-redux-util/responsiveUiLoaders');
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
        return React.createElement('div', null, React.createElement(_rootComponentsMainNavigation2['default'], {isBookList: true}), React.createElement('div', {
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

System.registerDynamic("react-redux/modules/books/reducers/booksReducer.js", ["../../../util/reselect", "../actions/actionNames", "../actions/bookSubjectModify/actionNames", "../util/booksSubjectsHelpers"], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/util/booksSubjectsHelpers.js", [], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/reducers/subjectsReducer.js", ["../actions/actionNames", "../util/booksSubjectsHelpers", "../../../util/reselect"], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/actions/actionNames.js", [], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/reducers/bookSearchReducer.js", ["../actions/actionNames"], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/actions/bookSubjectModify/actionNames.js", [], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/util/reselect.js", [], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/reducers/booksSubjectModifierReducer.js", ["../actions/bookSubjectModify/actionNames", "../../../util/reselect"], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/reducers/reducer.js", ["./booksReducer", "./subjectsReducer", "./bookSearchReducer", "./booksSubjectModifierReducer"], true, function($__require, exports, module) {
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

System.registerDynamic("react-redux/modules/books/books.js", ["./components/bookViewList", "./reducers/reducer"], true, function($__require, exports, module) {
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
