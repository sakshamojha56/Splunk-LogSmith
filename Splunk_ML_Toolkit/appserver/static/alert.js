(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["alert"],{

/***/ "./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/alert.es":
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./src/main/webapp/routers/Alert.es"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_Alert, _swcMltk) {
  "use strict";

  _Alert = _interopRequireDefault(_Alert);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  new _Alert.default();
  _swcMltk.routerUtils.start_backbone_history();
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/main/webapp/routers/Alert.es":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./src/main/webapp/models/Alert.es"), __webpack_require__("./src/main/webapp/util/loadLayout.es"), __webpack_require__("alert/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFind, _esObjectToString, _swcMltk, _Alert, _loadLayout, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _Alert = _interopRequireDefault(_Alert);
  _loadLayout = _interopRequireDefault(_loadLayout);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertRouter.extend({
    initialize: function initialize() {
      var _this = this;
      _swcMltk.BaseRouter.prototype.initialize.apply(this, arguments);
      this.fetchUser = true;
      this.fetchAppLocals = true;

      // CHANGED: use MLTK Alert Model instead
      this.alertModel = new _Alert.default();
      this.stateModel = new _swcMltk.BaseModel();

      // collections
      this.rolesCollection = new _swcMltk.RolesCollection();
      this.alertsAdminCollection = new _swcMltk.AdminAlertsCollection();
      this.alertActionsCollection = new _swcMltk.ModAlertActionsCollection();
      // Set defaults for pagination
      this.alertsAdminCollection.fetchData.set({
        count: 20,
        offset: 0
      }, {
        silent: true
      });
      this.alertModel.entry.content.on('change:disabled', this.fetchAlertAdminCollection, this);

      // data init
      this.deferredRoles = this.rolesCollection.fetch();

      // refetch every minute (60000 milliseconds) if enabled
      setInterval(function () {
        if (!_this.alertModel.entry.content.get('disabled')) {
          _this.fetchAlertAdminCollection();
        }
      }, 60000);
      this.deferreds.layout = _swcMltk.jquery.Deferred();
      (0, _loadLayout.default)(function (layout) {
        _this.deferreds.layout.resolve(layout.create());
      });
    },
    initializeAndRenderAlertView: function initializeAndRenderAlertView() {
      var _this2 = this;
      var alertConfig = this.collection.alertConfigsCollection.find(function (model) {
        return model.entry.get('name') === _this2.alertModel.entry.get('name');
      });
      if (this.model.serverInfo.isLite() && alertConfig && !_swcMltk.generalUtils.normalizeBoolean(alertConfig.entry.content.get('enabled_for_light'))) {
        window.location.href = _swcMltk.urlHelper.pageUrl('error');
      } else {
        // this is a fix for MLA-2149; this differs from the /alert page because the core page doesn't have a deferred here
        _swcMltk.jquery.when(this.deferreds.layout).then(function (layout) {
          _this2.alertView = new _Master.default({
            model: {
              state: _this2.stateModel,
              savedAlert: _this2.alertModel,
              application: _this2.model.application,
              appLocal: _this2.model.appLocal,
              user: _this2.model.user,
              serverInfo: _this2.model.serverInfo
            },
            collection: {
              roles: _this2.rolesCollection,
              alertsAdmin: _this2.alertsAdminCollection,
              alertActions: _this2.alertActionsCollection,
              appLocals: _this2.collection.appLocals
            }
          });
          layout.getContainerElement().appendChild(_this2.alertView.render().el);

          // eslint-disable-next-line
          switch (_swcMltk.ClassicUrlModel.get('dialog')) {
            case 'permissions':
              if (_this2.alertModel.entry.acl.get('can_change_perms')) {
                _this2.showPermissionsDialog();
              }
              break;
            case 'type':
              _this2.showEditAlertDialog('type');
              break;
            case 'actions':
              _this2.showEditAlertDialog('actions');
              break;
          }
        });
      }
    },
    page: function page() {
      this.deferreds.layout.done(function () {
        if (this.removeLoadingEl) {
          this.removeLoadingEl();
        }
        this.removeLoadingEl = null;
      }.bind(this));
    }
  });
  module.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "alert/Header":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("experimentAlerts/alertcontrols/details/Master")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module, _Master) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _Master = _interopRequireDefault(_Master);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertHeaderView.extend({
    moduleId: _module.default.id,
    initialize: function initialize() {
      _swcMltk.AlertHeaderView.prototype.initialize.apply(this, arguments);
      this.children.detailsView = new _Master.default({
        model: {
          savedAlert: this.model.savedAlert,
          application: this.model.application,
          appLocal: this.model.appLocal,
          user: this.model.user,
          serverInfo: this.model.serverInfo
        },
        collection: {
          roles: this.collection.roles,
          alertActions: this.collection.alertActions
        },
        twoColumn: true,
        displayApp: true
      });
      this.activate();
    },
    render: function render() {
      var normalName = this.model.savedAlert.entry.get('name');
      var title = this.model.savedAlert.entry.content.get('args.mltk.experiment.title');
      var name = title || normalName;
      this.$el.html(this.compiledTemplate({
        name: name,
        description: this.model.savedAlert.entry.content.get('description')
      }));
      this.children.detailsView.render().appendTo(this.$el);
      return this;
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "alert/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("experimentAlerts/alertcontrols/EditMenu"), __webpack_require__("alert/Header")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _module, _EditMenu, _Header) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _EditMenu = _interopRequireDefault(_EditMenu);
  _Header = _interopRequireDefault(_Header);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertView.extend({
    moduleId: _module.default.id,
    initialize: function initialize(options) {
      // the following line came fromSWC
      // eslint-disable-next-line
      options.dontAddModuleIdAsClass = true;
      _swcMltk.BaseView.prototype.initialize.call(this, options);
      this.errorTypes = [_swcMltk.splunkDUtils.FATAL, _swcMltk.splunkDUtils.ERROR, _swcMltk.splunkDUtils.NOT_FOUND];
      this.isError = _swcMltk.splunkDUtils.messagesContainsOneOfTypes(this.model.savedAlert.error.get('messages'), this.errorTypes);
      this.children.flashMessageView = new _swcMltk.FlashMessagesView({
        model: {
          savedAlert: this.model.savedAlert
        },
        whitelist: this.errorTypes
      });
      if (!this.isError) {
        // views
        this.children.editmenu = new _EditMenu.default({
          model: {
            savedAlert: this.model.savedAlert,
            application: this.model.application,
            appLocal: this.model.appLocal,
            user: this.model.user,
            serverInfo: this.model.serverInfo
          },
          collection: {
            roles: this.collection.roles,
            alertActions: this.collection.alertActions,
            appLocals: this.collection.appLocals
          },
          buttonpill: false,
          deleteRedirect: true
        });
        this.children.headerView = new _Header.default({
          model: {
            savedAlert: this.model.savedAlert,
            application: this.model.application,
            appLocal: this.model.appLocal,
            user: this.model.user,
            serverInfo: this.model.serverInfo
          },
          collection: {
            roles: this.collection.roles,
            alertActions: this.collection.alertActions
          }
        });
        this.children.historyView = new _swcMltk.AlertHistoryView({
          model: {
            savedAlert: this.model.savedAlert,
            application: this.model.application
          },
          collection: {
            roles: this.collection.roles,
            alertsAdmin: this.collection.alertsAdmin
          }
        });
        this.children.noFiredAlertsView = new _swcMltk.NoFiredAlertsView();
        this.children.disabledView = new _swcMltk.DisabledAlertView();
        this.activate();
      }
    },
    startListening: function startListening() {
      this.listenTo(this.collection.alertsAdmin, 'add remove reset', _swcMltk.underscore.debounce(this.visibility));
      this.listenTo(this.model.savedAlert.entry.content, 'change:disabled', this.visibility);
    }
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experimentAlerts/alertcontrols/EditMenu":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/core-js/modules/es.array.find.js"), __webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"), __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), module, __webpack_require__("experimentAlerts/alertcontrols/dialogs/Delete"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/Edit"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/EnableDisable")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _esArrayFind, _esObjectToString, _swcMltk, _module, _Delete, _Edit, _EnableDisable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _Delete = _interopRequireDefault(_Delete);
  _Edit = _interopRequireDefault(_Edit);
  _EnableDisable = _interopRequireDefault(_EnableDisable);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  /**
   * A forked version of the Alert Edit menu used to render forked versions of alert dialogs to take Experiment attributes into account
   */
  // Adding in the experiment to the enable disable dialog so that it can use the experiment id
  // to filter the list of potentially enabled alerts.
  var _default = _exports.default = _swcMltk.AlertControlsEditMenuView.extend({
    moduleId: _module.default.id,
    events: _swcMltk.underscore.extend(_swcMltk.AlertControlsEditMenuView.prototype.events, {
      'click a.edit-alert': function click_aEditAlert(e) {
        this.children.editAlertDialog = new _Edit.default({
          model: {
            alert: this.model.savedAlert,
            application: this.model.application,
            user: this.model.user,
            serverInfo: this.model.serverInfo,
            controller: this.model.controller
          },
          collection: {
            alertActions: this.collection.alertActions,
            searchBNFs: this.collection.searchBNFs
          },
          onHiddenRemove: true,
          showSearchField: this.options.showSearchField
        });
        this.children.editAlertDialog.render().appendTo((0, _swcMltk.jquery)('body'));
        this.children.editAlertDialog.show();
        e.preventDefault();
      },
      'click a.enable-disable': function click_aEnableDisable(e) {
        this.children.enableDisableDialog = new _EnableDisable.default({
          model: {
            savedAlert: this.model.savedAlert,
            application: this.model.application,
            experiment: this.model.experiment
          },
          onHiddenRemove: true
        });
        this.children.enableDisableDialog.render().appendTo((0, _swcMltk.jquery)('body'));
        this.children.enableDisableDialog.show();
        e.preventDefault();
      },
      'click a.delete': function click_aDelete(e) {
        this.children.deleteDialog = new _Delete.default({
          model: {
            report: this.model.savedAlert,
            application: this.model.application,
            controller: this.model.experiment,
            experiment: this.model.experiment
          },
          deleteRedirect: this.options.deleteRedirect,
          onHiddenRemove: true
        });
        this.children.deleteDialog.render().appendTo((0, _swcMltk.jquery)('body'));
        this.children.deleteDialog.show();
        e.preventDefault();
      }
    }),
    render: function render() {
      _swcMltk.AlertControlsEditMenuView.prototype.render.apply(this, arguments);
      // Remove clone
      this.$el.find('li:has(a.clone)').remove();
      return this;
    },
    // Template is added to remove "Edit Permissions" from the edit menu.
    template: "\n        <% if (gear) { %>\n            <a class=\"dropdown-toggle <%- button ? \"btn\" : \"\" %>\" href=\"#\"><i class=\"icon-large icon-gear\"></i> <span class=\"caret\"></span></a>\n        <% } else { %>\n            <a class=\"dropdown-toggle <%- button ? \"btn\" : \"\" %>\" href=\"#\"><%- _(\"Edit\").t() %><span class=\"caret\"></span></a>\n        <% } %>\n        <div class=\"dropdown-menu dropdown-menu-narrow\">\n            <div class=\"arrow\"></div>\n            <ul class=\"open_actions\">\n                <li><a href=\"<%= searchLink %>\"><%- _(\"Open in Search\").t() %></a></li>\n            </ul>\n            <ul class=\"second-group\">\n                <li><a class=\"edit-alert\" href=\"#\"><%- _(\"Edit Alert\").t() %></a></li>\n                <li><a class=\"enable-disable\" href=\"#\"><%= enableDiable %></a></li>\n                <% if (canAdvancedEdit) { %>\n                    <li><a class=\"advanced-edit\" href=\"#\"><%- _(\"Advanced Edit\").t() %> <i class=\"icon-external\"></i></a></li>\n                <% } %>\n            </ul>\n            <ul class=\"third-group\">\n            </ul>\n        </div>\n    "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "experimentAlerts/alertcontrols/details/Master":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("./node_modules/@splunk/swc-mltk/dist/index.js"), __webpack_require__("./node_modules/@splunk/ui-utils/i18n.js"), module, __webpack_require__("experimentAlerts/alertcontrols/dialogs/Edit"), __webpack_require__("experimentAlerts/alertcontrols/dialogs/EnableDisable")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _swcMltk, _i18n, _module, _Edit, _EnableDisable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _module = _interopRequireDefault(_module);
  _Edit = _interopRequireDefault(_Edit);
  _EnableDisable = _interopRequireDefault(_EnableDisable);
  function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
  var _default = _exports.default = _swcMltk.AlertControlsDetailsView.extend({
    moduleId: _module.default.id,
    render: function render() {
      var isDisabled = this.model.savedAlert.entry.content.get('disabled');
      var managedBy = this.model.savedAlert.entry.content.get('alert.managedBy');

      // If experiments are present, we do not want to show permissions.
      var showPermissions = !this.model.savedAlert.entry.content.get('args.mltk.experiment');
      this.$el.html(_swcMltk.underscore.template(this.options.twoColumn ? this.template2Col : this.template, {
        underscore: _swcMltk.underscore,
        enableDisable: isDisabled ? (0, _i18n.gettext)('Enable') : (0, _i18n.gettext)('Disable'),
        enableDisableText: isDisabled ? (0, _i18n.gettext)('No. ') : (0, _i18n.gettext)('Yes. '),
        displayApp: this.options.displayApp && this.model.user.canUseApps(),
        managedBy: managedBy ? (0, _swcMltk.underscore)(managedBy).t() : undefined,
        showPermissions: showPermissions
      }));
      this.children.typeTextView.render().prependTo(this.$('dd.alert-type'));
      this.children.triggerTextView.render().prependTo(this.$('dd.alert-trigger'));
      this.children.actionsTextView.render().prependTo(this.$('dd.alert-actions'));
      this.children.appText.render().prependTo(this.$('dd.app'));
      this.children.permissionsTextView.render().prependTo(this.$('dd.permissions'));
      this.children.modifiedView.render().prependTo(this.$('dd.modified'));
      if (!this.model.savedAlert.canWrite(this.model.user.canScheduleSearch(), this.model.user.canRTSearch())) {
        this.$('a.edit-link').remove();
      } else if (!this.model.savedAlert.entry.acl.get('can_change_perms')) {
        this.$('a.edit-permissions').remove();
      }
      return this;
    },
    openEditAlertDialog: function openEditAlertDialog(position) {
      // CHANGED: using MLTK's EditDialog to render experiment attributes correctly
      this.children.editAlertDialog = new _Edit.default({
        model: {
          alert: this.model.savedAlert,
          application: this.model.application,
          user: this.model.user,
          serverInfo: this.model.serverInfo
        },
        collection: {
          alertActions: this.collection.alertActions
        },
        onHiddenRemove: true
      });
      this.listenTo(this.children.editAlertDialog, 'shown', function () {
        this.children.editAlertDialog.scrollTo(position);
      });
      this.children.editAlertDialog.render().appendTo((0, _swcMltk.jquery)('body'));
      this.children.editAlertDialog.show();
    },
    events: _swcMltk.underscore.extend(_swcMltk.AlertControlsDetailsView.prototype.events, {
      'click a.enable-disable': function click_aEnableDisable(e) {
        // when this is loaded on a page without an experiment model, use the default dialog
        if (this.model.experiment) {
          this.children.enableDisableDialog = new _EnableDisable.default({
            model: {
              savedAlert: this.model.savedAlert,
              application: this.model.application,
              experiment: this.model.experiment
            },
            onHiddenRemove: true
          });
        } else {
          this.children.enableDisableDialog = new _swcMltk.AlertControlsEnableDisableDialogView({
            model: {
              savedAlert: this.model.savedAlert,
              application: this.model.application
            },
            onHiddenRemove: true
          });
        }
        this.children.enableDisableDialog.render().appendTo((0, _swcMltk.jquery)('body'));
        this.children.enableDisableDialog.show();
        e.preventDefault();
      }
    }),
    template: "\n        <dl class=\"list-dotted\">\n        <dt><%- _(\"Enabled\").t() %>:</dt>\n        <dd><%= enableDisableText %><a href=\"#\" class=\"enable-disable edit-link\"><%= enableDisable %></a></dd>\n        <% if(displayApp) { %>\n            <dt><%- _(\"App\").t() %>:</dt>\n            <dd class=\"app\"></dd>\n        <% } %>\n        <% if(showPermissions) { %>\n            <dt><%- _(\"Permissions\").t() %>:</dt>\n            <dd class=\"permissions\"><a href=\"#\" class=\"edit-permissions edit-link\"><%- _(\"Edit\").t() %></a></dd>\n        <% } %>\n        <dt><%- _(\"Modified\").t() %>:</dt>\n        <dd class=\"modified\"></dd>\n        <dt><%- _(\"Alert Type\").t() %>:</dt>\n        <dd class=\"alert-type\"> <a href=\"#\" class=\"edit-alert-type edit-link\"><%- _(\"Edit\").t() %></a></dd>\n        <dt><%- _(\"Trigger Condition\").t() %>:</dt>\n        <dd class=\"alert-trigger\"> <a href=\"#\" class=\"edit-alert-trigger edit-link\"><%- _(\"Edit\").t() %></a></dd>\n        <dt><%- _(\"Actions\").t() %>:</dt>\n        <dd class=\"alert-actions\"> <a href=\"#\" class=\"edit-alert-actions edit-link\"><%- _(\"Edit\").t() %></a></dd>\n        <% if(!!managedBy) { %>\n            <dt><%- _(\"Managed by\").t() %>:</dt>\n            <dd> <%- managedBy %></dd>\n        <% } %>\n        </dl>\n        </td>\n    ",
    template2Col: "\n        <dl class=\"list-dotted\">\n            <dt><%- _(\"Enabled\").t() %>:</dt>\n            <dd><%= enableDisableText %><a href=\"#\" class=\"enable-disable edit-link\"><%= enableDisable %></a></dd>\n            <% if(displayApp) { %>\n                <dt><%- _(\"App\").t() %>:</dt>\n                <dd class=\"app\"></dd>\n            <% } %>\n            <% if(showPermissions) { %>\n                <dt><%- _(\"Permissions\").t() %>:</dt>\n                <dd class=\"permissions\"><a href=\"#\" class=\"edit-permissions edit-link\"><%- _(\"Edit\").t() %></a></dd>\n            <% } %>\n            <dt><%- _(\"Modified\").t() %>:</dt>\n            <dd class=\"modified\"></dd>\n            <dt><%- _(\"Alert Type\").t() %>:</dt>\n            <dd class=\"alert-type\"> <a href=\"#\" class=\"edit-alert-type edit-link\"><%- _(\"Edit\").t() %></a></dd>\n        </dl>\n        <dl class=\"list-dotted\">\n            <dt><%- _(\"Trigger Condition\").t() %>:</dt>\n            <dd class=\"alert-trigger\"> <a href=\"#\" class=\"edit-alert-trigger edit-link\"><%- _(\"Edit\").t() %></a></dd>\n            <dt><%- _(\"Actions\").t() %>:</dt>\n            <dd class=\"alert-actions\"> <a href=\"#\" class=\"edit-alert-actions edit-link\"><%- _(\"Edit\").t() %></a></dd>\n            <% if(!!managedBy) { %>\n                <dt><%- _(\"Managed by\").t() %>:</dt>\n                <dd> <%- managedBy %></dd>\n            <% } %>\n        </dl>\n    "
  });
  _module.default.exports = exports["default"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/@splunk/swc-mltk/node_modules/webpack/buildin/module.js")(module)))

/***/ })

},[["./node_modules/@splunk/swc-mltk/dist/build_tools/web_loaders/splunk-public-path-injection-loader.js?/static/app/Splunk_ML_Toolkit/!./src/main/webapp/pages/alert.es","pages_common"]]]);