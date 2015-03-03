var fs = require( "fs" );
var path = require( "path" );
var spawn = require( "spawnback" );

exports.getAuthors = getAuthors;
exports.updateAuthors = updateAuthors;

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

function updateAuthors( options, callback ) {
	getAuthors( options, function( error, authors ) {
		if ( error ) {
			return callback( error );
		}

		var banner = options.banner || "Authors ordered by first contribution";
		var dir = options.dir || ".";
		var filename = path.join( dir, options.filename || "AUTHORS.txt" );

		fs.writeFile( filename,
			banner + "\n\n" + authors.join( "\n" ) + "\n",
		function( error ) {
			if ( error ) {
				return callback( error );
			}

			callback( null, filename );
		});
	});
}
