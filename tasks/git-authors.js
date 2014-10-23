var getAuthors = require( "../" );

module.exports = function( grunt ) {

grunt.registerTask( "authors",
	"Generate a list of authors in order of first contribution",
function( dir ) {
	var done = this.async();

	getAuthors({
		dir: dir || ".",
		priorAuthors: grunt.config( "authors.prior" )
	}, function( error, authors ) {
		if ( error ) {
			grunt.log.error( error );
			return done( false );
		}

		grunt.log.writeln( authors.join( "\n" ) );
		done();
	});
});

};
