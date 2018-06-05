'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var generateDbName = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(dbName) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', dbName || (0, _v2.default)());

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function generateDbName(_x) {
    return _ref.apply(this, arguments);
  };
}();

var generateConnectionString = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(port, dbName) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', `mongodb://localhost:${port}/${dbName}`);

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function generateConnectionString(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _getPort = require('get-port');

var _getPort2 = _interopRequireDefault(_getPort);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _MongoInstance = require('./util/MongoInstance');

var _MongoInstance2 = _interopRequireDefault(_MongoInstance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_tmp2.default.setGracefulCleanup();

var MongoMemoryServer = function () {
  function MongoMemoryServer() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MongoMemoryServer);

    this.isRunning = false;

    this.opts = opts;
    if (!this.opts.instance) this.opts.instance = {};
    if (!this.opts.binary) this.opts.binary = {};

    this.debug = function (msg) {
      if (_this.opts.debug) {
        console.log(msg);
      }
    };

    // autoStart by default
    if (!opts.hasOwnProperty('autoStart') || opts.autoStart) {
      this.debug('Autostarting MongoDB instance...');
      this.start();
    }
  }

  _createClass(MongoMemoryServer, [{
    key: 'start',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.runningInstance) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('MongoDB instance already in status startup/running/error. Use opts.debug = true for more info.');

              case 2:

                this.runningInstance = this._startUpInstance().catch(function (err) {
                  if (err.message === 'Mongod shutting down' || err === 'Mongod shutting down') {
                    _this2.debug(`Mongodb does not started. Trying to start on another port one more time...`);
                    _this2.opts.instance.port = null;
                    return _this2._startUpInstance();
                  }
                  throw err;
                }).catch(function (err) {
                  if (!_this2.opts.debug) {
                    throw new Error(`${err.message}\n\nUse debug option for more info: ` + `new MongoMemoryServer({ debug: true })`);
                  }
                  throw err;
                });

                return _context3.abrupt('return', this.runningInstance.then(function () {
                  return true;
                }));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function start() {
        return _ref3.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: '_startUpInstance',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var data, tmpDir, instOpts, instance;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = {};
                tmpDir = void 0;
                instOpts = this.opts.instance;
                _context4.next = 5;
                return (0, _getPort2.default)(instOpts.port);

              case 5:
                data.port = _context4.sent;

                this.debug = (0, _debug2.default)(`Mongo[${data.port}]`);
                this.debug.enabled = !!this.opts.debug;
                _context4.next = 10;
                return generateDbName(instOpts.dbName);

              case 10:
                data.dbName = _context4.sent;
                _context4.next = 13;
                return generateConnectionString(data.port, data.dbName);

              case 13:
                data.uri = _context4.sent;

                data.storageEngine = instOpts.storageEngine || 'ephemeralForTest';
                if (instOpts.dbPath) {
                  data.dbPath = instOpts.dbPath;
                } else {
                  tmpDir = _tmp2.default.dirSync({ prefix: 'mongo-mem-', unsafeCleanup: true });
                  data.dbPath = tmpDir.name;
                }

                this.debug(`Starting MongoDB instance with following options: ${JSON.stringify(data)}`);

                // Download if not exists mongo binaries in ~/.mongodb-prebuilt
                // After that startup MongoDB instance
                _context4.next = 19;
                return _MongoInstance2.default.run({
                  instance: {
                    port: data.port,
                    storageEngine: data.storageEngine,
                    dbPath: data.dbPath,
                    debug: this.opts.instance.debug
                  },
                  binary: this.opts.binary,
                  spawn: this.opts.spawn,
                  debug: this.debug
                });

              case 19:
                instance = _context4.sent;

                data.instance = instance;
                data.childProcess = instance.childProcess;
                data.tmpDir = tmpDir;

                return _context4.abrupt('return', data);

              case 24:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _startUpInstance() {
        return _ref4.apply(this, arguments);
      }

      return _startUpInstance;
    }()
  }, {
    key: 'stop',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var _ref6, instance, port, tmpDir;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getInstanceData();

              case 2:
                _ref6 = _context5.sent;
                instance = _ref6.instance;
                port = _ref6.port;
                tmpDir = _ref6.tmpDir;


                this.debug(`Shutdown MongoDB server on port ${port} with pid ${instance.getPid() || ''}`);
                _context5.next = 9;
                return instance.kill();

              case 9:

                if (tmpDir) {
                  this.debug(`Removing tmpDir ${tmpDir.name}`);
                  tmpDir.removeCallback();
                }

                this.runningInstance = null;
                return _context5.abrupt('return', true);

              case 12:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function stop() {
        return _ref5.apply(this, arguments);
      }

      return stop;
    }()
  }, {
    key: 'getInstanceData',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this.runningInstance) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt('return', this.runningInstance);

              case 2:
                throw new Error('Database instance is not running. You should start database by calling start() method. BTW it should start automatically if opts.autoStart!=false. Also you may provide opts.debug=true for more info.');

              case 3:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getInstanceData() {
        return _ref7.apply(this, arguments);
      }

      return getInstanceData;
    }()
  }, {
    key: 'getUri',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var otherDbName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var _ref9, uri, port;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.getInstanceData();

              case 2:
                _ref9 = _context7.sent;
                uri = _ref9.uri;
                port = _ref9.port;

                if (!otherDbName) {
                  _context7.next = 14;
                  break;
                }

                if (!(typeof otherDbName === 'string')) {
                  _context7.next = 8;
                  break;
                }

                return _context7.abrupt('return', generateConnectionString(port, otherDbName));

              case 8:
                _context7.t0 = generateConnectionString;
                _context7.t1 = port;
                _context7.next = 12;
                return generateDbName();

              case 12:
                _context7.t2 = _context7.sent;
                return _context7.abrupt('return', (0, _context7.t0)(_context7.t1, _context7.t2));

              case 14:
                return _context7.abrupt('return', uri);

              case 15:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getUri() {
        return _ref8.apply(this, arguments);
      }

      return getUri;
    }()
  }, {
    key: 'getConnectionString',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var otherDbName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt('return', this.getUri(otherDbName));

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getConnectionString() {
        return _ref10.apply(this, arguments);
      }

      return getConnectionString;
    }()
  }, {
    key: 'getPort',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
        var _ref12, port;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.getInstanceData();

              case 2:
                _ref12 = _context9.sent;
                port = _ref12.port;
                return _context9.abrupt('return', port);

              case 5:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getPort() {
        return _ref11.apply(this, arguments);
      }

      return getPort;
    }()
  }, {
    key: 'getDbPath',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        var _ref14, dbPath;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.getInstanceData();

              case 2:
                _ref14 = _context10.sent;
                dbPath = _ref14.dbPath;
                return _context10.abrupt('return', dbPath);

              case 5:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getDbPath() {
        return _ref13.apply(this, arguments);
      }

      return getDbPath;
    }()
  }, {
    key: 'getDbName',
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
        var _ref16, dbName;

        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.getInstanceData();

              case 2:
                _ref16 = _context11.sent;
                dbName = _ref16.dbName;
                return _context11.abrupt('return', dbName);

              case 5:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getDbName() {
        return _ref15.apply(this, arguments);
      }

      return getDbName;
    }()
  }]);

  return MongoMemoryServer;
}();

exports.default = MongoMemoryServer;