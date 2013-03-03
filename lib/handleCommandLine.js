var buildSite = require('./buildSite');
var createServer = require('./createServer');
var deploySite = require('./deploySite');
var createConfig = require('./config');
var verifyRomulusVersion = require('./verifyRomulusVersion');

var path = require('path');

module.exports = function handleCommandLine(cwd, args) {
  args = args.slice(2);
  var arg;
  var configFile;
  var command;

  while ((arg = args.shift()) && !command) {
    switch (arg) {
    case '-c': 
      configFile = args.shift();
      if (!configFile) throw usage();
      break;
    default:
      if (arg[0] == '-') throw usage();
      command = arg;
    }
  }

  var configObject;

  if (configFile) {
    configObject = require(path.resolve(configFile));
  } else {
    configObject = {};
  }

  if (!configObject.rootDir) configObject.rootDir = cwd;

  var config = createConfig(configObject);

  verifyRomulusVersion(config, function(err) {
    if (err) {
      throw err;
    }

    runCommand(config, command, args);
  });
};

function runCommand(config, command, args) {
  switch (command) {
    case 'build':
      config.buildDir = args[0] || config.buildDir;

      // @todo the time keeping / output should be done inside buildSite
      var start = Date.now();
      buildSite(config, function(err) {
        if (err) throw err;

        console.log('You static empire was built in "%s" (took %s ms)', config.buildDir, Date.now() - start);
      });
      break;
    case 'deploy':
      deploySite(config, function(err) {
        if (err) throw err;
      });
      break;
    case 'serve':
      var server = createServer(config);
      server.on('listening', function() {
        console.log('Building your static empire at http://localhost:' + config.port + '/ ...');
      });
      break;
    default:
      throw usage();
  }
}

function usage() {
  return "usage: " + process.argv[1] + " [ -c configFile ] command\n";
}
