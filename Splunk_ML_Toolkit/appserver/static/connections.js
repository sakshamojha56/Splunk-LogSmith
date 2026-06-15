(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["connections"],{

/***/ "./node_modules/@splunk/react-ui/SlidingPanels.js":
/***/ (function(module, exports, __webpack_require__) {

/******/(() => {
  // webpackBootstrap
  /******/
  "use strict";

  /******/ // The require scope
  /******/
  var e = {};
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat get default export */
  /******/
  (() => {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/e.n = n => {
      /******/var t = n && n.__esModule ? /******/() => n["default"]
      /******/ : () => n
      /******/;
      e.d(t, {
        a: t
      });
      /******/
      return t;
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/
  (() => {
    /******/ // define getter functions for harmony exports
    /******/e.d = (n, t) => {
      /******/for (var r in t) {
        /******/if (e.o(t, r) && !e.o(n, r)) {
          /******/Object.defineProperty(n, r, {
            enumerable: true,
            get: t[r]
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/
  (() => {
    /******/e.o = (e, n) => Object.prototype.hasOwnProperty.call(e, n)
    /******/;
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/
  (() => {
    /******/ // define __esModule on exports
    /******/e.r = e => {
      /******/if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
        });
        /******/
      }
      /******/
      Object.defineProperty(e, "__esModule", {
        value: true
      });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var n = {};
  // ESM COMPAT FLAG
  e.r(n);
  // EXPORTS
  e.d(n, {
    Panel: () => /* reexport */A,
    default: () => /* reexport */K
  });
  // CONCATENATED MODULE: external "react"
  const t = __webpack_require__("./node_modules/react/index.js");
  var r = e.n(t);
  // CONCATENATED MODULE: external "@react-spring/web"
  const o = __webpack_require__("./node_modules/@react-spring/web/dist/react-spring_web.legacy-esm.js");
  // CONCATENATED MODULE: external "prop-types"
  const i = __webpack_require__("./node_modules/prop-types/index.js");
  var a = e.n(i);
  // CONCATENATED MODULE: external "@splunk/react-ui/Animation"
  const u = __webpack_require__("./node_modules/@splunk/react-ui/Animation.js");
  // CONCATENATED MODULE: external "styled-components"
  const l = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");
  var c = e.n(l);
  // CONCATENATED MODULE: external "@splunk/react-ui/Box"
  const f = __webpack_require__("./node_modules/@splunk/react-ui/Box.js");
  var s = e.n(f);
  // CONCATENATED MODULE: external "@splunk/themes"
  const y = __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es");
  // CONCATENATED MODULE: ./src/SlidingPanels/SlidingPanelsStyles.ts
  var p = c()(s()).withConfig({
    displayName: "SlidingPanelsStyles__StyledBox",
    componentId: "mltk-su6isq-0"
  })(["overflow:hidden;position:relative;"]);
  var d = c()(o.animated.div).withConfig({
    displayName: "SlidingPanelsStyles__StyledAnimatedDiv",
    componentId: "mltk-su6isq-1"
  })(["", ";", ";"], y.mixins.reset("block"), y.mixins.clearfix());
  // CONCATENATED MODULE: ./src/utils/updateReactRef.ts
  /**
  * Updates a React ref. Callback refs and object refs (from `createRef` and `useRef`) are supported.
  *
  * @param ref - The React callback or object ref. Can be `null` or `undefined`.
  * @param current - The new value of the ref.
  */
  function v(e, n) {
    if (e) {
      if (typeof e === "function") {
        e(n);
      } else {
        // the public signature of this util uses React.Ref<T> to mirror the way React types refs.
        // the intention here is to signal "we will take care of setting 'current', not you".
        e.current = n;
        // eslint-disable-line no-param-reassign
      }
    }
  }
  // CONCATENATED MODULE: ./src/SlidingPanels/Panel.tsx
  function m() {
    return m = Object.assign ? Object.assign.bind() : function (e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = arguments[n];
        for (var r in t) {
          ({}).hasOwnProperty.call(t, r) && (e[r] = t[r]);
        }
      }
      return e;
    }, m.apply(null, arguments);
  }
  function b(e, n) {
    return j(e) || h(e, n) || g(e, n) || O();
  }
  function O() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function g(e, n) {
    if (e) {
      if ("string" == typeof e) return S(e, n);
      var t = {}.toString.call(e).slice(8, -1);
      return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? S(e, n) : void 0;
    }
  }
  function S(e, n) {
    (null == n || n > e.length) && (n = e.length);
    for (var t = 0, r = Array(n); t < n; t++) {
      r[t] = e[t];
    }
    return r;
  }
  function h(e, n) {
    var t = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (null != t) {
      var r,
        o,
        i,
        a,
        u = [],
        l = !0,
        c = !1;
      try {
        if (i = (t = t.call(e)).next, 0 === n) {
          if (Object(t) !== t) return;
          l = !1;
        } else for (; !(l = (r = i.call(t)).done) && (u.push(r.value), u.length !== n); l = !0) {}
      } catch (e) {
        c = !0, o = e;
      } finally {
        try {
          if (!l && null != t["return"] && (a = t["return"](), Object(a) !== a)) return;
        } finally {
          if (c) throw o;
        }
      }
      return u;
    }
  }
  function j(e) {
    if (Array.isArray(e)) return e;
  }
  function w(e, n) {
    if (null == e) return {};
    var t,
      r,
      o = P(e, n);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++) {
        t = i[r], -1 === n.indexOf(t) && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
      }
    }
    return o;
  }
  function P(e, n) {
    if (null == e) return {};
    var t = {};
    for (var r in e) {
      if ({}.hasOwnProperty.call(e, r)) {
        if (-1 !== n.indexOf(r)) continue;
        t[r] = e[r];
      }
    }
    return t;
  }
  var x = {
    children: a().node,
    elementRef: a().oneOfType([a().func, a().object]),
    /** @private */
    onMount: a().func,
    /** @private */
    onUnmount: a().func,
    panelId: a().oneOfType([a().string, a().number]).isRequired
  };
  /**
  * Container for arbitrary content.
  */
  function E(e) {
    var n = e.children,
      o = e.elementRef,
      i = e.onMount,
      a = e.onUnmount,
      u = e.panelId,
      l = w(e, ["children", "elementRef", "onMount", "onUnmount", "panelId"]);
    // @docs-props-type PanelPropsBase
    var c = (0, t.useState)(null),
      f = b(c, 2),
      s = f[0],
      y = f[1];
    var p = (0, t.useCallback)(function (e) {
      y(e);
      v(o, e);
    }, [o]);
    (0, t.useEffect)(function () {
      i === null || i === void 0 ? void 0 : i(s, u);
      return function () {
        a === null || a === void 0 ? void 0 : a(u);
      };
    }, [i, a, s, u]);
    return r().createElement(d, m({
      "data-test": "panel",
      "data-test-panel-id": u
    }, l, {
      ref: p
    }), n);
  }
  E.propTypes = x;
  /* harmony default export */
  const A = E;
  // CONCATENATED MODULE: ./src/SlidingPanels/SlidingPanels.tsx
  function I(e) {
    "@babel/helpers - typeof";

    return I = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e;
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    }, I(e);
  }
  function M() {
    return M = Object.assign ? Object.assign.bind() : function (e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = arguments[n];
        for (var r in t) {
          ({}).hasOwnProperty.call(t, r) && (e[r] = t[r]);
        }
      }
      return e;
    }, M.apply(null, arguments);
  }
  function C(e, n) {
    return k(e) || R(e, n) || T(e, n) || N();
  }
  function N() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function T(e, n) {
    if (e) {
      if ("string" == typeof e) return q(e, n);
      var t = {}.toString.call(e).slice(8, -1);
      return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? q(e, n) : void 0;
    }
  }
  function q(e, n) {
    (null == n || n > e.length) && (n = e.length);
    for (var t = 0, r = Array(n); t < n; t++) {
      r[t] = e[t];
    }
    return r;
  }
  function R(e, n) {
    var t = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (null != t) {
      var r,
        o,
        i,
        a,
        u = [],
        l = !0,
        c = !1;
      try {
        if (i = (t = t.call(e)).next, 0 === n) {
          if (Object(t) !== t) return;
          l = !1;
        } else for (; !(l = (r = i.call(t)).done) && (u.push(r.value), u.length !== n); l = !0) {}
      } catch (e) {
        c = !0, o = e;
      } finally {
        try {
          if (!l && null != t["return"] && (a = t["return"](), Object(a) !== a)) return;
        } finally {
          if (c) throw o;
        }
      }
      return u;
    }
  }
  function k(e) {
    if (Array.isArray(e)) return e;
  }
  function U(e, n) {
    if (null == e) return {};
    var t,
      r,
      o = _(e, n);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++) {
        t = i[r], -1 === n.indexOf(t) && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
      }
    }
    return o;
  }
  function _(e, n) {
    if (null == e) return {};
    var t = {};
    for (var r in e) {
      if ({}.hasOwnProperty.call(e, r)) {
        if (-1 !== n.indexOf(r)) continue;
        t[r] = e[r];
      }
    }
    return t;
  }
  function D(e, n) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      n && (r = r.filter(function (n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), t.push.apply(t, r);
    }
    return t;
  }
  function B(e) {
    for (var n = 1; n < arguments.length; n++) {
      var t = null != arguments[n] ? arguments[n] : {};
      n % 2 ? D(Object(t), !0).forEach(function (n) {
        V(e, n, t[n]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : D(Object(t)).forEach(function (n) {
        Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n));
      });
    }
    return e;
  }
  function V(e, n, t) {
    return (n = $(n)) in e ? Object.defineProperty(e, n, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[n] = t, e;
  }
  function $(e) {
    var n = L(e, "string");
    return "symbol" == I(n) ? n : n + "";
  }
  function L(e, n) {
    if ("object" != I(e) || !e) return e;
    var t = e[Symbol.toPrimitive];
    if (void 0 !== t) {
      var r = t.call(e, n || "default");
      if ("object" != I(r)) return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === n ? String : Number)(e);
  }
  // can't use PanelId as key type, because an index signature parameter type must be 'string', 'number', 'symbol', or a template literal type.
  var W = {
    activePanelId: a().oneOfType([a().string, a().number]).isRequired,
    children: a().node,
    elementRef: a().oneOfType([a().func, a().object]),
    innerClassName: a().string,
    innerStyle: a().object,
    onAnimationEnd: a().func,
    outerClassName: a().string,
    outerStyle: a().object,
    transition: a().oneOf(["forward", "backward"])
  };
  var z = {
    enter: {
      x: "0px"
    },
    initial: {
      x: "0px"
    }
  };
  var F = function e(n, t) {
    var r = "".concat(n, "px");
    var o = "".concat(n * -1, "px");
    var i = t === "forward" ? r : o;
    var a = t === "forward" ? o : r;
    return {
      from: {
        x: i
      },
      /**
      * Use absolute positioning so the arriving and leaving panel take up the same space.
      * Without this, the arriving panel and leaving panel will be visible at the same time, because
      * the arriving panel would insert itself underneath the still visible leaving panel.
      */
      leave: {
        position: "absolute",
        x: a
      }
    };
  };
  var G = function e(n) {
    return Object.values(n).reduce(function (e, n) {
      if ((n === null || n === void 0 ? void 0 : n.tagName) === "DIV") {
        return Math.max(e, n.clientWidth);
      }
      return e;
    }, 0);
  };
  /* This component is used to wrap each child panel in animated.div via StyledAnimatedDiv
  apply any custom inner styles or classnames that have been passed in
  apply styles coming from the transitions call that is rendering this component */
  var H = r().memo(function (e) {
    var n = e.innerClassName,
      o = e.innerStyle,
      i = e.onMount,
      a = e.onUnmount,
      u = e.panel,
      l = e.style;
    var c = (0, t.useMemo)(function () {
      return (0, t.cloneElement)(u, {
        onMount: i,
        onUnmount: a
      });
    }, [u, i, a]);
    var f = (0, t.useMemo)(function () {
      return B(B({}, o), l);
    }, [o, l]);
    return r().createElement(d, {
      style: f,
      className: n
    }, c);
  });
  function J(e) {
    var n = e.activePanelId,
      i = e.children,
      a = e.elementRef,
      l = e.innerClassName,
      c = e.innerStyle,
      f = e.onAnimationEnd,
      s = e.outerClassName,
      y = e.outerStyle,
      d = e.transition,
      v = d === void 0 ? "forward" : d,
      m = U(e, ["activePanelId", "children", "elementRef", "innerClassName", "innerStyle", "onAnimationEnd", "outerClassName", "outerStyle", "transition"]);
    // @docs-props-type SlidingPanelsPropsBase
    var b = (0, t.useState)(0),
      O = C(b, 2),
      g = O[0],
      S = O[1];
    var h = (0, t.useState)([]),
      j = C(h, 2),
      w = j[0],
      P = j[1];
    var x = (0, t.useState)({}),
      E = C(x, 2),
      A = E[0],
      I = E[1];
    var N = (0, o.useSpringRef)();
    var T = (0, t.useMemo)(function () {
      return t.Children.toArray(i).filter(t.isValidElement);
    }, [i]);
    /**
    * maxWidth is used to determine how far to translate the x value of the animated panels.
    * Without maxWidth, we run into a problem if the leaving panel width > the arriving panel width.
    * In this case, useAnimationTransition will only know to shift the leaving panel by the width of the arriving panel,
    * which would result in seeing part of the leaving panel's content on screen at the same time as the arriving panel's content.
    */
    var q = (0, t.useMemo)(function () {
      return G(A);
    }, [A]);
    /* determines what our transform translateX will look like based on is it transitioning forward or backward */
    var R = (0, t.useMemo)(function () {
      return F(q, v);
    }, [q, v]);
    var k = (0, u.useAnimationTransition)(g, B(B(B({
      ref: N
    }, z), R), {}, {
      onRest: function e() {
        f === null || f === void 0 ? void 0 : f();
      }
    }));
    (0, t.useEffect)(function () {
      /* if it can't find activePanelId it will set currentPanelIndex to -1 */
      if (false) {}
    }, [g]);
    (0, t.useEffect)(function () {
      /* starts animation */
      N.start();
    }, [N, g]);
    (0, t.useEffect)(function () {
      /* sets the currentPanelIndex in state whenever activePanelId or children changes */
      var e = T.findIndex(function (e) {
        var t = e.props;
        return t.panelId === n;
      });
      S(e);
    }, [n, T]);
    var _ = (0, t.useCallback)(function (e, n) {
      if (e != null && n != null) {
        I(function (t) {
          return B(B({}, t), {}, V({}, n, e));
        });
      }
    }, []);
    var D = (0, t.useCallback)(function (e) {
      I(function (n) {
        var t = B({}, n);
        delete t[e];
        return t;
      });
    }, []);
    (0, t.useLayoutEffect)(function () {
      /**
      * use useLayoutEffect instead of useEffect to setPanels because we need panels to be populated before mount
      * so SlidingPanels will appear with a panel already inside the StyledBox.  You can recreate issue by going
      * to Storybook and quickly switching between basic and dropdown examples.  The basic example will eventually
      * show a small square on initial render, vs what we want to be the entire initial panel.
      */
      P(T);
    }, [T]);
    return r().createElement(p, M({
      className: s,
      "data-test-active-panel-id": n,
      "data-test": "sliding-panels",
      ref: a,
      style: y
    }, m), k(function (e, n) {
      var t = w[n];
      return t ? r().createElement(H, {
        innerClassName: l,
        innerStyle: c,
        onMount: _,
        onUnmount: D,
        panel: t,
        style: e
      }) : null;
    }));
  }
  J.propTypes = W;
  J.Panel = A;
  /* harmony default export */
  const K = J;
  // CONCATENATED MODULE: ./src/SlidingPanels/index.ts
  module.exports = n;
  /******/
})();

/***/ }),

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/connections.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Connections.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Connections, _swcMltk) {
  "use strict";

  _Connections = _interopRequireDefault(_Connections);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Connections.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/AgentConnectionModal/AgentConnectionModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/@splunk/react-ui/Checkbox.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./node_modules/@splunk/react-icons/QuestionCircle.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./src/main/webapp/components/agentConnections/agent_connections.json"), __webpack_require__("./src/main/webapp/components/agentConnections/Form/FormContent.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/AgentConnection.styles.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.styles.js"), __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/hooks/index.js"), __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/utils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esSymbolToPrimitive, _esArrayFilter, _esArrayMap, _esDateToPrimitive, _esFunctionName, _esNumberConstructor, _esObjectToString, _react, _propTypes, _Modal, _Checkbox, _Tooltip, _Select, _Button, _Typography, _QuestionCircle, _i18n, _format, _agent_connections, _FormContent, _AgentConnection, _LLMConnectionModal, _hooks, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Checkbox = _interopRequireDefault(_Checkbox);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _Select = _interopRequireDefault(_Select);
  _Button = _interopRequireDefault(_Button);
  _Typography = _interopRequireDefault(_Typography);
  _QuestionCircle = _interopRequireDefault(_QuestionCircle);
  _agent_connections = _interopRequireDefault(_agent_connections);
  _FormContent = _interopRequireDefault(_FormContent);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  var AgentConnectionModal = function AgentConnectionModal(_ref) {
    var _agentConfig$mcp, _agentConfig$kb, _mcpProviderCfg$optio, _kbTypeCfg$options;
    var editMode = _ref.editMode,
      initialConnectionData = _ref.initialConnectionData,
      initialProvider = _ref.initialProvider,
      open = _ref.open,
      type = _ref.type,
      onRequestClose = _ref.onRequestClose,
      onSaved = _ref.onSaved;
    var _useAgentConnectionSt = (0, _hooks.useAgentConnectionState)({
        open: open,
        editMode: editMode,
        initialConnectionData: initialConnectionData,
        initialProvider: initialProvider,
        type: type
      }),
      state = _useAgentConnectionSt.state,
      setState = _useAgentConnectionSt.setState,
      fieldErrors = _useAgentConnectionSt.fieldErrors,
      setFieldErrors = _useAgentConnectionSt.setFieldErrors,
      testing = _useAgentConnectionSt.testing,
      setTesting = _useAgentConnectionSt.setTesting,
      testOk = _useAgentConnectionSt.testOk,
      setTestOk = _useAgentConnectionSt.setTestOk,
      saving = _useAgentConnectionSt.saving,
      setSaving = _useAgentConnectionSt.setSaving,
      featureEnabled = _useAgentConnectionSt.featureEnabled,
      consentChecked = _useAgentConnectionSt.consentChecked,
      setConsentChecked = _useAgentConnectionSt.setConsentChecked;
    var _useAgentConnectionHa = (0, _hooks.useAgentConnectionHandlers)({
        type: type,
        editMode: editMode,
        state: state,
        featureEnabled: featureEnabled,
        testOk: testOk,
        consentChecked: consentChecked,
        setFieldErrors: setFieldErrors,
        setTesting: setTesting,
        setTestOk: setTestOk,
        setSaving: setSaving,
        onRequestClose: onRequestClose,
        onSaved: onSaved
      }),
      onTestConnection = _useAgentConnectionHa.onTestConnection,
      handleTestingCancel = _useAgentConnectionHa.handleTestingCancel,
      handleSaveConnection = _useAgentConnectionHa.handleSaveConnection;
    var isBusy = testing || saving;
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
    var lockedSelection = editMode || Boolean(initialProvider);
    var modalTitle = (0, _react.useMemo)(function () {
      var providerName = type === 'MCP' ? (0, _utils.formatProviderLabel)(state.mcpProvider || initialProvider) : (0, _utils.formatProviderLabel)(state.kbType || initialProvider);
      if (providerName) {
        if (type === 'MCP') {
          return editMode ? (0, _format.sprintf)((0, _i18n.gettext)('Edit %(provider)s MCP connection'), {
            provider: providerName
          }) : (0, _format.sprintf)((0, _i18n.gettext)('Create %(provider)s MCP connection'), {
            provider: providerName
          });
        }
        return editMode ? (0, _format.sprintf)((0, _i18n.gettext)('Edit %(provider)s Knowledge base connection'), {
          provider: providerName
        }) : (0, _format.sprintf)((0, _i18n.gettext)('Create %(provider)s Knowledge base connection'), {
          provider: providerName
        });
      }
      if (type === 'MCP') {
        return editMode ? (0, _i18n.gettext)('Edit MCP Connection') : (0, _i18n.gettext)('Add MCP Connection');
      }
      return editMode ? (0, _i18n.gettext)('Edit Knowledge base') : (0, _i18n.gettext)('Add Knowledge base');
    }, [editMode, initialProvider, state.kbType, state.mcpProvider, type]);
    var renderMCP = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !lockedSelection && /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.mcpProvider),
      help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.mcpProvider,
      label: (0, _i18n.gettext)(mcpProviderCfg.label),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: editMode,
      onChange: function onChange(e, data) {
        var v = data && data.value || e && e.target && e.target.value || '';
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            mcpProvider: v
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.mcpProvider) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              mcpProvider: undefined
            });
          });
        }
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
    })))), mcpFields.map(function (f) {
      if (f.showWhen && !state[f.showWhen]) {
        return null;
      }
      var isSplunkProvider = (mcpSelected || '').toLowerCase() === 'splunk';
      var isAtlassianProvider = (mcpSelected || '').toLowerCase() === 'atlassian';
      var isRequired = isSplunkProvider && (f.name === 'splunkUrl' || f.name === 'splunkToken') || isAtlassianProvider && (f.name === 'atlassianUrl' || f.name === 'atlassianToken');
      var showEndpointConsent = f.name === 'splunkUrl' && isSplunkProvider || f.name === 'atlassianUrl' && isAtlassianProvider;
      return /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
        key: "mcp-".concat(f.name),
        "data-required": isRequired ? 'true' : undefined,
        error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name]) && !showEndpointConsent,
        help: !showEndpointConsent ? fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name] : undefined,
        hideLabel: f.type === 'checkbox',
        label: f.type === 'checkbox' ? '' : (0, _i18n.gettext)(f.label),
        labelPosition: "top"
      }, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, f.type === 'checkbox' ? /*#__PURE__*/_react.default.createElement(_AgentConnection.CheckboxFieldRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: !!state[f.name],
        id: f.name,
        name: f.name,
        onChange: function onChange(e, data) {
          var _ref2, _data$checked, _e$target;
          var checked = (_ref2 = (_data$checked = data === null || data === void 0 ? void 0 : data.checked) !== null && _data$checked !== void 0 ? _data$checked : e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.checked) !== null && _ref2 !== void 0 ? _ref2 : false;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f.name, checked));
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors[f.name]) {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, f.name, undefined));
            });
          }
        }
      }, (0, _i18n.gettext)(f.label))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalTextInput, {
        name: f.name,
        onChange: function onChange(e, _ref3) {
          var value = _ref3.value;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f.name, value));
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors[f.name]) {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, f.name, undefined));
            });
          }
        },
        type: f.type === 'password' ? 'password' : 'text',
        value: state[f.name] || ''
      }), showEndpointConsent && (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name]) && /*#__PURE__*/_react.default.createElement(_AgentConnection.InlineErrorText, null, fieldErrors[f.name])), showEndpointConsent && /*#__PURE__*/_react.default.createElement(_AgentConnection.SpacedCheckboxFieldRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: !!state.confirmEndpoint,
        id: "confirm-endpoint",
        name: "confirm-endpoint",
        onChange: function onChange(e, data) {
          var _ref4, _data$checked2, _e$target2;
          var checked = (_ref4 = (_data$checked2 = data === null || data === void 0 ? void 0 : data.checked) !== null && _data$checked2 !== void 0 ? _data$checked2 : e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.checked) !== null && _ref4 !== void 0 ? _ref4 : false;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, {
              confirmEndpoint: checked
            });
          });
          if (checked && fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.confirmEndpoint) {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                confirmEndpoint: undefined
              });
            });
          }
        }
      }, (0, _i18n.gettext)('Your agent would be making calls to this endpoint. Can you confirm?'))), showEndpointConsent && (fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.confirmEndpoint) && /*#__PURE__*/_react.default.createElement(_AgentConnection.InlineErrorText, null, fieldErrors.confirmEndpoint)));
    }));
    var renderKB = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !lockedSelection && /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.kbType),
      help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.kbType,
      label: (0, _i18n.gettext)(kbTypeCfg.label),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: editMode,
      onChange: function onChange(e, data) {
        var v = data && data.value || e && e.target && e.target.value || '';
        setState(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, {
            kbType: v
          });
        });
        if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.kbType) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              kbType: undefined
            });
          });
        }
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
    })))), kbFields.filter(function (f) {
      return f.name !== 'kbDescription';
    }).map(function (f) {
      return /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalControlGroup, {
        key: "kb-".concat(f.name),
        "data-required": f.required ? 'true' : undefined,
        error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name]),
        help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors[f.name],
        label: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          as: "span"
        }, f.label), f.name === 'kbDescription' && /*#__PURE__*/_react.default.createElement(_AgentConnection.InlineTooltipIcon, null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          content: f.description || (0, _i18n.gettext)('Describe the Knowledge Base for easier identification.')
        }, /*#__PURE__*/_react.default.createElement(_QuestionCircle.default, {
          variant: "outlined"
        })))),
        labelPosition: "top"
      }, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalField, null, /*#__PURE__*/_react.default.createElement(_AgentConnection.ModalTextInput, {
        name: f.name,
        onChange: function onChange(e, _ref5) {
          var value = _ref5.value;
          setState(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f.name, value));
          });
          if (fieldErrors !== null && fieldErrors !== void 0 && fieldErrors[f.name]) {
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, f.name, undefined));
            });
          }
        },
        type: f.type === 'password' ? 'password' : 'text',
        value: state[f.name] || ''
      })));
    }));
    var consentText = type === 'MCP' ? (0, _i18n.gettext)('By proceeding, you acknowledge that the configuration details you provide will be stored to enable authenticated requests to your selected external MCP service provider.') : (0, _i18n.gettext)('By proceeding, you acknowledge that the configuration details you provide will be stored to enable authenticated requests to your selected external knowledge base service provider.');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !isBusy && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModal, {
      onRequestClose: onRequestClose,
      open: open
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: onRequestClose,
      title: modalTitle
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalBody, null, featureEnabled === null && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalLoadingState, null, (0, _i18n.gettext)('Loading…')), featureEnabled === false && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalFeatureDisabledState, null, (0, _i18n.gettext)('Access to this connection is disabled. Please check your capabilities.')), featureEnabled && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_FormContent.default, {
      fieldErrors: fieldErrors,
      isEdit: editMode,
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
      setType: function setType() {},
      showTypeSelector: false,
      state: state,
      type: type
    }), /*#__PURE__*/_react.default.createElement(_AgentConnection.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_AgentConnection.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      error: Boolean(fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.consentChecked),
      help: fieldErrors === null || fieldErrors === void 0 ? void 0 : fieldErrors.consentChecked,
      label: (0, _i18n.gettext)('Warning and Consent'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConsentRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
      checked: consentChecked,
      id: "agent-warning-consent",
      onChange: function onChange(e, data) {
        var _ref6, _data$checked3, _e$target3;
        var checked = (_ref6 = (_data$checked3 = data === null || data === void 0 ? void 0 : data.checked) !== null && _data$checked3 !== void 0 ? _data$checked3 : e === null || e === void 0 ? void 0 : (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : _e$target3.checked) !== null && _ref6 !== void 0 ? _ref6 : false;
        setConsentChecked(checked);
        if (checked && fieldErrors !== null && fieldErrors !== void 0 && fieldErrors.consentChecked) {
          setFieldErrors(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, {
              consentChecked: undefined
            });
          });
        }
      }
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConsentText, null, consentText)))))))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalFooter, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterRow, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.TestConnectionAction, {
      disabled: saving || featureEnabled !== true,
      onClick: onTestConnection,
      type: "button"
    }, (0, _i18n.gettext)('Test connection')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterActions, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: saving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: onRequestClose
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: !editMode && !testOk || saving || featureEnabled !== true,
      onClick: handleSaveConnection
    }, (0, _i18n.gettext)('Save')))))), isBusy && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModal, {
      onRequestClose: testing ? handleTestingCancel : undefined,
      open: isBusy
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: testing ? handleTestingCancel : undefined,
      title: modalTitle
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.BusySpinnerWrap, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.LoadingSpinnerRing, null), /*#__PURE__*/_react.default.createElement(_Typography.default, null, (0, _i18n.gettext)('Establishing connection...')))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalFooter, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterRow, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.TestConnectionAction, {
      disabled: true,
      type: "button"
    }, (0, _i18n.gettext)('Test connection')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterActions, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: saving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: testing ? handleTestingCancel : undefined
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: true,
      label: (0, _i18n.gettext)('Save')
    }))))));
  };
  AgentConnectionModal.propTypes = {
    editMode: _propTypes.default.bool,
    initialConnectionData: _propTypes.default.object,
    initialProvider: _propTypes.default.string,
    open: _propTypes.default.bool,
    type: _propTypes.default.oneOf(['MCP', 'KB']).isRequired,
    onRequestClose: _propTypes.default.func,
    onSaved: _propTypes.default.func
  };
  AgentConnectionModal.defaultProps = {
    editMode: false,
    initialConnectionData: null,
    initialProvider: '',
    open: false,
    onRequestClose: function onRequestClose() {},
    onSaved: function onSaved() {}
  };
  var _default = _exports.default = AgentConnectionModal;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/AgentConnectionModal/hooks/index.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/hooks/useAgentConnectionState.js"), __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/hooks/useAgentConnectionHandlers.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _useAgentConnectionState, _useAgentConnectionHandlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "useAgentConnectionHandlers", {
    enumerable: true,
    get: function get() {
      return _useAgentConnectionHandlers.default;
    }
  });
  Object.defineProperty(_exports, "useAgentConnectionState", {
    enumerable: true,
    get: function get() {
      return _useAgentConnectionState.default;
    }
  });
  _useAgentConnectionState = _interopRequireDefault(_useAgentConnectionState);
  _useAgentConnectionHandlers = _interopRequireDefault(_useAgentConnectionHandlers);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/AgentConnectionModal/hooks/useAgentConnectionHandlers.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.object.values.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/agentConnections/validate.js"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/utils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayJoin, _esObjectKeys, _esObjectToString, _esObjectValues, _esPromise, _esStringTrim, _react, _i18n, _ToastConstants, _validate, _ToastUtil, _AgentBuilderApi, _utils) {
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
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  var useAgentConnectionHandlers = function useAgentConnectionHandlers(_ref) {
    var type = _ref.type,
      editMode = _ref.editMode,
      state = _ref.state,
      featureEnabled = _ref.featureEnabled,
      testOk = _ref.testOk,
      consentChecked = _ref.consentChecked,
      setFieldErrors = _ref.setFieldErrors,
      setTesting = _ref.setTesting,
      setTestOk = _ref.setTestOk,
      setSaving = _ref.setSaving,
      onRequestClose = _ref.onRequestClose,
      onSaved = _ref.onSaved;
    var activeTestRequestRef = (0, _react.useRef)(0);
    var onTestConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var requestId, _resp$payload, isMcp, _validateForType, ok, fe, errorMessages, msg, payload, typeUpper, isSplunk, url, token, resp, statusCode, result, statusStrOk, httpOk, payloadOk, success;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(featureEnabled !== true)) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            requestId = activeTestRequestRef.current + 1;
            activeTestRequestRef.current = requestId;
            _context.prev = 4;
            setTesting(true);
            isMcp = type === 'MCP';
            _validateForType = (0, _validate.validateForType)(type, state), ok = _validateForType.ok, fe = _validateForType.fieldErrors;
            if (ok) {
              _context.next = 16;
              break;
            }
            setTestOk(false);
            setFieldErrors(fe || {});
            errorMessages = fe ? Object.values(fe).filter(Boolean).join(', ') : '';
            msg = errorMessages || (0, _i18n.gettext)('Please fix the validation errors');
            (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            if (activeTestRequestRef.current === requestId) {
              setTesting(false);
            }
            return _context.abrupt("return");
          case 16:
            if (!(type === 'MCP' && !state.confirmEndpoint)) {
              _context.next = 21;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                confirmEndpoint: (0, _i18n.gettext)('Please confirm this checkbox before testing the connection')
              });
            });
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please confirm the checkbox before testing the connection'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            if (activeTestRequestRef.current === requestId) {
              setTesting(false);
            }
            return _context.abrupt("return");
          case 21:
            setFieldErrors({});
            if (isMcp) {
              typeUpper = (0, _utils.toProviderType)(state.mcpProvider);
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
              payload = (0, _utils.buildKBPayload)(state);
            }
            if (!isMcp) {
              _context.next = 29;
              break;
            }
            _context.next = 26;
            return (0, _AgentBuilderApi.saveMcpConnections)('/test', payload);
          case 26:
            _context.t0 = _context.sent;
            _context.next = 32;
            break;
          case 29:
            _context.next = 31;
            return (0, _AgentBuilderApi.saveKbConnections)('/test', payload);
          case 31:
            _context.t0 = _context.sent;
          case 32:
            resp = _context.t0;
            if (!(activeTestRequestRef.current !== requestId)) {
              _context.next = 35;
              break;
            }
            return _context.abrupt("return");
          case 35:
            statusCode = resp === null || resp === void 0 ? void 0 : resp.status;
            result = (_resp$payload = resp === null || resp === void 0 ? void 0 : resp.payload) !== null && _resp$payload !== void 0 ? _resp$payload : {};
            statusStrOk = typeof statusCode === 'string' && statusCode.toLowerCase() === 'success';
            httpOk = statusCode === 200;
            payloadOk = (result === null || result === void 0 ? void 0 : result.success) === true || typeof (result === null || result === void 0 ? void 0 : result.status) === 'string' && result.status.toLowerCase() === 'success' || (result === null || result === void 0 ? void 0 : result.connected) === true;
            success = (httpOk || statusStrOk) && payloadOk;
            if (success) {
              setTestOk(true);
              (0, _ToastUtil.triggerToast)((result === null || result === void 0 ? void 0 : result.message) || (0, _i18n.gettext)('Test connection successful'), _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            } else {
              setTestOk(false);
              (0, _ToastUtil.triggerToast)((result === null || result === void 0 ? void 0 : result.message) || (resp === null || resp === void 0 ? void 0 : resp.message) || (result === null || result === void 0 ? void 0 : result.error_message) || (0, _i18n.gettext)('Connection test failed'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            }
            _context.next = 50;
            break;
          case 44:
            _context.prev = 44;
            _context.t1 = _context["catch"](4);
            if (!(activeTestRequestRef.current !== requestId)) {
              _context.next = 48;
              break;
            }
            return _context.abrupt("return");
          case 48:
            setTestOk(false);
            (0, _ToastUtil.triggerToast)((_context.t1 === null || _context.t1 === void 0 ? void 0 : _context.t1.message) || (0, _i18n.gettext)('Connection test failed'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 50:
            _context.prev = 50;
            if (activeTestRequestRef.current === requestId) {
              setTesting(false);
            }
            return _context.finish(50);
          case 53:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 44, 50, 53]]);
    })), [featureEnabled, setFieldErrors, setTesting, setTestOk, state, type]);
    var handleTestingCancel = (0, _react.useCallback)(function () {
      activeTestRequestRef.current += 1;
      setTesting(false);
      onRequestClose();
    }, [onRequestClose, setTesting]);
    var handleSaveConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _response$payload, _response$payload2, nameRaw, _validateForType2, ok, fe, errorMessages, msg, payload, response, backendMsg, _e$response, _e$response2, _e$response3, _e$response3$payload, _e$response4, rawStr, parsedMsg, obj;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(featureEnabled !== true)) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return");
          case 2:
            _context2.prev = 2;
            nameRaw = String(state.connectionName || '').trim();
            if (!(nameRaw.length > 256)) {
              _context2.next = 8;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                connectionName: (0, _i18n.gettext)('Maximum 256 characters')
              });
            });
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Connection name: Maximum 256 characters'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context2.abrupt("return");
          case 8:
            _validateForType2 = (0, _validate.validateForType)(type, state), ok = _validateForType2.ok, fe = _validateForType2.fieldErrors;
            if (ok) {
              _context2.next = 15;
              break;
            }
            setFieldErrors(fe || {});
            errorMessages = fe ? Object.values(fe).filter(Boolean).join(', ') : '';
            msg = errorMessages || (0, _i18n.gettext)('Please fix the validation errors');
            (0, _ToastUtil.triggerToast)(msg, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context2.abrupt("return");
          case 15:
            if (testOk) {
              _context2.next = 21;
              break;
            }
            if (!editMode) {
              _context2.next = 19;
              break;
            }
            _context2.next = 21;
            break;
          case 19:
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please test the connection successfully before saving'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            return _context2.abrupt("return");
          case 21:
            if (consentChecked) {
              _context2.next = 25;
              break;
            }
            setFieldErrors(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                consentChecked: (0, _i18n.gettext)('Please provide consent before saving this connection.')
              });
            });
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please provide consent before saving this connection.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context2.abrupt("return");
          case 25:
            setFieldErrors({});
            setSaving(true);
            payload = type === 'MCP' ? (0, _utils.buildMCPPayload)(state) : (0, _utils.buildKBPayload)(state);
            if (!(type === 'MCP')) {
              _context2.next = 34;
              break;
            }
            _context2.next = 31;
            return (editMode ? _AgentBuilderApi.updateMcpConnections : _AgentBuilderApi.saveMcpConnections)('', payload);
          case 31:
            _context2.t0 = _context2.sent;
            _context2.next = 37;
            break;
          case 34:
            _context2.next = 36;
            return (editMode ? _AgentBuilderApi.updatekbConnections : _AgentBuilderApi.saveKbConnections)('', payload);
          case 36:
            _context2.t0 = _context2.sent;
          case 37:
            response = _context2.t0;
            if ((0, _utils.isResponseSuccess)(response)) {
              _context2.next = 42;
              break;
            }
            backendMsg = (0, _utils.parseErrorMessage)(response);
            (0, _ToastUtil.triggerToast)(backendMsg || (type === 'MCP' ? (0, _i18n.gettext)('Failed to save MCP connection') : (0, _i18n.gettext)('Failed to save knowledge base connection')), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            return _context2.abrupt("return");
          case 42:
            (0, _ToastUtil.triggerToast)(type === 'MCP' ? (response === null || response === void 0 ? void 0 : (_response$payload = response.payload) === null || _response$payload === void 0 ? void 0 : _response$payload.message) || (response === null || response === void 0 ? void 0 : response.message) || "".concat((0, _i18n.gettext)('Your MCP server connection'), " \"").concat(state.connectionName, "\" ").concat((0, _i18n.gettext)('has been created.')) : (response === null || response === void 0 ? void 0 : (_response$payload2 = response.payload) === null || _response$payload2 === void 0 ? void 0 : _response$payload2.message) || (response === null || response === void 0 ? void 0 : response.message) || "".concat((0, _i18n.gettext)('Your Knowledge base connection'), " \"").concat(state.connectionName, "\" ").concat((0, _i18n.gettext)('has been created.')), _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            onSaved();
            onRequestClose();
            _context2.next = 52;
            break;
          case 47:
            _context2.prev = 47;
            _context2.t1 = _context2["catch"](2);
            rawStr = (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : (_e$response = _context2.t1.response) === null || _e$response === void 0 ? void 0 : _e$response.payload) || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : (_e$response2 = _context2.t1.response) === null || _e$response2 === void 0 ? void 0 : _e$response2.message) || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.body) || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.responseText) || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.message);
            if (typeof rawStr === 'string') {
              try {
                obj = JSON.parse(rawStr);
                parsedMsg = (obj === null || obj === void 0 ? void 0 : obj.error_message) || (obj === null || obj === void 0 ? void 0 : obj.message);
              } catch (_) {
                parsedMsg = undefined;
              }
            }
            (0, _ToastUtil.triggerToast)(parsedMsg || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : (_e$response3 = _context2.t1.response) === null || _e$response3 === void 0 ? void 0 : (_e$response3$payload = _e$response3.payload) === null || _e$response3$payload === void 0 ? void 0 : _e$response3$payload.error_message) || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : (_e$response4 = _context2.t1.response) === null || _e$response4 === void 0 ? void 0 : _e$response4.error_message) || (_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.message) || (0, _i18n.gettext)('Failed to save agent connection'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 52:
            _context2.prev = 52;
            setSaving(false);
            return _context2.finish(52);
          case 55:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[2, 47, 52, 55]]);
    })), [consentChecked, editMode, featureEnabled, onRequestClose, onSaved, setFieldErrors, setSaving, state, testOk, type]);
    return {
      activeTestRequestRef: activeTestRequestRef,
      onTestConnection: onTestConnection,
      handleTestingCancel: handleTestingCancel,
      handleSaveConnection: handleSaveConnection
    };
  };
  var _default = _exports.default = useAgentConnectionHandlers;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/AgentConnectionModal/hooks/useAgentConnectionState.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
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
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/utils.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esFunctionName, _react, _utils, _AgentBuilderApi) {
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
  var useAgentConnectionState = function useAgentConnectionState(_ref) {
    var open = _ref.open,
      editMode = _ref.editMode,
      initialConnectionData = _ref.initialConnectionData,
      initialProvider = _ref.initialProvider,
      type = _ref.type;
    var _useState = (0, _react.useState)(_utils.INITIAL_STATE),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];
    var _useState3 = (0, _react.useState)({}),
      _useState4 = _slicedToArray(_useState3, 2),
      fieldErrors = _useState4[0],
      setFieldErrors = _useState4[1];
    var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      testing = _useState6[0],
      setTesting = _useState6[1];
    var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      testOk = _useState8[0],
      setTestOk = _useState8[1];
    var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      saving = _useState10[0],
      setSaving = _useState10[1];
    var _useState11 = (0, _react.useState)(null),
      _useState12 = _slicedToArray(_useState11, 2),
      featureEnabled = _useState12[0],
      setFeatureEnabled = _useState12[1];
    var _useState13 = (0, _react.useState)(false),
      _useState14 = _slicedToArray(_useState13, 2),
      consentChecked = _useState14[0],
      setConsentChecked = _useState14[1];
    var resetState = (0, _react.useCallback)(function () {
      var normalizedProvider = (initialProvider || '').toLowerCase();
      if (editMode && initialConnectionData) {
        var item = initialConnectionData._raw || {};
        if (type === 'MCP') {
          var _item$details, _item$details2, _item$details3, _item$details4, _item$details5, _item$details6, _item$details7;
          var provider = (0, _utils.fromProviderType)(item.type);
          var urlVal = (item === null || item === void 0 ? void 0 : (_item$details = item.details) === null || _item$details === void 0 ? void 0 : _item$details.mcp_server_url) || (item === null || item === void 0 ? void 0 : (_item$details2 = item.details) === null || _item$details2 === void 0 ? void 0 : _item$details2.url) || (item === null || item === void 0 ? void 0 : item.url) || '';
          var tokenVal = (item === null || item === void 0 ? void 0 : (_item$details3 = item.details) === null || _item$details3 === void 0 ? void 0 : _item$details3.token) || (item === null || item === void 0 ? void 0 : item.token) || '';
          var autoRefresh = !!(item !== null && item !== void 0 && (_item$details4 = item.details) !== null && _item$details4 !== void 0 && _item$details4.is_auto_refresh_enabled);
          setState(_objectSpread(_objectSpread({}, _utils.INITIAL_STATE), {}, {
            connectionName: initialConnectionData.name || item.name || '',
            connectionDescription: item.description || '',
            mcpProvider: provider,
            splunkUrl: provider === 'splunk' ? urlVal : '',
            splunkToken: provider === 'splunk' ? tokenVal : '',
            atlassianUrl: provider === 'atlassian' ? urlVal : '',
            atlassianToken: provider === 'atlassian' ? tokenVal : '',
            atlassianAutoRefresh: provider === 'atlassian' ? autoRefresh : false,
            atlassianClientId: provider === 'atlassian' ? (item === null || item === void 0 ? void 0 : (_item$details5 = item.details) === null || _item$details5 === void 0 ? void 0 : _item$details5.client_id) || '' : '',
            atlassianClientSecret: provider === 'atlassian' ? (item === null || item === void 0 ? void 0 : (_item$details6 = item.details) === null || _item$details6 === void 0 ? void 0 : _item$details6.client_secret) || '' : '',
            atlassianRefreshToken: provider === 'atlassian' ? (item === null || item === void 0 ? void 0 : (_item$details7 = item.details) === null || _item$details7 === void 0 ? void 0 : _item$details7.refresh_token) || '' : '',
            confirmEndpoint: true
          }));
        } else {
          var _item$details8, _item$details9, _item$details10, _item$details11, _item$details12, _item$details13;
          var kbTypeValue = (0, _utils.fromKBType)(item.type);
          setState(_objectSpread(_objectSpread({}, _utils.INITIAL_STATE), {}, {
            connectionName: initialConnectionData.name || item.name || '',
            connectionDescription: item.description || '',
            kbType: kbTypeValue,
            kbRegion: ((_item$details8 = item.details) === null || _item$details8 === void 0 ? void 0 : _item$details8.aws_region) || ((_item$details9 = item.details) === null || _item$details9 === void 0 ? void 0 : _item$details9.region) || '',
            kbId: ((_item$details10 = item.details) === null || _item$details10 === void 0 ? void 0 : _item$details10.kb_id) || '',
            kbDescription: item.description || '',
            kbAccessKey: ((_item$details11 = item.details) === null || _item$details11 === void 0 ? void 0 : _item$details11.aws_access_key_id) || '',
            kbSecretKey: ((_item$details12 = item.details) === null || _item$details12 === void 0 ? void 0 : _item$details12.aws_access_key_token) || '',
            kbModelName: '',
            kbRoleArn: ((_item$details13 = item.details) === null || _item$details13 === void 0 ? void 0 : _item$details13.role_arn) || ''
          }));
        }
      } else {
        setState(_objectSpread(_objectSpread({}, _utils.INITIAL_STATE), {}, {
          mcpProvider: type === 'MCP' ? normalizedProvider : '',
          kbType: type === 'KB' ? normalizedProvider : ''
        }));
      }
      setFieldErrors({});
      setTesting(false);
      setTestOk(false);
      setSaving(false);
      setConsentChecked(false);
      setFeatureEnabled(null);
    }, [editMode, initialConnectionData, initialProvider, type]);
    (0, _react.useEffect)(function () {
      if (open) {
        resetState();
      }
    }, [open, resetState]);
    (0, _react.useEffect)(function () {
      if (!open) {
        setFeatureEnabled(null);
        return undefined;
      }
      var mounted = true;
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var resp, root, features, maybeGroup, gateValue;
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
                  gateValue = maybeGroup.aitk_agent_builder_feature_enabled;
                } else if (Object.prototype.hasOwnProperty.call(maybeGroup, 'slim_mltk_hosted_llm_feature_enabled')) {
                  gateValue = maybeGroup.slim_mltk_hosted_llm_feature_enabled;
                }
              } else if (features) {
                gateValue = features.mltk_hosted_llm;
              }
              if (mounted) {
                setFeatureEnabled((0, _utils.normalizeFeatureFlagValue)(gateValue));
              }
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              if (mounted) {
                setFeatureEnabled(false);
              }
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 11]]);
      }))();
      return function () {
        mounted = false;
      };
    }, [open]);
    (0, _react.useEffect)(function () {
      setTestOk(false);
    }, [state]);
    return {
      state: state,
      setState: setState,
      fieldErrors: fieldErrors,
      setFieldErrors: setFieldErrors,
      testing: testing,
      setTesting: setTesting,
      testOk: testOk,
      setTestOk: setTestOk,
      saving: saving,
      setSaving: setSaving,
      featureEnabled: featureEnabled,
      consentChecked: consentChecked,
      setConsentChecked: setConsentChecked,
      resetState: resetState
    };
  };
  var _default = _exports.default = useAgentConnectionState;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/AgentConnectionModal/utils.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.object.keys.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esObjectKeys) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toProviderType = _exports.toKBType = _exports.parseErrorMessage = _exports.normalizeFeatureFlagValue = _exports.isResponseSuccess = _exports.fromProviderType = _exports.fromKBType = _exports.formatProviderLabel = _exports.buildMCPPayload = _exports.buildKBPayload = _exports.INITIAL_STATE = void 0;
  var INITIAL_STATE = _exports.INITIAL_STATE = {
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
    confirmEndpoint: false
  };
  var normalizeFeatureFlagValue = _exports.normalizeFeatureFlagValue = function normalizeFeatureFlagValue(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    if (typeof value === 'string') {
      var normalized = value.toLowerCase();
      return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
    }
    return !!value;
  };
  var fromProviderType = _exports.fromProviderType = function fromProviderType(provider) {
    if (!provider) return '';
    var map = {
      SPLUNK: 'splunk',
      ATLASSIAN: 'atlassian',
      SLACK: 'slack'
    };
    return map[provider] || provider.toLowerCase();
  };
  var fromKBType = _exports.fromKBType = function fromKBType(kbTypeValue) {
    if (!kbTypeValue) return '';
    var map = {
      AWS_KB: 'aws'
    };
    return map[kbTypeValue] || kbTypeValue.toLowerCase();
  };
  var formatProviderLabel = _exports.formatProviderLabel = function formatProviderLabel(provider) {
    if (!provider) return '';
    var normalized = String(provider).toLowerCase();
    var map = {
      splunk: 'Splunk',
      atlassian: 'Atlassian',
      slack: 'Slack',
      aws: 'AWS'
    };
    return map[normalized] || provider;
  };
  var toProviderType = _exports.toProviderType = function toProviderType(provider) {
    if (!provider) return '';
    var map = {
      splunk: 'SPLUNK',
      atlassian: 'ATLASSIAN',
      slack: 'SLACK'
    };
    return map[provider.toLowerCase()] || provider.toUpperCase();
  };
  var toKBType = _exports.toKBType = function toKBType(kbTypeValue) {
    if (!kbTypeValue) return '';
    var map = {
      aws: 'AWS_KB'
    };
    return map[kbTypeValue.toLowerCase()] || kbTypeValue.toUpperCase();
  };
  var buildMCPPayload = _exports.buildMCPPayload = function buildMCPPayload(state) {
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
  };
  var buildKBPayload = _exports.buildKBPayload = function buildKBPayload(state) {
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
  };
  var parseErrorMessage = _exports.parseErrorMessage = function parseErrorMessage(response) {
    var backendMsg = '';
    try {
      if (typeof response === 'string') {
        var parsed = JSON.parse(response);
        backendMsg = parsed.error_message || parsed.message || '';
      } else if (response !== null && response !== void 0 && response.payload) {
        var _JSON$parse;
        backendMsg = response.payload.error_message || response.payload.message || (typeof response.payload === 'string' ? (_JSON$parse = JSON.parse(response.payload)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.error_message : '');
      } else {
        var _response$data;
        backendMsg = (response === null || response === void 0 ? void 0 : response.error_message) || (response === null || response === void 0 ? void 0 : response.message) || (response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.error_message) || '';
      }
    } catch (_) {
      backendMsg = '';
    }
    return backendMsg;
  };
  var isResponseSuccess = _exports.isResponseSuccess = function isResponseSuccess(response) {
    return !!response && (response.status === 200 || typeof response.status === 'string' && response.status.toLowerCase() === 'success' || (response === null || response === void 0 ? void 0 : response.payload) && typeof response.payload.status === 'string' && response.payload.status.toLowerCase() === 'success');
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Body/Body.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/@splunk/react-icons/DotsThreeVertical.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.styles.js"), __webpack_require__("./node_modules/@splunk/react-ui/Table.js"), __webpack_require__("./src/main/webapp/components/connections/Body/Body.styles.js"), __webpack_require__("./src/main/webapp/components/connections/constants.js"), __webpack_require__("./src/main/webapp/components/connections/Body/hooks/useConnectionsState.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayMap, _esFunctionName, _react, _propTypes, _i18n, _format, _Dropdown, _Menu, _Button, _Modal, _MoreVertical, _LLMConnectionModal, _Table, _Body, _constants, _useConnectionsState2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Dropdown = _interopRequireDefault(_Dropdown);
  _Menu = _interopRequireDefault(_Menu);
  _Button = _interopRequireDefault(_Button);
  _Modal = _interopRequireDefault(_Modal);
  _MoreVertical = _interopRequireDefault(_MoreVertical);
  _Table = _interopRequireDefault(_Table);
  _useConnectionsState2 = _interopRequireDefault(_useConnectionsState2);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var Body = function Body(_ref) {
    var _ref$hasPermission = _ref.hasPermission,
      hasPermission = _ref$hasPermission === void 0 ? {
        showLLM: false,
        showDSDL: false,
        actionsLLM: false,
        actionsDSDL: false
      } : _ref$hasPermission,
      _ref$onEditRow = _ref.onEditRow,
      onEditRow = _ref$onEditRow === void 0 ? null : _ref$onEditRow,
      _ref$onEditPermission = _ref.onEditPermissions,
      onEditPermissions = _ref$onEditPermission === void 0 ? null : _ref$onEditPermission,
      _ref$onOwnerOptionsCh = _ref.onOwnerOptionsChange,
      onOwnerOptionsChange = _ref$onOwnerOptionsCh === void 0 ? function () {} : _ref$onOwnerOptionsCh,
      _ref$onPaginationChan = _ref.onPaginationChange,
      onPaginationChange = _ref$onPaginationChan === void 0 ? function () {} : _ref$onPaginationChan,
      _ref$ownerFilter = _ref.ownerFilter,
      ownerFilter = _ref$ownerFilter === void 0 ? '' : _ref$ownerFilter,
      _ref$refreshKey = _ref.refreshKey,
      refreshKey = _ref$refreshKey === void 0 ? 0 : _ref$refreshKey,
      _ref$searchTerm = _ref.searchTerm,
      searchTerm = _ref$searchTerm === void 0 ? '' : _ref$searchTerm;
    var _useConnectionsState = (0, _useConnectionsState2.default)({
        hasPermission: hasPermission,
        onEditRow: onEditRow,
        onOwnerOptionsChange: onOwnerOptionsChange,
        onPaginationChange: onPaginationChange,
        ownerFilter: ownerFilter,
        refreshKey: refreshKey,
        searchTerm: searchTerm
      }),
      confirmOpen = _useConnectionsState.confirmOpen,
      expandedRowId = _useConnectionsState.expandedRowId,
      isLoading = _useConnectionsState.isLoading,
      rowToDelete = _useConnectionsState.rowToDelete,
      sortDir = _useConnectionsState.sortDir,
      sortKey = _useConnectionsState.sortKey,
      visibleRows = _useConnectionsState.visibleRows,
      cancelDelete = _useConnectionsState.cancelDelete,
      canManageRow = _useConnectionsState.canManageRow,
      confirmDelete = _useConnectionsState.confirmDelete,
      handleEdit = _useConnectionsState.handleEdit,
      handleRowExpansion = _useConnectionsState.handleRowExpansion,
      handleSort = _useConnectionsState.handleSort,
      openDeleteModal = _useConnectionsState.openDeleteModal;
    var getExpansionRow = function getExpansionRow(row) {
      return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
        key: "".concat(row.id, "-expansion")
      }, /*#__PURE__*/_react.default.createElement(_Table.default.Cell, {
        colSpan: 5
      }, /*#__PURE__*/_react.default.createElement(_Body.ExpansionContainer, null, row._details.map(function (detail) {
        return /*#__PURE__*/_react.default.createElement(_Body.ExpansionRow, {
          key: "".concat(row.id, "-").concat(detail.key)
        }, /*#__PURE__*/_react.default.createElement(_Body.ExpansionKey, null, detail.key), /*#__PURE__*/_react.default.createElement(_Body.ExpansionValue, null, detail.value));
      }))));
    };
    return /*#__PURE__*/_react.default.createElement(_Body.Container, null, /*#__PURE__*/_react.default.createElement(_Body.TableCard, null, isLoading ? /*#__PURE__*/_react.default.createElement(_Body.LoadingState, null, (0, _i18n.gettext)('Loading...')) : /*#__PURE__*/_react.default.createElement(_Body.BackgroundWhiteDiv, null, /*#__PURE__*/_react.default.createElement(_Table.default, {
      "data-test": "Connections_Table",
      rowExpansion: "single",
      stripeRows: true
    }, /*#__PURE__*/_react.default.createElement(_Table.default.Head, null, _constants.COLUMNNAMES.map(function (column, index) {
      if (index === 0) {
        return /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
          key: column,
          onSort: handleSort,
          sortDir: sortKey === 'name' ? sortDir : 'none',
          sortKey: "name"
        }, column);
      }
      if (index === 1) {
        return /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
          key: column,
          onSort: handleSort,
          sortDir: sortKey === 'owner' ? sortDir : 'none',
          sortKey: "owner"
        }, column);
      }
      if (index === 2) {
        return /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
          key: column,
          onSort: handleSort,
          sortDir: sortKey === 'sharingLabel' ? sortDir : 'none',
          sortKey: "sharingLabel"
        }, column);
      }
      if (index === 3) {
        return /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
          key: column,
          onSort: handleSort,
          sortDir: sortKey === 'connection_type' ? sortDir : 'none',
          sortKey: "connection_type"
        }, column);
      }
      return /*#__PURE__*/_react.default.createElement(_Table.default.HeadCell, {
        key: "actions-column"
      });
    })), /*#__PURE__*/_react.default.createElement(_Table.default.Body, null, visibleRows.map(function (row) {
      var rowId = row.id;
      var isExpanded = rowId === expandedRowId;
      var showEditorActions = canManageRow(row);
      return /*#__PURE__*/_react.default.createElement(_Table.default.Row, {
        key: rowId,
        expanded: isExpanded,
        expansionRow: getExpansionRow(row),
        onExpansion: function onExpansion() {
          return handleRowExpansion(rowId);
        }
      }, /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, row.name), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, row.owner), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, row._kind === 'CONTAINER' ? row.sharingLabel : /*#__PURE__*/_react.default.createElement(_Body.LinkSpan, {
        onClick: onEditPermissions ? function (event) {
          event.stopPropagation();
          onEditPermissions(row);
        } : undefined
      }, row.sharingLabel)), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, row.connection_type), /*#__PURE__*/_react.default.createElement(_Table.default.Cell, null, showEditorActions && /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
        toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
          appearance: "pill",
          "aria-label": (0, _i18n.gettext)('More actions'),
          icon: /*#__PURE__*/_react.default.createElement(_MoreVertical.default, {
            size: 1
          })
        })
      }, /*#__PURE__*/_react.default.createElement(_Menu.default, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return handleEdit(row);
        }
      }, (0, _i18n.gettext)('Edit connection')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return openDeleteModal(row);
        }
      }, (0, _i18n.gettext)('Delete connection'))))));
    }))), !visibleRows.length && /*#__PURE__*/_react.default.createElement(_Body.EmptyState, null, (0, _i18n.gettext)('No connections found.')))), confirmOpen && /*#__PURE__*/_react.default.createElement(_Body.DeleteConfirmationModal, {
      onRequestClose: cancelDelete,
      open: true
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: cancelDelete,
      title: (0, _i18n.gettext)('Delete connection')
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_Body.DeleteModalBody, null, /*#__PURE__*/_react.default.createElement(_Body.DeleteModalMessage, null, (0, _format.sprintf)((0, _i18n.gettext)('Are you sure you would like to delete "%(name)s"? This action cannot be undone.'), {
      name: rowToDelete === null || rowToDelete === void 0 ? void 0 : rowToDelete.name
    })))), /*#__PURE__*/_react.default.createElement(_Modal.default.Footer, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      onClick: cancelDelete
    }, (0, _i18n.gettext)('Cancel')), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      onClick: confirmDelete
    }, (0, _i18n.gettext)('Delete')))));
  };
  Body.propTypes = {
    hasPermission: _propTypes.default.shape({
      showLLM: _propTypes.default.bool,
      showDSDL: _propTypes.default.bool,
      actionsLLM: _propTypes.default.bool,
      actionsDSDL: _propTypes.default.bool
    }),
    onEditPermissions: _propTypes.default.func,
    onEditRow: _propTypes.default.func,
    onOwnerOptionsChange: _propTypes.default.func,
    onPaginationChange: _propTypes.default.func,
    ownerFilter: _propTypes.default.string,
    refreshKey: _propTypes.default.number,
    searchTerm: _propTypes.default.string
  };
  Body.defaultProps = {
    hasPermission: {
      showLLM: false,
      showDSDL: false,
      actionsLLM: false,
      actionsDSDL: false
    },
    onEditPermissions: null,
    onEditRow: null,
    onOwnerOptionsChange: function onOwnerOptionsChange() {},
    onPaginationChange: function onPaginationChange() {},
    ownerFilter: '',
    refreshKey: 0,
    searchTerm: ''
  };
  var _default = _exports.default = Body;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Body/Body.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es"), __webpack_require__("./src/main/webapp/util/forwardRefComponent.es")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Modal, _Paginator, _Typography, _themes, _forwardRefComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ToolbarRow = _exports.TableCard = _exports.RightPaginator = _exports.PaginatorWrapper = _exports.LoadingState = _exports.LinkSpan = _exports.ExpansionValue = _exports.ExpansionRow = _exports.ExpansionKey = _exports.ExpansionContainer = _exports.EmptyState = _exports.DeleteModalMessage = _exports.DeleteModalBody = _exports.DeleteConfirmationModal = _exports.CountLabel = _exports.Container = _exports.CenterPaginator = _exports.BackgroundWhiteDiv = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Modal = _interopRequireDefault(_Modal);
  _Paginator = _interopRequireDefault(_Paginator);
  _Typography = _interopRequireDefault(_Typography);
  _forwardRefComponent = _interopRequireDefault(_forwardRefComponent);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var Container = _exports.Container = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n"])));
  var TableCard = _exports.TableCard = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    padding: 0 ", " ", ";\n    display: flex;\n    flex-direction: column;\n    background: ", ";\n    color: ", ";\n    border: none;\n    border-radius: 0 0 ", " ", ";\n"])), _themes.variables.spacingXXLarge, _themes.variables.spacingXXLarge, _themes.variables.backgroundColorPage, _themes.variables.textColor, _themes.variables.borderRadius, _themes.variables.borderRadius);
  var CenterPaginator = _exports.CenterPaginator = (0, _styledComponents.default)((0, _forwardRefComponent.default)(_Paginator.default))(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    align-self: center;\n"])));
  var RightPaginator = _exports.RightPaginator = (0, _styledComponents.default)((0, _forwardRefComponent.default)(_Paginator.default.PageControl))(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    align-self: flex-end;\n"])));
  var BackgroundWhiteDiv = _exports.BackgroundWhiteDiv = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    background-color: ", ";\n    border-radius: 0 0 ", " ", ";\n"])), _themes.variables.backgroundColorPage, _themes.variables.borderRadius, _themes.variables.borderRadius);
  var LinkSpan = _exports.LinkSpan = (0, _styledComponents.default)(_Typography.default).attrs({
    as: 'span',
    variant: 'body'
  })(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    color: ", ";\n    cursor: pointer;\n    text-decoration: none;\n\n    &:hover {\n        text-decoration: underline;\n    }\n"])), _themes.variables.linkColor);
  var ToolbarRow = _exports.ToolbarRow = _styledComponents.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n    gap: ", ";\n    margin: 0 0 ", ";\n    padding-top: ", ";\n    color: ", ";\n"])), _themes.variables.spacingSmall, _themes.variables.spacingLarge, _themes.variables.spacingSmall, _themes.variables.textGray);
  var PaginatorWrapper = _exports.PaginatorWrapper = _styledComponents.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    gap: ", ";\n"])), _themes.variables.spacingSmall);
  var CountLabel = _exports.CountLabel = (0, _styledComponents.default)(_Typography.default).attrs({
    as: 'span',
    variant: 'body'
  })(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    font-size: 13px;\n"])));
  var LoadingState = _exports.LoadingState = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    && {\n        text-align: center;\n        padding: ", ";\n        color: ", ";\n    }\n"])), _themes.variables.spacingXXXLarge, _themes.variables.textGray);
  var EmptyState = _exports.EmptyState = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n    && {\n        padding: ", " 0;\n        text-align: center;\n        color: ", ";\n    }\n"])), _themes.variables.spacingXLarge, _themes.variables.textGray);
  var DeleteConfirmationModal = _exports.DeleteConfirmationModal = (0, _styledComponents.default)(_Modal.default)(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n    width: 520px;\n    max-width: 520px;\n"])));
  var DeleteModalBody = _exports.DeleteModalBody = _styledComponents.default.div(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n    color: ", ";\n    line-height: 1.6;\n    margin: 0;\n    padding: ", " 0;\n"])), _themes.variables.textColor, _themes.variables.spacingXLarge);
  var DeleteModalMessage = _exports.DeleteModalMessage = _styledComponents.default.div(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n    color: inherit;\n"])));
  var ExpansionContainer = _exports.ExpansionContainer = _styledComponents.default.div(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    gap: ", ";\n    padding: ", " ", ";\n"])), _themes.variables.spacingSmall, _themes.variables.spacingMedium, _themes.variables.spacingLarge);
  var ExpansionRow = _exports.ExpansionRow = _styledComponents.default.div(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: flex-start;\n    gap: ", ";\n"])), _themes.variables.spacingLarge);
  var ExpansionKey = _exports.ExpansionKey = (0, _styledComponents.default)(_Typography.default)(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["\n    && {\n        min-width: 180px;\n        font-weight: 600;\n        color: ", ";\n        flex-shrink: 0;\n    }\n"])), _themes.variables.textColor);
  var ExpansionValue = _exports.ExpansionValue = (0, _styledComponents.default)(_Typography.default)(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["\n    && {\n        flex: 1;\n        color: ", ";\n        word-break: break-word;\n    }\n"])), _themes.variables.textColor);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Body/hooks/useConnectionsState.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.array.sort.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/url.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/connections/constants.js"), __webpack_require__("./src/main/webapp/components/connections/Body/utils/connectionNormalizer.js"), __webpack_require__("./src/main/webapp/components/connections/Body/utils/connectionUtils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esArraySlice, _esArraySort, _esFunctionName, _esObjectToString, _esRegexpToString, _esSet, _esStringIncludes, _esStringIterator, _esStringTrim, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsIterator, _react, _url, _i18n, _format, _ToastConstants, _ToastUtil, _ConnectionManagementApi, _AgentBuilderApi, _constants, _connectionNormalizer, _connectionUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
  var useConnectionsState = function useConnectionsState(_ref) {
    var hasPermission = _ref.hasPermission,
      onEditRow = _ref.onEditRow,
      onOwnerOptionsChange = _ref.onOwnerOptionsChange,
      onPaginationChange = _ref.onPaginationChange,
      ownerFilter = _ref.ownerFilter,
      refreshKey = _ref.refreshKey,
      searchTerm = _ref.searchTerm;
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      expandedRowId = _useState2[0],
      setExpandedRowId = _useState2[1];
    var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      connections = _useState4[0],
      setConnections = _useState4[1];
    var _useState5 = (0, _react.useState)('name'),
      _useState6 = _slicedToArray(_useState5, 2),
      sortKey = _useState6[0],
      setSortKey = _useState6[1];
    var _useState7 = (0, _react.useState)('asc'),
      _useState8 = _slicedToArray(_useState7, 2),
      sortDir = _useState8[0],
      setSortDir = _useState8[1];
    var _useState9 = (0, _react.useState)(true),
      _useState10 = _slicedToArray(_useState9, 2),
      isLoading = _useState10[0],
      setIsLoading = _useState10[1];
    var _useState11 = (0, _react.useState)(1),
      _useState12 = _slicedToArray(_useState11, 2),
      pageNum = _useState12[0],
      setPageNum = _useState12[1];
    var _useState13 = (0, _react.useState)(false),
      _useState14 = _slicedToArray(_useState13, 2),
      confirmOpen = _useState14[0],
      setConfirmOpen = _useState14[1];
    var _useState15 = (0, _react.useState)(null),
      _useState16 = _slicedToArray(_useState15, 2),
      rowToDelete = _useState16[0],
      setRowToDelete = _useState16[1];
    var fetchConnections = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var result, errorMessage, allRows, ownerOptions, _errorMessage;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setIsLoading(true);
            _context.prev = 1;
            _context.next = 4;
            return (0, _ConnectionManagementApi.getConnectionsList)();
          case 4:
            result = _context.sent;
            if (!((result === null || result === void 0 ? void 0 : result.status) === 'fail' || (result === null || result === void 0 ? void 0 : result.status) === 'error')) {
              _context.next = 11;
              break;
            }
            errorMessage = (result === null || result === void 0 ? void 0 : result.message) || (result === null || result === void 0 ? void 0 : result.error_message) || (0, _i18n.gettext)('Failed to fetch connections. Please try again.');
            (0, _ToastUtil.triggerToast)(errorMessage, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            setConnections([]);
            onOwnerOptionsChange([]);
            return _context.abrupt("return");
          case 11:
            allRows = (result === null || result === void 0 ? void 0 : result.status) === 'success' && Array.isArray(result === null || result === void 0 ? void 0 : result.result) ? (0, _connectionNormalizer.normalizeConnections)(result.result) : [];
            setConnections(allRows);
            ownerOptions = Array.from(new Set(allRows.map(function (row) {
              return row.owner;
            }).filter(Boolean))).sort(function (first, second) {
              return first.localeCompare(second);
            }).map(function (owner) {
              return {
                label: owner,
                value: owner
              };
            });
            onOwnerOptionsChange(ownerOptions);
            _context.next = 24;
            break;
          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](1);
            console.error('Failed to fetch connections:', _context.t0);
            _errorMessage = (_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || (_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.error_message) || (0, _i18n.gettext)('Failed to fetch connections. Please try again.');
            (0, _ToastUtil.triggerToast)(_errorMessage, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            setConnections([]);
            onOwnerOptionsChange([]);
          case 24:
            _context.prev = 24;
            setIsLoading(false);
            return _context.finish(24);
          case 27:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 17, 24, 27]]);
    })), [onOwnerOptionsChange]);
    (0, _react.useEffect)(function () {
      fetchConnections();
    }, [fetchConnections, refreshKey]);
    (0, _react.useEffect)(function () {
      setPageNum(1);
    }, [searchTerm, ownerFilter]);
    var filteredRows = (0, _react.useMemo)(function () {
      var query = (searchTerm || '').toLowerCase().trim();
      var ownerQuery = (ownerFilter || '').toLowerCase().trim();
      return (connections || []).filter(function (row) {
        if (row._kind === 'LLM' && !(hasPermission !== null && hasPermission !== void 0 && hasPermission.showLLM)) {
          return false;
        }
        if (row._kind === 'CONTAINER' && !(hasPermission !== null && hasPermission !== void 0 && hasPermission.showDSDL)) {
          return false;
        }
        var matchesSearch = !query || [row.name, row.owner, row.sharingLabel, row.connection_type].filter(Boolean).some(function (value) {
          return value.toString().toLowerCase().includes(query);
        });
        var matchesOwner = !ownerQuery || (row.owner || '').toString().toLowerCase() === ownerQuery;
        return matchesSearch && matchesOwner;
      });
    }, [connections, hasPermission, ownerFilter, searchTerm]);
    var sortedRows = (0, _react.useMemo)(function () {
      var rows = _toConsumableArray(filteredRows);
      rows.sort(function (first, second) {
        var firstValue = ((first === null || first === void 0 ? void 0 : first[sortKey]) || '').toString().toLowerCase();
        var secondValue = ((second === null || second === void 0 ? void 0 : second[sortKey]) || '').toString().toLowerCase();
        if (firstValue < secondValue) {
          return sortDir === 'asc' ? -1 : 1;
        }
        if (firstValue > secondValue) {
          return sortDir === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return rows;
    }, [filteredRows, sortDir, sortKey]);
    var totalPages = Math.max(1, Math.ceil(sortedRows.length / _constants.ROWS));
    var visibleRows = (0, _react.useMemo)(function () {
      return sortedRows.slice((pageNum - 1) * _constants.ROWS, pageNum * _constants.ROWS);
    }, [pageNum, sortedRows]);
    (0, _react.useEffect)(function () {
      if (pageNum > totalPages) {
        setPageNum(totalPages);
      }
    }, [pageNum, totalPages]);
    (0, _react.useEffect)(function () {
      onPaginationChange({
        count: filteredRows.length,
        pageNum: pageNum,
        totalPages: totalPages,
        setPageNum: setPageNum
      });
    }, [filteredRows.length, onPaginationChange, pageNum, totalPages]);
    var handleSort = (0, _react.useCallback)(function (event, _ref3) {
      var nextSortKey = _ref3.sortKey;
      setSortKey(function (previousSortKey) {
        if (previousSortKey === nextSortKey) {
          setSortDir(function (previousSortDir) {
            return previousSortDir === 'asc' ? 'desc' : 'asc';
          });
        } else {
          setSortDir('asc');
        }
        return nextSortKey;
      });
    }, []);
    var handleRowExpansion = (0, _react.useCallback)(function (rowId) {
      setExpandedRowId(function (currentRowId) {
        return currentRowId === rowId ? null : rowId;
      });
    }, []);
    var handleEdit = (0, _react.useCallback)(function (row) {
      if (onEditRow) {
        onEditRow(row);
        return;
      }
      var baseURL = (0, _url.createURL)("/app/".concat(_constants.APP));
      if (row._kind === 'LLM') {
        var connectionName = encodeURIComponent((0, _connectionUtils.getLlmConnectionName)(row._raw) || row.name);
        var provider = encodeURIComponent((0, _connectionUtils.getLlmProvider)(row._raw));
        var model = encodeURIComponent((0, _connectionUtils.getLlmModel)(row._raw));
        window.location.href = "".concat(baseURL, "/connection?edit=true&connection=").concat(connectionName, "&provider=").concat(provider, "&model=").concat(model);
        return;
      }
      if (row._kind === 'CONTAINER') {
        var _connectionName = encodeURIComponent(row._raw.connection_name || row.name);
        var _provider = encodeURIComponent(row._raw.connection_type || row._raw.container_type || _constants.CONNECTION_TYPES.CONTAINER);
        window.location.href = "".concat(baseURL, "/connection?edit=true&connection=").concat(_connectionName, "&provider=").concat(_provider);
        return;
      }
      var type = row._kind === 'MCP' ? 'MCP' : 'KB';
      var name = encodeURIComponent(row.name);
      window.location.href = "".concat(baseURL, "/agentconnections?open=true&mode=edit&type=").concat(type, "&name=").concat(name);
    }, [onEditRow]);
    var openDeleteModal = (0, _react.useCallback)(function (row) {
      setRowToDelete(row);
      setConfirmOpen(true);
    }, []);
    var cancelDelete = (0, _react.useCallback)(function () {
      setConfirmOpen(false);
      setRowToDelete(null);
    }, []);
    var confirmDelete = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var deletedConnectionName, connectionName, provider, _connectionName2;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (rowToDelete) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return");
          case 2:
            deletedConnectionName = rowToDelete.name;
            _context2.prev = 3;
            if (!(rowToDelete._kind === 'LLM')) {
              _context2.next = 10;
              break;
            }
            connectionName = encodeURIComponent((0, _connectionUtils.getLlmConnectionName)(rowToDelete._raw) || rowToDelete.name);
            _context2.next = 8;
            return (0, _ConnectionManagementApi.deleteConnection)("/".concat(connectionName));
          case 8:
            _context2.next = 25;
            break;
          case 10:
            if (!(rowToDelete._kind === 'CONTAINER')) {
              _context2.next = 17;
              break;
            }
            provider = encodeURIComponent(rowToDelete._raw.connection_type || rowToDelete._raw.container_type || _constants.CONNECTION_TYPES.CONTAINER);
            _connectionName2 = encodeURIComponent(rowToDelete._raw.connection_name || rowToDelete.name);
            _context2.next = 15;
            return (0, _ConnectionManagementApi.deleteContainerConnection)("/".concat(provider, "/").concat(_connectionName2));
          case 15:
            _context2.next = 25;
            break;
          case 17:
            if (!(rowToDelete._kind === 'MCP')) {
              _context2.next = 22;
              break;
            }
            _context2.next = 20;
            return (0, _AgentBuilderApi.deleteMcpConnections)("/".concat(rowToDelete.name));
          case 20:
            _context2.next = 25;
            break;
          case 22:
            if (!(rowToDelete._kind === 'KB')) {
              _context2.next = 25;
              break;
            }
            _context2.next = 25;
            return (0, _AgentBuilderApi.deletekbConnections)("/".concat(rowToDelete.name));
          case 25:
            (0, _ToastUtil.triggerToast)((0, _format.sprintf)((0, _i18n.gettext)('Connection "%(name)s" deleted successfully.'), {
              name: deletedConnectionName
            }), _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            fetchConnections();
            _context2.next = 33;
            break;
          case 29:
            _context2.prev = 29;
            _context2.t0 = _context2["catch"](3);
            console.error('Failed to delete connection:', _context2.t0);
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Failed to delete connection. Please try again.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 33:
            _context2.prev = 33;
            cancelDelete();
            return _context2.finish(33);
          case 36:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[3, 29, 33, 36]]);
    })), [cancelDelete, fetchConnections, rowToDelete]);
    var canManageRow = (0, _react.useCallback)(function (row) {
      if (row._kind === 'LLM') {
        return !!(hasPermission !== null && hasPermission !== void 0 && hasPermission.actionsLLM);
      }
      if (row._kind === 'CONTAINER') {
        return !!(hasPermission !== null && hasPermission !== void 0 && hasPermission.actionsDSDL);
      }
      return true;
    }, [hasPermission]);
    return {
      // State
      confirmOpen: confirmOpen,
      expandedRowId: expandedRowId,
      isLoading: isLoading,
      rowToDelete: rowToDelete,
      sortDir: sortDir,
      sortKey: sortKey,
      visibleRows: visibleRows,
      // Handlers
      cancelDelete: cancelDelete,
      canManageRow: canManageRow,
      confirmDelete: confirmDelete,
      handleEdit: handleEdit,
      handleRowExpansion: handleRowExpansion,
      handleSort: handleSort,
      openDeleteModal: openDeleteModal
    };
  };
  var _default = _exports.default = useConnectionsState;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Body/utils/connectionNormalizer.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.ends-with.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/connections/constants.js"), __webpack_require__("./src/main/webapp/components/connections/Body/utils/connectionUtils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayIncludes, _esArrayJoin, _esArrayMap, _esFunctionName, _esObjectToString, _esRegexpToString, _esStringEndsWith, _esStringTrim, _config, _i18n, _constants, _connectionUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.normalizeConnections = _exports.isMcpConnectionRow = _exports.isLlmConnectionRow = _exports.isKbConnectionRow = void 0;
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  var isLlmConnectionRow = _exports.isLlmConnectionRow = function isLlmConnectionRow(row) {
    var rawType = ((row === null || row === void 0 ? void 0 : row.connection_type) || '').toString().toLowerCase();
    if (rawType === _constants.CONNECTION_TYPES.LLM) {
      return true;
    }
    return Boolean((0, _connectionUtils.getLlmProvider)(row) && (0, _connectionUtils.getLlmModel)(row) && (0, _connectionUtils.getLlmConnectionName)(row));
  };
  var isMcpConnectionRow = _exports.isMcpConnectionRow = function isMcpConnectionRow(row) {
    var rawType = ((row === null || row === void 0 ? void 0 : row.connection_type) || '').toString().toLowerCase();
    if (rawType === _constants.CONNECTION_TYPES.MCP) {
      return true;
    }
    var providerType = ((0, _connectionUtils.getMcpProvider)(row) || '').toString().toUpperCase();
    return Boolean((0, _connectionUtils.getMcpConnectionName)(row) && ['SPLUNK', 'ATLASSIAN'].includes(providerType));
  };
  var isKbConnectionRow = _exports.isKbConnectionRow = function isKbConnectionRow(row) {
    var rawType = ((row === null || row === void 0 ? void 0 : row.connection_type) || '').toString().toLowerCase();
    if (rawType === _constants.CONNECTION_TYPES.KB) {
      return true;
    }
    var kbType = ((0, _connectionUtils.getKbType)(row) || '').toString().toUpperCase();
    return Boolean((0, _connectionUtils.getKbConnectionName)(row) && kbType.endsWith('_KB'));
  };
  var buildLlmDetails = function buildLlmDetails(row) {
    var details = [{
      key: (0, _i18n.gettext)('Provider'),
      value: (0, _connectionUtils.toDisplayValue)((0, _connectionUtils.getLlmProvider)(row))
    }, {
      key: (0, _i18n.gettext)('Model'),
      value: (0, _connectionUtils.toDisplayValue)((0, _connectionUtils.getLlmModel)(row))
    }];
    if (row !== null && row !== void 0 && row.description) {
      details.push({
        key: (0, _i18n.gettext)('Description'),
        value: (0, _connectionUtils.toDisplayValue)(row.description)
      });
    }
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)(row, ['Connection Name', 'Model', 'Provider', 'User', 'Key', 'name', 'provider', 'model', 'description', 'is_custom', 'user', 'key', 'connection_name', 'connection_type', 'owner', 'sharing', 'app', 'connection_details', 'llm_params', 'default_users'], true)));
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)((row === null || row === void 0 ? void 0 : row.connection_details) || {}, ['user', 'key'], true)));
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)((row === null || row === void 0 ? void 0 : row.llm_params) || {}, [], true)));
    return details;
  };
  var buildMcpDetails = function buildMcpDetails(row) {
    var details = [{
      key: (0, _i18n.gettext)('Provider'),
      value: (0, _connectionUtils.toDisplayValue)((0, _connectionUtils.getMcpProvider)(row))
    }];
    if (row !== null && row !== void 0 && row.description) {
      details.push({
        key: (0, _i18n.gettext)('Description'),
        value: (0, _connectionUtils.toDisplayValue)(row.description)
      });
    }
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)(row, ['name', 'description', 'type', 'details', 'connection_type', 'owner', 'sharing', 'app'], true)));
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)((row === null || row === void 0 ? void 0 : row.details) || {}, ['is_auto_refresh_enabled', 'token'], true)));
    return details;
  };
  var buildKbDetails = function buildKbDetails(row) {
    var details = [{
      key: (0, _i18n.gettext)('Type'),
      value: (0, _connectionUtils.toDisplayValue)((0, _connectionUtils.getKbType)(row))
    }];
    if (row !== null && row !== void 0 && row.description) {
      details.push({
        key: (0, _i18n.gettext)('Description'),
        value: (0, _connectionUtils.toDisplayValue)(row.description)
      });
    }
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)(row, ['name', 'description', 'type', 'details', 'connection_type', 'owner', 'sharing', 'app'], true)));
    details.push.apply(details, _toConsumableArray((0, _connectionUtils.buildPrimitiveDetails)((row === null || row === void 0 ? void 0 : row.details) || {}, [], true)));
    return details;
  };
  var normalizeConnections = _exports.normalizeConnections = function normalizeConnections(rawConnections) {
    return (rawConnections || []).map(function (row) {
      var _row$acl, _row$acl2, _row$acl3;
      var rawType = ((row === null || row === void 0 ? void 0 : row.connection_type) || '').toString().toLowerCase();
      var isLLM = isLlmConnectionRow(row);
      var isMCP = isMcpConnectionRow(row);
      var isKB = isKbConnectionRow(row);
      var isContainer = rawType === _constants.CONNECTION_TYPES.CONTAINER || rawType === _constants.CONNECTION_TYPES.DOCKER || rawType === _constants.CONNECTION_TYPES.KUBERNETES;
      if (!isLLM && !isMCP && !isKB && !isContainer) {
        return null;
      }
      if (isContainer && !(row.connection_name || row['Connection Name'])) {
        return null;
      }
      var name = isLLM && (0, _connectionUtils.getLlmConnectionName)(row) || isMCP && (0, _connectionUtils.getMcpConnectionName)(row) || isKB && (0, _connectionUtils.getKbConnectionName)(row) || row['Connection Name'] || row.connection_name || row.name || (isLLM ? "".concat((0, _connectionUtils.getLlmProvider)(row) || (0, _i18n.gettext)('LLM'), " ").concat((0, _connectionUtils.getLlmModel)(row) || '').trim() : '');
      var owner = (0, _connectionUtils.normalizeOwnerValue)(row.owner) || (0, _connectionUtils.normalizeOwnerValue)(row === null || row === void 0 ? void 0 : (_row$acl = row.acl) === null || _row$acl === void 0 ? void 0 : _row$acl.owner) || (0, _connectionUtils.normalizeOwnerValue)(row.created_by) || (0, _connectionUtils.normalizeOwnerValue)(row.updated_by) || (0, _connectionUtils.normalizeOwnerValue)(row.last_updated_by) || _config.username || (0, _i18n.gettext)('-');
      var sharing = row.sharing || (row === null || row === void 0 ? void 0 : (_row$acl2 = row.acl) === null || _row$acl2 === void 0 ? void 0 : _row$acl2.sharing) || 'owner';
      var kind = 'CONTAINER';
      if (isLLM) {
        kind = 'LLM';
      } else if (isMCP) {
        kind = 'MCP';
      } else if (isKB) {
        kind = 'KB';
      }
      var idParts = [kind.toLowerCase(), isLLM ? (0, _connectionUtils.getLlmProvider)(row) : row.Provider, isLLM ? (0, _connectionUtils.getLlmModel)(row) : row.Model, name].filter(Boolean);
      var details = (0, _connectionUtils.buildPrimitiveDetails)(row, ['Connection Name', 'connection_name', 'connection_type', 'owner', 'sharing', 'app']);
      if (isLLM) {
        details = buildLlmDetails(row);
      } else if (isMCP) {
        details = buildMcpDetails(row);
      } else if (isKB) {
        details = buildKbDetails(row);
      }
      var connectionTypeLabel = (0, _i18n.gettext)('Container');
      if (isLLM) {
        connectionTypeLabel = (0, _i18n.gettext)('LLM');
      } else if (isMCP) {
        connectionTypeLabel = (0, _i18n.gettext)('MCP');
      } else if (isKB) {
        connectionTypeLabel = (0, _i18n.gettext)('Knowledge base');
      }
      return {
        id: idParts.join(':'),
        name: name,
        owner: owner,
        sharing: sharing,
        sharingLabel: (0, _connectionUtils.toSharingLabel)(sharing),
        app: row.app || (row === null || row === void 0 ? void 0 : (_row$acl3 = row.acl) === null || _row$acl3 === void 0 ? void 0 : _row$acl3.app) || '-',
        connection_type: connectionTypeLabel,
        _details: details,
        _kind: kind,
        _raw: row
      };
    }).filter(Boolean);
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Body/utils/connectionUtils.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.join.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.array.slice.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esArrayIncludes, _esArrayIterator, _esArrayJoin, _esArrayMap, _esArraySlice, _esFunctionName, _esObjectEntries, _esObjectToString, _esRegexpToString, _esSet, _esStringIncludes, _esStringIterator, _esStringTrim, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsIterator, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toSharingLabel = _exports.toDisplayValue = _exports.prettifyDetailKey = _exports.normalizeOwnerValue = _exports.getMcpProvider = _exports.getMcpConnectionName = _exports.getLlmProvider = _exports.getLlmModel = _exports.getLlmConnectionName = _exports.getKbType = _exports.getKbConnectionName = _exports.buildPrimitiveDetails = _exports.SENSITIVE_KEYS = _exports.HIDDEN_DETAIL_KEYS = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var SENSITIVE_KEYS = _exports.SENSITIVE_KEYS = new Set(['acl', 'api_token', 'access_token', 'aws_access_key_id', 'aws_secret_access_key', 'Id', 'jupyter_passwd', 'jupyter_password', 'olly_splunk_access_token', 'service_account_token', 'sharing', 'splunk_access_token', 'splunk_hec_token', 'token', 'user_password']);
  var HIDDEN_DETAIL_KEYS = _exports.HIDDEN_DETAIL_KEYS = new Set(['_key', '_user', 'created_at', 'created_by', 'is_docker', 'is_kubernetes', 'updated_at', 'updated_by', 'last_updated_at', 'last_updated_by', 'Created At', 'Created By', 'Updated At', 'Updated By', 'Last Updated At', 'Last Updated By']);
  var toSharingLabel = _exports.toSharingLabel = function toSharingLabel(sharingValue) {
    var sharing = (sharingValue || 'owner').toString().toLowerCase();
    if (sharing === 'app') {
      return (0, _i18n.gettext)('App');
    }
    if (sharing === 'global') {
      return (0, _i18n.gettext)('Global');
    }
    return (0, _i18n.gettext)('Private');
  };
  var toDisplayValue = _exports.toDisplayValue = function toDisplayValue(value) {
    if (value == null || value === '') {
      return (0, _i18n.gettext)('-');
    }
    if (typeof value === 'boolean') {
      return value ? (0, _i18n.gettext)('true') : (0, _i18n.gettext)('false');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };
  var normalizeOwnerValue = _exports.normalizeOwnerValue = function normalizeOwnerValue(value) {
    var normalized = (value || '').toString().trim();
    if (!normalized || normalized.toLowerCase() === 'nobody') {
      return '';
    }
    return normalized;
  };
  var prettifyDetailKey = _exports.prettifyDetailKey = function prettifyDetailKey(key) {
    return String(key).split('_').map(function (segment) {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    }).join(' ');
  };
  var buildPrimitiveDetails = _exports.buildPrimitiveDetails = function buildPrimitiveDetails() {
    var row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var excludedKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var prettifyKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return Object.entries(row).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      if (excludedKeys.includes(key) || SENSITIVE_KEYS.has(key) || HIDDEN_DETAIL_KEYS.has(key)) {
        return false;
      }
      if (value == null || value === '') {
        return false;
      }
      return ['string', 'number', 'boolean'].includes(_typeof(value));
    }).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];
      return {
        key: prettifyKeys ? prettifyDetailKey(key) : key,
        value: toDisplayValue(value)
      };
    });
  };
  var getLlmProvider = _exports.getLlmProvider = function getLlmProvider(row) {
    return (row === null || row === void 0 ? void 0 : row.provider) || (row === null || row === void 0 ? void 0 : row.Provider) || '';
  };
  var getLlmModel = _exports.getLlmModel = function getLlmModel(row) {
    return (row === null || row === void 0 ? void 0 : row.model) || (row === null || row === void 0 ? void 0 : row.Model) || '';
  };
  var getLlmConnectionName = _exports.getLlmConnectionName = function getLlmConnectionName(row) {
    return (row === null || row === void 0 ? void 0 : row.name) || (row === null || row === void 0 ? void 0 : row['Connection Name']) || (row === null || row === void 0 ? void 0 : row.connection_name) || '';
  };
  var getMcpConnectionName = _exports.getMcpConnectionName = function getMcpConnectionName(row) {
    return (row === null || row === void 0 ? void 0 : row.name) || (row === null || row === void 0 ? void 0 : row.connection_name) || '';
  };
  var getMcpProvider = _exports.getMcpProvider = function getMcpProvider(row) {
    return (row === null || row === void 0 ? void 0 : row.type) || '';
  };
  var getKbConnectionName = _exports.getKbConnectionName = function getKbConnectionName(row) {
    return (row === null || row === void 0 ? void 0 : row.name) || (row === null || row === void 0 ? void 0 : row.connection_name) || '';
  };
  var getKbType = _exports.getKbType = function getKbType(row) {
    return (row === null || row === void 0 ? void 0 : row.type) || '';
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/ConnectionsPage.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastMessages.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es"), __webpack_require__("./node_modules/@splunk/react-ui/Paginator.js"), __webpack_require__("./src/main/webapp/components/agents/modals/AgentPermissionsModal.jsx"), __webpack_require__("./src/main/webapp/components/connections/Header/Header.jsx"), __webpack_require__("./src/main/webapp/components/connections/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/connections/Body/Body.jsx"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.jsx"), __webpack_require__("./src/main/webapp/components/connections/AgentConnectionModal/AgentConnectionModal.jsx"), __webpack_require__("./src/main/webapp/components/connections/ContainerConnectionModal/ContainerConnectionModal.jsx"), __webpack_require__("./src/main/webapp/components/connections/hooks/useConnectionsPageState.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _react, _styledComponents, _ToastMessages, _i18n, _themes, _Paginator, _AgentPermissionsModal, _Header, _Header2, _Body, _LLMConnectionModal, _AgentConnectionModal, _ContainerConnectionModal, _useConnectionsPageState) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _styledComponents = _interopRequireWildcard(_styledComponents);
  _ToastMessages = _interopRequireDefault(_ToastMessages);
  _Paginator = _interopRequireDefault(_Paginator);
  _AgentPermissionsModal = _interopRequireDefault(_AgentPermissionsModal);
  _Header = _interopRequireDefault(_Header);
  _Body = _interopRequireDefault(_Body);
  _LLMConnectionModal = _interopRequireDefault(_LLMConnectionModal);
  _AgentConnectionModal = _interopRequireDefault(_AgentConnectionModal);
  _ContainerConnectionModal = _interopRequireDefault(_ContainerConnectionModal);
  _useConnectionsPageState = _interopRequireDefault(_useConnectionsPageState);
  var _templateObject, _templateObject2;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var ConnectionsContainer = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n    gap: 0;\n\n    & > * {\n        flex: 0 0 auto;\n        height: auto;\n        min-height: 0;\n    }\n"])));
  var ConnectionsGlobalStyle = (0, _styledComponents.createGlobalStyle)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    && [data-test='toast'] [data-test='toast-message'],\n    && [data-test='toast'] [data-test='toast-message-title'] {\n        color: ", ";\n        opacity: 1;\n    }\n\n    /* Ensure all modal input text is properly colored - SUI modals render in portals */\n    [data-test='text'] input,\n    [data-test='number'] input,\n    [data-test='control-group'] input,\n    [data-test='control-group'] textarea {\n        color: ", ";\n        -webkit-text-fill-color: ", ";\n    }\n\n    /* Action menu icon color */\n    [data-test='dropdown'] button[appearance='pill'] svg,\n    button[aria-label='More actions'] svg {\n        color: ", ";\n    }\n"])), _themes.variables.textColor, _themes.variables.textColor, _themes.variables.textColor, _themes.variables.textColor);
  var ConnectionManagement = function ConnectionManagement() {
    var _useConnectionsPageSt = (0, _useConnectionsPageState.default)(),
      hasPermission = _useConnectionsPageSt.hasPermission,
      searchTerm = _useConnectionsPageSt.searchTerm,
      ownerFilter = _useConnectionsPageSt.ownerFilter,
      ownerOptions = _useConnectionsPageSt.ownerOptions,
      paginationContent = _useConnectionsPageSt.paginationContent,
      refreshKey = _useConnectionsPageSt.refreshKey,
      llmModalState = _useConnectionsPageSt.llmModalState,
      agentModalState = _useConnectionsPageSt.agentModalState,
      containerModalState = _useConnectionsPageSt.containerModalState,
      permissionsOpen = _useConnectionsPageSt.permissionsOpen,
      permissionsAgent = _useConnectionsPageSt.permissionsAgent,
      permissionsRoles = _useConnectionsPageSt.permissionsRoles,
      permissionsDisplayFor = _useConnectionsPageSt.permissionsDisplayFor,
      permissionsReadRoles = _useConnectionsPageSt.permissionsReadRoles,
      permissionsWriteRoles = _useConnectionsPageSt.permissionsWriteRoles,
      permissionsError = _useConnectionsPageSt.permissionsError,
      permissionsLoading = _useConnectionsPageSt.permissionsLoading,
      setSearchTerm = _useConnectionsPageSt.setSearchTerm,
      setOwnerFilter = _useConnectionsPageSt.setOwnerFilter,
      setOwnerOptions = _useConnectionsPageSt.setOwnerOptions,
      setPaginationInfo = _useConnectionsPageSt.setPaginationInfo,
      setPermissionsDisplayFor = _useConnectionsPageSt.setPermissionsDisplayFor,
      setPermissionsReadRoles = _useConnectionsPageSt.setPermissionsReadRoles,
      setPermissionsWriteRoles = _useConnectionsPageSt.setPermissionsWriteRoles,
      handleAddType = _useConnectionsPageSt.handleAddType,
      handleEditRow = _useConnectionsPageSt.handleEditRow,
      handleSaved = _useConnectionsPageSt.handleSaved,
      closeLlmModal = _useConnectionsPageSt.closeLlmModal,
      closeAgentModal = _useConnectionsPageSt.closeAgentModal,
      closeContainerModal = _useConnectionsPageSt.closeContainerModal,
      openPermissionsForConnection = _useConnectionsPageSt.openPermissionsForConnection,
      handleSavePermissions = _useConnectionsPageSt.handleSavePermissions,
      closePermissionsModal = _useConnectionsPageSt.closePermissionsModal;
    var paginationElement = (0, _react.useMemo)(function () {
      return /*#__PURE__*/_react.default.createElement(_Header2.PaginatorWrapper, null, /*#__PURE__*/_react.default.createElement(_Header2.CountLabel, null, paginationContent.count, ' ', paginationContent.count === 1 ? (0, _i18n.gettext)('connection') : (0, _i18n.gettext)('connections')), /*#__PURE__*/_react.default.createElement(_Paginator.default.PageControl, {
        current: paginationContent.pageNum,
        onChange: function onChange(event, _ref) {
          var page = _ref.page;
          return paginationContent.setPageNum(page);
        },
        totalPages: paginationContent.totalPages
      }));
    }, [paginationContent]);
    return /*#__PURE__*/_react.default.createElement(ConnectionsContainer, null, /*#__PURE__*/_react.default.createElement(ConnectionsGlobalStyle, null), /*#__PURE__*/_react.default.createElement(_ToastMessages.default, {
      position: "top-center"
    }), /*#__PURE__*/_react.default.createElement(_Header.default, {
      onAddType: handleAddType,
      onOwnerFilterChange: setOwnerFilter,
      onSearchChange: setSearchTerm,
      ownerFilter: ownerFilter,
      ownerOptions: ownerOptions,
      paginationContent: paginationElement,
      searchTerm: searchTerm
    }), /*#__PURE__*/_react.default.createElement(_Body.default, {
      hasPermission: hasPermission,
      onEditPermissions: openPermissionsForConnection,
      onEditRow: handleEditRow,
      onOwnerOptionsChange: setOwnerOptions,
      onPaginationChange: setPaginationInfo,
      ownerFilter: ownerFilter,
      refreshKey: refreshKey,
      searchTerm: searchTerm
    }), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.default, {
      editMode: llmModalState.editMode,
      initialConnectionName: llmModalState.connectionName,
      initialDescription: llmModalState.description,
      initialIsCustom: llmModalState.isCustom,
      initialModel: llmModalState.model,
      initialProvider: llmModalState.provider,
      onRequestClose: closeLlmModal,
      onSaved: handleSaved,
      open: llmModalState.open
    }), /*#__PURE__*/_react.default.createElement(_AgentConnectionModal.default, {
      editMode: agentModalState.editMode,
      initialConnectionData: agentModalState.connectionData,
      initialProvider: agentModalState.provider,
      onRequestClose: closeAgentModal,
      onSaved: handleSaved,
      open: agentModalState.open,
      type: agentModalState.type
    }), /*#__PURE__*/_react.default.createElement(_ContainerConnectionModal.default, {
      editMode: containerModalState.editMode,
      initialConnectionName: containerModalState.connectionName,
      initialProvider: containerModalState.provider,
      onRequestClose: closeContainerModal,
      onSaved: handleSaved,
      open: containerModalState.open
    }), permissionsOpen && /*#__PURE__*/_react.default.createElement(_AgentPermissionsModal.default, {
      onRequestClose: closePermissionsModal,
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
    }));
  };
  var _default = _exports.default = ConnectionManagement;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/ContainerConnectionModal/ContainerConnectionModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/TextArea.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/connection/container_connections.json"), __webpack_require__("./src/main/webapp/components/connection/LLMConnection/ContainerProviders.jsx"), __webpack_require__("./src/main/webapp/components/connection/shared/WarningAndConsent/WarningAndConsent.jsx"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.styles.js"), __webpack_require__("./src/main/webapp/components/connections/ContainerConnectionModal/hooks/useContainerConnectionState.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esObjectKeys, _react, _propTypes, _Modal, _Button, _Select, _Text, _TextArea, _Typography, _i18n, _container_connections, _ContainerProviders, _WarningAndConsent, _LLMConnectionModal, _useContainerConnectionState) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
  _TextArea = _interopRequireDefault(_TextArea);
  _Typography = _interopRequireDefault(_Typography);
  _container_connections = _interopRequireDefault(_container_connections);
  _ContainerProviders = _interopRequireDefault(_ContainerProviders);
  _WarningAndConsent = _interopRequireDefault(_WarningAndConsent);
  _useContainerConnectionState = _interopRequireDefault(_useContainerConnectionState);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ContainerConnectionModal = function ContainerConnectionModal(_ref) {
    var editMode = _ref.editMode,
      initialConnectionName = _ref.initialConnectionName,
      initialProvider = _ref.initialProvider,
      onRequestClose = _ref.onRequestClose,
      onSaved = _ref.onSaved,
      open = _ref.open;
    var _useContainerConnecti = (0, _useContainerConnectionState.default)({
        editMode: editMode,
        initialConnectionName: initialConnectionName,
        initialProvider: initialProvider,
        onRequestClose: onRequestClose,
        onSaved: onSaved,
        open: open
      }),
      allowHPA = _useContainerConnecti.allowHPA,
      connectionDescription = _useContainerConnecti.connectionDescription,
      connectionName = _useContainerConnecti.connectionName,
      errors = _useContainerConnecti.errors,
      formData = _useContainerConnecti.formData,
      isBusy = _useContainerConnecti.isBusy,
      isLoading = _useContainerConnecti.isLoading,
      isSaving = _useContainerConnecti.isSaving,
      isTesting = _useContainerConnecti.isTesting,
      isTestConnectionSuccessful = _useContainerConnecti.isTestConnectionSuccessful,
      lockedProviderSelection = _useContainerConnecti.lockedProviderSelection,
      selectedProvider = _useContainerConnecti.selectedProvider,
      selectedProviderFormFields = _useContainerConnecti.selectedProviderFormFields,
      title = _useContainerConnecti.title,
      setConnectionDescription = _useContainerConnecti.setConnectionDescription,
      setConnectionName = _useContainerConnecti.setConnectionName,
      setFormData = _useContainerConnecti.setFormData,
      setIsTestConnectionSuccessful = _useContainerConnecti.setIsTestConnectionSuccessful,
      clearError = _useContainerConnecti.clearError,
      handleProviderChange = _useContainerConnecti.handleProviderChange,
      handleSave = _useContainerConnecti.handleSave,
      handleTestConnection = _useContainerConnecti.handleTestConnection,
      handleTestingCancel = _useContainerConnecti.handleTestingCancel;
    var connectionSettingsContent = /*#__PURE__*/_react.default.createElement(_ContainerProviders.default, {
      allowHPA: allowHPA,
      cachedConnectionFormData: formData,
      clearError: clearError,
      error: errors,
      selectedProviderFormFields: selectedProviderFormFields,
      setFormData: setFormData,
      stackedLayout: true
    });
    if (isLoading) {
      connectionSettingsContent = /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SpinnerWrap, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.LoadingSpinnerRing, null), /*#__PURE__*/_react.default.createElement(_Typography.default, null, (0, _i18n.gettext)('Loading container settings...')));
    } else if (!selectedProvider) {
      connectionSettingsContent = /*#__PURE__*/_react.default.createElement(_Typography.default, null, (0, _i18n.gettext)('Select a provider to configure the connection.'));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !isBusy && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModal, {
      onRequestClose: onRequestClose,
      open: open
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: onRequestClose,
      title: title
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalBody, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(errors.connection_name),
      help: errors.connection_name,
      label: (0, _i18n.gettext)('Connection name'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      disabled: editMode,
      id: "container-connection-name",
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        setConnectionName(value);
        clearError('connection_name');
        setIsTestConnectionSuccessful(false);
      },
      value: connectionName
    }))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      label: (0, _i18n.gettext)('Connection description'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_TextArea.default, {
      id: "container-connection-description",
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return setConnectionDescription(value);
      },
      value: connectionDescription
    }))), !lockedProviderSelection && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(errors.container_type),
      help: errors.container_type,
      label: (0, _i18n.gettext)('Provider'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_Select.default, {
      disabled: editMode,
      id: "container-provider-select",
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        return handleProviderChange({
          target: {
            value: value
          }
        });
      },
      value: selectedProvider
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('-- Select --'),
      value: ""
    }), Object.keys(_container_connections.default || {}).map(function (provider) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: provider,
        label: provider,
        value: provider
      });
    }))))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionTitle, null, (0, _i18n.gettext)('Connection settings')), connectionSettingsContent), selectedProvider && !isLoading && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_WarningAndConsent.default, {
      connectionTypeLabel: "container",
      stackedLayout: true
    }))))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalFooter, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterRow, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.TestConnectionAction, {
      disabled: !selectedProvider || isLoading || isSaving,
      onClick: handleTestConnection,
      type: "button"
    }, (0, _i18n.gettext)('Test connection')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterActions, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: onRequestClose
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: !selectedProvider || isLoading || isSaving || !editMode && !isTestConnectionSuccessful,
      label: (0, _i18n.gettext)('Save'),
      onClick: handleSave
    }))))), isBusy && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModal, {
      onRequestClose: isTesting ? handleTestingCancel : undefined,
      open: isBusy
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: isTesting ? handleTestingCancel : undefined,
      title: title
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.BusySpinnerWrap, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.LoadingSpinnerRing, null), /*#__PURE__*/_react.default.createElement(_Typography.default, null, (0, _i18n.gettext)('Establishing connection...')))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalFooter, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterRow, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.TestConnectionAction, {
      disabled: true,
      type: "button"
    }, (0, _i18n.gettext)('Test connection')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterActions, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: isTesting ? handleTestingCancel : undefined
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: true,
      label: (0, _i18n.gettext)('Save')
    }))))));
  };
  ContainerConnectionModal.propTypes = {
    editMode: _propTypes.default.bool,
    initialConnectionName: _propTypes.default.string,
    initialProvider: _propTypes.default.string,
    onRequestClose: _propTypes.default.func,
    onSaved: _propTypes.default.func,
    open: _propTypes.default.bool
  };
  ContainerConnectionModal.defaultProps = {
    editMode: false,
    initialConnectionName: '',
    initialProvider: '',
    onRequestClose: function onRequestClose() {},
    onSaved: function onSaved() {},
    open: false
  };
  var _default = _exports.default = ContainerConnectionModal;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/ContainerConnectionModal/hooks/useContainerConnectionState.js":
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
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/connection/container_connections.json"), __webpack_require__("./src/main/webapp/components/connection/validation.js"), __webpack_require__("./src/main/webapp/components/connection/shared/WarningAndConsent/WarningAndConsent.jsx"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/connection/utils/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esFunctionName, _esObjectEntries, _esObjectKeys, _esObjectToString, _esSet, _esStringIncludes, _esStringIterator, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _react, _i18n, _format, _ToastConstants, _ConnectionManagementApi, _container_connections, _validation, _WarningAndConsent, _ToastUtil, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _container_connections = _interopRequireDefault(_container_connections);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
  var HPA_CAPABILITY = 'enable_hpa';
  var normalizeSelectValue = function normalizeSelectValue(field, value) {
    if (!field.options || field.options.length === 0) return value;
    var mapping = {
      yes: ['1', 'yes', true],
      no: ['0', 'no', false],
      true: ['1', 'true', true],
      false: ['0', 'false', false]
    };
    var matchedOption = field.options.find(function (option) {
      if (mapping[option.value] && mapping[option.value].includes(value)) {
        return true;
      }
      return option.value === value;
    });
    return matchedOption ? matchedOption.value : '';
  };
  var buildInitialFormData = function buildInitialFormData(providerConfig) {
    var containerDetails = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var initialData = {};
    Object.entries(providerConfig || {}).forEach(function (_ref) {
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
        extraFields.forEach(function (field) {
          var _ref4, _containerDetails$fie2;
          initialData[field.name] = (_ref4 = (_containerDetails$fie2 = containerDetails[field.name]) !== null && _containerDetails$fie2 !== void 0 ? _containerDetails$fie2 : field.default) !== null && _ref4 !== void 0 ? _ref4 : '';
        });
      }
      if (fieldName === 'service_type') {
        var _fieldMeta$options2, _fieldMeta$options2$;
        var selectedService = containerDetails.service_type || fieldMeta.default || ((_fieldMeta$options2 = fieldMeta.options) === null || _fieldMeta$options2 === void 0 ? void 0 : (_fieldMeta$options2$ = _fieldMeta$options2[0]) === null || _fieldMeta$options2$ === void 0 ? void 0 : _fieldMeta$options2$.value);
        initialData.service_type = selectedService;
        var commonFields = fieldMeta.common || [];
        commonFields.forEach(function (field) {
          var _ref5, _containerDetails$fie3;
          var rawValue = (_ref5 = (_containerDetails$fie3 = containerDetails[field.name]) !== null && _containerDetails$fie3 !== void 0 ? _containerDetails$fie3 : field.default) !== null && _ref5 !== void 0 ? _ref5 : '';
          initialData[field.name] = field.type === 'select' ? normalizeSelectValue(field, rawValue) : rawValue;
        });
        var _extraFields = fieldMeta[selectedService] || [];
        _extraFields.forEach(function (field) {
          var _ref6, _containerDetails$fie4;
          var rawValue = (_ref6 = (_containerDetails$fie4 = containerDetails[field.name]) !== null && _containerDetails$fie4 !== void 0 ? _containerDetails$fie4 : field.default) !== null && _ref6 !== void 0 ? _ref6 : '';
          initialData[field.name] = field.type === 'select' ? normalizeSelectValue(field, rawValue) : rawValue;
        });
      }
      if (fieldName === 'hpa_enabled') {
        var rawValue = containerDetails.hpa_enabled;
        var isEnabled = rawValue === true || rawValue === '1' || rawValue === 1;
        initialData.hpa_enabled = isEnabled;
        if (isEnabled) {
          var hpaFields = fieldMeta.fields || [];
          hpaFields.forEach(function (field) {
            var _ref7, _containerDetails$fie5;
            initialData[field.name] = (_ref7 = (_containerDetails$fie5 = containerDetails[field.name]) !== null && _containerDetails$fie5 !== void 0 ? _containerDetails$fie5 : field.default) !== null && _ref7 !== void 0 ? _ref7 : '';
          });
        }
      }
    });
    return initialData;
  };
  var generateApiToken = function generateApiToken() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for (var i = 0; i < 64; i += 1) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };
  var formatProviderLabel = function formatProviderLabel(provider) {
    if (!provider) return '';
    var normalized = String(provider).toLowerCase();
    var providerLabels = {
      kubernetes: 'Kubernetes',
      docker: 'Docker'
    };
    return providerLabels[normalized] || provider;
  };
  var useContainerConnectionState = function useContainerConnectionState(_ref8) {
    var editMode = _ref8.editMode,
      initialConnectionName = _ref8.initialConnectionName,
      initialProvider = _ref8.initialProvider,
      onRequestClose = _ref8.onRequestClose,
      onSaved = _ref8.onSaved,
      open = _ref8.open;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      allowHPA = _useState2[0],
      setAllowHPA = _useState2[1];
    var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      connectionName = _useState4[0],
      setConnectionName = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      connectionDescription = _useState6[0],
      setConnectionDescription = _useState6[1];
    var _useState7 = (0, _react.useState)({}),
      _useState8 = _slicedToArray(_useState7, 2),
      errors = _useState8[0],
      setErrors = _useState8[1];
    var _useState9 = (0, _react.useState)({}),
      _useState10 = _slicedToArray(_useState9, 2),
      formData = _useState10[0],
      setFormData = _useState10[1];
    var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      isLoading = _useState12[0],
      setIsLoading = _useState12[1];
    var _useState13 = (0, _react.useState)(false),
      _useState14 = _slicedToArray(_useState13, 2),
      isSaving = _useState14[0],
      setIsSaving = _useState14[1];
    var _useState15 = (0, _react.useState)(false),
      _useState16 = _slicedToArray(_useState15, 2),
      isTesting = _useState16[0],
      setIsTesting = _useState16[1];
    var _useState17 = (0, _react.useState)(false),
      _useState18 = _slicedToArray(_useState17, 2),
      isTestConnectionSuccessful = _useState18[0],
      setIsTestConnectionSuccessful = _useState18[1];
    var _useState19 = (0, _react.useState)(''),
      _useState20 = _slicedToArray(_useState19, 2),
      selectedProvider = _useState20[0],
      setSelectedProvider = _useState20[1];
    var _useState21 = (0, _react.useState)({}),
      _useState22 = _slicedToArray(_useState21, 2),
      selectedProviderFormFields = _useState22[0],
      setSelectedProviderFormFields = _useState22[1];
    var activeTestRequestRef = (0, _react.useRef)(0);
    var lockedProviderSelection = editMode || Boolean(initialProvider);
    var isBusy = isTesting || isSaving;
    var title = (0, _react.useMemo)(function () {
      var providerLabel = formatProviderLabel(selectedProvider || initialProvider);
      if (providerLabel) {
        return editMode ? (0, _format.sprintf)((0, _i18n.gettext)('Edit %(provider)s container connection'), {
          provider: providerLabel
        }) : (0, _format.sprintf)((0, _i18n.gettext)('Create %(provider)s container connection'), {
          provider: providerLabel
        });
      }
      return editMode ? (0, _i18n.gettext)('Edit container connection') : (0, _i18n.gettext)('Create container connection');
    }, [editMode, initialProvider, selectedProvider]);
    var clearError = (0, _react.useCallback)(function (fieldName) {
      setErrors(function (prev) {
        if (!prev[fieldName]) {
          return prev;
        }
        var nextErrors = _objectSpread({}, prev);
        delete nextErrors[fieldName];
        return nextErrors;
      });
    }, []);
    var buildConnectionDetails = (0, _react.useCallback)(function () {
      var details = _objectSpread(_objectSpread({}, formData), {}, {
        connection_name: connectionName,
        description: connectionDescription,
        container_type: selectedProvider,
        api_token: formData.api_token || generateApiToken(),
        ssl_passthrough: formData.ssl_passthrough || 'False'
      });
      if (selectedProvider === 'kubernetes') {
        details.is_kubernetes = true;
      }
      if (selectedProvider === 'docker') {
        details.is_docker = true;
      }
      if (editMode) {
        details.is_edit = true;
      }
      return details;
    }, [connectionDescription, connectionName, editMode, formData, selectedProvider]);
    var validateContainerDetails = (0, _react.useCallback)(function (details) {
      var isKubernetes = details.container_type === 'kubernetes';
      var requiredServiceFields = [];
      var requiredAuthFields = [];
      if (isKubernetes) {
        var _containerConfigMetaD, _containerConfigMetaD2, _containerConfigMetaD3, _containerConfigMetaD4;
        var serviceConfig = ((_containerConfigMetaD = _container_connections.default.kubernetes) === null || _containerConfigMetaD === void 0 ? void 0 : _containerConfigMetaD.service_type) || _container_connections.default.service_type || {};
        var commonRequired = (serviceConfig.common || []).filter(function (field) {
          return field.required;
        }).map(function (field) {
          return field.name;
        });
        var serviceRequired = (serviceConfig[details.service_type] || []).filter(function (field) {
          return field.required;
        }).map(function (field) {
          return field.name;
        });
        requiredServiceFields = [].concat(_toConsumableArray(commonRequired), _toConsumableArray(serviceRequired));
        var authFields = ((_containerConfigMetaD2 = _container_connections.default.kubernetes) === null || _containerConfigMetaD2 === void 0 ? void 0 : (_containerConfigMetaD3 = _containerConfigMetaD2.auth_mode) === null || _containerConfigMetaD3 === void 0 ? void 0 : (_containerConfigMetaD4 = _containerConfigMetaD3.fields) === null || _containerConfigMetaD4 === void 0 ? void 0 : _containerConfigMetaD4[details.auth_mode]) || [];
        requiredAuthFields = authFields.filter(function (field) {
          return field.required;
        }).map(function (field) {
          return field.name;
        });
      }
      var fieldsToValidate = new Set([].concat(_toConsumableArray(Object.keys(details)), _toConsumableArray(requiredServiceFields), _toConsumableArray(requiredAuthFields)));
      return Array.from(fieldsToValidate).reduce(function (accumulator, key) {
        var fieldError = (0, _validation.validateField)(key, details[key], {
          container_type: details.container_type,
          auth_mode: details.auth_mode,
          service_type: details.service_type
        });
        if (fieldError) {
          accumulator[key] = fieldError;
        }
        return accumulator;
      }, {});
    }, []);

    // Initialize modal state
    (0, _react.useEffect)(function () {
      if (!open) {
        activeTestRequestRef.current += 1;
        setAllowHPA(false);
        setConnectionName('');
        setConnectionDescription('');
        setErrors({});
        setFormData({});
        setIsLoading(false);
        setIsSaving(false);
        setIsTesting(false);
        setIsTestConnectionSuccessful(false);
        setSelectedProvider('');
        setSelectedProviderFormFields({});
        return undefined;
      }
      var mounted = true;
      var initializeModal = /*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var _capabilitiesResponse, _capabilitiesResponse2, _capabilitiesResponse3, normalizedProvider, capabilitiesResponse, capabilities, providerConfig, response, containerDetails, nextProvider, nextProviderConfig;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                setIsLoading(true);
                _context.prev = 1;
                normalizedProvider = (initialProvider || '').toLowerCase();
                _context.next = 5;
                return (0, _utils.handleApiCall)(_ConnectionManagementApi.fetchCapabilities, [], {
                  errorMessage: 'Failed to fetch user capabilities',
                  showErrorToast: false
                });
              case 5:
                capabilitiesResponse = _context.sent;
                if (mounted) {
                  _context.next = 8;
                  break;
                }
                return _context.abrupt("return");
              case 8:
                capabilities = (capabilitiesResponse === null || capabilitiesResponse === void 0 ? void 0 : (_capabilitiesResponse = capabilitiesResponse.entry) === null || _capabilitiesResponse === void 0 ? void 0 : (_capabilitiesResponse2 = _capabilitiesResponse[0]) === null || _capabilitiesResponse2 === void 0 ? void 0 : (_capabilitiesResponse3 = _capabilitiesResponse2.content) === null || _capabilitiesResponse3 === void 0 ? void 0 : _capabilitiesResponse3.capabilities) || [];
                setAllowHPA(capabilities.includes(HPA_CAPABILITY));
                providerConfig = _container_connections.default === null || _container_connections.default === void 0 ? void 0 : _container_connections.default[normalizedProvider];
                if (normalizedProvider && providerConfig) {
                  setSelectedProvider(normalizedProvider);
                  setSelectedProviderFormFields(providerConfig);
                }
                if (!(editMode && normalizedProvider && initialConnectionName)) {
                  _context.next = 29;
                  break;
                }
                _context.next = 15;
                return (0, _utils.handleApiCall)(_ConnectionManagementApi.getDSDLConfigData, ["/".concat(normalizedProvider, "/").concat(initialConnectionName), null], {
                  errorMessage: 'Failed to fetch container connection details'
                });
              case 15:
                response = _context.sent;
                if (!(!mounted || !response || response.status === 'fail')) {
                  _context.next = 18;
                  break;
                }
                return _context.abrupt("return");
              case 18:
                containerDetails = response.config || {};
                nextProvider = normalizedProvider || containerDetails.container_type || '';
                nextProviderConfig = (_container_connections.default === null || _container_connections.default === void 0 ? void 0 : _container_connections.default[nextProvider]) || {};
                setSelectedProvider(nextProvider);
                setSelectedProviderFormFields(nextProviderConfig);
                setConnectionName(containerDetails.connection_name || initialConnectionName || '');
                setConnectionDescription(containerDetails.description || '');
                setFormData(buildInitialFormData(nextProviderConfig, containerDetails));
                setIsTestConnectionSuccessful(true);
                _context.next = 32;
                break;
              case 29:
                setConnectionName('');
                setConnectionDescription('');
                setFormData(providerConfig ? buildInitialFormData(providerConfig, {}) : {});
              case 32:
                _context.prev = 32;
                if (mounted) {
                  setIsLoading(false);
                }
                return _context.finish(32);
              case 35:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1,, 32, 35]]);
        }));
        return function initializeModal() {
          return _ref9.apply(this, arguments);
        };
      }();
      initializeModal();
      return function () {
        mounted = false;
      };
    }, [editMode, initialConnectionName, initialProvider, open]);
    var handleProviderChange = (0, _react.useCallback)(function (event) {
      var nextProvider = event.target.value;
      var providerConfig = (_container_connections.default === null || _container_connections.default === void 0 ? void 0 : _container_connections.default[nextProvider]) || {};
      setSelectedProvider(nextProvider);
      setSelectedProviderFormFields(providerConfig);
      setFormData(nextProvider ? buildInitialFormData(providerConfig, {}) : {});
      clearError('container_type');
      setIsTestConnectionSuccessful(false);
    }, [clearError]);
    var handleTestConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var details, fieldErrors, requestId, _response$status, response;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            details = buildConnectionDetails();
            fieldErrors = validateContainerDetails(details);
            setErrors(fieldErrors);
            if (!(Object.keys(fieldErrors).length > 0)) {
              _context2.next = 6;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please fix the validation errors before testing the connection.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context2.abrupt("return");
          case 6:
            setIsTesting(true);
            requestId = activeTestRequestRef.current + 1;
            activeTestRequestRef.current = requestId;
            _context2.prev = 9;
            _context2.next = 12;
            return (0, _utils.handleApiCall)(_ConnectionManagementApi.testDSDLConfigData, ['', details], {
              errorMessage: 'Failed to test container connection',
              showSuccessToast: true,
              successMessage: 'Test connection successful'
            });
          case 12:
            response = _context2.sent;
            if (!(activeTestRequestRef.current !== requestId)) {
              _context2.next = 15;
              break;
            }
            return _context2.abrupt("return");
          case 15:
            if ((response === null || response === void 0 ? void 0 : (_response$status = response.status) === null || _response$status === void 0 ? void 0 : _response$status.toLowerCase()) === 'success') {
              setIsTestConnectionSuccessful(true);
            } else {
              setIsTestConnectionSuccessful(false);
            }
          case 16:
            _context2.prev = 16;
            if (activeTestRequestRef.current === requestId) {
              setIsTesting(false);
            }
            return _context2.finish(16);
          case 19:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[9,, 16, 19]]);
    })), [buildConnectionDetails, validateContainerDetails]);
    var handleTestingCancel = (0, _react.useCallback)(function () {
      activeTestRequestRef.current += 1;
      setIsTesting(false);
      onRequestClose();
    }, [onRequestClose]);
    var handleSave = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var details, fieldErrors, _validateData$status, _response$status2, validateData, errorMessage, fullConfig, cleanedConfig, _containerConfigMetaD5, _containerConfigMetaD6, _containerConfigMetaD7, _containerConfigMetaD8, saveFunction, successMessage, response;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!editMode && !isTestConnectionSuccessful)) {
              _context3.next = 3;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Unable to save. Please test the connection successfully before saving.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Connection Required'));
            return _context3.abrupt("return");
          case 3:
            if ((0, _WarningAndConsent.validateConsentCheckbox)()) {
              _context3.next = 6;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please provide consent before saving this connection.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context3.abrupt("return");
          case 6:
            details = buildConnectionDetails();
            fieldErrors = validateContainerDetails(details);
            setErrors(fieldErrors);
            if (!(Object.keys(fieldErrors).length > 0)) {
              _context3.next = 12;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please fix the validation errors before saving the connection.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context3.abrupt("return");
          case 12:
            setIsSaving(true);
            _context3.prev = 13;
            _context3.next = 16;
            return (0, _utils.handleApiCall)(_ConnectionManagementApi.testDSDLConfigData, ['', details], {
              errorMessage: 'Failed to validate container configuration',
              showErrorToast: true
            });
          case 16:
            validateData = _context3.sent;
            if (!(!validateData || ((_validateData$status = validateData.status) === null || _validateData$status === void 0 ? void 0 : _validateData$status.toLowerCase()) !== 'success')) {
              _context3.next = 21;
              break;
            }
            errorMessage = (validateData === null || validateData === void 0 ? void 0 : validateData.message) || (0, _i18n.gettext)('Container configuration validation failed.');
            (0, _ToastUtil.triggerToast)(errorMessage, _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            return _context3.abrupt("return");
          case 21:
            fullConfig = _objectSpread(_objectSpread({}, validateData.updated_config || {}), {}, {
              connection_name: details.connection_name,
              description: details.description,
              container_type: details.container_type
            });
            cleanedConfig = Object.entries(fullConfig).reduce(function (accumulator, _ref12) {
              var _ref13 = _slicedToArray(_ref12, 2),
                key = _ref13[0],
                value = _ref13[1];
              if (value !== '' && value !== null && value !== undefined) {
                accumulator[key] = value;
              }
              return accumulator;
            }, {});
            if (details.container_type === 'kubernetes') {
              cleanedConfig.is_kubernetes = true;
            }
            if (details.container_type === 'docker') {
              cleanedConfig.is_docker = true;
            }
            if (details.container_type === 'kubernetes') {
              if (details.hpa_enabled) {
                (((_containerConfigMetaD5 = _container_connections.default.kubernetes) === null || _containerConfigMetaD5 === void 0 ? void 0 : (_containerConfigMetaD6 = _containerConfigMetaD5.hpa_enabled) === null || _containerConfigMetaD6 === void 0 ? void 0 : _containerConfigMetaD6.fields) || []).forEach(function (field) {
                  cleanedConfig[field.name] = formData[field.name];
                });
              } else {
                (((_containerConfigMetaD7 = _container_connections.default.kubernetes) === null || _containerConfigMetaD7 === void 0 ? void 0 : (_containerConfigMetaD8 = _containerConfigMetaD7.hpa_enabled) === null || _containerConfigMetaD8 === void 0 ? void 0 : _containerConfigMetaD8.fields) || []).forEach(function (field) {
                  if (!['min_cpu', 'max_cpu', 'min_memory', 'max_memory'].includes(field.name)) {
                    cleanedConfig[field.name] = '';
                  }
                });
              }
            }
            saveFunction = editMode ? _ConnectionManagementApi.updateDSDLConnection : _ConnectionManagementApi.saveDSDLConnection;
            successMessage = editMode ? 'Container connection updated successfully!' : 'Container connection saved successfully!';
            _context3.next = 30;
            return (0, _utils.handleApiCall)(saveFunction, ['', cleanedConfig], {
              errorMessage: 'Failed to save container configuration',
              successMessage: successMessage,
              showSuccessToast: true
            });
          case 30:
            response = _context3.sent;
            if ((response === null || response === void 0 ? void 0 : (_response$status2 = response.status) === null || _response$status2 === void 0 ? void 0 : _response$status2.toLowerCase()) === 'success') {
              onSaved();
              onRequestClose();
            }
          case 32:
            _context3.prev = 32;
            setIsSaving(false);
            return _context3.finish(32);
          case 35:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[13,, 32, 35]]);
    })), [buildConnectionDetails, editMode, formData, isTestConnectionSuccessful, onRequestClose, onSaved, validateContainerDetails]);
    return {
      // State
      allowHPA: allowHPA,
      connectionDescription: connectionDescription,
      connectionName: connectionName,
      errors: errors,
      formData: formData,
      isBusy: isBusy,
      isLoading: isLoading,
      isSaving: isSaving,
      isTesting: isTesting,
      isTestConnectionSuccessful: isTestConnectionSuccessful,
      lockedProviderSelection: lockedProviderSelection,
      selectedProvider: selectedProvider,
      selectedProviderFormFields: selectedProviderFormFields,
      title: title,
      // Setters
      setConnectionDescription: setConnectionDescription,
      setConnectionName: setConnectionName,
      setFormData: setFormData,
      setIsTestConnectionSuccessful: setIsTestConnectionSuccessful,
      // Handlers
      clearError: clearError,
      handleProviderChange: handleProviderChange,
      handleSave: handleSave,
      handleTestConnection: handleTestConnection,
      handleTestingCancel: handleTestingCancel
    };
  };
  var _default = _exports.default = useContainerConnectionState;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Header/Header.jsx":
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
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/SlidingPanels.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./node_modules/@splunk/react-icons/ChevronLeft.js"), __webpack_require__("./src/main/webapp/components/connection/shared/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/connections/Header/Header.styles.js"), __webpack_require__("./src/main/webapp/components/connections/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFilter, _esArrayIncludes, _esArrayMap, _esObjectKeys, _esObjectToString, _esStringIncludes, _esStringTrim, _react, _propTypes, _i18n, _Button, _Dropdown, _Menu, _Select, _SlidingPanels, _Typography, _ChevronLeft, _Header, _ConnectionManagementApi, _Header2, _constants) {
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
  _Select = _interopRequireDefault(_Select);
  _SlidingPanels = _interopRequireDefault(_SlidingPanels);
  _Typography = _interopRequireDefault(_Typography);
  _ChevronLeft = _interopRequireDefault(_ChevronLeft);
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
  var isSplunkHostedProvider = function isSplunkHostedProvider(provider) {
    return provider.toLowerCase().includes('splunk') && provider.toLowerCase().includes('hosted');
  };
  var Header = function Header(_ref) {
    var _ref$searchTerm = _ref.searchTerm,
      searchTerm = _ref$searchTerm === void 0 ? '' : _ref$searchTerm,
      _ref$onSearchChange = _ref.onSearchChange,
      onSearchChange = _ref$onSearchChange === void 0 ? function () {} : _ref$onSearchChange,
      _ref$onAddType = _ref.onAddType,
      onAddType = _ref$onAddType === void 0 ? function () {} : _ref$onAddType,
      _ref$ownerFilter = _ref.ownerFilter,
      ownerFilter = _ref$ownerFilter === void 0 ? '' : _ref$ownerFilter,
      _ref$onOwnerFilterCha = _ref.onOwnerFilterChange,
      onOwnerFilterChange = _ref$onOwnerFilterCha === void 0 ? function () {} : _ref$onOwnerFilterCha,
      _ref$ownerOptions = _ref.ownerOptions,
      ownerOptions = _ref$ownerOptions === void 0 ? [] : _ref$ownerOptions,
      _ref$paginationConten = _ref.paginationContent,
      paginationContent = _ref$paginationConten === void 0 ? null : _ref$paginationConten;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      menuOpen = _useState2[0],
      setMenuOpen = _useState2[1];
    var _useState3 = (0, _react.useState)('types'),
      _useState4 = _slicedToArray(_useState3, 2),
      activePanelId = _useState4[0],
      setActivePanelId = _useState4[1];
    var _useState5 = (0, _react.useState)('forward'),
      _useState6 = _slicedToArray(_useState5, 2),
      transition = _useState6[0],
      setTransition = _useState6[1];
    var _useState7 = (0, _react.useState)([]),
      _useState8 = _slicedToArray(_useState7, 2),
      llmProviders = _useState8[0],
      setLlmProviders = _useState8[1];
    var _useState9 = (0, _react.useState)(''),
      _useState10 = _slicedToArray(_useState9, 2),
      llmFilter = _useState10[0],
      setLlmFilter = _useState10[1];
    var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      llmProvidersLoading = _useState12[0],
      setLlmProvidersLoading = _useState12[1];
    var handleOpenMenu = function handleOpenMenu() {
      setMenuOpen(true);
      setActivePanelId('types');
      setTransition('forward');
      setLlmFilter('');
    };
    var handleCloseMenu = function handleCloseMenu() {
      setMenuOpen(false);
      setActivePanelId('types');
      setTransition('forward');
      setLlmFilter('');
    };
    var handleRequestClose = function handleRequestClose(_ref2) {
      var reason = _ref2.reason;
      if (reason === 'clickAway' || reason === 'escapeKey') {
        handleCloseMenu();
      }
    };
    var loadLlmProviders = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var response, providers;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setLlmProvidersLoading(true);
              _context.prev = 1;
              _context.next = 4;
              return (0, _ConnectionManagementApi.getLLMConfigMetaData)();
            case 4:
              response = _context.sent;
              providers = Object.keys((response === null || response === void 0 ? void 0 : response.metadata) || {});
              setLlmProviders(providers);
            case 7:
              _context.prev = 7;
              setLlmProvidersLoading(false);
              return _context.finish(7);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1,, 7, 10]]);
      }));
      return function loadLlmProviders() {
        return _ref3.apply(this, arguments);
      };
    }();
    var openPanel = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(panelId) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(panelId === 'llm')) {
                _context2.next = 3;
                break;
              }
              _context2.next = 3;
              return loadLlmProviders();
            case 3:
              setTransition('forward');
              setActivePanelId(panelId);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function openPanel(_x) {
        return _ref4.apply(this, arguments);
      };
    }();
    var goBack = function goBack() {
      setTransition('backward');
      setActivePanelId('types');
    };
    var handleSelectType = function handleSelectType(type) {
      var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      handleCloseMenu();
      onAddType(type, provider);
    };
    var filteredLlmProviders = (0, _react.useMemo)(function () {
      var query = llmFilter.trim().toLowerCase();
      if (!query) {
        return llmProviders;
      }
      return llmProviders.filter(function (provider) {
        return provider.toLowerCase().includes(query);
      });
    }, [llmFilter, llmProviders]);
    var hostedProviders = filteredLlmProviders.filter(isSplunkHostedProvider);
    var thirdPartyProviders = filteredLlmProviders.filter(function (provider) {
      return !isSplunkHostedProvider(provider);
    });
    var hasVisibleLlmProviders = hostedProviders.length > 0 || thirdPartyProviders.length > 0;
    return /*#__PURE__*/_react.default.createElement(_Header2.HeaderContainerNoBorder, null, /*#__PURE__*/_react.default.createElement(_Header2.HeaderTopRow, null, /*#__PURE__*/_react.default.createElement(_Header.ShowcaseHeaderWrapper, null, /*#__PURE__*/_react.default.createElement(_Header.TitleStyle, null, _constants.TITLE), /*#__PURE__*/_react.default.createElement(_Header2.SubTitleStyle, null, _constants.SUBTITLE)), /*#__PURE__*/_react.default.createElement(_Header2.MenuButtonWrap, null, /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      onRequestClose: handleRequestClose,
      onRequestOpen: handleOpenMenu,
      open: menuOpen,
      toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
        appearance: "primary",
        icon: /*#__PURE__*/_react.default.createElement(_Header2.AddButtonIcon, null),
        isMenu: true,
        label: _constants.ADD_CONNECTION_TITLE
      })
    }, /*#__PURE__*/_react.default.createElement(_Header2.DropdownPanel, null, /*#__PURE__*/_react.default.createElement(_Header2.StyledSlidingPanels, {
      activePanelId: activePanelId,
      transition: transition
    }, /*#__PURE__*/_react.default.createElement(_SlidingPanels.default.Panel, {
      panelId: "types"
    }, /*#__PURE__*/_react.default.createElement(_Header2.StyledMenu, null, /*#__PURE__*/_react.default.createElement(_Header2.MenuSectionTitle, null, _constants.CONNECTION_TYPE_TITLE), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      hasSubmenu: true,
      onClick: function onClick() {
        return openPanel('llm');
      }
    }, (0, _i18n.gettext)('LLM')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      hasSubmenu: true,
      onClick: function onClick() {
        return openPanel('mcp');
      }
    }, (0, _i18n.gettext)('MCP')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      hasSubmenu: true,
      onClick: function onClick() {
        return openPanel('kb');
      }
    }, (0, _i18n.gettext)('Knowledge base')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      hasSubmenu: true,
      onClick: function onClick() {
        return openPanel('container');
      }
    }, (0, _i18n.gettext)('Container')))), /*#__PURE__*/_react.default.createElement(_SlidingPanels.default.Panel, {
      panelId: "llm"
    }, /*#__PURE__*/_react.default.createElement(_Header2.StyledMenu, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: goBack
    }, /*#__PURE__*/_react.default.createElement(_Header2.BackMenuLabel, null, /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      as: "span"
    }, _constants.BACK_LABEL))), /*#__PURE__*/_react.default.createElement(_Header2.MenuSearchRow, {
      onClick: function onClick(e) {
        return e.stopPropagation();
      },
      onKeyDown: function onKeyDown(e) {
        return e.stopPropagation();
      }
    }, /*#__PURE__*/_react.default.createElement(_Header2.MenuSearch, {
      appearance: "search",
      onChange: function onChange(e, _ref5) {
        var value = _ref5.value;
        return setLlmFilter(value || '');
      },
      placeholder: _constants.FILTER_LLM_PROVIDERS_PLACEHOLDER,
      value: llmFilter
    })), /*#__PURE__*/_react.default.createElement(_Header2.MenuDivider, null), llmProvidersLoading && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      disabled: true
    }, (0, _i18n.gettext)('Loading providers...')), hostedProviders.length > 0 && hostedProviders.map(function (provider) {
      return /*#__PURE__*/_react.default.createElement(_Header2.MenuLabelAlignedItem, {
        key: provider,
        onClick: function onClick() {
          return handleSelectType('LLM', provider);
        }
      }, _constants.SPLUNK_HOSTED_LLM);
    }), /*#__PURE__*/_react.default.createElement(_Header2.MenuLabelAlignedItem, {
      onClick: function onClick() {
        return handleSelectType('LLM');
      }
    }, _constants.CUSTOM_LLM_CONNECTION), thirdPartyProviders.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Header2.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_Header2.MenuGroupLabel, null, _constants.THIRD_PARTY_LLM_PROVIDERS), thirdPartyProviders.map(function (provider) {
      return /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        key: provider,
        onClick: function onClick() {
          return handleSelectType('LLM', provider);
        }
      }, provider);
    })), !llmProvidersLoading && !hasVisibleLlmProviders && llmFilter && /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      disabled: true
    }, (0, _i18n.gettext)('No providers found')))), /*#__PURE__*/_react.default.createElement(_SlidingPanels.default.Panel, {
      panelId: "mcp"
    }, /*#__PURE__*/_react.default.createElement(_Header2.StyledMenu, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: goBack
    }, /*#__PURE__*/_react.default.createElement(_Header2.BackMenuLabel, null, /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      as: "span"
    }, _constants.BACK_LABEL))), /*#__PURE__*/_react.default.createElement(_Header2.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_Header2.MenuGroupLabel, null, _constants.MCP_PROVIDERS), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return handleSelectType('MCP', 'splunk');
      }
    }, (0, _i18n.gettext)('Splunk')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return handleSelectType('MCP', 'atlassian');
      }
    }, (0, _i18n.gettext)('Atlassian')))), /*#__PURE__*/_react.default.createElement(_SlidingPanels.default.Panel, {
      panelId: "kb"
    }, /*#__PURE__*/_react.default.createElement(_Header2.StyledMenu, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: goBack
    }, /*#__PURE__*/_react.default.createElement(_Header2.BackMenuLabel, null, /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      as: "span"
    }, _constants.BACK_LABEL))), /*#__PURE__*/_react.default.createElement(_Header2.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_Header2.MenuGroupLabel, null, _constants.KNOWLEDGE_BASE_TYPE), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return handleSelectType('KB', 'aws');
      }
    }, (0, _i18n.gettext)('AWS KB')))), /*#__PURE__*/_react.default.createElement(_SlidingPanels.default.Panel, {
      panelId: "container"
    }, /*#__PURE__*/_react.default.createElement(_Header2.StyledMenu, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: goBack
    }, /*#__PURE__*/_react.default.createElement(_Header2.BackMenuLabel, null, /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      as: "span"
    }, _constants.BACK_LABEL))), /*#__PURE__*/_react.default.createElement(_Header2.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_Header2.MenuGroupLabel, null, _constants.CONTAINER_PROVIDER), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return handleSelectType('CONTAINER', 'kubernetes');
      }
    }, (0, _i18n.gettext)('Kubernetes')), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
      onClick: function onClick() {
        return handleSelectType('CONTAINER', 'docker');
      }
    }, (0, _i18n.gettext)('Docker'))))))))), /*#__PURE__*/_react.default.createElement(_Header2.FilterRow, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterControls, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterControl, null, /*#__PURE__*/_react.default.createElement(_Header2.FilterLabel, null, _constants.FILTER_LABEL), /*#__PURE__*/_react.default.createElement(_Header2.SearchFilterInput, {
      appearance: "search",
      "data-test": "Filter_Examples",
      inline: true,
      onChange: function onChange(e, _ref6) {
        var value = _ref6.value;
        return onSearchChange(value || '');
      },
      placeholder: _constants.FILTER_PLACEHOLDER,
      value: searchTerm
    })), /*#__PURE__*/_react.default.createElement(_Header2.FilterControl, {
      minWidth: "160px"
    }, /*#__PURE__*/_react.default.createElement(_Header2.FilterLabel, null, _constants.OWNER_FILTER_LABEL), /*#__PURE__*/_react.default.createElement(_Header2.OwnerFilterSelect, {
      "data-test": "Connections_Owner",
      onChange: function onChange(e, _ref7) {
        var value = _ref7.value;
        return onOwnerFilterChange(value || '');
      },
      value: ownerFilter
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('All'),
      value: ""
    }), ownerOptions.map(function (option) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: option.value,
        label: option.label,
        value: option.value
      });
    })))), paginationContent));
  };
  Header.propTypes = {
    onAddType: _propTypes.default.func,
    onOwnerFilterChange: _propTypes.default.func,
    onSearchChange: _propTypes.default.func,
    ownerFilter: _propTypes.default.string,
    ownerOptions: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })),
    paginationContent: _propTypes.default.node,
    searchTerm: _propTypes.default.string
  };
  Header.defaultProps = {
    onAddType: function onAddType() {},
    onOwnerFilterChange: function onOwnerFilterChange() {},
    onSearchChange: function onSearchChange() {},
    ownerFilter: '',
    ownerOptions: [],
    paginationContent: null,
    searchTerm: ''
  };
  var _default = _exports.default = Header;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/Header/Header.styles.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.object.freeze.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/Typography.js"), __webpack_require__("./node_modules/@splunk/react-ui/SlidingPanels.js"), __webpack_require__("./node_modules/@splunk/react-icons/Plus.js"), __webpack_require__("./src/main/webapp/util/splunkThemesCompat.es"), __webpack_require__("./src/main/webapp/components/connection/shared/Header/Header.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _styledComponents, _Menu, _Select, _Text, _Typography, _SlidingPanels, _Plus, _themes, _Header) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SubTitleStyle = _exports.StyledSlidingPanels = _exports.StyledMenu = _exports.StyledFilterInput = _exports.SearchFilterInput = _exports.PaginatorWrapper = _exports.OwnerFilterSelect = _exports.MenuSurface = _exports.MenuSectionTitle = _exports.MenuSearchRow = _exports.MenuSearch = _exports.MenuLabelAlignedItem = _exports.MenuGroupLabel = _exports.MenuDivider = _exports.MenuButtonWrap = _exports.HeaderTopRow = _exports.HeaderContainerNoBorder = _exports.FilterRow = _exports.FilterLabel = _exports.FilterControls = _exports.FilterControl = _exports.DropdownPanel = _exports.CountLabel = _exports.BackMenuLabel = _exports.AddButtonIcon = void 0;
  _styledComponents = _interopRequireDefault(_styledComponents);
  _Menu = _interopRequireDefault(_Menu);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
  _Typography = _interopRequireDefault(_Typography);
  _SlidingPanels = _interopRequireDefault(_SlidingPanels);
  _Plus = _interopRequireDefault(_Plus);
  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25;
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
  var SubTitleStyle = _exports.SubTitleStyle = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    && {\n        color: ", ";\n        margin-top: ", ";\n    }\n"])), _themes.variables.textColor, _themes.variables.spacingSmall);
  var HeaderContainerNoBorder = _exports.HeaderContainerNoBorder = (0, _styledComponents.default)(_Header.HeaderContainer)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    && {\n        border: none;\n        padding: ", ";\n        background: ", ";\n        color: ", ";\n        border-radius: ", " ", " 0 0;\n        flex-direction: column;\n        align-items: flex-start;\n        justify-content: flex-start;\n        border-bottom: none;\n        flex: none;\n        flex-basis: auto;\n        flex-grow: 0;\n        flex-shrink: 0;\n        height: auto;\n        min-height: auto;\n        overflow: visible;\n    }\n"])), _themes.variables.spacingXXLarge, _themes.variables.backgroundColorPage, _themes.variables.textColor, _themes.variables.borderRadius, _themes.variables.borderRadius);
  var HeaderTopRow = _exports.HeaderTopRow = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: flex-start;\n    justify-content: space-between;\n    gap: ", ";\n    width: 100%;\n    margin-bottom: ", ";\n    position: relative;\n"])), _themes.variables.spacingXLarge, _themes.variables.spacingSmall);
  var FilterRow = _exports.FilterRow = _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: flex-end;\n    justify-content: space-between;\n    gap: ", ";\n    flex-wrap: wrap;\n    margin-top: ", ";\n    width: 100%;\n"])), _themes.variables.spacingLarge, _themes.variables.spacingSmall);
  var FilterControls = _exports.FilterControls = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: flex-end;\n    gap: ", ";\n"])), _themes.variables.spacingLarge);
  var FilterControl = _exports.FilterControl = _styledComponents.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    min-width: ", ";\n    flex: 0 0 auto;\n"])), function (_ref) {
    var _ref$minWidth = _ref.minWidth,
      minWidth = _ref$minWidth === void 0 ? '220px' : _ref$minWidth;
    return minWidth;
  });
  var FilterLabel = _exports.FilterLabel = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    && {\n        display: block;\n        color: ", ";\n        font-weight: 500;\n        margin-bottom: ", ";\n    }\n"])), _themes.variables.textColor, _themes.variables.spacingXSmall);
  var StyledFilterInput = _exports.StyledFilterInput = (0, _styledComponents.default)(_Text.default)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    width: 220px;\n    max-width: 100%;\n    min-width: 220px;\n    color: ", ";\n\n    &&[data-inline] {\n        width: 220px;\n        flex-basis: auto;\n    }\n"])), _themes.variables.textColor);
  var SearchFilterInput = _exports.SearchFilterInput = (0, _styledComponents.default)(StyledFilterInput)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n    min-width: 220px;\n"])));
  var MenuButtonWrap = _exports.MenuButtonWrap = _styledComponents.default.div(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    position: relative;\n    flex: 0 0 auto;\n"])));
  var AddButtonIcon = _exports.AddButtonIcon = (0, _styledComponents.default)(_Plus.default)(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n    margin-right: ", ";\n"])), _themes.variables.spacingXSmall);
  var MenuSurface = _exports.MenuSurface = _styledComponents.default.div(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n    position: absolute;\n    top: calc(100% + ", ");\n    right: 0;\n    z-index: 50;\n"])), _themes.variables.spacingMedium);
  var DropdownPanel = _exports.DropdownPanel = _styledComponents.default.div(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n    width: 320px;\n    background: ", ";\n    border-radius: 0;\n    border: none;\n    box-shadow: ", ";\n    overflow: hidden;\n    position: relative;\n"])), _themes.variables.backgroundColorPopup, _themes.variables.overlayShadow);
  var StyledSlidingPanels = _exports.StyledSlidingPanels = (0, _styledComponents.default)(_SlidingPanels.default)(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n    width: 320px;\n"])));
  var StyledMenu = _exports.StyledMenu = (0, _styledComponents.default)(_Menu.default)(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\n    background: transparent;\n    color: ", ";\n    margin: 0;\n    padding-bottom: ", ";\n\n    /* Align all menu items with labels */\n    &&&& [data-test='menu-item'],\n    &&&& [role='menuitem'] {\n        padding-left: ", ";\n    }\n\n    & button,\n    & [role='menuitem'] {\n        color: ", ";\n    }\n\n    & button:hover,\n    & [role='menuitem']:hover {\n        background: ", ";\n    }\n"])), _themes.variables.textColor, _themes.variables.spacingSmall, _themes.variables.spacingSmall, _themes.variables.textColor, _themes.variables.backgroundColorHover);
  var MenuSectionTitle = _exports.MenuSectionTitle = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\n    && {\n        padding: ", " ", " ", ";\n        color: ", ";\n        font-weight: 600;\n        display: block;\n    }\n"])), _themes.variables.spacingSmall, _themes.variables.spacingSmall, _themes.variables.spacingSmall, _themes.variables.textGray);
  var MenuDivider = _exports.MenuDivider = _styledComponents.default.div(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["\n    height: 1px;\n    background: ", ";\n"])), _themes.variables.borderColor);
  var MenuSearchRow = _exports.MenuSearchRow = _styledComponents.default.div(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["\n    padding: ", " ", ";\n"])), _themes.variables.spacingSmall, _themes.variables.spacingSmall);
  var MenuSearch = _exports.MenuSearch = (0, _styledComponents.default)(_Text.default)(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["\n    width: 100%;\n    min-width: 150px;\n    color: ", ";\n\n    && input {\n        background: ", ";\n        border-color: ", ";\n    }\n"])), _themes.variables.textColor, _themes.variables.backgroundColorPopup, _themes.variables.borderColor);
  var OwnerFilterSelect = _exports.OwnerFilterSelect = (0, _styledComponents.default)(_Select.default)(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["\n    min-width: 160px;\n"])));
  var MenuGroupLabel = _exports.MenuGroupLabel = (0, _styledComponents.default)(_Typography.default).attrs({
    variant: 'body'
  })(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["\n    && {\n        padding: ", ";\n        padding-left: ", ";\n        display: block;\n        color: ", ";\n    }\n"])), _themes.variables.spacingSmall, _themes.variables.spacingSmall, _themes.variables.textGray);
  var MenuLabelAlignedItem = _exports.MenuLabelAlignedItem = (0, _styledComponents.default)(_Menu.default.Item)(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["\n    && {\n        padding-left: ", ";\n    }\n"])), _themes.variables.spacingSmall);
  var BackMenuLabel = _exports.BackMenuLabel = (0, _styledComponents.default)(_Typography.default)(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["\n    &&& {\n        display: inline-flex;\n        align-items: center;\n        gap: ", ";\n        color: ", ";\n    }\n\n    &&& span {\n        color: ", ";\n    }\n\n    &&& svg {\n        flex: 0 0 auto;\n        color: ", ";\n    }\n"])), _themes.variables.spacingSmall, _themes.variables.textColor, _themes.variables.textColor, _themes.variables.textColor);
  var PaginatorWrapper = _exports.PaginatorWrapper = _styledComponents.default.div(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    gap: ", ";\n\n    /* Pagination \"of X pages\" text color */\n    &&& [data-test='page-control'] span,\n    &&& [data-test='page-control'] > span,\n    &&& span[data-test='page-control-label'] {\n        color: ", ";\n    }\n"])), _themes.variables.spacingSmall, _themes.variables.textColor);
  var CountLabel = _exports.CountLabel = (0, _styledComponents.default)(_Typography.default).attrs({
    as: 'span',
    variant: 'body'
  })(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["\n    font-size: 13px;\n    color: ", ";\n"])), _themes.variables.textColor);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.weak-map.js");
__webpack_require__("./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Modal.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Checkbox.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/TextArea.js"), __webpack_require__("./node_modules/@splunk/react-ui/WaitSpinner.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/ui-utils/format.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/hooks/index.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/components/index.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/utils.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayMap, _esObjectEntries, _esObjectKeys, _react, _propTypes, _Modal, _Button, _Checkbox, _Select, _Text, _TextArea, _WaitSpinner, _i18n, _format, _hooks, _components, _utils, _LLMConnectionModal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Modal = _interopRequireDefault(_Modal);
  _Button = _interopRequireDefault(_Button);
  _Checkbox = _interopRequireDefault(_Checkbox);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
  _TextArea = _interopRequireDefault(_TextArea);
  _WaitSpinner = _interopRequireDefault(_WaitSpinner);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
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
  var LLMConnectionModal = function LLMConnectionModal(_ref) {
    var editMode = _ref.editMode,
      initialConnectionName = _ref.initialConnectionName,
      initialDescription = _ref.initialDescription,
      initialIsCustom = _ref.initialIsCustom,
      initialModel = _ref.initialModel,
      initialProvider = _ref.initialProvider,
      open = _ref.open,
      onRequestClose = _ref.onRequestClose,
      onSaved = _ref.onSaved;
    // Manage connection state first (provides setters needed by useLLMProviders)
    var _useLLMConnectionStat = (0, _hooks.useLLMConnectionState)({
        open: open,
        editMode: editMode,
        initialProvider: initialProvider,
        initialConnectionName: initialConnectionName,
        initialDescription: initialDescription,
        initialModel: initialModel,
        initialIsCustom: initialIsCustom
      }),
      selectedProvider = _useLLMConnectionStat.selectedProvider,
      setSelectedProvider = _useLLMConnectionStat.setSelectedProvider,
      selectedModel = _useLLMConnectionStat.selectedModel,
      setSelectedModel = _useLLMConnectionStat.setSelectedModel,
      isManualProviderModelEntry = _useLLMConnectionStat.isManualProviderModelEntry,
      setIsManualProviderModelEntry = _useLLMConnectionStat.setIsManualProviderModelEntry,
      connectionName = _useLLMConnectionStat.connectionName,
      setConnectionName = _useLLMConnectionStat.setConnectionName,
      connectionDescription = _useLLMConnectionStat.connectionDescription,
      setConnectionDescription = _useLLMConnectionStat.setConnectionDescription,
      formData = _useLLMConnectionStat.formData,
      setFormData = _useLLMConnectionStat.setFormData,
      errors = _useLLMConnectionStat.errors,
      setErrors = _useLLMConnectionStat.setErrors,
      isSaving = _useLLMConnectionStat.isSaving,
      setIsSaving = _useLLMConnectionStat.setIsSaving,
      isTesting = _useLLMConnectionStat.isTesting,
      setIsTesting = _useLLMConnectionStat.setIsTesting,
      isTestConnectionSuccessful = _useLLMConnectionStat.isTestConnectionSuccessful,
      setIsTestConnectionSuccessful = _useLLMConnectionStat.setIsTestConnectionSuccessful,
      consentChecked = _useLLMConnectionStat.consentChecked,
      setConsentChecked = _useLLMConnectionStat.setConsentChecked,
      customAuthMode = _useLLMConnectionStat.customAuthMode,
      setCustomAuthMode = _useLLMConnectionStat.setCustomAuthMode,
      isCustomConnection = _useLLMConnectionStat.isCustomConnection,
      isBusy = _useLLMConnectionStat.isBusy,
      effectiveProvider = _useLLMConnectionStat.effectiveProvider,
      availableModels = _useLLMConnectionStat.availableModels,
      isSplunkHostedProvider = _useLLMConnectionStat.isSplunkHostedProvider,
      customPayloadProvider = _useLLMConnectionStat.customPayloadProvider,
      customServiceFieldEntries = _useLLMConnectionStat.customServiceFieldEntries,
      customAuthFieldEntries = _useLLMConnectionStat.customAuthFieldEntries,
      visibleServiceFieldEntries = _useLLMConnectionStat.visibleServiceFieldEntries,
      visibleModelFieldEntries = _useLLMConnectionStat.visibleModelFieldEntries,
      allProviderConfigs = _useLLMConnectionStat.allProviderConfigs,
      setAllProviderConfigs = _useLLMConnectionStat.setAllProviderConfigs;

    // Load provider configurations (uses setters from state hook)
    var _useLLMProviders = (0, _hooks.useLLMProviders)({
        open: open,
        editMode: editMode,
        initialProvider: initialProvider,
        initialConnectionName: initialConnectionName,
        initialDescription: initialDescription,
        initialModel: initialModel,
        initialIsCustom: initialIsCustom,
        isCustomConnection: isCustomConnection,
        setSelectedProvider: setSelectedProvider,
        setSelectedModel: setSelectedModel,
        setConnectionName: setConnectionName,
        setConnectionDescription: setConnectionDescription,
        setIsManualProviderModelEntry: setIsManualProviderModelEntry,
        setIsTestConnectionSuccessful: setIsTestConnectionSuccessful,
        setFormData: setFormData,
        setCustomAuthMode: setCustomAuthMode,
        setAllProviderConfigs: setAllProviderConfigs
      }),
      loadingProviders = _useLLMProviders.loadingProviders,
      refreshProviderModels = _useLLMProviders.refreshProviderModels;

    // Connection handlers
    var _useLLMConnectionHand = (0, _hooks.useLLMConnectionHandlers)({
        editMode: editMode,
        isCustomConnection: isCustomConnection,
        effectiveProvider: effectiveProvider,
        customPayloadProvider: customPayloadProvider,
        isSplunkHostedProvider: isSplunkHostedProvider,
        selectedModel: selectedModel,
        isManualProviderModelEntry: isManualProviderModelEntry,
        connectionName: connectionName,
        connectionDescription: connectionDescription,
        formData: formData,
        customAuthMode: customAuthMode,
        consentChecked: consentChecked,
        isTestConnectionSuccessful: isTestConnectionSuccessful,
        visibleServiceFieldEntries: visibleServiceFieldEntries,
        setErrors: setErrors,
        setIsTesting: setIsTesting,
        setIsSaving: setIsSaving,
        setIsTestConnectionSuccessful: setIsTestConnectionSuccessful,
        onRequestClose: onRequestClose,
        onSaved: onSaved
      }),
      clearError = _useLLMConnectionHand.clearError,
      handleTestConnection = _useLLMConnectionHand.handleTestConnection,
      handleTestingCancel = _useLLMConnectionHand.handleTestingCancel,
      handleSave = _useLLMConnectionHand.handleSave;

    // Computed title
    var title = (0, _react.useMemo)(function () {
      if (isCustomConnection) {
        return editMode ? (0, _i18n.gettext)('Edit Custom provider connection') : (0, _i18n.gettext)('Create Custom provider connection');
      }
      if (editMode) {
        if (effectiveProvider) {
          return (0, _format.sprintf)((0, _i18n.gettext)('Edit %(provider)s LLM connection'), {
            provider: effectiveProvider
          });
        }
        return (0, _i18n.gettext)('Edit LLM connection');
      }
      if (effectiveProvider) {
        return (0, _format.sprintf)((0, _i18n.gettext)('Create %(provider)s LLM connection'), {
          provider: effectiveProvider
        });
      }
      return (0, _i18n.gettext)('Create LLM connection');
    }, [editMode, effectiveProvider, isCustomConnection]);
    var providerModelsLabel = (0, _react.useMemo)(function () {
      if (!effectiveProvider) {
        return (0, _i18n.gettext)('Provider models');
      }
      return "".concat(effectiveProvider, " ").concat((0, _i18n.gettext)('models'));
    }, [effectiveProvider]);

    // Field value handler
    var setFieldValue = function setFieldValue(fieldName, config, event, settingsType) {
      var nextValue = config.type === 'checkbox' ? event.target.checked : event.target.value;
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, settingsType, _objectSpread(_objectSpread({}, prev[settingsType]), {}, _defineProperty({}, fieldName, _objectSpread(_objectSpread({}, prev[settingsType][fieldName]), {}, {
          value: nextValue
        })))));
      });
      clearError(fieldName);
      setIsTestConnectionSuccessful(false);
    };

    // Render field helper using LLMFieldRenderer component
    var renderField = function renderField(fieldName, config, settingsType) {
      return /*#__PURE__*/_react.default.createElement(_components.LLMFieldRenderer, {
        key: "".concat(settingsType, "-").concat(fieldName),
        config: config,
        errors: errors,
        fieldName: fieldName,
        formData: formData,
        isCustomConnection: isCustomConnection,
        onChange: function onChange(event) {
          return setFieldValue(fieldName, config, event, settingsType);
        },
        settingsType: settingsType
      });
    };
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !isBusy && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModal, {
      onRequestClose: onRequestClose,
      open: open
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: onRequestClose,
      title: title
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalBody, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(errors.connection_name),
      help: errors.connection_name,
      label: (0, _i18n.gettext)('Connection name'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_Text.default, {
      disabled: editMode,
      id: "llm-connection-name",
      onChange: function onChange(e, _ref2) {
        var value = _ref2.value;
        setConnectionName(value);
        clearError('connection_name');
        setIsTestConnectionSuccessful(false);
      },
      value: connectionName
    }))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      label: (0, _i18n.gettext)('Connection description'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_TextArea.default, {
      id: "llm-connection-description",
      onChange: function onChange(e, _ref3) {
        var value = _ref3.value;
        return setConnectionDescription(value);
      },
      value: connectionDescription
    })))), !isSplunkHostedProvider && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionTitle, null, (0, _i18n.gettext)('Connection settings')), !initialProvider && !isCustomConnection && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(errors.service),
      help: errors.service,
      label: (0, _i18n.gettext)('Provider'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_Select.default, {
      id: "llm-provider-select",
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        setSelectedProvider(value);
        setSelectedModel('');
        setIsManualProviderModelEntry(false);
        setFormData({
          servicesettings: {},
          modelsettings: {}
        });
        clearError('service');
        setIsTestConnectionSuccessful(false);
      },
      value: selectedProvider
    }, /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
      label: (0, _i18n.gettext)('-- Select --'),
      value: ""
    }), Object.keys(allProviderConfigs || {}).map(function (provider) {
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: provider,
        label: provider,
        value: provider
      });
    })))), loadingProviders && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SpinnerWrap, null, /*#__PURE__*/_react.default.createElement(_WaitSpinner.default, {
      size: "medium"
    }), /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Loading provider settings...'))), !loadingProviders && !isCustomConnection && Object.entries(formData.servicesettings || {}).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        fieldName = _ref6[0],
        config = _ref6[1];
      return renderField(fieldName, config, 'servicesettings');
    }), !loadingProviders && isCustomConnection && customServiceFieldEntries.map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
        fieldName = _ref8[0],
        config = _ref8[1];
      return renderField(fieldName, config, 'servicesettings');
    }))), isCustomConnection && customAuthFieldEntries.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionTitle, null, (0, _i18n.gettext)('Authentication settings')), !editMode && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ToggleRow, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: customAuthMode === _utils.CUSTOM_AUTH_MODES.API_KEY ? 'primary' : 'secondary',
      label: (0, _i18n.gettext)('API key'),
      onClick: function onClick() {
        setCustomAuthMode(_utils.CUSTOM_AUTH_MODES.API_KEY);
        setIsTestConnectionSuccessful(false);
      }
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: customAuthMode === _utils.CUSTOM_AUTH_MODES.OIDC ? 'primary' : 'secondary',
      label: (0, _i18n.gettext)('OpenID Connect (OIDC)'),
      onClick: function onClick() {
        setCustomAuthMode(_utils.CUSTOM_AUTH_MODES.OIDC);
        setIsTestConnectionSuccessful(false);
      }
    })), customAuthFieldEntries.map(function (_ref9) {
      var _ref10 = _slicedToArray(_ref9, 2),
        fieldName = _ref10[0],
        config = _ref10[1];
      return renderField(fieldName, config, 'servicesettings');
    }))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionTitle, null, (0, _i18n.gettext)('Model settings')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      "data-required": "true",
      error: Boolean(errors.model),
      help: errors.model,
      label: (0, _i18n.gettext)('Model'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, /*#__PURE__*/_react.default.createElement(_components.ModelControl, {
      availableModels: availableModels,
      clearError: clearError,
      editMode: editMode,
      effectiveProvider: effectiveProvider,
      formData: formData,
      isCustomConnection: isCustomConnection,
      isManualProviderModelEntry: isManualProviderModelEntry,
      providerModelsLabel: providerModelsLabel,
      refreshProviderModels: refreshProviderModels,
      selectedModel: selectedModel,
      setAllProviderConfigs: setAllProviderConfigs,
      setIsManualProviderModelEntry: setIsManualProviderModelEntry,
      setIsTestConnectionSuccessful: setIsTestConnectionSuccessful,
      setSelectedModel: setSelectedModel
    }))), selectedModel && visibleModelFieldEntries.map(function (_ref11) {
      var _ref12 = _slicedToArray(_ref11, 2),
        fieldName = _ref12[0],
        config = _ref12[1];
      return renderField(fieldName, config, 'modelsettings');
    })), selectedModel && !isSplunkHostedProvider && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionDivider, null), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.SectionGroup, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      label: (0, _i18n.gettext)('Warning and Consent'),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConsentRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
      checked: consentChecked,
      id: "llm-warning-consent",
      onChange: function onChange(e, _ref13) {
        var checked = _ref13.checked;
        return setConsentChecked(checked);
      }
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConsentText, null, (0, _i18n.gettext)('By proceeding, you acknowledge that the configuration details you provide will be stored to enable authenticated requests to your selected external LLM service provider.'))))))))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalFooter, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterRow, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.TestConnectionAction, {
      disabled: loadingProviders || isSaving,
      onClick: handleTestConnection,
      type: "button"
    }, (0, _i18n.gettext)('Test connection')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterActions, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: onRequestClose
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: !editMode && !isTestConnectionSuccessful || isSaving,
      label: (0, _i18n.gettext)('Save'),
      onClick: handleSave
    }))))), isBusy && /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModal, {
      onRequestClose: isTesting ? handleTestingCancel : undefined,
      open: isBusy
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalHeader, {
      onRequestClose: isTesting ? handleTestingCancel : undefined,
      title: title
    }), /*#__PURE__*/_react.default.createElement(_Modal.default.Body, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.BusySpinnerWrap, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.LoadingSpinnerRing, null), /*#__PURE__*/_react.default.createElement("div", null, (0, _i18n.gettext)('Establishing connection...')))), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ConnectionModalFooter, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterRow, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.TestConnectionAction, {
      disabled: true,
      type: "button"
    }, (0, _i18n.gettext)('Test connection')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FooterActions, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "secondary",
      disabled: isSaving,
      label: (0, _i18n.gettext)('Cancel'),
      onClick: isTesting ? handleTestingCancel : undefined
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      appearance: "primary",
      disabled: true,
      label: (0, _i18n.gettext)('Save')
    }))))));
  };
  LLMConnectionModal.propTypes = {
    editMode: _propTypes.default.bool,
    initialConnectionName: _propTypes.default.string,
    initialDescription: _propTypes.default.string,
    initialIsCustom: _propTypes.default.bool,
    initialModel: _propTypes.default.string,
    initialProvider: _propTypes.default.string,
    open: _propTypes.default.bool,
    onRequestClose: _propTypes.default.func,
    onSaved: _propTypes.default.func
  };
  LLMConnectionModal.defaultProps = {
    editMode: false,
    initialConnectionName: '',
    initialDescription: '',
    initialIsCustom: false,
    initialModel: '',
    initialProvider: '',
    open: false,
    onRequestClose: function onRequestClose() {},
    onSaved: function onSaved() {}
  };
  var _default = _exports.default = LLMConnectionModal;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/components/LLMFieldRenderer.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./node_modules/@splunk/react-ui/Checkbox.js"), __webpack_require__("./node_modules/@splunk/react-ui/Select.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/react-ui/Tooltip.js"), __webpack_require__("./node_modules/@splunk/react-icons/QuestionCircle.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/utils.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esSymbolIterator, _esArrayConcat, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esObjectToString, _esStringIterator, _esStringTrim, _webDomCollectionsIterator, _react, _propTypes, _Checkbox, _Select, _Text, _Tooltip, _QuestionCircle, _utils, _LLMConnectionModal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _propTypes = _interopRequireDefault(_propTypes);
  _Checkbox = _interopRequireDefault(_Checkbox);
  _Select = _interopRequireDefault(_Select);
  _Text = _interopRequireDefault(_Text);
  _Tooltip = _interopRequireDefault(_Tooltip);
  _QuestionCircle = _interopRequireDefault(_QuestionCircle);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
  var LLMFieldRenderer = function LLMFieldRenderer(_ref) {
    var _formData$settingsTyp, _formData$settingsTyp2, _formData$settingsTyp3;
    var fieldName = _ref.fieldName,
      config = _ref.config,
      settingsType = _ref.settingsType,
      formData = _ref.formData,
      errors = _ref.errors,
      isCustomConnection = _ref.isCustomConnection,
      _onChange = _ref.onChange;
    if (!config || _typeof(config) !== 'object') {
      return null;
    }
    var rawType = String(config.type || '').toLowerCase();
    var normalizedType = rawType === 'string' || rawType === '' ? 'text' : rawType;
    var hasDisplayLabel = Boolean(String(config.label || '').trim());
    if (_utils.HIDDEN_RENDER_FIELDS.has(fieldName) || rawType === 'boolean' || !hasDisplayLabel) {
      return null;
    }
    var value = (_formData$settingsTyp = formData === null || formData === void 0 ? void 0 : (_formData$settingsTyp2 = formData[settingsType]) === null || _formData$settingsTyp2 === void 0 ? void 0 : (_formData$settingsTyp3 = _formData$settingsTyp2[fieldName]) === null || _formData$settingsTyp3 === void 0 ? void 0 : _formData$settingsTyp3.value) !== null && _formData$settingsTyp !== void 0 ? _formData$settingsTyp : config === null || config === void 0 ? void 0 : config.value;
    var fieldId = "".concat(settingsType, "-").concat(fieldName);
    var shouldMaskCustomSecret = settingsType === 'servicesettings' && isCustomConnection && ['access_token', 'client_secret'].includes(fieldName);
    if (normalizedType === 'checkbox') {
      return /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
        error: Boolean(errors === null || errors === void 0 ? void 0 : errors[fieldName]),
        help: errors === null || errors === void 0 ? void 0 : errors[fieldName],
        hideLabel: true,
        label: "",
        labelPosition: "top"
      }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.CheckboxFieldRow, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: Boolean(value),
        id: fieldId,
        onChange: function onChange(e, _ref2) {
          var checked = _ref2.checked;
          return _onChange({
            target: {
              checked: checked
            }
          });
        }
      }, config.label, config.description && /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: config.description
      }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.InlineTooltipIcon, null, /*#__PURE__*/_react.default.createElement(_QuestionCircle.default, {
        variant: "outlined"
      }))))));
    }
    return /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModalControlGroup, {
      "data-required": config.required ? 'true' : undefined,
      error: Boolean(errors === null || errors === void 0 ? void 0 : errors[fieldName]),
      help: errors === null || errors === void 0 ? void 0 : errors[fieldName],
      label: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, config.label, config.description && /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        content: config.description
      }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.InlineTooltipIcon, null, /*#__PURE__*/_react.default.createElement(_QuestionCircle.default, {
        variant: "outlined"
      })))),
      labelPosition: "top"
    }, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FieldWrap, null, normalizedType === 'select' ? /*#__PURE__*/_react.default.createElement(_Select.default, {
      id: fieldId,
      onChange: function onChange(e, _ref3) {
        var val = _ref3.value;
        return _onChange({
          target: {
            value: val
          }
        });
      },
      value: value !== null && value !== void 0 ? value : ''
    }, (config.options || []).map(function (option) {
      var normalizedOption = typeof option === 'string' ? {
        label: option,
        value: option
      } : option;
      return /*#__PURE__*/_react.default.createElement(_Select.default.Option, {
        key: normalizedOption.value,
        label: normalizedOption.label,
        value: normalizedOption.value
      });
    })) : /*#__PURE__*/_react.default.createElement(_Text.default, {
      id: fieldId,
      onChange: function onChange(e, _ref4) {
        var val = _ref4.value;
        return _onChange({
          target: {
            value: val
          }
        });
      },
      type: normalizedType === 'password' || config.hidden || shouldMaskCustomSecret ? 'password' : 'text',
      value: value !== null && value !== void 0 ? value : ''
    })));
  };
  LLMFieldRenderer.propTypes = {
    fieldName: _propTypes.default.string.isRequired,
    config: _propTypes.default.shape({
      type: _propTypes.default.string,
      label: _propTypes.default.string,
      description: _propTypes.default.string,
      required: _propTypes.default.bool,
      hidden: _propTypes.default.bool,
      options: _propTypes.default.array,
      value: _propTypes.default.any
    }),
    settingsType: _propTypes.default.oneOf(['servicesettings', 'modelsettings']).isRequired,
    formData: _propTypes.default.object,
    errors: _propTypes.default.object,
    isCustomConnection: _propTypes.default.bool,
    onChange: _propTypes.default.func.isRequired
  };
  LLMFieldRenderer.defaultProps = {
    config: null,
    formData: {},
    errors: {},
    isCustomConnection: false
  };
  var _default = _exports.default = LLMFieldRenderer;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/components/ModelControl.jsx":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
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
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.promise.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/prop-types/index.js"), __webpack_require__("./src/main/webapp/contrib_shim/react-ui/Button/Button.jsx"), __webpack_require__("./node_modules/@splunk/react-ui/Dropdown.js"), __webpack_require__("./node_modules/@splunk/react-ui/Menu.js"), __webpack_require__("./node_modules/@splunk/react-ui/Text.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/utils.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/LLMConnectionModal.styles.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayMap, _esObjectToString, _esPromise, _react, _propTypes, _Button, _Dropdown, _Menu, _Text, _i18n, _utils, _LLMConnectionModal) {
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
  _Text = _interopRequireDefault(_Text);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  var ModelControl = function ModelControl(_ref) {
    var isCustomConnection = _ref.isCustomConnection,
      editMode = _ref.editMode,
      effectiveProvider = _ref.effectiveProvider,
      selectedModel = _ref.selectedModel,
      setSelectedModel = _ref.setSelectedModel,
      isManualProviderModelEntry = _ref.isManualProviderModelEntry,
      setIsManualProviderModelEntry = _ref.setIsManualProviderModelEntry,
      availableModels = _ref.availableModels,
      providerModelsLabel = _ref.providerModelsLabel,
      clearError = _ref.clearError,
      setIsTestConnectionSuccessful = _ref.setIsTestConnectionSuccessful,
      refreshProviderModels = _ref.refreshProviderModels,
      formData = _ref.formData,
      setAllProviderConfigs = _ref.setAllProviderConfigs;
    var handleProviderModelSelect = function handleProviderModelSelect(modelName) {
      if (modelName === _utils.OTHER_MODEL_OPTION) {
        setIsManualProviderModelEntry(true);
        setSelectedModel('');
        clearError('model');
        setIsTestConnectionSuccessful(false);
        return;
      }
      setIsManualProviderModelEntry(false);
      setSelectedModel(modelName);
      clearError('model');
      setIsTestConnectionSuccessful(false);
    };
    var handleModelDropdownClick = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var normalizedProvider, updatedProviderConfig;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              normalizedProvider = (effectiveProvider || '').toLowerCase();
              if (_utils.DYNAMIC_MODEL_PROVIDERS.has(normalizedProvider)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return");
            case 3:
              _context.next = 5;
              return refreshProviderModels(effectiveProvider, formData.servicesettings);
            case 5:
              updatedProviderConfig = _context.sent;
              if (updatedProviderConfig) {
                setAllProviderConfigs(function (prev) {
                  return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, effectiveProvider, updatedProviderConfig));
                });
              }
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function handleModelDropdownClick() {
        return _ref2.apply(this, arguments);
      };
    }();
    var renderProviderModelMenu = function renderProviderModelMenu() {
      return /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModelMenuScrollWrap, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.FullWidthMenu, null, /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        disabled: true
      }, providerModelsLabel), availableModels.map(function (model) {
        return /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
          key: model,
          onClick: function onClick() {
            return handleProviderModelSelect(model);
          }
        }, model);
      }), /*#__PURE__*/_react.default.createElement(_Menu.default.Divider, null), /*#__PURE__*/_react.default.createElement(_Menu.default.Item, {
        onClick: function onClick() {
          return handleProviderModelSelect(_utils.OTHER_MODEL_OPTION);
        }
      }, (0, _i18n.gettext)('Other')), /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModelMenuNote, null, (0, _i18n.gettext)('If your desired model is not listed, you may enter it manually'))));
    };
    if (isCustomConnection) {
      return /*#__PURE__*/_react.default.createElement(_Text.default, {
        disabled: editMode || !effectiveProvider,
        id: "llm-model-input",
        onChange: function onChange(e, _ref3) {
          var value = _ref3.value;
          setSelectedModel(value);
          clearError('model');
          setIsTestConnectionSuccessful(false);
        },
        value: selectedModel
      });
    }
    var dropdownLabel = isManualProviderModelEntry ? selectedModel || (0, _i18n.gettext)('Other') : selectedModel || (0, _i18n.gettext)('Select model...');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_LLMConnectionModal.ModelDropdownWrap, null, /*#__PURE__*/_react.default.createElement(_Dropdown.default, {
      toggle: /*#__PURE__*/_react.default.createElement(_Button.default, {
        disabled: editMode,
        isMenu: true,
        label: dropdownLabel,
        onClick: handleModelDropdownClick
      })
    }, renderProviderModelMenu())), isManualProviderModelEntry && /*#__PURE__*/_react.default.createElement(_Text.default, {
      disabled: editMode || !effectiveProvider,
      id: "llm-model-input",
      onChange: function onChange(e, _ref4) {
        var value = _ref4.value;
        setSelectedModel(value);
        clearError('model');
        setIsTestConnectionSuccessful(false);
      },
      placeholder: (0, _i18n.gettext)('Enter model name'),
      value: selectedModel
    }));
  };
  ModelControl.propTypes = {
    isCustomConnection: _propTypes.default.bool,
    editMode: _propTypes.default.bool,
    effectiveProvider: _propTypes.default.string,
    selectedModel: _propTypes.default.string,
    setSelectedModel: _propTypes.default.func.isRequired,
    isManualProviderModelEntry: _propTypes.default.bool,
    setIsManualProviderModelEntry: _propTypes.default.func.isRequired,
    availableModels: _propTypes.default.array,
    providerModelsLabel: _propTypes.default.string,
    clearError: _propTypes.default.func.isRequired,
    setIsTestConnectionSuccessful: _propTypes.default.func.isRequired,
    refreshProviderModels: _propTypes.default.func.isRequired,
    formData: _propTypes.default.object,
    setAllProviderConfigs: _propTypes.default.func.isRequired
  };
  ModelControl.defaultProps = {
    isCustomConnection: false,
    editMode: false,
    effectiveProvider: '',
    selectedModel: '',
    isManualProviderModelEntry: false,
    availableModels: [],
    providerModelsLabel: '',
    formData: {}
  };
  var _default = _exports.default = ModelControl;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/components/index.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/components/LLMFieldRenderer.jsx"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/components/ModelControl.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LLMFieldRenderer, _ModelControl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "LLMFieldRenderer", {
    enumerable: true,
    get: function get() {
      return _LLMFieldRenderer.default;
    }
  });
  Object.defineProperty(_exports, "ModelControl", {
    enumerable: true,
    get: function get() {
      return _ModelControl.default;
    }
  });
  _LLMFieldRenderer = _interopRequireDefault(_LLMFieldRenderer);
  _ModelControl = _interopRequireDefault(_ModelControl);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/hooks/index.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/hooks/useLLMProviders.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/hooks/useLLMConnectionState.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/hooks/useLLMConnectionHandlers.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _useLLMProviders, _useLLMConnectionState, _useLLMConnectionHandlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "useLLMConnectionHandlers", {
    enumerable: true,
    get: function get() {
      return _useLLMConnectionHandlers.default;
    }
  });
  Object.defineProperty(_exports, "useLLMConnectionState", {
    enumerable: true,
    get: function get() {
      return _useLLMConnectionState.default;
    }
  });
  Object.defineProperty(_exports, "useLLMProviders", {
    enumerable: true,
    get: function get() {
      return _useLLMProviders.default;
    }
  });
  _useLLMProviders = _interopRequireDefault(_useLLMProviders);
  _useLLMConnectionState = _interopRequireDefault(_useLLMConnectionState);
  _useLLMConnectionHandlers = _interopRequireDefault(_useLLMConnectionHandlers);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/hooks/useLLMConnectionHandlers.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/connection/validation.js"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/utils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbolToPrimitive, _esArrayConcat, _esArrayIterator, _esDateToPrimitive, _esNumberConstructor, _esObjectEntries, _esObjectKeys, _esObjectToString, _esSet, _esStringIterator, _esStringTrim, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _react, _i18n, _ToastConstants, _ConnectionManagementApi, _validation, _ToastUtil, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
  var useLLMConnectionHandlers = function useLLMConnectionHandlers(_ref) {
    var editMode = _ref.editMode,
      isCustomConnection = _ref.isCustomConnection,
      effectiveProvider = _ref.effectiveProvider,
      customPayloadProvider = _ref.customPayloadProvider,
      isSplunkHostedProvider = _ref.isSplunkHostedProvider,
      selectedModel = _ref.selectedModel,
      isManualProviderModelEntry = _ref.isManualProviderModelEntry,
      connectionName = _ref.connectionName,
      connectionDescription = _ref.connectionDescription,
      formData = _ref.formData,
      customAuthMode = _ref.customAuthMode,
      consentChecked = _ref.consentChecked,
      isTestConnectionSuccessful = _ref.isTestConnectionSuccessful,
      visibleServiceFieldEntries = _ref.visibleServiceFieldEntries,
      setErrors = _ref.setErrors,
      setIsTesting = _ref.setIsTesting,
      setIsSaving = _ref.setIsSaving,
      setIsTestConnectionSuccessful = _ref.setIsTestConnectionSuccessful,
      onRequestClose = _ref.onRequestClose,
      onSaved = _ref.onSaved;
    var activeTestRequestRef = (0, _react.useRef)(0);
    var clearError = (0, _react.useCallback)(function (fieldName) {
      setErrors(function (prev) {
        if (!prev[fieldName]) {
          return prev;
        }
        var nextErrors = _objectSpread({}, prev);
        delete nextErrors[fieldName];
        return nextErrors;
      });
    }, [setErrors]);
    var buildLegacyConnectionDetails = (0, _react.useCallback)(function (isUpsert) {
      return {
        service: effectiveProvider,
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
    }, [connectionName, effectiveProvider, formData, selectedModel]);
    var buildConnectionPayload = (0, _react.useCallback)(function (action) {
      var _formData$modelsettin, _formData$modelsettin2;
      var normalizedServiceSettings = (0, _utils.flattenSettingsConfig)(formData.servicesettings);
      var normalizedModelSettings = (0, _utils.flattenSettingsConfig)(formData.modelsettings, new Set(['connection_name', 'set_as_default'].concat(_toConsumableArray(_utils.HIDDEN_RENDER_FIELDS))));
      if (normalizedModelSettings.response_variability === undefined && normalizedModelSettings.temperature !== undefined) {
        normalizedModelSettings.response_variability = normalizedModelSettings.temperature;
        delete normalizedModelSettings.temperature;
      }
      var connectionDetails = normalizedServiceSettings;
      if (isCustomConnection) {
        connectionDetails = _objectSpread({
          endpoint: normalizedServiceSettings.endpoint || '',
          request_timeout: normalizedServiceSettings.request_timeout,
          auth_type: customAuthMode === _utils.CUSTOM_AUTH_MODES.OIDC ? 'OIDC' : 'API_KEY'
        }, customAuthMode === _utils.CUSTOM_AUTH_MODES.OIDC ? {
          auth_connection_details: {
            token_url: (0, _utils.trimStringValue)(normalizedServiceSettings.token_url) || '',
            client_id: (0, _utils.trimStringValue)(normalizedServiceSettings.client_id) || '',
            client_secret: normalizedServiceSettings.client_secret || '',
            scope: (0, _utils.trimStringValue)(normalizedServiceSettings.scope) || ''
          }
        } : {
          access_token: normalizedServiceSettings.access_token || ''
        });
      } else if (isSplunkHostedProvider) {
        var _normalizedServiceSet;
        connectionDetails = _objectSpread(_objectSpread({}, normalizedServiceSettings), {}, {
          request_timeout: (_normalizedServiceSet = normalizedServiceSettings.request_timeout) !== null && _normalizedServiceSet !== void 0 ? _normalizedServiceSet : 200
        });
      }
      var isDefault = !!((_formData$modelsettin = formData.modelsettings) !== null && _formData$modelsettin !== void 0 && (_formData$modelsettin2 = _formData$modelsettin.set_as_default) !== null && _formData$modelsettin2 !== void 0 && _formData$modelsettin2.value);
      var payload = {
        action: action,
        name: connectionName,
        provider: isCustomConnection ? customPayloadProvider : effectiveProvider,
        model: selectedModel,
        is_custom: isCustomConnection,
        description: connectionDescription,
        connection_details: connectionDetails,
        default_users: isDefault ? ['*'] : [],
        llm_params: normalizedModelSettings,
        is_default: isDefault
      };
      if (action === 'create') {
        payload.created_at = null;
        payload.updated_by = '';
        payload.updated_at = null;
        payload.created_by = '';
      }
      return payload;
    }, [connectionDescription, connectionName, customAuthMode, customPayloadProvider, effectiveProvider, formData, isCustomConnection, isSplunkHostedProvider, selectedModel]);
    var validateCurrentForm = (0, _react.useCallback)(function () {
      var details = buildLegacyConnectionDetails(false);
      var nextErrors = {};

      // In edit mode, skip validation for service settings fields since they contain
      // placeholder values and are not editable
      if (!editMode) {
        visibleServiceFieldEntries.forEach(function (_ref2) {
          var _config$value, _config$value2;
          var _ref3 = _slicedToArray(_ref2, 2),
            key = _ref3[0],
            config = _ref3[1];
          if (_utils.HIDDEN_RENDER_FIELDS.has(key)) {
            return;
          }
          var errorMessage = (0, _validation.validateField)(key, (_config$value = config === null || config === void 0 ? void 0 : config.value) !== null && _config$value !== void 0 ? _config$value : '', {
            provider: effectiveProvider
          });
          if (errorMessage) {
            nextErrors[key] = errorMessage;
          } else if (config !== null && config !== void 0 && config.required && (config === null || config === void 0 ? void 0 : config.type) !== 'checkbox' && !String((_config$value2 = config === null || config === void 0 ? void 0 : config.value) !== null && _config$value2 !== void 0 ? _config$value2 : '').trim()) {
            nextErrors[key] = "".concat(config.label, " cannot be empty");
          }
        });
      }
      Object.entries(details.modelsettings || {}).forEach(function (_ref4) {
        var _config$value3, _config$value4;
        var _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          config = _ref5[1];
        if (_utils.HIDDEN_RENDER_FIELDS.has(key)) {
          return;
        }
        var errorMessage = (0, _validation.validateField)(key, (_config$value3 = config === null || config === void 0 ? void 0 : config.value) !== null && _config$value3 !== void 0 ? _config$value3 : '');
        if (errorMessage) {
          nextErrors[key] = errorMessage;
        } else if (config !== null && config !== void 0 && config.required && (config === null || config === void 0 ? void 0 : config.type) !== 'checkbox' && !String((_config$value4 = config === null || config === void 0 ? void 0 : config.value) !== null && _config$value4 !== void 0 ? _config$value4 : '').trim()) {
          nextErrors[key] = "".concat(config.label, " cannot be empty");
        }
      });
      var providerError = '';
      if (!isCustomConnection && !effectiveProvider) {
        providerError = (0, _i18n.gettext)('Select a provider');
      }
      var modelError = '';
      if (!selectedModel) {
        modelError = isCustomConnection || isManualProviderModelEntry ? (0, _i18n.gettext)('Enter a model') : (0, _i18n.gettext)('Select a model');
      }
      var connectionNameError = (0, _validation.validateField)('connection_name', connectionName);
      if (providerError) {
        nextErrors[isCustomConnection ? 'provider' : 'service'] = providerError;
      }
      if (modelError) {
        nextErrors.model = modelError;
      }
      if (connectionNameError) {
        nextErrors.connection_name = connectionNameError;
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }, [buildLegacyConnectionDetails, connectionName, editMode, effectiveProvider, isCustomConnection, isManualProviderModelEntry, selectedModel, setErrors, visibleServiceFieldEntries]);
    var handleTestConnection = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var requestId, _response$status, payload, response;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (validateCurrentForm()) {
              _context.next = 3;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please fix validation errors before testing the connection.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context.abrupt("return");
          case 3:
            requestId = activeTestRequestRef.current + 1;
            activeTestRequestRef.current = requestId;
            setIsTesting(true);
            _context.prev = 6;
            payload = buildConnectionPayload('test_connection');
            _context.next = 10;
            return (0, _ConnectionManagementApi.saveLLMConnection)('', payload);
          case 10:
            response = _context.sent;
            if (!(activeTestRequestRef.current !== requestId)) {
              _context.next = 13;
              break;
            }
            return _context.abrupt("return");
          case 13:
            if ((response === null || response === void 0 ? void 0 : (_response$status = response.status) === null || _response$status === void 0 ? void 0 : _response$status.toLowerCase()) === 'success') {
              setIsTestConnectionSuccessful(true);
              (0, _ToastUtil.triggerToast)((0, _utils.getResponseMessage)(response, (0, _i18n.gettext)('Connection test successful')), _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            } else {
              setIsTestConnectionSuccessful(false);
              (0, _ToastUtil.triggerToast)((0, _utils.getResponseMessage)(response, (0, _i18n.gettext)('Failed to test connection')), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            }
            _context.next = 22;
            break;
          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](6);
            if (!(activeTestRequestRef.current !== requestId)) {
              _context.next = 20;
              break;
            }
            return _context.abrupt("return");
          case 20:
            setIsTestConnectionSuccessful(false);
            (0, _ToastUtil.triggerToast)((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || (0, _i18n.gettext)('Failed to test connection'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 22:
            _context.prev = 22;
            if (activeTestRequestRef.current === requestId) {
              setIsTesting(false);
            }
            return _context.finish(22);
          case 25:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[6, 16, 22, 25]]);
    })), [buildConnectionPayload, setIsTesting, setIsTestConnectionSuccessful, validateCurrentForm]);
    var handleTestingCancel = (0, _react.useCallback)(function () {
      activeTestRequestRef.current += 1;
      setIsTesting(false);
      onRequestClose();
    }, [onRequestClose, setIsTesting]);
    var handleSave = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _response$status2, payload, response;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!editMode && !isTestConnectionSuccessful)) {
              _context2.next = 3;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Unable to save. Please test the connection successfully before saving.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Connection Required'));
            return _context2.abrupt("return");
          case 3:
            if (!(!isSplunkHostedProvider && !consentChecked)) {
              _context2.next = 6;
              break;
            }
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Please provide consent before saving this connection.'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Validation Error'));
            return _context2.abrupt("return");
          case 6:
            setIsSaving(true);
            _context2.prev = 7;
            payload = buildConnectionPayload(editMode ? 'update' : 'create');
            if (!editMode) {
              _context2.next = 15;
              break;
            }
            _context2.next = 12;
            return (0, _ConnectionManagementApi.updateLLMConnection)('', payload);
          case 12:
            _context2.t0 = _context2.sent;
            _context2.next = 18;
            break;
          case 15:
            _context2.next = 17;
            return (0, _ConnectionManagementApi.saveLLMConnection)('', payload);
          case 17:
            _context2.t0 = _context2.sent;
          case 18:
            response = _context2.t0;
            if ((response === null || response === void 0 ? void 0 : (_response$status2 = response.status) === null || _response$status2 === void 0 ? void 0 : _response$status2.toLowerCase()) === 'success') {
              (0, _ToastUtil.triggerToast)((0, _utils.getResponseMessage)(response, (0, _i18n.gettext)('Connection saved successfully')), _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
              onSaved();
              onRequestClose();
            } else {
              (0, _ToastUtil.triggerToast)((0, _utils.getResponseMessage)(response, (0, _i18n.gettext)('Failed to save connection')), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
            }
            _context2.next = 25;
            break;
          case 22:
            _context2.prev = 22;
            _context2.t1 = _context2["catch"](7);
            (0, _ToastUtil.triggerToast)((_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.message) || (0, _i18n.gettext)('Failed to save connection'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
          case 25:
            _context2.prev = 25;
            setIsSaving(false);
            return _context2.finish(25);
          case 28:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[7, 22, 25, 28]]);
    })), [buildConnectionPayload, consentChecked, editMode, isSplunkHostedProvider, isTestConnectionSuccessful, onRequestClose, onSaved, setIsSaving]);
    return {
      clearError: clearError,
      handleTestConnection: handleTestConnection,
      handleTestingCancel: handleTestingCancel,
      handleSave: handleSave
    };
  };
  var _default = _exports.default = useLLMConnectionHandlers;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/hooks/useLLMConnectionState.js":
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
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/utils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esArrayFilter, _esArrayIncludes, _esArrayMap, _esObjectEntries, _esObjectKeys, _esObjectToString, _esStringIncludes, _webDomCollectionsForEach, _react, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
  var useLLMConnectionState = function useLLMConnectionState(_ref) {
    var open = _ref.open,
      editMode = _ref.editMode,
      initialProvider = _ref.initialProvider,
      initialConnectionName = _ref.initialConnectionName,
      initialDescription = _ref.initialDescription,
      initialModel = _ref.initialModel,
      initialIsCustom = _ref.initialIsCustom;
    var _useState = (0, _react.useState)(initialProvider || ''),
      _useState2 = _slicedToArray(_useState, 2),
      selectedProvider = _useState2[0],
      setSelectedProvider = _useState2[1];
    var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedModel = _useState4[0],
      setSelectedModel = _useState4[1];
    var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isManualProviderModelEntry = _useState6[0],
      setIsManualProviderModelEntry = _useState6[1];
    var _useState7 = (0, _react.useState)(''),
      _useState8 = _slicedToArray(_useState7, 2),
      connectionName = _useState8[0],
      setConnectionName = _useState8[1];
    var _useState9 = (0, _react.useState)(''),
      _useState10 = _slicedToArray(_useState9, 2),
      connectionDescription = _useState10[0],
      setConnectionDescription = _useState10[1];
    var _useState11 = (0, _react.useState)({
        servicesettings: {},
        modelsettings: {}
      }),
      _useState12 = _slicedToArray(_useState11, 2),
      formData = _useState12[0],
      setFormData = _useState12[1];
    var _useState13 = (0, _react.useState)({}),
      _useState14 = _slicedToArray(_useState13, 2),
      errors = _useState14[0],
      setErrors = _useState14[1];
    var _useState15 = (0, _react.useState)(false),
      _useState16 = _slicedToArray(_useState15, 2),
      isSaving = _useState16[0],
      setIsSaving = _useState16[1];
    var _useState17 = (0, _react.useState)(false),
      _useState18 = _slicedToArray(_useState17, 2),
      isTesting = _useState18[0],
      setIsTesting = _useState18[1];
    var _useState19 = (0, _react.useState)(false),
      _useState20 = _slicedToArray(_useState19, 2),
      isTestConnectionSuccessful = _useState20[0],
      setIsTestConnectionSuccessful = _useState20[1];
    var _useState21 = (0, _react.useState)(false),
      _useState22 = _slicedToArray(_useState21, 2),
      consentChecked = _useState22[0],
      setConsentChecked = _useState22[1];
    var _useState23 = (0, _react.useState)(_utils.CUSTOM_AUTH_MODES.API_KEY),
      _useState24 = _slicedToArray(_useState23, 2),
      customAuthMode = _useState24[0],
      setCustomAuthMode = _useState24[1];
    var _useState25 = (0, _react.useState)({}),
      _useState26 = _slicedToArray(_useState25, 2),
      allProviderConfigs = _useState26[0],
      setAllProviderConfigs = _useState26[1];
    var isCustomConnection = initialIsCustom || !initialProvider;
    var isBusy = isTesting || isSaving;

    // Reset state when modal closes/opens
    (0, _react.useEffect)(function () {
      if (!open) {
        setSelectedProvider(initialIsCustom ? _utils.CUSTOM_PROVIDER_NAME : initialProvider || '');
        setSelectedModel('');
        setIsManualProviderModelEntry(false);
        setConnectionName('');
        setConnectionDescription('');
        setFormData({
          servicesettings: {},
          modelsettings: {}
        });
        setErrors({});
        setIsSaving(false);
        setIsTesting(false);
        setIsTestConnectionSuccessful(false);
        setConsentChecked(false);
        setCustomAuthMode(_utils.CUSTOM_AUTH_MODES.API_KEY);
        return;
      }
      setSelectedProvider(isCustomConnection ? _utils.CUSTOM_PROVIDER_NAME : initialProvider || '');
      if (initialModel) {
        setSelectedModel(initialModel);
      } else if (!editMode) {
        setSelectedModel('');
      }
      if (editMode) {
        setConnectionName(initialConnectionName || '');
        setConnectionDescription(initialDescription || '');
      }
    }, [editMode, initialConnectionName, initialDescription, initialIsCustom, initialModel, initialProvider, isCustomConnection, open]);
    var customProviderName = (0, _react.useMemo)(function () {
      if (!isCustomConnection) {
        return '';
      }
      return _utils.CUSTOM_PROVIDER_NAME;
    }, [isCustomConnection]);
    var effectiveProvider = isCustomConnection ? customProviderName : selectedProvider;
    var customPayloadProvider = (0, _react.useMemo)(function () {
      if (!isCustomConnection) {
        return '';
      }
      if (editMode && initialProvider) {
        return initialProvider;
      }
      return customAuthMode === _utils.CUSTOM_AUTH_MODES.OIDC ? 'Custom' : _utils.CUSTOM_PROVIDER_NAME;
    }, [customAuthMode, editMode, initialProvider, isCustomConnection]);
    var selectedProviderConfig = (0, _react.useMemo)(function () {
      return (allProviderConfigs === null || allProviderConfigs === void 0 ? void 0 : allProviderConfigs[effectiveProvider]) || null;
    }, [allProviderConfigs, effectiveProvider]);
    var availableModels = (0, _react.useMemo)(function () {
      return Object.keys((selectedProviderConfig === null || selectedProviderConfig === void 0 ? void 0 : selectedProviderConfig.models) || {});
    }, [selectedProviderConfig]);
    var defaultCustomModelSettings = (0, _react.useMemo)(function () {
      var _selectedProviderConf;
      if (selectedModel && selectedProviderConfig !== null && selectedProviderConfig !== void 0 && (_selectedProviderConf = selectedProviderConfig.models) !== null && _selectedProviderConf !== void 0 && _selectedProviderConf[selectedModel]) {
        return (0, _utils.cloneModelSettingsConfig)(selectedProviderConfig.models[selectedModel]);
      }
      return (0, _utils.getDefaultModelSettings)(selectedProviderConfig);
    }, [selectedModel, selectedProviderConfig]);

    // Update form data when provider config changes
    (0, _react.useEffect)(function () {
      if (!selectedProviderConfig) {
        setFormData({
          servicesettings: {},
          modelsettings: {}
        });
        return;
      }
      var nextServiceSettings = Object.entries(selectedProviderConfig).reduce(function (acc, _ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          config = _ref3[1];
        if (key === 'models') {
          return acc;
        }
        acc[key] = _objectSpread({}, config);
        return acc;
      }, {});
      var nextCustomAuthSettings = isCustomConnection ? (0, _utils.getCustomAuthSettings)(customAuthMode) : {};
      setFormData(function (prev) {
        return {
          servicesettings: Object.entries(nextServiceSettings).reduce(function (acc, _ref4) {
            var _prev$servicesettings;
            var _ref5 = _slicedToArray(_ref4, 2),
              key = _ref5[0],
              config = _ref5[1];
            if ((_prev$servicesettings = prev.servicesettings) !== null && _prev$servicesettings !== void 0 && _prev$servicesettings[key]) {
              acc[key] = _objectSpread(_objectSpread({}, config), {}, {
                value: prev.servicesettings[key].value
              });
            } else if (isCustomConnection && key === 'endpoint' && !editMode) {
              acc[key] = _objectSpread(_objectSpread({}, config), {}, {
                value: ''
              });
            } else {
              acc[key] = config;
            }
            return acc;
          }, isCustomConnection ? (0, _utils.cloneSettingsConfig)(nextCustomAuthSettings) : {}),
          modelsettings: prev.modelsettings
        };
      });
      setErrors({});
      setConsentChecked(false);
      setIsTestConnectionSuccessful(false);
    }, [customAuthMode, editMode, isCustomConnection, selectedProviderConfig]);

    // Update model settings when model changes
    (0, _react.useEffect)(function () {
      var _selectedProviderConf2;
      if (isCustomConnection) {
        setFormData(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            modelsettings: defaultCustomModelSettings
          });
        });
        setErrors(function (prev) {
          var nextErrors = _objectSpread({}, prev);
          delete nextErrors.model;
          return nextErrors;
        });
        setConsentChecked(false);
        setIsTestConnectionSuccessful(false);
        return;
      }
      if (isManualProviderModelEntry) {
        setFormData(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            modelsettings: selectedModel ? defaultCustomModelSettings : {}
          });
        });
        setErrors(function (prev) {
          var nextErrors = _objectSpread({}, prev);
          delete nextErrors.model;
          return nextErrors;
        });
        setConsentChecked(false);
        setIsTestConnectionSuccessful(false);
        return;
      }
      if (!selectedModel || !(selectedProviderConfig !== null && selectedProviderConfig !== void 0 && (_selectedProviderConf2 = selectedProviderConfig.models) !== null && _selectedProviderConf2 !== void 0 && _selectedProviderConf2[selectedModel])) {
        setFormData(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            modelsettings: {}
          });
        });
        return;
      }
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          modelsettings: (0, _utils.cloneModelSettingsConfig)(selectedProviderConfig.models[selectedModel])
        });
      });
      setErrors(function (prev) {
        var nextErrors = _objectSpread({}, prev);
        delete nextErrors.model;
        return nextErrors;
      });
      setConsentChecked(false);
      setIsTestConnectionSuccessful(false);
    }, [defaultCustomModelSettings, isCustomConnection, isManualProviderModelEntry, selectedModel, selectedProviderConfig]);
    var isSplunkHostedProvider = (effectiveProvider || '').toLowerCase().includes('splunk');
    var customServiceFieldEntries = (0, _react.useMemo)(function () {
      if (!isCustomConnection) {
        return [];
      }
      return Object.entries(formData.servicesettings || {}).filter(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 1),
          fieldName = _ref7[0];
        return !(0, _utils.isCustomAuthField)(fieldName);
      });
    }, [formData.servicesettings, isCustomConnection]);
    var customAuthFieldEntries = (0, _react.useMemo)(function () {
      if (!isCustomConnection) {
        return [];
      }
      var visibleFieldNames = customAuthMode === _utils.CUSTOM_AUTH_MODES.API_KEY ? ['access_token'] : ['token_url', 'client_id', 'client_secret', 'scope'];
      return visibleFieldNames.map(function (fieldName) {
        var _formData$servicesett;
        return [fieldName, (_formData$servicesett = formData.servicesettings) === null || _formData$servicesett === void 0 ? void 0 : _formData$servicesett[fieldName]];
      }).filter(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
          config = _ref9[1];
        return Boolean(config);
      });
    }, [customAuthMode, formData.servicesettings, isCustomConnection]);
    var visibleServiceFieldEntries = (0, _react.useMemo)(function () {
      if (!isCustomConnection) {
        return Object.entries(formData.servicesettings || {});
      }
      return [].concat(_toConsumableArray(customServiceFieldEntries), _toConsumableArray(customAuthFieldEntries));
    }, [customAuthFieldEntries, customServiceFieldEntries, formData.servicesettings, isCustomConnection]);
    var visibleModelFieldEntries = (0, _react.useMemo)(function () {
      var _selectedProviderConf3;
      if (!selectedModel) {
        return [];
      }
      var baseModelConfig = (selectedProviderConfig === null || selectedProviderConfig === void 0 ? void 0 : (_selectedProviderConf3 = selectedProviderConfig.models) === null || _selectedProviderConf3 === void 0 ? void 0 : _selectedProviderConf3[selectedModel]) || (0, _utils.getDefaultModelSettings)(selectedProviderConfig);
      var mergedModelConfig = (0, _utils.cloneModelSettingsConfig)(baseModelConfig);
      Object.entries(formData.modelsettings || {}).forEach(function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
          fieldName = _ref11[0],
          config = _ref11[1];
        mergedModelConfig[fieldName] = mergedModelConfig[fieldName] ? _objectSpread(_objectSpread({}, mergedModelConfig[fieldName]), config) : _objectSpread({}, config);
      });
      return Object.entries(mergedModelConfig);
    }, [formData.modelsettings, selectedModel, selectedProviderConfig]);
    return {
      selectedProvider: selectedProvider,
      setSelectedProvider: setSelectedProvider,
      selectedModel: selectedModel,
      setSelectedModel: setSelectedModel,
      isManualProviderModelEntry: isManualProviderModelEntry,
      setIsManualProviderModelEntry: setIsManualProviderModelEntry,
      connectionName: connectionName,
      setConnectionName: setConnectionName,
      connectionDescription: connectionDescription,
      setConnectionDescription: setConnectionDescription,
      formData: formData,
      setFormData: setFormData,
      errors: errors,
      setErrors: setErrors,
      isSaving: isSaving,
      setIsSaving: setIsSaving,
      isTesting: isTesting,
      setIsTesting: setIsTesting,
      isTestConnectionSuccessful: isTestConnectionSuccessful,
      setIsTestConnectionSuccessful: setIsTestConnectionSuccessful,
      consentChecked: consentChecked,
      setConsentChecked: setConsentChecked,
      customAuthMode: customAuthMode,
      setCustomAuthMode: setCustomAuthMode,
      isCustomConnection: isCustomConnection,
      isBusy: isBusy,
      effectiveProvider: effectiveProvider,
      customPayloadProvider: customPayloadProvider,
      selectedProviderConfig: selectedProviderConfig,
      availableModels: availableModels,
      isSplunkHostedProvider: isSplunkHostedProvider,
      customServiceFieldEntries: customServiceFieldEntries,
      customAuthFieldEntries: customAuthFieldEntries,
      visibleServiceFieldEntries: visibleServiceFieldEntries,
      visibleModelFieldEntries: visibleModelFieldEntries,
      allProviderConfigs: allProviderConfigs,
      setAllProviderConfigs: setAllProviderConfigs
    };
  };
  var _default = _exports.default = useLLMConnectionState;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/hooks/useLLMProviders.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js");
__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/connection/utils/LLMConnectionResponseUtil.jsx"), __webpack_require__("./src/main/webapp/components/connections/LLMConnectionModal/utils.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayConcat, _esObjectEntries, _esObjectKeys, _esObjectToString, _webDomCollectionsForEach, _react, _i18n, _ToastConstants, _ConnectionManagementApi, _ToastUtil, _LLMConnectionResponseUtil, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  var useLLMProviders = function useLLMProviders(_ref) {
    var open = _ref.open,
      editMode = _ref.editMode,
      initialProvider = _ref.initialProvider,
      initialConnectionName = _ref.initialConnectionName,
      initialDescription = _ref.initialDescription,
      initialModel = _ref.initialModel,
      initialIsCustom = _ref.initialIsCustom,
      isCustomConnection = _ref.isCustomConnection,
      setSelectedProvider = _ref.setSelectedProvider,
      setSelectedModel = _ref.setSelectedModel,
      setConnectionName = _ref.setConnectionName,
      setConnectionDescription = _ref.setConnectionDescription,
      setIsManualProviderModelEntry = _ref.setIsManualProviderModelEntry,
      setIsTestConnectionSuccessful = _ref.setIsTestConnectionSuccessful,
      setFormData = _ref.setFormData,
      setCustomAuthMode = _ref.setCustomAuthMode,
      setAllProviderConfigs = _ref.setAllProviderConfigs;
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      loadingProviders = _useState2[0],
      setLoadingProviders = _useState2[1];
    var refreshProviderModels = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(providerName, formDataServicesettings) {
        var _response$updated_con;
        var response, updatedProviderConfig;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _ConnectionManagementApi.saveLLMConnection)('', {
                action: 'refresh_models',
                service: providerName,
                model: null,
                servicesettings: formDataServicesettings || {},
                modelsettings: {},
                is_upsert: false
              });
            case 2:
              response = _context.sent;
              if (!((response === null || response === void 0 ? void 0 : response.status) === 'fail' || (response === null || response === void 0 ? void 0 : response.status) === 'failure')) {
                _context.next = 6;
                break;
              }
              (0, _ToastUtil.triggerToast)((0, _utils.getResponseMessage)(response, (0, _i18n.gettext)('Failed to refresh models')), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
              return _context.abrupt("return", null);
            case 6:
              updatedProviderConfig = response === null || response === void 0 ? void 0 : (_response$updated_con = response.updated_config) === null || _response$updated_con === void 0 ? void 0 : _response$updated_con[providerName];
              if (!(!updatedProviderConfig || !Object.keys(updatedProviderConfig.models || {}).length)) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return", null);
            case 9:
              return _context.abrupt("return", updatedProviderConfig);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }(), []);
    (0, _react.useEffect)(function () {
      if (!open) {
        return undefined;
      }
      var mounted = true;
      var loadProviders = /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var response, nextProviderConfigs, encodedProvider, encodedConnectionName, encodedModel, editResponse, editData, _editData$provider_se, _editData$provider_se2, _nextProviderConfigs, _nextProviderConfigs2, _mergedProviderConfig, _mergedProviderConfig2, isEditingCustomConnection, resolvedProvider, resolvedCustomAuthMode, mergedProviderConfig, mergedModelName, existingModelConfig;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                setLoadingProviders(true);
                _context2.prev = 1;
                _context2.next = 4;
                return (0, _ConnectionManagementApi.getLLMConfigMetaData)();
              case 4:
                response = _context2.sent;
                if (mounted) {
                  _context2.next = 7;
                  break;
                }
                return _context2.abrupt("return");
              case 7:
                if (!((response === null || response === void 0 ? void 0 : response.status) === 'success' && response !== null && response !== void 0 && response.metadata)) {
                  _context2.next = 21;
                  break;
                }
                nextProviderConfigs = _objectSpread(_objectSpread({}, response.metadata), {}, _defineProperty({}, _utils.CUSTOM_PROVIDER_NAME, (0, _utils.buildCustomProviderConfig)(response.metadata)));
                if (!(editMode && initialProvider && initialConnectionName && initialModel)) {
                  _context2.next = 18;
                  break;
                }
                encodedProvider = encodeURIComponent(initialProvider);
                encodedConnectionName = encodeURIComponent(initialConnectionName);
                encodedModel = encodeURIComponent(initialModel);
                _context2.next = 15;
                return (0, _ConnectionManagementApi.getLLMConfigData)("/".concat(encodedProvider, "/").concat(encodedConnectionName, "/").concat(encodedModel), null);
              case 15:
                editResponse = _context2.sent;
                editData = (0, _LLMConnectionResponseUtil.extractLLMEditData)(editResponse, {
                  provider: initialProvider,
                  connectionName: initialConnectionName,
                  model: initialModel
                });
                if (editData) {
                  isEditingCustomConnection = Boolean(editData.is_custom) || isCustomConnection;
                  resolvedProvider = editData.provider || initialProvider;
                  resolvedCustomAuthMode = String(((_editData$provider_se = editData.provider_settings) === null || _editData$provider_se === void 0 ? void 0 : (_editData$provider_se2 = _editData$provider_se.auth_type) === null || _editData$provider_se2 === void 0 ? void 0 : _editData$provider_se2.value) || '').toUpperCase() === 'OIDC' ? _utils.CUSTOM_AUTH_MODES.OIDC : _utils.CUSTOM_AUTH_MODES.API_KEY;
                  mergedProviderConfig = isEditingCustomConnection ? _objectSpread(_objectSpread({}, ((_nextProviderConfigs = nextProviderConfigs) === null || _nextProviderConfigs === void 0 ? void 0 : _nextProviderConfigs[_utils.CUSTOM_PROVIDER_NAME]) || (0, _utils.buildCustomProviderConfig)(nextProviderConfigs)), (0, _utils.getCustomAuthSettings)(resolvedCustomAuthMode)) : _objectSpread({}, ((_nextProviderConfigs2 = nextProviderConfigs) === null || _nextProviderConfigs2 === void 0 ? void 0 : _nextProviderConfigs2[resolvedProvider]) || {});
                  Object.entries(editData.provider_settings || {}).forEach(function (_ref4) {
                    var _ref5 = _slicedToArray(_ref4, 2),
                      key = _ref5[0],
                      config = _ref5[1];
                    if (key === 'auth_type') {
                      setCustomAuthMode(resolvedCustomAuthMode);
                      return;
                    }
                    mergedProviderConfig[key] = mergedProviderConfig[key] ? _objectSpread(_objectSpread({}, mergedProviderConfig[key]), config) : _objectSpread({}, config);
                  });
                  mergedModelName = editData.model || initialModel;
                  existingModelConfig = (mergedProviderConfig === null || mergedProviderConfig === void 0 ? void 0 : (_mergedProviderConfig = mergedProviderConfig.models) === null || _mergedProviderConfig === void 0 ? void 0 : _mergedProviderConfig[mergedModelName]) || (0, _utils.getDefaultModelSettings)(mergedProviderConfig);
                  mergedProviderConfig.models = _objectSpread(_objectSpread({}, mergedProviderConfig.models || {}), {}, _defineProperty({}, mergedModelName, _objectSpread(_objectSpread({}, existingModelConfig), editData.model_settings || {})));
                  nextProviderConfigs = _objectSpread(_objectSpread({}, nextProviderConfigs), {}, _defineProperty({}, isEditingCustomConnection ? _utils.CUSTOM_PROVIDER_NAME : resolvedProvider, mergedProviderConfig));
                  setSelectedProvider(isEditingCustomConnection ? _utils.CUSTOM_PROVIDER_NAME : resolvedProvider);
                  setSelectedModel(mergedModelName);
                  setConnectionName(initialConnectionName);
                  setConnectionDescription(initialDescription || '');
                  setIsManualProviderModelEntry(false);
                  setIsTestConnectionSuccessful(true);
                  setFormData({
                    servicesettings: Object.entries(mergedProviderConfig).reduce(function (acc, _ref6) {
                      var _ref7 = _slicedToArray(_ref6, 2),
                        key = _ref7[0],
                        config = _ref7[1];
                      if (key === 'models') {
                        return acc;
                      }
                      acc[key] = _objectSpread({}, config);
                      return acc;
                    }, isEditingCustomConnection ? (0, _utils.cloneSettingsConfig)((0, _utils.getCustomAuthSettings)(resolvedCustomAuthMode)) : {}),
                    modelsettings: (0, _utils.cloneModelSettingsConfig)(((_mergedProviderConfig2 = mergedProviderConfig.models) === null || _mergedProviderConfig2 === void 0 ? void 0 : _mergedProviderConfig2[mergedModelName]) || {})
                  });
                }
              case 18:
                setAllProviderConfigs(nextProviderConfigs);
                _context2.next = 22;
                break;
              case 21:
                (0, _ToastUtil.triggerToast)((0, _utils.getResponseMessage)(response, (0, _i18n.gettext)('Failed to fetch config metadata')), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
              case 22:
                _context2.next = 27;
                break;
              case 24:
                _context2.prev = 24;
                _context2.t0 = _context2["catch"](1);
                if (mounted) {
                  (0, _ToastUtil.triggerToast)((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || (0, _i18n.gettext)('Failed to fetch config metadata'), _ToastConstants.TOAST_TYPES.ERROR, (0, _i18n.gettext)('Error'));
                }
              case 27:
                _context2.prev = 27;
                if (mounted) {
                  setLoadingProviders(false);
                }
                return _context2.finish(27);
              case 30:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 24, 27, 30]]);
        }));
        return function loadProviders() {
          return _ref3.apply(this, arguments);
        };
      }();
      loadProviders();
      return function () {
        mounted = false;
      };
    }, [editMode, initialConnectionName, initialDescription, initialIsCustom, initialModel, initialProvider, isCustomConnection, open, setConnectionDescription, setConnectionName, setCustomAuthMode, setFormData, setIsManualProviderModelEntry, setIsTestConnectionSuccessful, setSelectedModel, setSelectedProvider]);
    return {
      loadingProviders: loadingProviders,
      refreshProviderModels: refreshProviderModels
    };
  };
  var _default = _exports.default = useLLMProviders;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/LLMConnectionModal/utils.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
__webpack_require__("./node_modules/core-js/modules/es.symbol.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js");
__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__("./node_modules/core-js/modules/es.array.from.js");
__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");
__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js");
__webpack_require__("./node_modules/core-js/modules/es.function.name.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"), __webpack_require__("./node_modules/core-js/modules/es.object.entries.js"), __webpack_require__("./node_modules/core-js/modules/es.object.keys.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.trim.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayIncludes, _esArrayIterator, _esNumberConstructor, _esObjectEntries, _esObjectKeys, _esObjectToString, _esSet, _esStringIncludes, _esStringIterator, _esStringTrim, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsForEach, _webDomCollectionsIterator, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.withReasoningEffortConfig = _exports.trimStringValue = _exports.normalizeFieldValue = _exports.isCustomAuthField = _exports.getResponseMessage = _exports.getDefaultModelSettings = _exports.getCustomAuthSettings = _exports.flattenSettingsConfig = _exports.cloneSettingsConfig = _exports.cloneModelSettingsConfig = _exports.buildCustomProviderConfig = _exports.REASONING_EFFORT_FIELD = _exports.OTHER_MODEL_OPTION = _exports.HIDDEN_RENDER_FIELDS = _exports.DYNAMIC_MODEL_PROVIDERS = _exports.DEFAULT_MODEL_SETTINGS_TEMPLATE = _exports.CUSTOM_PROVIDER_NAME = _exports.CUSTOM_AUTH_MODES = void 0;
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
  var getResponseMessage = _exports.getResponseMessage = function getResponseMessage(response, fallbackMessage) {
    var _response$payload, _response$payload2;
    return (response === null || response === void 0 ? void 0 : response.message) || (response === null || response === void 0 ? void 0 : response.error_message) || (response === null || response === void 0 ? void 0 : (_response$payload = response.payload) === null || _response$payload === void 0 ? void 0 : _response$payload.message) || (response === null || response === void 0 ? void 0 : (_response$payload2 = response.payload) === null || _response$payload2 === void 0 ? void 0 : _response$payload2.error_message) || fallbackMessage;
  };
  var HIDDEN_RENDER_FIELDS = _exports.HIDDEN_RENDER_FIELDS = new Set(['models', 'connection_name', 'default_users', 'is_saved', 'is_model_saved']);
  var DYNAMIC_MODEL_PROVIDERS = _exports.DYNAMIC_MODEL_PROVIDERS = new Set(['openai', 'azureopenai', 'gemini', 'ollama', 'bedrock', 'anthropic', 'groq']);
  var OTHER_MODEL_OPTION = _exports.OTHER_MODEL_OPTION = '__other_model__';
  var CUSTOM_PROVIDER_NAME = _exports.CUSTOM_PROVIDER_NAME = 'Custom';
  var DEFAULT_MODEL_SETTINGS_TEMPLATE = _exports.DEFAULT_MODEL_SETTINGS_TEMPLATE = {
    response_variability: {
      label: (0, _i18n.gettext)('Response Variability'),
      type: 'number',
      required: true,
      value: 0
    },
    maximum_result_rows: {
      label: (0, _i18n.gettext)('Maximum Result Rows'),
      type: 'number',
      required: false,
      value: 10
    },
    max_tokens: {
      label: (0, _i18n.gettext)('Max Tokens'),
      type: 'number',
      required: false,
      value: 2000
    },
    set_as_default: {
      label: (0, _i18n.gettext)('Set as default'),
      type: 'checkbox',
      required: false,
      value: false
    }
  };
  var REASONING_EFFORT_FIELD = _exports.REASONING_EFFORT_FIELD = {
    label: (0, _i18n.gettext)('Reasoning Effort'),
    type: 'select',
    required: false,
    value: 'NONE',
    description: (0, _i18n.gettext)('Controls the model reasoning effort level for supported providers.'),
    options: [{
      label: 'NONE',
      value: 'NONE'
    }, {
      label: 'HIGH',
      value: 'HIGH'
    }, {
      label: 'MEDIUM',
      value: 'MEDIUM'
    }, {
      label: 'LOW',
      value: 'LOW'
    }]
  };
  var CUSTOM_AUTH_MODES = _exports.CUSTOM_AUTH_MODES = {
    API_KEY: 'api_key',
    OIDC: 'oidc'
  };
  var withReasoningEffortConfig = _exports.withReasoningEffortConfig = function withReasoningEffortConfig(settings) {
    var sourceSettings = settings || {};
    var nextSettings = {};
    var insertedReasoningEffort = false;
    Object.entries(sourceSettings).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        config = _ref2[1];
      if (key === 'set_as_default' && !insertedReasoningEffort) {
        nextSettings.reasoning_effort = sourceSettings.reasoning_effort ? _objectSpread({}, sourceSettings.reasoning_effort) : _objectSpread({}, REASONING_EFFORT_FIELD);
        insertedReasoningEffort = true;
      }
      if (key !== 'reasoning_effort') {
        nextSettings[key] = _objectSpread({}, config);
      }
    });
    if (!insertedReasoningEffort) {
      nextSettings.reasoning_effort = sourceSettings.reasoning_effort ? _objectSpread({}, sourceSettings.reasoning_effort) : _objectSpread({}, REASONING_EFFORT_FIELD);
    }
    return nextSettings;
  };
  var cloneSettingsConfig = _exports.cloneSettingsConfig = function cloneSettingsConfig(settings) {
    return Object.entries(settings || {}).reduce(function (acc, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        config = _ref4[1];
      acc[key] = _objectSpread({}, config);
      return acc;
    }, {});
  };
  var cloneModelSettingsConfig = _exports.cloneModelSettingsConfig = function cloneModelSettingsConfig(settings) {
    return withReasoningEffortConfig(settings);
  };
  var normalizeFieldValue = _exports.normalizeFieldValue = function normalizeFieldValue(config) {
    var value = config === null || config === void 0 ? void 0 : config.value;
    if ((config === null || config === void 0 ? void 0 : config.type) === 'checkbox') {
      return Boolean(value);
    }
    if ((config === null || config === void 0 ? void 0 : config.type) === 'number') {
      if (value === '' || value === null || value === undefined) {
        return value;
      }
      return Number(value);
    }
    return value !== null && value !== void 0 ? value : '';
  };
  var flattenSettingsConfig = _exports.flattenSettingsConfig = function flattenSettingsConfig(settings) {
    var excludedFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
    return Object.entries(settings || {}).reduce(function (acc, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        config = _ref6[1];
      if (excludedFields.has(key)) {
        return acc;
      }
      acc[key] = normalizeFieldValue(config);
      return acc;
    }, {});
  };
  var trimStringValue = _exports.trimStringValue = function trimStringValue(value) {
    return typeof value === 'string' ? value.trim() : value;
  };
  var getDefaultModelSettings = _exports.getDefaultModelSettings = function getDefaultModelSettings(providerConfig) {
    var firstModelName = Object.keys((providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.models) || {})[0];
    return firstModelName ? cloneModelSettingsConfig(providerConfig.models[firstModelName]) : cloneModelSettingsConfig(DEFAULT_MODEL_SETTINGS_TEMPLATE);
  };
  var getCustomAuthSettings = _exports.getCustomAuthSettings = function getCustomAuthSettings(authMode) {
    return {
      access_token: {
        label: (0, _i18n.gettext)('API Key'),
        type: 'password',
        required: authMode === CUSTOM_AUTH_MODES.API_KEY,
        value: ''
      },
      token_url: {
        label: (0, _i18n.gettext)('Token URL'),
        type: 'text',
        required: authMode === CUSTOM_AUTH_MODES.OIDC,
        value: ''
      },
      client_id: {
        label: (0, _i18n.gettext)('Client ID'),
        type: 'text',
        required: authMode === CUSTOM_AUTH_MODES.OIDC,
        value: ''
      },
      client_secret: {
        label: (0, _i18n.gettext)('Client Secret'),
        type: 'password',
        required: authMode === CUSTOM_AUTH_MODES.OIDC,
        value: ''
      },
      scope: {
        label: (0, _i18n.gettext)('Scope'),
        type: 'text',
        required: false,
        value: ''
      }
    };
  };
  var isCustomAuthField = _exports.isCustomAuthField = function isCustomAuthField(fieldName) {
    var normalizedFieldName = (fieldName || '').toLowerCase();
    return normalizedFieldName.includes('token') || normalizedFieldName.includes('secret') || normalizedFieldName.includes('api_key') || normalizedFieldName.includes('apikey') || normalizedFieldName.includes('token_url') || normalizedFieldName.includes('client_id') || normalizedFieldName.includes('client_secret') || normalizedFieldName.includes('scope') || normalizedFieldName.includes('oidc') || normalizedFieldName.includes('auth');
  };
  var buildCustomProviderConfig = _exports.buildCustomProviderConfig = function buildCustomProviderConfig(providerConfigs) {
    var baseProviderConfig = (providerConfigs === null || providerConfigs === void 0 ? void 0 : providerConfigs.OpenAI) || (providerConfigs === null || providerConfigs === void 0 ? void 0 : providerConfigs[Object.keys(providerConfigs || {})[0]]) || {};
    var customProviderConfig = Object.entries(baseProviderConfig || {}).reduce(function (acc, _ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
        key = _ref8[0],
        config = _ref8[1];
      if (key === 'models' || isCustomAuthField(key)) {
        return acc;
      }
      acc[key] = _objectSpread({}, config);
      return acc;
    }, {
      endpoint: {
        label: (0, _i18n.gettext)('Endpoint'),
        type: 'text',
        required: true,
        value: ''
      },
      request_timeout: {
        label: (0, _i18n.gettext)('Request Timeout'),
        type: 'number',
        required: false,
        value: 200
      }
    });
    return _objectSpread(_objectSpread({}, customProviderConfig), {}, {
      models: cloneSettingsConfig((baseProviderConfig === null || baseProviderConfig === void 0 ? void 0 : baseProviderConfig.models) || {})
    });
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/constants.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VIEW = _exports.TITLE = _exports.THIRD_PARTY_LLM_PROVIDERS = _exports.SUBTITLE = _exports.SPLUNK_HOSTED_LLM = _exports.ROWS = _exports.OWNER_FILTER_LABEL = _exports.MCP_PROVIDERS = _exports.KNOWLEDGE_BASE_TYPE = _exports.FILTER_PLACEHOLDER = _exports.FILTER_LLM_PROVIDERS_PLACEHOLDER = _exports.FILTER_LABEL = _exports.EDIT = _exports.DELETE = _exports.CUSTOM_LLM_CONNECTION = _exports.CONTAINER_PROVIDER = _exports.CONNECTION_TYPE_TITLE = _exports.CONNECTION_TYPES = _exports.COLUMNNAMES = _exports.BACK_LABEL = _exports.APP = _exports.ADD_CONNECTION_TITLE = void 0;
  var COLUMNNAMES = _exports.COLUMNNAMES = [(0, _i18n.gettext)('Connection name'), (0, _i18n.gettext)('Owner'), (0, _i18n.gettext)('Sharing'), (0, _i18n.gettext)('Connection type'), ''];
  var ROWS = _exports.ROWS = 10;
  var EDIT = _exports.EDIT = (0, _i18n.gettext)('Edit');
  var DELETE = _exports.DELETE = (0, _i18n.gettext)('Delete');
  var VIEW = _exports.VIEW = (0, _i18n.gettext)('View connection details');
  var SUBTITLE = _exports.SUBTITLE = (0, _i18n.gettext)('Manage LLM, MCP, knowledge base, and container connections for AI Toolkit.');
  var TITLE = _exports.TITLE = (0, _i18n.gettext)('Connections');
  var ADD_CONNECTION_TITLE = _exports.ADD_CONNECTION_TITLE = (0, _i18n.gettext)('Connection');
  var FILTER_PLACEHOLDER = _exports.FILTER_PLACEHOLDER = (0, _i18n.gettext)('Search...');
  var OWNER_FILTER_LABEL = _exports.OWNER_FILTER_LABEL = (0, _i18n.gettext)('Owner');
  var FILTER_LABEL = _exports.FILTER_LABEL = (0, _i18n.gettext)('Filter');
  var CONNECTION_TYPE_TITLE = _exports.CONNECTION_TYPE_TITLE = (0, _i18n.gettext)('Connection type');
  var BACK_LABEL = _exports.BACK_LABEL = (0, _i18n.gettext)('Back');
  var FILTER_LLM_PROVIDERS_PLACEHOLDER = _exports.FILTER_LLM_PROVIDERS_PLACEHOLDER = (0, _i18n.gettext)('Filter LLM providers...');
  var CUSTOM_LLM_CONNECTION = _exports.CUSTOM_LLM_CONNECTION = (0, _i18n.gettext)('Custom LLM connection');
  var SPLUNK_HOSTED_LLM = _exports.SPLUNK_HOSTED_LLM = (0, _i18n.gettext)('Splunk hosted LLM');
  var THIRD_PARTY_LLM_PROVIDERS = _exports.THIRD_PARTY_LLM_PROVIDERS = (0, _i18n.gettext)('3rd party LLM providers');
  var MCP_PROVIDERS = _exports.MCP_PROVIDERS = (0, _i18n.gettext)('MCP providers');
  var KNOWLEDGE_BASE_TYPE = _exports.KNOWLEDGE_BASE_TYPE = (0, _i18n.gettext)('Knowledge base type');
  var CONTAINER_PROVIDER = _exports.CONTAINER_PROVIDER = (0, _i18n.gettext)('Container provider');
  var CONNECTION_TYPES = _exports.CONNECTION_TYPES = {
    LLM: 'llm',
    MCP: 'mcp',
    KB: 'kb',
    KUBERNETES: 'kubernetes',
    DOCKER: 'docker',
    CONTAINER: 'container'
  };
  var APP = _exports.APP = 'Splunk_ML_Toolkit';
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/components/connections/hooks/useConnectionsPageState.js":
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
__webpack_require__("./node_modules/core-js/modules/es.object.keys.js");
__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js");
__webpack_require__("./node_modules/core-js/modules/es.promise.js");
__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js");
__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js");
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.symbol.js"), __webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"), __webpack_require__("./node_modules/core-js/modules/es.array.concat.js"), __webpack_require__("./node_modules/core-js/modules/es.array.filter.js"), __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.array.from.js"), __webpack_require__("./node_modules/core-js/modules/es.array.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.array.map.js"), __webpack_require__("./node_modules/core-js/modules/es.function.name.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"), __webpack_require__("./node_modules/core-js/modules/es.set.js"), __webpack_require__("./node_modules/core-js/modules/es.string.includes.js"), __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"), __webpack_require__("./node_modules/core-js/modules/es.string.replace.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.add-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.delete-all.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.every.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.filter.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.find.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.intersection.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-disjoint-from.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-subset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.is-superset-of.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.join.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.map.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.reduce.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.some.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.symmetric-difference.js"), __webpack_require__("./node_modules/core-js/modules/esnext.set.union.js"), __webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./node_modules/@splunk/splunk-utils/config.js"), __webpack_require__("./node_modules/@splunk/react-toast-notifications/ToastConstants.js"), __webpack_require__("./src/main/webapp/components/connection/clients/ConnectionManagementApi.js"), __webpack_require__("./src/main/webapp/components/connection/utils/index.js"), __webpack_require__("./src/main/webapp/components/connection/utils/ToastUtil.jsx"), __webpack_require__("./src/main/webapp/components/agentConnections/clients/AgentBuilderApi.js"), __webpack_require__("./src/main/webapp/components/connection/constants.js"), __webpack_require__("./src/main/webapp/components/connections/constants.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esSymbol, _esSymbolDescription, _esArrayConcat, _esArrayFilter, _esArrayFind, _esArrayFrom, _esArrayIncludes, _esArrayIterator, _esArrayMap, _esFunctionName, _esObjectToString, _esRegexpExec, _esSet, _esStringIncludes, _esStringIterator, _esStringReplace, _esnextSetAddAll, _esnextSetDeleteAll, _esnextSetDifference, _esnextSetEvery, _esnextSetFilter, _esnextSetFind, _esnextSetIntersection, _esnextSetIsDisjointFrom, _esnextSetIsSubsetOf, _esnextSetIsSupersetOf, _esnextSetJoin, _esnextSetMap, _esnextSetReduce, _esnextSetSome, _esnextSetSymmetricDifference, _esnextSetUnion, _webDomCollectionsIterator, _react, _i18n, _config, _ToastConstants, _ConnectionManagementApi, _utils, _ToastUtil, _AgentBuilderApi, _constants, _constants2) {
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
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
  var useConnectionsPageState = function useConnectionsPageState() {
    var _useState = (0, _react.useState)({
        showLLM: false,
        showDSDL: false,
        actionsLLM: false,
        actionsDSDL: false
      }),
      _useState2 = _slicedToArray(_useState, 2),
      hasPermission = _useState2[0],
      setHasPermission = _useState2[1];
    var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      searchTerm = _useState4[0],
      setSearchTerm = _useState4[1];
    var _useState5 = (0, _react.useState)(''),
      _useState6 = _slicedToArray(_useState5, 2),
      ownerFilter = _useState6[0],
      setOwnerFilter = _useState6[1];
    var _useState7 = (0, _react.useState)([]),
      _useState8 = _slicedToArray(_useState7, 2),
      ownerOptions = _useState8[0],
      setOwnerOptions = _useState8[1];
    var _useState9 = (0, _react.useState)({
        count: 0,
        pageNum: 1,
        totalPages: 1,
        setPageNum: function setPageNum() {}
      }),
      _useState10 = _slicedToArray(_useState9, 2),
      paginationInfo = _useState10[0],
      setPaginationInfo = _useState10[1];
    var _useState11 = (0, _react.useState)(0),
      _useState12 = _slicedToArray(_useState11, 2),
      refreshKey = _useState12[0],
      setRefreshKey = _useState12[1];

    // Modal states
    var _useState13 = (0, _react.useState)({
        open: false,
        provider: '',
        isCustom: false,
        editMode: false,
        connectionName: '',
        model: '',
        description: ''
      }),
      _useState14 = _slicedToArray(_useState13, 2),
      llmModalState = _useState14[0],
      setLlmModalState = _useState14[1];
    var _useState15 = (0, _react.useState)({
        open: false,
        provider: '',
        type: 'MCP',
        editMode: false,
        connectionData: null
      }),
      _useState16 = _slicedToArray(_useState15, 2),
      agentModalState = _useState16[0],
      setAgentModalState = _useState16[1];
    var _useState17 = (0, _react.useState)({
        open: false,
        provider: '',
        editMode: false,
        connectionName: ''
      }),
      _useState18 = _slicedToArray(_useState17, 2),
      containerModalState = _useState18[0],
      setContainerModalState = _useState18[1];

    // Permissions modal state
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
      setPermissionsRoles = _useState24[1];
    var _useState25 = (0, _react.useState)('owner'),
      _useState26 = _slicedToArray(_useState25, 2),
      permissionsDisplayFor = _useState26[0],
      setPermissionsDisplayFor = _useState26[1];
    var _useState27 = (0, _react.useState)([]),
      _useState28 = _slicedToArray(_useState27, 2),
      permissionsReadRoles = _useState28[0],
      setPermissionsReadRoles = _useState28[1];
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
    var handleAddType = (0, _react.useCallback)(function (type) {
      var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      switch (type) {
        case 'LLM':
          setLlmModalState({
            open: true,
            provider: provider,
            isCustom: !provider,
            editMode: false,
            connectionName: '',
            model: '',
            description: ''
          });
          break;
        case 'CONTAINER':
          setContainerModalState({
            open: true,
            provider: provider,
            editMode: false,
            connectionName: ''
          });
          break;
        case 'MCP':
          setAgentModalState({
            open: true,
            provider: provider,
            type: 'MCP',
            editMode: false,
            connectionData: null
          });
          break;
        case 'KB':
          setAgentModalState({
            open: true,
            provider: provider,
            type: 'KB',
            editMode: false,
            connectionData: null
          });
          break;
        default:
          break;
      }
    }, []);
    var handleEditRow = (0, _react.useCallback)(function (row) {
      if (!(row !== null && row !== void 0 && row._kind)) {
        return;
      }
      if (row._kind === 'LLM') {
        var _row$_raw, _row$_raw2, _row$_raw3, _row$_raw4, _row$_raw5, _row$_raw6, _row$_raw7, _row$_raw8, _row$_raw9, _row$_raw10, _row$_raw11;
        setLlmModalState({
          open: true,
          provider: (row === null || row === void 0 ? void 0 : (_row$_raw = row._raw) === null || _row$_raw === void 0 ? void 0 : _row$_raw.provider) || (row === null || row === void 0 ? void 0 : (_row$_raw2 = row._raw) === null || _row$_raw2 === void 0 ? void 0 : _row$_raw2.Provider) || '',
          isCustom: Boolean((row === null || row === void 0 ? void 0 : (_row$_raw3 = row._raw) === null || _row$_raw3 === void 0 ? void 0 : _row$_raw3['Is Custom']) || (row === null || row === void 0 ? void 0 : (_row$_raw4 = row._raw) === null || _row$_raw4 === void 0 ? void 0 : _row$_raw4.is_custom)),
          editMode: true,
          connectionName: (row === null || row === void 0 ? void 0 : (_row$_raw5 = row._raw) === null || _row$_raw5 === void 0 ? void 0 : _row$_raw5.name) || (row === null || row === void 0 ? void 0 : (_row$_raw6 = row._raw) === null || _row$_raw6 === void 0 ? void 0 : _row$_raw6['Connection Name']) || (row === null || row === void 0 ? void 0 : (_row$_raw7 = row._raw) === null || _row$_raw7 === void 0 ? void 0 : _row$_raw7.connection_name) || (row === null || row === void 0 ? void 0 : row.name) || '',
          model: (row === null || row === void 0 ? void 0 : (_row$_raw8 = row._raw) === null || _row$_raw8 === void 0 ? void 0 : _row$_raw8.model) || (row === null || row === void 0 ? void 0 : (_row$_raw9 = row._raw) === null || _row$_raw9 === void 0 ? void 0 : _row$_raw9.Model) || '',
          description: (row === null || row === void 0 ? void 0 : (_row$_raw10 = row._raw) === null || _row$_raw10 === void 0 ? void 0 : _row$_raw10.description) || (row === null || row === void 0 ? void 0 : (_row$_raw11 = row._raw) === null || _row$_raw11 === void 0 ? void 0 : _row$_raw11.Description) || ''
        });
        return;
      }
      if (row._kind === 'CONTAINER') {
        var _row$_raw12, _row$_raw13, _row$_raw14, _row$_raw15;
        setContainerModalState({
          open: true,
          provider: (row === null || row === void 0 ? void 0 : (_row$_raw12 = row._raw) === null || _row$_raw12 === void 0 ? void 0 : _row$_raw12.connection_type) || (row === null || row === void 0 ? void 0 : (_row$_raw13 = row._raw) === null || _row$_raw13 === void 0 ? void 0 : _row$_raw13.container_type) || (row === null || row === void 0 ? void 0 : (_row$_raw14 = row._raw) === null || _row$_raw14 === void 0 ? void 0 : _row$_raw14.Provider) || '',
          editMode: true,
          connectionName: (row === null || row === void 0 ? void 0 : (_row$_raw15 = row._raw) === null || _row$_raw15 === void 0 ? void 0 : _row$_raw15.connection_name) || (row === null || row === void 0 ? void 0 : row.name) || ''
        });
        return;
      }
      if (row._kind === 'MCP' || row._kind === 'KB') {
        var _row$_raw16, _row$_raw17;
        setAgentModalState({
          open: true,
          provider: row._kind === 'MCP' ? ((row === null || row === void 0 ? void 0 : (_row$_raw16 = row._raw) === null || _row$_raw16 === void 0 ? void 0 : _row$_raw16.type) || '').toLowerCase() : ((row === null || row === void 0 ? void 0 : (_row$_raw17 = row._raw) === null || _row$_raw17 === void 0 ? void 0 : _row$_raw17.type) || '').toLowerCase().replace('_kb', ''),
          type: row._kind,
          editMode: true,
          connectionData: row
        });
      }
    }, []);
    var closeLlmModal = (0, _react.useCallback)(function () {
      setLlmModalState({
        open: false,
        provider: '',
        isCustom: false,
        editMode: false,
        connectionName: '',
        model: '',
        description: ''
      });
    }, []);
    var closeAgentModal = (0, _react.useCallback)(function () {
      setAgentModalState(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          open: false,
          provider: '',
          editMode: false,
          connectionData: null
        });
      });
    }, []);
    var closeContainerModal = (0, _react.useCallback)(function () {
      setContainerModalState({
        open: false,
        provider: '',
        editMode: false,
        connectionName: ''
      });
    }, []);
    var handleSaved = (0, _react.useCallback)(function () {
      setRefreshKey(function (prev) {
        return prev + 1;
      });
    }, []);
    var openPermissionsForConnection = (0, _react.useCallback)(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(row) {
        var _rolesResp$payload, raw, acl, perms, currentRead, currentWrite, mapApiRolesToUi, uiRead, uiWrite, displayFor, rolesResp, data, roles, aclRoles;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!((row === null || row === void 0 ? void 0 : row._kind) === 'CONTAINER')) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              _context.prev = 2;
              setPermissionsError('');
              setPermissionsLoading(true);
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
              displayFor = (acl === null || acl === void 0 ? void 0 : acl.sharing) === 'app' ? 'app' : 'owner';
              setPermissionsAgent(_objectSpread(_objectSpread({}, row), {}, {
                app: (row === null || row === void 0 ? void 0 : row.app) || (acl === null || acl === void 0 ? void 0 : acl.app) || _constants2.APP,
                owner: (row === null || row === void 0 ? void 0 : row.owner) || (acl === null || acl === void 0 ? void 0 : acl.owner) || _config.username
              }));
              setPermissionsDisplayFor(displayFor);
              setPermissionsReadRoles(uiRead);
              setPermissionsWriteRoles(uiWrite);
              _context.next = 20;
              return (0, _utils.handleApiCall)(_AgentBuilderApi.getUserRoles, ['', null], {
                errorMessage: 'Failed to fetch user roles',
                showSuccessToast: false,
                showErrorToast: false
              });
            case 20:
              rolesResp = _context.sent;
              data = (_rolesResp$payload = rolesResp === null || rolesResp === void 0 ? void 0 : rolesResp.payload) !== null && _rolesResp$payload !== void 0 ? _rolesResp$payload : rolesResp;
              roles = Array.isArray(data === null || data === void 0 ? void 0 : data.entry) ? data.entry.map(function (role) {
                return role && role.name;
              }).filter(Boolean) : [];
              aclRoles = Array.from(new Set([].concat(_toConsumableArray(uiRead.filter(function (role) {
                return role && role !== 'Everyone';
              })), _toConsumableArray(uiWrite.filter(function (role) {
                return role && role !== 'Everyone';
              })))));
              setPermissionsRoles(Array.from(new Set(['Everyone'].concat(_toConsumableArray(roles), aclRoles))));
              setPermissionsOpen(true);
              _context.next = 32;
              break;
            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](2);
              setPermissionsError((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || 'Failed to load permissions');
              setPermissionsOpen(true);
            case 32:
              _context.prev = 32;
              setPermissionsLoading(false);
              return _context.finish(32);
            case 35:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 28, 32, 35]]);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), []);
    var handleSavePermissions = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var mapUiRolesToApi, acl, raw, payload, apiFn, resp, isSuccess, _resp$payload, stanzaName, _resp, _listResponse$payload, _updateResponse$paylo, provider, connectionName, model, listResponse, listPayload, llmConfigs, existingConfig, updatePayload, updateResponse, updatePayloadResponse, updateStatus;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (permissionsAgent) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return");
          case 2:
            _context2.prev = 2;
            setPermissionsLoading(true);
            setPermissionsError('');
            mapUiRolesToApi = function mapUiRolesToApi(roles) {
              if (!Array.isArray(roles) || !roles.length) return [];
              if (roles.includes('Everyone')) return ['*'];
              return roles;
            };
            acl = {
              sharing: permissionsDisplayFor === 'app' ? 'app' : 'owner',
              app: permissionsAgent !== null && permissionsAgent !== void 0 && permissionsAgent.app && permissionsAgent.app !== '-' ? permissionsAgent.app : _constants2.APP,
              owner: (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent.owner) || _config.username,
              perms: {
                read: permissionsDisplayFor === 'app' ? mapUiRolesToApi(permissionsReadRoles) : [],
                write: permissionsDisplayFor === 'app' ? mapUiRolesToApi(permissionsWriteRoles) : []
              }
            };
            raw = (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._raw) || {};
            if (!((permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind) === 'MCP' || (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind) === 'KB')) {
              _context2.next = 20;
              break;
            }
            payload = {
              name: raw.name,
              description: raw.description || '',
              type: raw.type,
              details: raw.details || {},
              acl: acl
            };
            apiFn = (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind) === 'MCP' ? _AgentBuilderApi.updateMcpConnections : _AgentBuilderApi.updatekbConnections;
            _context2.next = 13;
            return (0, _utils.handleApiCall)(apiFn, ['', payload], {
              errorMessage: "Failed to update ".concat(permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind, " permissions"),
              showSuccessToast: false,
              showErrorToast: false
            });
          case 13:
            resp = _context2.sent;
            isSuccess = !!resp && (resp.status === 200 || typeof resp.status === 'string' && resp.status.toLowerCase() === 'success' || (resp === null || resp === void 0 ? void 0 : resp.payload) && typeof resp.payload.status === 'string' && resp.payload.status.toLowerCase() === 'success');
            if (isSuccess) {
              _context2.next = 18;
              break;
            }
            setPermissionsError((resp === null || resp === void 0 ? void 0 : (_resp$payload = resp.payload) === null || _resp$payload === void 0 ? void 0 : _resp$payload.error_message) || (resp === null || resp === void 0 ? void 0 : resp.message) || "Failed to update ".concat(permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind, " permissions"));
            return _context2.abrupt("return");
          case 18:
            _context2.next = 52;
            break;
          case 20:
            if (!((permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind) === 'CONTAINER')) {
              _context2.next = 30;
              break;
            }
            stanzaName = (raw === null || raw === void 0 ? void 0 : raw.connection_type) || (raw === null || raw === void 0 ? void 0 : raw.container_type) || (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent.name) || '';
            _context2.next = 24;
            return (0, _ConnectionManagementApi.updateContainerConnectionAcl)(stanzaName, _objectSpread(_objectSpread({}, acl), {}, {
              sharing: permissionsDisplayFor === 'app' ? 'app' : 'user'
            }));
          case 24:
            _resp = _context2.sent;
            if (_resp) {
              _context2.next = 28;
              break;
            }
            setPermissionsError('Failed to update container permissions');
            return _context2.abrupt("return");
          case 28:
            _context2.next = 52;
            break;
          case 30:
            if (!((permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent._kind) === 'LLM')) {
              _context2.next = 52;
              break;
            }
            provider = (raw === null || raw === void 0 ? void 0 : raw.provider) || (raw === null || raw === void 0 ? void 0 : raw.Provider) || '';
            connectionName = (raw === null || raw === void 0 ? void 0 : raw.name) || (raw === null || raw === void 0 ? void 0 : raw['Connection Name']) || (raw === null || raw === void 0 ? void 0 : raw.connection_name) || (permissionsAgent === null || permissionsAgent === void 0 ? void 0 : permissionsAgent.name);
            model = (raw === null || raw === void 0 ? void 0 : raw.model) || (raw === null || raw === void 0 ? void 0 : raw.Model) || '';
            _context2.next = 36;
            return (0, _ConnectionManagementApi.getLLMConfigData)('', null);
          case 36:
            listResponse = _context2.sent;
            listPayload = (_listResponse$payload = listResponse === null || listResponse === void 0 ? void 0 : listResponse.payload) !== null && _listResponse$payload !== void 0 ? _listResponse$payload : listResponse;
            llmConfigs = Array.isArray(listPayload === null || listPayload === void 0 ? void 0 : listPayload.data) ? listPayload.data : [];
            existingConfig = llmConfigs.find(function (config) {
              return (config === null || config === void 0 ? void 0 : config.name) === connectionName && (config === null || config === void 0 ? void 0 : config.provider) === provider && (config === null || config === void 0 ? void 0 : config.model) === model;
            });
            if (existingConfig) {
              _context2.next = 43;
              break;
            }
            setPermissionsError('Failed to load connection details');
            return _context2.abrupt("return");
          case 43:
            updatePayload = {
              action: 'update',
              name: existingConfig.name || connectionName,
              provider: existingConfig.provider || provider,
              model: existingConfig.model || model,
              is_custom: !!existingConfig.is_custom,
              description: existingConfig.description || '',
              connection_details: existingConfig.connection_details || {},
              default_users: Array.isArray(existingConfig.default_users) ? existingConfig.default_users : [],
              llm_params: existingConfig.llm_params || {},
              acl: acl
            };
            _context2.next = 46;
            return (0, _ConnectionManagementApi.updateLLMConnection)('', updatePayload);
          case 46:
            updateResponse = _context2.sent;
            updatePayloadResponse = (_updateResponse$paylo = updateResponse === null || updateResponse === void 0 ? void 0 : updateResponse.payload) !== null && _updateResponse$paylo !== void 0 ? _updateResponse$paylo : updateResponse;
            updateStatus = typeof (updatePayloadResponse === null || updatePayloadResponse === void 0 ? void 0 : updatePayloadResponse.status) === 'string' ? updatePayloadResponse.status.toLowerCase() : '';
            if (!((updateResponse === null || updateResponse === void 0 ? void 0 : updateResponse.status) !== 200 && updateStatus !== 'success')) {
              _context2.next = 52;
              break;
            }
            setPermissionsError((updatePayloadResponse === null || updatePayloadResponse === void 0 ? void 0 : updatePayloadResponse.message) || 'Failed to update connection permissions');
            return _context2.abrupt("return");
          case 52:
            (0, _ToastUtil.triggerToast)((0, _i18n.gettext)('Permissions updated successfully'), _ToastConstants.TOAST_TYPES.SUCCESS, (0, _i18n.gettext)('Success'));
            setPermissionsOpen(false);
            setRefreshKey(function (prev) {
              return prev + 1;
            });
            _context2.next = 60;
            break;
          case 57:
            _context2.prev = 57;
            _context2.t0 = _context2["catch"](2);
            setPermissionsError((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || 'Failed to update permissions');
          case 60:
            _context2.prev = 60;
            setPermissionsLoading(false);
            return _context2.finish(60);
          case 63:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[2, 57, 60, 63]]);
    })), [permissionsAgent, permissionsDisplayFor, permissionsReadRoles, permissionsWriteRoles]);
    var closePermissionsModal = (0, _react.useCallback)(function (_ref3) {
      var reason = _ref3.reason;
      if (reason === 'clickAway') {
        return;
      }
      setPermissionsOpen(false);
    }, []);
    var paginationContent = (0, _react.useMemo)(function () {
      return {
        count: paginationInfo.count,
        pageNum: paginationInfo.pageNum,
        totalPages: paginationInfo.totalPages,
        setPageNum: paginationInfo.setPageNum
      };
    }, [paginationInfo]);

    // Check user permissions on mount
    (0, _react.useEffect)(function () {
      var isValidUser = /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var response, _response$entry, _response$entry$, _response$entry$$cont, capabilities, has, canLLMList, canLLMEdit, CAP_LIST_CONTAINER_CONNECTIONS, CAP_SETUP_CONTAINER_CONFIGURATION, canDSDLList, canDSDLEdit, permissionState;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _utils.handleApiCall)(_ConnectionManagementApi.fetchCapabilities, [], {
                  errorMessage: 'Failed to fetch user capabilities',
                  showErrorToast: false
                });
              case 2:
                response = _context3.sent;
                if (response) {
                  capabilities = (response === null || response === void 0 ? void 0 : (_response$entry = response.entry) === null || _response$entry === void 0 ? void 0 : (_response$entry$ = _response$entry[0]) === null || _response$entry$ === void 0 ? void 0 : (_response$entry$$cont = _response$entry$.content) === null || _response$entry$$cont === void 0 ? void 0 : _response$entry$$cont.capabilities) || [];
                  has = function has(cap) {
                    return capabilities.includes(cap);
                  };
                  canLLMList = has(_constants.LIST_CONFIG);
                  canLLMEdit = has(_constants.EDIT_CONFIG);
                  CAP_LIST_CONTAINER_CONNECTIONS = 'list_container_connections';
                  CAP_SETUP_CONTAINER_CONFIGURATION = 'setup_container_configuration';
                  canDSDLList = has(CAP_LIST_CONTAINER_CONNECTIONS);
                  canDSDLEdit = has(CAP_SETUP_CONTAINER_CONFIGURATION);
                  permissionState = {
                    showLLM: !!canLLMList,
                    showDSDL: !!canDSDLList,
                    actionsLLM: !!(canLLMList && canLLMEdit),
                    actionsDSDL: !!(canDSDLList && canDSDLEdit)
                  };
                  setHasPermission(permissionState);
                }
              case 4:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        return function isValidUser() {
          return _ref4.apply(this, arguments);
        };
      }();
      isValidUser();
    }, []);
    return {
      // State
      hasPermission: hasPermission,
      searchTerm: searchTerm,
      ownerFilter: ownerFilter,
      ownerOptions: ownerOptions,
      paginationContent: paginationContent,
      refreshKey: refreshKey,
      llmModalState: llmModalState,
      agentModalState: agentModalState,
      containerModalState: containerModalState,
      permissionsOpen: permissionsOpen,
      permissionsAgent: permissionsAgent,
      permissionsRoles: permissionsRoles,
      permissionsDisplayFor: permissionsDisplayFor,
      permissionsReadRoles: permissionsReadRoles,
      permissionsWriteRoles: permissionsWriteRoles,
      permissionsError: permissionsError,
      permissionsLoading: permissionsLoading,
      // Setters
      setSearchTerm: setSearchTerm,
      setOwnerFilter: setOwnerFilter,
      setOwnerOptions: setOwnerOptions,
      setPaginationInfo: setPaginationInfo,
      setPermissionsDisplayFor: setPermissionsDisplayFor,
      setPermissionsReadRoles: setPermissionsReadRoles,
      setPermissionsWriteRoles: setPermissionsWriteRoles,
      // Handlers
      handleAddType: handleAddType,
      handleEditRow: handleEditRow,
      handleSaved: handleSaved,
      closeLlmModal: closeLlmModal,
      closeAgentModal: closeAgentModal,
      closeContainerModal: closeContainerModal,
      openPermissionsForConnection: openPermissionsForConnection,
      handleSavePermissions: handleSavePermissions,
      closePermissionsModal: closePermissionsModal
    };
  };
  var _default = _exports.default = useConnectionsPageState;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Connections.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), __webpack_require__("./src/main/webapp/routers/Base.es"), __webpack_require__("connections/ConnectionsView")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _i18n, _Base, _ConnectionsView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Base = _interopRequireDefault(_Base);
  _ConnectionsView = _interopRequireDefault(_ConnectionsView);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var ConnectionsRouter = _Base.default.extend({
    initialize: function initialize() {
      _Base.default.prototype.initialize.apply(this, arguments);
      this.setPageTitle((0, _i18n.gettext)('Connections'));
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
      this.showcaseView = new _ConnectionsView.default({
        model: {
          classicurl: this.model.classicurl
        },
        deferreds: {
          layout: this.deferreds.layout
        }
      });
    }
  });
  var _default = _exports.default = ConnectionsRouter;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "connections/ConnectionsView":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/react-hot-loader/root.js"), __webpack_require__("./node_modules/react/index.js"), __webpack_require__("./node_modules/react-dom/index.js"), __webpack_require__("shared/BaseDashboard"), __webpack_require__("./src/main/webapp/components/connections/ConnectionsPage.jsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _root, _react, _reactDom, _BaseDashboard, _ConnectionsPage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireDefault(_react);
  _reactDom = _interopRequireDefault(_reactDom);
  _BaseDashboard = _interopRequireDefault(_BaseDashboard);
  _ConnectionsPage = _interopRequireDefault(_ConnectionsPage);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * This is the backbone page that renders the React component tree for the Showcase page
   */

  var Page = (0, _root.hot)(_ConnectionsPage.default);
  var ConnectionsView = _BaseDashboard.default.extend({
    render: function render() {
      _reactDom.default.render(_react.default.createElement(Page), this.el);
    }
  });
  var _default = _exports.default = ConnectionsView;
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/connections.es","pages_common"]]]);