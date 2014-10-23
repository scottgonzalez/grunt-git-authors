# grunt-git-authors

A [grunt](https://github.com/gruntjs/grunt) plugin for generating a list of
authors from the git history.

Support this project by [donating on Gittip](https://www.gittip.com/scottgonzalez/).

This project supports both a [Node API](#node-api) and a [Grunt API](#grunt-api).

## Grunt compatibility

v1.1.0+ is compatible with Grunt 0.4. If you're using Grunt 0.3, use v1.0.0.

## Grunt API

### Tasks

#### authors

Generates a list of authors in the form `Name <email>` in order of first
contribution.

This task writes its output to the console, not to a file.

You can optionally run this task against a subdirectory:

```sh
grunt authors:path/to/directory
```

### Config

#### authors.prior

Define a list of authors that contributed prior to the first commit in the repo.
This is useful if you've moved from another version control system.

```js
grunt.initConfig({
	authors: {
		prior: [
			"Jane Smith <jane.smith@example.com>",
			"John Doe <john.doe@example.com>"
		]
	}
});
```

## Node API

This module can also be used directly via `require( "grunt-git-authors" )`.
The module exports a single function which accepts an options hash and a callback.

### Options

* `dir` (String): Which directory to inspect for authors (defaults to `"."`).
* `priorAuthors` (Array): An array of authors that contributed prior to the first commit in the repo.

## Mailmap

This task respects mailmap, so if you have messy author info in your commits,
you can correct the data in your mailmap and this task with output the cleaned
up information. For more information, about using a mailmap, see the docs for
`git-shortlog` or read Shane da Silva's blog post about
[Git Shortlog and Mailmap](http://shane.io/2011/10/07/git-shortlog-and-mailmap.html).

## License

Copyright 2014 Scott González. Released under the terms of the MIT license.

---

Support this project by [donating on Gittip](https://www.gittip.com/scottgonzalez/).
