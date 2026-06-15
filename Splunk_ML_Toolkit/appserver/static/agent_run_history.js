(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["agent_run_history"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/agent_run_history.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/AgentRunHistory.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_AgentRunHistory, _swcMltk) {
  "use strict";

  _AgentRunHistory = _interopRequireDefault(_AgentRunHistory);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _AgentRunHistory.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentRunHistory/AgentRunHistory.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/agentConnections/utils/ResponseHandlerUtil.jsx"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/util/themeCompat.es"), __webpack_require__("./src/main/webapp/components/agentRunHistory/Header/Header.jsx"), __webpack_require__("./src/main/webapp/components/agentRunHistory/Body/Body.jsx"), __webpack_require__("./src/main/webapp/components/agentRunHistory/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayIterator, _esArrayMap, _esArraySort, _esObjectToString, _esPromise, _esRegexpExec, _esRegexpToString, _esStringIterator, _esStringSearch, _webDomCollectionsForEach, _webDomCollectionsIterator, _webUrlSearchParams, _react, _i18n, _AgentBuilderApi, _ResponseHandlerUtil, _Agents, _themeCompat, _Header, _Body, _constants) {
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
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
  // Fetch agents list from backend and format for dropdown
  var fetchAgentsForDropdown = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _resp$payload, resp, payload, items, agentsOptions, agentOwnerMap, rawOwners, filteredOwners, uniqueOwners, sortedOwners, ownerOptions;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.getAgentsList, ['', null], {
              errorMessage: 'Failed to fetch agents',
              showSuccessToast: false,
              showErrorToast: false
            });
          case 3:
            resp = _context.sent;
            payload = (_resp$payload = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload !== void 0 ? _resp$payload : resp;
            items = Array.isArray(payload === null || payload === void 0 ? void 0 : payload.agents) ? payload.agents : payload;
            agentsOptions = (items || []).map(function (a) {
              return a === null || a === void 0 ? void 0 : a.agent_name;
            }).filter(Boolean) // Remove null/undefined agent names
            .map(function (agentName) {
              return {
                label: agentName,
                value: agentName
              };
            }); // Build agent name to owner mapping
            agentOwnerMap = {};
            (items || []).forEach(function (a) {
              var _a$versions, _a$versions$, _a$versions$$acl;
              var agentName = a === null || a === void 0 ? void 0 : a.agent_name;
              var agentOwner = a === null || a === void 0 ? void 0 : (_a$versions = a.versions) === null || _a$versions === void 0 ? void 0 : (_a$versions$ = _a$versions[0]) === null || _a$versions$ === void 0 ? void 0 : (_a$versions$$acl = _a$versions$.acl) === null || _a$versions$$acl === void 0 ? void 0 : _a$versions$$acl.owner;
              if (agentName && agentOwner) {
                agentOwnerMap[agentName] = agentOwner;
              }
            });
            rawOwners = (items || []).map(function (a) {
              var _a$versions2, _a$versions2$, _a$versions2$$acl;
              var owner = a === null || a === void 0 ? void 0 : (_a$versions2 = a.versions) === null || _a$versions2 === void 0 ? void 0 : (_a$versions2$ = _a$versions2[0]) === null || _a$versions2$ === void 0 ? void 0 : (_a$versions2$$acl = _a$versions2$.acl) === null || _a$versions2$$acl === void 0 ? void 0 : _a$versions2$$acl.owner;
              return owner;
            });
            filteredOwners = rawOwners.filter(Boolean);
            uniqueOwners = filteredOwners.filter(function (owner, index, arr) {
              return arr.indexOf(owner) === index;
            });
            sortedOwners = uniqueOwners.sort();
            ownerOptions = sortedOwners.map(function (ownerName) {
              return {
                label: ownerName,
                value: ownerName
              };
            });
            return _context.abrupt("return", {
              agentsOptions: agentsOptions,
              ownerOptions: ownerOptions,
              agentOwnerMap: agentOwnerMap
            });
          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            console.error('Error fetching agents:', _context.t0);
            return _context.abrupt("return", {
              agentsOptions: [],
              ownerOptions: [],
              agentOwnerMap: {}
            });
          case 21:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 17]]);
    }));
    return function fetchAgentsForDropdown() {
      return _ref.apply(this, arguments);
    };
  }();

  // Convert time range selection to earliest time format
  var convertTimeRangeToEarliest = function convertTimeRangeToEarliest(timeRange) {
    var timeRangeMap = {
      '1d': '-24h',
      '3d': '-3d',
      '5d': '-5d',
      '7d': '-7d'
    };
    return timeRangeMap[timeRange] || '-24h';
  };
  var AgentRunHistory = function AgentRunHistory() {
    var _useState = (0, _react.useState)('1d'),
      _useState2 = _slicedToArray(_useState, 2),
      timeRange = _useState2[0],
      setTimeRange = _useState2[1];
    var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      agentsOptions = _useState4[0],
      setAgentsOptions = _useState4[1];
    var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      ownerOptions = _useState6[0],
      setOwnerOptions = _useState6[1];
    var _useState7 = (0, _react.useState)({}),
      _useState8 = _slicedToArray(_useState7, 2),
      agentOwnerMap = _useState8[0],
      setAgentOwnerMap = _useState8[1];
    var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      agentsLoaded = _useState10[0],
      setAgentsLoaded = _useState10[1];
    var _useState11 = (0, _react.useState)(''),
      _useState12 = _slicedToArray(_useState11, 2),
      selectedAgent = _useState12[0],
      setSelectedAgent = _useState12[1];
    var _useState13 = (0, _react.useState)(null),
      _useState14 = _slicedToArray(_useState13, 2),
      owner = _useState14[0],
      setOwner = _useState14[1];
    var _useState15 = (0, _react.useState)(null),
      _useState16 = _slicedToArray(_useState15, 2),
      featureEnabled = _useState16[0],
      setFeatureEnabled = _useState16[1]; // null=loading; boolean when loaded
    var _useState17 = (0, _react.useState)(1),
      _useState18 = _slicedToArray(_useState17, 2),
      pageNum = _useState18[0],
      setPageNum = _useState18[1];

    // Read agent from URL query parameter on component mount
    (0, _react.useEffect)(function () {
      var urlParams = new URLSearchParams(window.location.search);
      var agentFromUrl = urlParams.get('agent');
      if (agentFromUrl) {
        setSelectedAgent(decodeURIComponent(agentFromUrl));
      }
    }, []);

    // Update URL query parameter when selectedAgent changes
    (0, _react.useEffect)(function () {
      var urlParams = new URLSearchParams(window.location.search);
      if (selectedAgent) {
        // Update or add agent parameter
        urlParams.set('agent', encodeURIComponent(selectedAgent));
      } else {
        // Remove agent parameter if no agent is selected
        urlParams.delete('agent');
      }

      // Update URL without triggering page reload
      var queryString = urlParams.toString();
      var newUrl = "".concat(window.location.pathname).concat(queryString ? "?".concat(queryString) : '');
      window.history.replaceState({}, '', newUrl);
    }, [selectedAgent]);

    // Run history state
    var _useState19 = (0, _react.useState)([]),
      _useState20 = _slicedToArray(_useState19, 2),
      runs = _useState20[0],
      setRuns = _useState20[1];
    var _useState21 = (0, _react.useState)(0),
      _useState22 = _slicedToArray(_useState21, 2),
      totalRecords = _useState22[0],
      setTotalRecords = _useState22[1];
    var _useState23 = (0, _react.useState)(null),
      _useState24 = _slicedToArray(_useState23, 2),
      sid = _useState24[0],
      setSid = _useState24[1];
    var _useState25 = (0, _react.useState)(true),
      _useState26 = _slicedToArray(_useState25, 2),
      isLoading = _useState26[0],
      setIsLoading = _useState26[1];

    // Load feature flags and gate page similar to AgentsPage/AgentConnectionsPage
    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var resp, root, features, maybeGroup, gateVal, normalize, enabled;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return (0, _AgentBuilderApi.getFeatureFlags)();
            case 3:
              resp = _context2.sent;
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
              normalize = function normalize(v) {
                if (typeof v === 'boolean') return v;
                if (typeof v === 'number') return v === 1;
                if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'yes' || v.toLowerCase() === 'on';
                return !!v;
              };
              enabled = normalize(gateVal);
              if (mounted) setFeatureEnabled(enabled);
              _context2.next = 16;
              break;
            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              if (mounted) setFeatureEnabled(false);
            case 16:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 13]]);
      }))();
      return function () {
        mounted = false;
      };
    }, []);
    (0, _react.useEffect)(function () {
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var agents;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return fetchAgentsForDropdown();
            case 3:
              agents = _context3.sent;
              if (mounted) {
                setAgentsOptions(agents.agentsOptions);
                setOwnerOptions(agents.ownerOptions);
                setAgentOwnerMap(agents.agentOwnerMap);
                setAgentsLoaded(true);
                // Don't reset selectedAgent here - it should preserve the value from sessionStorage
              }
              _context3.next = 10;
              break;
            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              if (mounted) {
                setAgentsOptions([]);
                setOwnerOptions([]);
                setAgentOwnerMap({});
                setAgentsLoaded(true);
                // Don't reset selectedAgent here either
              }
            case 10:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[0, 7]]);
      }))();
      return function () {
        mounted = false;
      };
    }, []);
    var bodyAgentsFilter = (0, _react.useMemo)(function () {
      return selectedAgent ? [selectedAgent] : [];
    }, [selectedAgent]);
    var pageSize = _constants.ROWS;
    var totalPages = totalRecords ? Math.max(1, Math.ceil(totalRecords / pageSize)) : 1;
    var loadFirstPage = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(currentAgentOwnerMap) {
        var payload, _resp$payload2, resp, data, history, pagination, mapped;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              // Reset paging state when filters change
              setSid(null);
              setRuns([]);
              setTotalRecords(0);
              setPageNum(1);
              setIsLoading(true);
              payload = {
                agent_name: bodyAgentsFilter,
                offset: 0,
                count: 120,
                sid: null,
                // eslint-disable-line object-shorthand
                earliest: convertTimeRangeToEarliest(timeRange),
                owner: owner // eslint-disable-line object-shorthand
              };
              _context4.prev = 6;
              _context4.next = 9;
              return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.agentsRunHistory, ['', payload], {
                errorMessage: 'Failed to fetch agent run history',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 9:
              resp = _context4.sent;
              data = (_resp$payload2 = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload2 !== void 0 ? _resp$payload2 : resp;
              history = Array.isArray(data === null || data === void 0 ? void 0 : data.history) ? data.history : [];
              pagination = (data === null || data === void 0 ? void 0 : data.pagination) || {};
              setSid((data === null || data === void 0 ? void 0 : data.sid) || null);
              mapped = history.map(function (h, idx) {
                return {
                  id: idx + 1,
                  startTime: h._time,
                  agentName: h.agent_name,
                  status: h.type,
                  searchId: h.search_id,
                  owner: currentAgentOwnerMap[h.agent_name] || '-',
                  prompt: h.prompt,
                  response: h.response || 'null',
                  sessionId: h.session_id,
                  processingTime: h.processing_time || 'null',
                  rowIndex: h.row_index
                };
              });
              setRuns(mapped);
              setTotalRecords((pagination === null || pagination === void 0 ? void 0 : pagination.total) || mapped.length);
              _context4.next = 24;
              break;
            case 19:
              _context4.prev = 19;
              _context4.t0 = _context4["catch"](6);
              console.error('Error fetching agent run history:', _context4.t0);
              setRuns([]);
              setTotalRecords(0);
            case 24:
              _context4.prev = 24;
              setIsLoading(false);
              return _context4.finish(24);
            case 27:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[6, 19, 24, 27]]);
      }));
      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }(), [bodyAgentsFilter, timeRange, owner]);

    // Single useEffect to load data when feature is enabled and filters change
    (0, _react.useEffect)(function () {
      if (featureEnabled && agentsLoaded) {
        loadFirstPage(agentOwnerMap);
      }
    }, [agentOwnerMap, agentsLoaded, featureEnabled, timeRange, bodyAgentsFilter, owner]); // eslint-disable-line react-hooks/exhaustive-deps

    var handlePageNumChange = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(newPage) {
        var neededEndIndex, nextBatchOffset, payload, _resp$payload3, resp, data, history, pagination, mapped;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              // eslint-disable-next-line no-console
              console.log('[AgentRunHistory] page change requested', {
                newPage: newPage,
                currentPageNum: pageNum,
                pageSize: pageSize,
                runsLoaded: runs.length,
                totalRecords: totalRecords,
                totalPages: totalPages
              });
              if (!(newPage < 1 || newPage > totalPages)) {
                _context5.next = 3;
                break;
              }
              return _context5.abrupt("return");
            case 3:
              // Check if we already have the data for this page
              // Each page shows 30 records, so calculate the end index needed
              neededEndIndex = newPage * pageSize; // If we have all total records loaded, no need to fetch more
              if (!(runs.length >= totalRecords && neededEndIndex > runs.length)) {
                _context5.next = 8;
                break;
              }
              // eslint-disable-next-line no-console
              console.log('[AgentRunHistory] all records already loaded, showing available data for page', newPage);
              setPageNum(newPage);
              return _context5.abrupt("return");
            case 8:
              if (!(neededEndIndex <= runs.length)) {
                _context5.next = 11;
                break;
              }
              setPageNum(newPage);
              return _context5.abrupt("return");
            case 11:
              // Need to fetch more data from backend
              // Calculate the next record number offset (1-based)
              nextBatchOffset = runs.length + 1; // This is the next record number (121, 241, 361...)
              payload = {
                agent_name: bodyAgentsFilter,
                offset: nextBatchOffset,
                count: 120,
                sid: sid,
                // eslint-disable-line object-shorthand
                earliest: convertTimeRangeToEarliest(timeRange),
                owner: owner // eslint-disable-line object-shorthand
              }; // eslint-disable-next-line no-console

              console.log('[AgentRunHistory] fetching next batch', {
                newPage: newPage,
                nextBatchOffset: nextBatchOffset,
                sid: sid,
                runsLength: runs.length,
                offsetType: 'next_record_number'
              });
              _context5.prev = 14;
              _context5.next = 17;
              return (0, _ResponseHandlerUtil.handleApiCall)(_AgentBuilderApi.agentsRunHistory, ['', payload], {
                errorMessage: 'Failed to fetch agent run history',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 17:
              resp = _context5.sent;
              data = (_resp$payload3 = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload3 !== void 0 ? _resp$payload3 : resp;
              history = Array.isArray(data === null || data === void 0 ? void 0 : data.history) ? data.history : [];
              pagination = (data === null || data === void 0 ? void 0 : data.pagination) || {};
              setSid((data === null || data === void 0 ? void 0 : data.sid) || sid);
              mapped = history.map(function (h, idx) {
                return {
                  id: runs.length + idx + 1,
                  startTime: h._time,
                  agentName: h.agent_name,
                  status: h.type,
                  searchId: h.search_id,
                  owner: agentOwnerMap[h.agent_name] || '-',
                  prompt: h.prompt,
                  response: h.response || 'null',
                  sessionId: h.session_id,
                  processingTime: h.processing_time || 'null',
                  rowIndex: h.row_index
                };
              });
              setRuns(function (prev) {
                return [].concat(_toConsumableArray(prev), _toConsumableArray(mapped));
              });
              setTotalRecords((pagination === null || pagination === void 0 ? void 0 : pagination.total) || totalRecords);
              setPageNum(newPage);
              _context5.next = 31;
              break;
            case 28:
              _context5.prev = 28;
              _context5.t0 = _context5["catch"](14);
              console.error('Error fetching agent run history:', _context5.t0);
            case 31:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[14, 28]]);
      }));
      return function (_x2) {
        return _ref5.apply(this, arguments);
      };
    }(), [agentOwnerMap, bodyAgentsFilter, owner, pageSize, pageNum, runs.length, sid, timeRange, totalPages, totalRecords]);
    if (featureEnabled === null) {
      return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Agents.Container, null, /*#__PURE__*/_react.default.createElement(_Agents.LoadingMessage, null, (0, _i18n.gettext)('Loading…'))));
    }
    if (!featureEnabled) {
      return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Agents.Container, null, /*#__PURE__*/_react.default.createElement(_Agents.DisabledFeatureMessage, null, (0, _i18n.gettext)('Agentic AI feature is disabled. Enable the feature flag to use Agent Run History.'))));
    }
    return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_Header.default, {
      agentsOptions: agentsOptions,
      onAgentsChange: setSelectedAgent,
      onOwnerChange: setOwner,
      onPageNumChange: handlePageNumChange,
      onTimeRangeChange: setTimeRange,
      owner: owner,
      ownerOptions: ownerOptions,
      pageNum: pageNum,
      selectedAgents: selectedAgent,
      timeRange: timeRange,
      totalPages: totalPages
    }), /*#__PURE__*/_react.default.createElement(_Body.default, {
      isLoading: isLoading,
      pageNum: pageNum,
      pageSize: pageSize,
      rows: runs
    }));
  };
  var _default = _exports.default = AgentRunHistory;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentRunHistory/Body/Body.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/@splunk/react-ui/DefinitionList.js"), __webpack_require__("./node_modules/@splunk/react-icons/Checkmark.js"), __webpack_require__("./node_modules/@splunk/react-icons/ExclamationTriangle.js"), __webpack_require__("./src/main/webapp/components/agents/Body/Body.styles.js"), __webpack_require__("./src/main/webapp/components/agents/Agents.styles.js"), __webpack_require__("./src/main/webapp/components/agentRunHistory/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esArraySlice, _react, _propTypes, _i18n, _Modal, _DefinitionList, _Checkmark, _ExclamationTriangle, _Body, _Agents, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _DefinitionList = _interopRequireDefault(_DefinitionList);
  _Checkmark = _interopRequireDefault(_Checkmark);
  _ExclamationTriangle = _interopRequireDefault(_ExclamationTriangle);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var COLUMNS = _constants.COLUMNNAMES;
  var Body = function Body(_ref) {
    var rows = _ref.rows,
      pageNum = _ref.pageNum,
      pageSize = _ref.pageSize,
      isLoading = _ref.isLoading;
    var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      visibleRows = _useState2[0],
      setVisibleRows = _useState2[1];
    var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedRun = _useState4[0],
      setSelectedRun = _useState4[1];
    (0, _react.useEffect)(function () {
      setVisibleRows((rows || []).slice((pageNum - 1) * pageSize, Math.min((rows || []).length, pageNum * pageSize)));
    }, [rows, pageNum, pageSize]);
    var formatStatus = (0, _react.useCallback)(function (status) {
      if (!status) return (0, _i18n.gettext)('-');
      var s = status.toLowerCase();
      switch (s) {
        case 'run_started':
          return /*#__PURE__*/_react.default.createElement("span", {
            style: {
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }
          }, /*#__PURE__*/_react.default.createElement("span", {
            style: {
              fontSize: '14px'
            }
          }, (0, _i18n.gettext)('⏳')), (0, _i18n.gettext)('Run Started'));
        case 'run_failure':
          return /*#__PURE__*/_react.default.createElement("span", {
            style: {
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }
          }, /*#__PURE__*/_react.default.createElement(_ExclamationTriangle.default, {
            style: {
              fontSize: '14px'
            }
          }), (0, _i18n.gettext)('Run Failure'));
        case 'run_finished':
          return /*#__PURE__*/_react.default.createElement("span", {
            style: {
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }
          }, /*#__PURE__*/_react.default.createElement(_Checkmark.default, {
            style: {
              fontSize: '14px'
            }
          }), (0, _i18n.gettext)('Run Finished'));
        case 'finished':
          return /*#__PURE__*/_react.default.createElement("span", {
            style: {
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }
          }, /*#__PURE__*/_react.default.createElement(_Checkmark.default, {
            style: {
              fontSize: '14px'
            }
          }), (0, _i18n.gettext)('Run finished'));
        case 'failed':
          return /*#__PURE__*/_react.default.createElement("span", {
            style: {
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }
          }, /*#__PURE__*/_react.default.createElement(_ExclamationTriangle.default, {
            style: {
              fontSize: '14px'
            }
          }), (0, _i18n.gettext)('Run failed'));
        default:
          return status;
      }
    }, []);
    var onRowClick = function onRowClick(row) {
      return setSelectedRun(row);
    };
    var closeModal = function closeModal() {
      return setSelectedRun(null);
    };
    return /*#__PURE__*/_react.default.createElement(_Body.Container, null, isLoading ? /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '16px',
        color: '#6b6b6b'
      }
    }, (0, _i18n.gettext)('Loading...')) : /*#__PURE__*/_react.default.createElement(_Body.BackgroundWhiteDiv, null, /*#__PURE__*/_react.default.createElement(_Body.Table, {
      "data-test": "AgentRunHistory_Table"
    }, /*#__PURE__*/_react.default.createElement(_Body.Table.Head, null, COLUMNS.map(function (col) {
      return /*#__PURE__*/_react.default.createElement(_Body.PrimaryHeadCell, {
        key: col
      }, col);
    })), /*#__PURE__*/_react.default.createElement(_Body.Table.Body, null, visibleRows.map(function (row, index) {
      var rowBg = index % 2 === 0 ? '#ffffff' : '#f1f3f6';
      return /*#__PURE__*/_react.default.createElement(_Body.Table.Row, {
        key: row.id,
        onClick: function onClick() {
          return onRowClick(row);
        },
        style: {
          backgroundColor: rowBg,
          cursor: 'pointer'
        }
      }, /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.startTime), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.agentName), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, formatStatus(row.status)), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.searchId || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_Body.PrimaryTableCell, {
        bgColor: rowBg
      }, row.owner));
    }))), selectedRun && /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: closeModal,
      open: true,
      style: {
        maxWidth: '640px',
        width: '640px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Agents.AgentModalHeader, {
      onRequestClose: closeModal,
      title: (0, _i18n.gettext)('Run details')
    }), /*#__PURE__*/_react.default.createElement(_Agents.AgentModalBody, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Run start time')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, selectedRun.startTime), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Status')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, formatStatus(selectedRun.status)), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Agent name')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, selectedRun.agentName), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Search ID')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, selectedRun.searchId || (0, _i18n.gettext)('-')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Agent owner')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, selectedRun.owner)), /*#__PURE__*/_react.default.createElement("h4", {
      style: {
        marginTop: 16
      }
    }, (0, _i18n.gettext)('Prompt')), /*#__PURE__*/_react.default.createElement("p", {
      style: {
        whiteSpace: 'pre-wrap'
      }
    }, selectedRun.prompt), /*#__PURE__*/_react.default.createElement("h4", {
      style: {
        marginTop: 16
      }
    }, (0, _i18n.gettext)('Agent response')), /*#__PURE__*/_react.default.createElement("p", {
      style: {
        whiteSpace: 'pre-wrap'
      }
    }, selectedRun.response)))));
  };
  Body.propTypes = {
    pageNum: _propTypes.default.number.isRequired,
    pageSize: _propTypes.default.number.isRequired,
    isLoading: _propTypes.default.bool.isRequired,
    rows: _propTypes.default.arrayOf(_propTypes.default.shape({
      agentName: _propTypes.default.string,
      id: _propTypes.default.number,
      owner: _propTypes.default.string,
      prompt: _propTypes.default.string,
      response: _propTypes.default.string,
      searchId: _propTypes.default.string,
      startTime: _propTypes.default.string,
      status: _propTypes.default.string
    })).isRequired
  };
  var _default = _exports.default = Body;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentRunHistory/Header/Header.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./src/main/webapp/components/agents/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/agentConnections/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/agentRunHistory/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _i18n, _Select, _Paginator, _Header, _Header2, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Select = _interopRequireDefault(_Select);
  _Paginator = _interopRequireDefault(_Paginator);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Header = function Header(_ref) {
    var timeRange = _ref.timeRange,
      onTimeRangeChange = _ref.onTimeRangeChange,
      agentsOptions = _ref.agentsOptions,
      ownerOptions = _ref.ownerOptions,
      selectedAgents = _ref.selectedAgents,
      onAgentsChange = _ref.onAgentsChange,
      owner = _ref.owner,
      onOwnerChange = _ref.onOwnerChange,
      pageNum = _ref.pageNum,
      totalPages = _ref.totalPages,
      onPageNumChange = _ref.onPageNumChange;
    return /*#__PURE__*/_react.default.createElement(_Header2.HeaderContainerNoBorder, {
      style: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }
    }, /*#__PURE__*/_react.default.createElement(_Header.ShowcaseHeaderWrapper, null, /*#__PURE__*/_react.default.createElement(_Header.TitleStyle, null, _constants.TITLE)), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        marginTop: 16,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        gap: 16
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 160
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        marginBottom: 4
      }
    }, (0, _i18n.gettext)('Time range')), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "AgentRunHistory_TimeRange",
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        return onTimeRangeChange(value);
      },
      value: timeRange
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('Past day'),
      value: "1d"
    }), /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('Past 3 days'),
      value: "3d"
    }), /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('Past 7 days'),
      value: "7d"
    }), /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('Past 30 days'),
      value: "30d"
    }))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 200
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        marginBottom: 4
      }
    }, (0, _i18n.gettext)('Agents')), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "AgentRunHistory_Agents",
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return onAgentsChange(value);
      },
      placeholder: (0, _i18n.gettext)('Select agent...'),
      value: selectedAgents
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('All agents'),
      value: ""
    }), agentsOptions.map(function (opt) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: opt.value,
        label: opt.label,
        value: opt.value
      });
    }))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 140
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        marginBottom: 4
      }
    }, (0, _i18n.gettext)('Owner')), /*#__PURE__*/_react.default.createElement(_Select.default, {
      "data-test": "AgentRunHistory_Owner",
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        return onOwnerChange(value);
      },
      value: owner
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('All owners'),
      value: ""
    }), ownerOptions.map(function (opt) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: opt.value,
        label: opt.label,
        value: opt.value
      });
    })))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/_react.default.createElement(_Paginator.default, {
      current: pageNum,
      onChange: function onChange(e, _ref5) {
        var page = _ref5.page;
        return onPageNumChange(page);
      },
      totalPages: totalPages
    }))));
  };
  Header.propTypes = {
    agentsOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })),
    ownerOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })),
    onAgentsChange: _propTypes.default.func,
    onOwnerChange: _propTypes.default.func,
    onPageNumChange: _propTypes.default.func.isRequired,
    onTimeRangeChange: _propTypes.default.func,
    owner: _propTypes.default.string,
    pageNum: _propTypes.default.number.isRequired,
    selectedAgents: _propTypes.default.string,
    timeRange: _propTypes.default.string,
    totalPages: _propTypes.default.number.isRequired
  };
  Header.defaultProps = {
    timeRange: '1d',
    onTimeRangeChange: function onTimeRangeChange() {},
    agentsOptions: [],
    ownerOptions: [],
    selectedAgents: '',
    onAgentsChange: function onAgentsChange() {},
    owner: 'all',
    onOwnerChange: function onOwnerChange() {}
  };
  var _default = _exports.default = Header;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/agentRunHistory/constants.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TITLE = _exports.SUBTITLE = _exports.ROWS = _exports.COLUMNNAMES = void 0;
  var TITLE = _exports.TITLE = (0, _i18n.gettext)('Agent run history');
  var SUBTITLE = _exports.SUBTITLE = (0, _i18n.gettext)('View and filter historical runs for your agents.');
  var COLUMNNAMES = _exports.COLUMNNAMES = [(0, _i18n.gettext)('Run start time'), (0, _i18n.gettext)('Agent name'), (0, _i18n.gettext)('Status'), (0, _i18n.gettext)('Search ID'), (0, _i18n.gettext)('Owner')];
  var ROWS = _exports.ROWS = 30;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/AgentRunHistory.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("agentRunHistory/AgentRunHistory")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _AgentRunHistory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _AgentRunHistory = _interopRequireDefault(_AgentRunHistory);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var AgentRunHistoryRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Agent Run History'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.showcaseView) {
        this.showcaseView.remove();
      }
      this.showcaseView = new _AgentRunHistory.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = AgentRunHistoryRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "agentRunHistory/AgentRunHistory":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/agentRunHistory/AgentRunHistory.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _BaseDashboard, _AgentRunHistory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _AgentRunHistory = _interopRequireDefault(_AgentRunHistory);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * Backbone page that renders the React component tree for Agent Connections
   */

  var Page = (0, _root.hot)(_AgentRunHistory.default);
  var AgentRunHistory = _BaseDashboard.default.extend({
    render: function render() {
      _reactDom.default.render(_react.default.createElement(Page), this.el);
    }
  });
  var _default = _exports.default = AgentRunHistory;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/agent_run_history.es","pages_common"]]]);