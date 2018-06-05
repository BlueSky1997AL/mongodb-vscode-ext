'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lockfile = require('lockfile');

var _lockfile2 = _interopRequireDefault(_lockfile);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _MongoBinaryDownload = require('./MongoBinaryDownload');

var _MongoBinaryDownload2 = _interopRequireDefault(_MongoBinaryDownload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongoBinary = function () {
  function MongoBinary() {
    _classCallCheck(this, MongoBinary);
  }

  _createClass(MongoBinary, null, [{
    key: 'getPath',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _opts$downloadDir, downloadDir, _opts$platform, platform, _opts$arch, arch, _opts$version, version, debug, lockfile, downloader;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _opts$downloadDir = opts.downloadDir, downloadDir = _opts$downloadDir === undefined ? _path2.default.resolve(_os2.default.homedir(), '.mongodb-binaries') : _opts$downloadDir, _opts$platform = opts.platform, platform = _opts$platform === undefined ? _os2.default.platform() : _opts$platform, _opts$arch = opts.arch, arch = _opts$arch === undefined ? _os2.default.arch() : _opts$arch, _opts$version = opts.version, version = _opts$version === undefined ? '3.4.4' : _opts$version;
                debug = void 0;

                if (opts.debug) {
                  if (opts.debug.call && typeof opts.debug === 'function' && opts.debug.apply) {
                    debug = opts.debug;
                  } else {
                    debug = console.log.bind(null);
                  }
                } else {
                  debug = function debug(msg) {}; // eslint-disable-line
                }

                if (!this.cache[version]) {
                  _context.next = 7;
                  break;
                }

                debug(`MongoBinary: found cached binary path for ${version}`);
                _context.next = 19;
                break;

              case 7:
                _context.next = 9;
                return new Promise(function (resolve, reject) {
                  (0, _mkdirp2.default)(downloadDir, function (err) {
                    if (err) reject(err);else resolve();
                  });
                });

              case 9:
                lockfile = _path2.default.resolve(downloadDir, `${version}.lock`);

                // wait lock

                _context.next = 12;
                return new Promise(function (resolve, reject) {
                  _lockfile2.default.lock(lockfile, {
                    wait: 120000,
                    pollPeriod: 100,
                    stale: 110000,
                    retries: 3,
                    retryWait: 100
                  }, function (err) {
                    if (err) reject(err);else resolve();
                  });
                });

              case 12:
                if (this.cache[version]) {
                  _context.next = 18;
                  break;
                }

                downloader = new _MongoBinaryDownload2.default({
                  downloadDir,
                  platform,
                  arch,
                  version
                });


                downloader.debug = debug;
                _context.next = 17;
                return downloader.getMongodPath();

              case 17:
                this.cache[version] = _context.sent;

              case 18:

                // remove lock
                _lockfile2.default.unlock(lockfile, function (err) {
                  debug(err ? `MongoBinary: Error when removing download lock ${err}` : `MongoBinary: Download lock removed`);
                });

              case 19:

                debug(`MongoBinary: Mongod binary path: ${this.cache[version]}`);
                return _context.abrupt('return', this.cache[version]);

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getPath() {
        return _ref.apply(this, arguments);
      }

      return getPath;
    }()
  }, {
    key: 'hasValidBinPath',
    value: function hasValidBinPath(files) {
      if (files.length === 1) {
        return true;
      } else if (files.length > 1) {
        return false;
      }
      return false;
    }
  }]);

  return MongoBinary;
}();

MongoBinary.cache = {};
exports.default = MongoBinary;