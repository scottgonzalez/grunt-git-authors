var fs = require( "fs" );
var path = require( "path" );
var spawn = require( "spawnback" );

exports.getAuthors = getAuthors;
exports.updateAuthors = updateAuthors;
exports.updatePackageJson = updatePackageJson;

var banners = {
	count: "Authors ordered by number of contributions",
	date: "Authors ordered by first contribution"
};

var orderBy = {
	count: function( authors ) {
		var count = {};
		return authors
			.filter( unique( count ) )
			.sort(function( a, b ) {
				return count[ b ] - count[ a ];
			});
	},

	date: function( authors ) {
		return authors
			.reverse()
			.filter( unique() );
	}
};

function getAuthors( options, callback ) {
	spawn( "git",
		[ "log", "--pretty=%aN <%aE>", options.dir || "." ],
	function( error, result ) {
		if ( error ) {
			return callback( error );
		}

		options = getOptions( options );

		var authors = result.trimRight().split( "\n" )
			.concat( (options.priorAuthors || []).reverse() );

		authors = orderBy[ options.order ]( authors );

		callback( null, authors );
	});
}

function getOptions( options ) {
	if ( !orderBy.hasOwnProperty( options.order ) ) {
		options.order = "date";
	}
	return options;
}

function unique( count ) {
	count = count || {};
	return function( key ) {
		if ( !(key in count) ) {
			count[ key ] = 0;
		}
		count[ key ]++;
		return count[ key ] === 1;
	};
}

function updateAuthors( options, callback ) {
	getAuthors( options, function( error, authors ) {
		if ( error ) {
			return callback( error );
		}

		options = getOptions( options );

		var banner = options.banner || banners[ options.order ];
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

function updatePackageJson( options, callback ) {
	getAuthors( options, function( error, authors) {
		if ( error ) {
			return callback( error );
		}

		options = getOptions( options );

		var dir = options.dir || ".";
		var filename = path.join( dir, "package.json" );

		fs.readFile( filename, { encoding: "utf8" }, function( error, content ) {
			if ( error ) {
				return callback( error );
			}

			var indentation = content.match( /\n([\t\s]+)/ )[ 1 ];
			var package = JSON.parse( content );
			package.contributors = authors;
			content = JSON.stringify( package, null, indentation ) + "\n";

			fs.writeFile( filename, content, function( error ) {
				if ( error ) {
					return callback( error );
				}

				callback( null );
			});
		});
	});
}
