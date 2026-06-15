(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["containermanagement"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/containermanagement.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/ContainerManagement.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_ContainerManagement, _swcMltk) {
  "use strict";

  _ContainerManagement = _interopRequireDefault(_ContainerManagement);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _ContainerManagement.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/containerManagement/Body/Body.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.flat-map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.array.unscopables.flat-map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.match.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/DefinitionList.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/react-icons/QuestionCircle.js"), __webpack_require__("./node_modules/@splunk/react-icons/ExclamationTriangle.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/containerManagement/Body/Body.styles.js"), __webpack_require__("./src/main/webapp/components/containerManagement/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayFlatMap, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esArraySlice, _esArraySort, _esArrayUnscopablesFlatMap, _esObjectEntries, _esObjectToString, _esRegexpExec, _esRegexpToString, _esSet, _esStringIncludes, _esStringIterator, _esStringMatch, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _react, _propTypes, _Modal, _Button, _Select, _DefinitionList, _Tooltip, _QuestionCircle, _Warning, _Text, _ConnectionManagementApi, _i18n, _Body, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _Select = _interopRequireDefault(_Select);
  _DefinitionList = _interopRequireDefault(_DefinitionList);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _QuestionCircle = _interopRequireDefault(_QuestionCircle);
  _Warning = _interopRequireDefault(_Warning);
  _Text = _interopRequireDefault(_Text);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t2, o) { n.p = e.prev, n.n = e.next; try { return r(_t2, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
  function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
  function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
  function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
  function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
  function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
  function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
  function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
  function _OverloadYield(e, d) { this.v = e, this.k = d; }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  // import Header from '../Header/Header';

  var Body = function Body(_ref) {
    var _ref$canControl = _ref.canControl,
      canControl = _ref$canControl === void 0 ? false : _ref$canControl,
      _ref$canEnableHPA = _ref.canEnableHPA,
      canEnableHPA = _ref$canEnableHPA === void 0 ? false : _ref$canEnableHPA,
      _ref$canList = _ref.canList,
      canList = _ref$canList === void 0 ? false : _ref$canList,
      filter = _ref.filter,
      searchTerm = _ref.searchTerm;
    var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      rows = _useState2[0],
      setRows = _useState2[1];
    var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      expandedRowId = _useState4[0],
      setExpandedRowId = _useState4[1];
    var _useState5 = (0, _react.useState)(1),
      _useState6 = _slicedToArray(_useState5, 2),
      pageNum = _useState6[0],
      setPageNum = _useState6[1];
    var _useState7 = (0, _react.useState)('container_name'),
      _useState8 = _slicedToArray(_useState7, 2),
      sortKey = _useState8[0],
      setSortKey = _useState8[1];
    var _useState9 = (0, _react.useState)('asc'),
      _useState10 = _slicedToArray(_useState9, 2),
      sortDir = _useState10[0],
      setSortDir = _useState10[1];
    var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      showModal = _useState12[0],
      setShowModal = _useState12[1];
    var _useState13 = (0, _react.useState)(null),
      _useState14 = _slicedToArray(_useState13, 2),
      modalRow = _useState14[0],
      setModalRow = _useState14[1];
    var _useState15 = (0, _react.useState)({
        image: '',
        cluster: 'docker',
        runtime: 'None',
        mode: 'PROD'
      }),
      _useState16 = _slicedToArray(_useState15, 2),
      formValues = _useState16[0],
      setFormValues = _useState16[1];
    var _useState17 = (0, _react.useState)({
        min_cpu: '250m',
        max_cpu: '800m',
        min_memory: '512Mi',
        max_memory: '3Gi',
        min_memory_value: '512',
        min_memory_unit: 'Mi',
        max_memory_value: '3',
        max_memory_unit: 'Gi',
        hpa_enabled: false,
        min_replicas: '1',
        max_replicas: '3'
      }),
      _useState18 = _slicedToArray(_useState17, 2),
      dsdlDefaults = _useState18[0],
      setDsdlDefaults = _useState18[1];
    var _useState19 = (0, _react.useState)(''),
      _useState20 = _slicedToArray(_useState19, 2),
      modalMessage = _useState20[0],
      setModalMessage = _useState20[1];
    var _useState21 = (0, _react.useState)(false),
      _useState22 = _slicedToArray(_useState21, 2),
      startLoading = _useState22[0],
      setStartLoading = _useState22[1];
    var _useState23 = (0, _react.useState)([]),
      _useState24 = _slicedToArray(_useState23, 2),
      dockerImages = _useState24[0],
      setDockerImages = _useState24[1];
    var _useState25 = (0, _react.useState)(false),
      _useState26 = _slicedToArray(_useState25, 2),
      showStopModal = _useState26[0],
      setShowStopModal = _useState26[1];
    var _useState27 = (0, _react.useState)(null),
      _useState28 = _slicedToArray(_useState27, 2),
      stopModalRow = _useState28[0],
      setStopModalRow = _useState28[1];
    var _useState29 = (0, _react.useState)(''),
      _useState30 = _slicedToArray(_useState29, 2),
      stopModalMessage = _useState30[0],
      setStopModalMessage = _useState30[1];
    var _useState31 = (0, _react.useState)(false),
      _useState32 = _slicedToArray(_useState31, 2),
      stopLoading = _useState32[0],
      setStopLoading = _useState32[1];
    var _useState33 = (0, _react.useState)(false),
      _useState34 = _slicedToArray(_useState33, 2),
      showLogsModal = _useState34[0],
      setShowLogsModal = _useState34[1];
    var _useState35 = (0, _react.useState)(null),
      _useState36 = _slicedToArray(_useState35, 2),
      logsModalRow = _useState36[0],
      setLogsModalRow = _useState36[1];
    var _useState37 = (0, _react.useState)([]),
      _useState38 = _slicedToArray(_useState37, 2),
      containerLogsData = _useState38[0],
      setContainerLogsData = _useState38[1];
    var _useState39 = (0, _react.useState)(false),
      _useState40 = _slicedToArray(_useState39, 2),
      logsLoading = _useState40[0],
      setLogsLoading = _useState40[1];
    var _useState41 = (0, _react.useState)(''),
      _useState42 = _slicedToArray(_useState41, 2),
      logsError = _useState42[0],
      setLogsError = _useState42[1];
    var _useState43 = (0, _react.useState)(false),
      _useState44 = _slicedToArray(_useState43, 2),
      showDeleteModal = _useState44[0],
      setShowDeleteModal = _useState44[1];
    var _useState45 = (0, _react.useState)(null),
      _useState46 = _slicedToArray(_useState45, 2),
      deleteModalRow = _useState46[0],
      setDeleteModalRow = _useState46[1];
    var _useState47 = (0, _react.useState)(''),
      _useState48 = _slicedToArray(_useState47, 2),
      deleteModalMessage = _useState48[0],
      setDeleteModalMessage = _useState48[1];
    var _useState49 = (0, _react.useState)(false),
      _useState50 = _slicedToArray(_useState49, 2),
      deleteLoading = _useState50[0],
      setDeleteLoading = _useState50[1];
    var _useState51 = (0, _react.useState)(true),
      _useState52 = _slicedToArray(_useState51, 2),
      isLoading = _useState52[0],
      setIsLoading = _useState52[1];
    var fetchData = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var containerResponse, transformedRows, dsdlResponse, sharingMap, existingNames, newModelRows;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setIsLoading(true);
            _context.prev = 1;
            _context.next = 4;
            return (0, _ConnectionManagementApi.getContainerData)();
          case 4:
            containerResponse = _context.sent;
            transformedRows = [];
            if ((containerResponse === null || containerResponse === void 0 ? void 0 : containerResponse.status) === 'success' && containerResponse.config) {
              transformedRows = Object.entries(containerResponse.config).map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                  name = _ref4[0],
                  details = _ref4[1];
                return _objectSpread(_objectSpread({
                  id: name,
                  container_name: name
                }, details), {}, {
                  // Prefer backend-provided status; fall back to simple api_url check only
                  // when status is missing.
                  status: details.status || (details.api_url ? 'Active' : 'Unknown')
                });
              });
            }
            _context.next = 9;
            return (0, _ConnectionManagementApi.getDSDLModels)('', {
              count: 0
            });
          case 9:
            dsdlResponse = _context.sent;
            sharingMap = {};
            if (dsdlResponse !== null && dsdlResponse !== void 0 && dsdlResponse.entry && Array.isArray(dsdlResponse.entry)) {
              dsdlResponse.entry.forEach(function (e) {
                var _e$content, _e$content$mlsplMode, _e$acl;
                var modelName = e === null || e === void 0 ? void 0 : (_e$content = e.content) === null || _e$content === void 0 ? void 0 : (_e$content$mlsplMode = _e$content['mlspl:model_info']) === null || _e$content$mlsplMode === void 0 ? void 0 : _e$content$mlsplMode.model_name;
                var sharing = (e === null || e === void 0 ? void 0 : (_e$acl = e.acl) === null || _e$acl === void 0 ? void 0 : _e$acl.sharing) || 'N/A';
                if (modelName) {
                  sharingMap[modelName] = sharing;
                }
              });
              existingNames = new Set(transformedRows.map(function (r) {
                return r.container_name;
              }));
              newModelRows = dsdlResponse.entry.filter(function (e) {
                var _e$content2, _e$content2$mlsplMod;
                return (e === null || e === void 0 ? void 0 : (_e$content2 = e.content) === null || _e$content2 === void 0 ? void 0 : (_e$content2$mlsplMod = _e$content2['mlspl:model_info']) === null || _e$content2$mlsplMod === void 0 ? void 0 : _e$content2$mlsplMod.algo_name) === 'AITKContainer';
              }).map(function (e) {
                var _e$content3, _e$content3$mlsplMod;
                return e === null || e === void 0 ? void 0 : (_e$content3 = e.content) === null || _e$content3 === void 0 ? void 0 : (_e$content3$mlsplMod = _e$content3['mlspl:model_info']) === null || _e$content3$mlsplMod === void 0 ? void 0 : _e$content3$mlsplMod.model_name;
              }).filter(Boolean).filter(function (modelName) {
                return !existingNames.has(modelName);
              }).map(function (modelName) {
                return {
                  id: modelName,
                  container_name: modelName,
                  image: '',
                  cluster: 'docker',
                  runtime: 'None',
                  mode: 'N/A',
                  status: 'Unknown',
                  sharing: sharingMap[modelName] || 'N/A'
                };
              });
              transformedRows = [].concat(_toConsumableArray(transformedRows), _toConsumableArray(newModelRows));
            }
            transformedRows = transformedRows.map(function (row) {
              var rawSharing = row.container_name === '__dev__' ? 'N/A' : sharingMap[row.container_name] || 'N/A';
              var displaySharing;
              if (rawSharing === 'user') {
                displaySharing = 'private';
              } else if (rawSharing === 'app' || row.container_name === '__dev__' && rawSharing === 'N/A') {
                displaySharing = 'global';
              } else {
                displaySharing = 'global';
              }
              return _objectSpread(_objectSpread({}, row), {}, {
                sharing: displaySharing
              });
            });
            setRows(transformedRows);
            _context.next = 20;
            break;
          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](1);
            console.error('Error fetching container data:', _context.t0);
            setRows([]);
          case 20:
            _context.prev = 20;
            setIsLoading(false);
            return _context.finish(20);
          case 23:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 16, 20, 23]]);
    })), []);
    (0, _react.useEffect)(function () {
      fetchData();
    }, [fetchData]);
    var filteredRows = rows.filter(function (row) {
      var _row$status, _row$runtime;
      var status = ((_row$status = row.status) === null || _row$status === void 0 ? void 0 : _row$status.toLowerCase()) || 'unknown';
      if (filter === 'ACTIVE' && status !== 'active') return false;
      if (filter === 'INACTIVE' && status !== 'inactive' && status !== 'unknown') return false;
      if (filter === 'GPU' && ((_row$runtime = row.runtime) === null || _row$runtime === void 0 ? void 0 : _row$runtime.toUpperCase()) !== 'GPU') return false;
      if (searchTerm) {
        var _row$container_name, _row$mode;
        var term = searchTerm.toLowerCase();
        if (!((_row$container_name = row.container_name) !== null && _row$container_name !== void 0 && _row$container_name.toLowerCase().includes(term)) && !((_row$mode = row.mode) !== null && _row$mode !== void 0 && _row$mode.toLowerCase().includes(term)) && !status.includes(term)) {
          return false;
        }
      }
      return true;
    });
    var handleChange = function handleChange(e, _ref5) {
      var page = _ref5.page;
      return setPageNum(page);
    };
    var sortedRows = (0, _react.useMemo)(function () {
      if (!filteredRows || filteredRows.length === 0) return [];
      var sorted = _toConsumableArray(filteredRows).sort(function (a, b) {
        try {
          var aVal, bVal;
          switch (sortKey) {
            case 'container_name':
              aVal = (a === null || a === void 0 ? void 0 : a.container_name) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.container_name) || '';
              break;
            default:
              return 0;
          }
          var aStr = String(aVal).toLowerCase();
          var bStr = String(bVal).toLowerCase();
          if (aStr < bStr) return sortDir === 'asc' ? -1 : 1;
          if (aStr > bStr) return sortDir === 'asc' ? 1 : -1;
          return 0;
        } catch (e) {
          return 0;
        }
      });
      return sorted;
    }, [filteredRows, sortKey, sortDir]);
    var paginatedRows = sortedRows.slice((pageNum - 1) * _constants.ROWS_PER_PAGE, pageNum * _constants.ROWS_PER_PAGE);
    var handleStartClick = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(row) {
        var _ref9, _kube$min_replicas, _ref10, _kube$max_replicas, _ref11, _kube$cpu_threshold_p, response, images, dsdlConfig, kube, kubeStanza, parseMem, minParsed, maxParsed, hpaDefaultEnabled, newDefaults;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setModalRow(row);
              setShowModal(true);
              setModalMessage('');
              _context2.prev = 3;
              _context2.next = 6;
              return (0, _ConnectionManagementApi.getDSDLImages)();
            case 6:
              response = _context2.sent;
              if (response !== null && response !== void 0 && response.docker_images) {
                images = Object.entries(response.docker_images).map(function (_ref7) {
                  var _ref8 = _slicedToArray(_ref7, 2),
                    key = _ref8[0],
                    value = _ref8[1];
                  return {
                    label: value.label,
                    value: value.image
                  };
                });
                setDockerImages(images);
              } else {
                setDockerImages([]);
              }
              // Fetch defaults from DSDL config for kubernetes
              _context2.next = 10;
              return (0, _ConnectionManagementApi.getDSDLConfigData)('/kubernetes');
            case 10:
              dsdlConfig = _context2.sent;
              kube = (dsdlConfig === null || dsdlConfig === void 0 ? void 0 : dsdlConfig.config) || {};
              kubeStanza = kube._stanza || {};
              parseMem = function parseMem(s, fallback) {
                var val = (s || fallback || '').toString();
                if (/^\d+\s*(Mi|Gi)$/i.test(val)) {
                  var m = val.match(/^(\d+)\s*(Mi|Gi)$/i);
                  return {
                    value: m[1],
                    unit: m[2]
                  };
                }
                // fallback: digits only -> assume Mi
                if (/^\d+$/.test(val)) return {
                  value: val,
                  unit: 'Mi'
                };
                // unknown -> defaults
                return {
                  value: '512',
                  unit: 'Mi'
                };
              };
              minParsed = parseMem(kube.min_memory, '512Mi');
              maxParsed = parseMem(kube.max_memory, '3Gi');
              hpaDefaultEnabled = !!(kube.hpa_enabled && (kube.hpa_enabled === '1' || kube.hpa_enabled === 1 || kube.hpa_enabled === true));
              newDefaults = {
                min_cpu: kube.min_cpu || '250m',
                max_cpu: kube.max_cpu || '800m',
                min_memory: kube.min_memory || '512Mi',
                max_memory: kube.max_memory || '3Gi',
                min_memory_value: minParsed.value,
                min_memory_unit: minParsed.unit,
                max_memory_value: maxParsed.value,
                max_memory_unit: maxParsed.unit,
                hpa_enabled: hpaDefaultEnabled,
                // Only prefill replicas and CPU threshold when HPA is enabled by default; otherwise leave empty
                min_replicas: hpaDefaultEnabled ? ((_ref9 = (_kube$min_replicas = kube.min_replicas) !== null && _kube$min_replicas !== void 0 ? _kube$min_replicas : kubeStanza.min_replicas) !== null && _ref9 !== void 0 ? _ref9 : '1').toString() : '',
                max_replicas: hpaDefaultEnabled ? ((_ref10 = (_kube$max_replicas = kube.max_replicas) !== null && _kube$max_replicas !== void 0 ? _kube$max_replicas : kubeStanza.max_replicas) !== null && _ref10 !== void 0 ? _ref10 : '3').toString() : '',
                cpu_threshold_percent: hpaDefaultEnabled ? ((_ref11 = (_kube$cpu_threshold_p = kube.cpu_threshold_percent) !== null && _kube$cpu_threshold_p !== void 0 ? _kube$cpu_threshold_p : kubeStanza.cpu_threshold_percent) !== null && _ref11 !== void 0 ? _ref11 : '70').toString() : ''
              };
              setDsdlDefaults(newDefaults);
              // Initialize form fields with defaults when opening modal
              setFormValues(function (prev) {
                return _objectSpread(_objectSpread({}, prev), {}, {
                  min_cpu: newDefaults.min_cpu,
                  max_cpu: newDefaults.max_cpu,
                  min_memory_value: newDefaults.min_memory_value,
                  min_memory_unit: newDefaults.min_memory_unit,
                  max_memory_value: newDefaults.max_memory_value,
                  max_memory_unit: newDefaults.max_memory_unit,
                  hpa_enabled: newDefaults.hpa_enabled,
                  min_replicas: newDefaults.min_replicas,
                  max_replicas: newDefaults.max_replicas,
                  cpu_threshold_percent: newDefaults.cpu_threshold_percent
                });
              });
              _context2.next = 25;
              break;
            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](3);
              setDockerImages([]);
            case 25:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[3, 22]]);
      }));
      return function handleStartClick(_x) {
        return _ref6.apply(this, arguments);
      };
    }();
    var handleFormChange = function handleFormChange(key, value) {
      setFormValues(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, value));
      });
    };
    var handleModalStart = /*#__PURE__*/function () {
      var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var _response$updated_con, runtimeValue, composeMem, currentHpaEnabled, defaultHpaEnabled, hpaPayload, payload, response;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              setStartLoading(true);
              setModalMessage('Starting container...');
              _context3.prev = 2;
              runtimeValue = formValues.runtime === 'None' ? '' : formValues.runtime;
              composeMem = function composeMem(value, unit) {
                return value ? "".concat(value).concat(unit) : '';
              };
              currentHpaEnabled = !!formValues.hpa_enabled;
              defaultHpaEnabled = !!dsdlDefaults.hpa_enabled; // Validation: when HPA is enabled, min/max replicas and CPU threshold are required
              if (!(formValues.cluster === 'kubernetes' && currentHpaEnabled)) {
                _context3.next = 12;
                break;
              }
              if (!(!formValues.min_replicas || !formValues.max_replicas || !formValues.cpu_threshold_percent)) {
                _context3.next = 12;
                break;
              }
              setModalMessage('Please fill Min replicas, Max replicas, and CPU threshold when HPA is enabled.');
              setStartLoading(false);
              return _context3.abrupt("return");
            case 12:
              hpaPayload = {};
              if (formValues.cluster === 'kubernetes') {
                if (currentHpaEnabled) {
                  // If the enabled/disabled flag changed compared to defaults, send the flag
                  if (currentHpaEnabled !== defaultHpaEnabled) {
                    hpaPayload.hpa_enabled = 1;
                  }
                  // Always send explicit replicas and CPU threshold when HPA is enabled
                  hpaPayload.min_replicas = formValues.min_replicas;
                  hpaPayload.max_replicas = formValues.max_replicas;
                  hpaPayload.cpu_threshold_percent = formValues.cpu_threshold_percent;
                } else if (!currentHpaEnabled && defaultHpaEnabled) {
                  // When disabling previously-enabled HPA, send flag and clear values
                  hpaPayload.hpa_enabled = 0;
                  hpaPayload.min_replicas = '';
                  hpaPayload.max_replicas = '';
                  hpaPayload.cpu_threshold_percent = '';
                }
              }
              payload = {
                payload: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
                  image: formValues.image,
                  model: modalRow.container_name,
                  runtime: runtimeValue,
                  cluster: formValues.cluster,
                  mode: formValues.mode
                }, formValues.cluster === 'kubernetes' && formValues.min_cpu && formValues.min_cpu !== dsdlDefaults.min_cpu ? {
                  min_cpu: formValues.min_cpu
                } : {}), formValues.cluster === 'kubernetes' && formValues.max_cpu && formValues.max_cpu !== dsdlDefaults.max_cpu ? {
                  max_cpu: formValues.max_cpu
                } : {}), formValues.cluster === 'kubernetes' && formValues.min_memory_value && formValues.min_memory_unit && composeMem(formValues.min_memory_value, formValues.min_memory_unit) !== dsdlDefaults.min_memory ? {
                  min_memory: composeMem(formValues.min_memory_value, formValues.min_memory_unit)
                } : {}), formValues.cluster === 'kubernetes' && formValues.max_memory_value && formValues.max_memory_unit && composeMem(formValues.max_memory_value, formValues.max_memory_unit) !== dsdlDefaults.max_memory ? {
                  max_memory: composeMem(formValues.max_memory_value, formValues.max_memory_unit)
                } : {}), hpaPayload)
              };
              _context3.next = 17;
              return (0, _ConnectionManagementApi.startContainer)('', payload);
            case 17:
              response = _context3.sent;
              if (response !== null && response !== void 0 && (_response$updated_con = response.updated_config) !== null && _response$updated_con !== void 0 && _response$updated_con.error) {
                setModalMessage("Error: ".concat(response.updated_config.error));
              } else if ((response === null || response === void 0 ? void 0 : response.status) === 'success') {
                setModalMessage(response.message || 'Started successfully!');
                setTimeout(function () {
                  setShowModal(false);
                  fetchData();
                }, 1000);
              } else {
                setModalMessage('Failed to start container.');
              }
              _context3.next = 24;
              break;
            case 21:
              _context3.prev = 21;
              _context3.t0 = _context3["catch"](2);
              setModalMessage('Error starting container.');
            case 24:
              _context3.prev = 24;
              setStartLoading(false);
              return _context3.finish(24);
            case 27:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[2, 21, 24, 27]]);
      }));
      return function handleModalStart() {
        return _ref12.apply(this, arguments);
      };
    }();
    var handleStopClick = function handleStopClick(row) {
      setStopModalRow(row);
      setShowStopModal(true);
      setStopModalMessage('');
    };
    var confirmStop = /*#__PURE__*/function () {
      var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var _response$stopped_con, payload, response, containerError, errorMsg;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              setStopLoading(true);
              setStopModalMessage('Stopping container...');
              _context4.prev = 2;
              payload = {
                payload: {
                  model: stopModalRow.container_name
                }
              };
              _context4.next = 6;
              return (0, _ConnectionManagementApi.stopContainer)('', payload);
            case 6:
              response = _context4.sent;
              // Check if response indicates success AND no error in stopped_container
              containerError = response === null || response === void 0 ? void 0 : (_response$stopped_con = response.stopped_container) === null || _response$stopped_con === void 0 ? void 0 : _response$stopped_con.error;
              if ((response === null || response === void 0 ? void 0 : response.status) === 'success' && !containerError) {
                setStopModalMessage("Container ".concat(stopModalRow.container_name, " stopped successfully!"));
                setTimeout(function () {
                  setShowStopModal(false);
                  fetchData();
                }, 1000);
              } else {
                // Keep modal open and show error
                errorMsg = containerError || (response === null || response === void 0 ? void 0 : response.message) || (response === null || response === void 0 ? void 0 : response.error) || 'Failed to stop container';
                setStopModalMessage("Error: ".concat(errorMsg));
              }
              _context4.next = 14;
              break;
            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](2);
              setStopModalMessage("Error: ".concat(_context4.t0.message));
            case 14:
              _context4.prev = 14;
              setStopLoading(false);
              return _context4.finish(14);
            case 17:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[2, 11, 14, 17]]);
      }));
      return function confirmStop() {
        return _ref13.apply(this, arguments);
      };
    }();
    var handleViewLogsClick = /*#__PURE__*/function () {
      var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(row) {
        var _response$container_l, payload, response, errorMsg;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              setLogsModalRow(row);
              setShowLogsModal(true);
              setLogsLoading(true);
              setLogsError('');
              setContainerLogsData([]);
              _context5.prev = 5;
              setLogsError('');
              payload = {
                payload: {
                  model: row.container_name
                }
              };
              _context5.next = 10;
              return (0, _ConnectionManagementApi.containerLogs)('', payload);
            case 10:
              response = _context5.sent;
              if ((response === null || response === void 0 ? void 0 : response.status) === 'success' && (_response$container_l = response.container_logs) !== null && _response$container_l !== void 0 && _response$container_l.entries) {
                setContainerLogsData(response.container_logs.entries);
              } else {
                errorMsg = (response === null || response === void 0 ? void 0 : response.message) || (response === null || response === void 0 ? void 0 : response.error) || 'Failed to fetch container logs';
                setLogsError("Error: ".concat(errorMsg));
              }
              _context5.next = 17;
              break;
            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](5);
              setLogsError("Error: ".concat(_context5.t0.message));
            case 17:
              _context5.prev = 17;
              setLogsLoading(false);
              return _context5.finish(17);
            case 20:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[5, 14, 17, 20]]);
      }));
      return function handleViewLogsClick(_x2) {
        return _ref14.apply(this, arguments);
      };
    }();
    var handleDeleteClick = function handleDeleteClick(row) {
      setDeleteModalRow(row);
      setShowDeleteModal(true);
      setDeleteModalMessage('');
    };
    var renderStatus = function renderStatus(status) {
      return status || 'Unknown';
    };
    var COLUMNS = canControl ? _constants.COLUMN_NAMES : _constants.COLUMN_NAMES_NO_ACTIONS;
    var getExpansionRow = function getExpansionRow(row) {
      return /*#__PURE__*/_react.default.createElement(_Body.StyledTable.Row, {
        key: "".concat(row.id, "-expansion")
      }, /*#__PURE__*/_react.default.createElement(_Body.StyledTable.Cell, {
        colSpan: COLUMNS.length
      }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default, {
        layout: "auto",
        separatorCharacter: "."
      }, Object.entries(row).filter(function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
          key = _ref16[0],
          value = _ref16[1];
        return key !== 'container_name' && key !== 'mode' && key !== 'id' && value != null && value !== 'None';
      }).flatMap(function (_ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
          key = _ref18[0],
          value = _ref18[1];
        return [/*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, {
          key: "".concat(row.id, "-term-").concat(key)
        }, key), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, {
          key: "".concat(row.id, "-desc-").concat(key)
        }, _typeof(value) === 'object' ? JSON.stringify(value) : String(value))];
      }))));
    };
    var confirmDelete = /*#__PURE__*/function () {
      var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        var response, errorMsg;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              setDeleteLoading(true);
              setDeleteModalMessage("Deleting ".concat(deleteModalRow.container_name, "..."));
              _context6.prev = 2;
              _context6.next = 5;
              return (0, _ConnectionManagementApi.deleteModels)(deleteModalRow.container_name);
            case 5:
              response = _context6.sent;
              if ((response === null || response === void 0 ? void 0 : response.status) === 'success') {
                setDeleteModalMessage("\u2705 Container ".concat(deleteModalRow.container_name, " deleted successfully!"));
                setTimeout(function () {
                  setShowDeleteModal(false);
                  fetchData();
                }, 1000);
              } else {
                errorMsg = (response === null || response === void 0 ? void 0 : response.message) || (response === null || response === void 0 ? void 0 : response.error) || 'Failed to delete container';
                setDeleteModalMessage("\u274C Error: ".concat(errorMsg));
              }
              _context6.next = 12;
              break;
            case 9:
              _context6.prev = 9;
              _context6.t0 = _context6["catch"](2);
              setDeleteModalMessage("\u274C Error: ".concat(_context6.t0.message));
            case 12:
              _context6.prev = 12;
              setDeleteLoading(false);
              return _context6.finish(12);
            case 15:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[2, 9, 12, 15]]);
      }));
      return function confirmDelete() {
        return _ref19.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '8px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Body.CenterPaginator, {
      alwaysShowLastPageLink: true,
      current: pageNum,
      onChange: handleChange,
      totalPages: Math.ceil(filteredRows.length / _constants.ROWS_PER_PAGE) || 1
    })), isLoading ? /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '16px',
        color: '#6b6b6b'
      }
    }, (0, _i18n.gettext)('Loading...')) : /*#__PURE__*/_react.default.createElement(_Body.StyledTable, {
      rowExpansion: "single",
      stripeRows: true
    }, /*#__PURE__*/_react.default.createElement(_Body.StyledTable.Head, null, COLUMNS.map(function (col, index) {
      if (index === 0) {
        // Container Name column
        return /*#__PURE__*/_react.default.createElement(_Body.HeaderTableCell, {
          key: col,
          onSort: function onSort(e, data) {
            var newSortKey = 'container_name';
            setSortKey(function (prevKey) {
              if (prevKey === newSortKey) {
                setSortDir(function (prevDir) {
                  return prevDir === 'asc' ? 'desc' : 'asc';
                });
              } else {
                setSortDir('asc');
              }
              return newSortKey;
            });
          },
          sortDir: sortKey === 'container_name' ? sortDir : 'none',
          sortKey: "container_name"
        }, col);
      }
      return /*#__PURE__*/_react.default.createElement(_Body.HeaderTableCell, {
        key: col
      }, col);
    })), /*#__PURE__*/_react.default.createElement(_Body.StyledTable.Body, null, paginatedRows.map(function (row, index) {
      var _row$status2;
      var rowBg = index % 2 === 0 ? '#ffffff' : '#f1f3f6';
      return /*#__PURE__*/_react.default.createElement(_Body.StyledTable.Row, {
        key: row.id,
        expanded: row.id === expandedRowId,
        expansionRow: getExpansionRow(row),
        onExpansion: function onExpansion() {
          return setExpandedRowId(function (prev) {
            return prev === row.id ? null : row.id;
          });
        }
      }, /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.container_name), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        typeBgColor: (0, _Body.getTypeBgColor)(row.mode)
      }, row.mode || 'N/A'), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        isStatus: true,
        statusColor: (0, _Body.getStatusColor)(row.status)
      }, renderStatus(row.status)), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.sharing || 'N/A'), canControl && /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.api_url ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Body.ActionLink, {
        onClick: function onClick() {
          return handleStopClick(row);
        },
        type: "button"
      }, _constants.ACTION_STOP), row.container_name !== '__dev__' && (((_row$status2 = row.status) === null || _row$status2 === void 0 ? void 0 : _row$status2.toLowerCase()) === 'active' ? /*#__PURE__*/_react.default.createElement(_Body.DisabledLink, null, _constants.ACTION_DELETE) : /*#__PURE__*/_react.default.createElement(_Body.ActiveLink, {
        onClick: function onClick() {
          return handleDeleteClick(row);
        },
        type: "button"
      }, _constants.ACTION_DELETE)), /*#__PURE__*/_react.default.createElement(_Body.ActionLink, {
        onClick: function onClick() {
          return handleViewLogsClick(row);
        },
        type: "button"
      }, _constants.ACTION_VIEW_LOGS)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Body.ActionLink, {
        onClick: function onClick() {
          return handleStartClick(row);
        },
        type: "button"
      }, _constants.ACTION_START), row.container_name !== '__dev__' && /*#__PURE__*/_react.default.createElement(_Body.ActiveLink, {
        onClick: function onClick() {
          return handleDeleteClick(row);
        },
        type: "button"
      }, _constants.ACTION_DELETE))));
    }))), showModal && /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: function onRequestClose(_ref20) {
        var reason = _ref20.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowModal(false);
      },
      open: showModal,
      style: {
        maxWidth: '700px',
        width: '700px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: function onRequestClose() {
        return setShowModal(false);
      },
      style: {
        borderBottom: '1px solid #d5d8de'
      },
      title: (0, _i18n.gettext)('Start Container: ') + ((modalRow === null || modalRow === void 0 ? void 0 : modalRow.container_name) || '')
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, !modalMessage && !startLoading && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Body.ModalFormTable, null, /*#__PURE__*/_react.default.createElement("tbody", null, ['Image', 'Cluster', 'Runtime', 'Mode'].map(function (field) {
      var key = field.toLowerCase();
      var value = formValues[key] || '';
      var options = {
        Image: [{
          label: 'Select Image',
          value: ''
        }].concat(_toConsumableArray(dockerImages)),
        Cluster: [{
          label: 'Docker',
          value: 'docker'
        }, {
          label: 'Kubernetes',
          value: 'kubernetes'
        }],
        Runtime: [{
          label: 'CPU',
          value: 'None'
        }, {
          label: 'GPU',
          value: 'GPU'
        }],
        Mode: [{
          label: 'PROD',
          value: 'PROD'
        }]
      };
      return /*#__PURE__*/_react.default.createElement(_Body.ModalFormRow, {
        key: field
      }, /*#__PURE__*/_react.default.createElement(_Body.ModalFormLabelCell, null, field, (0, _i18n.gettext)(':')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, {
        colSpan: "3"
      }, /*#__PURE__*/_react.default.createElement(_Select.default, {
        onChange: function onChange(e, _ref21) {
          var selectedValue = _ref21.value;
          return handleFormChange(key, selectedValue);
        },
        value: value
      }, options[field].map(function (opt) {
        return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
          key: opt.value,
          label: opt.label,
          value: opt.value
        });
      }))));
    }))), formValues.cluster === 'kubernetes' && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '8px'
      }
    }, canEnableHPA && /*#__PURE__*/_react.default.createElement(_Body.ModalFormTable, null, /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormLabelCell, null, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }
    }, (0, _i18n.gettext)('HPA Enabled'), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: "Enable Horizontal Pod Autoscaler. When enabled, Min/Max replica values and CPU threshold will be used when starting the container."
    }, /*#__PURE__*/_react.default.createElement(_QuestionCircle.default, {
      variant: "outlined"
    })), (0, _i18n.gettext)(':'))), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, {
      colSpan: "3"
    }, /*#__PURE__*/_react.default.createElement("input", {
      checked: !!formValues.hpa_enabled,
      onChange: function onChange(e) {
        var checked = e.target.checked;
        setFormValues(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            hpa_enabled: checked
          }, checked ? {} : {
            min_replicas: '',
            max_replicas: '',
            cpu_threshold_percent: ''
          });
        });
      },
      type: "checkbox"
    }))))), canEnableHPA && formValues.hpa_enabled && /*#__PURE__*/_react.default.createElement(_Body.ModalFormTable, null, /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormLabelCell, null, (0, _i18n.gettext)('Min replicas:')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      min: "1",
      onChange: function onChange(e) {
        return handleFormChange('min_replicas', e.target.value);
      },
      type: "number",
      value: formValues.min_replicas || ''
    })), /*#__PURE__*/_react.default.createElement(_Body.ModalFormSecondaryLabelCell, null, (0, _i18n.gettext)('Max replicas:')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      min: "1",
      onChange: function onChange(e) {
        return handleFormChange('max_replicas', e.target.value);
      },
      type: "number",
      value: formValues.max_replicas || ''
    }))), /*#__PURE__*/_react.default.createElement(_Body.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormLabelCell, null, (0, _i18n.gettext)('CPU threshold (%):')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, {
      colSpan: "3"
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      max: "100",
      min: "1",
      onChange: function onChange(e) {
        return handleFormChange('cpu_threshold_percent', e.target.value);
      },
      type: "number",
      value: formValues.cpu_threshold_percent || ''
    }))))), /*#__PURE__*/_react.default.createElement(_Body.ModalFormTable, null, /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormLabelCell, null, (0, _i18n.gettext)('Min CPU:')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e) {
        return handleFormChange('min_cpu', e.target.value);
      },
      type: "text",
      value: formValues.min_cpu || ''
    })), /*#__PURE__*/_react.default.createElement(_Body.ModalFormSecondaryLabelCell, null, (0, _i18n.gettext)('Max CPU:')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e) {
        return handleFormChange('max_cpu', e.target.value);
      },
      type: "text",
      value: formValues.max_cpu || ''
    }))), /*#__PURE__*/_react.default.createElement(_Body.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormLabelCell, null, (0, _i18n.gettext)('Min Memory:')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormSplit, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      min: "1",
      onChange: function onChange(e) {
        return handleFormChange('min_memory_value', e.target.value);
      },
      type: "number",
      value: formValues.min_memory_value || ''
    }), /*#__PURE__*/_react.default.createElement(_Select.default, {
      onChange: function onChange(e, _ref22) {
        var value = _ref22.value;
        return handleFormChange('min_memory_unit', value);
      },
      style: {
        width: '96px'
      },
      value: formValues.min_memory_unit || 'Mi'
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      value: "Mi"
    }, (0, _i18n.gettext)('Mi')), /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      value: "Gi"
    }, (0, _i18n.gettext)('Gi'))))), /*#__PURE__*/_react.default.createElement(_Body.ModalFormSecondaryLabelCell, null, (0, _i18n.gettext)('Max Memory:')), /*#__PURE__*/_react.default.createElement(_Body.ModalFormValueCell, null, /*#__PURE__*/_react.default.createElement(_Body.ModalFormSplit, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      min: "1",
      onChange: function onChange(e) {
        return handleFormChange('max_memory_value', e.target.value);
      },
      type: "number",
      value: formValues.max_memory_value || ''
    }), /*#__PURE__*/_react.default.createElement(_Select.default, {
      onChange: function onChange(e, _ref23) {
        var value = _ref23.value;
        return handleFormChange('max_memory_unit', value);
      },
      style: {
        width: '96px'
      },
      value: formValues.max_memory_unit || 'Gi'
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      value: "Mi"
    }, (0, _i18n.gettext)('Mi')), /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      value: "Gi"
    }, (0, _i18n.gettext)('Gi')))))))))), modalMessage && /*#__PURE__*/_react.default.createElement("p", null, modalMessage)), !startLoading && !modalMessage && /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: function onClick() {
        return setShowModal(false);
      }
    }, _constants.CANCEL), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      onClick: handleModalStart
    }, _constants.START))), showStopModal && /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: function onRequestClose(_ref24) {
        var reason = _ref24.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowStopModal(false);
      },
      open: showStopModal,
      style: {
        maxWidth: '700px',
        width: '700px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: function onRequestClose() {
        return setShowStopModal(false);
      },
      style: {
        borderBottom: '1px solid #d5d8de'
      },
      title: _constants.STOP_CONTAINER_TITLE
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, stopLoading && /*#__PURE__*/_react.default.createElement("p", null, _constants.STOPPING_CONTAINER), !stopLoading && stopModalMessage && /*#__PURE__*/_react.default.createElement("p", null, stopModalMessage), !stopLoading && !stopModalMessage && /*#__PURE__*/_react.default.createElement("p", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      style: {
        fontSize: '18px',
        color: '#eab308'
      }
    }), _constants.CONFIRM_STOP, " ", stopModalRow === null || stopModalRow === void 0 ? void 0 : stopModalRow.container_name, (0, _i18n.gettext)('?'))), !stopLoading && !stopModalMessage && /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: function onClick() {
        return setShowStopModal(false);
      }
    }, _constants.CANCEL), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      onClick: confirmStop
    }, _constants.STOP))), showLogsModal && /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: function onRequestClose(_ref25) {
        var reason = _ref25.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowLogsModal(false);
      },
      open: showLogsModal,
      style: {
        maxWidth: '700px',
        width: '700px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: function onRequestClose() {
        return setShowLogsModal(false);
      },
      style: {
        borderBottom: '1px solid #d5d8de'
      },
      title: "".concat((0, _i18n.gettext)('Logs:'), " ").concat(logsModalRow === null || logsModalRow === void 0 ? void 0 : logsModalRow.container_name)
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, {
      style: {
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace'
      }
    }, logsLoading && /*#__PURE__*/_react.default.createElement("p", null, (0, _i18n.gettext)('Loading logs...')), logsError && /*#__PURE__*/_react.default.createElement("p", {
      style: {
        color: 'red'
      }
    }, logsError), !logsLoading && !logsError && containerLogsData.length === 0 && /*#__PURE__*/_react.default.createElement("p", null, (0, _i18n.gettext)('No logs found.')), !logsLoading && !logsError && containerLogsData.map(function (entry, idx) {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: "log-entry-".concat(entry._time || idx, "-").concat(String(idx).substring(0, 8)),
        style: {
          marginBottom: '5px'
        }
      }, /*#__PURE__*/_react.default.createElement("strong", null, entry._time || 'N/A', (0, _i18n.gettext)(':')), ' ', entry.log);
    })), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      onClick: function onClick() {
        return setShowLogsModal(false);
      }
    }, (0, _i18n.gettext)('Close')))), showDeleteModal && /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: function onRequestClose(_ref26) {
        var reason = _ref26.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowDeleteModal(false);
      },
      open: showDeleteModal,
      style: {
        maxWidth: '700px',
        width: '700px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: function onRequestClose() {
        return setShowDeleteModal(false);
      },
      style: {
        borderBottom: '1px solid #d5d8de'
      },
      title: _constants.DELETE_CONTAINER_TITLE
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, deleteLoading && /*#__PURE__*/_react.default.createElement("p", null, (0, _i18n.gettext)('Deleting container...')), !deleteLoading && deleteModalMessage && /*#__PURE__*/_react.default.createElement("p", null, deleteModalMessage), !deleteLoading && !deleteModalMessage && /*#__PURE__*/_react.default.createElement("p", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      style: {
        fontSize: '18px',
        color: '#eab308'
      }
    }), _constants.CONFIRM_DELETE, " ", deleteModalRow === null || deleteModalRow === void 0 ? void 0 : deleteModalRow.container_name, (0, _i18n.gettext)('?'))), !deleteLoading && !deleteModalMessage && /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: function onClick() {
        return setShowDeleteModal(false);
      }
    }, _constants.CANCEL), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      onClick: confirmDelete
    }, _constants.DELETE))));
  };
  Body.propTypes = {
    canControl: _propTypes.default.bool,
    canEnableHPA: _propTypes.default.bool,
    canList: _propTypes.default.bool,
    filter: _propTypes.default.string,
    searchTerm: _propTypes.default.string
  };
  Body.defaultProps = {
    canControl: false,
    canEnableHPA: false,
    canList: false,
    filter: null,
    searchTerm: ''
  };
  var _default = _exports.default = Body;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/containerManagement/Body/Body.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./src/main/webapp/util/forwardRefComponent.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Table, _Paginator, _forwardRefComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getTypeBgColor = _exports.getStatusColor = _exports.StyledTable = _exports.PrimaryTableCell = _exports.ModalHeader = _exports.ModalFormValueCell = _exports.ModalFormTable = _exports.ModalFormSplit = _exports.ModalFormSecondaryLabelCell = _exports.ModalFormRow = _exports.ModalFormLabelCell = _exports.HeaderTableCell = _exports.ExpansionValue = _exports.ExpansionRow = _exports.ExpansionKey = _exports.DisabledLink = _exports.DefinitionListContainer = _exports.CloseButton = _exports.CenterPaginator = _exports.ActiveLink = _exports.ActionLink = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Table = _interopRequireDefault(_Table);
  _Paginator = _interopRequireDefault(_Paginator);
  _forwardRefComponent = _interopRequireDefault(_forwardRefComponent);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var StyledTable = _exports.StyledTable = (0, _styledComponents.default)(_Table.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    width: 100%;\n    table-layout: fixed;\n\n    & [data-role='expand'] {\n        padding: 8px;\n        background-color: inherit;\n        width: 44px;\n    }\n\n    & [data-test='expand'] button:focus {\n        box-shadow: inset 0 0 0 1px #0078d4;\n        outline: none;\n    }\n\n    & tr > *:nth-child(1) {\n        width: 44px;\n    }\n\n    & tr > *:nth-child(2) {\n        width: 30%;\n    }\n\n    & tr > *:nth-child(3) {\n        width: 22%;\n    }\n\n    & tr > *:nth-child(4) {\n        width: 14%;\n    }\n\n    & tr > *:nth-child(5) {\n        width: 15%;\n    }\n\n    & tr > *:nth-child(6) {\n        width: 19%;\n    }\n"])));
  var PrimaryTableCell = _exports.PrimaryTableCell = (0, _styledComponents.default)(_Table.default.Cell)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    vertical-align: top;\n    padding: 10px;\n    box-sizing: border-box;\n    color: ", ";\n    background-color: ", ";\n"])), function (_ref) {
    var typeColor = _ref.typeColor;
    return typeColor || 'inherit';
  }, function (_ref2) {
    var statusColor = _ref2.statusColor,
      typeBgColor = _ref2.typeBgColor,
      bgColor = _ref2.bgColor,
      isStatus = _ref2.isStatus;
    if (isStatus) {
      return statusColor && statusColor !== 'inherit' ? statusColor : bgColor;
    }
    return typeBgColor || bgColor || 'inherit';
  });
  var HeaderTableCell = _exports.HeaderTableCell = (0, _styledComponents.default)(_Table.default.HeadCell)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    background-color: #e1e6eb;\n    border-bottom: 2px solid #ddd;\n    padding: 10px;\n    box-sizing: border-box;\n"])));
  var CenterPaginator = _exports.CenterPaginator = (0, _styledComponents.default)((0, _forwardRefComponent.default)(_Paginator.default))(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    align-self: center;\n"])));
  var getStatusColor = _exports.getStatusColor = function getStatusColor(status) {
    if (!status) return 'inherit';
    return status.toLowerCase() === 'active' ? '#009393' : 'inherit';
  };
  var getTypeBgColor = _exports.getTypeBgColor = function getTypeBgColor(mode) {
    if (!mode) return null;
    return mode.toUpperCase() === 'PROD' ? '#90EE90' : null;
  };
  var ModalHeader = _exports.ModalHeader = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    font-size: 18px;\n    font-weight: 600;\n    background-color: #f7f9fa;\n    padding: 12px 16px;\n    border-bottom: 1px solid #ddd;\n"])));
  var CloseButton = _exports.CloseButton = _styledComponents.default.button(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    background: transparent;\n    border: none;\n    font-size: 22px;\n    cursor: pointer;\n    font-weight: bold;\n    color: #000;\n\n    &:hover {\n        color: #333;\n    }\n"])));
  var actionButtonBase = "\n    background: transparent;\n    border: 0;\n    padding: 0;\n    font: inherit;\n    margin-right: 12px;\n";
  var DisabledLink = _exports.DisabledLink = _styledComponents.default.span(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    color: black;\n    text-decoration: none;\n    cursor: default;\n    margin-right: 12px;\n    &:hover {\n        color: black;\n    }\n"])));
  var ActiveLink = _exports.ActiveLink = _styledComponents.default.button(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    ", "\n    cursor: pointer;\n    color: #006297;\n    &:hover {\n        text-decoration: underline;\n    }\n"])), actionButtonBase);
  var ActionLink = _exports.ActionLink = _styledComponents.default.button(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    ", "\n    cursor: pointer;\n    color: #006297;\n    &:hover {\n        text-decoration: underline;\n    }\n"])), actionButtonBase);
  var DefinitionListContainer = _exports.DefinitionListContainer = _styledComponents.default.div(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    row-gap: 4px;\n"])));
  var ExpansionRow = _exports.ExpansionRow = _styledComponents.default.div(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n    display: flex;\n    column-gap: 8px;\n    margin-bottom: 4px;\n"])));
  var ExpansionKey = _exports.ExpansionKey = _styledComponents.default.span(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n    min-width: 160px;\n    white-space: nowrap;\n"])));
  var ExpansionValue = _exports.ExpansionValue = _styledComponents.default.span(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n    flex: 1;\n    word-break: break-word;\n"])));
  var ModalFormTable = _exports.ModalFormTable = _styledComponents.default.table(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n    width: 100%;\n    border-collapse: separate;\n    border-spacing: 0 12px;\n    table-layout: fixed;\n"])));
  var ModalFormRow = _exports.ModalFormRow = _styledComponents.default.tr(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral([""])));
  var ModalFormLabelCell = _exports.ModalFormLabelCell = _styledComponents.default.td(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\n    width: 140px;\n    padding-right: 12px;\n    vertical-align: middle;\n    white-space: nowrap;\n"])));
  var ModalFormSecondaryLabelCell = _exports.ModalFormSecondaryLabelCell = (0, _styledComponents.default)(ModalFormLabelCell)(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["\n    padding-left: 24px;\n"])));
  var ModalFormValueCell = _exports.ModalFormValueCell = _styledComponents.default.td(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["\n    vertical-align: middle;\n"])));
  var ModalFormSplit = _exports.ModalFormSplit = _styledComponents.default.div(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    gap: 8px;\n\n    & > *:first-child {\n        flex: 1;\n    }\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/containerManagement/ContainerManagement.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/connection/utils/index.js"), __webpack_require__("./src/main/webapp/util/themeCompat.es"), __webpack_require__("./src/main/webapp/components/connection/Connection.styles.js"), __webpack_require__("./src/main/webapp/components/containerManagement/Header/Header.jsx"), __webpack_require__("./src/main/webapp/components/containerManagement/Body/Body.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayIncludes, _esStringIncludes, _react, _ConnectionManagementApi, _utils, _themeCompat, _Connection, _Header, _Body) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _Header = _interopRequireDefault(_Header);
  _Body = _interopRequireDefault(_Body);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t2, o) { n.p = e.prev, n.n = e.next; try { return r(_t2, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
  function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
  function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
  function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
  function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
  function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
  function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
  function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
  function _OverloadYield(e, d) { this.v = e, this.k = d; }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var ContainerManagement = function ContainerManagement() {
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      filter = _useState2[0],
      setFilter = _useState2[1];
    var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      searchTerm = _useState4[0],
      setSearchTerm = _useState4[1];
    var _useState5 = (0, _react.useState)({
        canList: false,
        canControl: false,
        canEnableHPA: false
      }),
      _useState6 = _slicedToArray(_useState5, 2),
      permissions = _useState6[0],
      setPermissions = _useState6[1];
    (0, _react.useEffect)(function () {
      var loadPerms = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var _response$entry, _response$entry$, _response$entry$$cont;
          var response, capabilities, has, CAP_LIST_CONTAINERS, CAP_CONTROL_CONTAINERS, CAP_ENABLE_HPA, canList, canControl, canEnableHPA;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _utils.handleApiCall)(_ConnectionManagementApi.fetchCapabilities, [], {
                  errorMessage: 'Failed to fetch user capabilities',
                  showErrorToast: false
                });
              case 2:
                response = _context.sent;
                if (response) {
                  _context.next = 5;
                  break;
                }
                return _context.abrupt("return");
              case 5:
                capabilities = (response === null || response === void 0 ? void 0 : (_response$entry = response.entry) === null || _response$entry === void 0 ? void 0 : (_response$entry$ = _response$entry[0]) === null || _response$entry$ === void 0 ? void 0 : (_response$entry$$cont = _response$entry$.content) === null || _response$entry$$cont === void 0 ? void 0 : _response$entry$$cont.capabilities) || [];
                has = function has(cap) {
                  return capabilities.includes(cap);
                };
                CAP_LIST_CONTAINERS = 'list_containers';
                CAP_CONTROL_CONTAINERS = 'control_containers';
                CAP_ENABLE_HPA = 'enable_hpa';
                canList = has(CAP_LIST_CONTAINERS);
                canControl = has(CAP_LIST_CONTAINERS) && has(CAP_CONTROL_CONTAINERS);
                canEnableHPA = has(CAP_ENABLE_HPA);
                setPermissions({
                  canList: canList,
                  canControl: canControl,
                  canEnableHPA: canEnableHPA
                });
              case 14:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function loadPerms() {
          return _ref.apply(this, arguments);
        };
      }();
      loadPerms();
    }, []);
    return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Connection.Container, null, /*#__PURE__*/_react.default.createElement(_Header.default, {
      currentFilter: filter,
      onFilterChange: setFilter,
      onSearchChange: setSearchTerm,
      searchTerm: searchTerm
    }), /*#__PURE__*/_react.default.createElement(_Body.default, {
      canControl: permissions.canControl,
      canEnableHPA: permissions.canEnableHPA,
      canList: permissions.canList,
      filter: filter,
      searchTerm: searchTerm
    })));
  };
  var _default = _exports.default = ContainerManagement;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/containerManagement/Header/Header.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-icons/Magnifier.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/containerManagement/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/containerManagement/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _Search, _ConnectionManagementApi, _Header, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Search = _interopRequireDefault(_Search);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t2, o) { n.p = e.prev, n.n = e.next; try { return r(_t2, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
  function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
  function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
  function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
  function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
  function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
  function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
  function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
  function _OverloadYield(e, d) { this.v = e, this.k = d; }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var FILTER_LABELS = {
    ACTIVE: _constants.SHOW_ACTIVE_CONTAINERS,
    INACTIVE: _constants.SHOW_INACTIVE_CONTAINERS,
    GPU: _constants.SHOW_GPU_CONTAINERS
  };
  var Header = function Header(_ref) {
    var currentFilter = _ref.currentFilter,
      onFilterChange = _ref.onFilterChange,
      onSearchChange = _ref.onSearchChange,
      searchTerm = _ref.searchTerm;
    var _useState = (0, _react.useState)({
        active: 0,
        inactive: 0
      }),
      _useState2 = _slicedToArray(_useState, 2),
      counts = _useState2[0],
      setCounts = _useState2[1];
    var fetchCounts = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _countsResponse$PAYLO, _countsResponse$PAYLO2, _countsResponse$conta, countsResponse, countsData;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _ConnectionManagementApi.getActiveInactiveContainers)();
            case 3:
              countsResponse = _context.sent;
              countsData = (countsResponse === null || countsResponse === void 0 ? void 0 : (_countsResponse$PAYLO = countsResponse.PAYLOAD) === null || _countsResponse$PAYLO === void 0 ? void 0 : (_countsResponse$PAYLO2 = _countsResponse$PAYLO.container_status) === null || _countsResponse$PAYLO2 === void 0 ? void 0 : _countsResponse$PAYLO2.counts) || (countsResponse === null || countsResponse === void 0 ? void 0 : (_countsResponse$conta = countsResponse.container_status) === null || _countsResponse$conta === void 0 ? void 0 : _countsResponse$conta.counts);
              if (countsData) {
                setCounts(countsData);
              }
              _context.next = 12;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              console.error('Error fetching container counts:', _context.t0);
              setCounts({
                active: 0,
                inactive: 0
              });
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 8]]);
      }));
      return function fetchCounts() {
        return _ref2.apply(this, arguments);
      };
    }();
    (0, _react.useEffect)(function () {
      fetchCounts();
      var interval = setInterval(fetchCounts, 5000);
      return function () {
        return clearInterval(interval);
      };
    }, []);
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '20px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Header.HeaderContainer, null, /*#__PURE__*/_react.default.createElement(_Header.PageHeading, null, _constants.TITLE), /*#__PURE__*/_react.default.createElement(_Header.StatsContainer, null, /*#__PURE__*/_react.default.createElement(_Header.StatCard, null, /*#__PURE__*/_react.default.createElement(_Header.StatNumber, {
      color: "green"
    }, counts.active), /*#__PURE__*/_react.default.createElement(_Header.StatLabel, null, _constants.RUNNING_CONTAINERS_LABEL)), /*#__PURE__*/_react.default.createElement(_Header.StatCard, null, /*#__PURE__*/_react.default.createElement(_Header.StatNumber, {
      color: "gray"
    }, counts.inactive), /*#__PURE__*/_react.default.createElement(_Header.StatLabel, null, _constants.INACTIVE_CONTAINERS_LABEL)))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginBottom: '16px',
        display: 'flex',
        gap: '10px',
        width: '100%'
      }
    }, /*#__PURE__*/_react.default.createElement(_Header.SearchWrapper, {
      style: {
        flex: '0 0 250px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Header.SearchInput, {
      onChange: function onChange(e) {
        return onSearchChange(e.target.value);
      },
      placeholder: _constants.FILTER_PLACEHOLDER,
      searchTerm: searchTerm
    }), /*#__PURE__*/_react.default.createElement(_Header.SearchIcon, null, /*#__PURE__*/_react.default.createElement(_Search.default, {
      style: {
        fontSize: '16px'
      }
    }))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flex: 1,
        gap: '10px'
      }
    }, _constants.FILTER_TYPES.map(function (mode) {
      return /*#__PURE__*/_react.default.createElement(_Header.StyledFilterButton, {
        key: mode,
        active: currentFilter === mode,
        onClick: function onClick() {
          return onFilterChange(currentFilter === mode ? null : mode);
        }
      }, FILTER_LABELS[mode]);
    }))));
  };
  Header.propTypes = {
    currentFilter: _propTypes.default.string,
    onFilterChange: _propTypes.default.func.isRequired,
    onSearchChange: _propTypes.default.func.isRequired,
    searchTerm: _propTypes.default.string.isRequired
  };
  Header.defaultProps = {
    currentFilter: null
  };
  var _default = _exports.default = Header;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/containerManagement/Header/Header.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StyledFilterButton = _exports.StatsContainer = _exports.StatNumber = _exports.StatLabel = _exports.StatCard = _exports.SearchWrapper = _exports.SearchInput = _exports.SearchIcon = _exports.PageHeading = _exports.HeaderContainer = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var HeaderContainer = _exports.HeaderContainer = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    margin-bottom: 20px;\n"])));
  var PageHeading = _exports.PageHeading = _styledComponents.default.h2(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin: 0;\n"])));
  var StatsContainer = _exports.StatsContainer = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    display: flex;\n    gap: 40px;\n"])));
  var StatCard = _exports.StatCard = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    text-align: center;\n"])));
  var StatNumber = _exports.StatNumber = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    font-size: 28px;\n    font-weight: bold;\n    color: ", ";\n"])), function (_ref) {
    var color = _ref.color;
    return color || '#000';
  });
  var StatLabel = _exports.StatLabel = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    font-size: 14px;\n    color: #555;\n"])));
  var SearchWrapper = _exports.SearchWrapper = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    position: relative;\n    width: 250px;\n"])));
  var SearchInput = _exports.SearchInput = _styledComponents.default.input(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    width: 100%;\n    padding: 8px 30px 8px 8px;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    font-size: 14px;\n"])));
  var SearchIcon = _exports.SearchIcon = _styledComponents.default.span(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    position: absolute;\n    right: 8px;\n    top: 50%;\n    transform: translateY(-50%);\n    color: #888;\n    pointer-events: none;\n    font-size: 14px;\n"])));
  var StyledFilterButton = _exports.StyledFilterButton = _styledComponents.default.button(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    flex: 1;\n    height: 36px;\n    background-color: rgb(168, 168, 168);\n    color: #fff;\n    border: none;\n    padding: 0 12px;\n    font-size: 14px;\n    cursor: pointer;\n\n    ", "\n"])), function (_ref2) {
    var active = _ref2.active;
    return active && "\n        background-color: #009393;\n        color: #fff;\n    ";
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/containerManagement/constants.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TITLE = _exports.STOP_CONTAINER_TITLE = _exports.STOPPING_CONTAINER = _exports.STOPPED_SUCCESSFULLY = _exports.STOP = _exports.START_CONTAINER_TITLE = _exports.STARTING_CONTAINER = _exports.STARTED_SUCCESSFULLY = _exports.START = _exports.SHOW_INACTIVE_CONTAINERS = _exports.SHOW_GPU_CONTAINERS = _exports.SHOW_ACTIVE_CONTAINERS = _exports.SELECT_IMAGE = _exports.RUNTIME_OPTIONS = _exports.RUNTIME_LABEL = _exports.RUNNING_CONTAINERS_LABEL = _exports.ROWS_PER_PAGE = _exports.NO_LOGS_FOUND = _exports.MODE_OPTIONS = _exports.MODE_LABEL = _exports.MIN_REPLICAS = _exports.MAX_REPLICAS = _exports.LOGS_TITLE = _exports.LOADING_LOGS = _exports.INACTIVE_CONTAINERS_LABEL = _exports.IMAGE_LABEL = _exports.FILTER_TYPES = _exports.FILTER_PLACEHOLDER = _exports.FAILED_TO_STOP = _exports.FAILED_TO_START = _exports.FAILED_TO_FETCH_LOGS = _exports.FAILED_TO_DELETE = _exports.ERROR_STARTING = _exports.ENABLE_HPA = _exports.DELETING_CONTAINER = _exports.DELETE_CONTAINER_TITLE = _exports.DELETED_SUCCESSFULLY = _exports.DELETE = _exports.CPU_THRESHOLD = _exports.CONFIRM_STOP = _exports.CONFIRM_DELETE = _exports.COLUMN_NAMES_NO_ACTIONS = _exports.COLUMN_NAMES = _exports.CLUSTER_OPTIONS = _exports.CLUSTER_LABEL = _exports.CANCEL = _exports.ACTION_VIEW_LOGS = _exports.ACTION_STOP = _exports.ACTION_START = _exports.ACTION_DELETE = void 0;
  // Page titles and labels
  var TITLE = _exports.TITLE = (0, _i18n.gettext)('Container Management');
  var RUNNING_CONTAINERS_LABEL = _exports.RUNNING_CONTAINERS_LABEL = (0, _i18n.gettext)('Running Container(s)');
  var INACTIVE_CONTAINERS_LABEL = _exports.INACTIVE_CONTAINERS_LABEL = (0, _i18n.gettext)('Inactive Container(s)');

  // Filter and search
  var FILTER_PLACEHOLDER = _exports.FILTER_PLACEHOLDER = (0, _i18n.gettext)('Filter by container name');
  var SHOW_ACTIVE_CONTAINERS = _exports.SHOW_ACTIVE_CONTAINERS = (0, _i18n.gettext)('Show ACTIVE Containers');
  var SHOW_INACTIVE_CONTAINERS = _exports.SHOW_INACTIVE_CONTAINERS = (0, _i18n.gettext)('Show INACTIVE Containers');
  var SHOW_GPU_CONTAINERS = _exports.SHOW_GPU_CONTAINERS = (0, _i18n.gettext)('Show GPU Containers');

  // Table columns
  var COLUMN_NAMES = _exports.COLUMN_NAMES = ['Container name', 'Type/Details', 'Status', 'Sharing', 'Actions'];
  var COLUMN_NAMES_NO_ACTIONS = _exports.COLUMN_NAMES_NO_ACTIONS = ['Container name', 'Type/Details', 'Status', 'Sharing'];

  // Rows per page
  var ROWS_PER_PAGE = _exports.ROWS_PER_PAGE = 5;

  // Modal titles
  var START_CONTAINER_TITLE = _exports.START_CONTAINER_TITLE = (0, _i18n.gettext)('Start Container');
  var STOP_CONTAINER_TITLE = _exports.STOP_CONTAINER_TITLE = (0, _i18n.gettext)('Stop Container');
  var DELETE_CONTAINER_TITLE = _exports.DELETE_CONTAINER_TITLE = (0, _i18n.gettext)('Delete Container');
  var LOGS_TITLE = _exports.LOGS_TITLE = (0, _i18n.gettext)('Logs');

  // Modal messages
  var STARTING_CONTAINER = _exports.STARTING_CONTAINER = (0, _i18n.gettext)('Starting container...');
  var STOPPING_CONTAINER = _exports.STOPPING_CONTAINER = (0, _i18n.gettext)('Stopping container...');
  var DELETING_CONTAINER = _exports.DELETING_CONTAINER = (0, _i18n.gettext)('Deleting container...');
  var LOADING_LOGS = _exports.LOADING_LOGS = (0, _i18n.gettext)('Loading logs...');
  var NO_LOGS_FOUND = _exports.NO_LOGS_FOUND = (0, _i18n.gettext)('No logs found.');

  // Confirmation messages
  var CONFIRM_STOP = _exports.CONFIRM_STOP = (0, _i18n.gettext)('Are you sure you want to stop');
  var CONFIRM_DELETE = _exports.CONFIRM_DELETE = (0, _i18n.gettext)('Are you sure you want to delete');

  // Button labels
  var CANCEL = _exports.CANCEL = (0, _i18n.gettext)('Cancel');
  var START = _exports.START = (0, _i18n.gettext)('Start');
  var STOP = _exports.STOP = (0, _i18n.gettext)('Stop');
  var DELETE = _exports.DELETE = (0, _i18n.gettext)('Delete');

  // Form labels
  var IMAGE_LABEL = _exports.IMAGE_LABEL = 'Image';
  var CLUSTER_LABEL = _exports.CLUSTER_LABEL = 'Cluster';
  var RUNTIME_LABEL = _exports.RUNTIME_LABEL = 'Runtime';
  var MODE_LABEL = _exports.MODE_LABEL = 'Mode';

  // Select options
  var SELECT_IMAGE = _exports.SELECT_IMAGE = (0, _i18n.gettext)('Select Image');
  var CLUSTER_OPTIONS = _exports.CLUSTER_OPTIONS = [{
    label: 'Docker',
    value: 'docker'
  }, {
    label: 'Kubernetes',
    value: 'kubernetes'
  }];
  var RUNTIME_OPTIONS = _exports.RUNTIME_OPTIONS = [{
    label: 'CPU',
    value: 'None'
  }, {
    label: 'GPU',
    value: 'GPU'
  }];
  var MODE_OPTIONS = _exports.MODE_OPTIONS = [{
    label: 'PROD',
    value: 'PROD'
  }];

  // Filter types
  var FILTER_TYPES = _exports.FILTER_TYPES = ['ACTIVE', 'INACTIVE', 'GPU'];

  // Error messages
  var FAILED_TO_START = _exports.FAILED_TO_START = (0, _i18n.gettext)('Failed to start container.');
  var ERROR_STARTING = _exports.ERROR_STARTING = (0, _i18n.gettext)('Error starting container.');
  var FAILED_TO_STOP = _exports.FAILED_TO_STOP = (0, _i18n.gettext)('Failed to stop container');
  var FAILED_TO_DELETE = _exports.FAILED_TO_DELETE = (0, _i18n.gettext)('Failed to delete container');
  var FAILED_TO_FETCH_LOGS = _exports.FAILED_TO_FETCH_LOGS = (0, _i18n.gettext)('Failed to fetch container logs');

  // Success messages
  var STARTED_SUCCESSFULLY = _exports.STARTED_SUCCESSFULLY = (0, _i18n.gettext)('started successfully!');
  var STOPPED_SUCCESSFULLY = _exports.STOPPED_SUCCESSFULLY = (0, _i18n.gettext)('stopped successfully!');
  var DELETED_SUCCESSFULLY = _exports.DELETED_SUCCESSFULLY = (0, _i18n.gettext)('deleted successfully!');

  // Action labels (uppercase for table actions)
  var ACTION_STOP = _exports.ACTION_STOP = (0, _i18n.gettext)('STOP');
  var ACTION_DELETE = _exports.ACTION_DELETE = (0, _i18n.gettext)('DELETE');
  var ACTION_START = _exports.ACTION_START = (0, _i18n.gettext)('START');
  var ACTION_VIEW_LOGS = _exports.ACTION_VIEW_LOGS = (0, _i18n.gettext)('VIEW LOGS');

  // HPA labels
  var ENABLE_HPA = _exports.ENABLE_HPA = (0, _i18n.gettext)('Enable HPA');
  var MIN_REPLICAS = _exports.MIN_REPLICAS = (0, _i18n.gettext)('Min Replicas');
  var MAX_REPLICAS = _exports.MAX_REPLICAS = (0, _i18n.gettext)('Max Replicas');
  var CPU_THRESHOLD = _exports.CPU_THRESHOLD = (0, _i18n.gettext)('CPU Threshold (%)');
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/ContainerManagement.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("containerManagement/ContainerManagementView")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _ContainerManagementView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _ContainerManagementView = _interopRequireDefault(_ContainerManagementView);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ContainerManagementRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Container Management'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.showcaseView) {
        // TODO: Properly handle the backbutton by not requiring the entire page to be re-instantiated.
        // This is a failsafe for now if the querystring gets updated and then the user clicks the backbutton.
        // In this case the DOM is guaranteed to be cleaned up. We have not yet confirmed that all listeners
        // will be cleaned up.
        this.showcaseView.remove();
      }
      this.showcaseView = new _ContainerManagementView.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = ContainerManagementRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "containerManagement/ContainerManagementView":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/containerManagement/ContainerManagement.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _BaseDashboard, _ContainerManagement) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _ContainerManagement = _interopRequireDefault(_ContainerManagement);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * This is the backbone page that renders the React component tree for the Showcase page
   */

  var Page = (0, _root.hot)(_ContainerManagement.default);
  var ContainerManagementView = _BaseDashboard.default.extend({
    render: function render() {
      _reactDom.default.render(_react.default.createElement(Page), this.el);
    }
  });
  var _default = _exports.default = ContainerManagementView;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/containermanagement.es","pages_common"]]]);