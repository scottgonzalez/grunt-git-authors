var spawn = require( "spawnback" );

exports = module.exports = getAuthors;

function getAuthors( options, callback ) {
	spawn( "git",
		[ "log", "--pretty=%aN <%aE>", options.dir || "." ],
	function( error, result ) {
		if ( error ) {
			return callback( error );
		}

		var tracked = {};
		var authors = result.trimRight().split( "\n" )
			.concat( (options.priorAuthors || []).reverse() )
			.reverse()
			.filter(function( author ) {
				var first = !tracked[ author ];
				tracked[ author ] = true;
				return first;
			});

		callback( null, authors );
	});
}
