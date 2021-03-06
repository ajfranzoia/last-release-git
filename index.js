'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = require('child_process'),
    execSync = _require.execSync;

var _require2 = require('semver'),
    clean = _require2.clean,
    lt = _require2.lt;

module.exports = function (config, pluginConfig, callback) {
    var refs = execSync('git show-ref --tags').toString('utf-8').trim().split('\n');
    var latestVersion = void 0;
    var latestVersionCommitHash = void 0;

    for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];

        var _ref$split = ref.split(' '),
            _ref$split2 = _slicedToArray(_ref$split, 2),
            commitHash = _ref$split2[0],
            refName = _ref$split2[1];

        var version = clean(refName.split('/')[2]);

        // version is null if not valid
        if (version && (!latestVersion || lt(latestVersion, version))) {
            latestVersion = version;
            latestVersionCommitHash = commitHash;
        }
    }


    return new Promise(function(resolve, reject) {
      if (!latestVersion) {
        return reject(Error('There is no valid semver git tag. Create the first valid tag via "git tag v0.0.0" and then push it via "git push --tags".'));
      }

      return resolve({
        version: latestVersion,
        gitHead: latestVersionCommitHash
      });
    });
};
