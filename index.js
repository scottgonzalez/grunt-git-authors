var child_process = require( "child_process" );

exports = module.exports = getAuthors;

function spawn( command, args, callback ) {
	var stdout = "";
	var stderr = "";
	var child = child_process.spawn( command, args );
	var hadError = false;

	child.on( "error", function( error ) {
		hadError = true;
		callback( error );
	});

	child.stdout.on( "data", function( data ) {
		stdout += data;
	});

	child.stderr.on( "data", function( data ) {
		stderr += data;
	});

	child.on( "close", function( code ) {
		if ( hadError ) {
			return;
		}

		var error;
		if ( code ) {
			error = new Error( stderr );
			error.code = code;
			return callback( error );
		}

		callback( null, stdout.trimRight() );
	});
}

function getAuthors( options, callback ) {
	spawn( "git",
		[ "log", "--pretty=%aN <%aE>", options.dir || "." ],
	function( error, result ) {
		if ( error ) {
			return callback( error );
		}

		var tracked = {};
		var authors = result.split( "\n" )
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
