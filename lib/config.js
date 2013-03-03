var exports = module.exports = function createConfig(options) {
  return new Config(options);
};

exports.Config = Config;
function Config(options) {
  this.stdout = options.stdout || process.stdout;
  this.stderr = options.stdout || process.stderr;
  this.rootDir = options.rootDir || process.cwd;
  this.layoutsDir = options.layoutsDir || this.rootDir + '/layouts';
  this.pagesDir = options.pagesDir || this.rootDir + '/pages';
  this.publicDir = options.publicDir || this.rootDir + '/public';
  this.buildDir = options.buildDir || this.rootDir + '/build';
  this.git = options.git || 'git';
  this.deployBranch = options.deployBranch || 'gh-pages';
  this.port = options.port || 8080;
}
