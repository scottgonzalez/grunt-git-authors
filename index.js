var fs = require( "fs" );
var path = require( "path" );
var spawn = require( "spawnback" );

var orderBy = {
	date: function(authors) {
		return authors
			.reverse()
			.filter(function( author ) {
				var first = !tracked[ author ];
				tracked[ author ] = true;
				return first;
			});
	}
};

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
		options.order = orderBy[order] ? order : "date";

		var authors = result.trimRight().split( "\n" )
			.concat( (options.priorAuthors || []).reverse() );

		authors = orderBy[options.order](authors);

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
