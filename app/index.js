/**
 * Created by Administrator on 2015/11/23.
 */
'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;
var _s = require('underscore.string');



module.exports = generators.Base.extend({
	initializing: function() {
		this.pkg = require('../package.json');
		// CUST
		this.includeModernizr = true;
	},

	prompting: function() {
		var done = this.async();

		var prompts = [{
			type    : 'input',
			name    : '_PName',
			message : 'Your project name, default -> JHomeApp',
			default : 'JHomeApp' // Default to current folder name
		}];

		this.prompt(prompts, function (answers) {
			this._PName = answers._PName;
			done();
		}.bind(this));
	},

	configuring: function() {

	},

	default: function() {

	},

	writing: {
		gulpfile: function () {
			this.fs.copyTpl(
				this.templatePath('gulpfile.js'),
				this.destinationPath('gulpfile.js')
			);
		}, // end gulpfile

		packageJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json')
			);
		}, // end  packageJSON
		styles: function () {
			this.fs.copyTpl(
				this.templatePath('main.scss'),
				this.destinationPath('app/styles/main.scss')
			);
		}, //end style
		scripts: function () {
			this.fs.copy(
				this.templatePath('main.js'),
				this.destinationPath('app/scripts/main.js')
			);
		}, // end script
		html: function () {
			this.fs.copyTpl(
				this.templatePath('index.html'),
				this.destinationPath('app/index.html')
			)
		}, // end html
		bower: function () {
			var bowerJson = {
				name: _s.slugify(this.appname),
				private: true,
				dependencies: {}
			};

			bowerJson.dependencies['jquery'] = '~2.1.4';
			this.fs.writeJSON('bower.json', bowerJson);
			this.fs.copy(
				this.templatePath('bowerrc'),
				this.destinationPath('.bowerrc')
			);
		} // end bower
	}, // end writing

	install: function () {
		this.installDependencies({
			skipMessage: this.options['skip-install-message'],
			skipInstall: this.options['skip-install']
		});
	} // end install
});
