/**
 * Created by Administrator on 2015/11/23.
 */
'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
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
				this.templatePath('gulpfile.babel.js'),
				this.destinationPath('gulpfile.babel.js'),
				{
					date: (new Date).toISOString().split('T')[0],
					name: this.pkg.name,
					version: this.pkg.version,
					includeSass: this.includeSass,
					includeBootstrap: this.includeBootstrap,
					testFramework: this.options['test-framework']
				}
			);
		}, // end gulpfile

		packageJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json')
			);
		}, // end  packageJSON

		bower: function () {
			var bowerJson = {
				name: _s.slugify(this.appname),
				private: true,
				dependencies: {}
			};

			if (this.includeModernizr) {
				bowerJson.dependencies['modernizr'] = '~2.8.1';
			}
			this.fs.writeJSON('bower.json', bowerJson);
			this.fs.copy(
				this.templatePath('bowerrc'),
				this.destinationPath('.bowerrc')
			);
		} // end bower
	} // end writing
});
