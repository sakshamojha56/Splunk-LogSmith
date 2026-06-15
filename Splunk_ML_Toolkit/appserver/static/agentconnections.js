(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["agentconnections"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/agentconnections.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/AgentConnections.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_AgentConnections, _swcMltk) {
  "use strict";

  _AgentConnections = _interopRequireDefault(_AgentConnections);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _AgentConnections.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentConnections/AgentConnectionsPage.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
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
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Checkbox.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastMessages.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/agentConnections/utils/ResponseHandlerUtil.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/agentConnections/agent_connections.json"), __webpack_require__("./src/main/webapp/components/agentConnections/Form/FormContent.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/AgentConnection.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/validate.js"), __webpack_require__("./src/main/webapp/components/agents/modals/AgentPermissionsModal.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/Header/Header.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/Body/Body.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esFunctionName, _esObjectKeys, _esObjectToString, _esRegexpExec, _esSet, _esStringIncludes, _esStringIterator, _esStringSearch, _esStringTrim, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsIterator, _webUrlSearchParams, _react, _i18n, _config, _Modal, _Button, _Checkbox, _Select, _ToastMessages, _ToastConstants, _ResponseHandlerUtil, _AgentBuilderApi, _agent_connections, _FormContent, _AgentConnection, _ToastUtil, _validate, _AgentPermissionsModal, _Header, _Body, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _Checkbox = _interopRequireDefault(_Checkbox);
  _Select = _interopRequireDefault(_Select);
  _ToastMessages = _interopRequireDefault(_ToastMessages);
  _agent_connections = _interopRequireDefault(_agent_connections);
  _FormContent = _interopRequireDefault(_FormContent);
  _AgentPermissionsModal = _interopRequireDefault(_AgentPermissionsModal);
  _Header = _interopRequireDefault(_Header);
  _Body = _interopRequireDefault(_Body);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t2, o) { n.p = e.prev, n.n = e.next; try { return r(_t2, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
  function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
  function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
  function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
  function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
  function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
  function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
  function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
  function _OverloadYield(e, d) { this.v = e, this.k = d; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var AgentConnectionsPage = function AgentConnectionsPage() {
    var _agentConfig$mcp, _agentConfig$kb, _mcpProviderCfg$optio, _kbTypeCfg$options;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      showModal = _useState2[0],
      setShowModal = _useState2[1];
    var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      refreshKey = _useState4[0],
      setRefreshKey = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      type = _useState6[0],
      setType = _useState6[1]; // 'MCP' | 'KB'
    var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isEdit = _useState8[0],
      setIsEdit = _useState8[1];
    var _useState9 = (0, _react.useState)({
        connectionName: '',
        connectionDescription: '',
        mcpProvider: '',
        splunkUrl: '',
        splunkToken: '',
        atlassianUrl: '',
        atlassianToken: '',
        atlassianAutoRefresh: false,
        atlassianClientId: '',
        atlassianClientSecret: '',
        atlassianRefreshToken: '',
        kbType: '',
        kbRegion: '',
        kbId: '',
        kbDescription: '',
        kbAccessKey: '',
        kbSecretKey: '',
        kbModelName: '',
        kbRoleArn: '',
        mcpCapabilities: [],
        confirmEndpoint: false
      }),
      _useState10 = _slicedToArray(_useState9, 2),
      state = _useState10[0],
      setState = _useState10[1];
    var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      testing = _useState12[0],
      setTesting = _useState12[1];
    var _useState13 = (0, _react.useState)(false),
      _useState14 = _slicedToArray(_useState13, 2),
      testOk = _useState14[0],
      setTestOk = _useState14[1];
    var _useState15 = (0, _react.useState)({}),
      _useState16 = _slicedToArray(_useState15, 2),
      fieldErrors = _useState16[0],
      setFieldErrors = _useState16[1];
    var _useState17 = (0, _react.useState)(null),
      _useState18 = _slicedToArray(_useState17, 2),
      featureEnabled = _useState18[0],
      setFeatureEnabled = _useState18[1]; // null=loading; boolean when loaded

    // Permissions state
    var _useState19 = (0, _react.useState)(false),
      _useState20 = _slicedToArray(_useState19, 2),
      permissionsOpen = _useState20[0],
      setPermissionsOpen = _useState20[1];
    var _useState21 = (0, _react.useState)(null),
      _useState22 = _slicedToArray(_useState21, 2),
      permissionsAgent = _useState22[0],
      setPermissionsAgent = _useState22[1];
    var _useState23 = (0, _react.useState)([]),
      _useState24 = _slicedToArray(_useState23, 2),
      permissionsRoles = _useState24[0],
      setPermissionsRoles = _useState24[1]; // ['Everyone', 'admin', ...]
    var _useState25 = (0, _react.useState)('owner'),
      _useState26 = _slicedToArray(_useState25, 2),
      permissionsDisplayFor = _useState26[0],
      setPermissionsDisplayFor = _useState26[1]; // 'owner' | 'app'
    var _useState27 = (0, _react.useState)([]),
      _useState28 = _slicedToArray(_useState27, 2),
      permissionsReadRoles = _useState28[0],
      setPermissionsReadRoles = _useState28[1]; // role names including 'Everyone'
    var _useState29 = (0, _react.useState)([]),
      _useState30 = _slicedToArray(_useState29, 2),
      permissionsWriteRoles = _useState30[0],
      setPermissionsWriteRoles = _useState30[1];
    var _useState31 = (0, _react.useState)(''),
      _useState32 = _slicedToArray(_useState31, 2),
      permissionsError = _useState32[0],
      setPermissionsError = _useState32[1];
    var _useState33 = (0, _react.useState)(false),
      _useState34 = _slicedToArray(_useState33, 2),
      permissionsLoading = _useState34[0],
      setPermissionsLoading = _useState34[1];
    var _useState35 = (0, _react.useState)(''),
      _useState36 = _slicedToArray(_useState35, 2),
      searchTerm = _useState36[0],
      setSearchTerm = _useState36[1];
    var _useState37 = (0, _react.useState)(''),
      _useState38 = _slicedToArray(_useState37, 2),
      ownerFilter = _useState38[0],
      setOwnerFilter = _useState38[1];
    var _useState39 = (0, _react.useState)([]),
      _useState40 = _slicedToArray(_useState39, 2),
      ownerOptions = _useState40[0],
      setOwnerOptions = _useState40[1];
    var _useState41 = (0, _react.useState)(1),
      _useState42 = _slicedToArray(_useState41, 2),
      pageNum = _useState42[0],
      setPageNum = _useState42[1];
    var _useState43 = (0, _react.useState)([]),
      _useState44 = _slicedToArray(_useState43, 2),
      connections = _useState44[0],
      setConnections = _useState44[1];
    var _useState45 = (0, _react.useState)(false),
      _useState46 = _slicedToArray(_useState45, 2),
      handledRouteAction = _useState46[0],
      setHandledRouteAction = _useState46[1];
    var handlePageNumChange = function handlePageNumChange(page) {
      return setPageNum(page);
    };

    // Calculate totalPages based on filtered connections
    var totalPages = (0, _react.useMemo)(function () {
      var filteredConnections = connections.filter(function (conn) {
        var _conn$name, _conn$owner;
        var matchesSearch = !searchTerm || ((_conn$name = conn.name) === null || _conn$name === void 0 ? void 0 : _conn$name.toLowerCase().includes(searchTerm.toLowerCase()));
        var matchesOwner = !ownerFilter || ((_conn$owner = conn.owner) === null || _conn$owner === void 0 ? void 0 : _conn$owner.toLowerCase()) === ownerFilter.toLowerCase();
        return matchesSearch && matchesOwner;
      });
      return Math.max(1, Math.floor(filteredConnections.length / _constants.ROWS) + 1);
    }, [connections, searchTerm, ownerFilter]);
    (0, _react.useEffect)(function () {
      setPageNum(1);
    }, [searchTerm, ownerFilter]);
    var mcpProviderCfg = _agent_connections.default === null || _agent_connections.default === void 0 ? void 0 : (_agentConfig$mcp = _agent_connections.default.mcp) === null || _agentConfig$mcp === void 0 ? void 0 : _agentConfig$mcp.mcp_provider;
    var mcpSelected = state.mcpProvider;
    var mcpFields = (0, _react.useMemo)(function () {
      var _mcpProviderCfg$field;
      return (mcpProviderCfg === null || mcpProviderCfg === void 0 ? void 0 : (_mcpProviderCfg$field = mcpProviderCfg.fields) === null || _mcpProviderCfg$field === void 0 ? void 0 : _mcpProviderCfg$field[mcpSelected]) || [];
    }, [mcpProviderCfg, mcpSelected]);
    var kbTypeCfg = _agent_connections.default === null || _agent_connections.default === void 0 ? void 0 : (_agentConfig$kb = _agent_connections.default.kb) === null || _agentConfig$kb === void 0 ? void 0 : _agentConfig$kb.kb_type;
    var kbSelected = state.kbType;
    var kbFields = (0, _react.useMemo)(function () {
      var _agentConfig$kb2, _agentConfig$kb2$fiel;
      return (_agent_connections.default === null || _agent_connections.default === void 0 ? void 0 : (_agentConfig$kb2 = _agent_connections.default.kb) === null || _agentConfig$kb2 === void 0 ? void 0 : (_agentConfig$kb2$fiel = _agentConfig$kb2.fields) === null || _agentConfig$kb2$fiel === void 0 ? void 0 : _agentConfig$kb2$fiel[kbSelected]) || [];
    }, [kbSelected]);

    // Provider/type helpers and payload builders
    var toProviderType = (0, _react.useCallback)(function (provider) {
      if (!provider) return '';
      var map = {
        splunk: 'SPLUNK',
        atlassian: 'ATLASSIAN',
        slack: 'SLACK'
      };
      return map[provider.toLowerCase()] || provider.toUpperCase();
    }, []);
    var modalTitle = (0, _react.useMemo)(function () {
      if (isEdit) {
        return type === 'MCP' ? (0, _i18n.gettext)('Edit MCP Connection') : (0, _i18n.gettext)('Edit Knowledge base');
      }
      return type === 'MCP' ? (0, _i18n.gettext)('Add MCP Connection') : (0, _i18n.gettext)('Add Knowledge base');
    }, [isEdit, type]);
    var fromProviderType = (0, _react.useCallback)(function (provider) {
      if (!provider) return '';
      var map = {
        SPLUNK: 'splunk',
        ATLASSIAN: 'atlassian',
        SLACK: 'slack'
      };
      return map[provider.toUpperCase()] || provider.toLowerCase();
    }, []);
    var toKBType = (0, _react.useCallback)(function (kbType) {
      if (!kbType) return '';
      var map = {
        aws: 'AWS_KB'
      };
      return map[kbType.toLowerCase()] || kbType.toUpperCase();
    }, []);
    var fromKBType = (0, _react.useCallback)(function (kbType) {
      if (!kbType) return '';
      var map = {
        AWS_KB: 'aws'
      };
      return map[kbType.toUpperCase()] || kbType.toLowerCase();
    }, []);
    var buildMCPPayload = (0, _react.useCallback)(function () {
      var typeUpper = toProviderType(state.mcpProvider);
      var details;
      if (typeUpper === 'SPLUNK') {
        details = {
          url: state.splunkUrl,
          token: state.splunkToken
        };
      } else if (typeUpper === 'ATLASSIAN') {
        details = {
          url: state.atlassianUrl,
          token: state.atlassianToken,
          client_id: state.atlassianClientId || '',
          client_secret: state.atlassianClientSecret || '',
          refresh_token: state.atlassianRefreshToken || '',
          is_auto_refresh_enabled: !!state.atlassianAutoRefresh
        };
      } else {
        details = {
          url: state.atlassianUrl,
          token: state.atlassianToken
        };
      }
      return {
        name: state.connectionName,
        description: state.connectionDescription || '',
        type: typeUpper,
        details: details
      };
    }, [state.connectionName, state.connectionDescription, state.mcpProvider, state.splunkUrl, state.splunkToken, state.atlassianUrl, state.atlassianToken, state.atlassianAutoRefresh, state.atlassianClientId, state.atlassianClientSecret, state.atlassianRefreshToken, toProviderType]);
    var buildKBPayload = (0, _react.useCallback)(function () {
      return {
        name: state.connectionName || 'my_aws_knowledge_base',
        description: state.connectionDescription || '',
        type: toKBType(state.kbType),
        details: {
          kb_id: state.kbId,
          aws_region: state.kbRegion,
          aws_access_key_id: state.kbAccessKey,
          aws_access_key_token: state.kbSecretKey,
          role_arn: state.kbRoleArn
        }
      };
    }, [state.connectionName, state.kbType, state.connectionDescription, state.kbId, state.kbRegion, state.kbAccessKey, state.kbSecretKey, state.kbRoleArn, toKBType]);

    // Load feature flags and gate page similar to AgentsPage
    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var resp, root, features, maybeGroup, gateVal, normalize, enabled;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _AgentBuilderApi.getFeatureFlags)();
            case 3:
              resp = _context.sent;
              root = resp && resp.payload || resp || {};
              features = root && root.features ? root.features : root;
              maybeGroup = features && features.mltk_hosted_llm ? features.mltk_hosted_llm : features;
              if (maybeGroup && _typeof(maybeGroup) === 'object') {
                if (Object.prototype.hasOwnProperty.call(maybeGroup, 'aitk_agent_builder_feature_enabled')) {
                  gateVal = maybeGroup.aitk_agent_builder_feature_enabled;
                } else if (Object.prototype.hasOwnProperty.call(maybeGroup, 'slim_mltk_hosted_llm_feature_enabled')) {
                  gateVal = maybeGroup.slim_mltk_hosted_llm_feature_enabled;
                }
              } else if (features) {
                gateVal = features.mltk_hosted_llm;
              }
              normalize = function normalize(v) {
                if (typeof v === 'boolean') return v;
                if (typeof v === 'number') return v === 1;
                if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'yes' || v.toLowerCase() === 'on';
                return !!v;
              };
              enabled = normalize(gateVal);
              if (mounted) setFeatureEnabled(enabled);
              _context.next = 16;
              break;
            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](0);
              if (mounted) setFeatureEnabled(false);
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 13]]);
      }))();
      return function () {
        mounted = false;
      };
    }, []);
    var onTestConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _resp, _resp$payload, _resp2, isMcp, _validateForType, ok, fe, msg, payload, typeUpper, isSplunk, url, token, resp, statusCode, result, statusStrOk, httpOk, payloadOk, success, successMsg, _resp3, errMsg, _msg;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            setTesting(true);
            isMcp = type === 'MCP';
            _validateForType = (0, _validate.validateForType)(type, state), ok = _validateForType.ok, fe = _validateForType.fieldErrors;
            if (ok) {
              _context2.next = 11;
              break;
            }
            msg = (0, _i18n.gettext)('Please fix the validation errors');
            setTestOk(false);
            setFieldErrors(fe || {});
            (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            setTesting(false);
            return _context2.abrupt("return");
          case 11:
            if (!(type === 'MCP' && !state.confirmEndpoint)) {
              _context2.next = 16;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                confirmEndpoint: (0, _i18n.gettext)('Please confirm this checkbox before testing the connection')
              });
            });
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please confirm the checkbox before testing the connection'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            setTesting(false);
            return _context2.abrupt("return");
          case 16:
            setFieldErrors({});
            if (isMcp) {
              // Build MCP test payload per handler_test_connection: { url, token, type, name? }
              typeUpper = toProviderType(state.mcpProvider);
              isSplunk = (state.mcpProvider || '').toLowerCase() === 'splunk';
              url = isSplunk ? state.splunkUrl : state.atlassianUrl;
              token = isSplunk ? state.splunkToken : state.atlassianToken;
              payload = _objectSpread({
                url: url,
                token: token,
                type: typeUpper
              }, state.connectionName ? {
                name: state.connectionName
              } : {});
            } else {
              payload = buildKBPayload();
            }
            // For MCP: keep existing validate-only save path.
            // For KB: call dedicated POST /test endpoint under vector_stores.
            resp = null;
            if (!isMcp) {
              _context2.next = 25;
              break;
            }
            _context2.next = 22;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.saveMcpConnections, ['/test', payload], {
              errorMessage: (0, _i18n.gettext)('Connection test failed'),
              showSuccessToast: false,
              showErrorToast: false
            });
          case 22:
            resp = _context2.sent;
            _context2.next = 28;
            break;
          case 25:
            _context2.next = 27;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.saveKbConnections, ['/test', payload], {
              errorMessage: (0, _i18n.gettext)('Connection test failed'),
              showSuccessToast: false,
              showErrorToast: false
            });
          case 27:
            resp = _context2.sent;
          case 28:
            // Normalize response per backend handler: payload has { success, status, connected, message, data? }
            statusCode = (_resp = resp) === null || _resp === void 0 ? void 0 : _resp.status;
            result = (_resp$payload = (_resp2 = resp) === null || _resp2 === void 0 ? void 0 : _resp2.payload) !== null && _resp$payload !== void 0 ? _resp$payload : {};
            statusStrOk = typeof statusCode === 'string' && statusCode.toLowerCase() === 'success';
            httpOk = statusCode === 200;
            payloadOk = (result === null || result === void 0 ? void 0 : result.success) === true || typeof (result === null || result === void 0 ? void 0 : result.status) === 'string' && result.status.toLowerCase() === 'success' || (result === null || result === void 0 ? void 0 : result.connected) === true;
            success = (httpOk || statusStrOk) && payloadOk;
            if (success) {
              setTestOk(true);
              successMsg = (result === null || result === void 0 ? void 0 : result.message) || (0, _i18n.gettext)('Test connection successful');
              (0, _ToastUtil.triggerToast)(successMsg, _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            } else {
              errMsg = (result === null || result === void 0 ? void 0 : result.message) || ((_resp3 = resp) === null || _resp3 === void 0 ? void 0 : _resp3.message) || (result === null || result === void 0 ? void 0 : result.error_message) || (0, _i18n.gettext)('Connection test failed');
              setTestOk(false);
              (0, _ToastUtil.triggerToast)(errMsg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            }
            _context2.next = 42;
            break;
          case 37:
            _context2.prev = 37;
            _context2.t0 = _context2["catch"](0);
            setTestOk(false);
            _msg = (_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || (0, _i18n.gettext)('Connection test failed');
            (0, _ToastUtil.triggerToast)(_msg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 42:
            _context2.prev = 42;
            setTesting(false);
            return _context2.finish(42);
          case 45:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 37, 42, 45]]);
    })), [type, buildKBPayload, state, toProviderType]);

    // Reset test gating when form inputs change
    (0, _react.useEffect)(function () {
      setTestOk(false);
    }, [state.connectionName, state.mcpProvider, state.splunkUrl, state.splunkToken, state.atlassianUrl, state.atlassianToken, state.atlassianAutoRefresh, state.atlassianClientId, state.atlassianClientSecret, state.atlassianRefreshToken, state.kbType, state.kbRegion, state.kbId, state.connectionDescription, state.kbAccessKey, state.kbSecretKey, state.kbRoleArn]);
    var renderMCP = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.mcpProvider),
      help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.mcpProvider,
      label: (0, _i18n.gettext)(mcpProviderCfg.label),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: isEdit,
      onChange: function onChange(e, data) {
        var v = data && data.value || e && e.target && e.target.value || '';
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            mcpProvider: v
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.mcpProvider) setFieldErrors(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            mcpProvider: undefined
          });
        });
      },
      value: mcpSelected
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('Select'),
      value: ""
    }), (_mcpProviderCfg$optio = mcpProviderCfg.options) === null || _mcpProviderCfg$optio === void 0 ? void 0 : _mcpProviderCfg$optio.map(function (opt) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: opt.value,
        label: (0, _i18n.gettext)(opt.label),
        value: opt.value
      });
    }))), mcpFields.map(function (f) {
      // Respect optional showWhen dependency (e.g., Atlassian auto-refresh children)
      if (f.showWhen && !state[f.showWhen]) {
        return null;
      }
      var prov = (mcpSelected || '').toLowerCase();
      var isReq = prov === 'splunk' && (f.name === 'splunkUrl' || f.name === 'splunkToken') || prov === 'atlassian' && (f.name === 'atlassianUrl' || f.name === 'atlassianToken');
      var isCheckbox = f.type === 'checkbox';
      var isConsentAnchorField = f.name === 'splunkUrl' && prov === 'splunk' || f.name === 'atlassianUrl' && prov === 'atlassian';
      return /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
        key: "mcp-".concat(f.name),
        "data-required": isReq ? 'true' : undefined,
        error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name]),
        help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name],
        hideLabel: isCheckbox,
        label: (0, _i18n.gettext)(f.label),
        labelPosition: "top"
      }, isCheckbox ? /*#__PURE__*/_react.default.createElement(_AgentConnection.CheckboxFieldRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: !!state[f.name],
        id: f.name,
        name: f.name,
        onChange: function onChange(e, data) {
          var _ref3, _data$checked, _e$target;
          var checked = (_ref3 = (_data$checked = data === null || data === void 0 ? void 0 : data.checked) !== null && _data$checked !== void 0 ? _data$checked : e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.checked) !== null && _ref3 !== void 0 ? _ref3 : false;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f.name, checked));
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors[f.name]) setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, f.name, undefined));
          });
        }
      }, (0, _i18n.gettext)(f.label))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalTextInput, {
        inline: true,
        name: f.name,
        onChange: function onChange(e, _ref4) {
          var value = _ref4.value;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f.name, value));
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors[f.name]) setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, f.name, undefined));
          });
        },
        type: f.type === 'password' ? 'password' : 'text',
        value: state[f.name] || ''
      }), isConsentAnchorField && /*#__PURE__*/_react.default.createElement(_AgentConnection.SpacedCheckboxFieldRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: !!state.confirmEndpoint,
        id: "confirm-endpoint",
        name: "confirm-endpoint",
        onChange: function onChange(e, data) {
          var _ref5, _data$checked2, _e$target2;
          var checked = (_ref5 = (_data$checked2 = data === null || data === void 0 ? void 0 : data.checked) !== null && _data$checked2 !== void 0 ? _data$checked2 : e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.checked) !== null && _ref5 !== void 0 ? _ref5 : false;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, {
              confirmEndpoint: checked
            });
          });
          if (checked && fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.confirmEndpoint) setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              confirmEndpoint: undefined
            });
          });
        }
      }, (0, _i18n.gettext)('Your agent would be making calls to this endpoint. Can you confirm?'))), isConsentAnchorField && (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.confirmEndpoint) && /*#__PURE__*/_react.default.createElement(_AgentConnection.InlineErrorText, null, fieldErrors.confirmEndpoint)));
    }), mcpSelected && /*#__PURE__*/_react.default.createElement(_AgentConnection.ButtonMarginTop, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "compact-btn",
      disabled: testing,
      onClick: onTestConnection
    }, testing ? (0, _i18n.gettext)('Testing...') : (0, _i18n.gettext)('Test connection'))));
    var renderKB = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.kbType),
      help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.kbType,
      label: (0, _i18n.gettext)(kbTypeCfg.label),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: isEdit,
      onChange: function onChange(e, data) {
        var v = data && data.value || e && e.target && e.target.value || '';
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            kbType: v
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.kbType) setFieldErrors(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            kbType: undefined
          });
        });
      },
      value: kbSelected
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('Select'),
      value: ""
    }), (_kbTypeCfg$options = kbTypeCfg.options) === null || _kbTypeCfg$options === void 0 ? void 0 : _kbTypeCfg$options.map(function (opt) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: opt.value,
        label: (0, _i18n.gettext)(opt.label),
        value: opt.value
      });
    }))), kbFields.filter(function (f) {
      return f.name !== 'kbDescription';
    }).map(function (f) {
      return /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
        key: "kb-".concat(f.name),
        "data-required": f.required ? 'true' : undefined,
        error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name]),
        help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name],
        label: (0, _i18n.gettext)(f.label),
        labelPosition: "top"
      }, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalTextInput, {
        inline: true,
        name: f.name,
        onChange: function onChange(e, _ref6) {
          var value = _ref6.value;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f.name, value));
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors[f.name]) setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, f.name, undefined));
          });
        },
        type: f.type === 'password' ? 'password' : 'text',
        value: state[f.name] || ''
      }));
    }), kbSelected && /*#__PURE__*/_react.default.createElement(_AgentConnection.ButtonMarginTop, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "compact-btn",
      disabled: testing,
      onClick: onTestConnection
    }, testing ? (0, _i18n.gettext)('Testing...') : (0, _i18n.gettext)('Test connection'))));
    var handleSaveConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var _response, _response4, _response4$payload, _response5, _response6, _response6$payload, _response7, nameRaw, _validateForType2, ok, fe, msg, payload, response, apiFn, _apiFn, isSuccess, backendMsg, _response2, parsed, _JSON$parse, _response3, _response3$data, errMsg, createdMsg, _e$response, _e$response2, _e$response3, _e$response3$payload, _e$response4, rawStr, parsedMsg, obj, _msg2;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            // Name validation: max 256 characters
            nameRaw = String(state.connectionName || '').trim();
            if (!(nameRaw.length > 256)) {
              _context3.next = 6;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                connectionName: (0, _i18n.gettext)('Maximum 256 characters')
              });
            });
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please fix the validation errors'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            return _context3.abrupt("return");
          case 6:
            // Centralized validation
            _validateForType2 = (0, _validate.validateForType)(type, state), ok = _validateForType2.ok, fe = _validateForType2.fieldErrors;
            if (ok) {
              _context3.next = 12;
              break;
            }
            msg = (0, _i18n.gettext)('Please fix the validation errors');
            setFieldErrors(fe || {});
            (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            return _context3.abrupt("return");
          case 12:
            setFieldErrors({});
            payload = type === 'MCP' ? buildMCPPayload() : buildKBPayload();
            if (!(type === 'MCP')) {
              _context3.next = 21;
              break;
            }
            // Call backend to create/update MCP connection via standardized handler
            apiFn = isEdit ? _AgentBuilderApi.updateMcpConnections : _AgentBuilderApi.saveMcpConnections;
            _context3.next = 18;
            return (0, _ResponseHandlerUtil.handleApiCall)(apiFn, ['', payload], {
              errorMessage: (0, _i18n.gettext)('Failed to save MCP connection'),
              showSuccessToast: false,
              showErrorToast: false
            });
          case 18:
            response = _context3.sent;
            _context3.next = 25;
            break;
          case 21:
            // Call backend to save KB connection via standardized handler
            _apiFn = isEdit ? _AgentBuilderApi.updatekbConnections : _AgentBuilderApi.saveKbConnections;
            _context3.next = 24;
            return (0, _ResponseHandlerUtil.handleApiCall)(_apiFn, ['', payload], {
              errorMessage: (0, _i18n.gettext)('Failed to save knowledge base connection'),
              showSuccessToast: false,
              showErrorToast: false
            });
          case 24:
            response = _context3.sent;
          case 25:
            isSuccess = !!response && (response.status === 200 || typeof response.status === 'string' && response.status.toLowerCase() === 'success' || ((_response = response) === null || _response === void 0 ? void 0 : _response.payload) && typeof response.payload.status === 'string' && response.payload.status.toLowerCase() === 'success');
            if (isSuccess) {
              _context3.next = 32;
              break;
            }
            backendMsg = '';
            try {
              if (typeof response === 'string') {
                parsed = JSON.parse(response);
                backendMsg = parsed.error_message || parsed.message || '';
              } else if ((_response2 = response) !== null && _response2 !== void 0 && _response2.payload) {
                backendMsg = response.payload.error_message || response.payload.message || (typeof response.payload === 'string' ? (_JSON$parse = JSON.parse(response.payload)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.error_message : '');
              } else {
                backendMsg = response.error_message || response.message || ((_response3 = response) === null || _response3 === void 0 ? void 0 : (_response3$data = _response3.data) === null || _response3$data === void 0 ? void 0 : _response3$data.error_message) || '';
              }
            } catch (err) {
              // Swallow JSON parse errors; backendMsg will remain fallback value
            }
            errMsg = backendMsg || (0, _i18n.gettext)('Failed to save agent connection');
            (0, _ToastUtil.triggerToast)(errMsg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            return _context3.abrupt("return");
          case 32:
            createdMsg = type === 'MCP' ? ((_response4 = response) === null || _response4 === void 0 ? void 0 : (_response4$payload = _response4.payload) === null || _response4$payload === void 0 ? void 0 : _response4$payload.message) || ((_response5 = response) === null || _response5 === void 0 ? void 0 : _response5.message) || "".concat((0, _i18n.gettext)('Your MCP server connection'), " \"").concat(state.connectionName, "\" ").concat((0, _i18n.gettext)('has been created.')) : ((_response6 = response) === null || _response6 === void 0 ? void 0 : (_response6$payload = _response6.payload) === null || _response6$payload === void 0 ? void 0 : _response6$payload.message) || ((_response7 = response) === null || _response7 === void 0 ? void 0 : _response7.message) || "".concat((0, _i18n.gettext)('Your Knowledge base connection'), " \"").concat(state.connectionName, "\" ").concat((0, _i18n.gettext)('has been created.'));
            (0, _ToastUtil.triggerToast)(createdMsg, _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            // Trigger table refresh
            setRefreshKey(function (prev) {
              return prev + 1;
            });
            setTimeout(function () {
              setShowModal(false);
              setIsEdit(false);
            }, 800);
            _context3.next = 44;
            break;
          case 38:
            _context3.prev = 38;
            _context3.t0 = _context3["catch"](0);
            // Try to extract backend error from various shapes and stringified JSON
            rawStr = (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : (_e$response = _context3.t0.response) === null || _e$response === void 0 ? void 0 : _e$response.payload) || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : (_e$response2 = _context3.t0.response) === null || _e$response2 === void 0 ? void 0 : _e$response2.message) || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.body) || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.responseText) || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message);
            if (typeof rawStr === 'string') {
              try {
                obj = JSON.parse(rawStr);
                parsedMsg = (obj === null || obj === void 0 ? void 0 : obj.error_message) || (obj === null || obj === void 0 ? void 0 : obj.message);
              } catch (_) {
                parsedMsg = undefined;
              }
            }
            _msg2 = parsedMsg || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : (_e$response3 = _context3.t0.response) === null || _e$response3 === void 0 ? void 0 : (_e$response3$payload = _e$response3.payload) === null || _e$response3$payload === void 0 ? void 0 : _e$response3$payload.error_message) || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : (_e$response4 = _context3.t0.response) === null || _e$response4 === void 0 ? void 0 : _e$response4.error_message) || (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || (0, _i18n.gettext)('Failed to save agent connection');
            (0, _ToastUtil.triggerToast)(_msg2, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 44:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 38]]);
    })), [type, buildMCPPayload, buildKBPayload, state, isEdit]);
    var onOpenAdd = (0, _react.useCallback)(function (selectedType) {
      var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var normalizedProvider = (provider || '').toLowerCase();
      setType(selectedType);
      setIsEdit(false);
      setFieldErrors({});
      setTestOk(false);
      setState({
        connectionName: '',
        connectionDescription: '',
        mcpProvider: selectedType === 'MCP' ? normalizedProvider : '',
        splunkUrl: '',
        splunkToken: '',
        atlassianUrl: '',
        atlassianToken: '',
        atlassianAutoRefresh: false,
        atlassianClientId: '',
        atlassianClientSecret: '',
        atlassianRefreshToken: '',
        kbType: selectedType === 'KB' ? normalizedProvider : '',
        kbRegion: '',
        kbId: '',
        kbDescription: '',
        kbAccessKey: '',
        kbSecretKey: '',
        kbModelName: '',
        kbRoleArn: '',
        confirmEndpoint: false
      });
      setShowModal(true);
    }, []);
    var onEditRow = (0, _react.useCallback)(function (row) {
      // row._kind: 'MCP' | 'KB', row._raw: original
      setIsEdit(true);
      setFieldErrors({});
      setTestOk(false);
      if (row._kind === 'MCP') {
        var _item$details, _item$details2, _item$details3, _item$details4, _item$details5;
        var item = row._raw || {};
        var provider = fromProviderType(item.type);
        var urlVal = (item === null || item === void 0 ? void 0 : (_item$details = item.details) === null || _item$details === void 0 ? void 0 : _item$details.mcp_server_url) || (item === null || item === void 0 ? void 0 : (_item$details2 = item.details) === null || _item$details2 === void 0 ? void 0 : _item$details2.url) || (item === null || item === void 0 ? void 0 : item.url) || '';
        var tokenVal = (item === null || item === void 0 ? void 0 : (_item$details3 = item.details) === null || _item$details3 === void 0 ? void 0 : _item$details3.token) || (item === null || item === void 0 ? void 0 : (_item$details4 = item.details) === null || _item$details4 === void 0 ? void 0 : _item$details4.token) || (item === null || item === void 0 ? void 0 : item.token) || '';
        var autoRefresh = !!(item !== null && item !== void 0 && (_item$details5 = item.details) !== null && _item$details5 !== void 0 && _item$details5.is_auto_refresh_enabled);
        setType('MCP');
        setState(function (s) {
          var _item$details6, _item$details7, _item$details8;
          return _objectSpread(_objectSpread({}, s), {}, {
            connectionName: row.name || item.name || '',
            connectionDescription: item.description || '',
            mcpProvider: provider,
            splunkUrl: provider === 'splunk' ? urlVal : '',
            splunkToken: provider === 'splunk' ? tokenVal : '',
            atlassianUrl: provider === 'atlassian' ? urlVal : '',
            atlassianToken: provider === 'atlassian' ? tokenVal : '',
            atlassianAutoRefresh: provider === 'atlassian' ? autoRefresh : false,
            atlassianClientId: provider === 'atlassian' ? (item === null || item === void 0 ? void 0 : (_item$details6 = item.details) === null || _item$details6 === void 0 ? void 0 : _item$details6.client_id) || '' : '',
            atlassianClientSecret: provider === 'atlassian' ? (item === null || item === void 0 ? void 0 : (_item$details7 = item.details) === null || _item$details7 === void 0 ? void 0 : _item$details7.client_secret) || '' : '',
            atlassianRefreshToken: provider === 'atlassian' ? (item === null || item === void 0 ? void 0 : (_item$details8 = item.details) === null || _item$details8 === void 0 ? void 0 : _item$details8.refresh_token) || '' : ''
          });
        });
      } else if (row._kind === 'KB') {
        var _item = row._raw || {};
        var kbTypeLower = fromKBType(_item.type);
        setType('KB');
        setState(function (s) {
          var _item$details9, _item$details10, _item$details11, _item$details12, _item$details13, _item$details14;
          return _objectSpread(_objectSpread({}, s), {}, {
            connectionName: row.name || _item.name || '',
            connectionDescription: _item.description || '',
            kbType: kbTypeLower,
            kbRegion: ((_item$details9 = _item.details) === null || _item$details9 === void 0 ? void 0 : _item$details9.aws_region) || ((_item$details10 = _item.details) === null || _item$details10 === void 0 ? void 0 : _item$details10.region) || '',
            kbId: ((_item$details11 = _item.details) === null || _item$details11 === void 0 ? void 0 : _item$details11.kb_id) || '',
            kbDescription: _item.description || '',
            kbAccessKey: ((_item$details12 = _item.details) === null || _item$details12 === void 0 ? void 0 : _item$details12.aws_access_key_id) || '',
            kbSecretKey: ((_item$details13 = _item.details) === null || _item$details13 === void 0 ? void 0 : _item$details13.aws_access_key_token) || '',
            kbModelName: '',
            kbRoleArn: ((_item$details14 = _item.details) === null || _item$details14 === void 0 ? void 0 : _item$details14.role_arn) || ''
          });
        });
      }
      setShowModal(true);
    }, [fromProviderType, fromKBType]);
    var onDeleteRow = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(row) {
        var _resp$payload3, isMcp, apiFn, resp, ok, _resp$payload2, err, msg, _err;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              if (row !== null && row !== void 0 && row._kind) {
                _context4.next = 3;
                break;
              }
              return _context4.abrupt("return");
            case 3:
              isMcp = row._kind === 'MCP';
              apiFn = isMcp ? _AgentBuilderApi.deleteMcpConnections : _AgentBuilderApi.deletekbConnections;
              _context4.next = 7;
              return (0, _ResponseHandlerUtil.handleApiCall)(apiFn, ["/".concat(row.name), null], {
                errorMessage: isMcp ? (0, _i18n.gettext)('Failed to delete MCP connection') : (0, _i18n.gettext)('Failed to delete Knowledge Base connection'),
                showSuccessToast: false,
                showErrorToast: false
              });
            case 7:
              resp = _context4.sent;
              ok = !!resp && (resp.status === 200 || typeof resp.status === 'string' && resp.status.toLowerCase() === 'success');
              if (ok) {
                _context4.next = 13;
                break;
              }
              err = (resp === null || resp === void 0 ? void 0 : (_resp$payload2 = resp.payload) === null || _resp$payload2 === void 0 ? void 0 : _resp$payload2.error_message) || (resp === null || resp === void 0 ? void 0 : resp.message) || "".concat((0, _i18n.gettext)('Failed to delete'), " ").concat(isMcp ? (0, _i18n.gettext)('MCP connection') : (0, _i18n.gettext)('Knowledge Base connection'), " \"").concat(row.name, "\"");
              (0, _ToastUtil.triggerToast)(err, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
              return _context4.abrupt("return");
            case 13:
              msg = (resp === null || resp === void 0 ? void 0 : (_resp$payload3 = resp.payload) === null || _resp$payload3 === void 0 ? void 0 : _resp$payload3.message) || (resp === null || resp === void 0 ? void 0 : resp.message) || "".concat(isMcp ? (0, _i18n.gettext)('MCP connection') : (0, _i18n.gettext)('Knowledge Base connection'), " \"").concat(row.name, "\" ").concat((0, _i18n.gettext)('deleted successfully'));
              (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
              setRefreshKey(function (prev) {
                return prev + 1;
              });
              _context4.next = 22;
              break;
            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4["catch"](0);
              _err = (_context4.t0 === null || _context4.t0 === void 0 ? void 0 : _context4.t0.message) || "".concat((0, _i18n.gettext)('Failed to delete'), " ").concat((row === null || row === void 0 ? void 0 : row._kind) === 'MCP' ? (0, _i18n.gettext)('MCP') : (0, _i18n.gettext)('Knowledge Base'), " ").concat((0, _i18n.gettext)('connection'), " \"").concat((row === null || row === void 0 ? void 0 : row.name) || '', "\"");
              (0, _ToastUtil.triggerToast)(_err, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            case 22:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 18]]);
      }));
      return function (_x) {
        return _ref8.apply(this, arguments);
      };
    }(), []);
    (0, _react.useEffect)(function () {
      if (!featureEnabled || handledRouteAction) {
        return;
      }
      var queryParams = new URLSearchParams(window.location.search);
      var shouldOpen = queryParams.get('open') === 'true';
      var requestedType = (queryParams.get('type') || '').toUpperCase();
      var requestedMode = (queryParams.get('mode') || '').toLowerCase();
      var requestedName = queryParams.get('name');
      var requestedProvider = queryParams.get('provider') || '';
      if (!shouldOpen || !['MCP', 'KB'].includes(requestedType)) {
        setHandledRouteAction(true);
        return;
      }
      if (requestedMode === 'edit') {
        if (!connections.length) {
          return;
        }
        var row = connections.find(function (connection) {
          return connection._kind === requestedType && connection.name === requestedName;
        });
        if (row) {
          onEditRow(row);
        }
        setHandledRouteAction(true);
        return;
      }
      onOpenAdd(requestedType, requestedProvider);
      setHandledRouteAction(true);
    }, [connections, featureEnabled, handledRouteAction, onEditRow, onOpenAdd]);
    var openPermissionsForConnection = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(row) {
        var _rolesResp$payload, raw, acl, perms, currentRead, currentWrite, mapApiRolesToUi, uiRead, uiWrite, sharing, rolesResp, data, roles, aclRoles, uniqueRoles;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              setPermissionsError('');
              setPermissionsLoading(true);
              setPermissionsAgent(row);

              // Derive current ACL state from raw connection data
              raw = (row === null || row === void 0 ? void 0 : row._raw) || {};
              acl = (raw === null || raw === void 0 ? void 0 : raw.acl) || {};
              perms = (acl === null || acl === void 0 ? void 0 : acl.perms) || {};
              currentRead = Array.isArray(perms === null || perms === void 0 ? void 0 : perms.read) ? perms.read : [];
              currentWrite = Array.isArray(perms === null || perms === void 0 ? void 0 : perms.write) ? perms.write : [];
              mapApiRolesToUi = function mapApiRolesToUi(arr) {
                if (!Array.isArray(arr)) return [];
                if (arr.includes('*')) return ['Everyone'];
                return arr;
              };
              uiRead = mapApiRolesToUi(currentRead);
              uiWrite = mapApiRolesToUi(currentWrite);
              setPermissionsReadRoles(uiRead);
              setPermissionsWriteRoles(uiWrite);
              sharing = (acl === null || acl === void 0 ? void 0 : acl.sharing) || 'owner';
              setPermissionsDisplayFor(sharing === 'app' ? 'app' : 'owner');

              // Fetch roles for current user via shared AgentBuilder API
              _context5.next = 18;
              return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.getUserRoles, ['', null], {
                errorMessage: 'Failed to fetch user roles',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 18:
              rolesResp = _context5.sent;
              data = (_rolesResp$payload = rolesResp === null || rolesResp === void 0 ? void 0 : rolesResp.payload) !== null && _rolesResp$payload !== void 0 ? _rolesResp$payload : rolesResp;
              roles = Array.isArray(data === null || data === void 0 ? void 0 : data.entry) ? data.entry.map(function (r) {
                return r && r.name;
              }).filter(Boolean) : []; // Include roles that already appear in ACL read/write so their rows exist and can be pre-checked
              aclRoles = Array.from(new Set([].concat(_toConsumableArray(uiRead.filter(function (r) {
                return r && r !== 'Everyone';
              })), _toConsumableArray(uiWrite.filter(function (r) {
                return r && r !== 'Everyone';
              })))));
              uniqueRoles = Array.from(new Set(['Everyone'].concat(_toConsumableArray(roles), aclRoles)));
              setPermissionsRoles(uniqueRoles);
              setPermissionsOpen(true);
              _context5.next = 31;
              break;
            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](0);
              setPermissionsError((_context5.t0 === null || _context5.t0 === void 0 ? void 0 : _context5.t0.message) || 'Failed to load permissions');
              setPermissionsOpen(true);
            case 31:
              _context5.prev = 31;
              setPermissionsLoading(false);
              return _context5.finish(31);
            case 34:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[0, 27, 31, 34]]);
      }));
      return function (_x2) {
        return _ref9.apply(this, arguments);
      };
    }(), []);
    var handleSavePermissions = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var _resp$payload5, raw, isMcp, aclApp, aclOwner, mapUiRolesToApi, acl, payload, apiFn, resp, isSuccess, _resp$payload4, errMsg, successMsg, msg;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (permissionsAgent) {
              _context6.next = 2;
              break;
            }
            return _context6.abrupt("return");
          case 2:
            _context6.prev = 2;
            setPermissionsLoading(true);
            setPermissionsError('');
            raw = (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._raw) || {};
            isMcp = (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind) === 'MCP';
            aclApp = permissionsAgent.app && permissionsAgent.app !== '-' ? permissionsAgent.app : _config.app;
            aclOwner = permissionsAgent.owner || _config.username;
            mapUiRolesToApi = function mapUiRolesToApi(arr) {
              if (!Array.isArray(arr) || !arr.length) return [];
              if (arr.includes('Everyone')) return ['*'];
              return arr;
            };
            acl = {
              sharing: permissionsDisplayFor === 'app' ? 'app' : 'owner',
              app: aclApp,
              owner: aclOwner,
              perms: {
                read: permissionsDisplayFor === 'app' ? mapUiRolesToApi(permissionsReadRoles) : [],
                write: permissionsDisplayFor === 'app' ? mapUiRolesToApi(permissionsWriteRoles) : []
              }
            }; // Build base payload from existing connection data
            if (isMcp) {
              payload = {
                name: raw.name,
                description: raw.description || '',
                type: raw.type,
                details: raw.details || {},
                acl: acl
              };
            } else {
              payload = {
                name: raw.name,
                description: raw.description || '',
                type: raw.type,
                details: raw.details || {},
                acl: acl
              };
            }

            // Call appropriate update function based on connection type
            apiFn = isMcp ? _AgentBuilderApi.updateMcpConnections : _AgentBuilderApi.updatekbConnections;
            _context6.next = 15;
            return (0, _ResponseHandlerUtil.handleApiCall)(apiFn, ['', payload], {
              errorMessage: "Failed to update ".concat(isMcp ? 'MCP' : 'Knowledge Base', " connection permissions"),
              showSuccessToast: false,
              showErrorToast: false
            });
          case 15:
            resp = _context6.sent;
            isSuccess = !!resp && (resp.status === 200 || typeof resp.status === 'string' && resp.status.toLowerCase() === 'success' || (resp === null || resp === void 0 ? void 0 : resp.payload) && typeof resp.payload.status === 'string' && resp.payload.status.toLowerCase() === 'success');
            if (isSuccess) {
              _context6.next = 21;
              break;
            }
            errMsg = (resp === null || resp === void 0 ? void 0 : (_resp$payload4 = resp.payload) === null || _resp$payload4 === void 0 ? void 0 : _resp$payload4.error_message) || (resp === null || resp === void 0 ? void 0 : resp.message) || "Failed to update ".concat(isMcp ? 'MCP' : 'Knowledge Base', " connection permissions");
            setPermissionsError(errMsg);
            return _context6.abrupt("return");
          case 21:
            successMsg = (resp === null || resp === void 0 ? void 0 : (_resp$payload5 = resp.payload) === null || _resp$payload5 === void 0 ? void 0 : _resp$payload5.message) || (resp === null || resp === void 0 ? void 0 : resp.message) || 'Permissions updated successfully';
            (0, _ToastUtil.triggerToast)(successMsg, _ToastConstants.TOAST_TYPES.SUCCESS, 'Success');
            setRefreshKey(function (prev) {
              return prev + 1;
            });
            setPermissionsOpen(false);
            _context6.next = 31;
            break;
          case 27:
            _context6.prev = 27;
            _context6.t0 = _context6["catch"](2);
            msg = (_context6.t0 === null || _context6.t0 === void 0 ? void 0 : _context6.t0.message) || 'Failed to update permissions';
            setPermissionsError(msg);
          case 31:
            _context6.prev = 31;
            setPermissionsLoading(false);
            return _context6.finish(31);
          case 34:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[2, 27, 31, 34]]);
    })), [permissionsAgent, permissionsDisplayFor, permissionsReadRoles, permissionsWriteRoles]);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
      position: "top-center"
    }), featureEnabled === null && /*#__PURE__*/_react.default.createElement(_AgentConnection.LoadingMessage, null, (0, _i18n.gettext)('Loading…')), featureEnabled === false && /*#__PURE__*/_react.default.createElement(_AgentConnection.DisabledAccessMessage, null, (0, _i18n.gettext)('Access to this page is disabled. Please contact your administrator.')), featureEnabled && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Header.default, {
      onAddType: onOpenAdd,
      onOwnerFilterChange: setOwnerFilter,
      onPageNumChange: handlePageNumChange,
      onSearchChange: setSearchTerm,
      ownerFilter: ownerFilter,
      ownerOptions: ownerOptions,
      pageNum: pageNum,
      searchTerm: searchTerm,
      totalPages: totalPages
    }), /*#__PURE__*/_react.default.createElement(_Body.default, {
      onConnectionsChange: setConnections,
      onDelete: onDeleteRow,
      onEdit: onEditRow,
      onEditPermissions: openPermissionsForConnection,
      onOwnerOptionsChange: setOwnerOptions,
      ownerFilter: ownerFilter,
      pageNum: pageNum,
      refreshKey: refreshKey,
      searchTerm: searchTerm
    }), showModal && /*#__PURE__*/_react.default.createElement(_AgentConnection.AgentConnectionModal, {
      onRequestClose: function onRequestClose(_ref11) {
        var event = _ref11.event,
          reason = _ref11.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowModal(false);
        setIsEdit(false);
        setFieldErrors({});
        setTestOk(false);
      },
      open: showModal
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: function onRequestClose() {
        setShowModal(false);
        setIsEdit(false);
        setFieldErrors({});
        setTestOk(false);
      },
      title: modalTitle
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_FormContent.default, {
      fieldErrors: fieldErrors,
      isEdit: isEdit,
      onConnectionDescriptionChange: function onConnectionDescriptionChange(value) {
        return setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            connectionDescription: value
          });
        });
      },
      renderKB: renderKB,
      renderMCP: renderMCP,
      setFieldErrors: setFieldErrors,
      setState: setState,
      setType: setType,
      showTypeSelector: false,
      state: state,
      type: type
    })), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: function onClick() {
        setShowModal(false);
        setFieldErrors({});
        setTestOk(false);
      }
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: isEdit ? false : !testOk,
      onClick: handleSaveConnection
    }, (0, _i18n.gettext)('Save Connection')))), permissionsOpen && /*#__PURE__*/_react.default.createElement(_AgentPermissionsModal.default, {
      onRequestClose: function onRequestClose(_ref12) {
        var event = _ref12.event,
          reason = _ref12.reason;
        if (reason === 'clickAway') {
          return;
        }
        setPermissionsOpen(false);
      },
      onSave: handleSavePermissions,
      open: permissionsOpen,
      permissionsAgent: permissionsAgent,
      permissionsDisplayFor: permissionsDisplayFor,
      permissionsError: permissionsError,
      permissionsLoading: permissionsLoading,
      permissionsReadRoles: permissionsReadRoles,
      permissionsRoles: permissionsRoles,
      permissionsWriteRoles: permissionsWriteRoles,
      setPermissionsDisplayFor: setPermissionsDisplayFor,
      setPermissionsReadRoles: setPermissionsReadRoles,
      setPermissionsWriteRoles: setPermissionsWriteRoles
    })));
  };
  var _default = _exports.default = AgentConnectionsPage;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentConnections/Body/Body.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-icons/DotsThreeVertical.js"), __webpack_require__("./node_modules/@splunk/react-ui/DefinitionList.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/components/agentConnections/Body/Body.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/AgentConnection.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/constants.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esArraySlice, _esArraySort, _esFunctionName, _esObjectToString, _esPromise, _esRegexpToString, _esSet, _esStringIncludes, _esStringIterator, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsIterator, _react, _propTypes, _i18n, _Button, _Dropdown, _Menu, _MoreVertical, _DefinitionList, _Modal, _Body, _AgentConnection, _constants, _AgentBuilderApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _MoreVertical = _interopRequireDefault(_MoreVertical);
  _DefinitionList = _interopRequireDefault(_DefinitionList);
  _Modal = _interopRequireDefault(_Modal);
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
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var Body = function Body(_ref) {
    var onConnectionsChange = _ref.onConnectionsChange,
      onDelete = _ref.onDelete,
      onEdit = _ref.onEdit,
      onEditPermissions = _ref.onEditPermissions,
      onOwnerOptionsChange = _ref.onOwnerOptionsChange,
      ownerFilter = _ref.ownerFilter,
      pageNum = _ref.pageNum,
      refreshKey = _ref.refreshKey,
      searchTerm = _ref.searchTerm;
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      expandedRowId = _useState2[0],
      setExpandedRowId = _useState2[1];
    var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      visibleRows = _useState4[0],
      setVisibleRows = _useState4[1];
    var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      connections = _useState6[0],
      setConnections = _useState6[1];
    var _useState7 = (0, _react.useState)('name'),
      _useState8 = _slicedToArray(_useState7, 2),
      sortKey = _useState8[0],
      setSortKey = _useState8[1];
    var _useState9 = (0, _react.useState)('asc'),
      _useState10 = _slicedToArray(_useState9, 2),
      sortDir = _useState10[0],
      setSortDir = _useState10[1];
    var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      confirmOpen = _useState12[0],
      setConfirmOpen = _useState12[1];
    var _useState13 = (0, _react.useState)(null),
      _useState14 = _slicedToArray(_useState13, 2),
      rowToDelete = _useState14[0],
      setRowToDelete = _useState14[1];
    var _useState15 = (0, _react.useState)(true),
      _useState16 = _slicedToArray(_useState15, 2),
      isLoading = _useState16[0],
      setIsLoading = _useState16[1];
    // Fetch MCP connections from backend
    (0, _react.useEffect)(function () {
      var isMounted = true;
      var fetchLists = /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var _mcpResp$payload, _mcpPayload$data, _kbResp$payload, _yield$Promise$all, _yield$Promise$all2, mcpResp, kbResp, mcpPayload, mcpItems, toCamel, mcpRows, kbPayload, kbItems, kbRows, allConnections, uniqueOwners;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                setIsLoading(true);
                _context.prev = 1;
                _context.next = 4;
                return Promise.all([(0, _AgentBuilderApi.getMcpConnectionsList)('', null), (0, _AgentBuilderApi.getKbConnectionsList)('', null)]);
              case 4:
                _yield$Promise$all = _context.sent;
                _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
                mcpResp = _yield$Promise$all2[0];
                kbResp = _yield$Promise$all2[1];
                // Normalize MCP payload
                mcpPayload = (_mcpResp$payload = mcpResp === null || mcpResp === void 0 ? void 0 : mcpResp.payload) !== null && _mcpResp$payload !== void 0 ? _mcpResp$payload : mcpResp;
                mcpItems = [];
                if (Array.isArray(mcpPayload)) mcpItems = mcpPayload;else if (Array.isArray(mcpPayload === null || mcpPayload === void 0 ? void 0 : mcpPayload.mcps)) mcpItems = mcpPayload.mcps;else if (Array.isArray(mcpPayload === null || mcpPayload === void 0 ? void 0 : (_mcpPayload$data = mcpPayload.data) === null || _mcpPayload$data === void 0 ? void 0 : _mcpPayload$data.mcps)) mcpItems = mcpPayload.data.mcps;
                toCamel = function toCamel(v) {
                  return v ? String(v).charAt(0).toUpperCase() + String(v).slice(1).toLowerCase() : '';
                };
                mcpRows = (mcpItems || []).map(function (m) {
                  var _m$acl;
                  var acl = (m === null || m === void 0 ? void 0 : m.acl) || {};
                  var sharing = acl.sharing || 'owner';
                  var sharingLabel;
                  if (sharing === 'owner') sharingLabel = (0, _i18n.gettext)('Private');else sharingLabel = (0, _i18n.gettext)('App');
                  return {
                    name: m === null || m === void 0 ? void 0 : m.name,
                    owner: (m === null || m === void 0 ? void 0 : (_m$acl = m.acl) === null || _m$acl === void 0 ? void 0 : _m$acl.owner) || '-',
                    connection_type: "".concat((0, _i18n.gettext)('MCP'), " - ").concat(toCamel(m === null || m === void 0 ? void 0 : m.type)),
                    sharing: sharing,
                    sharingLabel: sharingLabel,
                    _raw: m,
                    _kind: 'MCP'
                  };
                }); // Normalize KB payload (vector_stores GET returns array of configs in payload)
                kbPayload = (_kbResp$payload = kbResp === null || kbResp === void 0 ? void 0 : kbResp.payload) !== null && _kbResp$payload !== void 0 ? _kbResp$payload : kbResp;
                kbItems = [];
                if (Array.isArray(kbPayload)) {
                  kbItems = kbPayload;
                } else if (Array.isArray(kbPayload === null || kbPayload === void 0 ? void 0 : kbPayload.data)) {
                  kbItems = kbPayload.data;
                }
                kbRows = (kbItems || []).map(function (k) {
                  var _k$acl;
                  var acl = (k === null || k === void 0 ? void 0 : k.acl) || {};
                  var sharing = acl.sharing || 'owner';
                  var sharingLabel;
                  if (sharing === 'owner') sharingLabel = (0, _i18n.gettext)('Private');else sharingLabel = (0, _i18n.gettext)('App');
                  return {
                    name: k === null || k === void 0 ? void 0 : k.name,
                    owner: (k === null || k === void 0 ? void 0 : (_k$acl = k.acl) === null || _k$acl === void 0 ? void 0 : _k$acl.owner) || '-',
                    connection_type: (0, _i18n.gettext)('Knowledge Base - AWS Bedrock'),
                    sharing: sharing,
                    sharingLabel: sharingLabel,
                    _raw: k,
                    _kind: 'KB'
                  };
                });
                if (isMounted) {
                  allConnections = [].concat(_toConsumableArray(mcpRows), _toConsumableArray(kbRows));
                  setConnections(allConnections);
                  if (onConnectionsChange) {
                    onConnectionsChange(allConnections);
                  }
                  // Extract unique owners for filter dropdown
                  uniqueOwners = Array.from(new Set(allConnections.map(function (r) {
                    return r.owner;
                  }).filter(Boolean))).sort().map(function (owner) {
                    return {
                      label: owner,
                      value: owner
                    };
                  });
                  if (onOwnerOptionsChange) {
                    onOwnerOptionsChange(uniqueOwners);
                  }
                }
                _context.next = 24;
                break;
              case 20:
                _context.prev = 20;
                _context.t0 = _context["catch"](1);
                console.error('Failed to load MCP connections:', _context.t0);
                if (isMounted) setConnections([]);
              case 24:
                _context.prev = 24;
                if (isMounted) setIsLoading(false);
                return _context.finish(24);
              case 27:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1, 20, 24, 27]]);
        }));
        return function fetchLists() {
          return _ref2.apply(this, arguments);
        };
      }();
      fetchLists();
      return function () {
        isMounted = false;
      };
    }, [refreshKey]);
    function getExpansionRow(row, rowBg) {
      var _row$_raw, _row$_raw$connection_, _row$_raw2, _row$_raw2$details, _row$_raw3, _row$_raw$details;
      return /*#__PURE__*/_react.default.createElement(_Body.Table.Row, {
        key: "".concat(Math.random(), "-expansion")
      }, /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        colSpan: 5
      }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default, null, row._kind === 'MCP' && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Name')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.name || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Type')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.connection_type || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('URL')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, ((_row$_raw = row._raw) === null || _row$_raw === void 0 ? void 0 : (_row$_raw$connection_ = _row$_raw.connection_details) === null || _row$_raw$connection_ === void 0 ? void 0 : _row$_raw$connection_.mcp_server_url) || ((_row$_raw2 = row._raw) === null || _row$_raw2 === void 0 ? void 0 : (_row$_raw2$details = _row$_raw2.details) === null || _row$_raw2$details === void 0 ? void 0 : _row$_raw2$details.url) || ((_row$_raw3 = row._raw) === null || _row$_raw3 === void 0 ? void 0 : _row$_raw3.url) || (0, _i18n.gettext)('-'))), row._kind === 'KB' && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Name')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.name || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Type')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.connection_type), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Description')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row._raw.description || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Knowledge base id')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, ((_row$_raw$details = row._raw.details) === null || _row$_raw$details === void 0 ? void 0 : _row$_raw$details.kb_id) || (0, _i18n.gettext)('-'))))));
    }
    var handleRowExpansion = function handleRowExpansion(rowId) {
      setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };
    var handleSort = (0, _react.useCallback)(function (e, _ref3) {
      var newSortKey = _ref3.sortKey;
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
    }, []);
    var filteredConnections = (0, _react.useMemo)(function () {
      var q = (searchTerm || '').toLowerCase();
      var owner = (ownerFilter || '').toLowerCase();
      if (!q && !owner) return connections;
      return (connections || []).filter(function (r) {
        var matchesSearch = !q || ((r === null || r === void 0 ? void 0 : r.name) || '').toString().toLowerCase().includes(q);
        var matchesOwner = !owner || ((r === null || r === void 0 ? void 0 : r.owner) || '').toLowerCase().includes(owner);
        return matchesSearch && matchesOwner;
      });
    }, [connections, searchTerm, ownerFilter]);
    var sortedConnections = (0, _react.useMemo)(function () {
      if (!filteredConnections || filteredConnections.length === 0) return [];
      var sorted = _toConsumableArray(filteredConnections).sort(function (a, b) {
        try {
          var aVal, bVal;
          switch (sortKey) {
            case 'name':
              aVal = (a === null || a === void 0 ? void 0 : a.name) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.name) || '';
              break;
            case 'connection_type':
              aVal = (a === null || a === void 0 ? void 0 : a.connection_type) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.connection_type) || '';
              break;
            case 'sharingLabel':
              aVal = (a === null || a === void 0 ? void 0 : a.sharingLabel) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.sharingLabel) || '';
              break;
            default:
              return 0;
          }
          var aStr = String(aVal).toLowerCase();
          var bStr = String(bVal).toLowerCase();
          if (aStr < bStr) return sortDir === 'asc' ? -1 : 1;
          if (aStr > bStr) return sortDir === 'asc' ? 1 : -1;
          return 0;
        } catch (err) {
          return 0;
        }
      });
      return sorted;
    }, [filteredConnections, sortKey, sortDir]);
    (0, _react.useEffect)(function () {
      setVisibleRows(sortedConnections.slice((pageNum - 1) * _constants.ROWS, Math.min(sortedConnections.length, pageNum * _constants.ROWS)));
    }, [sortedConnections, pageNum]);
    var handleEdit = (0, _react.useCallback)(function (row) {
      if (onEdit) {
        onEdit(row);
      }
    }, [onEdit]);
    var handleDelete = function handleDelete(row) {
      setRowToDelete(row);
      setConfirmOpen(true);
    };
    var confirmDelete = function confirmDelete() {
      if (typeof onDelete === 'function' && rowToDelete) {
        onDelete(rowToDelete);
      }
      setConfirmOpen(false);
      setRowToDelete(null);
    };
    var cancelDelete = function cancelDelete() {
      setConfirmOpen(false);
      setRowToDelete(null);
    };
    return /*#__PURE__*/_react.default.createElement(_Body.Container, null, isLoading ? /*#__PURE__*/_react.default.createElement(_Body.LoadingState, null, (0, _i18n.gettext)('Loading...')) : /*#__PURE__*/_react.default.createElement(_Body.BackgroundWhiteDiv, null, /*#__PURE__*/_react.default.createElement(_Body.Table, {
      "data-test": "Connections_Table",
      rowExpansion: "single"
    }, /*#__PURE__*/_react.default.createElement(_Body.Table.Head, null, _constants.COLUMNNAMES.map(function (col, index) {
      if (index === 0) {
        return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
          key: col,
          onSort: handleSort,
          sortDir: sortKey === 'name' ? sortDir : 'none',
          sortKey: "name"
        }, col);
      }
      if (index === 2) {
        return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
          key: col,
          onSort: handleSort,
          sortDir: sortKey === 'connection_type' ? sortDir : 'none',
          sortKey: "connection_type"
        }, col);
      }
      if (index === 3) {
        return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
          key: col,
          onSort: handleSort,
          sortDir: sortKey === 'sharingLabel' ? sortDir : 'none',
          sortKey: "sharingLabel"
        }, col);
      }
      return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
        key: col
      }, col);
    })), /*#__PURE__*/_react.default.createElement(_Body.Table.Body, null, visibleRows && visibleRows.map(function (row, index) {
      var rowBg = index % 2 === 0 ? '#ffffff' : '#f1f3f6';
      var rowId = "row-".concat(index);
      return /*#__PURE__*/_react.default.createElement(_Body.StyledTableRow, {
        key: rowId,
        expanded: rowId === expandedRowId,
        expansionRow: getExpansionRow(row, rowBg),
        onExpansion: function onExpansion() {
          return handleRowExpansion(rowId);
        },
        rowBg: rowBg
      }, /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.name || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.owner || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.connection_type || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, onEditPermissions ? /*#__PURE__*/_react.default.createElement(_Body.LinkSpan, {
        onClick: function onClick() {
          return onEditPermissions(row);
        }
      }, row.sharingLabel) : row.sharingLabel), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
        toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
          appearance: "pill",
          "aria-label": (0, _i18n.gettext)('More actions'),
          className: "kebab-btn",
          icon: /*#__PURE__*/_react.default.createElement(_MoreVertical.default, {
            size: 1
          })
        })
      }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return handleEdit(row);
        }
      }, _constants.EDIT), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return handleDelete(row);
        }
      }, _constants.DELETE)))));
    })))), confirmOpen && /*#__PURE__*/_react.default.createElement(_AgentConnection.DeleteAgentConnectionModal, {
      onRequestClose: cancelDelete,
      open: true
    }, /*#__PURE__*/_react.default.createElement(_AgentConnection.AgentConnectionModalHeader, {
      onRequestClose: cancelDelete,
      title: (0, _i18n.gettext)('Delete connection')
    }), /*#__PURE__*/_react.default.createElement(_AgentConnection.AgentConnectionModalBody, null, (0, _i18n.sprintf)((0, _i18n.gettext)('Are you sure you would like to delete "%(name)s"? This action cannot be undone.'), {
      name: rowToDelete === null || rowToDelete === void 0 ? void 0 : rowToDelete.name
    })), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: cancelDelete
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "destructive",
      onClick: confirmDelete
    }, (0, _i18n.gettext)('Delete')))));
  };
  Body.propTypes = {
    onDelete: _propTypes.default.func,
    onEdit: _propTypes.default.func,
    onEditPermissions: _propTypes.default.func,
    refreshKey: _propTypes.default.number,
    searchTerm: _propTypes.default.string,
    ownerFilter: _propTypes.default.string,
    onOwnerOptionsChange: _propTypes.default.func,
    pageNum: _propTypes.default.number,
    onConnectionsChange: _propTypes.default.func
  };
  Body.defaultProps = {
    onDelete: null,
    onEdit: null,
    onEditPermissions: null,
    refreshKey: 0,
    searchTerm: '',
    ownerFilter: '',
    onOwnerOptionsChange: null,
    pageNum: 1,
    onConnectionsChange: null
  };
  var _default = _exports.default = Body;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentConnections/Body/Body.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es"), __webpack_require__("./src/main/webapp/util/forwardRefComponent.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Paginator, _Table, _Typography, _themes, _forwardRefComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Table = _exports.StyledTableRow = _exports.RightPaginator = _exports.PrimaryTableCell = _exports.PrimaryHeadCell = _exports.LoadingState = _exports.LinkSpan = _exports.Container = _exports.CenterPaginator = _exports.BackgroundWhiteDiv = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Paginator = _interopRequireDefault(_Paginator);
  _Table = _interopRequireDefault(_Table);
  _Typography = _interopRequireDefault(_Typography);
  _forwardRefComponent = _interopRequireDefault(_forwardRefComponent);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var Container = _exports.Container = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 0 ", ";\n    display: flex;\n    flex-direction: column;\n"])), _themes.variables.spacingXLarge);
  var CenterPaginator = _exports.CenterPaginator = (0, _styledComponents.default)((0, _forwardRefComponent.default)(_Paginator.default))(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    align-self: center;\n"])));
  var RightPaginator = _exports.RightPaginator = (0, _styledComponents.default)((0, _forwardRefComponent.default)(_Paginator.default))(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    align-self: flex-end;\n"])));
  var Table = _exports.Table = (0, _styledComponents.default)(_Table.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    & [data-role='expand'] {\n        padding: ", ";\n        background-color: inherit;\n    }\n    & [data-role='more-info-head-cell'] {\n        padding: ", ";\n    }\n"])), _themes.variables.spacingSmall, _themes.variables.spacingSmall);
  var PrimaryTableCell = _exports.PrimaryTableCell = (0, _styledComponents.default)(_Table.default.Cell)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    vertical-align: middle;\n    padding: ", ";\n    color: ", ";\n    background-color: ", ";\n"])), _themes.variables.spacingSmall, function (_ref) {
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
  var BackgroundWhiteDiv = _exports.BackgroundWhiteDiv = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    background-color: ", ";\n"])), _themes.variables.backgroundColorPage);
  var PrimaryHeadCell = _exports.PrimaryHeadCell = (0, _styledComponents.default)(_Table.default.HeadCell)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    padding: ", ";\n"])), _themes.variables.spacingSmall);
  var LoadingState = _exports.LoadingState = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    && {\n        text-align: center;\n        padding: ", ";\n        color: ", ";\n    }\n"])), _themes.variables.spacingXXXLarge, _themes.variables.textGray);
  var StyledTableRow = _exports.StyledTableRow = (0, _styledComponents.default)(_Table.default.Row)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    background-color: ", ";\n"])), function (_ref3) {
    var rowBg = _ref3.rowBg;
    return rowBg || 'inherit';
  });
  var LinkSpan = _exports.LinkSpan = (0, _styledComponents.default)(_Typography.default)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    && {\n        color: ", ";\n        cursor: pointer;\n        text-decoration: none;\n    }\n\n    &:hover {\n        text-decoration: underline;\n    }\n"])), _themes.variables.linkColor);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentConnections/Header/Header.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-icons/Plus.js"), __webpack_require__("./node_modules/@splunk/react-icons/Magnifier.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./src/main/webapp/components/agents/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _i18n, _Button, _Dropdown, _Menu, _Select, _Plus, _Magnifier, _Paginator, _Text, _Header, _Header2, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _Select = _interopRequireDefault(_Select);
  _Plus = _interopRequireDefault(_Plus);
  _Magnifier = _interopRequireDefault(_Magnifier);
  _Paginator = _interopRequireDefault(_Paginator);
  _Text = _interopRequireDefault(_Text);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Header = function Header(_ref) {
    var onAddType = _ref.onAddType,
      _ref$onOwnerFilterCha = _ref.onOwnerFilterChange,
      onOwnerFilterChange = _ref$onOwnerFilterCha === void 0 ? function () {} : _ref$onOwnerFilterCha,
      _ref$onPageNumChange = _ref.onPageNumChange,
      onPageNumChange = _ref$onPageNumChange === void 0 ? function () {} : _ref$onPageNumChange,
      onSearchChange = _ref.onSearchChange,
      _ref$ownerFilter = _ref.ownerFilter,
      ownerFilter = _ref$ownerFilter === void 0 ? '' : _ref$ownerFilter,
      _ref$ownerOptions = _ref.ownerOptions,
      ownerOptions = _ref$ownerOptions === void 0 ? [] : _ref$ownerOptions,
      _ref$pageNum = _ref.pageNum,
      pageNum = _ref$pageNum === void 0 ? 1 : _ref$pageNum,
      searchTerm = _ref.searchTerm,
      _ref$totalPages = _ref.totalPages,
      totalPages = _ref$totalPages === void 0 ? 1 : _ref$totalPages;
    return /*#__PURE__*/_react.default.createElement(_Header2.HeaderContainerNoBorder, null, /*#__PURE__*/_react.default.createElement(_Header2.HeaderTopRow, null, /*#__PURE__*/_react.default.createElement(_Header.ShowcaseHeaderWrapper, null, /*#__PURE__*/_react.default.createElement(_Header.TitleStyle, null, _constants.TITLE), /*#__PURE__*/_react.default.createElement(_Header2.SubTitleStyle, null, (0, _i18n.gettext)('Connect MCP servers and Knowledge Base for AI agents. View the'), ' ', /*#__PURE__*/_react.default.createElement(_Header2.DocumentationLink, {
      href: _constants.AGENT_BUILDER_DOCUMENTATION_LINK,
      rel: "noopener noreferrer",
      target: "_blank"
    }, (0, _i18n.gettext)('agent builder documentation')), ' ', (0, _i18n.gettext)('to learn more.'))), /*#__PURE__*/_react.default.createElement(_Header2.DropdownWrapper, null, /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
        appearance: "primary",
        icon: /*#__PURE__*/_react.default.createElement(_Plus.default, null),
        isMenu: true,
        label: _constants.ADD_CONNECTION_BUTTON_LABEL
      })
    }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return onAddType('MCP');
      }
    }, (0, _i18n.gettext)('MCP server')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return onAddType('KB');
      }
    }, (0, _i18n.gettext)('Knowledge base')))))), /*#__PURE__*/_react.default.createElement(_Header2.HeaderBottomRow, null, /*#__PURE__*/_react.default.createElement(_Header2.FiltersContainer, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterColumn, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterLabel, null, (0, _i18n.gettext)('Filter')), /*#__PURE__*/_react.default.createElement(_Text.default, {
      appearance: "search",
      "data-test": "Filter_Examples",
      endAdornment: /*#__PURE__*/_react.default.createElement(_Header2.MagnifierIcon, null, /*#__PURE__*/_react.default.createElement(_Magnifier.default, null)),
      inline: true,
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        return onSearchChange(value);
      },
      placeholder: _constants.FILTER_PLACEHOLDER,
      value: searchTerm
    })), /*#__PURE__*/_react.default.createElement(_Header2.FilterColumn, {
      minWidth: 140
    }, /*#__PURE__*/_react.default.createElement(_Header2.FilterLabel, null, (0, _i18n.gettext)('Owner')), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "AgentConnections_Owner",
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return onOwnerFilterChange(value);
      },
      value: ownerFilter
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('All owners'),
      value: ""
    }), ownerOptions.map(function (opt) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: opt.value,
        label: opt.label,
        value: opt.value
      });
    })))), /*#__PURE__*/_react.default.createElement(_Header2.PaginatorContainer, null, /*#__PURE__*/_react.default.createElement(_Paginator.default, {
      current: pageNum,
      onChange: function onChange(e, _ref4) {
        var page = _ref4.page;
        return onPageNumChange(page);
      },
      totalPages: totalPages
    }))));
  };
  Header.propTypes = {
    onAddType: _propTypes.default.func.isRequired,
    onSearchChange: _propTypes.default.func.isRequired,
    searchTerm: _propTypes.default.string.isRequired,
    ownerFilter: _propTypes.default.string,
    onOwnerFilterChange: _propTypes.default.func,
    ownerOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })),
    pageNum: _propTypes.default.number,
    onPageNumChange: _propTypes.default.func,
    totalPages: _propTypes.default.number
  };
  Header.defaultProps = {
    ownerFilter: '',
    onOwnerFilterChange: function onOwnerFilterChange() {},
    ownerOptions: [],
    pageNum: 1,
    onPageNumChange: function onPageNumChange() {},
    totalPages: 1
  };
  var _default = _exports.default = Header;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentConnections/constants.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TITLE = _exports.SUBTITLE = _exports.ROWS = _exports.FILTER_PLACEHOLDER = _exports.EDIT = _exports.DELETE = _exports.COLUMNNAMES = _exports.APP = _exports.AGENT_BUILDER_DOCUMENTATION_LINK = _exports.ADD_CONNECTION_TITLE = _exports.ADD_CONNECTION_BUTTON_LABEL = void 0;
  var COLUMNNAMES = _exports.COLUMNNAMES = [(0, _i18n.gettext)('Connection name'), (0, _i18n.gettext)('Owner'), (0, _i18n.gettext)('Connection type'), (0, _i18n.gettext)('Sharing'), ''];
  var ROWS = _exports.ROWS = 10;
  var EDIT = _exports.EDIT = (0, _i18n.gettext)('Edit connection');
  var DELETE = _exports.DELETE = (0, _i18n.gettext)('Delete connection');
  var SUBTITLE = _exports.SUBTITLE = (0, _i18n.gettext)('Connect MCP servers and Knowledge Base for AI agents. View the agent builder documentation for more information to learn more.');
  var AGENT_BUILDER_DOCUMENTATION_LINK = _exports.AGENT_BUILDER_DOCUMENTATION_LINK = 'https://help.splunk.com/en/?resourceId=ccda4faf6-ff99-4e43-b633-48cf68c3f5c6';
  var TITLE = _exports.TITLE = (0, _i18n.gettext)('Agent connections');
  var ADD_CONNECTION_TITLE = _exports.ADD_CONNECTION_TITLE = (0, _i18n.gettext)(' Connection');
  var ADD_CONNECTION_BUTTON_LABEL = _exports.ADD_CONNECTION_BUTTON_LABEL = (0, _i18n.gettext)('Connection');
  var FILTER_PLACEHOLDER = _exports.FILTER_PLACEHOLDER = (0, _i18n.gettext)('Filter by connection name');
  var APP = _exports.APP = 'Splunk_ML_Toolkit';
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/AgentConnections.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("agentconnections/AgentConnectionsView")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _AgentConnectionsView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _AgentConnectionsView = _interopRequireDefault(_AgentConnectionsView);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var AgentConnectionsRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Agent Connections'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.showcaseView) {
        this.showcaseView.remove();
      }
      this.showcaseView = new _AgentConnectionsView.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = AgentConnectionsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "agentconnections/AgentConnectionsView":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/agentConnections/AgentConnectionsPage.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _BaseDashboard, _AgentConnectionsPage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _AgentConnectionsPage = _interopRequireDefault(_AgentConnectionsPage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * Backbone page that renders the React component tree for Agent Connections
   */

  var Page = (0, _root.hot)(_AgentConnectionsPage.default);
  var AgentConnectionsView = _BaseDashboard.default.extend({
    render: function render() {
      _reactDom.default.render(_react.default.createElement(Page), this.el);
    }
  });
  var _default = _exports.default = AgentConnectionsView;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/agentconnections.es","pages_common"]]]);