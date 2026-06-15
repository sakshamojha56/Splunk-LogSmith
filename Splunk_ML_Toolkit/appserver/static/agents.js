(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["agents"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/agents.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Agents.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Agents, _swcMltk) {
  "use strict";

  _Agents = _interopRequireDefault(_Agents);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Agents.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/AgentsPage.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.find-key.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.includes.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.key-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.map-keys.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.map-values.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.merge.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.map.update.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastMessages.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/agentConnections/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/agentConnections/utils/ResponseHandlerUtil.jsx"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/util/themeCompat.es"), __webpack_require__("./src/main/webapp/components/agents/Header/Header.jsx"), __webpack_require__("./src/main/webapp/components/agents/Body/Body.jsx"), __webpack_require__("./src/main/webapp/components/agents/validate.js"), __webpack_require__("./src/main/webapp/components/agents/constants.js"), __webpack_require__("./src/main/webapp/components/agents/modals/AgentCreateModal.jsx"), __webpack_require__("./src/main/webapp/components/agents/modals/AgentEditModal.jsx"), __webpack_require__("./src/main/webapp/components/agents/modals/AgentPermissionsModal.jsx"), __webpack_require__("./src/main/webapp/components/agents/modals/AgentDeleteModal.jsx"), __webpack_require__("./src/main/webapp/components/agents/hooks/index.js"), __webpack_require__("./src/main/webapp/components/agents/utils/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esFunctionName, _esMap, _esObjectToString, _esRegexpExec, _esSet, _esStringIncludes, _esStringIterator, _esStringTrim, _esnextMapDeleteAll, _esnextMapEvery, _esnextMapFilter, _esnextMapFind, _esnextMapFindKey, _esnextMapIncludes, _esnextMapKeyOf, _esnextMapMapKeys, _esnextMapMapValues, _esnextMapMerge, _esnextMapReduce, _esnextMapSome, _esnextMapUpdate, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _react, _i18n, _config, _ToastMessages, _ToastConstants, _ToastUtil, _AgentBuilderApi, _ResponseHandlerUtil, _Agents, _themeCompat, _Header, _Body, _validate, _constants, _AgentCreateModal, _AgentEditModal, _AgentPermissionsModal, _AgentDeleteModal, _hooks, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _ToastMessages = _interopRequireDefault(_ToastMessages);
  _Header = _interopRequireDefault(_Header);
  _Body = _interopRequireDefault(_Body);
  _AgentCreateModal = _interopRequireDefault(_AgentCreateModal);
  _AgentEditModal = _interopRequireDefault(_AgentEditModal);
  _AgentPermissionsModal = _interopRequireDefault(_AgentPermissionsModal);
  _AgentDeleteModal = _interopRequireDefault(_AgentDeleteModal);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var AgentsPage = function AgentsPage() {
    // Use custom hooks for data fetching
    var _useAgentOptions = (0, _hooks.useAgentOptions)(),
      mcpOptions = _useAgentOptions.mcpOptions,
      kbOptions = _useAgentOptions.kbOptions;
    var _useFeatureFlags = (0, _hooks.useFeatureFlags)(),
      featureEnabled = _useFeatureFlags.featureEnabled;
    var _useLLMConfig = (0, _hooks.useLLMConfig)(),
      llmProviders = _useLLMConfig.llmProviders,
      modelsByProvider = _useLLMConfig.modelsByProvider,
      aiCommanderConfig = _useLLMConfig.aiCommanderConfig;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      showModal = _useState2[0],
      setShowModal = _useState2[1];
    var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isSaving = _useState4[0],
      setIsSaving = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      error = _useState6[0],
      setError = _useState6[1];
    var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isEdit = _useState8[0],
      setIsEdit = _useState8[1];
    var _useState9 = (0, _react.useState)(1),
      _useState10 = _slicedToArray(_useState9, 2),
      pageNum = _useState10[0],
      setPageNum = _useState10[1];
    var _useState11 = (0, _react.useState)({
        agent_name: '',
        description: '',
        system_prompt: '',
        task_prompt: '',
        mcps: [],
        knowledge_bases: [],
        knowledge_bases_raw: [],
        llmProvider: '',
        llmModel: '',
        llmConnectionName: '',
        is_enabled: true,
        response_variability: '',
        max_tokens: '',
        maximum_result_rows: '',
        agent_timeout: '',
        acl: null
      }),
      _useState12 = _slicedToArray(_useState11, 2),
      state = _useState12[0],
      setState = _useState12[1];
    var _useState13 = (0, _react.useState)({}),
      _useState14 = _slicedToArray(_useState13, 2),
      fieldErrors = _useState14[0],
      setFieldErrors = _useState14[1];
    var _useState15 = (0, _react.useState)([]),
      _useState16 = _slicedToArray(_useState15, 2),
      advancedVisible = _useState16[0],
      setAdvancedVisible = _useState16[1]; // keys: 'system_prompt'|'maximum_result_rows'|'agent_timeout'
    var _useState17 = (0, _react.useState)([]),
      _useState18 = _slicedToArray(_useState17, 2),
      llmConfigVisible = _useState18[0],
      setLlmConfigVisible = _useState18[1]; // keys: 'response_variability'|'max_tokens'
    var _useState19 = (0, _react.useState)(''),
      _useState20 = _slicedToArray(_useState19, 2),
      searchTerm = _useState20[0],
      setSearchTerm = _useState20[1];
    var _useState21 = (0, _react.useState)(''),
      _useState22 = _slicedToArray(_useState21, 2),
      ownerFilter = _useState22[0],
      setOwnerFilter = _useState22[1];
    var _useState23 = (0, _react.useState)([]),
      _useState24 = _slicedToArray(_useState23, 2),
      ownerOptions = _useState24[0],
      setOwnerOptions = _useState24[1];
    var _useState25 = (0, _react.useState)(0),
      _useState26 = _slicedToArray(_useState25, 2),
      refreshKey = _useState26[0],
      setRefreshKey = _useState26[1];
    var _useState27 = (0, _react.useState)([]),
      _useState28 = _slicedToArray(_useState27, 2),
      agents = _useState28[0],
      setAgents = _useState28[1];

    // Calculate totalPages based on filtered agents
    var totalPages = (0, _react.useMemo)(function () {
      var filteredAgents = agents.filter(function (agent) {
        var _agent$name, _agent$owner;
        var matchesSearch = !searchTerm || ((_agent$name = agent.name) === null || _agent$name === void 0 ? void 0 : _agent$name.toLowerCase().includes(searchTerm.toLowerCase()));
        var matchesOwner = !ownerFilter || ((_agent$owner = agent.owner) === null || _agent$owner === void 0 ? void 0 : _agent$owner.toLowerCase()) === ownerFilter.toLowerCase();
        return matchesSearch && matchesOwner;
      });
      return Math.max(1, Math.ceil(filteredAgents.length / _constants.ROWS));
    }, [agents, searchTerm, ownerFilter]);

    // Reset page to 1 when search term or owner filter changes
    (0, _react.useEffect)(function () {
      setPageNum(1);
    }, [searchTerm, ownerFilter]);
    var _useState29 = (0, _react.useState)(false),
      _useState30 = _slicedToArray(_useState29, 2),
      permissionsOpen = _useState30[0],
      setPermissionsOpen = _useState30[1];
    var _useState31 = (0, _react.useState)(null),
      _useState32 = _slicedToArray(_useState31, 2),
      permissionsAgent = _useState32[0],
      setPermissionsAgent = _useState32[1];
    var _useState33 = (0, _react.useState)([]),
      _useState34 = _slicedToArray(_useState33, 2),
      permissionsRoles = _useState34[0],
      setPermissionsRoles = _useState34[1]; // ['Everyone', 'admin', ...]
    var _useState35 = (0, _react.useState)('owner'),
      _useState36 = _slicedToArray(_useState35, 2),
      permissionsDisplayFor = _useState36[0],
      setPermissionsDisplayFor = _useState36[1]; // 'owner' | 'app'
    var _useState37 = (0, _react.useState)([]),
      _useState38 = _slicedToArray(_useState37, 2),
      permissionsReadRoles = _useState38[0],
      setPermissionsReadRoles = _useState38[1]; // role names including 'Everyone'
    var _useState39 = (0, _react.useState)([]),
      _useState40 = _slicedToArray(_useState39, 2),
      permissionsWriteRoles = _useState40[0],
      setPermissionsWriteRoles = _useState40[1];
    var _useState41 = (0, _react.useState)(''),
      _useState42 = _slicedToArray(_useState41, 2),
      permissionsError = _useState42[0],
      setPermissionsError = _useState42[1];
    var _useState43 = (0, _react.useState)(false),
      _useState44 = _slicedToArray(_useState43, 2),
      permissionsLoading = _useState44[0],
      setPermissionsLoading = _useState44[1];
    var _useState45 = (0, _react.useState)(false),
      _useState46 = _slicedToArray(_useState45, 2),
      deleteModalOpen = _useState46[0],
      setDeleteModalOpen = _useState46[1];
    var _useState47 = (0, _react.useState)(null),
      _useState48 = _slicedToArray(_useState47, 2),
      deleteAgent = _useState48[0],
      setDeleteAgent = _useState48[1];
    var _useState49 = (0, _react.useState)(false),
      _useState50 = _slicedToArray(_useState49, 2),
      isDeleting = _useState50[0],
      setIsDeleting = _useState50[1];

    // MCP tools selections state (not part of hooks as it's local UI state)
    var _useState51 = (0, _react.useState)({}),
      _useState52 = _slicedToArray(_useState51, 2),
      mcpToolsSelections = _useState52[0],
      setMcpToolsSelections = _useState52[1]; // { [name]: [toolValues] }

    var handlePageNumChange = function handlePageNumChange(page) {
      return setPageNum(page);
    };
    var handleDeleteRequest = (0, _react.useCallback)(function (row, index) {
      var agentName = (row === null || row === void 0 ? void 0 : row.name) || "row-".concat(index + 1);
      setDeleteAgent({
        row: row,
        index: index,
        name: agentName
      });
      setDeleteModalOpen(true);
    }, []);
    var handleConfirmDelete = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var name, msg;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (deleteAgent) {
              _context.next = 3;
              break;
            }
            setDeleteModalOpen(false);
            return _context.abrupt("return");
          case 3:
            try {
              setIsDeleting(true);
              name = deleteAgent.name; // Existing behavior: trigger table refresh and show success toast
              setRefreshKey(function (prev) {
                return prev + 1;
              });
              (0, _ToastUtil.triggerToast)("Agent \"".concat(name, "\" deleted successfully"), _ToastConstants.TOAST_TYPES.SUCCESS, 'Success');
              setDeleteModalOpen(false);
            } catch (e) {
              msg = (e === null || e === void 0 ? void 0 : e.message) || 'Failed to delete agent';
              (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            } finally {
              setIsDeleting(false);
            }
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })), [deleteAgent]);
    var onOpenAdd = (0, _react.useCallback)(function () {
      setError('');
      setIsEdit(false);
      setState({
        agent_name: '',
        description: '',
        system_prompt: '',
        task_prompt: '',
        mcps: [],
        knowledge_bases: [],
        knowledge_bases_raw: [],
        llmProvider: '',
        llmModel: '',
        llmConnectionName: '',
        is_enabled: true,
        response_variability: '',
        max_tokens: '',
        maximum_result_rows: '',
        agent_timeout: '',
        acl: null
      });
      setMcpToolsSelections({});
      setFieldErrors({});
      setAdvancedVisible([]);
      setLlmConfigVisible([]);
      setShowModal(true);
    }, []);
    var openPermissionsForAgent = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(row) {
        var _rolesResp$payload, raw, v, acl, perms, currentRead, currentWrite, mapApiRolesToUi, uiRead, uiWrite, sharing, rolesResp, data, roles, aclRoles, uniqueRoles;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              setPermissionsError('');
              setPermissionsLoading(true);
              setPermissionsAgent(row);

              // Derive current ACL state from raw document (getAgentsList format)
              raw = (row === null || row === void 0 ? void 0 : row._raw) || {};
              v = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.versions) && raw.versions.length ? raw.versions[0] : {};
              acl = (v === null || v === void 0 ? void 0 : v.acl) || {};
              perms = acl.perms || {};
              currentRead = Array.isArray(perms.read) ? perms.read : [];
              currentWrite = Array.isArray(perms.write) ? perms.write : [];
              mapApiRolesToUi = function mapApiRolesToUi(arr) {
                if (!Array.isArray(arr)) return [];
                if (arr.includes('*')) return ['Everyone'];
                return arr;
              };
              uiRead = mapApiRolesToUi(currentRead);
              uiWrite = mapApiRolesToUi(currentWrite);
              setPermissionsReadRoles(uiRead);
              setPermissionsWriteRoles(uiWrite);
              sharing = acl.sharing || 'owner';
              setPermissionsDisplayFor(sharing === 'app' ? 'app' : 'owner');

              // Fetch roles for current user via shared AgentBuilder API
              _context2.next = 19;
              return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.getUserRoles, ['', null], {
                errorMessage: 'Failed to fetch user roles',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 19:
              rolesResp = _context2.sent;
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
              _context2.next = 32;
              break;
            case 28:
              _context2.prev = 28;
              _context2.t0 = _context2["catch"](0);
              setPermissionsError((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || 'Failed to load permissions');
              setPermissionsOpen(true);
            case 32:
              _context2.prev = 32;
              setPermissionsLoading(false);
              return _context2.finish(32);
            case 35:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 28, 32, 35]]);
      }));
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), []);
    var onEditRow = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(row) {
        var _resp$payload, _llm$response_variabi, _llm$max_tokens, _llm$maximum_result_r, _v$agent_timeout, agentName, resp, payload, items, root, v, tools, mcpsArr, kbsArr, mcpsNames, kbNames, toolsSelections, llm, provider, model, connectionName, respVar, maxTok, maxRows, timeout, enabledFromVersion, newAdvanced, newLlmCfg, msg;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              setError('');
              setIsEdit(true);
              setIsSaving(false);
              setFieldErrors({});
              _context3.prev = 4;
              agentName = (row === null || row === void 0 ? void 0 : row.name) || '';
              if (agentName) {
                _context3.next = 9;
                break;
              }
              (0, _ToastUtil.triggerToast)('Agent name is missing for edit', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
              return _context3.abrupt("return");
            case 9:
              _context3.next = 11;
              return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.getAgentsList, ['', null], {
                errorMessage: 'Failed to fetch agent details',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 11:
              resp = _context3.sent;
              payload = (_resp$payload = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload !== void 0 ? _resp$payload : resp;
              items = [];
              if (Array.isArray(payload === null || payload === void 0 ? void 0 : payload.agents)) {
                items = payload.agents;
              } else if (Array.isArray(payload)) {
                items = payload;
              }
              root = (items || []).find(function (a) {
                return (a === null || a === void 0 ? void 0 : a.agent_name) === agentName;
              }) || items[0] || {};
              v = Array.isArray(root === null || root === void 0 ? void 0 : root.versions) && root.versions.length ? root.versions[0] : {}; // Tools: mcps and knowledge bases
              tools = (v === null || v === void 0 ? void 0 : v.tools) || {};
              mcpsArr = Array.isArray(tools.mcps) ? tools.mcps : [];
              kbsArr = Array.isArray(tools.knowledge_bases) ? tools.knowledge_bases : [];
              mcpsNames = mcpsArr.map(function (m) {
                return typeof m === 'string' ? m : m && m.name || '';
              }).filter(Boolean);
              kbNames = kbsArr.map(function (k) {
                return typeof k === 'string' ? k : k && k.name || '';
              }).filter(Boolean); // Build initial tools selection map from backend tools array
              toolsSelections = {};
              mcpsArr.forEach(function (m) {
                if (m && _typeof(m) === 'object' && m.name) {
                  var t = Array.isArray(m.tools) ? m.tools : [];
                  toolsSelections[m.name] = t;
                }
              });
              llm = (v === null || v === void 0 ? void 0 : v.llm) || {};
              provider = (llm === null || llm === void 0 ? void 0 : llm.provider) || '';
              model = (llm === null || llm === void 0 ? void 0 : llm.model) || '';
              connectionName = (llm === null || llm === void 0 ? void 0 : llm.connection_name) || ''; // Handle Splunk_Default case for editing - map back to Default/Splunk_Default
              if (provider === 'Splunk_Default' && model === '') {
                provider = 'Default';
                model = 'Splunk_Default';
              }
              respVar = (_llm$response_variabi = llm === null || llm === void 0 ? void 0 : llm.response_variability) !== null && _llm$response_variabi !== void 0 ? _llm$response_variabi : '';
              maxTok = (_llm$max_tokens = llm === null || llm === void 0 ? void 0 : llm.max_tokens) !== null && _llm$max_tokens !== void 0 ? _llm$max_tokens : '';
              maxRows = (_llm$maximum_result_r = llm === null || llm === void 0 ? void 0 : llm.maximum_result_rows) !== null && _llm$maximum_result_r !== void 0 ? _llm$maximum_result_r : '';
              timeout = (_v$agent_timeout = v === null || v === void 0 ? void 0 : v.agent_timeout) !== null && _v$agent_timeout !== void 0 ? _v$agent_timeout : '';
              enabledFromVersion = function enabledFromVersion(val) {
                if (typeof val === 'string') return val.toLowerCase() === 'true';
                return !!val;
              };
              setState(function (s) {
                return _objectSpread(_objectSpread({}, s), {}, {
                  agent_name: (root === null || root === void 0 ? void 0 : root.agent_name) || agentName,
                  description: (v === null || v === void 0 ? void 0 : v.description) || '',
                  prompt: (v === null || v === void 0 ? void 0 : v.task_prompt) || '',
                  system_prompt: (v === null || v === void 0 ? void 0 : v.system_prompt) || '',
                  task_prompt: (v === null || v === void 0 ? void 0 : v.task_prompt) || '',
                  mcps: mcpsNames,
                  knowledge_bases: kbNames,
                  knowledge_bases_raw: kbsArr,
                  llmProvider: provider,
                  llmModel: model,
                  llmConnectionName: connectionName,
                  is_enabled: enabledFromVersion(v === null || v === void 0 ? void 0 : v.is_enabled),
                  response_variability: respVar,
                  max_tokens: maxTok,
                  maximum_result_rows: maxRows,
                  agent_timeout: timeout,
                  acl: (v === null || v === void 0 ? void 0 : v.acl) || {
                    sharing: 'owner',
                    app: _config.app,
                    owner: _config.username,
                    perms: {
                      read: [],
                      write: []
                    }
                  }
                });
              });
              setMcpToolsSelections(toolsSelections);
              newAdvanced = [];
              newLlmCfg = [];
              if (v !== null && v !== void 0 && v.system_prompt && v.system_prompt.trim() !== '') newAdvanced.push('system_prompt');
              if (respVar !== '' && respVar !== undefined) newLlmCfg.push('response_variability');
              if (maxTok !== '' && maxTok !== undefined) newLlmCfg.push('max_tokens');
              if (maxRows !== '' && maxRows !== undefined) newAdvanced.push('maximum_result_rows');
              if (timeout !== '' && timeout !== undefined) newAdvanced.push('agent_timeout');
              setAdvancedVisible(newAdvanced);
              setLlmConfigVisible(newLlmCfg);
              setShowModal(true);
              _context3.next = 53;
              break;
            case 48:
              _context3.prev = 48;
              _context3.t0 = _context3["catch"](4);
              msg = (_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || 'Failed to fetch agent details';
              setError(msg);
              (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            case 53:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[4, 48]]);
      }));
      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }(), []);
    var handleCreate = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var _resp$payload2, name, alphaNum, _validateAgent, ok, fe, msg, payload, resp, errMsg, result, successMsg, _msg;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            setIsSaving(true);
            setError('');
            _context4.prev = 2;
            name = String((state === null || state === void 0 ? void 0 : state.agent_name) || '').trim();
            alphaNum = /^[A-Za-z0-9]+$/;
            if (alphaNum.test(name)) {
              _context4.next = 10;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                agent_name: 'Use only letters and numbers (no spaces or special characters)'
              });
            });
            (0, _ToastUtil.triggerToast)('Please fix the validation errors', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context4.abrupt("return");
          case 10:
            if (!(name.length > 256)) {
              _context4.next = 15;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                agent_name: 'Maximum 256 characters'
              });
            });
            (0, _ToastUtil.triggerToast)('Please fix the validation errors', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context4.abrupt("return");
          case 15:
            // Validate form
            _validateAgent = (0, _validate.validateAgent)(state), ok = _validateAgent.ok, fe = _validateAgent.fieldErrors;
            if (ok) {
              _context4.next = 22;
              break;
            }
            msg = 'Please fix the validation errors';
            setFieldErrors(fe || {});
            (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context4.abrupt("return");
          case 22:
            setFieldErrors({});
            // Build payload using utility function
            payload = (0, _utils.buildCreateAgentPayload)({
              state: state,
              mcpToolsSelections: mcpToolsSelections,
              llmConfigVisible: llmConfigVisible,
              advancedVisible: advancedVisible
            }); // Call backend to create agent
            _context4.next = 26;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.createAgents, ['', payload], {
              errorMessage: 'Failed to create agent',
              showSuccessToast: false,
              showErrorToast: false
            });
          case 26:
            resp = _context4.sent;
            if ((0, _utils.isApiResponseSuccess)(resp)) {
              _context4.next = 33;
              break;
            }
            errMsg = (0, _utils.getApiErrorMessage)(resp, 'Failed to create agent');
            setError(errMsg);
            (0, _ToastUtil.triggerToast)(errMsg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context4.abrupt("return");
          case 33:
            result = (_resp$payload2 = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload2 !== void 0 ? _resp$payload2 : {}; // Trigger table refresh to reload from backend
            setRefreshKey(function (prev) {
              return prev + 1;
            });
            successMsg = (result === null || result === void 0 ? void 0 : result.message) || "Your agent \"".concat(state.agent_name, "\" has been created. Run the agent in Splunk search to start using ML-SPL");
            (0, _ToastUtil.triggerToast)(successMsg, _ToastConstants.TOAST_TYPES.SUCCESS, 'Success');
            setTimeout(function () {
              setShowModal(false);
              setIsSaving(false);
            }, 800);
            _context4.next = 46;
            break;
          case 40:
            _context4.prev = 40;
            _context4.t0 = _context4["catch"](2);
            _msg = (_context4.t0 === null || _context4.t0 === void 0 ? void 0 : _context4.t0.message) || 'Failed to create agent';
            setError(_msg);
            (0, _ToastUtil.triggerToast)(_msg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
          case 46:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[2, 40]]);
    })), [state, mcpToolsSelections, llmConfigVisible, advancedVisible]);
    var handleUpdate = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var _resp$payload3, name, alphaNum, _validateAgent2, ok, fe, payload, resp, errMsg, result, successMsg, msg;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            setIsSaving(true);
            setError('');
            _context5.prev = 2;
            name = String((state === null || state === void 0 ? void 0 : state.agent_name) || '').trim();
            alphaNum = /^[A-Za-z0-9]+$/;
            if (alphaNum.test(name)) {
              _context5.next = 10;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                agent_name: 'Use only letters and numbers (no spaces or special characters)'
              });
            });
            (0, _ToastUtil.triggerToast)('Please fix the validation errors', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context5.abrupt("return");
          case 10:
            if (!(name.length > 256)) {
              _context5.next = 15;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                agent_name: 'Maximum 256 characters'
              });
            });
            (0, _ToastUtil.triggerToast)('Please fix the validation errors', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context5.abrupt("return");
          case 15:
            _validateAgent2 = (0, _validate.validateAgent)(state), ok = _validateAgent2.ok, fe = _validateAgent2.fieldErrors;
            if (ok) {
              _context5.next = 21;
              break;
            }
            setFieldErrors(fe || {});
            (0, _ToastUtil.triggerToast)('Please fix the validation errors', _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context5.abrupt("return");
          case 21:
            setFieldErrors({});

            // Build payload using utility function
            payload = (0, _utils.buildUpdateAgentPayload)({
              state: state,
              mcpToolsSelections: mcpToolsSelections,
              llmConfigVisible: llmConfigVisible,
              advancedVisible: advancedVisible
            });
            _context5.next = 25;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.updateAgent, ['', payload], {
              errorMessage: 'Failed to update agent',
              showSuccessToast: false,
              showErrorToast: false
            });
          case 25:
            resp = _context5.sent;
            if ((0, _utils.isApiResponseSuccess)(resp)) {
              _context5.next = 32;
              break;
            }
            errMsg = (0, _utils.getApiErrorMessage)(resp, 'Failed to update agent');
            setError(errMsg);
            (0, _ToastUtil.triggerToast)(errMsg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
            return _context5.abrupt("return");
          case 32:
            result = (_resp$payload3 = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload3 !== void 0 ? _resp$payload3 : {};
            setRefreshKey(function (prev) {
              return prev + 1;
            });
            successMsg = (result === null || result === void 0 ? void 0 : result.message) || "Agent \"".concat(state.agent_name, "\" updated successfully.");
            (0, _ToastUtil.triggerToast)(successMsg, _ToastConstants.TOAST_TYPES.SUCCESS, 'Success');
            setTimeout(function () {
              setShowModal(false);
              setIsSaving(false);
            }, 800);
            _context5.next = 45;
            break;
          case 39:
            _context5.prev = 39;
            _context5.t0 = _context5["catch"](2);
            msg = (_context5.t0 === null || _context5.t0 === void 0 ? void 0 : _context5.t0.message) || 'Failed to update agent';
            setError(msg);
            (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, 'Error');
            setIsSaving(false);
          case 45:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 39]]);
    })), [state, mcpToolsSelections, llmConfigVisible, advancedVisible]);
    var modelsForProvider = state.llmProvider ? modelsByProvider[state.llmProvider] || [] : [];

    // Ensure selected values appear in options when editing
    var effectiveMcpOptions = (0, _react.useMemo)(function () {
      var map = new Map((mcpOptions || []).map(function (o) {
        return [o.value, o];
      }));
      (Array.isArray(state.mcps) ? state.mcps : []).forEach(function (v) {
        if (v && !map.has(v)) map.set(v, {
          label: v,
          value: v
        });
      });
      return Array.from(map.values());
    }, [mcpOptions, state.mcps]);
    var effectiveKbOptions = (0, _react.useMemo)(function () {
      var map = new Map((kbOptions || []).map(function (o) {
        return [o.value, o];
      }));
      (Array.isArray(state.knowledge_bases) ? state.knowledge_bases : []).forEach(function (v) {
        if (v && !map.has(v)) map.set(v, {
          label: v,
          value: v
        });
      });
      return Array.from(map.values());
    }, [kbOptions, state.knowledge_bases]);
    var handleSavePermissions = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var _resp$payload4, raw, v, tools, mcpsArr, kbArr, llmObj, description, enabledFromVersion, aclApp, aclOwner, mapUiRolesToApi, acl, payload, resp, statusCode, result, statusStrOk, httpOk, payloadOk, isSuccess, errMsg, msg;
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
            v = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.versions) && raw.versions.length ? raw.versions[0] : {};
            tools = (v === null || v === void 0 ? void 0 : v.tools) || {};
            mcpsArr = Array.isArray(tools.mcps) ? tools.mcps : [];
            kbArr = Array.isArray(tools.knowledge_bases) ? tools.knowledge_bases : [];
            llmObj = (v === null || v === void 0 ? void 0 : v.llm) || {};
            description = (v === null || v === void 0 ? void 0 : v.description) || (raw === null || raw === void 0 ? void 0 : raw.description) || '';
            enabledFromVersion = function enabledFromVersion(val) {
              if (typeof val === 'string') return val.toLowerCase() === 'true';
              return !!val;
            };
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
            };
            payload = {
              name: permissionsAgent.name,
              description: description,
              system_prompt: (v === null || v === void 0 ? void 0 : v.system_prompt) || '',
              mcps: mcpsArr,
              knowledge_bases: kbArr,
              llm: llmObj,
              is_enabled: enabledFromVersion(v === null || v === void 0 ? void 0 : v.is_enabled),
              acl: acl
            };
            _context6.next = 20;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.updateAgent, ['', payload], {
              errorMessage: 'Failed to update permissions',
              showSuccessToast: false,
              showErrorToast: false
            });
          case 20:
            resp = _context6.sent;
            statusCode = resp === null || resp === void 0 ? void 0 : resp.status;
            result = (_resp$payload4 = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload4 !== void 0 ? _resp$payload4 : {};
            statusStrOk = typeof statusCode === 'string' && statusCode.toLowerCase() === 'success';
            httpOk = statusCode === 200;
            payloadOk = (result === null || result === void 0 ? void 0 : result.success) === true || typeof (result === null || result === void 0 ? void 0 : result.status) === 'string' && result.status.toLowerCase() === 'success';
            isSuccess = httpOk || statusStrOk || payloadOk;
            if (isSuccess) {
              _context6.next = 31;
              break;
            }
            errMsg = (result === null || result === void 0 ? void 0 : result.error_message) || (result === null || result === void 0 ? void 0 : result.message) || (resp === null || resp === void 0 ? void 0 : resp.message) || 'Failed to update permissions';
            setPermissionsError(errMsg);
            return _context6.abrupt("return");
          case 31:
            setRefreshKey(function (prev) {
              return prev + 1;
            });
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Permissions updated successfully'), _ToastConstants.TOAST_TYPES.SUCCESS, 'Success');
            setPermissionsOpen(false);
            _context6.next = 40;
            break;
          case 36:
            _context6.prev = 36;
            _context6.t0 = _context6["catch"](2);
            msg = (_context6.t0 === null || _context6.t0 === void 0 ? void 0 : _context6.t0.message) || 'Failed to update permissions';
            setPermissionsError(msg);
          case 40:
            _context6.prev = 40;
            setPermissionsLoading(false);
            return _context6.finish(40);
          case 43:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[2, 36, 40, 43]]);
    })), [permissionsAgent, permissionsDisplayFor, permissionsReadRoles, permissionsWriteRoles]);
    if (featureEnabled === null) {
      return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Agents.Container, null, /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
        position: "top-center"
      }), /*#__PURE__*/_react.default.createElement(_Agents.LoadingMessage, null, (0, _i18n.gettext)('Loading…'))));
    }
    if (!featureEnabled) {
      return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Agents.Container, null, /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
        position: "top-center"
      }), /*#__PURE__*/_react.default.createElement(_Agents.DisabledAccessMessage, null, (0, _i18n.gettext)('Access to this connection is disabled. Please check your permissions.'))));
    }
    return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Agents.MultiselectFilterStyles, null), /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
      position: "top-center"
    }), /*#__PURE__*/_react.default.createElement(_Header.default, {
      onOpenAdd: onOpenAdd,
      onOwnerFilterChange: setOwnerFilter,
      onPageNumChange: handlePageNumChange,
      onSearchChange: setSearchTerm,
      ownerFilter: ownerFilter,
      ownerOptions: ownerOptions,
      pageNum: pageNum,
      searchTerm: searchTerm,
      totalPages: totalPages
    }), /*#__PURE__*/_react.default.createElement(_Body.default, {
      onAgentsChange: setAgents,
      onDelete: handleDeleteRequest,
      onEdit: onEditRow,
      onEditPermissions: openPermissionsForAgent,
      onOwnerOptionsChange: setOwnerOptions,
      ownerFilter: ownerFilter,
      pageNum: pageNum,
      refreshKey: refreshKey,
      searchTerm: searchTerm
    }), showModal && !isEdit && /*#__PURE__*/_react.default.createElement(_AgentCreateModal.default, {
      advancedVisible: advancedVisible,
      aiCommanderConfig: aiCommanderConfig,
      effectiveKbOptions: effectiveKbOptions,
      effectiveMcpOptions: effectiveMcpOptions,
      error: error,
      fieldErrors: fieldErrors,
      isSaving: isSaving,
      llmConfigVisible: llmConfigVisible,
      llmProviders: llmProviders,
      mcpToolsSelections: mcpToolsSelections,
      modelsByProvider: modelsByProvider,
      modelsForProvider: modelsForProvider,
      onCreate: handleCreate,
      onRequestClose: function onRequestClose(_ref7) {
        var event = _ref7.event,
          reason = _ref7.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowModal(false);
      },
      open: showModal,
      setAdvancedVisible: setAdvancedVisible,
      setFieldErrors: setFieldErrors,
      setLlmConfigVisible: setLlmConfigVisible,
      setMcpToolsSelections: setMcpToolsSelections,
      setState: setState,
      state: state
    }), showModal && isEdit && /*#__PURE__*/_react.default.createElement(_AgentEditModal.default, {
      advancedVisible: advancedVisible,
      aiCommanderConfig: aiCommanderConfig,
      effectiveKbOptions: effectiveKbOptions,
      effectiveMcpOptions: effectiveMcpOptions,
      error: error,
      fieldErrors: fieldErrors,
      isSaving: isSaving,
      llmConfigVisible: llmConfigVisible,
      llmProviders: llmProviders,
      mcpToolsSelections: mcpToolsSelections,
      modelsByProvider: modelsByProvider,
      modelsForProvider: modelsForProvider,
      onRequestClose: function onRequestClose(_ref8) {
        var event = _ref8.event,
          reason = _ref8.reason;
        if (reason === 'clickAway') {
          return;
        }
        setShowModal(false);
      },
      onUpdate: handleUpdate,
      open: showModal,
      setAdvancedVisible: setAdvancedVisible,
      setFieldErrors: setFieldErrors,
      setLlmConfigVisible: setLlmConfigVisible,
      setMcpToolsSelections: setMcpToolsSelections,
      setState: setState,
      state: state
    }), permissionsOpen && /*#__PURE__*/_react.default.createElement(_AgentPermissionsModal.default, {
      onRequestClose: function onRequestClose(_ref9) {
        var event = _ref9.event,
          reason = _ref9.reason;
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
    }), deleteModalOpen && /*#__PURE__*/_react.default.createElement(_AgentDeleteModal.default, {
      agentName: deleteAgent === null || deleteAgent === void 0 ? void 0 : deleteAgent.name,
      isDeleting: isDeleting,
      onConfirm: handleConfirmDelete,
      onRequestClose: function onRequestClose() {
        return setDeleteModalOpen(false);
      },
      open: deleteModalOpen
    }));
  };
  var _default = _exports.default = AgentsPage;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/Body/Body.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-icons/DotsThreeVertical.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/@splunk/react-ui/DefinitionList.js"), __webpack_require__("./src/main/webapp/components/agents/Body/Body.styles.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/agentConnections/utils/ResponseHandlerUtil.jsx"), __webpack_require__("./src/main/webapp/components/agents/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayJoin, _esArrayMap, _esArraySlice, _esArraySort, _esFunctionName, _esObjectKeys, _esObjectToString, _esRegexpToString, _esSet, _esStringIncludes, _esStringIterator, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsIterator, _react, _propTypes, _i18n, _Button, _Dropdown, _Menu, _MoreVertical, _Modal, _DefinitionList, _Body, _Agents, _AgentBuilderApi, _ResponseHandlerUtil, _constants) {
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
  _Modal = _interopRequireDefault(_Modal);
  _DefinitionList = _interopRequireDefault(_DefinitionList);
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
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var Body = function Body(_ref) {
    var _rowToDelete$row2;
    var onAgentsChange = _ref.onAgentsChange,
      onDelete = _ref.onDelete,
      onEdit = _ref.onEdit,
      onEditPermissions = _ref.onEditPermissions,
      onOwnerOptionsChange = _ref.onOwnerOptionsChange,
      ownerFilter = _ref.ownerFilter,
      pageNum = _ref.pageNum,
      refreshKey = _ref.refreshKey,
      searchTerm = _ref.searchTerm;
    var _useState = (0, _react.useState)('name'),
      _useState2 = _slicedToArray(_useState, 2),
      sortKey = _useState2[0],
      setSortKey = _useState2[1];
    var _useState3 = (0, _react.useState)('asc'),
      _useState4 = _slicedToArray(_useState3, 2),
      sortDir = _useState4[0],
      setSortDir = _useState4[1];
    var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      agents = _useState6[0],
      setAgents = _useState6[1];
    var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      confirmOpen = _useState8[0],
      setConfirmOpen = _useState8[1];
    var _useState9 = (0, _react.useState)(null),
      _useState10 = _slicedToArray(_useState9, 2),
      rowToDelete = _useState10[0],
      setRowToDelete = _useState10[1];
    var _useState11 = (0, _react.useState)(''),
      _useState12 = _slicedToArray(_useState11, 2),
      deleteError = _useState12[0],
      setDeleteError = _useState12[1];
    var _useState13 = (0, _react.useState)(true),
      _useState14 = _slicedToArray(_useState13, 2),
      isLoading = _useState14[0],
      setIsLoading = _useState14[1];

    // Fetch agents list from backend and normalize for table display
    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _resp$payload, resp, payload, items, rows, uniqueOwners;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setIsLoading(true);
              _context.prev = 1;
              _context.next = 4;
              return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.getAgentsList, ['', null], {
                errorMessage: 'Failed to fetch agents',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 4:
              resp = _context.sent;
              payload = (_resp$payload = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload !== void 0 ? _resp$payload : resp;
              items = Array.isArray(payload === null || payload === void 0 ? void 0 : payload.agents) ? payload.agents : payload;
              rows = (items || []).map(function (a) {
                var _v$tools, _v$tools2, _v$llm, _v$llm2, _v$llm$response_varia, _v$llm3, _v$llm$max_tokens, _v$llm4, _v$llm$maximum_result, _v$llm5, _v$agent_timeout;
                var v = Array.isArray(a === null || a === void 0 ? void 0 : a.versions) && a.versions.length ? a.versions[0] : {};
                var mcpsArr = Array.isArray(v === null || v === void 0 ? void 0 : (_v$tools = v.tools) === null || _v$tools === void 0 ? void 0 : _v$tools.mcps) ? v.tools.mcps : [];
                var kbsArr = Array.isArray(v === null || v === void 0 ? void 0 : (_v$tools2 = v.tools) === null || _v$tools2 === void 0 ? void 0 : _v$tools2.knowledge_bases) ? v.tools.knowledge_bases : [];
                var mcpsNames = mcpsArr.map(function (m) {
                  return typeof m === 'string' ? m : m && m.name || '';
                }).filter(Boolean);
                var kbNames = kbsArr.map(function (k) {
                  return typeof k === 'string' ? k : k && k.name || '';
                }).filter(Boolean);
                var llmProvider = (v === null || v === void 0 ? void 0 : (_v$llm = v.llm) === null || _v$llm === void 0 ? void 0 : _v$llm.provider) || '';
                var llmModel = (v === null || v === void 0 ? void 0 : (_v$llm2 = v.llm) === null || _v$llm2 === void 0 ? void 0 : _v$llm2.model) || '';

                // Handle display for Splunk_Default
                var llmDisplay = '-';
                if (llmProvider === 'Splunk_Default' && llmModel === '') {
                  llmDisplay = 'global.anthropic.claude-sonnet-4-5-20250929-v1:0';
                } else if (llmProvider && llmModel) {
                  llmDisplay = "".concat(llmProvider, " ").concat(llmModel);
                }
                var respVar = (_v$llm$response_varia = v === null || v === void 0 ? void 0 : (_v$llm3 = v.llm) === null || _v$llm3 === void 0 ? void 0 : _v$llm3.response_variability) !== null && _v$llm$response_varia !== void 0 ? _v$llm$response_varia : '';
                var maxTok = (_v$llm$max_tokens = v === null || v === void 0 ? void 0 : (_v$llm4 = v.llm) === null || _v$llm4 === void 0 ? void 0 : _v$llm4.max_tokens) !== null && _v$llm$max_tokens !== void 0 ? _v$llm$max_tokens : '';
                var maxRows = (_v$llm$maximum_result = v === null || v === void 0 ? void 0 : (_v$llm5 = v.llm) === null || _v$llm5 === void 0 ? void 0 : _v$llm5.maximum_result_rows) !== null && _v$llm$maximum_result !== void 0 ? _v$llm$maximum_result : '';
                var timeout = (_v$agent_timeout = v === null || v === void 0 ? void 0 : v.agent_timeout) !== null && _v$agent_timeout !== void 0 ? _v$agent_timeout : '';
                var acl = (v === null || v === void 0 ? void 0 : v.acl) || {};
                var app = acl.app || 'SPLUNK_ML_TOOLKIT';
                var sharing = acl.sharing || 'owner';
                var sharingLabel;
                if (sharing === 'owner') sharingLabel = (0, _i18n.gettext)('Private');else sharingLabel = (0, _i18n.gettext)('App');
                return {
                  name: (a === null || a === void 0 ? void 0 : a.agent_name) || '-',
                  status: (v === null || v === void 0 ? void 0 : v.state) || '-',
                  owner: acl.owner || '-',
                  description: (a === null || a === void 0 ? void 0 : a.description) || (v === null || v === void 0 ? void 0 : v.description) || '',
                  app: app,
                  sharing: sharing,
                  sharingLabel: sharingLabel,
                  mcp_selected: mcpsNames.length ? mcpsNames.join(', ') : '-',
                  kb_selected: kbNames.length ? kbNames.join(', ') : '-',
                  llm_selected: llmDisplay,
                  agent_prompt: (v === null || v === void 0 ? void 0 : v.system_prompt) || '-',
                  response_variability: respVar,
                  max_tokens: maxTok,
                  maximum_result_rows: maxRows,
                  agent_timeout: timeout,
                  // raw values for edit prefill
                  mcpsRaw: mcpsNames,
                  kbsRaw: kbNames,
                  llmProviderRaw: llmProvider,
                  llmModelRaw: llmModel,
                  _raw: a
                };
              });
              if (mounted) {
                setAgents(rows);
                if (onAgentsChange) {
                  onAgentsChange(rows);
                }
                // Extract unique owners for filter dropdown
                uniqueOwners = Array.from(new Set(rows.map(function (r) {
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
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);
              if (mounted) setAgents([]);
            case 14:
              _context.prev = 14;
              if (mounted) setIsLoading(false);
              return _context.finish(14);
            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 11, 14, 17]]);
      }))();
      return function () {
        mounted = false;
      };
    }, [refreshKey]);
    var filteredAgents = (0, _react.useMemo)(function () {
      var q = (searchTerm || '').toLowerCase();
      var owner = (ownerFilter || '').toLowerCase();
      if (!q && !owner) return agents;
      return (agents || []).filter(function (r) {
        var matchesSearch = !q || ((r === null || r === void 0 ? void 0 : r.name) || '').toString().toLowerCase().includes(q);
        var matchesOwner = !owner || ((r === null || r === void 0 ? void 0 : r.owner) || '').toLowerCase().includes(owner);
        return matchesSearch && matchesOwner;
      });
    }, [agents, searchTerm, ownerFilter]);
    var sortedAgents = (0, _react.useMemo)(function () {
      if (!filteredAgents || filteredAgents.length === 0) return [];
      var sorted = _toConsumableArray(filteredAgents).sort(function (a, b) {
        try {
          var aVal = '';
          var bVal = '';
          switch (sortKey) {
            case 'name':
              aVal = (a === null || a === void 0 ? void 0 : a.name) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.name) || '';
              break;
            case 'owner':
              aVal = (a === null || a === void 0 ? void 0 : a.owner) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.owner) || '';
              break;
            case 'app':
              aVal = (a === null || a === void 0 ? void 0 : a.app) || '';
              bVal = (b === null || b === void 0 ? void 0 : b.app) || '';
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
          // Fallback: keep original order on sort error
          return 0;
        }
      });
      return sorted;
    }, [filteredAgents, sortKey, sortDir]);
    var visibleRows = (0, _react.useMemo)(function () {
      var safePage = Math.max(1, pageNum || 1);
      var start = (safePage - 1) * _constants.ROWS;
      var end = Math.min(sortedAgents.length, safePage * _constants.ROWS);
      return sortedAgents.slice(start, end);
    }, [sortedAgents, pageNum]);
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
    var handleEditClick = (0, _react.useCallback)(function (row, index) {
      if (onEdit) onEdit(row, index);
    }, [onEdit]);
    var handleViewRunHistory = (0, _react.useCallback)(function (row, index) {
      var agentName = row.name;
      if (agentName) {
        // Navigate to agent run history page with agent as query parameter
        window.location.href = "/app/Splunk_ML_Toolkit/agent_run_history?agent=".concat(encodeURIComponent(agentName));
      }
    }, []);
    var handleDeleteClick = (0, _react.useCallback)(function (row, index) {
      setRowToDelete({
        row: row,
        index: index
      });
      setDeleteError('');
      setConfirmOpen(true);
    }, []);
    var confirmDelete = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _rowToDelete$row, name, resp, ok, _listResp$payload, listResp, payload, items, rows, backendMsg, parsed, err, _err;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            name = rowToDelete === null || rowToDelete === void 0 ? void 0 : (_rowToDelete$row = rowToDelete.row) === null || _rowToDelete$row === void 0 ? void 0 : _rowToDelete$row.name;
            if (name) {
              _context2.next = 4;
              break;
            }
            return _context2.abrupt("return");
          case 4:
            _context2.next = 6;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.deleteAgents, ["/".concat(name), null], {
              errorMessage: 'Failed to delete agent',
              showSuccessToast: false,
              showErrorToast: false
            });
          case 6:
            resp = _context2.sent;
            ok = !!resp && (resp.status === 200 || typeof resp.status === 'string' && resp.status.toLowerCase() === 'success' || (resp === null || resp === void 0 ? void 0 : resp.payload) && typeof resp.payload.status === 'string' && resp.payload.status.toLowerCase() === 'success');
            if (!ok) {
              _context2.next = 28;
              break;
            }
            _context2.prev = 9;
            _context2.next = 12;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.getAgentsList, ['', null], {
              errorMessage: 'Failed to fetch agents',
              showSuccessToast: false,
              showErrorToast: false
            });
          case 12:
            listResp = _context2.sent;
            payload = (_listResp$payload = listResp === null || listResp === void 0 ? void 0 : listResp.payload) !== null && _listResp$payload !== void 0 ? _listResp$payload : listResp;
            items = [];
            if (Array.isArray(payload === null || payload === void 0 ? void 0 : payload.agents)) {
              items = payload.agents;
            } else if (Array.isArray(payload)) {
              items = payload;
            }
            rows = (items || []).map(function (a) {
              var _v$tools3, _v$tools4, _v$llm6, _v$llm7, _v$llm$response_varia2, _v$llm8, _v$llm$max_tokens2, _v$llm9, _v$llm$maximum_result2, _v$llm10, _v$agent_timeout2;
              var v = Array.isArray(a === null || a === void 0 ? void 0 : a.versions) && a.versions.length ? a.versions[0] : {};
              var mcpsArr = Array.isArray(v === null || v === void 0 ? void 0 : (_v$tools3 = v.tools) === null || _v$tools3 === void 0 ? void 0 : _v$tools3.mcps) ? v.tools.mcps : [];
              var kbsArr = Array.isArray(v === null || v === void 0 ? void 0 : (_v$tools4 = v.tools) === null || _v$tools4 === void 0 ? void 0 : _v$tools4.knowledge_bases) ? v.tools.knowledge_bases : [];
              var mcpsNames = mcpsArr.map(function (m) {
                return typeof m === 'string' ? m : m && m.name || '';
              }).filter(Boolean);
              var kbNames = kbsArr.map(function (k) {
                return typeof k === 'string' ? k : k && k.name || '';
              }).filter(Boolean);
              var llmProvider = (v === null || v === void 0 ? void 0 : (_v$llm6 = v.llm) === null || _v$llm6 === void 0 ? void 0 : _v$llm6.provider) || '';
              var llmModel = (v === null || v === void 0 ? void 0 : (_v$llm7 = v.llm) === null || _v$llm7 === void 0 ? void 0 : _v$llm7.model) || '';

              // Handle display for Splunk_Default in export
              var llmDisplay = '-';
              if (llmProvider === 'Splunk_Default' && llmModel === '') {
                llmDisplay = 'global.anthropic.claude-sonnet-4-5-20250929-v1:0';
              } else if (llmProvider && llmModel) {
                llmDisplay = "".concat(llmProvider, " ").concat(llmModel);
              }
              var respVar = (_v$llm$response_varia2 = v === null || v === void 0 ? void 0 : (_v$llm8 = v.llm) === null || _v$llm8 === void 0 ? void 0 : _v$llm8.response_variability) !== null && _v$llm$response_varia2 !== void 0 ? _v$llm$response_varia2 : '';
              var maxTok = (_v$llm$max_tokens2 = v === null || v === void 0 ? void 0 : (_v$llm9 = v.llm) === null || _v$llm9 === void 0 ? void 0 : _v$llm9.max_tokens) !== null && _v$llm$max_tokens2 !== void 0 ? _v$llm$max_tokens2 : '';
              var maxRows = (_v$llm$maximum_result2 = v === null || v === void 0 ? void 0 : (_v$llm10 = v.llm) === null || _v$llm10 === void 0 ? void 0 : _v$llm10.maximum_result_rows) !== null && _v$llm$maximum_result2 !== void 0 ? _v$llm$maximum_result2 : '';
              var timeout = (_v$agent_timeout2 = v === null || v === void 0 ? void 0 : v.agent_timeout) !== null && _v$agent_timeout2 !== void 0 ? _v$agent_timeout2 : '';
              var acl = (v === null || v === void 0 ? void 0 : v.acl) || {};
              var app = acl.app || 'SPLUNK_ML_TOOLKIT';
              var sharing = acl.sharing || 'owner';
              var sharingLabel;
              if (sharing === 'owner') sharingLabel = (0, _i18n.gettext)('Private');else sharingLabel = (0, _i18n.gettext)('App');
              return {
                name: (a === null || a === void 0 ? void 0 : a.agent_name) || '-',
                status: (v === null || v === void 0 ? void 0 : v.state) || '-',
                owner: acl.owner || '-',
                description: (a === null || a === void 0 ? void 0 : a.description) || (v === null || v === void 0 ? void 0 : v.description) || '',
                app: app,
                sharing: sharing,
                sharingLabel: sharingLabel,
                mcp_selected: mcpsNames.length ? mcpsNames.join(', ') : '-',
                kb_selected: kbNames.length ? kbNames.join(', ') : '-',
                llm_selected: llmDisplay,
                agent_prompt: (v === null || v === void 0 ? void 0 : v.system_prompt) || '-',
                response_variability: respVar,
                max_tokens: maxTok,
                maximum_result_rows: maxRows,
                agent_timeout: timeout,
                mcpsRaw: mcpsNames,
                kbsRaw: kbNames,
                llmProviderRaw: llmProvider,
                llmModelRaw: llmModel,
                _raw: a
              };
            });
            setAgents(rows);
            _context2.next = 23;
            break;
          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](9);
            setAgents([]);
          case 23:
            setConfirmOpen(false);
            setRowToDelete(null);
            setDeleteError('');
            _context2.next = 32;
            break;
          case 28:
            backendMsg = '';
            try {
              if (typeof resp === 'string') {
                parsed = JSON.parse(resp);
                backendMsg = parsed.error_message || parsed.message || '';
              } else if (resp !== null && resp !== void 0 && resp.payload) {
                backendMsg = resp.payload.error_message || resp.payload.message || '';
              } else {
                backendMsg = (resp === null || resp === void 0 ? void 0 : resp.error_message) || (resp === null || resp === void 0 ? void 0 : resp.message) || '';
              }
            } catch (_) {
              // Ignore JSON parse errors and fall back to generic message
            }
            err = backendMsg || 'Failed to delete agent';
            setDeleteError(err);
          case 32:
            _context2.next = 38;
            break;
          case 34:
            _context2.prev = 34;
            _context2.t1 = _context2["catch"](0);
            _err = (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.message) || 'Failed to delete agent';
            setDeleteError(_err);
          case 38:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 34], [9, 20]]);
    })), [rowToDelete]);
    var cancelDelete = (0, _react.useCallback)(function () {
      setConfirmOpen(false);
      setRowToDelete(null);
      setDeleteError('');
    }, []);
    var formatStatus = (0, _react.useCallback)(function (val) {
      var s = (val || '-').toString();
      if (s === '-') return s;
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }, []);
    var getExpansionRow = function getExpansionRow(row, rowBg) {
      return /*#__PURE__*/_react.default.createElement(_Body.Table.Row, {
        key: "".concat(row.name, "-expansion")
      }, /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        colSpan: 6
      }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('MCP')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.mcp_selected || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Knowledge base')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.kb_selected || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('LLM / Model')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.llm_selected || (0, _i18n.gettext)('-')), (row.response_variability !== '' || row.max_tokens !== '' || row.maximum_result_rows !== '' || row.agent_timeout !== '') && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Advanced options')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, /*#__PURE__*/_react.default.createElement("div", null, row.response_variability !== '' && /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Response variability:'), ' ', row.response_variability), row.max_tokens !== '' && /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Max tokens:'), " ", row.max_tokens), row.maximum_result_rows !== '' && /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Maximum result rows:'), ' ', row.maximum_result_rows), row.agent_timeout !== '' && /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Agent Timeout:'), " ", row.agent_timeout)))), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Agent prompt')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, row.agent_prompt || (0, _i18n.gettext)('-')))));
    };
    return /*#__PURE__*/_react.default.createElement(_Body.Container, null, isLoading ? /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '16px',
        color: '#6b6b6b'
      }
    }, (0, _i18n.gettext)('Loading...')) : /*#__PURE__*/_react.default.createElement(_Body.BackgroundWhiteDiv, null, /*#__PURE__*/_react.default.createElement(_Body.Table, {
      "data-test": "Agents_Table",
      rowExpansion: "single"
    }, /*#__PURE__*/_react.default.createElement(_Body.Table.Head, null, _constants.COLUMNNAMES.map(function (col, index) {
      if (index === 0) {
        // Agent Name column
        return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
          key: col,
          onSort: handleSort,
          sortDir: sortKey === 'name' ? sortDir : 'none',
          sortKey: "name"
        }, col);
      }
      if (index === 2) {
        // Owner column
        return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
          key: col,
          onSort: handleSort,
          sortDir: sortKey === 'owner' ? sortDir : 'none',
          sortKey: "owner"
        }, col);
      }
      if (index === 3) {
        // Sharing column
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
    })), /*#__PURE__*/_react.default.createElement(_Body.Table.Body, null, visibleRows.map(function (row, index) {
      var rowBg = index % 2 === 0 ? '#ffffff' : '#f1f3f6';
      return /*#__PURE__*/_react.default.createElement(_Body.Table.Row, {
        key: "agent-row-".concat(row.name || 'row'),
        expansionRow: getExpansionRow(row, rowBg),
        style: {
          backgroundColor: rowBg
        }
      }, /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        style: {
          backgroundColor: rowBg
        }
      }, row.name || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        style: {
          backgroundColor: rowBg
        }
      }, row.status ? formatStatus(row.status) : (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        style: {
          backgroundColor: rowBg
        }
      }, row.owner || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        style: {
          backgroundColor: rowBg
        }
      }, onEditPermissions ? /*#__PURE__*/_react.default.createElement(_Body.LinkSpan, {
        onClick: function onClick() {
          return onEditPermissions(row);
        }
      }, row.sharingLabel) : row.sharingLabel), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg,
        style: {
          backgroundColor: rowBg
        }
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
          return handleEditClick(row, index);
        }
      }, _constants.EDIT), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return handleViewRunHistory(row, index);
        }
      }, _constants.VIEW_HISTORY), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return handleDeleteClick(row, index);
        }
      }, _constants.DELETE)))));
    })))), confirmOpen && /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: cancelDelete,
      open: true,
      style: {
        maxWidth: '520px',
        width: '520px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Agents.AgentModalHeader, {
      onRequestClose: cancelDelete,
      title: (0, _i18n.gettext)('Delete agent')
    }), /*#__PURE__*/_react.default.createElement(_Agents.AgentModalBody, null, (0, _i18n.gettext)('Are you sure you would like to delete'), " ", rowToDelete === null || rowToDelete === void 0 ? void 0 : (_rowToDelete$row2 = rowToDelete.row) === null || _rowToDelete$row2 === void 0 ? void 0 : _rowToDelete$row2.name, (0, _i18n.gettext)('? This action can not be undone.'), deleteError && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: '#c00000',
        marginTop: 8
      }
    }, deleteError)), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: cancelDelete
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      onClick: confirmDelete,
      style: {
        backgroundColor: '#FF0000',
        color: '#FFFFFF'
      }
    }, (0, _i18n.gettext)('Delete')))));
  };
  var _default = _exports.default = Body;
  Body.propTypes = {
    onDelete: _propTypes.default.func,
    onEdit: _propTypes.default.func,
    onEditPermissions: _propTypes.default.func,
    searchTerm: _propTypes.default.string,
    ownerFilter: _propTypes.default.string,
    refreshKey: _propTypes.default.number,
    onOwnerOptionsChange: _propTypes.default.func,
    pageNum: _propTypes.default.number,
    onAgentsChange: _propTypes.default.func
  };
  Body.defaultProps = {
    onDelete: null,
    onEdit: null,
    onEditPermissions: null,
    searchTerm: '',
    ownerFilter: '',
    refreshKey: 0,
    onOwnerOptionsChange: null,
    pageNum: 1,
    onAgentsChange: null
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/Form/StepAccessLLM.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.number.is-finite.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Multiselect.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./node_modules/@splunk/react-icons/Cross.js"), __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es"), __webpack_require__("./src/main/webapp/components/agentConnections/AgentConnection.styles.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esFunctionName, _esNumberConstructor, _esNumberIsFinite, _esObjectKeys, _esObjectToString, _esPromise, _esRegexpExec, _esSet, _esStringIncludes, _esStringIterator, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _react, _propTypes, _i18n, _styledComponents, _Select, _Multiselect, _Text, _Button, _Dropdown, _Menu, _Typography, _Close, _themes, _AgentConnection, _Agents, _AgentBuilderApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Select = _interopRequireDefault(_Select);
  _Multiselect = _interopRequireDefault(_Multiselect);
  _Text = _interopRequireDefault(_Text);
  _Button = _interopRequireDefault(_Button);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _Typography = _interopRequireDefault(_Typography);
  _Close = _interopRequireDefault(_Close);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4;
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
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var LeftAlignedSelect = (0, _styledComponents.default)(_Select.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    button {\n        text-align: left;\n    }\n"])));
  var OptionPrimaryText = (0, _styledComponents.default)(_Typography.default)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    font-weight: 400;\n"])));
  var OptionTextStack = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    line-height: 1.25;\n"])));
  var OptionSecondaryText = (0, _styledComponents.default)(_Typography.default)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    color: ", ";\n    font-size: 12px;\n    margin-top: 2px;\n"])), _themes.variables.contentColorMuted);
  var serializeLlmOptionValue = function serializeLlmOptionValue(option) {
    return JSON.stringify({
      provider: option.provider || '',
      model: option.model || '',
      connectionName: option.connectionName || ''
    });
  };
  var StepAccessLLM = function StepAccessLLM(_ref) {
    var state = _ref.state,
      setState = _ref.setState,
      _ref$fieldErrors = _ref.fieldErrors,
      fieldErrors = _ref$fieldErrors === void 0 ? {} : _ref$fieldErrors,
      _ref$setFieldErrors = _ref.setFieldErrors,
      setFieldErrors = _ref$setFieldErrors === void 0 ? function () {} : _ref$setFieldErrors,
      mcpOptions = _ref.mcpOptions,
      _ref$mcpToolsSelectio = _ref.mcpToolsSelections,
      mcpToolsSelections = _ref$mcpToolsSelectio === void 0 ? {} : _ref$mcpToolsSelectio,
      _ref$setMcpToolsSelec = _ref.setMcpToolsSelections,
      setMcpToolsSelections = _ref$setMcpToolsSelec === void 0 ? function () {} : _ref$setMcpToolsSelec,
      _ref$setMcpToolsOptio = _ref.setMcpToolsOptionsByName,
      setMcpToolsOptionsByName = _ref$setMcpToolsOptio === void 0 ? function () {} : _ref$setMcpToolsOptio,
      kbOptions = _ref.kbOptions,
      llmProviders = _ref.llmProviders,
      modelsForProvider = _ref.modelsForProvider,
      _ref$modelsByProvider = _ref.modelsByProvider,
      modelsByProvider = _ref$modelsByProvider === void 0 ? {} : _ref$modelsByProvider,
      _ref$llmConfigVisible = _ref.llmConfigVisible,
      llmConfigVisible = _ref$llmConfigVisible === void 0 ? [] : _ref$llmConfigVisible,
      _ref$setLlmConfigVisi = _ref.setLlmConfigVisible,
      setLlmConfigVisible = _ref$setLlmConfigVisi === void 0 ? function () {} : _ref$setLlmConfigVisi,
      _ref$isEdit = _ref.isEdit,
      isEdit = _ref$isEdit === void 0 ? false : _ref$isEdit,
      aiCommanderConfig = _ref.aiCommanderConfig;
    // Cache of tools options per MCP name
    var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      toolsByMcp = _useState2[0],
      setToolsByMcp = _useState2[1]; // { [name]: [{label,value,description}] }
    var _useState3 = (0, _react.useState)(new Set()),
      _useState4 = _slicedToArray(_useState3, 2),
      loadingMcps = _useState4[0],
      setLoadingMcps = _useState4[1]; // Set of MCP names currently loading

    // Track which MCPs have been fetched to avoid re-fetching
    var _useState5 = (0, _react.useState)(new Set()),
      _useState6 = _slicedToArray(_useState5, 2),
      fetchedMcps = _useState6[0],
      setFetchedMcps = _useState6[1];

    // Fetch tools for newly selected MCPs; remove cache for deselected
    (0, _react.useEffect)(function () {
      var isMounted = true;
      var selected = Array.isArray(state.mcps) ? state.mcps : [];

      // Remove deselected MCPs from fetchedMcps so they will be re-fetched when selected again
      var deselected = _toConsumableArray(fetchedMcps).filter(function (name) {
        return !selected.includes(name);
      });
      if (deselected.length > 0) {
        setFetchedMcps(function (prev) {
          var next = new Set(prev);
          deselected.forEach(function (name) {
            return next.delete(name);
          });
          return next;
        });
        // Also clear cached tools for deselected MCPs
        setToolsByMcp(function (prev) {
          var next = _objectSpread({}, prev);
          deselected.forEach(function (name) {
            return delete next[name];
          });
          return next;
        });
      }
      var toFetch = selected.filter(function (name) {
        return !fetchedMcps.has(name);
      });

      // Fetch in parallel
      if (toFetch.length) {
        // Add to loading state
        if (isMounted) {
          setLoadingMcps(function (prev) {
            return new Set([].concat(_toConsumableArray(prev), _toConsumableArray(toFetch)));
          });
        }
        Promise.all(toFetch.map(/*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(name) {
            var _payload$data;
            var resp, status, payload, tools, opts;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return (0, _AgentBuilderApi.saveMcpConnections)('/tools', {
                    name: name
                  });
                case 2:
                  resp = _context.sent;
                  status = resp === null || resp === void 0 ? void 0 : resp.status;
                  payload = resp === null || resp === void 0 ? void 0 : resp.payload;
                  tools = status === 200 && payload !== null && payload !== void 0 && payload.success && Array.isArray(payload === null || payload === void 0 ? void 0 : (_payload$data = payload.data) === null || _payload$data === void 0 ? void 0 : _payload$data.tools) ? payload.data.tools : [];
                  opts = tools.map(function (t) {
                    return {
                      label: t.name,
                      value: t.name,
                      description: t.description || ''
                    };
                  });
                  return _context.abrupt("return", {
                    name: name,
                    opts: opts
                  });
                case 8:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        }())).then(function (results) {
          if (!isMounted) return;
          var newToolsByMcp = {};
          var nextOptsByName = {};
          results.forEach(function (_ref3) {
            var name = _ref3.name,
              opts = _ref3.opts;
            newToolsByMcp[name] = opts;
            nextOptsByName[name] = opts.map(function (o) {
              return o.value;
            });
          });
          setToolsByMcp(function (prev) {
            return _objectSpread(_objectSpread({}, prev), newToolsByMcp);
          });
          // Only set selections if not already set (for Edit mode, selections come from backend)
          setMcpToolsSelections(function (prev) {
            var next = _objectSpread({}, prev);
            results.forEach(function (_ref4) {
              var name = _ref4.name,
                opts = _ref4.opts;
              if (!Array.isArray(next[name]) || next[name].length === 0) {
                next[name] = opts.map(function (o) {
                  return o.value;
                });
              }
            });
            return next;
          });
          setMcpToolsOptionsByName(function (prev) {
            return _objectSpread(_objectSpread({}, prev), nextOptsByName);
          });
          setFetchedMcps(function (prev) {
            return new Set([].concat(_toConsumableArray(prev), _toConsumableArray(toFetch)));
          });
          // Remove from loading state
          setLoadingMcps(function (prev) {
            var next = new Set(prev);
            toFetch.forEach(function (name) {
              return next.delete(name);
            });
            return next;
          });
        }).catch(function (error) {
          console.error('Error fetching MCP tools:', error);
          // Remove from loading state even on error
          if (isMounted) {
            setLoadingMcps(function (prev) {
              var next = new Set(prev);
              toFetch.forEach(function (name) {
                return next.delete(name);
              });
              return next;
            });
          }
        });
      }
      return function () {
        isMounted = false;
      };
    }, [state.mcps, fetchedMcps, setMcpToolsSelections, setMcpToolsOptionsByName]);
    var renderToolsForMcp = function renderToolsForMcp(name) {
      var opts = toolsByMcp[name] || [];
      var values = mcpToolsSelections[name] || [];
      var isLoading = loadingMcps.has(name);

      // If we have selected values but no opts yet, we're still loading
      var stillLoading = isLoading || values.length > 0 && opts.length === 0;

      // If opts is empty but we have values, create options from values (without descriptions)
      // This ensures the Multiselect works while waiting for full data
      var effectiveOpts = opts.length > 0 ? opts : values.map(function (v) {
        return {
          label: v,
          value: v,
          description: ''
        };
      });
      return /*#__PURE__*/_react.default.createElement(_Agents.ToolsContainer, {
        key: "tools-".concat(name)
      }, /*#__PURE__*/_react.default.createElement(_Agents.ToolsLabel, null, name, " ", (0, _i18n.gettext)('tools')), /*#__PURE__*/_react.default.createElement(_Multiselect.default, {
        compact: true,
        disabled: stillLoading,
        filter: true,
        onChange: function onChange(e, _ref5) {
          var v = _ref5.values;
          setMcpToolsSelections(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, name, v));
          });
        },
        placeholder: stillLoading ? (0, _i18n.gettext)('Loading...') : (0, _i18n.gettext)('Select tools...'),
        selectAllAppearance: "checkbox",
        values: values
      }, effectiveOpts.map(function (o) {
        return /*#__PURE__*/_react.default.createElement(_Multiselect.default.Option, {
          key: "".concat(name, "-").concat(o.value),
          description: o.description,
          label: o.label,
          value: o.value
        });
      })));
    };
    var providerModelOptions = [];
    (llmProviders || []).forEach(function (provider) {
      var models = modelsByProvider[provider.value] || [];
      models.forEach(function (model) {
        providerModelOptions.push({
          provider: provider.value,
          providerLabel: provider.label,
          model: model.value,
          modelLabel: model.label,
          connectionName: model.connectionName || '',
          responseVariabilityDefault: model.responseVariabilityDefault,
          maxTokensDefault: model.maxTokensDefault
        });
      });
    });
    var selectedLlmOption = providerModelOptions.find(function (opt) {
      return opt.provider === state.llmProvider && opt.model === state.llmModel && (opt.connectionName || '') === (state.llmConnectionName || '');
    }) || providerModelOptions.find(function (opt) {
      return opt.provider === state.llmProvider && opt.model === state.llmModel;
    }) || null;
    var selectedLlmValue = '';
    if (selectedLlmOption) {
      selectedLlmValue = serializeLlmOptionValue(selectedLlmOption);
    } else if (state.llmProvider && state.llmModel) {
      selectedLlmValue = serializeLlmOptionValue({
        provider: state.llmProvider,
        model: state.llmModel,
        connectionName: ''
      });
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, null, (0, _i18n.gettext)('MCP servers')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Multiselect.default, {
      compact: true,
      disabled: isEdit,
      inline: true,
      onChange: function onChange(e, _ref6) {
        var values = _ref6.values;
        if (isEdit) return;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            mcps: values
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.mcps) setFieldErrors(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            mcps: undefined
          });
        });
      },
      placeholder: (0, _i18n.gettext)('Select MCP servers...'),
      selectAllAppearance: "checkbox",
      values: Array.isArray(state.mcps) ? state.mcps : []
    }, mcpOptions.map(function (o) {
      return /*#__PURE__*/_react.default.createElement(_Multiselect.default.Option, {
        key: o.value,
        label: o.label,
        value: o.value
      });
    })), /*#__PURE__*/_react.default.createElement(_Agents.FieldDescription, null, (0, _i18n.gettext)('Select which connections your agent can access. View connection details on the agent connections page.')), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.mcps) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.mcps), (state.mcps || []).length > 0 && /*#__PURE__*/_react.default.createElement(_Agents.ToolsWrapper, null, (state.mcps || []).map(function (name) {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: name
      }, renderToolsForMcp(name));
    }))))), /*#__PURE__*/_react.default.createElement(_Agents.KnowledgeBasesSection, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, null, (0, _i18n.gettext)('Knowledge bases')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Multiselect.default, {
      compact: true,
      disabled: isEdit,
      inline: true,
      onChange: function onChange(e, _ref7) {
        var values = _ref7.values;
        if (isEdit) return;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            knowledge_bases: values
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.knowledge_bases) setFieldErrors(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            knowledge_bases: undefined
          });
        });
      },
      placeholder: (0, _i18n.gettext)('Select knowledge bases...')
    }, kbOptions.map(function (o) {
      return /*#__PURE__*/_react.default.createElement(_Multiselect.default.Option, {
        key: o.value,
        label: o.label,
        value: o.value
      });
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.knowledge_bases) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.knowledge_bases))))), /*#__PURE__*/_react.default.createElement(_Agents.LLMSection, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, {
      "data-required": "true"
    }, (0, _i18n.gettext)('LLM')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(LeftAlignedSelect, {
      filter: true,
      onChange: function onChange(e, _ref8) {
        var _option$responseVaria, _option$maxTokensDefa;
        var value = _ref8.value;
        if (!value) {
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, {
              llmProvider: '',
              llmModel: '',
              llmConnectionName: ''
            });
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.llmProvider || fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.llmModel) {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                llmProvider: undefined,
                llmModel: undefined
              });
            });
          }
          return;
        }
        var parsedValue = JSON.parse(String(value));
        var provider = parsedValue.provider || '';
        var model = parsedValue.model || '';
        var connectionName = parsedValue.connectionName || '';
        var option = providerModelOptions.find(function (opt) {
          return opt.provider === provider && opt.model === model && (opt.connectionName || '') === connectionName;
        });
        var newResponseVariability = String((_option$responseVaria = option === null || option === void 0 ? void 0 : option.responseVariabilityDefault) !== null && _option$responseVaria !== void 0 ? _option$responseVaria : '0.7');
        var newMaxTokens = String((_option$maxTokensDefa = option === null || option === void 0 ? void 0 : option.maxTokensDefault) !== null && _option$maxTokensDefa !== void 0 ? _option$maxTokensDefa : '4096');
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            llmProvider: provider,
            llmModel: model,
            llmConnectionName: connectionName,
            response_variability: newResponseVariability,
            max_tokens: newMaxTokens
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.llmProvider || fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.llmModel) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              llmProvider: undefined,
              llmModel: undefined
            });
          });
        }
      },
      value: selectedLlmValue
    }, function () {
      var items = [];
      providerModelOptions.forEach(function (opt) {
        if (opt.provider === 'Default') {
          items.push(/*#__PURE__*/_react.default.createElement(_Select.default.Heading, {
            key: "".concat(opt.provider, "__heading")
          }, (0, _i18n.gettext)(opt.providerLabel)));
        }
        items.push(/*#__PURE__*/_react.default.createElement(_Select.default.Option, {
          key: serializeLlmOptionValue(opt),
          label: opt.provider === 'Default' || !opt.connectionName ? opt.modelLabel : "".concat(opt.connectionName, " ").concat(opt.modelLabel),
          value: serializeLlmOptionValue(opt)
        }, opt.provider === 'Default' || !opt.connectionName ? /*#__PURE__*/_react.default.createElement(OptionPrimaryText, null, opt.modelLabel) : /*#__PURE__*/_react.default.createElement(OptionTextStack, null, /*#__PURE__*/_react.default.createElement(OptionPrimaryText, null, opt.connectionName), /*#__PURE__*/_react.default.createElement(OptionSecondaryText, null, opt.modelLabel))));
      });
      return items;
    }()), !isEdit && /*#__PURE__*/_react.default.createElement(_Agents.FieldDescription, null, (0, _i18n.gettext)('Select the large language model that your agent will use.')), ((fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.llmProvider) || (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.llmModel)) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.llmProvider || fieldErrors.llmModel))), state.llmModel && !(llmConfigVisible.includes('response_variability') && llmConfigVisible.includes('max_tokens')) && /*#__PURE__*/_react.default.createElement(_Agents.AddConfigDropdown, null, /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
        appearance: "secondary",
        isMenu: true,
        label: (0, _i18n.gettext)('+ Add LLM configuration')
      })
    }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, !llmConfigVisible.includes('response_variability') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        var _selectedLlmOption$re, _modelCfg$LLMTempera;
        var providerCfg = aiCommanderConfig === null || aiCommanderConfig === void 0 ? void 0 : aiCommanderConfig[state.llmProvider];
        var modelsSection = providerCfg && providerCfg.models;
        var modelCfg = modelsSection && state.llmModel ? modelsSection[state.llmModel] : null;
        var defVal = (_selectedLlmOption$re = selectedLlmOption === null || selectedLlmOption === void 0 ? void 0 : selectedLlmOption.responseVariabilityDefault) !== null && _selectedLlmOption$re !== void 0 ? _selectedLlmOption$re : modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$LLMTempera = modelCfg['LLM temperature']) === null || _modelCfg$LLMTempera === void 0 ? void 0 : _modelCfg$LLMTempera.value;
        setState(function (s) {
          var next = s.response_variability;

          // If field already has a value (from provider selection), keep it
          if (next !== '' && next !== undefined && next !== null) {
            // Keep existing value (including Splunk_Default defaults)
          } else if (defVal !== undefined && defVal !== null) {
            next = String(defVal);
          } else if (state.llmProvider === 'Default' && state.llmModel === 'Splunk_Default') {
            next = '0.7';
          } else {
            next = '';
          }
          return _objectSpread(_objectSpread({}, s), {}, {
            response_variability: next
          });
        });
        setLlmConfigVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['response_variability']);
        });
      }
    }, (0, _i18n.gettext)('LLM temperature')), !llmConfigVisible.includes('max_tokens') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        var _selectedLlmOption$ma, _modelCfg$max_tokens;
        var providerCfg = aiCommanderConfig === null || aiCommanderConfig === void 0 ? void 0 : aiCommanderConfig[state.llmProvider];
        var modelsSection = providerCfg && providerCfg.models;
        var modelCfg = modelsSection && state.llmModel ? modelsSection[state.llmModel] : null;
        var defVal = (_selectedLlmOption$ma = selectedLlmOption === null || selectedLlmOption === void 0 ? void 0 : selectedLlmOption.maxTokensDefault) !== null && _selectedLlmOption$ma !== void 0 ? _selectedLlmOption$ma : modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$max_tokens = modelCfg.max_tokens) === null || _modelCfg$max_tokens === void 0 ? void 0 : _modelCfg$max_tokens.value;
        setState(function (s) {
          var next = s.max_tokens;

          // If field already has a value (from provider selection), keep it
          if (next !== '' && next !== undefined && next !== null) {
            // Keep existing value (including Splunk_Default defaults)
          } else if (defVal !== undefined && defVal !== null) {
            next = String(defVal);
          } else if (state.llmProvider === 'Default' && state.llmModel === 'Splunk_Default') {
            next = '4096';
          } else {
            next = '';
          }
          return _objectSpread(_objectSpread({}, s), {}, {
            max_tokens: next
          });
        });
        setLlmConfigVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['max_tokens']);
        });
      }
    }, (0, _i18n.gettext)('Max tokens'))))), llmConfigVisible.includes('response_variability') && /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, null, (0, _i18n.gettext)('LLM temperature')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Agents.InputWithButton, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref9) {
        var value = _ref9.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            response_variability: value
          });
        });
        if (value === '') {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              response_variability: undefined
            });
          });
        } else {
          var n = Number(value);
          if (!Number.isFinite(n) || n < 0 || n > 1) {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                response_variability: 'Enter a value between 0 and 1'
              });
            });
          } else {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                response_variability: undefined
              });
            });
          }
        }
      },
      value: state.response_variability
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setLlmConfigVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'response_variability';
          });
        });
      }
    })), !isEdit && /*#__PURE__*/_react.default.createElement(_Agents.FieldDescription, null, (0, _i18n.gettext)("Temperature affects the randomness of the agent's responses. A lower temperature (0.2) will create more focused output; a higher temperature (1.0) encourages varied output")), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.response_variability) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.response_variability))), llmConfigVisible.includes('max_tokens') && /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, null, (0, _i18n.gettext)('Max Tokens')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Agents.InputWithButton, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref10) {
        var value = _ref10.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            max_tokens: value
          });
        });
        if (value === '') {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              max_tokens: undefined
            });
          });
        } else if (!/^\d+$/.test(String(value))) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              max_tokens: 'Must be an integer'
            });
          });
        } else {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              max_tokens: undefined
            });
          });
        }
      },
      value: state.max_tokens
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setLlmConfigVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'max_tokens';
          });
        });
      }
    })), !isEdit && /*#__PURE__*/_react.default.createElement(_Agents.FieldDescription, null, (0, _i18n.gettext)('The maximum number of tokens the agent will use per invocation.')), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.max_tokens) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.max_tokens)))));
  };
  StepAccessLLM.propTypes = {
    aiCommanderConfig: _propTypes.default.object,
    fieldErrors: _propTypes.default.object,
    isEdit: _propTypes.default.bool,
    kbOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    llmConfigVisible: _propTypes.default.arrayOf(_propTypes.default.string),
    llmProviders: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    mcpOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    mcpToolsSelections: _propTypes.default.object,
    modelsByProvider: _propTypes.default.object,
    modelsForProvider: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string,
      connectionName: _propTypes.default.string
    })),
    setFieldErrors: _propTypes.default.func,
    setLlmConfigVisible: _propTypes.default.func,
    setMcpToolsOptionsByName: _propTypes.default.func,
    setMcpToolsSelections: _propTypes.default.func,
    setState: _propTypes.default.func.isRequired,
    state: _propTypes.default.shape({
      agent_name: _propTypes.default.string,
      description: _propTypes.default.string,
      prompt: _propTypes.default.string,
      knowledge_bases: _propTypes.default.arrayOf(_propTypes.default.string),
      llmConnectionName: _propTypes.default.string,
      llmModel: _propTypes.default.string,
      llmProvider: _propTypes.default.string,
      mcps: _propTypes.default.arrayOf(_propTypes.default.string),
      max_tokens: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      response_variability: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
    }).isRequired
  };
  StepAccessLLM.defaultProps = {
    aiCommanderConfig: null,
    fieldErrors: {},
    isEdit: false,
    llmConfigVisible: [],
    mcpToolsSelections: {},
    modelsByProvider: {},
    modelsForProvider: [],
    setFieldErrors: function setFieldErrors() {},
    setLlmConfigVisible: function setLlmConfigVisible() {},
    setMcpToolsOptionsByName: function setMcpToolsOptionsByName() {},
    setMcpToolsSelections: function setMcpToolsSelections() {}
  };
  var _default = _exports.default = StepAccessLLM;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/Form/StepGeneral.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.replace.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/TextArea.js"), __webpack_require__("./src/main/webapp/components/agentConnections/AgentConnection.styles.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/components/agents/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esRegexpExec, _esStringReplace, _react, _propTypes, _i18n, _Text, _TextArea, _AgentConnection, _Agents, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Text = _interopRequireDefault(_Text);
  _TextArea = _interopRequireDefault(_TextArea);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var StepGeneral = function StepGeneral(_ref) {
    var state = _ref.state,
      setState = _ref.setState,
      _ref$fieldErrors = _ref.fieldErrors,
      fieldErrors = _ref$fieldErrors === void 0 ? {} : _ref$fieldErrors,
      _ref$setFieldErrors = _ref.setFieldErrors,
      setFieldErrors = _ref$setFieldErrors === void 0 ? function () {} : _ref$setFieldErrors,
      _ref$isEdit = _ref.isEdit,
      isEdit = _ref$isEdit === void 0 ? false : _ref$isEdit;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, {
      "data-required": "true"
    }, (0, _i18n.gettext)('Agent title')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      disabled: isEdit,
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        var raw = String(value || '');
        var cleaned = raw.replace(/[^A-Za-z0-9]/g, '');
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            agent_name: cleaned
          });
        });
        if (raw !== cleaned) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_name: (0, _i18n.gettext)('Use only letters and numbers (no spaces or special characters)')
            });
          });
        } else if (cleaned.length > 24) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_name: (0, _i18n.gettext)('Maximum 24 characters allowed')
            });
          });
        } else if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.agent_name) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_name: undefined
            });
          });
        }
      },
      value: state.agent_name
    }), ((fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.agent_name) || state.agent_name && state.agent_name.length > 24) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.agent_name) || (0, _i18n.gettext)('Maximum 24 characters allowed')))), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, null, (0, _i18n.gettext)('Description')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            description: value
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.description) setFieldErrors(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            description: undefined
          });
        });
      },
      value: state.description
    }), /*#__PURE__*/_react.default.createElement(_Agents.FieldDescription, null, (0, _i18n.gettext)('Agents are private by default, adjust sharing permissions in the'), ' ', /*#__PURE__*/_react.default.createElement(_Agents.DescriptionLink, {
      href: _constants.SHARING_PERMISSIONS_LINK,
      rel: "noopener noreferrer",
      target: "_blank"
    }, (0, _i18n.gettext)('agents page'))), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.description) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.description))), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalFormRow, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalLabel, null, (0, _i18n.gettext)('Prompt')), /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Agents.FullWidthTextArea, null, /*#__PURE__*/_react.default.createElement(_TextArea.default, {
      canClear: true,
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            prompt: value
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.prompt) setFieldErrors(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            prompt: undefined
          });
        });
      },
      rowsMax: 4,
      rowsMin: 2,
      value: state.prompt
    })), /*#__PURE__*/_react.default.createElement(_Agents.FieldDescription, null, (0, _i18n.gettext)('Describe what you would like the agent to accomplish. Prompts defined in the prompt input will be used to instruct the agent unless a separate prompt is provided during agent invocation with ML-SPL.')), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.prompt) && /*#__PURE__*/_react.default.createElement(_Agents.FieldError, null, fieldErrors.prompt))));
  };
  var _default = _exports.default = StepGeneral;
  StepGeneral.propTypes = {
    state: _propTypes.default.shape({
      agent_name: _propTypes.default.string,
      description: _propTypes.default.string,
      prompt: _propTypes.default.string,
      is_enabled: _propTypes.default.bool
    }).isRequired,
    setState: _propTypes.default.func.isRequired,
    fieldErrors: _propTypes.default.shape({
      agent_name: _propTypes.default.string,
      description: _propTypes.default.string,
      prompt: _propTypes.default.string
    }),
    setFieldErrors: _propTypes.default.func,
    isEdit: _propTypes.default.bool
  };
  StepGeneral.defaultProps = {
    fieldErrors: {},
    setFieldErrors: function setFieldErrors() {},
    isEdit: false
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/Header/Header.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-icons/Plus.js"), __webpack_require__("./node_modules/@splunk/react-icons/Magnifier.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./src/main/webapp/components/agents/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/agents/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _i18n, _Button, _Plus, _Magnifier, _Select, _Paginator, _Text, _Header, _Header2, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Button = _interopRequireDefault(_Button);
  _Plus = _interopRequireDefault(_Plus);
  _Magnifier = _interopRequireDefault(_Magnifier);
  _Select = _interopRequireDefault(_Select);
  _Paginator = _interopRequireDefault(_Paginator);
  _Text = _interopRequireDefault(_Text);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Header = function Header(_ref) {
    var _ref$onOpenAdd = _ref.onOpenAdd,
      onOpenAdd = _ref$onOpenAdd === void 0 ? function () {} : _ref$onOpenAdd,
      _ref$onOwnerFilterCha = _ref.onOwnerFilterChange,
      onOwnerFilterChange = _ref$onOwnerFilterCha === void 0 ? function () {} : _ref$onOwnerFilterCha,
      _ref$onPageNumChange = _ref.onPageNumChange,
      onPageNumChange = _ref$onPageNumChange === void 0 ? function () {} : _ref$onPageNumChange,
      _ref$onSearchChange = _ref.onSearchChange,
      onSearchChange = _ref$onSearchChange === void 0 ? function () {} : _ref$onSearchChange,
      _ref$ownerFilter = _ref.ownerFilter,
      ownerFilter = _ref$ownerFilter === void 0 ? '' : _ref$ownerFilter,
      _ref$ownerOptions = _ref.ownerOptions,
      ownerOptions = _ref$ownerOptions === void 0 ? [] : _ref$ownerOptions,
      _ref$pageNum = _ref.pageNum,
      pageNum = _ref$pageNum === void 0 ? 1 : _ref$pageNum,
      _ref$searchTerm = _ref.searchTerm,
      searchTerm = _ref$searchTerm === void 0 ? '' : _ref$searchTerm,
      _ref$totalPages = _ref.totalPages,
      totalPages = _ref$totalPages === void 0 ? 1 : _ref$totalPages;
    return /*#__PURE__*/_react.default.createElement(_Header2.HeaderContainerNoBorder, null, /*#__PURE__*/_react.default.createElement(_Header2.HeaderTopRow, null, /*#__PURE__*/_react.default.createElement(_Header.ShowcaseHeaderWrapper, null, /*#__PURE__*/_react.default.createElement(_Header.TitleStyle, null, _constants.TITLE), /*#__PURE__*/_react.default.createElement(_Header2.SubTitleStyle, null, (0, _i18n.gettext)('Configure agentic AI agents. Once configured, agents can be triggered manually via ML-SPL. View the'), ' ', /*#__PURE__*/_react.default.createElement(_Header2.DocumentationLink, {
      href: _constants.DOCUMENTATION_LINK,
      rel: "noopener noreferrer",
      target: "_blank"
    }, (0, _i18n.gettext)('agent builder documentation')), ' ', (0, _i18n.gettext)('to learn more.'))), /*#__PURE__*/_react.default.createElement(_Header2.ButtonWrapper, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      icon: /*#__PURE__*/_react.default.createElement(_Plus.default, null),
      label: _constants.ADD_AGENT_TITLE,
      onClick: function onClick() {
        return onOpenAdd();
      }
    }))), /*#__PURE__*/_react.default.createElement(_Header2.HeaderBottomRow, null, /*#__PURE__*/_react.default.createElement(_Header2.FiltersContainer, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterColumn, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterLabel, null, (0, _i18n.gettext)('Filter')), /*#__PURE__*/_react.default.createElement(_Text.default, {
      appearance: "search",
      "data-test": "Filter_Agents",
      endAdornment: /*#__PURE__*/_react.default.createElement(_Header2.MagnifierIcon, null, /*#__PURE__*/_react.default.createElement(_Magnifier.default, null)),
      inline: true,
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        return onSearchChange(value);
      },
      placeholder: (0, _i18n.gettext)('Filter by agent name'),
      value: searchTerm
    })), /*#__PURE__*/_react.default.createElement(_Header2.FilterColumn, {
      minWidth: 140
    }, /*#__PURE__*/_react.default.createElement(_Header2.FilterLabel, null, (0, _i18n.gettext)('Owner')), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "Agents_Owner",
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
  var _default = _exports.default = Header;
  Header.propTypes = {
    onOpenAdd: _propTypes.default.func,
    searchTerm: _propTypes.default.string,
    onSearchChange: _propTypes.default.func,
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
    onOpenAdd: function onOpenAdd() {},
    searchTerm: '',
    onSearchChange: function onSearchChange() {},
    ownerFilter: '',
    onOwnerFilterChange: function onOwnerFilterChange() {},
    ownerOptions: [],
    pageNum: 1,
    onPageNumChange: function onPageNumChange() {},
    totalPages: 1
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/constants.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VIEW_HISTORY = _exports.TITLE = _exports.SUBTITLE = _exports.SHARING_PERMISSIONS_LINK = _exports.ROWS = _exports.EDIT = _exports.DOCUMENTATION_LINK = _exports.DELETE = _exports.COLUMNNAMES = _exports.ADD_AGENT_TITLE = void 0;
  var TITLE = _exports.TITLE = (0, _i18n.gettext)('Agents');
  var SUBTITLE = _exports.SUBTITLE = (0, _i18n.gettext)('Configure agentic AI agents. Once configured, agents can be triggered manually via ML-SPL. View the agent builder documentation for more information to learn more.');
  var DOCUMENTATION_LINK = _exports.DOCUMENTATION_LINK = 'https://help.splunk.com/en/?resourceId=cc37a9e33-6009-4f48-967f-2be6cee220ac';
  var SHARING_PERMISSIONS_LINK = _exports.SHARING_PERMISSIONS_LINK = 'https://help.splunk.com/en/?resourceId=c4d8f4513-fe97-4038-b6d0-97e447f2ad57';
  var ADD_AGENT_TITLE = _exports.ADD_AGENT_TITLE = (0, _i18n.gettext)(' Agent');
  var COLUMNNAMES = _exports.COLUMNNAMES = [(0, _i18n.gettext)('Agent name'), (0, _i18n.gettext)('Status'), (0, _i18n.gettext)('Owner'), (0, _i18n.gettext)('Sharing'), ''];
  var ROWS = _exports.ROWS = 10;
  var EDIT = _exports.EDIT = (0, _i18n.gettext)('Edit agent');
  var DELETE = _exports.DELETE = (0, _i18n.gettext)('Delete agent');
  var VIEW_HISTORY = _exports.VIEW_HISTORY = (0, _i18n.gettext)('View run history');
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/hooks/index.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/agents/hooks/useAgentOptions.js"), __webpack_require__("./src/main/webapp/components/agents/hooks/useFeatureFlags.js"), __webpack_require__("./src/main/webapp/components/agents/hooks/useLLMConfig.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _useAgentOptions, _useFeatureFlags, _useLLMConfig) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "useAgentOptions", {
    enumerable: true,
    get: function get() {
      return _useAgentOptions.default;
    }
  });
  Object.defineProperty(_exports, "useFeatureFlags", {
    enumerable: true,
    get: function get() {
      return _useFeatureFlags.default;
    }
  });
  Object.defineProperty(_exports, "useLLMConfig", {
    enumerable: true,
    get: function get() {
      return _useLLMConfig.default;
    }
  });
  _useAgentOptions = _interopRequireDefault(_useAgentOptions);
  _useFeatureFlags = _interopRequireDefault(_useFeatureFlags);
  _useLLMConfig = _interopRequireDefault(_useLLMConfig);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/hooks/useAgentOptions.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esArrayIterator, _esArrayMap, _esFunctionName, _esObjectToString, _esPromise, _esStringIterator, _webDomCollectionsIterator, _react, _AgentBuilderApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
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
  /**
   * Custom hook to fetch MCP and KB connection options
   * @returns {{ mcpOptions: Array, kbOptions: Array }}
   */
  var useAgentOptions = function useAgentOptions() {
    var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      mcpOptions = _useState2[0],
      setMcpOptions = _useState2[1];
    var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      kbOptions = _useState4[0],
      setKbOptions = _useState4[1];
    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _mcpResp$payload, _mcpPayload$data, _kbResp$payload, _yield$Promise$all, _yield$Promise$all2, mcpResp, kbResp, mcpPayload, mcpItems, mcpOpts, kbPayload, kbItems, kbOpts;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return Promise.all([(0, _AgentBuilderApi.getMcpConnectionsList)('', null), (0, _AgentBuilderApi.getKbConnectionsList)('', null)]);
            case 3:
              _yield$Promise$all = _context.sent;
              _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
              mcpResp = _yield$Promise$all2[0];
              kbResp = _yield$Promise$all2[1];
              mcpPayload = (_mcpResp$payload = mcpResp === null || mcpResp === void 0 ? void 0 : mcpResp.payload) !== null && _mcpResp$payload !== void 0 ? _mcpResp$payload : mcpResp;
              mcpItems = [];
              if (Array.isArray(mcpPayload)) mcpItems = mcpPayload;else if (Array.isArray(mcpPayload === null || mcpPayload === void 0 ? void 0 : mcpPayload.mcps)) mcpItems = mcpPayload.mcps;else if (Array.isArray(mcpPayload === null || mcpPayload === void 0 ? void 0 : (_mcpPayload$data = mcpPayload.data) === null || _mcpPayload$data === void 0 ? void 0 : _mcpPayload$data.mcps)) mcpItems = mcpPayload.data.mcps;
              mcpOpts = (mcpItems || []).map(function (x) {
                return {
                  name: x === null || x === void 0 ? void 0 : x.name,
                  type: x === null || x === void 0 ? void 0 : x.type
                };
              }).filter(function (x) {
                return !!x.name;
              }).map(function (x) {
                return {
                  label: x.name,
                  value: x.name
                };
              });
              kbPayload = (_kbResp$payload = kbResp === null || kbResp === void 0 ? void 0 : kbResp.payload) !== null && _kbResp$payload !== void 0 ? _kbResp$payload : kbResp;
              kbItems = [];
              if (Array.isArray(kbPayload)) {
                kbItems = kbPayload;
              } else if (Array.isArray(kbPayload === null || kbPayload === void 0 ? void 0 : kbPayload.data)) {
                kbItems = kbPayload.data;
              }
              kbOpts = (kbItems || []).map(function (x) {
                return x === null || x === void 0 ? void 0 : x.name;
              }).filter(Boolean).map(function (name) {
                return {
                  label: name,
                  value: name
                };
              });
              if (mounted) {
                setMcpOptions(mcpOpts);
                setKbOptions(kbOpts);
              }
              _context.next = 21;
              break;
            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](0);
              // leave options empty on failure
              if (mounted) {
                setMcpOptions([]);
                setKbOptions([]);
              }
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 18]]);
      }))();
      return function () {
        mounted = false;
      };
    }, []);
    return {
      mcpOptions: mcpOptions,
      kbOptions: kbOptions
    };
  };
  var _default = _exports.default = useAgentOptions;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/hooks/useFeatureFlags.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
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
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _AgentBuilderApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
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
  /**
   * Normalizes a feature flag value to boolean
   * @param {*} v - The value to normalize
   * @returns {boolean}
   */
  var normalizeFeatureFlag = function normalizeFeatureFlag(v) {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v === 1;
    if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'yes' || v.toLowerCase() === 'on';
    return !!v;
  };

  /**
   * Custom hook to fetch and manage feature flags
   * @returns {{ featureEnabled: boolean | null }}
   */
  var useFeatureFlags = function useFeatureFlags() {
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      featureEnabled = _useState2[0],
      setFeatureEnabled = _useState2[1]; // null=loading; boolean when loaded

    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var resp, root, features, maybeGroup, gateVal, enabled;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _AgentBuilderApi.getFeatureFlags)();
            case 3:
              resp = _context.sent;
              root = resp && resp.payload || resp || {};
              features = root && root.features ? root.features : root; // Support nested shape where features.mltk_hosted_llm is an object of flags
              maybeGroup = features && features.mltk_hosted_llm ? features.mltk_hosted_llm : features;
              if (maybeGroup && _typeof(maybeGroup) === 'object') {
                if (Object.prototype.hasOwnProperty.call(maybeGroup, 'aitk_agent_builder_feature_enabled')) {
                  gateVal = maybeGroup.aitk_agent_builder_feature_enabled;
                } else if (Object.prototype.hasOwnProperty.call(maybeGroup, 'slim_mltk_hosted_llm_feature_enabled')) {
                  gateVal = maybeGroup.slim_mltk_hosted_llm_feature_enabled;
                }
              } else if (features) {
                // Older shape: boolean at features.mltk_hosted_llm
                gateVal = features.mltk_hosted_llm;
              }
              enabled = normalizeFeatureFlag(gateVal);
              if (mounted) setFeatureEnabled(enabled);
              _context.next = 15;
              break;
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              if (mounted) setFeatureEnabled(false);
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 12]]);
      }))();
      return function () {
        mounted = false;
      };
    }, []);
    return {
      featureEnabled: featureEnabled
    };
  };
  var _default = _exports.default = useFeatureFlags;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/hooks/useLLMConfig.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayIncludes, _esArrayIterator, _esFunctionName, _esObjectEntries, _esObjectToString, _esSet, _esStringIterator, _esStringTrim, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _react, _AgentBuilderApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
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
  var ALLOWED_LLM_PROVIDERS = ['OpenAI', 'Anthropic', 'AzureOpenAI', 'Bedrock'];

  /**
   * Custom hook to fetch and manage LLM configuration (providers and models)
   * @returns {{ llmProviders: Array, modelsByProvider: Object, aiCommanderConfig: Object | null }}
   */
  var useLLMConfig = function useLLMConfig() {
    var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      llmProviders = _useState2[0],
      setLlmProviders = _useState2[1];
    var _useState3 = (0, _react.useState)({}),
      _useState4 = _slicedToArray(_useState3, 2),
      modelsByProvider = _useState4[0],
      setModelsByProvider = _useState4[1];
    var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      aiCommanderConfig = _useState6[0],
      setAiCommanderConfig = _useState6[1];
    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _resp$payload, _rawData$get_data, resp, rawData, metadata, savedConfigs, providersOut, modelsOut, providerSeen;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _AgentBuilderApi.getAiCommanderConfig)();
            case 3:
              resp = _context.sent;
              rawData = (_resp$payload = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload !== void 0 ? _resp$payload : resp;
              metadata = (_rawData$get_data = rawData === null || rawData === void 0 ? void 0 : rawData.get_data) !== null && _rawData$get_data !== void 0 ? _rawData$get_data : null;
              savedConfigs = Array.isArray(rawData === null || rawData === void 0 ? void 0 : rawData.data) ? rawData.data : [];
              providersOut = [];
              modelsOut = {}; // Add Default provider with Splunk_Default model at the top
              providersOut.push({
                label: 'Splunk Provided',
                value: 'Default'
              });
              modelsOut.Default = [{
                label: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
                value: 'Splunk_Default',
                connectionName: '',
                responseVariabilityDefault: '0.7',
                maxTokensDefault: '4096'
              }];
              if (savedConfigs.length > 0) {
                providerSeen = new Set(['Default']);
                savedConfigs.forEach(function (config) {
                  var _config$llm_params$re, _config$llm_params, _config$llm_params$ma, _config$llm_params2;
                  var providerName = String((config === null || config === void 0 ? void 0 : config.provider) || '').trim();
                  var modelName = String((config === null || config === void 0 ? void 0 : config.model) || '').trim();
                  var connectionName = String((config === null || config === void 0 ? void 0 : config.name) || '').trim();
                  if (!providerName || !modelName || !connectionName) return;
                  if (!ALLOWED_LLM_PROVIDERS.includes(providerName)) return;
                  if (!providerSeen.has(providerName)) {
                    providerSeen.add(providerName);
                    providersOut.push({
                      label: providerName,
                      value: providerName
                    });
                  }
                  if (!modelsOut[providerName]) {
                    modelsOut[providerName] = [];
                  }
                  modelsOut[providerName].push({
                    label: modelName,
                    value: modelName,
                    connectionName: connectionName,
                    responseVariabilityDefault: (_config$llm_params$re = config === null || config === void 0 ? void 0 : (_config$llm_params = config.llm_params) === null || _config$llm_params === void 0 ? void 0 : _config$llm_params.response_variability) !== null && _config$llm_params$re !== void 0 ? _config$llm_params$re : '0.7',
                    maxTokensDefault: (_config$llm_params$ma = config === null || config === void 0 ? void 0 : (_config$llm_params2 = config.llm_params) === null || _config$llm_params2 === void 0 ? void 0 : _config$llm_params2.max_tokens) !== null && _config$llm_params$ma !== void 0 ? _config$llm_params$ma : '4096'
                  });
                });
              } else if (metadata && _typeof(metadata) === 'object') {
                Object.entries(metadata).forEach(function (_ref2) {
                  var _cfg$is_saved;
                  var _ref3 = _slicedToArray(_ref2, 2),
                    providerName = _ref3[0],
                    cfg = _ref3[1];
                  if (!cfg || _typeof(cfg) !== 'object') return;
                  if (providerName === 'metadata' || providerName === 'connection_type') {
                    return;
                  }
                  if (!ALLOWED_LLM_PROVIDERS.includes(providerName)) return;
                  var isSaved = (cfg === null || cfg === void 0 ? void 0 : (_cfg$is_saved = cfg.is_saved) === null || _cfg$is_saved === void 0 ? void 0 : _cfg$is_saved.value) === true;
                  var modelSection = cfg && cfg.models;
                  var models = [];
                  if (modelSection && _typeof(modelSection) === 'object') {
                    Object.entries(modelSection).forEach(function (_ref4) {
                      var _modelCfg$is_model_sa, _modelCfg$connection_, _modelCfg$ModelName, _modelCfg$model_name, _modelCfg$LLMTempera, _modelCfg$LLMTempera2, _modelCfg$max_tokens$, _modelCfg$max_tokens;
                      var _ref5 = _slicedToArray(_ref4, 2),
                        modelKey = _ref5[0],
                        modelCfg = _ref5[1];
                      var savedFlag = (modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$is_model_sa = modelCfg.is_model_saved) === null || _modelCfg$is_model_sa === void 0 ? void 0 : _modelCfg$is_model_sa.value) === true;
                      var connName = modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$connection_ = modelCfg.connection_name) === null || _modelCfg$connection_ === void 0 ? void 0 : _modelCfg$connection_.value;
                      var hasConnectionName = connName && connName !== '';
                      var saved = savedFlag || hasConnectionName;
                      if (!saved) return;
                      var friendly = (modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$ModelName = modelCfg['Model Name']) === null || _modelCfg$ModelName === void 0 ? void 0 : _modelCfg$ModelName.value) || (modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$model_name = modelCfg.model_name) === null || _modelCfg$model_name === void 0 ? void 0 : _modelCfg$model_name.value);
                      var label = friendly || modelKey;
                      models.push({
                        label: label,
                        value: modelKey,
                        connectionName: connName || '',
                        responseVariabilityDefault: (_modelCfg$LLMTempera = modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$LLMTempera2 = modelCfg['LLM temperature']) === null || _modelCfg$LLMTempera2 === void 0 ? void 0 : _modelCfg$LLMTempera2.value) !== null && _modelCfg$LLMTempera !== void 0 ? _modelCfg$LLMTempera : '0.7',
                        maxTokensDefault: (_modelCfg$max_tokens$ = modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$max_tokens = modelCfg.max_tokens) === null || _modelCfg$max_tokens === void 0 ? void 0 : _modelCfg$max_tokens.value) !== null && _modelCfg$max_tokens$ !== void 0 ? _modelCfg$max_tokens$ : '4096'
                      });
                    });
                  }
                  if (!isSaved && models.length === 0) return;
                  providersOut.push({
                    label: providerName,
                    value: providerName
                  });
                  modelsOut[providerName] = models;
                });
              }
              if (mounted) {
                setLlmProviders(providersOut);
                setModelsByProvider(modelsOut);
                setAiCommanderConfig(metadata || null);
              }
              _context.next = 18;
              break;
            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              if (mounted) setModelsByProvider({});
            case 18:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 15]]);
      }))();
      return function () {
        mounted = false;
      };
    }, []);
    return {
      llmProviders: llmProviders,
      modelsByProvider: modelsByProvider,
      aiCommanderConfig: aiCommanderConfig
    };
  };
  var _default = _exports.default = useLLMConfig;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/modals/AgentCreateModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/TextArea.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/Cross.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/components/agents/Form/StepAccessLLM.jsx"), __webpack_require__("./src/main/webapp/components/agents/Form/StepGeneral.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayIncludes, _esObjectToString, _esRegexpExec, _esStringIncludes, _react, _propTypes, _Modal, _Button, _Text, _TextArea, _Dropdown, _Menu, _i18n, _Close, _Agents, _StepAccessLLM, _StepGeneral) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _Text = _interopRequireDefault(_Text);
  _TextArea = _interopRequireDefault(_TextArea);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _Close = _interopRequireDefault(_Close);
  _StepAccessLLM = _interopRequireDefault(_StepAccessLLM);
  _StepGeneral = _interopRequireDefault(_StepGeneral);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var AgentCreateModal = function AgentCreateModal(_ref) {
    var advancedVisible = _ref.advancedVisible,
      aiCommanderConfig = _ref.aiCommanderConfig,
      effectiveKbOptions = _ref.effectiveKbOptions,
      effectiveMcpOptions = _ref.effectiveMcpOptions,
      error = _ref.error,
      fieldErrors = _ref.fieldErrors,
      isSaving = _ref.isSaving,
      llmConfigVisible = _ref.llmConfigVisible,
      llmProviders = _ref.llmProviders,
      mcpToolsSelections = _ref.mcpToolsSelections,
      modelsByProvider = _ref.modelsByProvider,
      modelsForProvider = _ref.modelsForProvider,
      onCreate = _ref.onCreate,
      onRequestClose = _ref.onRequestClose,
      open = _ref.open,
      setAdvancedVisible = _ref.setAdvancedVisible,
      setFieldErrors = _ref.setFieldErrors,
      setLlmConfigVisible = _ref.setLlmConfigVisible,
      setMcpToolsSelections = _ref.setMcpToolsSelections,
      setState = _ref.setState,
      state = _ref.state;
    return /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: onRequestClose,
      open: open,
      style: _Agents.agentModalStyle
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: onRequestClose,
      title: (0, _i18n.gettext)('Create agent')
    }), /*#__PURE__*/_react.default.createElement(_Agents.AgentModalBody, null, /*#__PURE__*/_react.default.createElement(_StepGeneral.default, {
      fieldErrors: fieldErrors,
      isEdit: false,
      setFieldErrors: setFieldErrors,
      setState: setState,
      state: state
    }), /*#__PURE__*/_react.default.createElement(_StepAccessLLM.default, {
      aiCommanderConfig: aiCommanderConfig,
      fieldErrors: fieldErrors,
      isEdit: false,
      kbOptions: effectiveKbOptions,
      llmConfigVisible: llmConfigVisible,
      llmProviders: llmProviders,
      mcpOptions: effectiveMcpOptions,
      mcpToolsSelections: mcpToolsSelections,
      modelsByProvider: modelsByProvider,
      modelsForProvider: modelsForProvider,
      setFieldErrors: setFieldErrors,
      setLlmConfigVisible: setLlmConfigVisible,
      setMcpToolsSelections: setMcpToolsSelections,
      setState: setState,
      state: state
    }), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontWeight: 600,
        marginBottom: 8
      }
    }, (0, _i18n.gettext)('Additional settings')), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, (!advancedVisible.includes('maximum_result_rows') || !advancedVisible.includes('system_prompt') || !advancedVisible.includes('agent_timeout')) && /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
        appearance: "secondary",
        isMenu: true,
        label: (0, _i18n.gettext)('+ Add configuration')
      })
    }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, !advancedVisible.includes('maximum_result_rows') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        var _modelCfg$MaximumRes;
        var providerCfg = aiCommanderConfig === null || aiCommanderConfig === void 0 ? void 0 : aiCommanderConfig[state.llmProvider];
        var modelsSection = providerCfg && providerCfg.models;
        var modelCfg = modelsSection && state.llmModel ? modelsSection[state.llmModel] : null;
        var defVal = modelCfg === null || modelCfg === void 0 ? void 0 : (_modelCfg$MaximumRes = modelCfg['Maximum Result Rows']) === null || _modelCfg$MaximumRes === void 0 ? void 0 : _modelCfg$MaximumRes.value;
        setState(function (s) {
          var nextVal = s.maximum_result_rows;
          if (nextVal === '' || nextVal === undefined) {
            if (defVal !== undefined && defVal !== null) {
              nextVal = String(defVal);
            } else {
              nextVal = '10';
            }
          }
          return _objectSpread(_objectSpread({}, s), {}, {
            maximum_result_rows: nextVal
          });
        });
        setAdvancedVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['maximum_result_rows']);
        });
      }
    }, (0, _i18n.gettext)('Maximum Invocations per command')), !advancedVisible.includes('system_prompt') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            system_prompt: s.system_prompt || 'You are a helpful assistant'
          });
        });
        setAdvancedVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['system_prompt']);
        });
      }
    }, (0, _i18n.gettext)('System Prompt')), !advancedVisible.includes('agent_timeout') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            agent_timeout: '450'
          });
        });
        setAdvancedVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['agent_timeout']);
        });
      }
    }, (0, _i18n.gettext)('Agent timeout Duration')))))), advancedVisible.includes('maximum_result_rows') && /*#__PURE__*/_react.default.createElement(_Agents.FormRow, null, /*#__PURE__*/_react.default.createElement(_Agents.Label, null, (0, _i18n.gettext)('Maximum Invocations per command')), /*#__PURE__*/_react.default.createElement(_Agents.Field, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            maximum_result_rows: value
          });
        });
        if (value === '') {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: undefined
            });
          });
        } else if (!/^\d+$/.test(String(value))) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: 'Must be an integer'
            });
          });
        } else if (parseInt(value, 10) > 25) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: 'Maximum value allowed is 25'
            });
          });
        } else {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: undefined
            });
          });
        }
      },
      style: {
        flex: 1
      },
      value: state.maximum_result_rows
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'maximum_result_rows';
          });
        });
      },
      style: {
        flex: 'inherit'
      }
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.maximum_result_rows) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        fontSize: 12,
        marginTop: 6
      }
    }, fieldErrors.maximum_result_rows), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'black',
        fontSize: 12,
        marginTop: 6
      }
    }, (0, _i18n.gettext)('ML-SPL can be used to invoke an agent multiple times based on search results.')))), advancedVisible.includes('system_prompt') && /*#__PURE__*/_react.default.createElement(_Agents.FormRow, null, /*#__PURE__*/_react.default.createElement(_Agents.Label, null, (0, _i18n.gettext)('System Prompt')), /*#__PURE__*/_react.default.createElement(_Agents.Field, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/_react.default.createElement(_TextArea.default, {
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            system_prompt: value
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.system_prompt) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              system_prompt: undefined
            });
          });
        }
      },
      rowsMax: 10,
      rowsMin: 4,
      style: {
        flex: 1
      },
      value: state.system_prompt
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'system_prompt';
          });
        });
      },
      style: {
        flex: 'inherit'
      }
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.system_prompt) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        fontSize: 12,
        marginTop: 6
      }
    }, fieldErrors.system_prompt), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'black',
        fontSize: 12,
        marginTop: 6
      }
    }, (0, _i18n.gettext)('Use the system prompt to define the identity of the agent, and provide high level guardrails')))), advancedVisible.includes('agent_timeout') && /*#__PURE__*/_react.default.createElement(_Agents.FormRow, null, /*#__PURE__*/_react.default.createElement(_Agents.Label, null, (0, _i18n.gettext)('Agent Timeout Duration')), /*#__PURE__*/_react.default.createElement(_Agents.Field, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        alignItems: 'center',
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            agent_timeout: value
          });
        });
        if (value === '') {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: undefined
            });
          });
        } else if (!/^\d+$/.test(String(value))) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: 'Must be an integer'
            });
          });
        } else if (parseInt(value, 10) > 900) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: 'Maximum value allowed is 900'
            });
          });
        } else {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: undefined
            });
          });
        }
      },
      style: {
        flex: 1
      },
      value: state.agent_timeout
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'agent_timeout';
          });
        });
      },
      style: {
        flex: 'inherit'
      }
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.agent_timeout) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        fontSize: 12,
        marginTop: 6
      }
    }, fieldErrors.agent_timeout), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'black',
        fontSize: 12,
        marginTop: 6
      }
    }, (0, _i18n.gettext)('The maximum amount of time the agent will run in [seconds] before timing out.'))))), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      onClick: onRequestClose
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: isSaving,
      onClick: onCreate
    }, (0, _i18n.gettext)('Save'))));
  };
  var _default = _exports.default = AgentCreateModal;
  AgentCreateModal.propTypes = {
    open: _propTypes.default.bool.isRequired,
    onRequestClose: _propTypes.default.func.isRequired,
    state: _propTypes.default.shape({
      llmProvider: _propTypes.default.string,
      llmModel: _propTypes.default.string,
      maximum_result_rows: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      agent_timeout: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      system_prompt: _propTypes.default.string,
      prompt: _propTypes.default.string
    }).isRequired,
    setState: _propTypes.default.func.isRequired,
    fieldErrors: _propTypes.default.shape({
      maximum_result_rows: _propTypes.default.string,
      agent_timeout: _propTypes.default.string,
      system_prompt: _propTypes.default.string,
      prompt: _propTypes.default.string
    }).isRequired,
    setFieldErrors: _propTypes.default.func.isRequired,
    advancedVisible: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    setAdvancedVisible: _propTypes.default.func.isRequired,
    llmConfigVisible: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    setLlmConfigVisible: _propTypes.default.func.isRequired,
    effectiveMcpOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    effectiveKbOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    llmProviders: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    modelsForProvider: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    modelsByProvider: _propTypes.default.object.isRequired,
    mcpToolsSelections: _propTypes.default.object.isRequired,
    setMcpToolsSelections: _propTypes.default.func.isRequired,
    error: _propTypes.default.string,
    isSaving: _propTypes.default.bool.isRequired,
    onCreate: _propTypes.default.func.isRequired,
    aiCommanderConfig: _propTypes.default.any
  };
  AgentCreateModal.defaultProps = {
    error: '',
    aiCommanderConfig: null
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/modals/AgentDeleteModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _react, _propTypes, _Modal, _Button, _i18n, _Agents) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var AgentDeleteModal = function AgentDeleteModal(_ref) {
    var open = _ref.open,
      onRequestClose = _ref.onRequestClose,
      onConfirm = _ref.onConfirm,
      agentName = _ref.agentName,
      isDeleting = _ref.isDeleting;
    return /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: onRequestClose,
      open: open,
      style: _Agents.deleteAgentModalStyle
    }, /*#__PURE__*/_react.default.createElement(_Agents.AgentModalHeader, {
      onRequestClose: onRequestClose,
      title: (0, _i18n.gettext)('Delete agent')
    }), /*#__PURE__*/_react.default.createElement(_Agents.AgentModalBody, null, /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Are you sure you want to delete the agent'), " ", /*#__PURE__*/_react.default.createElement("strong", null, agentName), (0, _i18n.gettext)('?'))), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isDeleting,
      onClick: onRequestClose
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: isDeleting,
      onClick: onConfirm,
      style: {
        backgroundColor: '#FF0000',
        color: '#FFFFFF'
      }
    }, (0, _i18n.gettext)('Delete'))));
  };
  var _default = _exports.default = AgentDeleteModal;
  AgentDeleteModal.propTypes = {
    open: _propTypes.default.bool.isRequired,
    onRequestClose: _propTypes.default.func.isRequired,
    onConfirm: _propTypes.default.func.isRequired,
    agentName: _propTypes.default.string.isRequired,
    isDeleting: _propTypes.default.bool.isRequired
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/modals/AgentEditModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/TextArea.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-icons/Cross.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/components/agents/Form/StepAccessLLM.jsx"), __webpack_require__("./src/main/webapp/components/agents/Form/StepGeneral.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayIncludes, _esObjectToString, _esRegexpExec, _esStringIncludes, _react, _propTypes, _Modal, _Button, _Text, _TextArea, _Dropdown, _Menu, _i18n, _Close, _Agents, _StepAccessLLM, _StepGeneral) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _Text = _interopRequireDefault(_Text);
  _TextArea = _interopRequireDefault(_TextArea);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _Close = _interopRequireDefault(_Close);
  _StepAccessLLM = _interopRequireDefault(_StepAccessLLM);
  _StepGeneral = _interopRequireDefault(_StepGeneral);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var AgentEditModal = function AgentEditModal(_ref) {
    var advancedVisible = _ref.advancedVisible,
      aiCommanderConfig = _ref.aiCommanderConfig,
      effectiveKbOptions = _ref.effectiveKbOptions,
      effectiveMcpOptions = _ref.effectiveMcpOptions,
      error = _ref.error,
      fieldErrors = _ref.fieldErrors,
      isSaving = _ref.isSaving,
      llmConfigVisible = _ref.llmConfigVisible,
      llmProviders = _ref.llmProviders,
      mcpToolsSelections = _ref.mcpToolsSelections,
      modelsByProvider = _ref.modelsByProvider,
      modelsForProvider = _ref.modelsForProvider,
      onRequestClose = _ref.onRequestClose,
      onUpdate = _ref.onUpdate,
      open = _ref.open,
      setAdvancedVisible = _ref.setAdvancedVisible,
      setFieldErrors = _ref.setFieldErrors,
      setLlmConfigVisible = _ref.setLlmConfigVisible,
      setMcpToolsSelections = _ref.setMcpToolsSelections,
      setState = _ref.setState,
      state = _ref.state;
    return /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: onRequestClose,
      open: open,
      style: _Agents.agentModalStyle
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: onRequestClose,
      title: (0, _i18n.gettext)('Edit agent')
    }), /*#__PURE__*/_react.default.createElement(_Agents.AgentModalBody, null, /*#__PURE__*/_react.default.createElement(_StepGeneral.default, {
      fieldErrors: fieldErrors,
      isEdit: true,
      setFieldErrors: setFieldErrors,
      setState: setState,
      state: state
    }), /*#__PURE__*/_react.default.createElement(_StepAccessLLM.default, {
      aiCommanderConfig: aiCommanderConfig,
      fieldErrors: fieldErrors,
      isEdit: true,
      kbOptions: effectiveKbOptions,
      llmConfigVisible: llmConfigVisible,
      llmProviders: llmProviders,
      mcpOptions: effectiveMcpOptions,
      mcpToolsSelections: mcpToolsSelections,
      modelsByProvider: modelsByProvider,
      modelsForProvider: modelsForProvider,
      setFieldErrors: setFieldErrors,
      setLlmConfigVisible: setLlmConfigVisible,
      setMcpToolsSelections: setMcpToolsSelections,
      setState: setState,
      state: state
    }), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontWeight: 600,
        marginBottom: 8
      }
    }, (0, _i18n.gettext)('Additonal settings')), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, (!advancedVisible.includes('system_prompt') || !advancedVisible.includes('maximum_result_rows') || !advancedVisible.includes('agent_timeout')) && /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
        appearance: "secondary",
        isMenu: true,
        label: (0, _i18n.gettext)('+ Add configuration')
      })
    }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, !advancedVisible.includes('system_prompt') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            system_prompt: s.system_prompt || 'You are a helpful assistant'
          });
        });
        setAdvancedVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['system_prompt']);
        });
      }
    }, (0, _i18n.gettext)('System Prompt')), !advancedVisible.includes('maximum_result_rows') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            maximum_result_rows: s.maximum_result_rows || '10'
          });
        });
        setAdvancedVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['maximum_result_rows']);
        });
      }
    }, (0, _i18n.gettext)('Maximum Invocations per command')), !advancedVisible.includes('agent_timeout') && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return [].concat(_toConsumableArray(v), ['agent_timeout']);
        });
      }
    }, (0, _i18n.gettext)('Agent Timeout Duration')))))), advancedVisible.includes('system_prompt') && /*#__PURE__*/_react.default.createElement(_Agents.FormRow, null, /*#__PURE__*/_react.default.createElement(_Agents.Label, null, (0, _i18n.gettext)('System Prompt')), /*#__PURE__*/_react.default.createElement(_Agents.Field, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/_react.default.createElement(_TextArea.default, {
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            system_prompt: value
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.system_prompt) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              system_prompt: undefined
            });
          });
        }
      },
      rowsMax: 10,
      rowsMin: 4,
      style: {
        flex: 1
      },
      value: state.system_prompt
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'system_prompt';
          });
        });
      },
      style: {
        flex: 'inherit'
      }
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.system_prompt) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        fontSize: 12,
        marginTop: 6
      }
    }, fieldErrors.system_prompt), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'black',
        fontSize: 12,
        marginTop: 6
      }
    }, (0, _i18n.gettext)('System prompt provides high-level instructions that guide the agent behavior and decision-making process.')))), advancedVisible.includes('maximum_result_rows') && /*#__PURE__*/_react.default.createElement(_Agents.FormRow, null, /*#__PURE__*/_react.default.createElement(_Agents.Label, null, (0, _i18n.gettext)('Maximum Invocations per command')), /*#__PURE__*/_react.default.createElement(_Agents.Field, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            maximum_result_rows: value
          });
        });
        if (value === '') {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: undefined
            });
          });
        } else if (!/^\d+$/.test(String(value))) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: 'Must be an integer'
            });
          });
        } else if (parseInt(value, 10) > 25) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: 'Maximum value allowed is 25'
            });
          });
        } else {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              maximum_result_rows: undefined
            });
          });
        }
      },
      style: {
        flex: 1
      },
      value: state.maximum_result_rows
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'maximum_result_rows';
          });
        });
      },
      style: {
        flex: 'inherit'
      }
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.maximum_result_rows) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        fontSize: 12,
        marginTop: 6
      }
    }, fieldErrors.maximum_result_rows), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'black',
        fontSize: 12,
        marginTop: 6
      }
    }, (0, _i18n.gettext)('ML-SPL can be used to invoke an agent multiple times based on search results.')))), advancedVisible.includes('agent_timeout') && /*#__PURE__*/_react.default.createElement(_Agents.FormRow, null, /*#__PURE__*/_react.default.createElement(_Agents.Label, null, (0, _i18n.gettext)('Agent Timeout Duration')), /*#__PURE__*/_react.default.createElement(_Agents.Field, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            agent_timeout: value
          });
        });
        if (value === '') {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: undefined
            });
          });
        } else if (!/^\d+$/.test(String(value))) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: 'Must be an integer'
            });
          });
        } else {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              agent_timeout: undefined
            });
          });
        }
      },
      style: {
        flex: 1
      },
      value: state.agent_timeout
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      className: "adv-clear",
      icon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
      onClick: function onClick() {
        return setAdvancedVisible(function (v) {
          return v.filter(function (k) {
            return k !== 'agent_timeout';
          });
        });
      },
      style: {
        flex: 'inherit'
      }
    })), (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.agent_timeout) && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        fontSize: 12,
        marginTop: 6
      }
    }, fieldErrors.agent_timeout), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'black',
        fontSize: 12,
        marginTop: 6
      }
    }, (0, _i18n.gettext)('The maximum amount of time the agent will run before timing out.')))), error && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'red',
        marginTop: 12
      }
    }, error)), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      onClick: onRequestClose
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: isSaving,
      onClick: onUpdate
    }, (0, _i18n.gettext)('Save'))));
  };
  var _default = _exports.default = AgentEditModal;
  AgentEditModal.propTypes = {
    advancedVisible: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    aiCommanderConfig: _propTypes.default.any,
    effectiveKbOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    effectiveMcpOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    error: _propTypes.default.string,
    fieldErrors: _propTypes.default.shape({
      system_prompt: _propTypes.default.string,
      maximum_result_rows: _propTypes.default.string,
      agent_timeout: _propTypes.default.string
    }).isRequired,
    isSaving: _propTypes.default.bool.isRequired,
    llmConfigVisible: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    llmProviders: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    mcpToolsSelections: _propTypes.default.object.isRequired,
    modelsByProvider: _propTypes.default.object.isRequired,
    modelsForProvider: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })).isRequired,
    onRequestClose: _propTypes.default.func.isRequired,
    onUpdate: _propTypes.default.func.isRequired,
    open: _propTypes.default.bool.isRequired,
    setAdvancedVisible: _propTypes.default.func.isRequired,
    setFieldErrors: _propTypes.default.func.isRequired,
    setLlmConfigVisible: _propTypes.default.func.isRequired,
    setMcpToolsSelections: _propTypes.default.func.isRequired,
    setState: _propTypes.default.func.isRequired,
    state: _propTypes.default.shape({
      system_prompt: _propTypes.default.string,
      maximum_result_rows: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      agent_timeout: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
    }).isRequired
  };
  AgentEditModal.defaultProps = {
    aiCommanderConfig: null,
    error: ''
  };
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/utils/agentPayloadUtils.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayFind, _esArrayIncludes, _esArrayMap, _esFunctionName, _esObjectToString, _esStringIncludes, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isApiResponseSuccess = _exports.getApiErrorMessage = _exports.buildUpdateAgentPayload = _exports.buildMCPsPayload = _exports.buildLLMObject = _exports.buildKBPayloadForUpdate = _exports.buildKBPayloadForCreate = _exports.buildCreateAgentPayload = _exports.buildACLPayload = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  /**
   * Builds the LLM object for agent create/update payload
   * @param {Object} state - The agent state
   * @param {Array} llmConfigVisible - Visible LLM config fields
   * @param {Array} advancedVisible - Visible advanced fields
   * @returns {Object} LLM configuration object
   */
  var buildLLMObject = _exports.buildLLMObject = function buildLLMObject(state, llmConfigVisible, advancedVisible) {
    var llmObj = {
      provider: state.llmProvider === 'Default' && state.llmModel === 'Splunk_Default' ? 'Splunk_Default' : state.llmProvider,
      model: state.llmProvider === 'Default' && state.llmModel === 'Splunk_Default' ? '' : state.llmModel
    };
    if (state.llmProvider !== 'Default' && state.llmConnectionName && state.llmConnectionName !== '') {
      llmObj.connection_name = state.llmConnectionName;
    }
    if (llmConfigVisible.includes('response_variability') && state.response_variability !== '') {
      llmObj.response_variability = state.response_variability;
    }
    if (llmConfigVisible.includes('max_tokens') && state.max_tokens !== '') {
      llmObj.max_tokens = state.max_tokens;
    }
    if (advancedVisible.includes('maximum_result_rows') && state.maximum_result_rows !== '') {
      llmObj.maximum_result_rows = state.maximum_result_rows;
    }
    return llmObj;
  };

  /**
   * Builds the MCPs payload array
   * @param {Array} mcps - Array of MCP names
   * @param {Object} mcpToolsSelections - Map of MCP name to selected tools
   * @returns {Array} MCPs payload array
   */
  var buildMCPsPayload = _exports.buildMCPsPayload = function buildMCPsPayload(mcps, mcpToolsSelections) {
    var mcpsArr = [];
    if (Array.isArray(mcps)) {
      mcpsArr = mcps;
    } else if (mcps) {
      mcpsArr = [mcps];
    }
    return (mcpsArr || []).map(function (mcpName) {
      var selected = Array.isArray(mcpToolsSelections[mcpName]) ? mcpToolsSelections[mcpName] : [];
      return {
        name: mcpName,
        tools: selected
      };
    });
  };

  /**
   * Builds the knowledge bases payload array for create
   * @param {Array} knowledgeBases - Array of KB names
   * @returns {Array} Knowledge bases payload array
   */
  var buildKBPayloadForCreate = _exports.buildKBPayloadForCreate = function buildKBPayloadForCreate(knowledgeBases) {
    var kbArr = [];
    if (Array.isArray(knowledgeBases)) {
      kbArr = knowledgeBases.map(function (kb) {
        return {
          name: kb,
          type: 'VECTOR_DB'
        };
      });
    } else if (knowledgeBases) {
      kbArr = [{
        name: knowledgeBases,
        type: 'VECTOR_DB'
      }];
    }
    return kbArr;
  };

  /**
   * Builds the knowledge bases payload array for update
   * @param {Array} knowledgeBases - Array of KB names
   * @param {Array} knowledgeBasesRaw - Raw KB data from backend
   * @returns {Array} Knowledge bases payload array
   */
  var buildKBPayloadForUpdate = _exports.buildKBPayloadForUpdate = function buildKBPayloadForUpdate(knowledgeBases, knowledgeBasesRaw) {
    var kbArr = [];
    if (Array.isArray(knowledgeBases)) {
      kbArr = knowledgeBases;
    } else if (knowledgeBases) {
      kbArr = [knowledgeBases];
    }
    var kbRaw = Array.isArray(knowledgeBasesRaw) ? knowledgeBasesRaw : [];
    return (kbArr || []).map(function (kbName) {
      var fromRaw = kbRaw.find(function (k) {
        return (typeof k === 'string' ? k : k && k.name) === kbName;
      });
      if (fromRaw && _typeof(fromRaw) === 'object') return fromRaw;
      return {
        name: kbName
      };
    });
  };

  /**
   * Builds the ACL payload for update
   * @param {Object} aclState - The ACL state
   * @returns {Object} ACL payload object
   */
  var buildACLPayload = _exports.buildACLPayload = function buildACLPayload(aclState) {
    var acl = aclState || {};
    var aclPerms = acl.perms || {};
    return {
      sharing: acl.sharing || 'owner',
      app: acl.app || _config.app,
      owner: acl.owner || _config.username,
      perms: {
        read: Array.isArray(aclPerms.read) ? aclPerms.read : [],
        write: Array.isArray(aclPerms.write) ? aclPerms.write : []
      }
    };
  };

  /**
   * Builds the complete create agent payload
   * @param {Object} params - Parameters for building payload
   * @returns {Object} Create agent payload
   */
  var buildCreateAgentPayload = _exports.buildCreateAgentPayload = function buildCreateAgentPayload(_ref) {
    var state = _ref.state,
      mcpToolsSelections = _ref.mcpToolsSelections,
      llmConfigVisible = _ref.llmConfigVisible,
      advancedVisible = _ref.advancedVisible;
    var mcpsPayload = buildMCPsPayload(state.mcps, mcpToolsSelections);
    var kbPayload = buildKBPayloadForCreate(state.knowledge_bases);
    var llmObj = buildLLMObject(state, llmConfigVisible, advancedVisible);
    var payload = {
      name: state.agent_name,
      description: state.description,
      system_prompt: state.system_prompt,
      task_prompt: state.prompt,
      mcps: mcpsPayload,
      knowledge_bases: kbPayload,
      llm: llmObj
    };

    // Add agent_timeout as separate key if present
    if (advancedVisible.includes('agent_timeout') && state.agent_timeout !== '') {
      payload.agent_timeout = state.agent_timeout;
    }
    return payload;
  };

  /**
   * Builds the complete update agent payload
   * @param {Object} params - Parameters for building payload
   * @returns {Object} Update agent payload
   */
  var buildUpdateAgentPayload = _exports.buildUpdateAgentPayload = function buildUpdateAgentPayload(_ref2) {
    var state = _ref2.state,
      mcpToolsSelections = _ref2.mcpToolsSelections,
      llmConfigVisible = _ref2.llmConfigVisible,
      advancedVisible = _ref2.advancedVisible;
    var mcpsPayload = buildMCPsPayload(state.mcps, mcpToolsSelections);
    var kbPayload = buildKBPayloadForUpdate(state.knowledge_bases, state.knowledge_bases_raw);
    var llmObj = buildLLMObject(state, llmConfigVisible, advancedVisible);
    var aclPayload = buildACLPayload(state.acl);
    var payload = {
      name: state.agent_name,
      description: state.description,
      system_prompt: state.system_prompt,
      task_prompt: state.prompt,
      mcps: mcpsPayload,
      knowledge_bases: kbPayload,
      llm: llmObj,
      is_enabled: !!state.is_enabled,
      acl: aclPayload
    };

    // Add agent_timeout as separate key if present
    if (advancedVisible.includes('agent_timeout') && state.agent_timeout !== '') {
      payload.agent_timeout = state.agent_timeout;
    }
    return payload;
  };

  /**
   * Evaluates if API response indicates success
   * @param {Object} resp - API response
   * @returns {boolean}
   */
  var isApiResponseSuccess = _exports.isApiResponseSuccess = function isApiResponseSuccess(resp) {
    var _resp$payload;
    var statusCode = resp === null || resp === void 0 ? void 0 : resp.status;
    var result = (_resp$payload = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload !== void 0 ? _resp$payload : {};
    var statusStrOk = typeof statusCode === 'string' && statusCode.toLowerCase() === 'success';
    var httpOk = statusCode === 200;
    var payloadOk = (result === null || result === void 0 ? void 0 : result.success) === true || typeof (result === null || result === void 0 ? void 0 : result.status) === 'string' && result.status.toLowerCase() === 'success';
    return httpOk || statusStrOk || payloadOk;
  };

  /**
   * Extracts error message from API response
   * @param {Object} resp - API response
   * @param {string} fallback - Fallback error message
   * @returns {string}
   */
  var getApiErrorMessage = _exports.getApiErrorMessage = function getApiErrorMessage(resp, fallback) {
    var _resp$payload2;
    var result = (_resp$payload2 = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload2 !== void 0 ? _resp$payload2 : {};
    return (result === null || result === void 0 ? void 0 : result.error_message) || (result === null || result === void 0 ? void 0 : result.message) || (resp === null || resp === void 0 ? void 0 : resp.message) || fallback;
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/utils/index.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/agents/utils/agentPayloadUtils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _agentPayloadUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "buildACLPayload", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildACLPayload;
    }
  });
  Object.defineProperty(_exports, "buildCreateAgentPayload", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildCreateAgentPayload;
    }
  });
  Object.defineProperty(_exports, "buildKBPayloadForCreate", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildKBPayloadForCreate;
    }
  });
  Object.defineProperty(_exports, "buildKBPayloadForUpdate", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildKBPayloadForUpdate;
    }
  });
  Object.defineProperty(_exports, "buildLLMObject", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildLLMObject;
    }
  });
  Object.defineProperty(_exports, "buildMCPsPayload", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildMCPsPayload;
    }
  });
  Object.defineProperty(_exports, "buildUpdateAgentPayload", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.buildUpdateAgentPayload;
    }
  });
  Object.defineProperty(_exports, "getApiErrorMessage", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.getApiErrorMessage;
    }
  });
  Object.defineProperty(_exports, "isApiResponseSuccess", {
    enumerable: true,
    get: function get() {
      return _agentPayloadUtils.isApiResponseSuccess;
    }
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agents/validate.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.number.is-finite.js"), __webpack_require__("./node_modules/core-js/modules/es.number.is-integer.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esNumberConstructor, _esNumberIsFinite, _esNumberIsInteger, _esObjectToString, _esRegexpExec, _esStringTrim, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.validateAgent = _exports.isNonEmptyString = _exports.collect = void 0;
  var isNonEmptyString = _exports.isNonEmptyString = function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
  };
  var collect = _exports.collect = function collect(arr) {
    return arr.filter(Boolean);
  };
  var validateAgent = _exports.validateAgent = function validateAgent(state) {
    var errors = [];
    var fieldErrors = {};

    // Title / Agent name
    if (!isNonEmptyString(state === null || state === void 0 ? void 0 : state.agent_name)) {
      errors.push((0, _i18n.gettext)("Missing required field: 'Agent name'"));
      fieldErrors.agent_name = (0, _i18n.gettext)('Agent Title is Required');
    } else {
      var name = String(state.agent_name).trim();
      var alphaNum = /^[A-Za-z0-9]+$/;
      if (!alphaNum.test(name)) {
        errors.push((0, _i18n.gettext)("'Agent name' must be alphanumeric (letters and numbers only)"));
        fieldErrors.agent_name = (0, _i18n.gettext)('Use only letters and numbers (no spaces or special characters)');
      } else if (name.length > 24) {
        errors.push((0, _i18n.gettext)("'Agent name' must be 24 characters or less"));
        fieldErrors.agent_name = (0, _i18n.gettext)('Maximum 24 characters allowed');
      }
    }

    // Description is now optional - no validation required

    // MCP servers and Knowledge Bases are optional
    // Keep normalization without enforcing length > 0
    var mcps = Array.isArray(state === null || state === void 0 ? void 0 : state.mcps) ? state.mcps : state !== null && state !== void 0 && state.mcps ? [state.mcps] : [];
    var kbs = Array.isArray(state === null || state === void 0 ? void 0 : state.knowledge_bases) ? state.knowledge_bases : state !== null && state !== void 0 && state.knowledge_bases ? [state.knowledge_bases] : [];

    // LLM provider and model
    if (!isNonEmptyString(state === null || state === void 0 ? void 0 : state.llmProvider)) {
      errors.push((0, _i18n.gettext)("Missing required field: 'LLM provider'"));
      fieldErrors.llmProvider = (0, _i18n.gettext)('Select at least one LLM provider');
    }
    if (!isNonEmptyString(state === null || state === void 0 ? void 0 : state.llmModel)) {
      errors.push((0, _i18n.gettext)("Missing required field: 'LLM model'"));
      fieldErrors.llmModel = (0, _i18n.gettext)('Select at least one LLM model');
    }

    // System prompt and prompt are optional fields
    // No validation required for system_prompt and prompt

    // Advanced configuration validations
    // Temperature: float or integer in [0, 1]
    if ((state === null || state === void 0 ? void 0 : state.response_variability) !== '' && (state === null || state === void 0 ? void 0 : state.response_variability) !== undefined && (state === null || state === void 0 ? void 0 : state.response_variability) !== null) {
      var n = Number(state.response_variability);
      if (!Number.isFinite(n) || n < 0 || n > 1) {
        errors.push((0, _i18n.gettext)('Response Variability must be a number between 0 and 1'));
        fieldErrors.response_variability = (0, _i18n.gettext)('Enter a value between 0 and 1');
      }
    }
    // Integer-only fields: non-negative integers
    var intOnly = [{
      key: 'maximum_result_rows',
      label: 'Search results rows'
    }, {
      key: 'max_tokens',
      label: 'Max tokens'
    }, {
      key: 'agent_timeout',
      label: 'Agent Timeout Duration'
    }];
    intOnly.forEach(function (_ref) {
      var key = _ref.key,
        label = _ref.label;
      var val = state === null || state === void 0 ? void 0 : state[key];
      if (val !== '' && val !== undefined && val !== null) {
        var _n = Number(val);
        if (!Number.isFinite(_n) || !Number.isInteger(_n) || _n < 0) {
          errors.push((0, _i18n.gettext)("".concat(label, " must be an integer")));
          fieldErrors[key] = (0, _i18n.gettext)('Must be an integer');
        }
      }
    });

    // Agent timeout specific validation - max 900 seconds
    var agentTimeoutVal = state === null || state === void 0 ? void 0 : state.agent_timeout;
    if (agentTimeoutVal !== '' && agentTimeoutVal !== undefined && agentTimeoutVal !== null) {
      var _n2 = Number(agentTimeoutVal);
      if (Number.isFinite(_n2) && _n2 > 900) {
        errors.push((0, _i18n.gettext)('Agent Timeout must be 900 seconds or less'));
        fieldErrors.agent_timeout = (0, _i18n.gettext)('Agent Timeout must be 900 seconds or less');
      }
    }
    return {
      ok: errors.length === 0,
      errors: errors,
      fieldErrors: fieldErrors
    };
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Agents.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("agents/AgentsView")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _AgentsView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _AgentsView = _interopRequireDefault(_AgentsView);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var AgentsRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Agents'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.showcaseView) {
        this.showcaseView.remove();
      }
      this.showcaseView = new _AgentsView.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = AgentsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "agents/AgentsView":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/agents/AgentsPage.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _BaseDashboard, _AgentsPage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _AgentsPage = _interopRequireDefault(_AgentsPage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * Backbone page that renders the React component tree for Agents
   */

  var Page = (0, _root.hot)(_AgentsPage.default);
  var AgentsView = _BaseDashboard.default.extend({
    render: function render() {
      _reactDom.default.render(_react.default.createElement(Page), this.el);
    }
  });
  var _default = _exports.default = AgentsView;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/agents.es","pages_common"]]]);