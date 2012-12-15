"use strict";

module.exports = function( grunt ) {

grunt.initConfig({
	jshint: {
		files: [ "Gruntfile.js", "tasks/**/*.js" ],
		options: {
			jshintrc: ".jshintrc"
		}
	}
});

grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.registerTask( "default", "jshint" );
grunt.loadTasks("tasks");
};
