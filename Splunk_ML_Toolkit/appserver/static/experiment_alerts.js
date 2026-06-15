(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["experiment_alerts"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiment_alerts.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
__webpack_require__.p = (function getPath() {

    /**
     * This is a port of make_url from js/util.js
     */
    function make_url() {
        var output = '', seg, len;
        for (var i=0,l=arguments.length; i<l; i++) {
            seg = arguments[i].toString();
            len = seg.length;
            if (len > 1 && seg.charAt(len-1) == '/') {
                seg = seg.substring(0, len-1);
            }
            if (seg.charAt(0) != '/') {
                output += '/' + seg;
            } else {
                output += seg;
            }
        }

        // augment static dirs with build number
        if (output!='/') {
            var segments = output.split('/');
            var firstseg = segments[1];
            if (firstseg=='static' || firstseg=='modules') {
                var postfix = output.substring(firstseg.length+2, output.length);
                output = '/' + firstseg;
                if (window.$C['BUILD_NUMBER']) output += '/@' + window.$C['BUILD_NUMBER'];
                if (window.$C['BUILD_PUSH_NUMBER']) output += '.' + window.$C['BUILD_PUSH_NUMBER'];
                if (segments[2] == 'app')
                    output += ':'+ getConfigValue('APP_BUILD', 0);
                output += '/' + postfix;
            }
        }

        var root = getConfigValue('MRSPARKLE_ROOT_PATH', '/');
        var locale = getConfigValue('LOCALE', 'en-US');
        var combinedPath =  "/" + locale + output;

        if (root == '' || root == '/') {
            return combinedPath;
        } else {
            return root + combinedPath;
        }
    }

    function getConfigValue(key, defaultValue) {
        if (window.$C && window.$C.hasOwnProperty(key)) {
            return window.$C[key];
        } else {
            if (defaultValue !== undefined) {
                return defaultValue;
            }

            throw new Error('getConfigValue - ' + key + ' not set, no default provided');
        }
    }

    return make_url('/static/app/Splunk_ML_Toolkit/') + '/';
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/ExperimentAlerts.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_ExperimentAlerts, _swcMltk) {
  "use strict";

  _ExperimentAlerts = _interopRequireDefault(_ExperimentAlerts);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _ExperimentAlerts.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experimentAlerts/AlertEditMenu.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/Edit"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/EnableDisable"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/Delete")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esRegexpExec, _esStringSearch, _react, _propTypes, _styledComponents, _Dropdown, _Menu, _swcMltk, _i18n, _Edit, _EnableDisable, _Delete) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _Edit = _interopRequireDefault(_Edit);
  _EnableDisable = _interopRequireDefault(_EnableDisable);
  _Delete = _interopRequireDefault(_Delete);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var EditLink = _styledComponents.default.span(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    color: #006d9c;\n    cursor: pointer;\n    &:hover {\n        text-decoration: underline;\n    }\n"])));
  var MenuLink = _styledComponents.default.a(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    text-decoration: none;\n    color: inherit;\n"])));
  function AlertEditMenu(_ref) {
    var backboneModel = _ref.backboneModel,
      experiment = _ref.experiment,
      application = _ref.application,
      user = _ref.user,
      serverInfo = _ref.serverInfo,
      alertActionsCollection = _ref.alertActionsCollection;
    var isDisabled = !!backboneModel.entry.content.get('disabled');
    var searchLink = (0, _react.useMemo)(function () {
      var root = application.get('root');
      var locale = application.get('locale');
      var app = application.get('app');
      var search = backboneModel.entry.content.get('search') || '';
      return _swcMltk.route.search(root, locale, app, {
        data: {
          q: search
        }
      });
    }, [application, backboneModel]);
    var handleEditAlert = (0, _react.useCallback)(function () {
      var editDialog = new _Edit.default({
        model: {
          alert: backboneModel,
          application: application,
          user: user,
          serverInfo: serverInfo
        },
        collection: {
          alertActions: alertActionsCollection
        },
        onHiddenRemove: true
      });
      editDialog.render().appendTo((0, _swcMltk.jquery)('body'));
      editDialog.show();
    }, [backboneModel, application, user, serverInfo, alertActionsCollection]);
    var handleEnableDisable = (0, _react.useCallback)(function () {
      var dialog = new _EnableDisable.default({
        model: {
          savedAlert: backboneModel,
          application: application,
          experiment: experiment
        },
        onHiddenRemove: true
      });
      dialog.render().appendTo((0, _swcMltk.jquery)('body'));
      dialog.show();
    }, [backboneModel, application, experiment]);
    var handleDelete = (0, _react.useCallback)(function () {
      var dialog = new _Delete.default({
        model: {
          report: backboneModel,
          application: application,
          experiment: experiment
        },
        onHiddenRemove: true
      });
      dialog.render().appendTo((0, _swcMltk.jquery)('body'));
      dialog.show();
    }, [backboneModel, application, experiment]);
    return /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: /*#__PURE__*/_react.default.createElement(EditLink, null, (0, _i18n.gettext)('Edit'), " ", /*#__PURE__*/_react.default.createElement("span", {
        className: "caret"
      }))
    }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, null, /*#__PURE__*/_react.default.createElement(MenuLink, {
      href: searchLink
    }, (0, _i18n.gettext)('Open in Search'))), /*#__PURE__*/_react.default.createElement(_Menu.default.Divider, null), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: handleEditAlert
    }, (0, _i18n.gettext)('Edit Alert')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: handleEnableDisable
    }, isDisabled ? (0, _i18n.gettext)('Enable') : (0, _i18n.gettext)('Disable')), /*#__PURE__*/_react.default.createElement(_Menu.default.Divider, null), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: handleDelete
    }, (0, _i18n.gettext)('Delete'))));
  }
  AlertEditMenu.propTypes = {
    alertActionsCollection: _propTypes.default.object.isRequired,
    application: _propTypes.default.object.isRequired,
    backboneModel: _propTypes.default.object.isRequired,
    experiment: _propTypes.default.object.isRequired,
    serverInfo: _propTypes.default.object,
    user: _propTypes.default.object.isRequired
  };
  AlertEditMenu.defaultProps = {
    serverInfo: null
  };
  var _default = _exports.default = AlertEditMenu;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experimentAlerts/AlertFilterBar.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-icons/Magnifier.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _react, _propTypes, _styledComponents, _Magnifier, _Text, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Magnifier = _interopRequireDefault(_Magnifier);
  _Text = _interopRequireDefault(_Text);
  var _templateObject, _templateObject2, _templateObject3;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var FilterBarWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 8px 0;\n    border-bottom: 1px solid #e0e0e0;\n    margin-bottom: 10px;\n"])));
  var CountLabel = _styledComponents.default.span(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    font-size: 14px;\n    font-weight: bold;\n    color: #333;\n"])));
  var FilterInput = (0, _styledComponents.default)(_Text.default)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    max-width: 230px;\n    margin-left: 12px;\n"])));
  function AlertFilterBar(_ref) {
    var count = _ref.count,
      searchValue = _ref.searchValue,
      onSearchChange = _ref.onSearchChange;
    var handleChange = (0, _react.useCallback)(function (e, _ref2) {
      var value = _ref2.value;
      onSearchChange(value);
    }, [onSearchChange]);
    var countText = "".concat(count, " ").concat((0, _i18n.gettext)('Alerts'));
    return /*#__PURE__*/_react.default.createElement(FilterBarWrapper, null, /*#__PURE__*/_react.default.createElement(CountLabel, null, countText), /*#__PURE__*/_react.default.createElement(FilterInput, {
      canClear: true,
      onChange: handleChange,
      placeholder: (0, _i18n.gettext)('filter'),
      startAdornment: /*#__PURE__*/_react.default.createElement(_Magnifier.default, null),
      value: searchValue
    }));
  }
  AlertFilterBar.propTypes = {
    count: _propTypes.default.number.isRequired,
    onSearchChange: _propTypes.default.func.isRequired,
    searchValue: _propTypes.default.string.isRequired
  };
  var _default = _exports.default = AlertFilterBar;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experimentAlerts/AlertMoreInfo.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/DefinitionList.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/Edit"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/EnableDisable")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayMap, _esObjectToString, _esStringTrim, _react, _propTypes, _styledComponents, _DefinitionList, _swcMltk, _i18n, _Edit, _EnableDisable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _styledComponents = _interopRequireDefault(_styledComponents);
  _DefinitionList = _interopRequireDefault(_DefinitionList);
  _Edit = _interopRequireDefault(_Edit);
  _EnableDisable = _interopRequireDefault(_EnableDisable);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var EditLink = _styledComponents.default.button(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    background: none;\n    border: none;\n    padding: 0;\n    color: #006d9c;\n    cursor: pointer;\n    font-size: inherit;\n    font-family: inherit;\n    &:hover {\n        text-decoration: underline;\n    }\n"])));
  var ActionsDropdown = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    line-height: 1.6;\n"])));
  var ActionsToggleBtn = _styledComponents.default.button(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    background: none;\n    border: none;\n    padding: 0;\n    cursor: pointer;\n    color: inherit;\n    font-size: inherit;\n    font-family: inherit;\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    &:focus {\n        outline: none;\n    }\n"])));
  var MoreInfoActionItem = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    padding: 2px 0 2px 20px;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n"])));
  var DescriptionParagraph = _styledComponents.default.p(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    margin: 0 0 8px 0;\n"])));
  var ActionsEditWrapper = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    padding-left: ", ";\n"])), function (props) {
    return props.$indented ? '20px' : '0';
  });
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      var d = new Date(dateStr);
      return d.toLocaleString();
    } catch (_unused) {
      return dateStr;
    }
  }
  function AlertMoreInfo(_ref) {
    var alert = _ref.alert,
      experiment = _ref.experiment,
      application = _ref.application,
      user = _ref.user,
      serverInfo = _ref.serverInfo,
      alertActionsCollection = _ref.alertActionsCollection;
    var backboneModel = alert._backboneModel;
    var _useState = (0, _react.useState)(alert.disabled),
      _useState2 = _slicedToArray(_useState, 2),
      disabled = _useState2[0],
      setDisabled = _useState2[1];
    (0, _react.useEffect)(function () {
      var onContentChange = function onContentChange() {
        setDisabled(!!backboneModel.entry.content.get('disabled'));
      };
      backboneModel.entry.content.on('change:disabled', onContentChange);
      return function () {
        backboneModel.entry.content.off('change:disabled', onContentChange);
      };
    }, [backboneModel]);
    var enableDisableText = disabled ? (0, _i18n.gettext)('No.') : (0, _i18n.gettext)('Yes.');
    var enableDisableAction = disabled ? (0, _i18n.gettext)('Enable') : (0, _i18n.gettext)('Disable');
    var modifiedDate = (0, _react.useMemo)(function () {
      var updated = backboneModel.entry.get('updated');
      return formatDate(updated);
    }, [backboneModel]);
    var alertTypeText = (0, _react.useMemo)(function () {
      var content = backboneModel.entry.content;
      var isScheduled = content.get('is_scheduled');
      var cronSchedule = content.get('cron_schedule');
      if (isScheduled === '1' || isScheduled === true || isScheduled === 1) {
        var text = (0, _i18n.gettext)('Scheduled.');
        if (cronSchedule) text += " ".concat((0, _i18n.gettext)('Cron Schedule.'));
        return text;
      }
      return (0, _i18n.gettext)('Real-time');
    }, [backboneModel]);
    var triggerText = (0, _react.useMemo)(function () {
      var content = backboneModel.entry.content;
      var alertType = content.get('alert_type');
      var threshold = content.get('alert_threshold');
      var comparator = content.get('alert_comparator');
      var condition = content.get('alert_condition');
      if (alertType === 'custom') return "".concat((0, _i18n.gettext)('Custom.'), " ").concat(condition || '');
      if (alertType === 'number of events') return "".concat((0, _i18n.gettext)('Number of results is'), " ").concat(comparator || '', " ").concat(threshold || '');
      if (alertType === 'number of hosts') return "".concat((0, _i18n.gettext)('Number of hosts is'), " ").concat(comparator || '', " ").concat(threshold || '');
      if (alertType === 'number of sources') return "".concat((0, _i18n.gettext)('Number of sources is'), " ").concat(comparator || '', " ").concat(threshold || '');
      if (alertType === 'always') return (0, _i18n.gettext)('Per-Result');
      return alertType || '';
    }, [backboneModel]);
    var actionsInfo = (0, _react.useMemo)(function () {
      var content = backboneModel.entry.content;
      var actions = content.get('actions') || '';
      if (!actions) return {
        count: 0,
        labels: []
      };
      var actionNames = actions.split(',').map(function (a) {
        return a.trim();
      }).filter(Boolean);
      var labels = actionNames.map(function (name) {
        if (alertActionsCollection && alertActionsCollection.models) {
          var found = alertActionsCollection.models.find(function (m) {
            return m.entry.get('name') === name;
          });
          if (found) return found.entry.content.get('label') || name;
        }
        return name;
      });
      return {
        count: labels.length,
        labels: labels
      };
    }, [backboneModel, alertActionsCollection]);
    var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      actionsExpanded = _useState4[0],
      setActionsExpanded = _useState4[1];
    var managedBy = backboneModel.entry.content.get('alert.managedBy');
    var canWriteAlert = (0, _react.useMemo)(function () {
      if (typeof backboneModel.canWrite === 'function') {
        return backboneModel.canWrite(user.canScheduleSearch ? user.canScheduleSearch() : true, user.canRTSearch ? user.canRTSearch() : true);
      }
      return true;
    }, [backboneModel, user]);
    var openEditDialog = (0, _react.useCallback)(function (scrollTarget) {
      var editDialog = new _Edit.default({
        model: {
          alert: backboneModel,
          application: application,
          user: user,
          serverInfo: serverInfo
        },
        collection: {
          alertActions: alertActionsCollection
        },
        onHiddenRemove: true
      });
      editDialog.render().appendTo((0, _swcMltk.jquery)('body'));
      editDialog.show();
      if (scrollTarget) editDialog.scrollTo(scrollTarget);
    }, [backboneModel, application, user, serverInfo, alertActionsCollection]);
    var handleEnableDisable = (0, _react.useCallback)(function () {
      var dialog = new _EnableDisable.default({
        model: {
          savedAlert: backboneModel,
          application: application,
          experiment: experiment
        },
        onHiddenRemove: true
      });
      dialog.render().appendTo((0, _swcMltk.jquery)('body'));
      dialog.show();
    }, [backboneModel, application, experiment]);
    var description = backboneModel.entry.content.get('description');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, description && /*#__PURE__*/_react.default.createElement(DescriptionParagraph, null, description), /*#__PURE__*/_react.default.createElement(_DefinitionList.default, {
      separatorCharacter: "."
    }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Enabled')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, enableDisableText, ' ', canWriteAlert && /*#__PURE__*/_react.default.createElement(EditLink, {
      onClick: handleEnableDisable,
      type: "button"
    }, enableDisableAction)), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Modified')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, modifiedDate), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Alert Type')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, alertTypeText, canWriteAlert && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, '. ', /*#__PURE__*/_react.default.createElement(EditLink, {
      onClick: function onClick() {
        return openEditDialog('type');
      },
      type: "button"
    }, (0, _i18n.gettext)('Edit')))), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Trigger Condition')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, triggerText, canWriteAlert && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, '. ', /*#__PURE__*/_react.default.createElement(EditLink, {
      onClick: function onClick() {
        return openEditDialog('trigger');
      },
      type: "button"
    }, (0, _i18n.gettext)('Edit')))), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Actions')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, actionsInfo.count === 0 ? (0, _i18n.gettext)('None') : /*#__PURE__*/_react.default.createElement(ActionsDropdown, null, /*#__PURE__*/_react.default.createElement(ActionsToggleBtn, {
      onClick: function onClick() {
        return setActionsExpanded(function (prev) {
          return !prev;
        });
      },
      type: "button"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: actionsExpanded ? 'icon-triangle-down-small' : 'icon-triangle-right-small'
    }), actionsInfo.count, ' ', actionsInfo.count === 1 ? (0, _i18n.gettext)('Action') : (0, _i18n.gettext)('Actions')), actionsExpanded && actionsInfo.labels.map(function (label) {
      return /*#__PURE__*/_react.default.createElement(MoreInfoActionItem, {
        key: label
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "icon-bell"
      }), label);
    })), canWriteAlert && /*#__PURE__*/_react.default.createElement(ActionsEditWrapper, {
      $indented: actionsInfo.count > 0
    }, /*#__PURE__*/_react.default.createElement(EditLink, {
      onClick: function onClick() {
        return openEditDialog('actions');
      },
      type: "button"
    }, (0, _i18n.gettext)('Edit')))), managedBy && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Managed by')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, managedBy))));
  }
  AlertMoreInfo.propTypes = {
    alert: _propTypes.default.object.isRequired,
    alertActionsCollection: _propTypes.default.object.isRequired,
    application: _propTypes.default.object.isRequired,
    experiment: _propTypes.default.object.isRequired,
    serverInfo: _propTypes.default.object,
    user: _propTypes.default.object.isRequired
  };
  AlertMoreInfo.defaultProps = {
    serverInfo: null
  };
  var _default = _exports.default = AlertMoreInfo;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experimentAlerts/AlertsTable.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./node_modules/@splunk/react-ui/Link.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/shared/ComponentErrorBoundary.jsx"), __webpack_require__("./src/main/webapp/components/experimentAlerts/AlertEditMenu.jsx"), __webpack_require__("./src/main/webapp/components/experimentAlerts/AlertMoreInfo.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayMap, _esFunctionName, _esObjectToString, _esStringTrim, _react, _propTypes, _styledComponents, _Table, _Link, _swcMltk, _i18n, _ComponentErrorBoundary, _AlertEditMenu, _AlertMoreInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Table = _interopRequireDefault(_Table);
  _Link = _interopRequireDefault(_Link);
  _ComponentErrorBoundary = _interopRequireDefault(_ComponentErrorBoundary);
  _AlertEditMenu = _interopRequireDefault(_AlertEditMenu);
  _AlertMoreInfo = _interopRequireDefault(_AlertMoreInfo);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var TableWrapper = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    margin-top: 10px;\n"])));
  var EmptyMessage = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    text-align: center;\n    padding: 40px;\n    color: #999;\n    font-size: 14px;\n"])));
  var ActionsTableCell = (0, _styledComponents.default)(_Table.default.Cell)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    white-space: nowrap;\n"])));
  var ExpansionCell = (0, _styledComponents.default)(_Table.default.Cell)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    border-top: none;\n"])));
  var ActionsList = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    line-height: 1.6;\n"])));
  var ActionsToggle = _styledComponents.default.button(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    background: none;\n    border: none;\n    padding: 0;\n    cursor: pointer;\n    color: inherit;\n    font-size: inherit;\n    font-family: inherit;\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    &:focus {\n        outline: none;\n        box-shadow: none;\n    }\n"])));
  var ActionItem = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    padding: 2px 0 2px 20px;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    font-size: inherit;\n"])));
  function getAlertTypeText(backboneModel) {
    var content = backboneModel.entry.content;
    var isScheduled = content.get('is_scheduled');
    var cronSchedule = content.get('cron_schedule');
    if (isScheduled === '1' || isScheduled === true || isScheduled === 1) {
      var text = (0, _i18n.gettext)('Scheduled.');
      if (cronSchedule) text += " ".concat((0, _i18n.gettext)('Cron Schedule.'));
      return text;
    }
    return (0, _i18n.gettext)('Real-time');
  }
  function getTriggerConditionText(backboneModel) {
    var content = backboneModel.entry.content;
    var alertType = content.get('alert_type');
    var threshold = content.get('alert_threshold');
    var comparator = content.get('alert_comparator');
    var condition = content.get('alert_condition');
    if (alertType === 'custom') return "".concat((0, _i18n.gettext)('Custom.'), " ").concat(condition || '');
    if (alertType === 'number of events') return "".concat((0, _i18n.gettext)('Number of results is'), " ").concat(comparator || '', " ").concat(threshold || '');
    if (alertType === 'number of hosts') return "".concat((0, _i18n.gettext)('Number of hosts is'), " ").concat(comparator || '', " ").concat(threshold || '');
    if (alertType === 'number of sources') return "".concat((0, _i18n.gettext)('Number of sources is'), " ").concat(comparator || '', " ").concat(threshold || '');
    if (alertType === 'always') return (0, _i18n.gettext)('Per-Result');
    return alertType || '';
  }
  function getActionsInfo(backboneModel, alertActionsCollection) {
    var content = backboneModel.entry.content;
    var actions = content.get('actions') || '';
    if (!actions) return {
      count: 0,
      labels: []
    };
    var actionNames = actions.split(',').map(function (a) {
      return a.trim();
    }).filter(Boolean);
    var labels = actionNames.map(function (name) {
      if (alertActionsCollection && alertActionsCollection.models) {
        var found = alertActionsCollection.models.find(function (m) {
          return m.entry.get('name') === name;
        });
        if (found) return found.entry.content.get('label') || name;
      }
      return name;
    });
    return {
      count: labels.length,
      labels: labels
    };
  }
  function TriggerActionsCell(_ref) {
    var backboneModel = _ref.backboneModel,
      alertActionsCollection = _ref.alertActionsCollection;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];
    var info = (0, _react.useMemo)(function () {
      return getActionsInfo(backboneModel, alertActionsCollection);
    }, [backboneModel, alertActionsCollection]);
    if (info.count === 0) return /*#__PURE__*/_react.default.createElement("span", null, (0, _i18n.gettext)('None'));
    return /*#__PURE__*/_react.default.createElement(ActionsList, null, /*#__PURE__*/_react.default.createElement(ActionsToggle, {
      onClick: function onClick() {
        return setExpanded(function (prev) {
          return !prev;
        });
      },
      type: "button"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: expanded ? 'icon-triangle-down-small' : 'icon-triangle-right-small'
    }), info.count, " ", info.count === 1 ? (0, _i18n.gettext)('Action') : (0, _i18n.gettext)('Actions')), expanded && info.labels.map(function (label) {
      return /*#__PURE__*/_react.default.createElement(ActionItem, {
        key: label
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "icon-bell"
      }), label);
    }));
  }
  TriggerActionsCell.propTypes = {
    alertActionsCollection: _propTypes.default.object.isRequired,
    backboneModel: _propTypes.default.object.isRequired
  };
  function useAlertDisabledState(backboneModel, initialDisabled) {
    var _useState3 = (0, _react.useState)(initialDisabled),
      _useState4 = _slicedToArray(_useState3, 2),
      disabled = _useState4[0],
      setDisabled = _useState4[1];
    (0, _react.useEffect)(function () {
      var onChange = function onChange() {
        return setDisabled(!!backboneModel.entry.content.get('disabled'));
      };
      backboneModel.entry.content.on('change:disabled', onChange);
      return function () {
        return backboneModel.entry.content.off('change:disabled', onChange);
      };
    }, [backboneModel]);
    return disabled;
  }
  function AlertRowCells(_ref2) {
    var alert = _ref2.alert,
      application = _ref2.application,
      alertActionsCollection = _ref2.alertActionsCollection,
      experiment = _ref2.experiment,
      rolesCollection = _ref2.rolesCollection,
      serverInfo = _ref2.serverInfo,
      stateModel = _ref2.stateModel,
      user = _ref2.user;
    var backboneModel = alert._backboneModel;
    var disabled = useAlertDisabledState(backboneModel, alert.disabled);
    var alertLink = (0, _react.useMemo)(function () {
      var root = application.get('root');
      var locale = application.get('locale');
      var app = application.get('app');
      return _swcMltk.route.alert(root, locale, app, {
        data: {
          s: backboneModel.id
        }
      });
    }, [application, backboneModel.id]);
    var alertTypeText = (0, _react.useMemo)(function () {
      return getAlertTypeText(backboneModel);
    }, [backboneModel]);
    var triggerText = (0, _react.useMemo)(function () {
      return getTriggerConditionText(backboneModel);
    }, [backboneModel]);
    var statusText = disabled ? (0, _i18n.gettext)('Disabled') : (0, _i18n.gettext)('Enabled');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_Link.default, {
      to: alertLink
    }, alert.name)), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, alertTypeText), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, triggerText), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(TriggerActionsCell, {
      alertActionsCollection: alertActionsCollection,
      backboneModel: backboneModel
    })), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, statusText), /*#__PURE__*/_react.default.createElement(ActionsTableCell, null, /*#__PURE__*/_react.default.createElement(_AlertEditMenu.default, {
      alertActionsCollection: alertActionsCollection,
      application: application,
      backboneModel: backboneModel,
      experiment: experiment,
      serverInfo: serverInfo,
      user: user
    })));
  }
  AlertRowCells.propTypes = {
    alert: _propTypes.default.object.isRequired,
    alertActionsCollection: _propTypes.default.object.isRequired,
    application: _propTypes.default.object.isRequired,
    experiment: _propTypes.default.object.isRequired,
    rolesCollection: _propTypes.default.object,
    serverInfo: _propTypes.default.object,
    stateModel: _propTypes.default.object.isRequired,
    user: _propTypes.default.object.isRequired
  };
  AlertRowCells.defaultProps = {
    rolesCollection: null,
    serverInfo: null
  };
  var COLUMNS = [{
    sortKey: 'args.mltk.experiment.title',
    label: (0, _i18n.gettext)('Title')
  }, {
    sortKey: null,
    label: (0, _i18n.gettext)('Alert Type')
  }, {
    sortKey: null,
    label: (0, _i18n.gettext)('Trigger Conditions')
  }, {
    sortKey: null,
    label: (0, _i18n.gettext)('Trigger Actions')
  }, {
    sortKey: 'disabled',
    label: (0, _i18n.gettext)('Status')
  }, {
    sortKey: null,
    label: (0, _i18n.gettext)('Actions')
  }];
  function getExpansionRow(alert, props) {
    return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
      key: "".concat(alert.id, "-expansion")
    }, /*#__PURE__*/_react.default.createElement(ExpansionCell, {
      colSpan: 7
    }, /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "AlertMoreInfo[".concat(alert.name, "]")
    }, /*#__PURE__*/_react.default.createElement(_AlertMoreInfo.default, {
      alert: alert,
      alertActionsCollection: props.alertActionsCollection,
      application: props.application,
      experiment: props.experiment,
      serverInfo: props.serverInfo,
      user: props.user
    }))));
  }
  function AlertsTable(_ref3) {
    var alerts = _ref3.alerts,
      experiment = _ref3.experiment,
      application = _ref3.application,
      user = _ref3.user,
      serverInfo = _ref3.serverInfo,
      alertActionsCollection = _ref3.alertActionsCollection,
      rolesCollection = _ref3.rolesCollection,
      stateModel = _ref3.stateModel,
      onSort = _ref3.onSort,
      sortKey = _ref3.sortKey,
      sortDirection = _ref3.sortDirection;
    var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      expandedRowId = _useState6[0],
      setExpandedRowId = _useState6[1];
    var handleRowExpansion = (0, _react.useCallback)(function (rowId) {
      setExpandedRowId(function (prev) {
        return prev === rowId ? null : rowId;
      });
    }, []);
    var handleHeaderClick = (0, _react.useCallback)(function (e, _ref4) {
      var headerSortKey = _ref4.sortKey;
      if (headerSortKey) onSort(headerSortKey);
    }, [onSort]);
    if (alerts.length === 0) {
      return /*#__PURE__*/_react.default.createElement(EmptyMessage, null, (0, _i18n.gettext)('No alerts found.'));
    }
    var sharedProps = {
      experiment: experiment,
      application: application,
      user: user,
      serverInfo: serverInfo,
      alertActionsCollection: alertActionsCollection,
      rolesCollection: rolesCollection,
      stateModel: stateModel
    };
    return /*#__PURE__*/_react.default.createElement(TableWrapper, null, /*#__PURE__*/_react.default.createElement(_Table.default, {
      rowExpansion: "controlled",
      stripeRows: true
    }, /*#__PURE__*/_react.default.createElement(_Table.default.Head, null, COLUMNS.map(function (col, idx) {
      return /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
        key: col.label || "col-".concat(idx),
        onSort: col.sortKey ? handleHeaderClick : undefined,
        sortDir: col.sortKey && sortKey === col.sortKey ? sortDirection : 'none',
        sortKey: col.sortKey || undefined
      }, col.label);
    })), /*#__PURE__*/_react.default.createElement(_Table.default.Body, null, alerts.map(function (alert) {
      return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
        key: alert.id,
        expanded: expandedRowId === alert.id,
        expansionRow: getExpansionRow(alert, sharedProps),
        onExpansion: function onExpansion() {
          return handleRowExpansion(alert.id);
        }
      }, /*#__PURE__*/_react.default.createElement(AlertRowCells, {
        alert: alert,
        alertActionsCollection: alertActionsCollection,
        application: application,
        experiment: experiment,
        rolesCollection: rolesCollection,
        serverInfo: serverInfo,
        stateModel: stateModel,
        user: user
      }));
    }))));
  }
  AlertsTable.propTypes = {
    alertActionsCollection: _propTypes.default.object.isRequired,
    alerts: _propTypes.default.array.isRequired,
    application: _propTypes.default.object.isRequired,
    experiment: _propTypes.default.object.isRequired,
    onSort: _propTypes.default.func.isRequired,
    rolesCollection: _propTypes.default.object,
    serverInfo: _propTypes.default.object,
    sortDirection: _propTypes.default.string.isRequired,
    sortKey: _propTypes.default.string.isRequired,
    stateModel: _propTypes.default.object.isRequired,
    user: _propTypes.default.object.isRequired
  };
  AlertsTable.defaultProps = {
    rolesCollection: null,
    serverInfo: null
  };
  var _default = _exports.default = AlertsTable;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experimentAlerts/ExperimentAlertsPage.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.replace.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./node_modules/@splunk/react-ui/WaitSpinner.js"), __webpack_require__("./src/main/webapp/components/shared/ComponentErrorBoundary.jsx"), __webpack_require__("./src/main/webapp/components/experimentAlerts/AlertsTable.jsx"), __webpack_require__("./src/main/webapp/components/experimentAlerts/AlertFilterBar.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esArraySlice, _esRegexpExec, _esStringReplace, _react, _propTypes, _styledComponents, _i18n, _Paginator, _WaitSpinner, _ComponentErrorBoundary, _AlertsTable, _AlertFilterBar) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Paginator = _interopRequireDefault(_Paginator);
  _WaitSpinner = _interopRequireDefault(_WaitSpinner);
  _ComponentErrorBoundary = _interopRequireDefault(_ComponentErrorBoundary);
  _AlertsTable = _interopRequireDefault(_AlertsTable);
  _AlertFilterBar = _interopRequireDefault(_AlertFilterBar);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var PageContainer = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 20px;\n"])));
  var TitleSection = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin-bottom: 10px;\n"])));
  var Title = _styledComponents.default.h2(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    font-size: 24px;\n    font-weight: normal;\n    margin: 0 0 10px 0;\n"])));
  var Description = _styledComponents.default.p(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    font-size: 13px;\n    color: #666;\n    margin: 0 0 15px 0;\n    line-height: 1.5;\n"])));
  var SpinnerWrapper = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: center;\n    padding: 40px;\n"])));
  var PaginationContainer = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: flex-end;\n    margin-top: 16px;\n"])));
  var ALERTS_PER_PAGE = 10;
  function readAlertsFromCollection(collection) {
    if (!collection || !collection.models) {
      return [];
    }
    return collection.models.map(function (model) {
      return {
        id: model.id || model.cid,
        name: model.entry.content.get('args.mltk.experiment.title') || '',
        disabled: !!model.entry.content.get('disabled'),
        description: model.entry.content.get('description') || '',
        search: model.entry.content.get('search') || '',
        managedBy: model.entry.content.get('alert.managedBy') || '',
        canWrite: typeof model.canWrite === 'function' ? model.canWrite() : true,
        _backboneModel: model
      };
    });
  }
  function ExperimentAlertsPage(_ref) {
    var experiment = _ref.experiment,
      stateModel = _ref.stateModel,
      application = _ref.application,
      user = _ref.user,
      serverInfo = _ref.serverInfo,
      savedAlertsCollection = _ref.savedAlertsCollection,
      alertActionsCollection = _ref.alertActionsCollection,
      rolesCollection = _ref.rolesCollection;
    var _useState = (0, _react.useState)(function () {
        return readAlertsFromCollection(savedAlertsCollection);
      }),
      _useState2 = _slicedToArray(_useState, 2),
      alerts = _useState2[0],
      setAlerts = _useState2[1];
    var _useState3 = (0, _react.useState)(function () {
        return !!stateModel.get('fetching');
      }),
      _useState4 = _slicedToArray(_useState3, 2),
      isFetching = _useState4[0],
      setIsFetching = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      searchFilter = _useState6[0],
      setSearchFilter = _useState6[1];
    var _useState7 = (0, _react.useState)(0),
      _useState8 = _slicedToArray(_useState7, 2),
      currentPage = _useState8[0],
      setCurrentPage = _useState8[1];
    var _useState9 = (0, _react.useState)(function () {
        return stateModel.get('sortKey') || 'name';
      }),
      _useState10 = _slicedToArray(_useState9, 2),
      sortKey = _useState10[0],
      setSortKey = _useState10[1];
    var _useState11 = (0, _react.useState)(function () {
        return stateModel.get('sortDirection') || 'asc';
      }),
      _useState12 = _slicedToArray(_useState11, 2),
      sortDirection = _useState12[0],
      setSortDirection = _useState12[1];
    var experimentTitle = (0, _react.useMemo)(function () {
      return experiment && experiment.entry && experiment.entry.content ? experiment.entry.content.get('title') : '';
    }, [experiment]);
    var syncAlerts = (0, _react.useCallback)(function () {
      setAlerts(readAlertsFromCollection(savedAlertsCollection));
      setCurrentPage(0);
    }, [savedAlertsCollection]);
    (0, _react.useEffect)(function () {
      var onSync = function onSync() {
        return syncAlerts();
      };
      var onReset = function onReset() {
        return syncAlerts();
      };
      var onDestroy = function onDestroy() {
        return syncAlerts();
      };
      var onFetchingChange = function onFetchingChange() {
        return setIsFetching(!!stateModel.get('fetching'));
      };
      savedAlertsCollection.on('sync', onSync);
      savedAlertsCollection.on('reset', onReset);
      savedAlertsCollection.on('destroy', onDestroy);
      stateModel.on('change:fetching', onFetchingChange);
      return function () {
        savedAlertsCollection.off('sync', onSync);
        savedAlertsCollection.off('reset', onReset);
        savedAlertsCollection.off('destroy', onDestroy);
        stateModel.off('change:fetching', onFetchingChange);
      };
    }, [savedAlertsCollection, stateModel, syncAlerts]);
    var handleSort = (0, _react.useCallback)(function (newSortKey) {
      var newDirection = 'asc';
      if (sortKey === newSortKey) {
        newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      }
      setSortKey(newSortKey);
      setSortDirection(newDirection);
      setCurrentPage(0);
      stateModel.set({
        sortKey: newSortKey,
        sortDirection: newDirection
      });
    }, [sortKey, sortDirection, stateModel]);
    var handleSearchChange = (0, _react.useCallback)(function (value) {
      setSearchFilter(value);
      setCurrentPage(0);
      var escaped = (value || '').replace(/([\\"])/g, '\\$1');
      var structured = escaped ? "args.mltk.experiment.title=\"*".concat(escaped, "*\"") : '';
      stateModel.set('search', structured);
    }, [stateModel]);
    var handlePageChange = (0, _react.useCallback)(function (e, _ref2) {
      var page = _ref2.page;
      setCurrentPage(page - 1);
    }, []);
    var totalCount = savedAlertsCollection.paging ? savedAlertsCollection.paging.get('total') || alerts.length : alerts.length;
    var totalPages = Math.ceil(alerts.length / ALERTS_PER_PAGE);
    var pageStart = currentPage * ALERTS_PER_PAGE;
    var pagedAlerts = alerts.slice(pageStart, pageStart + ALERTS_PER_PAGE);
    return /*#__PURE__*/_react.default.createElement(PageContainer, null, /*#__PURE__*/_react.default.createElement(TitleSection, null, /*#__PURE__*/_react.default.createElement(Title, null, (0, _i18n.gettext)('Alerts for Experiment: '), experimentTitle), /*#__PURE__*/_react.default.createElement(Description, null, (0, _i18n.gettext)('Alerts set a condition that triggers an action, such as sending an email that contains the results of the triggering search to a list of people. Click the name to view the alert. Open the alert in Search to refine the parameters.'))), /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "AlertFilterBar"
    }, /*#__PURE__*/_react.default.createElement(_AlertFilterBar.default, {
      count: totalCount,
      onSearchChange: handleSearchChange,
      searchValue: searchFilter
    })), isFetching ? /*#__PURE__*/_react.default.createElement(SpinnerWrapper, null, /*#__PURE__*/_react.default.createElement(_WaitSpinner.default, {
      size: "large"
    })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "AlertsTable"
    }, /*#__PURE__*/_react.default.createElement(_AlertsTable.default, {
      alertActionsCollection: alertActionsCollection,
      alerts: pagedAlerts,
      application: application,
      experiment: experiment,
      onSort: handleSort,
      rolesCollection: rolesCollection,
      serverInfo: serverInfo,
      sortDirection: sortDirection,
      sortKey: sortKey,
      stateModel: stateModel,
      user: user
    })), totalPages > 1 && /*#__PURE__*/_react.default.createElement(PaginationContainer, null, /*#__PURE__*/_react.default.createElement(_Paginator.default, {
      alwaysShowLastPageLink: true,
      current: currentPage + 1,
      onChange: handlePageChange,
      totalPages: totalPages
    }))));
  }
  ExperimentAlertsPage.propTypes = {
    alertActionsCollection: _propTypes.default.object.isRequired,
    application: _propTypes.default.object.isRequired,
    experiment: _propTypes.default.object.isRequired,
    rolesCollection: _propTypes.default.object,
    savedAlertsCollection: _propTypes.default.object.isRequired,
    serverInfo: _propTypes.default.object,
    stateModel: _propTypes.default.object.isRequired,
    user: _propTypes.default.object.isRequired
  };
  ExperimentAlertsPage.defaultProps = {
    rolesCollection: null,
    serverInfo: null
  };
  var _default = _exports.default = ExperimentAlertsPage;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/ExperimentAlerts.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/util/loadLayout.es"), __webpack_require__("./src/main/webapp/collections/Alerts.es"), __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("experimentAlerts/ExperimentAlertsReactView")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectToString, _webDomCollectionsForEach, _swcMltk, _i18n, _loadLayout, _Alerts, _PolymorphicExperiment, _ExperimentAlertsReactView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _loadLayout = _interopRequireDefault(_loadLayout);
  _Alerts = _interopRequireDefault(_Alerts);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _ExperimentAlertsReactView = _interopRequireDefault(_ExperimentAlertsReactView);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /*
   * This router is *heavily* based off the alerts router:
   * routers/Alerts.js - please use it as a reference.
   */
  var _default = _exports.default = _swcMltk.BaseListingsRouter.extend({
    initialize: function initialize() {
      var _this = this;
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.classList && node.classList.contains('shared-page')) {
              // eslint-disable-next-line no-param-reassign
              node.style.display = 'none'; // Hide dynamically added element
            }
          });
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      _swcMltk.BaseListingsRouter.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Experiment Alerts'));
      this.loadingMessage = (0, _i18n.gettext)('Loading...');

      // state model
      this.stateModel.set({
        sortKey: 'name',
        sortDirection: 'asc',
        count: 0,
        offset: 0
      });
      this.stateModel.set('fetching', true);
      this.deferreds.layout = _swcMltk.jquery.Deferred();
      (0, _loadLayout.default)(function (layout) {
        _this.deferreds.layout.resolve(layout.create());
      });
      // experiments
      this.deferreds.experimentFetch = _swcMltk.jquery.Deferred();

      // collections
      this.savedAlertsCollection = new _Alerts.default();
      this.alertActionsCollection = new _swcMltk.ModAlertActionsCollection();

      // flash message
      this.flashMessageView = new _swcMltk.FlashMessagesView({
        collection: {
          savedAlertsCollection: this.savedAlertsCollection
        }
      });

      // TODO: Add fetch data options - currently doing and unbouded fetch
      this.deferredAlertActionCollection = this.alertActionsCollection.fetch({
        data: {
          app: this.model.application.get('app'),
          owner: this.model.application.get('owner'),
          search: 'disabled!=1'
        },
        addListInTriggeredAlerts: true
      });

      // events
      this.stateModel.on('change:sortDirection change:sortKey change:search change:offset', _swcMltk.underscore.debounce(function () {
        _this.fetchListCollection();
      }, 0), this);
      this.savedAlertsCollection.on('destroy', function () {
        _this.fetchListCollection();
      }, this);
    },
    addError: function addError(id, msg) {
      var message = {
        type: _swcMltk.splunkDUtils.ERROR,
        html: msg
      };
      this.flashMessageView.flashMsgHelper.addGeneralMessage(id, message);
      this.isError = true;
    },
    renderFlashMessages: function renderFlashMessages() {
      var flashMessagesEl = this.flashMessageView.render().el;
      this.pageView.$('.main-section-body').html(flashMessagesEl);
    },
    initializeAndRenderViews: function initializeAndRenderViews() {
      var _this2 = this;
      if (this.isError) {
        this.renderFlashMessages();
      }
      if (this.model.user.canUseAlerts()) {
        _swcMltk.jquery.when(this.deferredAlertActionCollection, this.deferreds.experimentFetch, this.deferreds.layout).then(function (alertActionCollection, experimentFetch, layout) {
          _this2.alertsView = new _ExperimentAlertsReactView.default({
            model: {
              experiment: _this2.model.experiment,
              state: _this2.stateModel,
              application: _this2.model.application,
              appLocal: _this2.model.appLocal,
              classicurl: _this2.model.classicurl,
              user: _this2.model.user,
              uiPrefs: _this2.uiPrefsModel,
              serverInfo: _this2.model.serverInfo,
              rawSearch: _this2.rawSearch
            },
            collection: {
              savedAlerts: _this2.savedAlertsCollection,
              roles: _this2.rolesCollection,
              apps: _this2.collection.appLocals,
              alertActions: _this2.alertActionsCollection
            }
          });
          layout.getContainerElement().appendChild(_this2.alertsView.render().el);
          _this2.uiPrefsModel.entry.content.on('change', function () {
            this.populateUIPrefs();
          }, _this2);
          _this2.uiPrefsModel.entry.content.on('change:display.prefs.aclFilter', function () {
            this.fetchListCollection();
          }, _this2);
        });
      } else {
        // Display the paywall if we are running on a free license. Alerts are not available in the free version
        this.paywallView = new _swcMltk.PaywallView({
          title: (0, _i18n.gettext)('Experiment Alerts'),
          model: {
            application: this.model.application,
            serverInfo: this.model.serverInfo
          }
        });
        this.pageView.$('.main-section-body').html(this.paywallView.render().el);
      }
    },
    fetchListCollection: function fetchListCollection() {
      var _this3 = this;
      if (this.model.user.canUseAlerts()) {
        this.model.classicurl.fetch();
        if (this.model.classicurl.get('search')) {
          this.stateModel.set('search', this.model.classicurl.get('search'), {
            silent: true
          });
          this.model.classicurl.unset('search');
          this.model.classicurl.save({}, {
            replaceState: true
          });
        }
        if (this.model.classicurl.get('rawSearch')) {
          this.rawSearch.set('rawSearch', this.model.classicurl.get('rawSearch'), {
            silent: true
          });
          this.model.classicurl.unset('rawSearch');
          this.model.classicurl.save({}, {
            replaceState: true
          });
        }
        var search = this.stateModel.get('search') || '';
        var buttonFilterSearch = this.getButtonFilterSearch();
        if (search) {
          search += ' AND ';
        }
        if (buttonFilterSearch) {
          search += "".concat(buttonFilterSearch, " AND ");
        }
        search += "".concat(_Alerts.default.availableWithUserWildCardSearchString(this.model.application.get('owner')), " AND is_visible=1");
        if (this.model.classicurl.get('experimentId')) {
          if (!this.model.experiment) {
            this.model.experiment = new _PolymorphicExperiment.default({
              entry: [{
                content: {
                  type: this.model.classicurl.get('experimentType')
                }
              }]
            }, {
              parse: true
            });
            this.flashMessageView.register(this.model.experiment);
          }
          var expId = this.model.classicurl.get('experimentId');
          this.model.experiment.set(this.model.experiment.idAttribute, expId);
          this.model.experiment.fetch({
            success: function success(model, response) {
              _this3.deferreds.experimentFetch.resolve();
            },
            error: function error(model, response) {
              _this3.renderFlashMessages();
            }
          });
        } else {
          var msg = 'This page cannot be used without an experiment ID in the query parameters.';
          var id = 'missing_experiment_id_in_query_parameters';
          this.addError(id, msg);
        }
        _swcMltk.jquery.when(this.deferreds.experimentFetch).then(function () {
          var guid = _this3.model.experiment.entry.get('name');
          search += " AND name=*".concat(guid, "*");
          _this3.stateModel.set('fetching', true);
          return _this3.savedAlertsCollection.fetch({
            requireExperiment: true,
            experimentName: guid,
            data: {
              app: _this3.model.application.get('app'),
              owner: _this3.model.application.get('owner'),
              sort_dir: _this3.stateModel.get('sortDirection'),
              sort_key: _this3.stateModel.get('sortKey').split(','),
              sort_mode: ['natural', 'natural'],
              search: search,
              count: _this3.stateModel.get('count'),
              listDefaultActionArgs: true,
              offset: _this3.stateModel.get('offset')
            },
            success: function success() {
              _this3.stateModel.set('fetching', false);
            }
          });
        });
      } else {
        this.stateModel.set('fetching', false);
      }
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experimentAlerts/ExperimentAlertsReactView":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("./src/main/webapp/components/shared/ComponentErrorBoundary.jsx"), __webpack_require__("./src/main/webapp/components/experimentAlerts/ExperimentAlertsPage.jsx"), __webpack_require__("./src/main/webapp/util/themeCompat.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module, _react, _reactDom, _ComponentErrorBoundary, _ExperimentAlertsPage, _themeCompat) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _ComponentErrorBoundary = _interopRequireDefault(_ComponentErrorBoundary);
  _ExperimentAlertsPage = _interopRequireDefault(_ExperimentAlertsPage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.BaseView.extend({
    moduleId: _module.default.id,
    initialize: function initialize() {
      _swcMltk.BaseView.prototype.initialize.apply(this, arguments);
    },
    render: function render() {
      _reactDom.default.render(_react.default.createElement(_themeCompat.AITKThemeProvider, null, _react.default.createElement(_ComponentErrorBoundary.default, {
        name: 'ExperimentAlertsPage',
        fallback: _react.default.createElement('div', {
          style: {
            padding: 20,
            color: 'red'
          }
        }, 'Experiment Alerts failed to render. Check the browser console for details.')
      }, _react.default.createElement(_ExperimentAlertsPage.default, {
        experiment: this.model.experiment,
        stateModel: this.model.state,
        application: this.model.application,
        appLocal: this.model.appLocal,
        user: this.model.user,
        serverInfo: this.model.serverInfo,
        savedAlertsCollection: this.collection.savedAlerts,
        alertActionsCollection: this.collection.alertActions,
        rolesCollection: this.collection.roles
      }))), this.el);
      return this;
    },
    remove: function remove() {
      _reactDom.default.unmountComponentAtNode(this.el);
      _swcMltk.BaseView.prototype.remove.apply(this, arguments);
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiment_alerts.es","pages_common"]]]);