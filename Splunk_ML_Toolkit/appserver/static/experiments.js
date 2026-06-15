(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["experiments"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiments.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Experiments.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Experiments, _swcMltk) {
  "use strict";

  _Experiments = _interopRequireDefault(_Experiments);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Experiments.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./node_modules/core-js/internals/string-pad-webkit-bug.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zloirock/core-js/issues/280
var userAgent = __webpack_require__("./node_modules/core-js/internals/engine-user-agent.js");

module.exports = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js/internals/string-pad.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var uncurryThis = __webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js");
var toLength = __webpack_require__("./node_modules/core-js/internals/to-length.js");
var toString = __webpack_require__("./node_modules/core-js/internals/to-string.js");
var $repeat = __webpack_require__("./node_modules/core-js/internals/string-repeat.js");
var requireObjectCoercible = __webpack_require__("./node_modules/core-js/internals/require-object-coercible.js");

var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var ceil = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod = function (IS_END) {
  return function ($this, maxLength, fillString) {
    var S = toString(requireObjectCoercible($this));
    var intMaxLength = toLength(maxLength);
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : toString(fillString);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr === '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};

module.exports = {
  // `String.prototype.padStart` method
  // https://tc39.es/ecma262/#sec-string.prototype.padstart
  start: createMethod(false),
  // `String.prototype.padEnd` method
  // https://tc39.es/ecma262/#sec-string.prototype.padend
  end: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.pad-start.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("./node_modules/core-js/internals/export.js");
var $padStart = __webpack_require__("./node_modules/core-js/internals/string-pad.js").start;
var WEBKIT_BUG = __webpack_require__("./node_modules/core-js/internals/string-pad-webkit-bug.js");

// `String.prototype.padStart` method
// https://tc39.es/ecma262/#sec-string.prototype.padstart
$({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/CreateExperimentModal.jsx":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _Modal, _Button, _ControlGroup, _Select, _Text, _i18n, _ExperimentsListing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
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
  var CreateExperimentModal = function CreateExperimentModal(_ref) {
    var defaultType = _ref.defaultType,
      experimentTypes = _ref.experimentTypes,
      isOpen = _ref.isOpen,
      onClose = _ref.onClose,
      onCreate = _ref.onCreate;
    var _useState = (0, _react.useState)(defaultType || experimentTypes[0] && experimentTypes[0].id || ''),
      _useState2 = _slicedToArray(_useState, 2),
      selectedType = _useState2[0],
      setSelectedType = _useState2[1];
    var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      title = _useState4[0],
      setTitle = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      description = _useState6[0],
      setDescription = _useState6[1];
    var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isCreating = _useState8[0],
      setIsCreating = _useState8[1];
    var _useState9 = (0, _react.useState)(''),
      _useState10 = _slicedToArray(_useState9, 2),
      error = _useState10[0],
      setError = _useState10[1];
    (0, _react.useEffect)(function () {
      if (isOpen) {
        setSelectedType(defaultType || experimentTypes[0] && experimentTypes[0].id || '');
        setTitle('');
        setDescription('');
        setIsCreating(false);
        setError('');
      }
    }, [isOpen, defaultType, experimentTypes]);
    var handleCreate = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setIsCreating(true);
              setError('');
              _context.prev = 2;
              _context.next = 5;
              return onCreate({
                description: description,
                title: title,
                type: selectedType
              });
            case 5:
              _context.next = 11;
              break;
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](2);
              setError(_context.t0 && _context.t0.message || (0, _i18n.gettext)('Failed to create experiment'));
              setIsCreating(false);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 7]]);
      }));
      return function handleCreate() {
        return _ref2.apply(this, arguments);
      };
    }();
    if (!isOpen) return null;
    return /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: onClose,
      open: isOpen
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: onClose,
      title: (0, _i18n.gettext)('Create New Experiment')
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ModalContainer, null, error && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ErrorMessage, null, error), /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: (0, _i18n.gettext)('Experiment Type')
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return setSelectedType(value);
      },
      value: selectedType
    }, experimentTypes.map(function (t) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: t.id,
        label: t.title,
        value: t.id
      });
    }))), /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: (0, _i18n.gettext)('Experiment Title')
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        return setTitle(value);
      },
      value: title
    })), /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: (0, _i18n.gettext)('Description')
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      multiline: true,
      onChange: function onChange(e, _ref5) {
        var value = _ref5.value;
        return setDescription(value);
      },
      placeholder: (0, _i18n.gettext)('Optional'),
      value: description
    })))), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isCreating,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: onClose
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: isCreating,
      label: isCreating ? (0, _i18n.gettext)('Creating...') : (0, _i18n.gettext)('Create'),
      onClick: handleCreate
    })));
  };
  CreateExperimentModal.propTypes = {
    defaultType: _propTypes.default.string,
    experimentTypes: _propTypes.default.arrayOf(_propTypes.default.shape({
      id: _propTypes.default.string.isRequired,
      title: _propTypes.default.string.isRequired
    })).isRequired,
    isOpen: _propTypes.default.bool.isRequired,
    onClose: _propTypes.default.func.isRequired,
    onCreate: _propTypes.default.func.isRequired
  };
  CreateExperimentModal.defaultProps = {
    defaultType: ''
  };
  var _default = _exports.default = CreateExperimentModal;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/ExperimentTypeFilter.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _react, _propTypes, _i18n, _ExperimentsListing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ExperimentTypeFilter = function ExperimentTypeFilter(_ref) {
    var experimentTypes = _ref.experimentTypes,
      selectedType = _ref.selectedType,
      typeCounts = _ref.typeCounts,
      onTypeSelect = _ref.onTypeSelect;
    return /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TypeFilterList, null, experimentTypes.map(function (type) {
      return /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TypeFilterItem, {
        key: type.id
      }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TypeCard, {
        $active: selectedType === type.id,
        "data-test": "".concat(type.id, "-card"),
        onClick: function onClick() {
          return onTypeSelect(type.id);
        }
      }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TypeCardTitle, null, (0, _i18n.gettext)(type.title)), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TypeCardInfo, {
        $active: selectedType === type.id
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "icon ".concat(type.icon)
      }), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TypeCardCount, null, typeCounts[type.id] !== undefined ? typeCounts[type.id] : ''))));
    }));
  };
  ExperimentTypeFilter.propTypes = {
    experimentTypes: _propTypes.default.arrayOf(_propTypes.default.shape({
      id: _propTypes.default.string.isRequired,
      title: _propTypes.default.string.isRequired,
      icon: _propTypes.default.string.isRequired
    })).isRequired,
    selectedType: _propTypes.default.string.isRequired,
    typeCounts: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])).isRequired,
    onTypeSelect: _propTypes.default.func.isRequired
  };
  var _default = _exports.default = ExperimentTypeFilter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Link.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Link, _Table, _themes) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TypeFilterList = _exports.TypeFilterItem = _exports.TypeCardTitle = _exports.TypeCardInfo = _exports.TypeCardCount = _exports.TypeCard = _exports.TruncatedCell = _exports.TableWrapper = _exports.TableInnerStyle = _exports.SectionHeading = _exports.SearchInputWrapper = _exports.RowErrorText = _exports.PaginationContainer = _exports.PageTitle = _exports.PageContainer = _exports.ModalContainer = _exports.MenuItemLink = _exports.ManageLink = _exports.LoadingContainer = _exports.IconCell = _exports.FilterBarSpacer = _exports.FilterBar = _exports.ExperimentLink = _exports.ExpansionCell = _exports.ErrorMessage = _exports.EmptyStateTitle = _exports.EmptyStateMessage = _exports.EmptyState = _exports.EditLink = _exports.DetailsRightColumn = _exports.DetailsLeftColumn = _exports.DetailsLayout = _exports.DescriptionText = _exports.DeleteExperimentName = _exports.CountLabel = _exports.ActionsCell = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Link = _interopRequireDefault(_Link);
  _Table = _interopRequireDefault(_Table);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _templateObject28, _templateObject29, _templateObject30, _templateObject31, _templateObject32, _templateObject33, _templateObject34, _templateObject35;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var PageContainer = _exports.PageContainer = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    padding: 0;\n"])));
  var PageTitle = _exports.PageTitle = _styledComponents.default.h2(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    font-weight: 200;\n"])));
  var TypeFilterList = _exports.TypeFilterList = _styledComponents.default.ul(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    list-style: none;\n    display: table;\n    table-layout: fixed;\n    width: 100%;\n    padding: 0;\n    margin: 0 0 20px;\n"])));
  var TypeFilterItem = _exports.TypeFilterItem = _styledComponents.default.li(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    display: table-cell;\n    padding: 5px;\n"])));
  var TypeCard = _exports.TypeCard = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    height: 90px;\n    vertical-align: top;\n    background: white;\n    padding: 5px;\n    border: 2px solid ", ";\n    position: relative;\n    font-weight: bold;\n    text-align: center;\n    cursor: pointer;\n    transition: border-color 0.15s ease;\n\n    &:hover {\n        border-color: #1e93c6;\n    }\n"])), function (props) {
    return props.$active ? '#1e93c6' : 'white';
  });
  var TypeCardTitle = _exports.TypeCardTitle = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    font-size: 14px;\n    font-weight: bold;\n"])));
  var TypeCardInfo = _exports.TypeCardInfo = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    font-size: 34px;\n    line-height: normal;\n    position: absolute;\n    bottom: 5px;\n    left: 0;\n    width: 100%;\n    text-align: center;\n\n    .icon {\n        color: ", ";\n        fill: ", ";\n        margin-right: 6px;\n    }\n"])), function (props) {
    return props.$active ? '#1e93c6' : '#ccc';
  }, function (props) {
    return props.$active ? '#1e93c6' : '#ccc';
  });
  var TypeCardCount = _exports.TypeCardCount = _styledComponents.default.span(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    font-weight: bold;\n    color: #333;\n"])));
  var FilterBar = _exports.FilterBar = _styledComponents.default.div(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    margin-bottom: 10px;\n    padding: 5px 0;\n"])));
  var CountLabel = _exports.CountLabel = _styledComponents.default.h3(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    flex: 1;\n    font-size: 14px;\n    font-weight: bold;\n    color: #333;\n    white-space: nowrap;\n    margin: 0;\n"])));
  var SearchInputWrapper = _exports.SearchInputWrapper = _styledComponents.default.div(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n    width: 250px;\n    flex: 0 0 250px;\n"])));
  var FilterBarSpacer = _exports.FilterBarSpacer = _styledComponents.default.div(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n    flex: 1;\n"])));
  var TableWrapper = _exports.TableWrapper = _styledComponents.default.div(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n    background-color: white;\n\n    td,\n    th {\n        vertical-align: middle;\n    }\n\n    th i.icon-large {\n        line-height: 1;\n        vertical-align: middle;\n    }\n"])));
  var TableInnerStyle = _exports.TableInnerStyle = {
    width: '100%'
  };
  var ExperimentLink = _exports.ExperimentLink = _styledComponents.default.a(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n    text-decoration: none;\n    color: ", ";\n    line-height: inherit;\n    font-size: inherit;\n\n    &:hover {\n        text-decoration: underline;\n    }\n"])), _themes.variables.linkColor);
  var TruncatedCell = _exports.TruncatedCell = _styledComponents.default.span(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\n    line-height: inherit;\n    font-size: inherit;\n"])));
  var IconCell = _exports.IconCell = _styledComponents.default.span(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\n    color: ", ";\n\n    i {\n        line-height: 1;\n        vertical-align: middle;\n    }\n"])), function (props) {
    return props.$active ? '#1e93c6' : '#bfbfbf';
  });
  var ActionsCell = _exports.ActionsCell = _styledComponents.default.span(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["\n    white-space: nowrap;\n"])));
  var PaginationContainer = _exports.PaginationContainer = _styledComponents.default.div(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: flex-end;\n    margin-bottom: 16px;\n"])));
  var ExpansionCell = _exports.ExpansionCell = (0, _styledComponents.default)(_Table.default.Cell)(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["\n    border-top: none !important;\n"])));
  var EmptyState = _exports.EmptyState = _styledComponents.default.div(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 60px 20px;\n    text-align: center;\n"])));
  var EmptyStateTitle = _exports.EmptyStateTitle = _styledComponents.default.h2(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["\n    font-size: 20px;\n    font-weight: 400;\n    margin-bottom: 12px;\n"])));
  var EmptyStateMessage = _exports.EmptyStateMessage = _styledComponents.default.p(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["\n    color: #666;\n    margin-bottom: 20px;\n"])));
  var LoadingContainer = _exports.LoadingContainer = _styledComponents.default.div(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 80px 20px;\n"])));
  var DescriptionText = _exports.DescriptionText = _styledComponents.default.p(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["\n    display: block;\n    width: 100%;\n    margin: 0 0 12px;\n"])));
  var EditLink = _exports.EditLink = _styledComponents.default.span(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["\n    color: ", ";\n    cursor: pointer;\n\n    &:hover {\n        text-decoration: underline;\n    }\n"])), _themes.variables.linkColor);
  var ManageLink = _exports.ManageLink = _styledComponents.default.span(_templateObject26 || (_templateObject26 = _taggedTemplateLiteral(["\n    color: ", ";\n    cursor: pointer;\n    margin-right: 16px;\n\n    &:hover {\n        text-decoration: underline;\n    }\n"])), _themes.variables.linkColor);
  var RowErrorText = _exports.RowErrorText = _styledComponents.default.span(_templateObject27 || (_templateObject27 = _taggedTemplateLiteral(["\n    color: #999;\n"])));
  var DetailsLayout = _exports.DetailsLayout = _styledComponents.default.div(_templateObject28 || (_templateObject28 = _taggedTemplateLiteral(["\n    display: flex;\n    gap: 115px;\n"])));
  var DetailsLeftColumn = _exports.DetailsLeftColumn = _styledComponents.default.div(_templateObject29 || (_templateObject29 = _taggedTemplateLiteral(["\n    flex: 0 0 auto;\n    min-width: 0;\n    word-wrap: break-word;\n    overflow-wrap: break-word;\n"])));
  var DetailsRightColumn = _exports.DetailsRightColumn = _styledComponents.default.div(_templateObject30 || (_templateObject30 = _taggedTemplateLiteral(["\n    flex: 1;\n    min-width: 0;\n"])));
  var SectionHeading = _exports.SectionHeading = _styledComponents.default.h5(_templateObject31 || (_templateObject31 = _taggedTemplateLiteral(["\n    margin: ", ";\n    font-weight: bold;\n    font-size: 12px;\n    text-transform: uppercase;\n"])), function (props) {
    return props.$first ? '0 0 6px' : '12px 0 6px';
  });
  var MenuItemLink = _exports.MenuItemLink = (0, _styledComponents.default)(_Link.default)(_templateObject32 || (_templateObject32 = _taggedTemplateLiteral(["\n    color: inherit;\n    text-decoration: none;\n"])));
  var ModalContainer = _exports.ModalContainer = _styledComponents.default.div(_templateObject33 || (_templateObject33 = _taggedTemplateLiteral(["\n    width: 600px;\n"])));
  var ErrorMessage = _exports.ErrorMessage = _styledComponents.default.div(_templateObject34 || (_templateObject34 = _taggedTemplateLiteral(["\n    color: #d41f1c;\n    margin-bottom: 12px;\n"])));
  var DeleteExperimentName = _exports.DeleteExperimentName = _styledComponents.default.p(_templateObject35 || (_templateObject35 = _taggedTemplateLiteral(["\n    margin-top: 12px;\n"])));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/ExperimentsListingPage.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.object.values.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.match.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url.js"), __webpack_require__("./node_modules/core-js/modules/web.url.to-json.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-icons/Magnifier.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./node_modules/@splunk/react-ui/WaitSpinner.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastMessages.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/util/themeCompat.es"), __webpack_require__("./src/main/webapp/util/constants.es"), __webpack_require__("./src/main/webapp/components/experiments/shared/constants.es"), __webpack_require__("./src/main/webapp/data/assistantInfo.json"), __webpack_require__("./src/main/webapp/models/CloneModels.es"), __webpack_require__("./src/main/webapp/util/parseSplunkDError.es"), __webpack_require__("./src/main/webapp/util/listVisibleApps.es"), __webpack_require__("experiments/modals/publish/PublishMultiStepModal"), __webpack_require__("./src/main/webapp/models/PolymorphicExperiment.es"), __webpack_require__("./src/main/webapp/models/Alert.es"), __webpack_require__("shared/alertcontrols/dialogs/saveas/Master"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./src/main/webapp/util/telemetry/constants.es"), __webpack_require__("./src/main/webapp/components/shared/ComponentErrorBoundary.jsx"), __webpack_require__("./src/main/webapp/components/classical-shared/ExperimentShell/DeleteConfirmModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentTypeFilter.jsx"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsTable.jsx"), __webpack_require__("./src/main/webapp/components/experiments/listing/TitleDescriptionModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/listing/CreateExperimentModal.jsx"), __webpack_require__("./src/main/webapp/components/experiments/listing/experimentsApi.es"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayIterator, _esArrayMap, _esFunctionName, _esObjectToString, _esObjectValues, _esPromise, _esRegexpExec, _esStringIterator, _esStringMatch, _esStringSearch, _webDomCollectionsIterator, _webUrl, _webUrlToJson, _webUrlSearchParams, _react, _Button, _Text, _Magnifier, _Paginator, _WaitSpinner, _ToastMessages, _ToastConstants, _i18n, _swcMltk, _themeCompat, _constants, _constants2, _assistantInfo, _CloneModels, _parseSplunkDError, _listVisibleApps, _PublishMultiStepModal, _PolymorphicExperiment, _Alert, _Master, _config, _constants3, _ComponentErrorBoundary, _DeleteConfirmModal, _ExperimentTypeFilter, _ExperimentsTable, _TitleDescriptionModal, _CreateExperimentModal, _experimentsApi, _ExperimentsListing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _Button = _interopRequireDefault(_Button);
  _Text = _interopRequireDefault(_Text);
  _Magnifier = _interopRequireDefault(_Magnifier);
  _Paginator = _interopRequireDefault(_Paginator);
  _WaitSpinner = _interopRequireDefault(_WaitSpinner);
  _ToastMessages = _interopRequireDefault(_ToastMessages);
  _assistantInfo = _interopRequireDefault(_assistantInfo);
  _CloneModels = _interopRequireDefault(_CloneModels);
  _parseSplunkDError = _interopRequireDefault(_parseSplunkDError);
  _listVisibleApps = _interopRequireDefault(_listVisibleApps);
  _PublishMultiStepModal = _interopRequireDefault(_PublishMultiStepModal);
  _PolymorphicExperiment = _interopRequireDefault(_PolymorphicExperiment);
  _Alert = _interopRequireDefault(_Alert);
  _Master = _interopRequireDefault(_Master);
  _ComponentErrorBoundary = _interopRequireDefault(_ComponentErrorBoundary);
  _DeleteConfirmModal = _interopRequireDefault(_DeleteConfirmModal);
  _ExperimentTypeFilter = _interopRequireDefault(_ExperimentTypeFilter);
  _ExperimentsTable = _interopRequireDefault(_ExperimentsTable);
  _TitleDescriptionModal = _interopRequireDefault(_TitleDescriptionModal);
  _CreateExperimentModal = _interopRequireDefault(_CreateExperimentModal);
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
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var SORTED_EXPERIMENT_TYPES = [_constants.EXPERIMENT_TYPES.SMART_FORECAST, _constants.EXPERIMENT_TYPES.SMART_OUTLIER_DETECTION, _constants.EXPERIMENT_TYPES.SMART_CLUSTERING, _constants.EXPERIMENT_TYPES.SMART_PREDICTION, _constants.EXPERIMENT_TYPES.PREDICT_NUMERIC_FIELDS, _constants.EXPERIMENT_TYPES.PREDICT_CATEGORICAL_FIELDS, _constants.EXPERIMENT_TYPES.DETECT_NUMERIC_OUTLIERS, _constants.EXPERIMENT_TYPES.DETECT_CATEGORICAL_OUTLIERS, _constants.EXPERIMENT_TYPES.FORECAST_TIME_SERIES, _constants.EXPERIMENT_TYPES.CLUSTER_NUMERIC_EVENTS];
  var experimentTypeMeta = SORTED_EXPERIMENT_TYPES.map(function (type) {
    return {
      id: type,
      icon: _constants2.EXPERIMENT_ICONS[type] || '',
      title: _assistantInfo.default[type] && _assistantInfo.default[type].title || type
    };
  });
  var MODEL_PREFIX = '_exp_';
  var CLONE_MODELS_SAVE_ATTRIBUTES = {
    APP: 'app',
    MODEL_NAME: 'name'
  };
  var getExperimentModelName = function getExperimentModelName(entry) {
    return "".concat(MODEL_PREFIX).concat(entry.name || '');
  };
  var getAllModelNames = function getAllModelNames(entry) {
    return (0, _experimentsApi.parseSearchStages)(entry).map(function (stage) {
      return stage && stage.modelName;
    }).filter(function (name) {
      return name != null;
    });
  };
  var logTelemetry = function logTelemetry(type) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    try {
      if (window._splunk_metrics_events) {
        window._splunk_metrics_events.push({
          data: data,
          type: "".concat(_config.app, ".").concat(type)
        });
      }
    } catch (_e) {
      /* telemetry should never break functionality */
    }
  };
  var buildBackboneExperimentModel = function buildBackboneExperimentModel(entry) {
    var payload = {
      entry: [{
        name: entry.name,
        id: entry.id,
        links: entry.links || {},
        author: entry.author || '',
        acl: entry.acl || {},
        content: _objectSpread({}, entry.content || {}),
        updated: entry.updated || ''
      }]
    };
    var model = new _PolymorphicExperiment.default(payload);
    model.setFromSplunkD(payload);
    var content = entry.content || {};
    var hasStages = content.searchStages && content.searchStages !== '';
    model.entry.content.set('serverValidated', hasStages);
    return model;
  };
  var ITEMS_PER_PAGE = 100;
  var getAppBasePath = function getAppBasePath() {
    var match = window.location.pathname.match(/^(\/[^/]+\/app\/[^/]+)\//);
    if (match) return match[1];
    var localeMatch = window.location.pathname.match(/^\/([^/]+)\//);
    var locale = localeMatch && localeMatch[1] || 'en-US';
    return "/".concat(locale, "/app/Splunk_ML_Toolkit");
  };
  var getExperimentId = function getExperimentId(entry) {
    var rawId = entry && entry.id || entry && entry.name || '';
    try {
      var u = new URL(rawId);
      return u.pathname;
    } catch (e) {
      return rawId;
    }
  };
  var getInitialTypeFromUrl = function getInitialTypeFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var typeFromUrl = params.get('experimentType');
    if (typeFromUrl && SORTED_EXPERIMENT_TYPES.indexOf(typeFromUrl) >= 0) {
      return typeFromUrl;
    }
    return SORTED_EXPERIMENT_TYPES[0];
  };
  var deriveUserPermissions = function deriveUserPermissions() {
    try {
      var user = _swcMltk.SharedModels.get('user');
      if (user) {
        return {
          canCreateAlert: typeof user.canScheduleSearch === 'function' && typeof user.canUseAlerts === 'function' && user.canScheduleSearch() && user.canUseAlerts(),
          canScheduleSearch: typeof user.canScheduleSearch === 'function' && user.canScheduleSearch(),
          resolved: true
        };
      }
    } catch (_e) {
      /* user model may not be available yet */
    }
    return {
      canCreateAlert: false,
      canScheduleSearch: false,
      resolved: false
    };
  };
  var ExperimentsListingPage = function ExperimentsListingPage() {
    var _useState = (0, _react.useState)(getInitialTypeFromUrl),
      _useState2 = _slicedToArray(_useState, 2),
      selectedType = _useState2[0],
      setSelectedType = _useState2[1];
    var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      experiments = _useState4[0],
      setExperiments = _useState4[1];
    var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      totalCount = _useState6[0],
      setTotalCount = _useState6[1];
    var _useState7 = (0, _react.useState)({}),
      _useState8 = _slicedToArray(_useState7, 2),
      typeCounts = _useState8[0],
      setTypeCounts = _useState8[1];
    var _useState9 = (0, _react.useState)(true),
      _useState10 = _slicedToArray(_useState9, 2),
      loading = _useState10[0],
      setLoading = _useState10[1];
    var _useState11 = (0, _react.useState)(deriveUserPermissions),
      _useState12 = _slicedToArray(_useState11, 2),
      userPerms = _useState12[0],
      setUserPerms = _useState12[1];
    (0, _react.useEffect)(function () {
      if (userPerms.resolved) return undefined;
      var retries = 0;
      var MAX_RETRIES = 20;
      var timer = setInterval(function () {
        retries += 1;
        var perms = deriveUserPermissions();
        if (perms.resolved || retries >= MAX_RETRIES) {
          setUserPerms(perms);
          clearInterval(timer);
        }
      }, 250);
      return function () {
        return clearInterval(timer);
      };
    }, [userPerms.resolved]);
    var _useState13 = (0, _react.useState)(true),
      _useState14 = _slicedToArray(_useState13, 2),
      initialLoad = _useState14[0],
      setInitialLoad = _useState14[1];
    var _useState15 = (0, _react.useState)(false),
      _useState16 = _slicedToArray(_useState15, 2),
      countsLoaded = _useState16[0],
      setCountsLoaded = _useState16[1];
    var _useState17 = (0, _react.useState)(''),
      _useState18 = _slicedToArray(_useState17, 2),
      filterText = _useState18[0],
      setFilterText = _useState18[1];
    var _useState19 = (0, _react.useState)(0),
      _useState20 = _slicedToArray(_useState19, 2),
      currentPage = _useState20[0],
      setCurrentPage = _useState20[1];
    var _useState21 = (0, _react.useState)('title'),
      _useState22 = _slicedToArray(_useState21, 2),
      sortKey = _useState22[0],
      setSortKey = _useState22[1];
    var _useState23 = (0, _react.useState)('asc'),
      _useState24 = _slicedToArray(_useState23, 2),
      sortDir = _useState24[0],
      setSortDir = _useState24[1];
    var _useState25 = (0, _react.useState)({
        experiment: null,
        isOpen: false,
        name: ''
      }),
      _useState26 = _slicedToArray(_useState25, 2),
      deleteModal = _useState26[0],
      setDeleteModal = _useState26[1];
    var _useState27 = (0, _react.useState)(false),
      _useState28 = _slicedToArray(_useState27, 2),
      isDeleting = _useState28[0],
      setIsDeleting = _useState28[1];
    var _useState29 = (0, _react.useState)(false),
      _useState30 = _slicedToArray(_useState29, 2),
      deleteSuccess = _useState30[0],
      setDeleteSuccess = _useState30[1];
    var _useState31 = (0, _react.useState)({
        description: '',
        experiment: null,
        isOpen: false,
        title: ''
      }),
      _useState32 = _slicedToArray(_useState31, 2),
      titleDescModal = _useState32[0],
      setTitleDescModal = _useState32[1];
    var _useState33 = (0, _react.useState)({
        defaultType: '',
        isOpen: false
      }),
      _useState34 = _slicedToArray(_useState33, 2),
      createModal = _useState34[0],
      setCreateModal = _useState34[1];
    var _useState35 = (0, _react.useState)({
        appCollection: [],
        cloneModel: null,
        experiment: null,
        experimentModelName: '',
        isOpen: false,
        modelNameList: []
      }),
      _useState36 = _slicedToArray(_useState35, 2),
      publishModal = _useState36[0],
      setPublishModal = _useState36[1];
    var basePath = (0, _react.useMemo)(getAppBasePath, []);
    var toastRef = (0, _react.useRef)(null);
    var createToast = (0, _react.useCallback)(function (options) {
      if (toastRef.current && toastRef.current.createToast) {
        toastRef.current.createToast(options);
      }
    }, []);
    var loadExperiments = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(type, filter, page, sk, sd) {
        var search, data;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setLoading(true);
              _context.prev = 1;
              search = filter ? "title=*".concat(filter, "*") : '';
              _context.next = 5;
              return (0, _experimentsApi.fetchExperiments)({
                count: ITEMS_PER_PAGE,
                experimentType: type,
                offset: page * ITEMS_PER_PAGE,
                search: search,
                sortDir: sd,
                sortKey: sk
              });
            case 5:
              data = _context.sent;
              setExperiments(data.entry || []);
              if (data.paging && data.paging.total !== undefined) {
                setTotalCount(data.paging.total);
              }
              _context.next = 15;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);
              setExperiments([]);
              setTotalCount(0);
              createToast({
                autoDismiss: true,
                dismissOnActionClick: true,
                message: _context.t0 && _context.t0.message || (0, _i18n.gettext)('Failed to load experiments'),
                type: _ToastConstants.TOAST_TYPES.ERROR
              });
            case 15:
              _context.prev = 15;
              setLoading(false);
              setInitialLoad(false);
              return _context.finish(15);
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 10, 15, 19]]);
      }));
      return function (_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      };
    }(), [createToast]);
    var loadAllTypeCounts = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var counts;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            counts = {};
            _context3.next = 3;
            return Promise.all(SORTED_EXPERIMENT_TYPES.map(/*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(type) {
                var data;
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.prev = 0;
                      _context2.next = 3;
                      return (0, _experimentsApi.fetchExperimentCount)({
                        experimentType: type
                      });
                    case 3:
                      data = _context2.sent;
                      counts[type] = data.paging && data.paging.total || 0;
                      _context2.next = 10;
                      break;
                    case 7:
                      _context2.prev = 7;
                      _context2.t0 = _context2["catch"](0);
                      counts[type] = 0;
                    case 10:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2, null, [[0, 7]]);
              }));
              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }()));
          case 3:
            setTypeCounts(counts);
            setCountsLoaded(true);
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })), []);
    var refreshAll = (0, _react.useCallback)(function () {
      loadExperiments(selectedType, filterText, currentPage, sortKey, sortDir);
      loadAllTypeCounts();
    }, [loadExperiments, loadAllTypeCounts, selectedType, filterText, currentPage, sortKey, sortDir]);
    (0, _react.useEffect)(function () {
      loadExperiments(selectedType, filterText, currentPage, sortKey, sortDir);
    }, [selectedType, filterText, currentPage, sortKey, sortDir, loadExperiments]);
    (0, _react.useEffect)(function () {
      loadAllTypeCounts();
    }, [loadAllTypeCounts]);

    // --- Type filter ---
    var handleTypeSelect = (0, _react.useCallback)(function (type) {
      setSelectedType(type);
      setFilterText('');
      setCurrentPage(0);
      setSortKey('title');
      setSortDir('asc');
      try {
        var url = new URL(window.location);
        url.searchParams.set('experimentType', type);
        window.history.replaceState({}, '', url);
      } catch (_e) {
        /* noop */
      }
    }, []);
    var handleFilterChange = (0, _react.useCallback)(function (e, _ref4) {
      var value = _ref4.value;
      setFilterText(value);
      setCurrentPage(0);
    }, []);
    var handleSort = (0, _react.useCallback)(function (e, _ref5) {
      var newKey = _ref5.sortKey;
      setSortKey(function (prev) {
        if (prev === newKey) {
          setSortDir(function (d) {
            return d === 'asc' ? 'desc' : 'asc';
          });
        } else {
          setSortDir('asc');
        }
        return newKey;
      });
      setCurrentPage(0);
    }, []);
    var handlePageChange = (0, _react.useCallback)(function (e, _ref6) {
      var page = _ref6.page;
      setCurrentPage(page - 1);
    }, []);

    // --- Create experiment ---
    var handleCreateOpen = (0, _react.useCallback)(function () {
      setCreateModal({
        defaultType: selectedType,
        isOpen: true
      });
    }, [selectedType]);
    var handleCreateClose = (0, _react.useCallback)(function () {
      setCreateModal({
        defaultType: '',
        isOpen: false
      });
    }, []);
    var handleCreateSubmit = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(_ref7) {
        var description, title, type, data, entry, expId;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              description = _ref7.description, title = _ref7.title, type = _ref7.type;
              _context4.next = 3;
              return (0, _experimentsApi.createExperiment)({
                description: description,
                title: title,
                type: type
              });
            case 3:
              data = _context4.sent;
              entry = data && data.entry && data.entry[0];
              if (entry) {
                expId = getExperimentId(entry);
                logTelemetry(_constants3.CREATE_EXPERIMENT, {
                  experiment_id: entry.name,
                  experimentType: type
                });
                window.location.href = "".concat(basePath, "/").concat(type, "?experimentId=").concat(encodeURIComponent(expId));
              } else {
                handleCreateClose();
                refreshAll();
              }
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    }(), [basePath, handleCreateClose, refreshAll]);

    // --- Delete experiment ---
    var handleDeleteRequest = (0, _react.useCallback)(function (experiment) {
      var name = experiment && experiment.content && experiment.content.title || experiment && experiment.name || '';
      setDeleteModal({
        experiment: experiment,
        isOpen: true,
        name: name
      });
    }, []);
    var handleDeleteConfirm = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var expName;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (deleteModal.experiment) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return");
          case 2:
            setIsDeleting(true);
            _context5.prev = 3;
            expName = deleteModal.experiment && deleteModal.experiment.name || '';
            _context5.next = 7;
            return (0, _experimentsApi.deleteExperiment)(expName);
          case 7:
            setIsDeleting(false);
            setDeleteSuccess(true);
            _context5.next = 15;
            break;
          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](3);
            createToast({
              autoDismiss: true,
              dismissOnActionClick: true,
              message: _context5.t0 && _context5.t0.message || (0, _i18n.gettext)('Failed to delete experiment'),
              type: _ToastConstants.TOAST_TYPES.ERROR
            });
            setIsDeleting(false);
          case 15:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[3, 11]]);
    })), [deleteModal.experiment, createToast]);
    var handleDeleteSuccessClose = (0, _react.useCallback)(function () {
      setDeleteSuccess(false);
      setDeleteModal({
        experiment: null,
        isOpen: false,
        name: ''
      });
      refreshAll();
    }, [refreshAll]);
    var handleDeleteCancel = (0, _react.useCallback)(function () {
      setDeleteModal({
        experiment: null,
        isOpen: false,
        name: ''
      });
    }, []);

    // --- Edit Title and Description ---
    var handleEditTitleDescOpen = (0, _react.useCallback)(function (experiment) {
      setTitleDescModal({
        description: experiment && experiment.content && experiment.content.description || '',
        experiment: experiment,
        isOpen: true,
        title: experiment && experiment.content && experiment.content.title || experiment && experiment.name || ''
      });
    }, []);
    var handleEditTitleDescClose = (0, _react.useCallback)(function () {
      setTitleDescModal({
        description: '',
        experiment: null,
        isOpen: false,
        title: ''
      });
    }, []);
    var handleEditTitleDescSave = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(_ref10) {
        var description, title, expName;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              description = _ref10.description, title = _ref10.title;
              expName = titleDescModal.experiment && titleDescModal.experiment.name || '';
              _context6.next = 4;
              return (0, _experimentsApi.updateExperiment)(expName, {
                description: description,
                title: title
              });
            case 4:
              refreshAll();
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      return function (_x8) {
        return _ref11.apply(this, arguments);
      };
    }(), [titleDescModal.experiment, refreshAll]);

    // --- Schedule Training (legacy SWC dialog, same as Smart Experiments) ---
    var handleScheduleTraining = (0, _react.useCallback)(function (experiment) {
      var experimentModel;
      try {
        experimentModel = buildBackboneExperimentModel(experiment);
      } catch (_e) {
        createToast({
          autoDismiss: true,
          dismissOnActionClick: true,
          message: (0, _i18n.gettext)('Unable to load experiment for scheduling.'),
          type: _ToastConstants.TOAST_TYPES.ERROR
        });
        return;
      }
      var application = _swcMltk.SharedModels.get('app');
      var _experimentModel = experimentModel,
        scheduledTraining = _experimentModel.scheduledTraining;
      var scheduledTrainingPristine = new _swcMltk.ScheduledReportModel();
      var fetchedScheduledTraining = new Promise(function (resolve, reject) {
        experimentModel.fetchScheduledTraining(application, experimentModel.getFetchScheduledTrainingOptions(resolve, reject, scheduledTrainingPristine, scheduledTraining));
      });
      fetchedScheduledTraining.then(function () {
        var scheduledSearchModal = new _swcMltk.ScheduleDialogView({
          model: _objectSpread({}, experimentModel.getScheduledTrainingOptions()),
          successMessage: 'Model training has been scheduled successfully',
          onHiddenRemove: true
        });
        scheduledSearchModal.once('hide', function () {
          experimentModel.createScheduledTraining(application);
          logTelemetry(_constants3.SCHEDULE_EXPERIMENT_TRAINING, {
            experiment_id: experiment.name,
            experimentType: experiment.content && experiment.content.type || '',
            scheduleEnabled: true
          });
          refreshAll();
        });
        scheduledSearchModal.render().appendTo(document.body).show();
      }).catch(function () {
        createToast({
          autoDismiss: true,
          dismissOnActionClick: true,
          message: (0, _i18n.gettext)('Failed to fetch scheduled training data.'),
          type: _ToastConstants.TOAST_TYPES.ERROR
        });
      });
    }, [createToast, refreshAll]);

    // --- Create Alert (legacy SWC dialog, same as Smart Experiments) ---
    var handleCreateAlert = (0, _react.useCallback)(function (experiment) {
      var experimentModel;
      try {
        experimentModel = buildBackboneExperimentModel(experiment);
      } catch (_e) {
        createToast({
          autoDismiss: true,
          dismissOnActionClick: true,
          message: (0, _i18n.gettext)('Unable to load experiment for alert creation.'),
          type: _ToastConstants.TOAST_TYPES.ERROR
        });
        return;
      }
      var alertModel = new _Alert.default();
      var modelDeferred = alertModel.fetchAndInitializeModel(experimentModel);
      modelDeferred.done(function (model) {
        var alertDialog = new _Master.default({
          model: model,
          showSearch: true,
          onHiddenRemove: true
        });
        alertDialog.render().appendTo((0, _swcMltk.jquery)('body')).show();
        if (alertDialog.model.alert.entry.content.get('args.mltk.experiment')) {
          alertDialog.model.alert.on('saveSuccess', function () {
            logTelemetry(_constants3.CREATE_EXPERIMENT_ALERT, {
              experiment_id: experiment.name,
              experimentType: experiment.content && experiment.content.type || ''
            });
            experimentModel.on('alertSuccess', function () {
              return refreshAll();
            });
            experimentModel.setHasAlerts();
          });
        }
      });
    }, [createToast, refreshAll]);

    // --- Publish modal ---
    var handlePublish = (0, _react.useCallback)(function (experiment) {
      var appLocals = new _swcMltk.AppLocalsCollection();
      appLocals.fetch({
        data: {
          count: 0,
          search: 'show_in_nav=true'
        }
      }).done(function () {
        var apps = (0, _listVisibleApps.default)(appLocals);
        if (!apps || apps.length === 0) {
          createToast({
            autoDismiss: true,
            dismissOnActionClick: true,
            message: (0, _i18n.gettext)('No apps available for publishing'),
            type: _ToastConstants.TOAST_TYPES.ERROR
          });
          return;
        }
        var rawId = experiment && experiment.id || '';
        var expPath = rawId;
        try {
          expPath = new URL(rawId).pathname;
        } catch (_e) {
          /* already a path */
        }
        var cloneModel = new _CloneModels.default();
        cloneModel.set(cloneModel.idAttribute, "".concat(expPath, "/clone_models"));
        setPublishModal({
          appCollection: apps,
          cloneModel: cloneModel,
          experiment: experiment,
          experimentModelName: getExperimentModelName(experiment),
          isOpen: true,
          modelNameList: getAllModelNames(experiment)
        });
      }).fail(function (err) {
        createToast({
          autoDismiss: true,
          dismissOnActionClick: true,
          message: err && err.message || (0, _i18n.gettext)('Failed to load apps for publishing'),
          type: _ToastConstants.TOAST_TYPES.ERROR
        });
      });
    }, [createToast]);
    var handlePublishClose = (0, _react.useCallback)(function () {
      setPublishModal(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          isOpen: false
        });
      });
    }, []);
    var handlePublishSubmit = (0, _react.useCallback)(function (submitAttributes) {
      var cloneModel = publishModal.cloneModel;
      if (!cloneModel) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject([{
          type: 'ERROR',
          text: 'No clone model available'
        }]);
      }
      cloneModel.set(submitAttributes);
      return new Promise(function (resolve, reject) {
        cloneModel.save({}, {
          success: function success(model, response) {
            resolve(response.messages);
          },
          error: function error(model, response) {
            reject((0, _parseSplunkDError.default)(response).messages);
          }
        });
      });
    }, [publishModal]);
    var totalAllExperiments = Object.values(typeCounts).reduce(function (sum, count) {
      return sum + (typeof count === 'number' ? count : 0);
    }, 0);
    var totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return /*#__PURE__*/_react.default.createElement(_themeCompat.AITKThemeProvider, null, /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
      ref: toastRef
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "mltk-dashboard-header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "mltk-header-buttons pull-right"
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      label: (0, _i18n.gettext)('Create New Experiment'),
      onClick: handleCreateOpen
    })), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.PageTitle, null, (0, _i18n.gettext)('Experiments'))), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.PageContainer, null, /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "ExperimentTypeFilter"
    }, /*#__PURE__*/_react.default.createElement(_ExperimentTypeFilter.default, {
      experimentTypes: experimentTypeMeta,
      onTypeSelect: handleTypeSelect,
      selectedType: selectedType,
      typeCounts: typeCounts
    })), totalAllExperiments === 0 && !loading && countsLoaded ? /*#__PURE__*/_react.default.createElement(_ExperimentsListing.EmptyState, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.EmptyStateTitle, null, (0, _i18n.gettext)('Select an Assistant to Create an Experiment')), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.EmptyStateMessage, null, (0, _i18n.gettext)('Get started by creating your first experiment.')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      label: (0, _i18n.gettext)('Create Experiment'),
      onClick: handleCreateOpen
    })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.FilterBar, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.CountLabel, null, totalCount, " ", (0, _i18n.gettext)('Experiments')), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.SearchInputWrapper, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      canClear: true,
      inline: true,
      onChange: handleFilterChange,
      placeholder: (0, _i18n.gettext)('Filter by experiment name'),
      startAdornment: /*#__PURE__*/_react.default.createElement(_Magnifier.default, null),
      value: filterText
    })), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.FilterBarSpacer, null)), totalPages > 1 && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.PaginationContainer, null, /*#__PURE__*/_react.default.createElement(_Paginator.default, {
      alwaysShowLastPageLink: true,
      current: currentPage + 1,
      onChange: handlePageChange,
      totalPages: totalPages
    })), initialLoad ? /*#__PURE__*/_react.default.createElement(_ExperimentsListing.LoadingContainer, null, /*#__PURE__*/_react.default.createElement(_WaitSpinner.default, {
      size: "large"
    })) : /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "ExperimentsTable"
    }, /*#__PURE__*/_react.default.createElement(_ExperimentsTable.default, {
      basePath: basePath,
      experiments: experiments,
      onCreateAlert: handleCreateAlert,
      onDelete: handleDeleteRequest,
      onEditTitleDescription: handleEditTitleDescOpen,
      onPublish: handlePublish,
      onScheduleTraining: handleScheduleTraining,
      onSort: handleSort,
      sortDir: sortDir,
      sortKey: sortKey,
      userCanCreateAlert: userPerms.canCreateAlert,
      userCanScheduleSearch: userPerms.canScheduleSearch
    }))), /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "DeleteConfirmModal"
    }, /*#__PURE__*/_react.default.createElement(_DeleteConfirmModal.default, {
      deleteSuccess: deleteSuccess,
      experimentName: deleteModal.name || '',
      isDeleting: isDeleting,
      onClose: handleDeleteCancel,
      onConfirm: handleDeleteConfirm,
      onSuccessClose: handleDeleteSuccessClose,
      open: deleteModal.isOpen
    })), /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "TitleDescriptionModal"
    }, /*#__PURE__*/_react.default.createElement(_TitleDescriptionModal.default, {
      description: titleDescModal.description,
      isOpen: titleDescModal.isOpen,
      onClose: handleEditTitleDescClose,
      onSave: handleEditTitleDescSave,
      title: titleDescModal.title
    })), /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "CreateExperimentModal"
    }, /*#__PURE__*/_react.default.createElement(_CreateExperimentModal.default, {
      defaultType: createModal.defaultType,
      experimentTypes: experimentTypeMeta,
      isOpen: createModal.isOpen,
      onClose: handleCreateClose,
      onCreate: handleCreateSubmit
    })), publishModal.isOpen && publishModal.appCollection.length > 0 && /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
      name: "PublishMultiStepModal"
    }, /*#__PURE__*/_react.default.createElement(_PublishMultiStepModal.default, {
      appCollection: publishModal.appCollection,
      experimentModelName: publishModal.experimentModelName,
      modelNameList: publishModal.modelNameList,
      onClose: handlePublishClose,
      onSubmit: handlePublishSubmit,
      open: publishModal.isOpen,
      submitAttributes: CLONE_MODELS_SAVE_ATTRIBUTES
    }))));
  };
  var _default = _exports.default = ExperimentsListingPage;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/ExperimentsTable.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.match.js"), __webpack_require__("./node_modules/core-js/modules/es.string.pad-start.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url.js"), __webpack_require__("./node_modules/core-js/modules/web.url.to-json.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/DefinitionList.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/listing/ManageMenu.jsx"), __webpack_require__("./src/main/webapp/components/experiments/listing/experimentsApi.es"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayIterator, _esArrayJoin, _esArrayMap, _esFunctionName, _esObjectEntries, _esObjectKeys, _esObjectToString, _esRegexpExec, _esRegexpToString, _esStringIterator, _esStringMatch, _esStringPadStart, _esStringSearch, _webDomCollectionsForEach, _webDomCollectionsIterator, _webUrl, _webUrlToJson, _webUrlSearchParams, _react, _propTypes, _DefinitionList, _Table, _Tooltip, _i18n, _ManageMenu, _experimentsApi, _ExperimentsListing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _DefinitionList = _interopRequireDefault(_DefinitionList);
  _Table = _interopRequireDefault(_Table);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _ManageMenu = _interopRequireDefault(_ManageMenu);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var getExperimentName = function getExperimentName(entry) {
    return entry && entry.content && entry.content.title || entry && entry.name || '';
  };
  var getMainSearchStage = function getMainSearchStage(entry) {
    var stages = (0, _experimentsApi.parseSearchStages)(entry);
    return stages.find(function (s) {
      return s && s.role === 'main';
    }) || null;
  };
  var STAGE_TYPE_ALGORITHMS = {
    anomalydetection: 'Histogram Method',
    apply: 'Model Apply',
    dataset: 'Dataset',
    extracttime: 'Extract Time',
    forecastviz: 'Forecast Visualization',
    joinlookup: 'Join Lookup',
    metrics: 'Metrics',
    predict: 'Kalman Filter',
    rsquaredrmse: 'R² and RMSE',
    spl: 'SPL'
  };
  var OUTLIER_DETECTION_METHODS = {
    stdev: 'Standard Deviation',
    MAD: 'Median Absolute Deviation',
    IQR: 'Interquartile Range'
  };
  var DEFAULT_ALGORITHM_BY_EXPERIMENT_TYPE = {
    predict_numeric_fields: 'LinearRegression',
    predict_categorical_fields: 'LogisticRegression',
    detect_numeric_outliers: 'Standard Deviation',
    detect_categorical_outliers: 'Histogram Method',
    forecast_time_series: 'Kalman Filter',
    smart_forecast: 'StateSpaceForecast',
    smart_outlier_detection: 'DensityFunction',
    smart_clustering: 'KMeans',
    smart_prediction: 'AutoPrediction',
    cluster_numeric_events: 'KMeans'
  };
  var DEFAULT_STAGE_SETTINGS = {
    predict_numeric_fields: {
      type: 'fit',
      algorithm: 'LinearRegression',
      trainingFraction: 70,
      algorithmParams: {
        fit_intercept: true
      }
    },
    predict_categorical_fields: {
      type: 'fit',
      algorithm: 'LogisticRegression',
      trainingFraction: 70,
      algorithmParams: {
        fit_intercept: true
      }
    },
    detect_numeric_outliers: {
      type: 'outlierdetection',
      thresholdMethod: 'stdev',
      thresholdMultiplier: 2,
      useCurrentPoint: true
    },
    detect_categorical_outliers: {
      type: 'anomalydetection',
      params: {
        action: 'annotate'
      }
    },
    forecast_time_series: {
      type: 'predict',
      params: {
        algorithm: 'LLP',
        future_timespan: 5,
        holdback: 0,
        conf_interval: 95
      }
    },
    smart_forecast: {
      type: 'fit',
      algorithm: 'StateSpaceForecast',
      algorithmParams: {
        output_metadata: true
      }
    },
    smart_outlier_detection: {
      type: 'fit',
      algorithm: 'DensityFunction',
      algorithmParams: {
        dist: 'auto',
        threshold: 0.0001,
        show_density: 'true'
      }
    },
    smart_clustering: {
      type: 'fit',
      algorithm: 'KMeans',
      algorithmParams: {}
    },
    smart_prediction: {
      type: 'fit',
      algorithm: 'AutoPrediction',
      algorithmParams: {
        test_split_ratio: 0.3
      }
    },
    cluster_numeric_events: {
      type: 'fit',
      algorithm: 'KMeans',
      algorithmParams: {
        k: 2
      }
    }
  };
  var EXPERIMENT_MODEL_PREFIX = '_exp_';
  var ALGOS_WITHOUT_MODELS_SET = ['ARIMA', 'DBSCAN', 'SpectralClustering'];
  var getEffectiveMainStage = function getEffectiveMainStage(entry) {
    var mainStage = getMainSearchStage(entry);
    if (mainStage) return mainStage;
    var expType = entry && entry.content && entry.content.type || '';
    var defaults = DEFAULT_STAGE_SETTINGS[expType];
    if (!defaults) return null;
    var expName = entry && entry.name || '';
    var stage = _objectSpread({
      role: 'main'
    }, defaults);
    if (stage.type === 'fit' && stage.algorithm && ALGOS_WITHOUT_MODELS_SET.indexOf(stage.algorithm) < 0 && expName) {
      stage.modelName = "".concat(EXPERIMENT_MODEL_PREFIX).concat(expName);
    }
    return stage;
  };
  var getExperimentAlgorithm = function getExperimentAlgorithm(entry) {
    var mainStage = getMainSearchStage(entry);
    if (mainStage) {
      if (mainStage.type === 'fit' && mainStage.algorithm) return mainStage.algorithm;
      if (mainStage.type === 'outlierdetection') {
        return OUTLIER_DETECTION_METHODS[mainStage.thresholdMethod] || '';
      }
      if (mainStage.algorithm) return mainStage.algorithm;
      var mapped = STAGE_TYPE_ALGORITHMS[mainStage.type];
      if (mapped) return mapped;
    }
    var expType = entry && entry.content && entry.content.type || '';
    return DEFAULT_ALGORITHM_BY_EXPERIMENT_TYPE[expType] || 'Unknown';
  };
  var hasSchedule = function hasSchedule(entry) {
    return entry && entry.content && (0, _experimentsApi.toBool)(entry.content.hasSchedule);
  };
  var hasEnabledAlerts = function hasEnabledAlerts(entry) {
    return entry && entry.content && (0, _experimentsApi.toBool)(entry.content.hasEnabledAlerts);
  };
  var getExperimentId = function getExperimentId(entry) {
    var rawId = entry && entry.id || entry && entry.name || '';
    try {
      var url = new URL(rawId);
      return url.pathname;
    } catch (e) {
      return rawId;
    }
  };
  var getExperimentType = function getExperimentType(entry) {
    return entry && entry.content && entry.content.type || '';
  };
  var getAppBasePath = function getAppBasePath() {
    var match = window.location.pathname.match(/^(\/[^/]+\/app\/[^/]+)\//);
    if (match) return match[1];
    var localeMatch = window.location.pathname.match(/^\/([^/]+)\//);
    var locale = localeMatch && localeMatch[1] || 'en-US';
    return "/".concat(locale, "/app/Splunk_ML_Toolkit");
  };
  var buildAssistantLink = function buildAssistantLink(entry) {
    var type = getExperimentType(entry);
    var id = getExperimentId(entry);
    if (!type || !id) return '#';
    return "".concat(getAppBasePath(), "/").concat(type, "?experimentId=").concat(encodeURIComponent(id));
  };
  var getDataSource = function getDataSource(entry) {
    var stages = (0, _experimentsApi.parseSearchStages)(entry);
    var dsStage = stages.find(function (s) {
      return s && s.role === 'datasource';
    });
    if (dsStage) {
      var spl = dsStage.searchString || dsStage.spl || dsStage.search || '';
      if (spl.length > 0) return spl;
    }
    return 'None';
  };
  var formatFieldsList = function formatFieldsList(fields) {
    if (!fields) return '';
    if (typeof fields === 'string') return fields;
    if (Array.isArray(fields)) return fields.join(', ');
    return '';
  };
  var parseParamsObject = function parseParamsObject(raw) {
    if (!raw) return {};
    var params = raw;
    if (typeof params === 'string') {
      try {
        params = JSON.parse(params);
      } catch (_e) {
        return {};
      }
    }
    if (Array.isArray(params)) {
      var map = {};
      params.forEach(function (p) {
        if (p && p.key != null && p.value != null && p.value !== '') {
          map[p.key] = p.value;
        }
      });
      return map;
    }
    if (_typeof(params) === 'object' && params !== null) {
      var filtered = {};
      Object.entries(params).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];
        if (v != null && v !== '') {
          filtered[k] = v;
        }
      });
      return filtered;
    }
    return {};
  };
  var ALGORITHM_PARAM_DEFAULTS = {
    KMeans: {
      k: 2
    },
    Birch: {
      k: 2
    },
    SpectralClustering: {
      k: 2
    },
    DBSCAN: {
      eps: 0.2
    },
    DensityFunction: {
      dist: 'auto',
      threshold: 0.0001,
      show_density: 'true'
    },
    StateSpaceForecast: {
      output_metadata: true
    },
    AutoPrediction: {
      test_split_ratio: 0.3
    },
    LinearRegression: {
      fit_intercept: true
    },
    LogisticRegression: {
      fit_intercept: true
    }
  };
  var getAlgorithmParams = function getAlgorithmParams(stage) {
    var parsed = parseParamsObject(stage && stage.algorithmParams);
    var algo = stage && stage.algorithm || '';
    var defaults = ALGORITHM_PARAM_DEFAULTS[algo];
    if (defaults) {
      var merged = _objectSpread({}, defaults);
      Object.entries(parsed).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          k = _ref4[0],
          v = _ref4[1];
        merged[k] = v;
      });
      return merged;
    }
    return parsed;
  };
  var getStageParams = function getStageParams(stage) {
    return parseParamsObject(stage && stage.params);
  };
  var getFitVerb = function getFitVerb(stage) {
    var algo = stage && stage.algorithm || '';
    if (algo === 'ARIMA') return 'forecast';
    var clusterAlgos = ['KMeans', 'DBSCAN', 'SpectralClustering', 'Birch', 'XMeans'];
    if (clusterAlgos.indexOf(algo) >= 0) return 'cluster';
    return 'predict';
  };
  var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var getModifiedDate = function getModifiedDate(entry) {
    if (!entry || !entry.updated) return '';
    var match = String(entry.updated).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return '';
    var _match = _slicedToArray(match, 7),
      year = _match[1],
      month = _match[2],
      day = _match[3],
      hour = _match[4],
      minute = _match[5],
      second = _match[6];
    var monthName = MONTH_NAMES[parseInt(month, 10) - 1] || month;
    return "".concat(parseInt(day, 10).toString().padStart(2, '0'), " ").concat(monthName, " ").concat(year, " ").concat(hour, ":").concat(minute, ":").concat(second);
  };
  var canWrite = function canWrite(entry) {
    return entry && entry.acl && (entry.acl.can_write === undefined || entry.acl.can_write);
  };
  var getDescription = function getDescription(entry) {
    return entry && entry.content && entry.content.description || '';
  };
  var getStageAlgorithmName = function getStageAlgorithmName(stage) {
    if (!stage) return '';
    if (stage.algorithm) return stage.algorithm;
    return STAGE_TYPE_ALGORITHMS[stage.type] || '';
  };
  var getPreprocessingSteps = function getPreprocessingSteps(entry) {
    var stages = (0, _experimentsApi.parseSearchStages)(entry);
    return stages.filter(function (s) {
      return s && s.role === 'preprocessing';
    }).map(function (s) {
      return {
        algorithm: getStageAlgorithmName(s),
        modelName: s.modelName || ''
      };
    }).filter(function (s) {
      return s.algorithm.length > 0;
    });
  };
  var isServerValidated = function isServerValidated(entry) {
    if (!entry || !entry.content) return false;
    var raw = entry.content.searchStages;
    return typeof raw === 'string' ? raw !== '' : Array.isArray(raw) && raw.length > 0;
  };
  var canBePublished = function canBePublished(entry) {
    if (!isServerValidated(entry)) return false;
    var mainStage = getMainSearchStage(entry);
    if (!mainStage) return false;
    if (mainStage.type !== 'fit') return false;
    var algo = mainStage.algorithm;
    return algo != null && ALGOS_WITHOUT_MODELS_SET.indexOf(algo) < 0;
  };
  var canDeleteAny = function canDeleteAny(experiments) {
    return experiments && experiments.some(function (e) {
      return e && e.acl && (e.acl.removable === undefined || e.acl.removable);
    });
  };
  var ExperimentsTable = function ExperimentsTable(_ref5) {
    var basePath = _ref5.basePath,
      experiments = _ref5.experiments,
      onCreateAlert = _ref5.onCreateAlert,
      onDelete = _ref5.onDelete,
      onEditTitleDescription = _ref5.onEditTitleDescription,
      onPublish = _ref5.onPublish,
      onScheduleTraining = _ref5.onScheduleTraining,
      onSort = _ref5.onSort,
      sortDir = _ref5.sortDir,
      sortKey = _ref5.sortKey,
      userCanCreateAlert = _ref5.userCanCreateAlert,
      userCanScheduleSearch = _ref5.userCanScheduleSearch;
    var hasActions = experiments.length === 0 || canDeleteAny(experiments);
    var appBase = basePath || getAppBasePath();
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      expandedRowId = _useState2[0],
      setExpandedRowId = _useState2[1];
    var handleRowExpansion = function handleRowExpansion(rowId) {
      setExpandedRowId(function (prev) {
        return prev === rowId ? null : rowId;
      });
    };
    function getExpansionRow(row) {
      try {
        var mainStage = getEffectiveMainStage(row);
        var stageType = mainStage ? mainStage.type : '';
        var algo = getExperimentAlgorithm(row);
        var params = getAlgorithmParams(mainStage);
        var targetVars = formatFieldsList(mainStage && mainStage.targetVariables);
        var featureVars = formatFieldsList(mainStage && mainStage.featureVariables);
        var modelName = mainStage ? mainStage.modelName : '';
        var verb = getFitVerb(mainStage);
        var trainingFraction = mainStage && mainStage.trainingFraction;
        var trainingTestSplit = trainingFraction != null ? "".concat(trainingFraction, "/").concat(100 - trainingFraction) : null;
        var description = getDescription(row);
        var writable = canWrite(row);
        var preprocessingSteps = getPreprocessingSteps(row);
        var renderFitSettings = function renderFitSettings() {
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, targetVars && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)("Field(s) to ".concat(verb))), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, targetVars)), featureVars && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)("Fields to use for ".concat(verb, "ing"))), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, featureVars)), trainingTestSplit && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Split for training/test')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, trainingTestSplit)), Object.entries(params).map(function (_ref6) {
            var _ref7 = _slicedToArray(_ref6, 2),
              k = _ref7[0],
              v = _ref7[1];
            return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
              key: k
            }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, k), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, String(v)));
          }), modelName && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Model Name')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, modelName)));
        };
        var renderPredictSettings = function renderPredictSettings() {
          var fields = formatFieldsList(mainStage && (mainStage.fields || mainStage.targetVariables));
          var predictParams = getStageParams(mainStage);
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, fields && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Field(s) to forecast')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, fields)), Object.entries(predictParams).map(function (_ref8) {
            var _ref9 = _slicedToArray(_ref8, 2),
              k = _ref9[0],
              v = _ref9[1];
            return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
              key: k
            }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, k), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, String(v)));
          }));
        };
        var renderAnomalySettings = function renderAnomalySettings() {
          var fields = formatFieldsList(mainStage && (mainStage.fields || mainStage.targetVariables));
          return fields ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Field(s) to analyze')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, fields)) : null;
        };
        var renderOutlierSettings = function renderOutlierSettings() {
          var outlierFields = formatFieldsList(mainStage && mainStage.outlierFields);
          var splitByFields = formatFieldsList(mainStage && mainStage.splitByFields);
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, outlierFields && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Field to analyze')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, outlierFields)), splitByFields && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Split by fields')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, splitByFields)));
        };
        var renderStageSettings = function renderStageSettings() {
          switch (stageType) {
            case 'fit':
              return renderFitSettings();
            case 'predict':
              return renderPredictSettings();
            case 'anomalydetection':
              return renderAnomalySettings();
            case 'outlierdetection':
              return renderOutlierSettings();
            default:
              return null;
          }
        };
        return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
          key: "".concat(getExperimentId(row), "-expansion")
        }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ExpansionCell, {
          colSpan: 6
        }, /*#__PURE__*/_react.default.createElement("div", null, description && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.DescriptionText, null, description, ' ', writable && onEditTitleDescription && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.EditLink, {
          onClick: function onClick(e) {
            e.stopPropagation();
            onEditTitleDescription(row);
          }
        }, (0, _i18n.gettext)('Edit'))), /*#__PURE__*/_react.default.createElement(_ExperimentsListing.DetailsLayout, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.DetailsLeftColumn, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Data Source')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, getDataSource(row)), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Modified')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, getModifiedDate(row) || (0, _i18n.gettext)('Unknown'))), preprocessingSteps.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.SectionHeading, null, (0, _i18n.gettext)('Preprocessing Steps')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default, null, preprocessingSteps.map(function (step) {
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
            key: step.algorithm
          }, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Algorithm')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, step.algorithm), step.modelName && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Model Name')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, step.modelName)));
        })))), mainStage && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.DetailsRightColumn, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.SectionHeading, {
          $first: true
        }, (0, _i18n.gettext)('Experiment Settings')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default, null, /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Term, null, (0, _i18n.gettext)('Algorithm')), /*#__PURE__*/_react.default.createElement(_DefinitionList.default.Description, null, algo), renderStageSettings()))))));
      } catch (err) {
        var rowName = row && row.name || 'unknown';
        console.error("[ExperimentsTable] Failed to render expansion row for \"".concat(rowName, "\":"), err);
        return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
          key: "".concat(rowName, "-expansion-error")
        }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ExpansionCell, {
          colSpan: 6
        }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.RowErrorText, null, (0, _i18n.gettext)('Unable to load experiment details.'))));
      }
    }
    return /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TableWrapper, null, /*#__PURE__*/_react.default.createElement(_Table.default, {
      innerStyle: _ExperimentsListing.TableInnerStyle,
      rowExpansion: "controlled",
      stripeRows: true
    }, /*#__PURE__*/_react.default.createElement(_Table.default.Head, null, /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
      onSort: onSort,
      sortDir: sortKey === 'title' ? sortDir : 'none',
      sortKey: "title"
    }, (0, _i18n.gettext)('Experiment Name')), /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, null, (0, _i18n.gettext)('Algorithm')), /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
      width: 40
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: (0, _i18n.gettext)('Scheduled Training')
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "icon-large icon-clock"
    }))), /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
      width: 40
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      content: (0, _i18n.gettext)('Alerts')
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "icon-large icon-bell"
    }))), hasActions && /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, null, (0, _i18n.gettext)('Actions'))), /*#__PURE__*/_react.default.createElement(_Table.default.Body, null, experiments.map(function (experiment, idx) {
      var name, algorithm, scheduled, alertsActive, expId, publishable, link;
      try {
        name = getExperimentName(experiment);
        algorithm = getExperimentAlgorithm(experiment);
        scheduled = hasSchedule(experiment);
        alertsActive = hasEnabledAlerts(experiment);
        expId = getExperimentId(experiment) || String(idx);
        publishable = canBePublished(experiment);
        link = buildAssistantLink(experiment);
      } catch (err) {
        name = experiment && experiment.name || '';
        expId = String(idx);
        console.error("[ExperimentsTable] Error processing row \"".concat(name, "\":"), err);
        return null;
      }
      return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
        key: expId,
        expanded: expId === expandedRowId,
        expansionRow: getExpansionRow(experiment),
        onExpansion: function onExpansion() {
          return handleRowExpansion(expId);
        }
      }, /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ExperimentLink, {
        href: link,
        title: name
      }, name)), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.TruncatedCell, {
        title: algorithm
      }, algorithm)), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: scheduled ? (0, _i18n.gettext)('Scheduled training') : (0, _i18n.gettext)('No scheduled training')
      }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.IconCell, {
        $active: scheduled
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "icon-large icon-clock"
      })))), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: alertsActive ? (0, _i18n.gettext)('Active alerts') : (0, _i18n.gettext)('No active alerts')
      }, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.IconCell, {
        $active: alertsActive
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "icon-large icon-bell"
      })))), hasActions && /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ActionsCell, null, /*#__PURE__*/_react.default.createElement(_ManageMenu.default, {
        basePath: appBase,
        experiment: experiment,
        onCreateAlert: onCreateAlert,
        onDelete: onDelete,
        onEditTitleDescription: onEditTitleDescription,
        onScheduleTraining: onScheduleTraining,
        userCanCreateAlert: userCanCreateAlert,
        userCanScheduleSearch: userCanScheduleSearch
      }), publishable && onPublish && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.EditLink, {
        onClick: function onClick(e) {
          e.stopPropagation();
          onPublish(experiment);
        }
      }, (0, _i18n.gettext)('Publish')))));
    }))));
  };
  ExperimentsTable.propTypes = {
    basePath: _propTypes.default.string,
    experiments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
    onCreateAlert: _propTypes.default.func,
    onDelete: _propTypes.default.func,
    onEditTitleDescription: _propTypes.default.func,
    onPublish: _propTypes.default.func,
    onScheduleTraining: _propTypes.default.func,
    onSort: _propTypes.default.func,
    sortDir: _propTypes.default.string,
    sortKey: _propTypes.default.string,
    userCanCreateAlert: _propTypes.default.bool,
    userCanScheduleSearch: _propTypes.default.bool
  };
  ExperimentsTable.defaultProps = {
    basePath: '',
    onCreateAlert: null,
    onDelete: null,
    onEditTitleDescription: null,
    onPublish: null,
    onScheduleTraining: null,
    onSort: null,
    sortDir: 'asc',
    sortKey: 'title',
    userCanCreateAlert: true,
    userCanScheduleSearch: true
  };
  var _default = _exports.default = ExperimentsTable;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/ManageMenu.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.replace.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url.js"), __webpack_require__("./node_modules/core-js/modules/web.url.to-json.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/listing/experimentsApi.es"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFind, _esArrayIterator, _esFunctionName, _esObjectToString, _esRegexpExec, _esStringIterator, _esStringReplace, _webDomCollectionsIterator, _webUrl, _webUrlToJson, _webUrlSearchParams, _react, _propTypes, _Dropdown, _Menu, _i18n, _experimentsApi, _ExperimentsListing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var canWrite = function canWrite(entry) {
    return entry && entry.acl && (entry.acl.can_write === undefined || entry.acl.can_write);
  };
  var canDelete = function canDelete(entry) {
    return entry && entry.acl && (entry.acl.removable === undefined || entry.acl.removable);
  };
  var hasAlerts = function hasAlerts(entry) {
    return entry && entry.content && (0, _experimentsApi.toBool)(entry.content.hasAlerts);
  };
  var hasSchedule = function hasSchedule(entry) {
    return entry && entry.content && (0, _experimentsApi.toBool)(entry.content.hasSchedule);
  };
  var canBeScheduled = function canBeScheduled(entry) {
    var stages = (0, _experimentsApi.parseSearchStages)(entry);
    var mainStage = stages.find(function (s) {
      return s && s.role === 'main';
    });
    return mainStage != null && mainStage.type === 'fit';
  };
  var canCreateAlertForEntry = function canCreateAlertForEntry(entry) {
    var stages = (0, _experimentsApi.parseSearchStages)(entry);
    var dataSource = stages.find(function (s) {
      return s && s.role === 'datasource';
    });
    var mainStage = stages.find(function (s) {
      return s && s.role === 'main';
    });
    if (!dataSource || !mainStage) return false;
    var baseSPL = dataSource.searchString || dataSource.spl || '';
    return baseSPL.length > 0;
  };
  var getScheduledTrainingName = function getScheduledTrainingName(entry) {
    return "".concat(entry && entry.name || '', "_training");
  };
  var getManageAlertsUrl = function getManageAlertsUrl(experiment, basePath) {
    var rawId = experiment && experiment.id || '';
    var id = rawId;
    try {
      var u = new URL(rawId);
      id = u.pathname;
    } catch (_e) {
      /* keep rawId */
    }
    var type = experiment && experiment.content && experiment.content.type || '';
    var url = "".concat(basePath, "/experiment_alerts?experimentId=").concat(encodeURIComponent(id), "&experimentType=").concat(encodeURIComponent(type));
    return url.replace('/undefined', '');
  };
  var getScheduledJobsUrl = function getScheduledJobsUrl(experiment, basePath) {
    var name = getScheduledTrainingName(experiment);
    return "".concat(basePath, "/job_manager?filter=").concat(encodeURIComponent(name));
  };
  var ManageMenu = function ManageMenu(_ref) {
    var basePath = _ref.basePath,
      experiment = _ref.experiment,
      onCreateAlert = _ref.onCreateAlert,
      onDelete = _ref.onDelete,
      onEditTitleDescription = _ref.onEditTitleDescription,
      onScheduleTraining = _ref.onScheduleTraining,
      userCanCreateAlert = _ref.userCanCreateAlert,
      userCanScheduleSearch = _ref.userCanScheduleSearch;
    if (!canWrite(experiment)) return null;
    var writable = canWrite(experiment);
    var deletable = canDelete(experiment);
    var alerts = hasAlerts(experiment);
    var scheduled = hasSchedule(experiment);
    var schedulable = canBeScheduled(experiment);
    var alertable = canCreateAlertForEntry(experiment);
    var toggle = /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ManageLink, null, (0, _i18n.gettext)("Manage \u25BE"));
    return /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: toggle
    }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, userCanCreateAlert && alertable && onCreateAlert && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return onCreateAlert(experiment);
      }
    }, (0, _i18n.gettext)('Create Alert')), alerts && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        window.location.href = getManageAlertsUrl(experiment, basePath);
      }
    }, (0, _i18n.gettext)('Manage Alerts')), writable && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        if (onEditTitleDescription) onEditTitleDescription(experiment);
      }
    }, (0, _i18n.gettext)('Edit Title and Description')), userCanScheduleSearch && schedulable && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        if (onScheduleTraining) onScheduleTraining(experiment);
      }
    }, scheduled ? (0, _i18n.gettext)('Edit Training Schedule') : (0, _i18n.gettext)('Schedule Training')), scheduled && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        window.open(getScheduledJobsUrl(experiment, basePath), '_blank');
      }
    }, (0, _i18n.gettext)('View Scheduled Training Jobs')), deletable && /*#__PURE__*/_react.default.createElement(_Menu.default.Divider, null), deletable && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        if (onDelete) onDelete(experiment);
      }
    }, (0, _i18n.gettext)('Delete'))));
  };
  ManageMenu.propTypes = {
    basePath: _propTypes.default.string.isRequired,
    experiment: _propTypes.default.object.isRequired,
    onCreateAlert: _propTypes.default.func,
    onDelete: _propTypes.default.func,
    onEditTitleDescription: _propTypes.default.func,
    onScheduleTraining: _propTypes.default.func,
    userCanCreateAlert: _propTypes.default.bool,
    userCanScheduleSearch: _propTypes.default.bool
  };
  ManageMenu.defaultProps = {
    onCreateAlert: null,
    onDelete: null,
    onEditTitleDescription: null,
    onScheduleTraining: null,
    userCanCreateAlert: true,
    userCanScheduleSearch: true
  };
  var _default = _exports.default = ManageMenu;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/TitleDescriptionModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/ControlGroup.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListing.styles.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _react, _propTypes, _Modal, _Button, _ControlGroup, _Text, _i18n, _ExperimentsListing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _ControlGroup = _interopRequireDefault(_ControlGroup);
  _Text = _interopRequireDefault(_Text);
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
  var TitleDescriptionModal = function TitleDescriptionModal(_ref) {
    var description = _ref.description,
      isOpen = _ref.isOpen,
      onClose = _ref.onClose,
      onSave = _ref.onSave,
      title = _ref.title;
    var _useState = (0, _react.useState)(title),
      _useState2 = _slicedToArray(_useState, 2),
      editTitle = _useState2[0],
      setEditTitle = _useState2[1];
    var _useState3 = (0, _react.useState)(description),
      _useState4 = _slicedToArray(_useState3, 2),
      editDescription = _useState4[0],
      setEditDescription = _useState4[1];
    var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isSaving = _useState6[0],
      setIsSaving = _useState6[1];
    var _useState7 = (0, _react.useState)(''),
      _useState8 = _slicedToArray(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];
    (0, _react.useEffect)(function () {
      if (isOpen) {
        setEditTitle(title);
        setEditDescription(description);
        setIsSaving(false);
        setError('');
      }
    }, [isOpen, title, description]);
    var handleSave = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setIsSaving(true);
              setError('');
              _context.prev = 2;
              _context.next = 5;
              return onSave({
                description: editDescription,
                title: editTitle
              });
            case 5:
              onClose();
              _context.next = 11;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              setError(_context.t0 && _context.t0.message || (0, _i18n.gettext)('Save failed'));
            case 11:
              _context.prev = 11;
              setIsSaving(false);
              return _context.finish(11);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 8, 11, 14]]);
      }));
      return function handleSave() {
        return _ref2.apply(this, arguments);
      };
    }();
    if (!isOpen) return null;
    return /*#__PURE__*/_react.default.createElement(_Modal.default, {
      onRequestClose: onClose,
      open: isOpen
    }, /*#__PURE__*/_react.default.createElement(_Modal.default.Header, {
      onRequestClose: onClose,
      title: (0, _i18n.gettext)('Edit Title and Description')
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ModalContainer, null, error && /*#__PURE__*/_react.default.createElement(_ExperimentsListing.ErrorMessage, null, error), /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: (0, _i18n.gettext)('Experiment Title')
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return setEditTitle(value);
      },
      value: editTitle
    })), /*#__PURE__*/_react.default.createElement(_ControlGroup.default, {
      label: (0, _i18n.gettext)('Description')
    }, /*#__PURE__*/_react.default.createElement(_Text.default, {
      multiline: true,
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        return setEditDescription(value);
      },
      placeholder: (0, _i18n.gettext)('Optional'),
      value: editDescription
    })))), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: onClose
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: isSaving,
      label: isSaving ? (0, _i18n.gettext)('Saving...') : (0, _i18n.gettext)('Save'),
      onClick: handleSave
    })));
  };
  TitleDescriptionModal.propTypes = {
    description: _propTypes.default.string,
    isOpen: _propTypes.default.bool.isRequired,
    onClose: _propTypes.default.func.isRequired,
    onSave: _propTypes.default.func.isRequired,
    title: _propTypes.default.string
  };
  TitleDescriptionModal.defaultProps = {
    description: '',
    title: ''
  };
  var _default = _exports.default = TitleDescriptionModal;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/experiments/listing/experimentsApi.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.replace.js"), __webpack_require__("./node_modules/core-js/modules/es.string.search.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/core-js/modules/web.url-search-params.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/fetch.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayIterator, _esArrayJoin, _esArrayMap, _esFunctionName, _esObjectEntries, _esObjectKeys, _esObjectToString, _esPromise, _esRegexpExec, _esRegexpToString, _esStringIterator, _esStringReplace, _esStringSearch, _webDomCollectionsForEach, _webDomCollectionsIterator, _webUrlSearchParams, _config, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateExperiment = _exports.toBool = _exports.saveSavedSearch = _exports.parseSearchStages = _exports.fetchSavedSearchDefaults = _exports.fetchSavedSearch = _exports.fetchIsCloud = _exports.fetchExperiments = _exports.fetchExperimentCount = _exports.fetchAlertActions = _exports.fetchAlertActionUI = _exports.deleteExperiment = _exports.createExperiment = _exports.createAlert = _exports.cloneModels = void 0;
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
  function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { throw: 1, return: 2, break: 3, continue: 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, catch: function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
  function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
  function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
  function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
  function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
  function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
  function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
  function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
  function _OverloadYield(e, d) { this.v = e, this.k = d; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  var urlEncodedAppName = encodeURIComponent(_config.app);
  var urlEncodedUsername = encodeURIComponent(_config.username);
  var baseUrl = "".concat(_config.splunkdPath, "/servicesNS/").concat(urlEncodedUsername, "/").concat(urlEncodedAppName, "/mltk/experiments");
  var savedSearchesUrl = "".concat(_config.splunkdPath, "/servicesNS/").concat(urlEncodedUsername, "/").concat(urlEncodedAppName, "/saved/searches");
  var fetchExperiments = _exports.fetchExperiments = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _ref2,
        experimentType,
        _ref2$search,
        search,
        _ref2$sortKey,
        sortKey,
        _ref2$sortDir,
        sortDir,
        _ref2$count,
        count,
        _ref2$offset,
        offset,
        params,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, experimentType = _ref2.experimentType, _ref2$search = _ref2.search, search = _ref2$search === void 0 ? '' : _ref2$search, _ref2$sortKey = _ref2.sortKey, sortKey = _ref2$sortKey === void 0 ? 'title' : _ref2$sortKey, _ref2$sortDir = _ref2.sortDir, sortDir = _ref2$sortDir === void 0 ? 'asc' : _ref2$sortDir, _ref2$count = _ref2.count, count = _ref2$count === void 0 ? 100 : _ref2$count, _ref2$offset = _ref2.offset, offset = _ref2$offset === void 0 ? 0 : _ref2$offset;
            params = new URLSearchParams({
              output_mode: 'json',
              sort_dir: sortDir,
              sort_key: sortKey,
              sort_mode: 'natural',
              count: count.toString(),
              offset: offset.toString()
            });
            if (experimentType && search) {
              params.set('search', "(".concat(search, ") AND (type=").concat(experimentType, ")"));
            } else if (experimentType) {
              params.set('search', "type=".concat(experimentType));
            } else if (search) {
              params.set('search', search);
            }
            return _context.abrupt("return", fetch("".concat(baseUrl, "?").concat(params.toString()), _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            })).then((0, _fetch.handleResponse)(200)));
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function fetchExperiments() {
      return _ref.apply(this, arguments);
    };
  }();
  var fetchExperimentCount = _exports.fetchExperimentCount = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _ref4,
        experimentType,
        params,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _ref4 = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {}, experimentType = _ref4.experimentType;
            params = new URLSearchParams({
              output_mode: 'json',
              count: '1'
            });
            if (experimentType) {
              params.set('search', "type=".concat(experimentType));
            }
            return _context2.abrupt("return", fetch("".concat(baseUrl, "?").concat(params.toString()), _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            })).then((0, _fetch.handleResponse)(200)));
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function fetchExperimentCount() {
      return _ref3.apply(this, arguments);
    };
  }();
  var createExperiment = _exports.createExperiment = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref5) {
      var type, title, description, params, body, fetchDefaults;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            type = _ref5.type, title = _ref5.title, description = _ref5.description;
            params = new URLSearchParams({
              output_mode: 'json',
              app: _config.app,
              owner: _config.username
            });
            body = new URLSearchParams();
            body.set('type', type);
            if (title) body.set('title', title);
            if (description) body.set('description', description);
            fetchDefaults = (0, _fetch.getDefaultFetchInit)();
            return _context3.abrupt("return", fetch("".concat(baseUrl, "?").concat(params.toString()), _objectSpread(_objectSpread({}, fetchDefaults), {}, {
              method: 'POST',
              headers: _objectSpread(_objectSpread({}, fetchDefaults.headers), {}, {
                'Content-Type': 'application/x-www-form-urlencoded'
              }),
              body: body.toString()
            })).then((0, _fetch.handleResponse)(201)));
          case 8:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function createExperiment(_x) {
      return _ref6.apply(this, arguments);
    };
  }();
  var updateExperiment = _exports.updateExperiment = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(experimentName) {
      var _ref8,
        title,
        description,
        hasAlerts,
        hasEnabledAlerts,
        hasSchedule,
        encodedName,
        params,
        body,
        hasRename,
        fetchDefaults,
        _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _ref8 = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {}, title = _ref8.title, description = _ref8.description, hasAlerts = _ref8.hasAlerts, hasEnabledAlerts = _ref8.hasEnabledAlerts, hasSchedule = _ref8.hasSchedule;
            encodedName = encodeURIComponent(experimentName);
            params = new URLSearchParams({
              output_mode: 'json'
            });
            body = new URLSearchParams();
            hasRename = title !== undefined || description !== undefined;
            if (hasRename) {
              body.set('exp-operation', 'rename');
              if (title !== undefined) body.set('title', title);
              if (description !== undefined) body.set('description', description);
            }
            if (hasAlerts !== undefined) body.set('hasAlerts', String(hasAlerts));
            if (hasEnabledAlerts !== undefined) body.set('hasEnabledAlerts', String(hasEnabledAlerts));
            if (hasSchedule !== undefined) body.set('hasSchedule', String(hasSchedule));
            fetchDefaults = (0, _fetch.getDefaultFetchInit)();
            return _context4.abrupt("return", fetch("".concat(baseUrl, "/").concat(encodedName, "?").concat(params.toString()), _objectSpread(_objectSpread({}, fetchDefaults), {}, {
              method: 'POST',
              headers: _objectSpread(_objectSpread({}, fetchDefaults.headers), {}, {
                'Content-Type': 'application/x-www-form-urlencoded'
              }),
              body: body.toString()
            })).then((0, _fetch.handleResponse)(200)));
          case 11:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function updateExperiment(_x2) {
      return _ref7.apply(this, arguments);
    };
  }();
  var deleteExperiment = _exports.deleteExperiment = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(experimentName) {
      var encodedName;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            encodedName = encodeURIComponent(experimentName);
            return _context5.abrupt("return", fetch("".concat(baseUrl, "/").concat(encodedName, "?output_mode=json"), _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'DELETE'
            })).then((0, _fetch.handleResponse)(200)));
          case 2:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function deleteExperiment(_x3) {
      return _ref9.apply(this, arguments);
    };
  }();
  var cloneModels = _exports.cloneModels = /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(experimentName, _ref10) {
      var modelName, targetApp, encodedName, fetchDefaults;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            modelName = _ref10.name, targetApp = _ref10.app;
            encodedName = encodeURIComponent(experimentName);
            fetchDefaults = (0, _fetch.getDefaultFetchInit)();
            return _context6.abrupt("return", fetch("".concat(baseUrl, "/").concat(encodedName, "/clone_models?output_mode=json"), _objectSpread(_objectSpread({}, fetchDefaults), {}, {
              method: 'POST',
              headers: _objectSpread(_objectSpread({}, fetchDefaults.headers), {}, {
                'Content-Type': 'application/json; charset=utf-8'
              }),
              body: JSON.stringify({
                name: modelName,
                app: targetApp
              })
            })).then((0, _fetch.handleResponse)(200)));
          case 4:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function cloneModels(_x4, _x5) {
      return _ref11.apply(this, arguments);
    };
  }();
  var fetchSavedSearchDefaults = _exports.fetchSavedSearchDefaults = /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var url, resp, data;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            url = "".concat(_config.splunkdPath, "/services/saved/searches/_new?output_mode=json");
            _context7.prev = 1;
            _context7.next = 4;
            return fetch(url, _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            }));
          case 4:
            resp = _context7.sent;
            if (resp.ok) {
              _context7.next = 7;
              break;
            }
            return _context7.abrupt("return", null);
          case 7:
            _context7.next = 9;
            return resp.json();
          case 9:
            data = _context7.sent;
            if (!(data && data.entry && data.entry.length > 0)) {
              _context7.next = 12;
              break;
            }
            return _context7.abrupt("return", data.entry[0].content || null);
          case 12:
            return _context7.abrupt("return", null);
          case 15:
            _context7.prev = 15;
            _context7.t0 = _context7["catch"](1);
            return _context7.abrupt("return", null);
          case 18:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[1, 15]]);
    }));
    return function fetchSavedSearchDefaults() {
      return _ref12.apply(this, arguments);
    };
  }();
  var fetchSavedSearch = _exports.fetchSavedSearch = /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(searchName) {
      var encodedName, resp;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            encodedName = encodeURIComponent(searchName);
            _context8.next = 3;
            return fetch("".concat(savedSearchesUrl, "/").concat(encodedName, "?output_mode=json"), _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            }));
          case 3:
            resp = _context8.sent;
            if (!(resp.status === 404)) {
              _context8.next = 6;
              break;
            }
            return _context8.abrupt("return", null);
          case 6:
            if (resp.ok) {
              _context8.next = 8;
              break;
            }
            throw new Error("Failed to fetch saved search: ".concat(resp.status));
          case 8:
            return _context8.abrupt("return", resp.json());
          case 9:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function fetchSavedSearch(_x6) {
      return _ref13.apply(this, arguments);
    };
  }();
  var saveSavedSearch = _exports.saveSavedSearch = /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(searchName, attrs) {
      var encodedName, fetchDefaults, body, existingSearch, isUpdate, url, resp, serverMsg, errData;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            encodedName = encodeURIComponent(searchName);
            fetchDefaults = (0, _fetch.getDefaultFetchInit)();
            body = new URLSearchParams();
            Object.entries(attrs).forEach(function (_ref15) {
              var _ref16 = _slicedToArray(_ref15, 2),
                k = _ref16[0],
                v = _ref16[1];
              if (v != null) body.set(k, String(v));
            });
            _context9.next = 6;
            return fetchSavedSearch(searchName);
          case 6:
            existingSearch = _context9.sent;
            isUpdate = !!existingSearch;
            url = isUpdate ? "".concat(savedSearchesUrl, "/").concat(encodedName, "?output_mode=json") : "".concat(savedSearchesUrl, "?output_mode=json");
            if (!isUpdate) {
              body.set('name', searchName);
            }
            _context9.next = 12;
            return fetch(url, _objectSpread(_objectSpread({}, fetchDefaults), {}, {
              method: 'POST',
              headers: _objectSpread(_objectSpread({}, fetchDefaults.headers), {}, {
                'Content-Type': 'application/x-www-form-urlencoded'
              }),
              body: body.toString()
            }));
          case 12:
            resp = _context9.sent;
            if (resp.ok) {
              _context9.next = 25;
              break;
            }
            serverMsg = "HTTP ".concat(resp.status);
            _context9.prev = 15;
            _context9.next = 18;
            return resp.json();
          case 18:
            errData = _context9.sent;
            if (errData && errData.messages && errData.messages.length > 0) {
              serverMsg = errData.messages.map(function (m) {
                return m.text || m.message;
              }).join('; ');
            }
            _context9.next = 24;
            break;
          case 22:
            _context9.prev = 22;
            _context9.t0 = _context9["catch"](15);
          case 24:
            throw new Error(serverMsg);
          case 25:
            return _context9.abrupt("return", resp.json());
          case 26:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[15, 22]]);
    }));
    return function saveSavedSearch(_x7, _x8) {
      return _ref14.apply(this, arguments);
    };
  }();
  var fetchAlertActions = _exports.fetchAlertActions = /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var params, url, resp, data;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            params = new URLSearchParams({
              output_mode: 'json',
              count: '0',
              search: 'disabled!=1'
            });
            url = "".concat(_config.splunkdPath, "/services/alerts/alert_actions?").concat(params.toString());
            _context10.next = 4;
            return fetch(url, _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            }));
          case 4:
            resp = _context10.sent;
            if (resp.ok) {
              _context10.next = 7;
              break;
            }
            return _context10.abrupt("return", []);
          case 7:
            _context10.next = 9;
            return resp.json();
          case 9:
            data = _context10.sent;
            if (!(!data || !data.entry)) {
              _context10.next = 12;
              break;
            }
            return _context10.abrupt("return", []);
          case 12:
            return _context10.abrupt("return", data.entry.filter(function (e) {
              var c = e.content || {};
              return c.label && c.label.length > 0;
            }).map(function (e) {
              var c = e.content || {};
              var appName = e.acl && e.acl.app || 'system';
              return {
                name: e.name,
                label: c.label,
                description: c.description || '',
                iconPath: c.icon_path || '',
                appName: appName,
                isCustom: c.is_custom === '1' || c.is_custom === true
              };
            }));
          case 13:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return function fetchAlertActions() {
      return _ref17.apply(this, arguments);
    };
  }();
  var fetchIsCloud = _exports.fetchIsCloud = /*#__PURE__*/function () {
    var _ref18 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      var url, resp, data, instanceType;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            url = "".concat(_config.splunkdPath, "/services/server/info?output_mode=json&count=1");
            _context11.prev = 1;
            _context11.next = 4;
            return fetch(url, _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            }));
          case 4:
            resp = _context11.sent;
            if (resp.ok) {
              _context11.next = 7;
              break;
            }
            return _context11.abrupt("return", false);
          case 7:
            _context11.next = 9;
            return resp.json();
          case 9:
            data = _context11.sent;
            instanceType = data && data.entry && data.entry[0] && data.entry[0].content && data.entry[0].content.instance_type;
            return _context11.abrupt("return", instanceType === 'cloud');
          case 14:
            _context11.prev = 14;
            _context11.t0 = _context11["catch"](1);
            return _context11.abrupt("return", false);
          case 17:
          case "end":
            return _context11.stop();
        }
      }, _callee11, null, [[1, 14]]);
    }));
    return function fetchIsCloud() {
      return _ref18.apply(this, arguments);
    };
  }();
  var webPrefix = function () {
    var idx = (_config.splunkdPath || '').indexOf('/splunkd');
    return idx > 0 ? _config.splunkdPath.substring(0, idx) : '';
  }();
  var fetchAlertActionUI = _exports.fetchAlertActionUI = /*#__PURE__*/function () {
    var _ref19 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(actionName) {
      var params, url, resp, data, eaiData;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            params = new URLSearchParams({
              output_mode: 'json',
              count: '1'
            });
            url = "".concat(_config.splunkdPath, "/services/data/ui/alerts/").concat(encodeURIComponent(actionName), "?").concat(params.toString());
            _context12.prev = 2;
            _context12.next = 5;
            return fetch(url, _objectSpread(_objectSpread({}, (0, _fetch.getDefaultFetchInit)()), {}, {
              method: 'GET'
            }));
          case 5:
            resp = _context12.sent;
            if (resp.ok) {
              _context12.next = 8;
              break;
            }
            return _context12.abrupt("return", '');
          case 8:
            _context12.next = 10;
            return resp.json();
          case 10:
            data = _context12.sent;
            if (!(!data || !data.entry || !data.entry[0])) {
              _context12.next = 13;
              break;
            }
            return _context12.abrupt("return", '');
          case 13:
            eaiData = data.entry[0].content && data.entry[0].content['eai:data'] || '';
            if (eaiData && webPrefix) {
              eaiData = eaiData.replace(/\{\{SPLUNKWEB_URL_PREFIX}}/g, webPrefix);
            }
            return _context12.abrupt("return", eaiData);
          case 18:
            _context12.prev = 18;
            _context12.t0 = _context12["catch"](2);
            return _context12.abrupt("return", '');
          case 21:
          case "end":
            return _context12.stop();
        }
      }, _callee12, null, [[2, 18]]);
    }));
    return function fetchAlertActionUI(_x9) {
      return _ref19.apply(this, arguments);
    };
  }();
  var parseSearchStages = _exports.parseSearchStages = function parseSearchStages(entry) {
    if (!entry || !entry.content) return [];
    var stages = entry.content.searchStages;
    if (typeof stages === 'string' && stages.length > 0) {
      try {
        stages = JSON.parse(stages);
      } catch (_e) {
        return [];
      }
    }
    if (!Array.isArray(stages)) {
      stages = [];
    }
    var dataSource = entry.content.dataSource;
    if (dataSource) {
      if (typeof dataSource === 'string') {
        try {
          dataSource = JSON.parse(dataSource);
        } catch (_e) {
          dataSource = null;
        }
      }
      if (dataSource && _typeof(dataSource) === 'object' && !stages.some(function (s) {
        return s && s.role === 'datasource';
      })) {
        dataSource.role = 'datasource';
        dataSource.type = dataSource.type || 'spl';
        stages = [dataSource].concat(_toConsumableArray(stages));
      }
    }
    return stages;
  };
  var toBool = _exports.toBool = function toBool(val) {
    if (val == null) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val === 'true' || val === '1';
    return Boolean(val);
  };
  var createAlert = _exports.createAlert = /*#__PURE__*/function () {
    var _ref20 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(attrs) {
      var fetchDefaults, body, resp, serverMsg, errData;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            fetchDefaults = (0, _fetch.getDefaultFetchInit)();
            body = new URLSearchParams();
            Object.entries(attrs).forEach(function (_ref21) {
              var _ref22 = _slicedToArray(_ref21, 2),
                k = _ref22[0],
                v = _ref22[1];
              if (v != null) body.set(k, String(v));
            });
            _context13.next = 5;
            return fetch("".concat(savedSearchesUrl, "?output_mode=json"), _objectSpread(_objectSpread({}, fetchDefaults), {}, {
              method: 'POST',
              headers: _objectSpread(_objectSpread({}, fetchDefaults.headers), {}, {
                'Content-Type': 'application/x-www-form-urlencoded'
              }),
              body: body.toString()
            }));
          case 5:
            resp = _context13.sent;
            if (resp.ok) {
              _context13.next = 18;
              break;
            }
            serverMsg = "HTTP ".concat(resp.status);
            _context13.prev = 8;
            _context13.next = 11;
            return resp.json();
          case 11:
            errData = _context13.sent;
            if (errData && errData.messages && errData.messages.length > 0) {
              serverMsg = errData.messages.map(function (m) {
                return m.text || m.message;
              }).join('; ');
            }
            _context13.next = 17;
            break;
          case 15:
            _context13.prev = 15;
            _context13.t0 = _context13["catch"](8);
          case 17:
            throw new Error(serverMsg);
          case 18:
            return _context13.abrupt("return", resp.json());
          case 19:
          case "end":
            return _context13.stop();
        }
      }, _callee13, null, [[8, 15]]);
    }));
    return function createAlert(_x10) {
      return _ref20.apply(this, arguments);
    };
  }();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/data/assistantInfo.json":
/***/ (function(module) {

module.exports = JSON.parse("{\"predict_numeric_fields\":{\"description\":\"Predict the value of a numeric field using a weighted combination of the values of other fields in that event.\",\"title\":\"Predict Numeric Fields\"},\"predict_categorical_fields\":{\"description\":\"Predict the value of a categorical field using the values of other fields in that event.\",\"title\":\"Predict Categorical Fields\"},\"detect_numeric_outliers\":{\"description\":\"Find values that differ significantly from previous values.\",\"title\":\"Detect Numeric Outliers\"},\"detect_categorical_outliers\":{\"description\":\"Find events that contain unusual combinations of values.\",\"title\":\"Detect Categorical Outliers\"},\"forecast_time_series\":{\"description\":\"Forecast future values given past values of a metric (numeric time series).\",\"title\":\"Forecast Time Series\"},\"cluster_numeric_events\":{\"description\":\"Partition events with multiple numeric fields into clusters.\",\"title\":\"Cluster Numeric Events\"},\"smart_forecast\":{\"description\":\"Forecast future numeric time series data using a step-by-step guided workflow with the option to bring in data from different sources and account for calendar specific \\\"special days\\\" such as holidays, company-specific event days.\",\"title\":\"Smart Forecasting\"},\"smart_outlier_detection\":{\"description\":\"Detect numeric outliers using a step-by-step guided workflow to leverage a density algorithm and segment data in advance of your anomaly search.\",\"title\":\"Smart Outlier Detection\"},\"smart_clustering\":{\"description\":\"Cluster numeric events using a step-by-step guided workflow.\",\"title\":\"Smart Clustering\"},\"smart_prediction\":{\"description\":\"Predict the value of a categorical or numeric field based on one or more other fields in the event using a step-by-step guided workflow.\",\"title\":\"Smart Prediction\"}}");

/***/ }),

/***/ "./src/main/webapp/routers/Experiments.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("experiments/ReactMaster")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _ReactMaster) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _ReactMaster = _interopRequireDefault(_ReactMaster);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ExperimentsRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Experiments'));
    },
    page: function page() {
      _Base.default.prototype.page.apply(this, arguments);
      if (this.experimentsView) {
        this.experimentsView.remove();
      }
      this.experimentsView = new _ReactMaster.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = ExperimentsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "experiments/ReactMaster":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/experiments/listing/ExperimentsListingPage.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _swcMltk, _BaseDashboard, _ExperimentsListingPage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _ExperimentsListingPage = _interopRequireDefault(_ExperimentsListingPage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Page = (0, _root.hot)(_ExperimentsListingPage.default);
  var ExperimentsReactView = _BaseDashboard.default.extend({
    render: function render() {
      (0, _swcMltk.jquery)('[role="main"]').addClass('main-section-body mlts-body');
      _reactDom.default.render(_react.default.createElement(Page), this.el);
      return this;
    }
  });
  var _default = _exports.default = ExperimentsReactView;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/experiments.es","pages_common"]]]);