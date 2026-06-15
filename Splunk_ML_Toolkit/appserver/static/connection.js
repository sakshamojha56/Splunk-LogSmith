(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["connection"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/connection.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Connection.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Connection, _swcMltk) {
  "use strict";

  _Connection = _interopRequireDefault(_Connection);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Connection.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/Connection.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastMessages.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/util/themeCompat.es"), __webpack_require__("./src/main/webapp/components/connection/Connection.styles.js"), __webpack_require__("./src/main/webapp/components/connection/shared/Header/Header.jsx"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionType/ConnectionType.jsx"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionDetails/ConnectionDetails.jsx"), __webpack_require__("./src/main/webapp/components/connection/constants.js"), __webpack_require__("./src/main/webapp/components/connection/container_connections.json"), __webpack_require__("./src/main/webapp/components/connection/validation.js"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/connection/shared/WarningAndConsent/WarningAndConsent.jsx"), __webpack_require__("./src/main/webapp/components/connection/utils/ResponseHandlerUtil.jsx"), __webpack_require__("./src/main/webapp/components/connection/utils/LLMConnectionResponseUtil.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esFunctionName, _esObjectEntries, _esObjectKeys, _esObjectToString, _esRegexpExec, _esSet, _esStringIncludes, _esStringIterator, _esStringSearch, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _webUrlSearchParams, _react, _ToastMessages, _ConnectionManagementApi, _ToastConstants, _themeCompat, _Connection, _Header, _ConnectionType, _ConnectionDetails, _constants, _container_connections, _validation, _ToastUtil, _WarningAndConsent, _ResponseHandlerUtil, _LLMConnectionResponseUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _ToastMessages = _interopRequireDefault(_ToastMessages);
  _Header = _interopRequireDefault(_Header);
  _ConnectionType = _interopRequireDefault(_ConnectionType);
  _ConnectionDetails = _interopRequireDefault(_ConnectionDetails);
  _container_connections = _interopRequireDefault(_container_connections);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var ConnectionManagement = function ConnectionManagement() {
    var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      configData = _useState2[0],
      setConfigData = _useState2[1];
    var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      connectionName = _useState4[0],
      setConnectionName = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      connectionDescription = _useState6[0],
      setConnectionDescription = _useState6[1];
    var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isOpen = _useState8[0],
      setIsOpen = _useState8[1];
    var _useState9 = (0, _react.useState)(''),
      _useState10 = _slicedToArray(_useState9, 2),
      selectedConnectionType = _useState10[0],
      setSelectedConnectionType = _useState10[1];
    var _useState11 = (0, _react.useState)(''),
      _useState12 = _slicedToArray(_useState11, 2),
      selectedModel = _useState12[0],
      setSelectedModel = _useState12[1];
    var _useState13 = (0, _react.useState)(''),
      _useState14 = _slicedToArray(_useState13, 2),
      selectedProvider = _useState14[0],
      setSelectedProvider = _useState14[1];
    var _useState15 = (0, _react.useState)({}),
      _useState16 = _slicedToArray(_useState15, 2),
      selectedProviderForm = _useState16[0],
      setSelectedProviderForm = _useState16[1];
    var _useState17 = (0, _react.useState)({
        servicesettings: {},
        modelsettings: {}
      }),
      _useState18 = _slicedToArray(_useState17, 2),
      formData = _useState18[0],
      setFormData = _useState18[1];
    var _useState19 = (0, _react.useState)({}),
      _useState20 = _slicedToArray(_useState19, 2),
      error = _useState20[0],
      setError = _useState20[1];
    var _useState21 = (0, _react.useState)(false),
      _useState22 = _slicedToArray(_useState21, 2),
      isEditMode = _useState22[0],
      setIsEditMode = _useState22[1];
    var clearError = (0, _react.useCallback)(function (fieldName) {
      setError(function (prev) {
        if (!prev[fieldName]) return prev;
        var newErrors = _objectSpread({}, prev);
        delete newErrors[fieldName];
        return newErrors;
      });
    }, []);
    var _useState23 = (0, _react.useState)(false),
      _useState24 = _slicedToArray(_useState23, 2),
      hasEditPermission = _useState24[0],
      setHasEditPermission = _useState24[1];
    var _useState25 = (0, _react.useState)({
        allowLLM: false,
        allowDSDL: false
      }),
      _useState26 = _slicedToArray(_useState25, 2),
      allowedTypes = _useState26[0],
      setAllowedTypes = _useState26[1];
    var _useState27 = (0, _react.useState)(false),
      _useState28 = _slicedToArray(_useState27, 2),
      allowHPA = _useState28[0],
      setAllowHPA = _useState28[1];
    var connectionConfig = (0, _react.useMemo)(function () {
      return configData;
    }, [configData]);
    var _useState29 = (0, _react.useState)(true),
      _useState30 = _slicedToArray(_useState29, 2),
      isDisabled = _useState30[0],
      setIsDisabled = _useState30[1];
    var _useState31 = (0, _react.useState)(false),
      _useState32 = _slicedToArray(_useState31, 2),
      isTestConnectionSuccessful = _useState32[0],
      setIsTestConnectionSuccessful = _useState32[1];
    var selectedProviderFormFields = (0, _react.useMemo)(function () {
      return selectedProviderForm;
    }, [selectedProviderForm]);
    var handleConnectionNameChange = (0, _react.useCallback)(function (name) {
      setConnectionName(name);
      // Clear error for connection_name when user types
      setError(function (prev) {
        if (!prev.connection_name) return prev;
        var newErrors = _objectSpread({}, prev);
        delete newErrors.connection_name;
        return newErrors;
      });
    }, [setConnectionName]);
    var handleConnectionDescriptionChange = (0, _react.useCallback)(function (description) {
      setConnectionDescription(description);
    }, []);
    var setConnectionConfig = (0, _react.useCallback)(function (data) {
      return setConfigData(data);
    }, [setConfigData]);
    var normalizeSelectValue = function normalizeSelectValue(field, value) {
      if (!field.options || field.options.length === 0) return value;
      var mapping = {
        yes: ['1', 'yes', true],
        no: ['0', 'no', false],
        true: ['1', 'true', true],
        false: ['0', 'false', false]
      };
      var matchedOption = field.options.find(function (opt) {
        if (mapping[opt.value] && mapping[opt.value].includes(value)) return true;
        return opt.value === value;
      });
      return matchedOption ? matchedOption.value : '';
    };
    var buildInitialFormData = function buildInitialFormData(providerConfig) {
      var containerDetails = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var initialData = {};
      Object.entries(providerConfig).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          fieldName = _ref2[0],
          fieldMeta = _ref2[1];
        if (!fieldMeta.type || ['text', 'password', 'URL', 'checkbox', 'int', 'select'].includes(fieldMeta.type)) {
          var _ref3, _containerDetails$fie;
          initialData[fieldName] = (_ref3 = (_containerDetails$fie = containerDetails[fieldName]) !== null && _containerDetails$fie !== void 0 ? _containerDetails$fie : fieldMeta.default) !== null && _ref3 !== void 0 ? _ref3 : '';
        }
        if (fieldName === 'auth_mode') {
          var _fieldMeta$options, _fieldMeta$options$, _fieldMeta$fields;
          var selectedMode = containerDetails.auth_mode || fieldMeta.default || ((_fieldMeta$options = fieldMeta.options) === null || _fieldMeta$options === void 0 ? void 0 : (_fieldMeta$options$ = _fieldMeta$options[0]) === null || _fieldMeta$options$ === void 0 ? void 0 : _fieldMeta$options$.value);
          initialData.auth_mode = selectedMode;
          var extraFields = ((_fieldMeta$fields = fieldMeta.fields) === null || _fieldMeta$fields === void 0 ? void 0 : _fieldMeta$fields[selectedMode]) || [];
          extraFields.forEach(function (f) {
            var _ref4, _containerDetails$f$n;
            initialData[f.name] = (_ref4 = (_containerDetails$f$n = containerDetails[f.name]) !== null && _containerDetails$f$n !== void 0 ? _containerDetails$f$n : f.default) !== null && _ref4 !== void 0 ? _ref4 : '';
          });
        }
        if (fieldName === 'service_type') {
          var _fieldMeta$options2, _fieldMeta$options2$;
          var selectedService = containerDetails.service_type || fieldMeta.default || ((_fieldMeta$options2 = fieldMeta.options) === null || _fieldMeta$options2 === void 0 ? void 0 : (_fieldMeta$options2$ = _fieldMeta$options2[0]) === null || _fieldMeta$options2$ === void 0 ? void 0 : _fieldMeta$options2$.value);
          initialData.service_type = selectedService;
          var commonFields = fieldMeta.common || [];
          commonFields.forEach(function (f) {
            var _ref5, _containerDetails$f$n2;
            var rawValue = (_ref5 = (_containerDetails$f$n2 = containerDetails[f.name]) !== null && _containerDetails$f$n2 !== void 0 ? _containerDetails$f$n2 : f.default) !== null && _ref5 !== void 0 ? _ref5 : '';
            initialData[f.name] = f.type === 'select' ? normalizeSelectValue(f, rawValue) : rawValue;
          });
          var _extraFields = fieldMeta[selectedService] || [];
          _extraFields.forEach(function (f) {
            var _ref6, _containerDetails$f$n3;
            var rawValue = (_ref6 = (_containerDetails$f$n3 = containerDetails[f.name]) !== null && _containerDetails$f$n3 !== void 0 ? _containerDetails$f$n3 : f.default) !== null && _ref6 !== void 0 ? _ref6 : '';
            initialData[f.name] = f.type === 'select' ? normalizeSelectValue(f, rawValue) : rawValue;
          });
        }
        if (fieldName === 'hpa_enabled') {
          var rawValue = containerDetails.hpa_enabled;
          var isEnabled = rawValue === true || rawValue === '1' || rawValue === 1;
          initialData.hpa_enabled = isEnabled;
          if (isEnabled) {
            var hpaFields = fieldMeta.fields || [];
            hpaFields.forEach(function (f) {
              var _ref7, _containerDetails$f$n4;
              initialData[f.name] = (_ref7 = (_containerDetails$f$n4 = containerDetails[f.name]) !== null && _containerDetails$f$n4 !== void 0 ? _containerDetails$f$n4 : f.default) !== null && _ref7 !== void 0 ? _ref7 : '';
            });
          }
        }
      });
      return initialData;
    };
    var isValidUser = /*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var response, _response$entry, _response$entry$, _response$entry$$cont, capabilities, has, canLLMList, canLLMEdit, CAP_LIST_CONTAINER_CONNECTIONS, CAP_SETUP_CONTAINER_CONFIGURATION, canDSDLList, canDSDLEdit, allowLLM, allowDSDL, CAP_ENABLE_HPA, canEnableHPA;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.fetchCapabilities, [], {
                errorMessage: 'Failed to fetch user capabilities',
                showErrorToast: false
              });
            case 2:
              response = _context.sent;
              if (!response) {
                _context.next = 20;
                break;
              }
              capabilities = (response === null || response === void 0 ? void 0 : (_response$entry = response.entry) === null || _response$entry === void 0 ? void 0 : (_response$entry$ = _response$entry[0]) === null || _response$entry$ === void 0 ? void 0 : (_response$entry$$cont = _response$entry$.content) === null || _response$entry$$cont === void 0 ? void 0 : _response$entry$$cont.capabilities) || [];
              has = function has(cap) {
                return capabilities.includes(cap);
              }; // LLM caps
              canLLMList = has(_constants.LIST_CONFIG);
              canLLMEdit = has(_constants.EDIT_CONFIG); // DSDL caps
              CAP_LIST_CONTAINER_CONNECTIONS = 'list_container_connections';
              CAP_SETUP_CONTAINER_CONFIGURATION = 'setup_container_configuration';
              canDSDLList = has(CAP_LIST_CONTAINER_CONNECTIONS);
              canDSDLEdit = has(CAP_SETUP_CONTAINER_CONFIGURATION);
              allowLLM = canLLMList && canLLMEdit;
              allowDSDL = canDSDLList && canDSDLEdit; // HPA capability gating
              CAP_ENABLE_HPA = 'enable_hpa';
              canEnableHPA = has(CAP_ENABLE_HPA);
              setAllowedTypes({
                allowLLM: allowLLM,
                allowDSDL: allowDSDL
              });
              setAllowHPA(!!canEnableHPA);

              // Keep legacy hasEditPermission behavior for other parts relying on it (allow LLM form editing)
              setHasEditPermission(allowLLM);
              return _context.abrupt("return", allowLLM || allowDSDL);
            case 20:
              return _context.abrupt("return", false);
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function isValidUser() {
        return _ref8.apply(this, arguments);
      };
    }();
    (0, _react.useEffect)(function () {
      var checkUserPermissions = /*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return isValidUser();
              case 2:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function checkUserPermissions() {
          return _ref9.apply(this, arguments);
        };
      }();
      checkUserPermissions();
    }, []);
    var getContainerConfigMetaData = /*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", _container_connections.default);
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function getContainerConfigMetaData() {
        return _ref10.apply(this, arguments);
      };
    }();
    var getDefaultProviderModelConfig = function getDefaultProviderModelConfig(providerConfig) {
      var firstModelName = Object.keys((providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.models) || {})[0];
      return firstModelName ? _objectSpread({}, providerConfig.models[firstModelName]) : {};
    };
    (0, _react.useEffect)(function () {
      var queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('edit') === 'true') {
        var connectionNameParam = queryParams.get('connection');
        var providerName = queryParams.get('provider');
        var providerModelName = queryParams.get('model');
        var type;
        if (['docker', 'kubernetes'].includes(providerName)) {
          type = _constants.CONNECTION_TYPES.CONTAINER;
        } else {
          type = _constants.CONNECTION_TYPES.LLM;
        }
        if (!connectionNameParam || !providerName || !type) return;
        if (type.toLowerCase() === _constants.CONNECTION_TYPES.LLM) {
          setSelectedProvider(providerName);
          setSelectedConnectionType(_constants.CONNECTION_TYPES.LLM);
          setConnectionName(connectionNameParam);
          var fetchConnectionDetails = /*#__PURE__*/function () {
            var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
              var response, connectionDetails, responseMetaData, newConfig, modelName, fallbackModelConfig;
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    if (hasEditPermission) {
                      _context4.next = 2;
                      break;
                    }
                    return _context4.abrupt("return");
                  case 2:
                    _context4.next = 4;
                    return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.getLLMConfigData, ["/".concat(providerName, "/").concat(connectionNameParam, "/").concat(providerModelName), null], {
                      errorMessage: 'Failed to fetch connection details'
                    });
                  case 4:
                    response = _context4.sent;
                    if (!(!response || response.status === 'fail')) {
                      _context4.next = 7;
                      break;
                    }
                    return _context4.abrupt("return");
                  case 7:
                    connectionDetails = (0, _LLMConnectionResponseUtil.extractLLMEditData)(response, {
                      provider: providerName,
                      connectionName: connectionNameParam,
                      model: providerModelName
                    });
                    if (!(!connectionDetails || !connectionDetails.provider_settings)) {
                      _context4.next = 11;
                      break;
                    }
                    (0, _ToastUtil.triggerToast)('Invalid connection details structure', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
                    return _context4.abrupt("return");
                  case 11:
                    _context4.next = 13;
                    return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.getLLMConfigMetaData, [], {
                      errorMessage: 'Failed to fetch config metadata'
                    });
                  case 13:
                    responseMetaData = _context4.sent;
                    if (!(!responseMetaData || !responseMetaData.metadata || !responseMetaData || responseMetaData.status === 'fail')) {
                      _context4.next = 16;
                      break;
                    }
                    return _context4.abrupt("return");
                  case 16:
                    newConfig = responseMetaData.metadata; // Validate provider exists in metadata
                    if (newConfig[providerName]) {
                      _context4.next = 20;
                      break;
                    }
                    (0, _ToastUtil.triggerToast)("Provider \"".concat(providerName, "\" not found in config metadata"), _ToastConstants.TOAST_TYPES.ERROR, 'Error');
                    return _context4.abrupt("return");
                  case 20:
                    // Merge provider settings
                    Object.keys(connectionDetails.provider_settings).forEach(function (key) {
                      if (newConfig[providerName][key]) {
                        newConfig[providerName][key] = _objectSpread(_objectSpread({}, newConfig[providerName][key]), connectionDetails.provider_settings[key]);
                      } else {
                        newConfig[providerName][key] = connectionDetails.provider_settings[key];
                      }
                    });

                    // Merge model settings
                    modelName = connectionDetails.model;
                    if (modelName && newConfig[providerName]) {
                      fallbackModelConfig = getDefaultProviderModelConfig(newConfig[providerName]);
                      newConfig[providerName].models[modelName] = _objectSpread(_objectSpread({}, newConfig[providerName].models[modelName] || fallbackModelConfig), connectionDetails.model_settings);
                    }
                    setSelectedModel(modelName);
                    setConfigData(newConfig);
                    setSelectedProviderForm(newConfig[providerName]);
                    setIsOpen(true);
                    setIsEditMode(true);
                    setIsDisabled(false);
                  case 29:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function fetchConnectionDetails() {
              return _ref11.apply(this, arguments);
            };
          }();
          fetchConnectionDetails();
        } else if (type.toLowerCase() === _constants.CONNECTION_TYPES.CONTAINER) {
          setSelectedProvider(providerName);
          setSelectedConnectionType(_constants.CONNECTION_TYPES.CONTAINER);
          var fetchContainerConnectionDetails = /*#__PURE__*/function () {
            var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
              var containerResponse, containerDetails, metaResponse, newConfig, selectedProviderConfig, initialFormData;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.getDSDLConfigData, ["/".concat(providerName, "/").concat(connectionNameParam), null], {
                      errorMessage: 'Failed to fetch container connection details'
                    });
                  case 2:
                    containerResponse = _context5.sent;
                    if (!(!containerResponse || containerResponse.status === 'fail')) {
                      _context5.next = 5;
                      break;
                    }
                    return _context5.abrupt("return");
                  case 5:
                    containerDetails = containerResponse.config;
                    _context5.next = 8;
                    return (0, _ResponseHandlerUtil.handleApiCall)(getContainerConfigMetaData, [], {
                      errorMessage: 'Failed to fetch container config metadata'
                    });
                  case 8:
                    metaResponse = _context5.sent;
                    if (!(!metaResponse || metaResponse.status === 'fail')) {
                      _context5.next = 11;
                      break;
                    }
                    return _context5.abrupt("return");
                  case 11:
                    newConfig = metaResponse.metadata || metaResponse; // depending on API structure
                    selectedProviderConfig = newConfig === null || newConfig === void 0 ? void 0 : newConfig[providerName];
                    if (selectedProviderConfig) {
                      _context5.next = 16;
                      break;
                    }
                    (0, _ToastUtil.triggerToast)("Provider config not found for: ".concat(providerName), _ToastConstants.TOAST_TYPES.ERROR, 'Error');
                    return _context5.abrupt("return");
                  case 16:
                    // Map returned details into form fields
                    initialFormData = buildInitialFormData(selectedProviderConfig, containerDetails);
                    setFormData(initialFormData);

                    // Set states for edit mode
                    setConnectionName(containerDetails.connection_name || connectionNameParam);
                    setConnectionDescription(containerDetails.description || '');
                    setConfigData(newConfig);
                    setSelectedProviderForm(selectedProviderConfig);
                    setIsOpen(true);
                    setIsEditMode(true);
                    setIsDisabled(false);
                  case 25:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function fetchContainerConnectionDetails() {
              return _ref12.apply(this, arguments);
            };
          }();
          fetchContainerConnectionDetails();
        }
      }
    }, [hasEditPermission, buildInitialFormData]);
    var generateApiToken = function generateApiToken() {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var token = '';
      for (var i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    };
    var handleConnectionTypeChange = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(connectionType) {
        var type, response, _response;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              type = connectionType.toLowerCase();
              if (!(type === _constants.CONNECTION_TYPES.LLM)) {
                _context6.next = 13;
                break;
              }
              _context6.next = 4;
              return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.getLLMConfigMetaData, [], {
                errorMessage: 'Failed to fetch config metadata'
              });
            case 4:
              response = _context6.sent;
              if (!(!response || response.status === 'fail' || !response.metadata)) {
                _context6.next = 7;
                break;
              }
              return _context6.abrupt("return");
            case 7:
              setSelectedConnectionType(_constants.CONNECTION_TYPES.LLM);
              setConfigData(response.metadata);
              setIsOpen(false);
              setConnectionDescription('');
              _context6.next = 32;
              break;
            case 13:
              if (!(type === _constants.CONNECTION_TYPES.CONTAINER)) {
                _context6.next = 24;
                break;
              }
              _context6.next = 16;
              return (0, _ResponseHandlerUtil.handleApiCall)(getContainerConfigMetaData, [], {
                errorMessage: 'Failed to fetch container config metadata'
              });
            case 16:
              _response = _context6.sent;
              setSelectedConnectionType(_constants.CONNECTION_TYPES.CONTAINER);
              setConfigData(_response);
              setIsOpen(false);
              setIsEditMode(false);
              setConnectionDescription('');
              _context6.next = 32;
              break;
            case 24:
              // Reset all selections
              setSelectedConnectionType('');
              setConfigData({});
              setIsOpen(false);
              setSelectedProvider('');
              setSelectedProviderForm({});
              setSelectedModel('');
              setIsEditMode(false);
              setConnectionDescription('');
            case 32:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      return function (_x) {
        return _ref13.apply(this, arguments);
      };
    }(), []);
    (0, _react.useEffect)(function () {
      var queryParams = new URLSearchParams(window.location.search);
      var isEditModeParam = queryParams.get('edit') === 'true';
      if (isEditModeParam) return;
      var requestedType = (queryParams.get('type') || '').toLowerCase();
      var isValidType = [_constants.CONNECTION_TYPES.LLM, _constants.CONNECTION_TYPES.CONTAINER].includes(requestedType);
      var isNewType = requestedType !== selectedConnectionType;
      if (requestedType && isValidType && isNewType) {
        handleConnectionTypeChange(requestedType);
      }
    }, [handleConnectionTypeChange, selectedConnectionType]);
    var handleProviderTypeChange = (0, _react.useCallback)(function (providerType) {
      if (!providerType) {
        setSelectedProvider('');
        setSelectedProviderForm({});
        setIsOpen(false);
        setSelectedModel('');
        setConnectionDescription('');
        return;
      }
      if (selectedConnectionType.toLowerCase() === _constants.CONNECTION_TYPES.LLM) {
        var selectedData = configData === null || configData === void 0 ? void 0 : configData[providerType];
        if (!selectedData) {
          setIsOpen(false);
          return;
        }
        setSelectedProvider(providerType);
        setSelectedProviderForm(selectedData);
        setIsOpen(true);
        setFormData({
          servicesettings: {},
          modelsettings: {}
        });
      } else if (selectedConnectionType.toLowerCase() === _constants.CONNECTION_TYPES.CONTAINER) {
        var _selectedData = configData === null || configData === void 0 ? void 0 : configData[providerType];
        setSelectedProvider(providerType);
        setSelectedProviderForm(_selectedData);
        setIsOpen(true);
        var initialFormData = buildInitialFormData(_selectedData, {}); // {} = no existing details (new connection)
        setFormData(initialFormData);
      }
    }, [selectedConnectionType, configData, buildInitialFormData]);
    (0, _react.useEffect)(function () {
      var queryParams = new URLSearchParams(window.location.search);
      var isEditModeParam = queryParams.get('edit') === 'true';
      if (isEditModeParam) return;
      var requestedProvider = queryParams.get('provider') || '';
      var hasValidProvider = requestedProvider && (configData === null || configData === void 0 ? void 0 : configData[requestedProvider]);
      var isNewProvider = requestedProvider !== selectedProvider;
      if (selectedConnectionType && hasValidProvider && isNewProvider) {
        handleProviderTypeChange(requestedProvider);
      }
    }, [configData, handleProviderTypeChange, selectedConnectionType, selectedProvider]);
    var handleModelChange = (0, _react.useCallback)(function (modelType) {
      setSelectedModel(modelType);
    }, []);
    var buildConnectionDetails = (0, _react.useCallback)(function () {
      var isUpsert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (selectedConnectionType === _constants.CONNECTION_TYPES.CONTAINER) {
        var baseDetails = _objectSpread(_objectSpread({}, formData), {}, {
          connection_name: connectionName,
          description: connectionDescription,
          container_type: selectedProvider,
          api_token: formData.api_token || generateApiToken(),
          ssl_passthrough: formData.ssl_passthrough || 'False'
        });

        // inject hidden flags
        if (selectedProvider === 'kubernetes') {
          baseDetails.is_kubernetes = true;
        }
        if (selectedProvider === 'docker') {
          baseDetails.is_docker = true;
        }

        // Mark as edit mode to skip duplicate connection name validation
        if (isEditMode) {
          baseDetails.is_edit = true;
        }
        return baseDetails;
      } else {
        return {
          service: selectedProvider,
          model: selectedModel,
          servicesettings: formData.servicesettings,
          modelsettings: _objectSpread(_objectSpread({}, formData.modelsettings), {}, {
            connection_name: {
              value: connectionName,
              type: 'string',
              required: true
            }
          }),
          is_upsert: isUpsert
        };
      }
    }, [selectedConnectionType, selectedProvider, selectedModel, formData, connectionName, connectionDescription, isEditMode]);
    (0, _react.useEffect)(function () {
      // In add mode, disable Save until a successful Test Connection flips it on.
      // In edit mode, keep Save enabled even when fields change.
      setIsDisabled(!isEditMode);
    }, [formData, connectionName, selectedProvider, selectedModel, isEditMode]);
    var handleTestConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var details, _response$status, isK8s, requiredServiceFields, requiredAuthFields, _containerConfigMetaD, _containerConfigMetaD2, _containerConfigMetaD3, _containerConfigMetaD4, svc, common, extra, authFields, fieldsToValidate, fieldErrors, response, serviceFieldsErrors, modelFieldsErrors, modelError, ProviderError, connectionNameError, _response2;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            details = buildConnectionDetails(false);
            if (!(selectedConnectionType === _constants.CONNECTION_TYPES.CONTAINER)) {
              _context7.next = 18;
              break;
            }
            // Validate fields before API call
            // Ensure we also validate required fields that might be missing from details (e.g., node_port hostnames)
            isK8s = details.container_type === 'kubernetes';
            requiredServiceFields = [];
            requiredAuthFields = [];
            if (isK8s) {
              svc = (_containerConfigMetaD = _container_connections.default.kubernetes) !== null && _containerConfigMetaD !== void 0 && _containerConfigMetaD.service_type ? _container_connections.default.kubernetes.service_type : _container_connections.default.service_type || {};
              common = (svc.common || []).filter(function (f) {
                return f.required;
              }).map(function (f) {
                return f.name;
              });
              extra = (svc[details.service_type] || []).filter(function (f) {
                return f.required;
              }).map(function (f) {
                return f.name;
              });
              requiredServiceFields = [].concat(_toConsumableArray(common), _toConsumableArray(extra));
              authFields = ((_containerConfigMetaD2 = _container_connections.default.kubernetes) === null || _containerConfigMetaD2 === void 0 ? void 0 : (_containerConfigMetaD3 = _containerConfigMetaD2.auth_mode) === null || _containerConfigMetaD3 === void 0 ? void 0 : (_containerConfigMetaD4 = _containerConfigMetaD3.fields) === null || _containerConfigMetaD4 === void 0 ? void 0 : _containerConfigMetaD4[details.auth_mode]) || [];
              requiredAuthFields = authFields.filter(function (f) {
                return f.required;
              }).map(function (f) {
                return f.name;
              });
            }
            fieldsToValidate = new Set([].concat(_toConsumableArray(Object.keys(details)), _toConsumableArray(requiredServiceFields), _toConsumableArray(requiredAuthFields)));
            fieldErrors = Array.from(fieldsToValidate).reduce(function (acc, key) {
              var fieldError = (0, _validation.validateField)(key, details[key], {
                container_type: details.container_type,
                auth_mode: details.auth_mode,
                service_type: details.service_type
              });
              if (fieldError) acc[key] = fieldError;
              return acc;
            }, {}); // Show a single validation error toast and set field-level errors
            if (!(Object.keys(fieldErrors).length > 0)) {
              _context7.next = 12;
              break;
            }
            setError(fieldErrors);
            (0, _ToastUtil.triggerToast)('Please Fix the validation error', _ToastConstants.TOAST_TYPES.ERROR, 'Validation Error');
            return _context7.abrupt("return");
          case 12:
            _context7.next = 14;
            return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.testDSDLConfigData, ['', details], {
              errorMessage: 'Failed to test container connection',
              showSuccessToast: true,
              successMessage: 'Container connection test successful'
            });
          case 14:
            response = _context7.sent;
            if ((response === null || response === void 0 ? void 0 : (_response$status = response.status) === null || _response$status === void 0 ? void 0 : _response$status.toLowerCase()) === 'success') {
              setIsDisabled(false);
              setIsTestConnectionSuccessful(true);
            } else {
              console.error('Container connection test failed:', response);
            }
            _context7.next = 31;
            break;
          case 18:
            // Validation
            serviceFieldsErrors = Object.keys((details === null || details === void 0 ? void 0 : details.servicesettings) || {}).reduce(function (acc, key) {
              var _details$servicesetti, _details$servicesetti2;
              var value = (details === null || details === void 0 ? void 0 : (_details$servicesetti = details.servicesettings) === null || _details$servicesetti === void 0 ? void 0 : (_details$servicesetti2 = _details$servicesetti[key]) === null || _details$servicesetti2 === void 0 ? void 0 : _details$servicesetti2.value) || '';
              var errorMesg = (0, _validation.validateField)(key, value, {
                provider: selectedProvider
              });
              if (errorMesg) {
                acc[key] = errorMesg; // add key and value
              }
              return acc;
            }, {});
            modelFieldsErrors = Object.keys(details.modelsettings || {}).reduce(function (acc, key) {
              var _details$modelsetting, _details$modelsetting2;
              var value = (details === null || details === void 0 ? void 0 : (_details$modelsetting = details.modelsettings) === null || _details$modelsetting === void 0 ? void 0 : (_details$modelsetting2 = _details$modelsetting[key]) === null || _details$modelsetting2 === void 0 ? void 0 : _details$modelsetting2.value) || '';
              var errorValue = (0, _validation.validateField)(key, value);
              if (errorValue) {
                acc[key] = errorValue; // add key and value
              }
              return acc;
            }, {});
            modelError = (0, _validation.validateField)('model', selectedModel);
            ProviderError = (0, _validation.validateField)('service', selectedProvider);
            connectionNameError = (0, _validation.validateField)('connection_name', connectionName);
            setError(_objectSpread(_objectSpread(_objectSpread({}, serviceFieldsErrors), modelFieldsErrors), {}, {
              model: modelError,
              service: ProviderError,
              connection_name: connectionNameError
            }));
            if (!(Object.keys(serviceFieldsErrors).length > 0 || Object.keys(modelFieldsErrors).length > 0 || modelError || ProviderError || connectionNameError)) {
              _context7.next = 27;
              break;
            }
            (0, _ToastUtil.triggerToast)('Please fix validation errors before testing the connection.', _ToastConstants.TOAST_TYPES.ERROR, 'Validation Error');
            return _context7.abrupt("return");
          case 27:
            _context7.next = 29;
            return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.testLLMConnection, ['', details], {
              errorMessage: 'Failed to test connection',
              showSuccessToast: true,
              successMessage: 'Connection test successful'
            });
          case 29:
            _response2 = _context7.sent;
            if ((_response2 === null || _response2 === void 0 ? void 0 : _response2.status.toLowerCase()) === 'success') {
              setIsDisabled(false);
              setIsTestConnectionSuccessful(true);
            }
          case 31:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    })), [buildConnectionDetails, connectionName, selectedModel, selectedProvider]);
    var handleSaveConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var details, _validateData$status, _saveResponse$status, fieldErrors, validateData, errorMessage, fullConfig, cleanedConfig, saveResponse, response;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (!(!isTestConnectionSuccessful && !isEditMode)) {
              _context8.next = 3;
              break;
            }
            (0, _ToastUtil.triggerToast)('Unable to save... failed to establish connection. Please test the connection first.', _ToastConstants.TOAST_TYPES.ERROR, 'Connection Required');
            return _context8.abrupt("return");
          case 3:
            if ((0, _WarningAndConsent.validateConsentCheckbox)()) {
              _context8.next = 6;
              break;
            }
            (0, _ToastUtil.triggerToast)('Please provide consent by checking the Warning and Consent checkbox.', _ToastConstants.TOAST_TYPES.ERROR, 'Validation Error');
            return _context8.abrupt("return");
          case 6:
            details = buildConnectionDetails(true);
            if (!(selectedConnectionType === _constants.CONNECTION_TYPES.CONTAINER)) {
              _context8.next = 31;
              break;
            }
            // 🔹 Step 1: Validate fields locally
            fieldErrors = Object.keys(details).reduce(function (acc, key) {
              var fieldError = (0, _validation.validateField)(key, details[key], {
                container_type: details.container_type,
                auth_mode: details.auth_mode,
                service_type: details.service_type
              });
              if (fieldError) acc[key] = fieldError;
              return acc;
            }, {});
            if (!(Object.keys(fieldErrors).length > 0)) {
              _context8.next = 13;
              break;
            }
            setError(fieldErrors);
            (0, _ToastUtil.triggerToast)('Please Fix the validation error', _ToastConstants.TOAST_TYPES.ERROR, 'Validation Error');
            return _context8.abrupt("return");
          case 13:
            _context8.next = 15;
            return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.testDSDLConfigData, ['', details], {
              errorMessage: 'Failed to validate container configuration',
              showErrorToast: true
            });
          case 15:
            validateData = _context8.sent;
            if (!(!validateData || ((_validateData$status = validateData.status) === null || _validateData$status === void 0 ? void 0 : _validateData$status.toLowerCase()) !== 'success')) {
              _context8.next = 20;
              break;
            }
            errorMessage = (validateData === null || validateData === void 0 ? void 0 : validateData.message) || 'Container configuration validation failed.';
            (0, _ToastUtil.triggerToast)(errorMessage, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            return _context8.abrupt("return");
          case 20:
            // 🔹 Step 3: Prepare cleaned config for saving
            fullConfig = _objectSpread(_objectSpread({}, validateData.updated_config || {}), {}, {
              connection_name: details.connection_name,
              description: details.description,
              container_type: details.container_type
            });
            cleanedConfig = Object.entries(fullConfig).reduce(function (acc, _ref16) {
              var _ref17 = _slicedToArray(_ref16, 2),
                key = _ref17[0],
                value = _ref17[1];
              if (value !== '' && value !== null && value !== undefined) acc[key] = value;
              return acc;
            }, {});
            if (details.container_type === 'kubernetes') cleanedConfig.is_kubernetes = true;
            if (details.container_type === 'docker') cleanedConfig.is_docker = true;

            // Handle HPA fields if Kubernetes
            if (details.container_type === 'kubernetes') {
              if (details.hpa_enabled) {
                connectionConfig.kubernetes.hpa_enabled.fields.forEach(function (f) {
                  cleanedConfig[f.name] = formData[f.name];
                });
              } else {
                connectionConfig.kubernetes.hpa_enabled.fields.forEach(function (f) {
                  // Do not reset CPU/memory
                  if (!['min_cpu', 'max_cpu', 'min_memory', 'max_memory'].includes(f.name)) {
                    cleanedConfig[f.name] = '';
                  }
                });
              }
            }

            // 🔹 Step 4: Save container configuration using handleApiCall
            _context8.next = 27;
            return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.saveDSDLConnection, ['', cleanedConfig], {
              errorMessage: 'Failed to save container configuration',
              successMessage: 'Container connection saved successfully!',
              showSuccessToast: true
            });
          case 27:
            saveResponse = _context8.sent;
            if ((saveResponse === null || saveResponse === void 0 ? void 0 : (_saveResponse$status = saveResponse.status) === null || _saveResponse$status === void 0 ? void 0 : _saveResponse$status.toLowerCase()) === 'success') {
              if (typeof window === 'undefined' || !window.__karma__) {
                setTimeout(function () {
                  window.location.href = '/app/Splunk_ML_Toolkit/connections';
                }, 800);
              }
            }
            _context8.next = 35;
            break;
          case 31:
            _context8.next = 33;
            return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.saveLLMConnection, ['', details], {
              errorMessage: 'Failed to save connection',
              showSuccessToast: true,
              successMessage: 'Connection saved successfully'
            });
          case 33:
            response = _context8.sent;
            if ((response === null || response === void 0 ? void 0 : response.status.toLowerCase()) === 'success') {
              if (typeof window === 'undefined' || !window.__karma__) {
                setTimeout(function () {
                  window.location.href = '/app/Splunk_ML_Toolkit/connections';
                }, 800);
              }
            }
          case 35:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    })), [buildConnectionDetails, selectedConnectionType, formData, isTestConnectionSuccessful, isEditMode]);
    var handleCancelConnection = (0, _react.useCallback)(function () {
      if (typeof window === 'undefined' || !window.__karma__) {
        window.location.href = '/app/Splunk_ML_Toolkit/connections';
      }
    }, []);
    var handleModelClick = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var _response$updated_con, connectionDetails, response;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            if (!(selectedProvider.toLowerCase() === _constants.PROVIDERS.OPENAI || selectedProvider.toLowerCase() === _constants.PROVIDERS.AZUREOPENAI || selectedProvider.toLowerCase() === _constants.PROVIDERS.GEMINI || selectedProvider.toLowerCase() === _constants.PROVIDERS.OLLAMA || selectedProvider.toLowerCase() === _constants.PROVIDERS.BEDROCK || selectedProvider.toLowerCase() === _constants.PROVIDERS.ANTHROPIC || selectedProvider.toLowerCase() === _constants.PROVIDERS.GROQ)) {
              _context9.next = 8;
              break;
            }
            connectionDetails = {
              action: 'refresh_models',
              service: selectedProvider,
              model: null,
              servicesettings: formData === null || formData === void 0 ? void 0 : formData.servicesettings,
              modelsettings: {},
              is_upsert: false
            };
            _context9.next = 4;
            return (0, _ResponseHandlerUtil.handleApiCall)(_ConnectionManagementApi.saveLLMConnection, ['', connectionDetails], {
              errorMessage: 'Failed to fetch models'
            });
          case 4:
            response = _context9.sent;
            if (!(!response || response.status === 'fail')) {
              _context9.next = 7;
              break;
            }
            return _context9.abrupt("return");
          case 7:
            if (response.status === 'success' && Object.keys(((_response$updated_con = response.updated_config[selectedProvider]) === null || _response$updated_con === void 0 ? void 0 : _response$updated_con.models) || {}).length > 0) {
              setSelectedProviderForm(_objectSpread(_objectSpread({}, response.updated_config[selectedProvider]), formData === null || formData === void 0 ? void 0 : formData.servicesettings));
            }
          case 8:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    })), [selectedProvider, formData]);
    return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Connection.Container, null, /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
      position: "top-center"
    }), /*#__PURE__*/_react.default.createElement(_Header.default, {
      handleCancelConnection: handleCancelConnection,
      handleSaveConnection: handleSaveConnection,
      handleTestConnection: handleTestConnection,
      isDisabled: isDisabled
    }), /*#__PURE__*/_react.default.createElement(_ConnectionType.default, {
      allowDSDL: allowedTypes.allowDSDL,
      allowLLM: allowedTypes.allowLLM,
      connectionConfig: connectionConfig,
      connectionDescription: connectionDescription,
      connectionName: connectionName,
      error: error,
      handleConnectionDescriptionChange: handleConnectionDescriptionChange,
      handleConnectionNameChange: handleConnectionNameChange,
      handleConnectionTypeChange: handleConnectionTypeChange,
      handleProviderTypeChange: handleProviderTypeChange,
      hasEditPermission: hasEditPermission,
      selectedConnectionType: selectedConnectionType,
      selectedProvider: selectedProvider,
      setConnectionConfig: setConnectionConfig,
      showConnectionDescription: selectedConnectionType === _constants.CONNECTION_TYPES.CONTAINER
    }), /*#__PURE__*/_react.default.createElement(_ConnectionDetails.default, {
      allowHPA: allowHPA,
      cachedConnectionFormData: formData,
      clearError: clearError,
      error: error,
      handleModelChange: handleModelChange,
      handleModelClick: handleModelClick,
      isOpen: isOpen,
      selectedConnectionType: selectedConnectionType,
      selectedModel: selectedModel,
      selectedProvider: selectedProvider,
      selectedProviderFormFields: selectedProviderFormFields,
      setFormData: setFormData
    })));
  };
  var _default = _exports.default = ConnectionManagement;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/LLMConnection/ProviderConfigForm/ProviderConfigForm.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/Checkbox.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/QuestionCircle.js"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionForm.styles.js"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionType/ConnectionType.styles.js"), __webpack_require__("./src/main/webapp/components/connection/LLMConnection/ProviderConfigForm/ProviderConfigForm.styles.js"), __webpack_require__("./src/main/webapp/components/connection/shared/WarningAndConsent/WarningAndConsent.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayIterator, _esArrayMap, _esObjectEntries, _esObjectKeys, _esObjectToString, _esRegexpExec, _esStringIterator, _esStringSearch, _webDomCollectionsForEach, _webDomCollectionsIterator, _webUrlSearchParams, _react, _propTypes, _Tooltip, _Select, _Text, _Checkbox, _i18n, _QuestionCircle, _ConnectionForm, _ConnectionType, _ProviderConfigForm, _WarningAndConsent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
  _Checkbox = _interopRequireDefault(_Checkbox);
  _QuestionCircle = _interopRequireDefault(_QuestionCircle);
  _WarningAndConsent = _interopRequireDefault(_WarningAndConsent);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var OtherProviders = function OtherProviders(_ref) {
    var _selectedProviderForm2, _selectedProviderForm3, _selectedProviderForm4;
    var selectedProviderFormFields = _ref.selectedProviderFormFields,
      handleModelChange = _ref.handleModelChange,
      selectedModel = _ref.selectedModel,
      selectedProvider = _ref.selectedProvider,
      setFormData = _ref.setFormData,
      cachedConnectionFormData = _ref.cachedConnectionFormData,
      handleModelClick = _ref.handleModelClick,
      error = _ref.error,
      clearError = _ref.clearError;
    // console.log(selectedModel, 'selectedModel');
    var _React$useState = _react.default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isEditMode = _React$useState2[0],
      setIsEditMode = _React$useState2[1];
    (0, _react.useEffect)(function () {
      // TODO:Optimize the below logic
      var queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('edit') === 'true') {
        var connectionNameParam = queryParams.get('connection');
        var providerName = queryParams.get('provider');
        if (!connectionNameParam || !providerName) {
          setIsEditMode(false);
          return;
        }
        setIsEditMode(true);
      }
    }, []);
    var handleFieldChange = function handleFieldChange(name, value, settingsType) {
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, settingsType, _objectSpread(_objectSpread({}, prev[settingsType]), {}, _defineProperty({}, name, _objectSpread(_objectSpread({}, prev[settingsType][name]), {}, {
          value: value
        })))));
      });
      // Clear error for this field when user types
      if (clearError) {
        clearError(name);
      }
    };
    (0, _react.useEffect)(function () {
      if (!selectedProviderFormFields || Object.keys(selectedProviderFormFields).length === 0) return;
      var defaultValue = {};
      Object.entries(selectedProviderFormFields).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          config = _ref3[1];
        if (key === 'models') return;
        defaultValue[key] = _objectSpread({}, config);
      });
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          servicesettings: _objectSpread(_objectSpread({}, prev.servicesettings), defaultValue)
        });
      });

      // console.log('inside useeffect');
    }, [selectedProviderFormFields, setFormData]);
    (0, _react.useEffect)(function () {
      var _selectedProviderForm;
      var modelConfig = selectedProviderFormFields === null || selectedProviderFormFields === void 0 ? void 0 : (_selectedProviderForm = selectedProviderFormFields.models) === null || _selectedProviderForm === void 0 ? void 0 : _selectedProviderForm[selectedModel];
      if (!modelConfig) return;
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          modelsettings: _objectSpread(_objectSpread({}, prev.modelsettings), modelConfig)
        });
      });
    }, [selectedModel, selectedProviderFormFields, setFormData]);
    var renderFields = function renderFields(data, settingsType) {
      var fields = Object.entries(data).map(function (_ref4) {
        var _cachedConnectionForm3, _cachedConnectionForm4, _cachedConnectionForm5;
        var _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          config = _ref5[1];
        if (key === 'models' || key === 'connection_name') return null;
        var fieldLabel = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, config.label, config.description && /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          content: config.description
        }, /*#__PURE__*/_react.default.createElement(_ProviderConfigForm.TooltipIcon, null, /*#__PURE__*/_react.default.createElement(_QuestionCircle.default, {
          variant: "outlined"
        }))));
        if (config.type === 'checkbox') {
          var _cachedConnectionForm, _cachedConnectionForm2;
          return /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
            key: key,
            "data-required": config.required ? 'true' : undefined,
            error: Boolean(error === null || error === void 0 ? void 0 : error[key]),
            help: error === null || error === void 0 ? void 0 : error[key],
            label: "",
            labelPosition: "top"
          }, /*#__PURE__*/_react.default.createElement(_ConnectionType.CheckboxFieldRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
            checked: !!(cachedConnectionFormData !== null && cachedConnectionFormData !== void 0 && (_cachedConnectionForm = cachedConnectionFormData[settingsType]) !== null && _cachedConnectionForm !== void 0 && (_cachedConnectionForm2 = _cachedConnectionForm[key]) !== null && _cachedConnectionForm2 !== void 0 && _cachedConnectionForm2.value),
            id: key,
            name: key,
            onChange: function onChange(e, _ref6) {
              var checked = _ref6.checked;
              return handleFieldChange(key, checked, settingsType);
            }
          }, fieldLabel)));
        }
        return /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
          key: key,
          "data-required": config.required ? 'true' : undefined,
          error: Boolean(error === null || error === void 0 ? void 0 : error[key]),
          help: error === null || error === void 0 ? void 0 : error[key],
          label: fieldLabel,
          labelPosition: "top"
        }, /*#__PURE__*/_react.default.createElement(_ConnectionType.InputWrapper, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
          name: key,
          onChange: function onChange(e, _ref7) {
            var value = _ref7.value;
            return handleFieldChange(key, value, settingsType);
          },
          type: config.hidden ? 'password' : 'text',
          value: (_cachedConnectionForm3 = cachedConnectionFormData === null || cachedConnectionFormData === void 0 ? void 0 : (_cachedConnectionForm4 = cachedConnectionFormData[settingsType]) === null || _cachedConnectionForm4 === void 0 ? void 0 : (_cachedConnectionForm5 = _cachedConnectionForm4[key]) === null || _cachedConnectionForm5 === void 0 ? void 0 : _cachedConnectionForm5.value) !== null && _cachedConnectionForm3 !== void 0 ? _cachedConnectionForm3 : ''
        })));
      });
      return fields;
    };
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderFields(selectedProviderFormFields, 'servicesettings'), /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
      error: Boolean(error === null || error === void 0 ? void 0 : error.model),
      help: error === null || error === void 0 ? void 0 : error.model,
      label: (0, _i18n._)('Select Model'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: isEditMode,
      name: "model",
      onChange: function onChange(e, _ref8) {
        var value = _ref8.value;
        return handleModelChange(value);
      },
      onClick: handleModelClick,
      value: selectedModel
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n._)('--Select--'),
      value: ""
    }), Object.keys((selectedProviderFormFields === null || selectedProviderFormFields === void 0 ? void 0 : selectedProviderFormFields.models) || {}).length > 0 && Object.keys(selectedProviderFormFields.models).map(function (model) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: model,
        label: model,
        value: model
      });
    }))), selectedModel && (selectedProviderFormFields === null || selectedProviderFormFields === void 0 ? void 0 : (_selectedProviderForm2 = selectedProviderFormFields.models) === null || _selectedProviderForm2 === void 0 ? void 0 : _selectedProviderForm2[selectedModel]) && Object.keys((selectedProviderFormFields === null || selectedProviderFormFields === void 0 ? void 0 : (_selectedProviderForm3 = selectedProviderFormFields.models) === null || _selectedProviderForm3 === void 0 ? void 0 : _selectedProviderForm3[selectedModel]) || {}).length > 0 && renderFields(selectedProviderFormFields.models[selectedModel], 'modelsettings'), selectedModel && (selectedProviderFormFields === null || selectedProviderFormFields === void 0 ? void 0 : (_selectedProviderForm4 = selectedProviderFormFields.models) === null || _selectedProviderForm4 === void 0 ? void 0 : _selectedProviderForm4[selectedModel]) && /*#__PURE__*/_react.default.createElement(_WarningAndConsent.default, {
      connectionTypeLabel: "LLM",
      provider: selectedProvider
    }));
  };
  OtherProviders.propTypes = {
    selectedProviderFormFields: _propTypes.default.object.isRequired,
    handleModelChange: _propTypes.default.func.isRequired,
    selectedModel: _propTypes.default.string.isRequired,
    selectedProvider: _propTypes.default.string,
    setFormData: _propTypes.default.func.isRequired,
    cachedConnectionFormData: _propTypes.default.object.isRequired,
    handleModelClick: _propTypes.default.func.isRequired,
    error: _propTypes.default.object.isRequired,
    clearError: _propTypes.default.func
  };
  OtherProviders.defaultProps = {
    selectedProvider: '',
    clearError: function clearError() {}
  };
  var _default = _exports.default = OtherProviders;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/LLMConnection/ProviderConfigForm/ProviderConfigForm.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Typography) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TooltipIcon = _exports.Label = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Typography = _interopRequireDefault(_Typography);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var Label = _exports.Label = _styledComponents.default.label(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: inline-block;\n"])));
  var TooltipIcon = _exports.TooltipIcon = (0, _styledComponents.default)(_Typography.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    margin-left: 6px;\n    display: inline-flex;\n    vertical-align: middle;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/shared/ConnectionDetails/ConnectionDetails.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Divider/Divider.es"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionDetails/ConnectionDetails.styles.js"), __webpack_require__("./src/main/webapp/components/connection/LLMConnection/ProviderConfigForm/ProviderConfigForm.jsx"), __webpack_require__("./src/main/webapp/components/connection/LLMConnection/ContainerProviders.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _Divider, _ConnectionDetails, _ProviderConfigForm, _ContainerProviders) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Divider = _interopRequireDefault(_Divider);
  _ProviderConfigForm = _interopRequireDefault(_ProviderConfigForm);
  _ContainerProviders = _interopRequireDefault(_ContainerProviders);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /* eslint-disable jsx-a11y/anchor-is-valid */

  var ConnectionDetails = function ConnectionDetails(_ref) {
    var allowHPA = _ref.allowHPA,
      cachedConnectionFormData = _ref.cachedConnectionFormData,
      clearError = _ref.clearError,
      error = _ref.error,
      handleModelChange = _ref.handleModelChange,
      handleModelClick = _ref.handleModelClick,
      isOpen = _ref.isOpen,
      selectedConnectionType = _ref.selectedConnectionType,
      selectedModelForm = _ref.selectedModelForm,
      selectedModel = _ref.selectedModel,
      selectedProvider = _ref.selectedProvider,
      selectedProviderFormFields = _ref.selectedProviderFormFields,
      setFormData = _ref.setFormData;
    // const [isOpen, setIsOpen] = useState(false);
    var title = 'Input connection details';
    var subtitle = 'In this section please provide the relevant connection information';
    var Arrowsymbol = '>';
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_ConnectionDetails.ConnectionDetailsContainer, null, /*#__PURE__*/_react.default.createElement(_ConnectionDetails.ArrowContainer, null, /*#__PURE__*/_react.default.createElement(_ConnectionDetails.Arrow, {
      isOpen: isOpen
    }, Arrowsymbol)), /*#__PURE__*/_react.default.createElement(_ConnectionDetails.ConnectionDetailsFormContainer, null, /*#__PURE__*/_react.default.createElement(_ConnectionDetails.AccordionSection, null, /*#__PURE__*/_react.default.createElement(_ConnectionDetails.AccordionHeader, {
      isOpen: isOpen
    }, title), /*#__PURE__*/_react.default.createElement(_ConnectionDetails.AccordionSubHeader, null, subtitle), /*#__PURE__*/_react.default.createElement(_ConnectionDetails.AccordionContent, {
      isOpen: isOpen
    }, selectedConnectionType === 'llm' && /*#__PURE__*/_react.default.createElement(_ProviderConfigForm.default, {
      cachedConnectionFormData: cachedConnectionFormData,
      clearError: clearError,
      error: error,
      handleModelChange: handleModelChange,
      handleModelClick: handleModelClick,
      selectedModel: selectedModel,
      selectedProvider: selectedProvider,
      selectedProviderFormFields: selectedProviderFormFields,
      setFormData: setFormData
    }), selectedConnectionType === 'container' && /*#__PURE__*/_react.default.createElement(_ContainerProviders.default, {
      allowHPA: allowHPA,
      cachedConnectionFormData: cachedConnectionFormData,
      clearError: clearError,
      error: error,
      selectedProviderFormFields: selectedProviderFormFields,
      setFormData: setFormData
    }))))));
  };
  ConnectionDetails.propTypes = {
    selectedProviderFormFields: _propTypes.default.object.isRequired,
    isOpen: _propTypes.default.bool.isRequired,
    handleModelChange: _propTypes.default.func.isRequired,
    selectedModelForm: _propTypes.default.object,
    selectedModel: _propTypes.default.string.isRequired,
    selectedProvider: _propTypes.default.string,
    setFormData: _propTypes.default.func.isRequired,
    cachedConnectionFormData: _propTypes.default.object.isRequired,
    handleModelClick: _propTypes.default.func.isRequired,
    selectedConnectionType: _propTypes.default.string.isRequired,
    error: _propTypes.default.object.isRequired,
    allowHPA: _propTypes.default.bool,
    clearError: _propTypes.default.func
  };
  ConnectionDetails.defaultProps = {
    selectedModelForm: null,
    selectedProvider: '',
    allowHPA: false,
    clearError: function clearError() {}
  };
  var _default = _exports.default = /*#__PURE__*/_react.default.memo(ConnectionDetails);
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/shared/ConnectionDetails/ConnectionDetails.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Title = _exports.RightSection = _exports.Link = _exports.ConnectionDetailsFormContainer = _exports.ConnectionDetailsContainer = _exports.ArrowContainer = _exports.Arrow = _exports.AccordionSubHeader = _exports.AccordionSection = _exports.AccordionHeader = _exports.AccordionContent = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ConnectionDetailsFormContainer = _exports.ConnectionDetailsFormContainer = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    float: left;\n    width: 55%;\n"])));
  var AccordionSection = _exports.AccordionSection = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral([""])));
  var AccordionHeader = _exports.AccordionHeader = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    font-weight: 600;\n    cursor: pointer;\n    padding: 8px 0;\n    font-size: 18px;\n"])));
  var AccordionSubHeader = _exports.AccordionSubHeader = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    font-weight: 400;\n    cursor: pointer;\n    padding-top: 8px;\n    font-size: 14px;\n"])));
  var AccordionContent = _exports.AccordionContent = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    max-height: ", ";\n    overflow: hidden;\n    transition: max-height 0.3s ease;\n    padding: ", ";\n"])), function (_ref) {
    var isOpen = _ref.isOpen;
    return isOpen ? '1500px' : '0';
  }, function (_ref2) {
    var isOpen = _ref2.isOpen;
    return isOpen ? '8px 0' : '0';
  });
  var Arrow = _exports.Arrow = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    width: 16px; /* fixed width so it doesn\u2019t shift */\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 18px;\n    margin-right: 8px;\n    transition: transform 0.2s ease;\n    transform: rotate(", ");\n"])), function (_ref3) {
    var isOpen = _ref3.isOpen;
    return isOpen ? '90deg' : '0deg';
  });
  var ConnectionDetailsContainer = _exports.ConnectionDetailsContainer = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    width: 100%;\n    display: flex;\n    gap: 5%;\n"])));
  var ArrowContainer = _exports.ArrowContainer = _styledComponents.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    float: left;\n    width: 10%;\n    height: 40px;\n    display: flex;\n    align-items: center;\n    justify-content: end;\n"])));
  var RightSection = _exports.RightSection = _styledComponents.default.div(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    flex: 1;\n    border-left: 1px solid #eee;\n    padding-left: 16px;\n    color: #555;\n    width: 30%;\n    background: rgb(247, 248, 250);\n"])));
  var Title = _exports.Title = _styledComponents.default.div(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    font-weight: 600;\n    margin-bottom: 6px;\n"])));
  var Link = _exports.Link = _styledComponents.default.a(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n    display: block;\n    color: #2a6edc;\n    margin-top: 4px;\n    text-decoration: none;\n    &:hover {\n        text-decoration: underline;\n    }\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/shared/ConnectionType/ConnectionType.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.replace.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/es.string.starts-with.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionForm.styles.js"), __webpack_require__("./src/main/webapp/components/connection/shared/ConnectionType/ConnectionType.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayIterator, _esArrayMap, _esObjectKeys, _esObjectToString, _esRegexpExec, _esStringIterator, _esStringReplace, _esStringSearch, _esStringStartsWith, _webDomCollectionsIterator, _webUrlSearchParams, _react, _propTypes, _i18n, _Select, _Text, _ConnectionForm, _ConnectionType) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var ConnectionType = function ConnectionType(_ref) {
    var allowDSDL = _ref.allowDSDL,
      allowLLM = _ref.allowLLM,
      handleConnectionTypeChange = _ref.handleConnectionTypeChange,
      connectionConfig = _ref.connectionConfig,
      handleProviderTypeChange = _ref.handleProviderTypeChange,
      handleConnectionNameChange = _ref.handleConnectionNameChange,
      handleConnectionDescriptionChange = _ref.handleConnectionDescriptionChange,
      connectionName = _ref.connectionName,
      connectionDescription = _ref.connectionDescription,
      selectedProvider = _ref.selectedProvider,
      selectedConnectionType = _ref.selectedConnectionType,
      error = _ref.error,
      hasEditPermission = _ref.hasEditPermission,
      showConnectionDescription = _ref.showConnectionDescription;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isEditMode = _useState2[0],
      setIsEditMode = _useState2[1];
    var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      tempName = _useState4[0],
      setTempName = _useState4[1];
    (0, _react.useEffect)(function () {
      // TODO:Optimize the below logic
      var queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('edit') === 'true') {
        var connectionNameParam = queryParams.get('connection');
        var providerName = queryParams.get('provider');
        if (!connectionNameParam || !providerName) {
          setIsEditMode(false);
          return;
        }
        setTempName(connectionNameParam);
        setIsEditMode(true);
      }
    }, []);
    return /*#__PURE__*/_react.default.createElement(_ConnectionType.ConnectionTypeContainer, null, /*#__PURE__*/_react.default.createElement(_ConnectionType.Spacer, null), /*#__PURE__*/_react.default.createElement(_ConnectionType.LeftSection, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_ConnectionType.ConnectionTypeTitle, null, (0, _i18n._)('Selects the connection type')), /*#__PURE__*/_react.default.createElement("p", null, (0, _i18n._)("Select the connection type that you want to configure (LLM or container)\n                                   as well as providing a name for the connection"))), /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
      error: Boolean(error === null || error === void 0 ? void 0 : error.connection_name),
      help: error === null || error === void 0 ? void 0 : error.connection_name,
      label: (0, _i18n._)('Connection name'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_ConnectionType.InputWrapper, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      disabled: isEditMode && !(tempName !== null && tempName !== void 0 && tempName.startsWith("llm_".concat(selectedProvider === null || selectedProvider === void 0 ? void 0 : selectedProvider.replace(/ /g, '_'), "_")) && selectedConnectionType === 'llm'),
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        return handleConnectionNameChange(value);
      },
      value: connectionName
    }))), showConnectionDescription && /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
      label: (0, _i18n._)('Connection description'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_ConnectionType.InputWrapper, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return handleConnectionDescriptionChange(value);
      },
      value: connectionDescription
    }))), /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
      label: (0, _i18n._)('Connection Type'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: isEditMode,
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        return handleConnectionTypeChange(value);
      },
      value: selectedConnectionType.toLowerCase()
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n._)('--Select--'),
      value: ""
    }), allowLLM && /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n._)('LLM'),
      value: "llm"
    }), allowDSDL && /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n._)('Container'),
      value: "container"
    }))), /*#__PURE__*/_react.default.createElement(_ConnectionForm.SharedModalControlGroup, {
      label: (0, _i18n._)('Provider'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: isEditMode,
      onChange: function onChange(e, _ref5) {
        var value = _ref5.value;
        return handleProviderTypeChange(value);
      },
      value: selectedProvider
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n._)('--Select--'),
      value: ""
    }), Object.keys(connectionConfig).length > 0 && Object.keys(connectionConfig).map(function (provider) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: provider,
        label: provider,
        value: provider
      });
    })))), /*#__PURE__*/_react.default.createElement(_ConnectionType.RightSection, null, /*#__PURE__*/_react.default.createElement(_ConnectionType.Title, null, (0, _i18n._)('What connections does AI Toolkit support?')), /*#__PURE__*/_react.default.createElement("p", null, (0, _i18n._)('Reference these docs to find out more')), /*#__PURE__*/_react.default.createElement(_ConnectionType.Link, {
      href: "https://help.splunk.com/en/?resourceId=c875299d0-7506-4913-b38a-3b7185fb9f0e"
    }, (0, _i18n._)('LLM connections')), /*#__PURE__*/_react.default.createElement(_ConnectionType.Link, {
      href: "https://help.splunk.com/en/?resourceId=601bb445-5c1c-47fd-8e1a-42d8b6e0bc9b"
    }, (0, _i18n._)('Container connections'))));
  };
  ConnectionType.propTypes = {
    handleConnectionTypeChange: _propTypes.default.func.isRequired,
    connectionConfig: _propTypes.default.object.isRequired,
    handleProviderTypeChange: _propTypes.default.func.isRequired,
    handleConnectionNameChange: _propTypes.default.func.isRequired,
    handleConnectionDescriptionChange: _propTypes.default.func,
    connectionName: _propTypes.default.string.isRequired,
    connectionDescription: _propTypes.default.string,
    selectedProvider: _propTypes.default.string,
    selectedConnectionType: _propTypes.default.string,
    error: _propTypes.default.object.isRequired,
    hasEditPermission: _propTypes.default.bool.isRequired,
    allowLLM: _propTypes.default.bool,
    allowDSDL: _propTypes.default.bool,
    showConnectionDescription: _propTypes.default.bool
  };
  ConnectionType.defaultProps = {
    handleConnectionDescriptionChange: function handleConnectionDescriptionChange() {},
    connectionDescription: '',
    selectedProvider: '',
    selectedConnectionType: '',
    allowLLM: false,
    allowDSDL: false,
    showConnectionDescription: false
  };
  var _default = _exports.default = ConnectionType;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connection/shared/Header/Header.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Divider/Divider.es"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/connection/shared/Header/Header.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _Button, _Divider, _i18n, _Header) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _Divider = _interopRequireDefault(_Divider);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Header = function Header(_ref) {
    var handleCancelConnection = _ref.handleCancelConnection,
      handleTestConnection = _ref.handleTestConnection,
      handleSaveConnection = _ref.handleSaveConnection,
      isDisabled = _ref.isDisabled;
    var TITLE = (0, _i18n.gettext)('Set up new connection');
    var ARROW = (0, _i18n.gettext)('<');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Header.HeaderContainer, null, /*#__PURE__*/_react.default.createElement(_Header.ShowcaseHeaderWrapper, null, /*#__PURE__*/_react.default.createElement(_Header.TitleStyle, null, /*#__PURE__*/_react.default.createElement("span", {
      onClick: handleCancelConnection,
      onKeyDown: function onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCancelConnection();
        }
      },
      role: "button",
      style: {
        cursor: 'pointer',
        marginRight: '8px',
        color: 'black'
      },
      tabIndex: 0,
      title: (0, _i18n.gettext)('Go back to connections')
    }, ARROW), TITLE)), /*#__PURE__*/_react.default.createElement(_Header.ActionButtonGroup, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      label: (0, _i18n.gettext)('Cancel'),
      onClick: handleCancelConnection
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      label: (0, _i18n.gettext)('Test Connection'),
      onClick: handleTestConnection
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      label: (0, _i18n.gettext)('Save'),
      onClick: handleSaveConnection
    }))), /*#__PURE__*/_react.default.createElement(_Divider.default, null));
  };
  Header.propTypes = {
    isDisabled: _propTypes.default.bool.isRequired,
    handleTestConnection: _propTypes.default.func.isRequired,
    handleSaveConnection: _propTypes.default.func.isRequired,
    handleCancelConnection: _propTypes.default.func.isRequired
  };
  var _default = _exports.default = Header;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Connection.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("connection/ConnectionManagementView")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _ConnectionManagementView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _ConnectionManagementView = _interopRequireDefault(_ConnectionManagementView);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ConnectionManagementRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Connection Managemt'));
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
      this.showcaseView = new _ConnectionManagementView.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = ConnectionManagementRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "connection/ConnectionManagementView":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/connection/Connection.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _BaseDashboard, _Connection) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _Connection = _interopRequireDefault(_Connection);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * This is the backbone page that renders the React component tree for the Showcase page
   */

  var Page = (0, _root.hot)(_Connection.default);
  var ConnectionManagementView = _BaseDashboard.default.extend({
    render: function render() {
      _reactDom.default.render(_react.default.createElement(Page), this.el);
    }
  });
  var _default = _exports.default = ConnectionManagementView;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/connection.es","pages_common"]]]);