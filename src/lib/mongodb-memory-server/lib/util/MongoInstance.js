'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/* eslint-disable class-methods-use-this */

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _MongoBinary = require('./MongoBinary');

var _MongoBinary2 = _interopRequireDefault(_MongoBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongodbInstance = function () {
  _createClass(MongodbInstance, null, [{
    key: 'run',
    value: function run(opts) {
      var instance = new this(opts);
      return instance.run();
    }
  }]);

  function MongodbInstance(opts) {
    _classCallCheck(this, MongodbInstance);

    this.opts = opts;

    if (this.opts.debug) {
      if (!this.opts.instance) this.opts.instance = {};
      if (!this.opts.binary) this.opts.binary = {};
      this.opts.instance.debug = this.opts.debug;
      this.opts.binary.debug = this.opts.debug;
    }

    if (this.opts.instance && this.opts.instance.debug) {
      if (this.opts.instance.debug.call && typeof this.opts.instance.debug === 'function' && this.opts.instance.debug.apply) {
        this.debug = this.opts.instance.debug;
      } else {
        this.debug = console.log.bind(null);
      }
    } else {
      this.debug = function () {};
    }
  }

  _createClass(MongodbInstance, [{
    key: 'prepareCommandArgs',
    value: function prepareCommandArgs() {
      var _opts$instance = this.opts.instance,
          port = _opts$instance.port,
          storageEngine = _opts$instance.storageEngine,
          dbPath = _opts$instance.dbPath;


      var result = [];
      if (port) result.push('--port', port.toString());
      if (storageEngine) result.push('--storageEngine', storageEngine);
      if (dbPath) result.push('--dbpath', dbPath);
      result.push('--noauth');

      return result;
    }
  }, {
    key: 'run',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _this = this;

        var launch, mongoBin;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                launch = new Promise(function (resolve, reject) {
                  _this.instanceReady = function () {
                    _this.debug('MongodbInstance: is ready!');
                    resolve(_this.childProcess);
                  };
                  _this.instanceFailed = function (err) {
                    _this.debug(`MongodbInstance: is failed: ${err.toString()}`);
                    if (_this.killerProcess) _this.killerProcess.kill();
                    reject(err);
                  };
                });
                _context.next = 3;
                return _MongoBinary2.default.getPath(this.opts.binary);

              case 3:
                mongoBin = _context.sent;

                this.childProcess = this._launchMongod(mongoBin);
                this.killerProcess = this._launchKiller(process.pid, this.childProcess.pid);

                _context.next = 8;
                return launch;

              case 8:
                return _context.abrupt('return', this);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run() {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'kill',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.childProcess && !this.childProcess.killed)) {
                  _context2.next = 3;
                  break;
                }

                _context2.next = 3;
                return new Promise(function (resolve) {
                  _this2.childProcess.once(`exit`, resolve);
                  _this2.childProcess.kill();
                });

              case 3:
                return _context2.abrupt('return', this);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function kill() {
        return _ref2.apply(this, arguments);
      }

      return kill;
    }()
  }, {
    key: 'getPid',
    value: function getPid() {
      return this.childProcess ? this.childProcess.pid : undefined;
    }
  }, {
    key: '_launchMongod',
    value: function _launchMongod(mongoBin) {
      var spawnOpts = this.opts.spawn || {};
      if (!spawnOpts.stdio) spawnOpts.stdio = 'pipe';
      var childProcess = (0, _child_process.spawn)(mongoBin, this.prepareCommandArgs(), spawnOpts);
      childProcess.stderr.on('data', this.stderrHandler.bind(this));
      childProcess.stdout.on('data', this.stdoutHandler.bind(this));
      childProcess.on('close', this.closeHandler.bind(this));
      childProcess.on('error', this.errorHandler.bind(this));

      return childProcess;
    }
  }, {
    key: '_launchKiller',
    value: function _launchKiller(parentPid, childPid) {
      // spawn process which kills itself and mongo process if current process is dead
      var killer = (0, _child_process.spawn)(process.argv[0], [_path2.default.resolve(__dirname, 'mongo_killer.js'), parentPid.toString(), childPid.toString()], { stdio: 'pipe' });

      return killer;
    }
  }, {
    key: 'errorHandler',
    value: function errorHandler(err) {
      this.instanceFailed(err);
    }
  }, {
    key: 'closeHandler',
    value: function closeHandler(code) {
      this.debug(`CLOSE: ${code}`);
    }
  }, {
    key: 'stderrHandler',
    value: function stderrHandler(message) {
      this.debug(`STDERR: ${message.toString()}`);
    }
  }, {
    key: 'stdoutHandler',
    value: function stdoutHandler(message) {
      this.debug(`${message.toString()}`);

      var log = message.toString();
      if (/waiting for connections on port/i.test(log)) {
        this.instanceReady();
      } else if (/addr already in use/i.test(log)) {
        this.instanceFailed(`Port ${this.opts.instance.port} already in use`);
      } else if (/mongod instance already running/i.test(log)) {
        this.instanceFailed('Mongod already running');
      } else if (/permission denied/i.test(log)) {
        this.instanceFailed('Mongod permission denied');
      } else if (/Data directory .*? not found/i.test(log)) {
        this.instanceFailed('Data directory not found');
      } else if (/shutting down with code/i.test(log)) {
        this.instanceFailed('Mongod shutting down');
      }
    }
  }]);

  return MongodbInstance;
}();

MongodbInstance.childProcessList = [];
exports.default = MongodbInstance;