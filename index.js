#!/usr/bin/env node

import meow from 'meow';
import chalk from 'chalk';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

global.__basedir = __dirname;
global.nsUpdateExisting = false;
global.allNCPAddons = [ 'copyfiles', 'default', 'eslint', 'husky', 'phpcs', 'pot', 'prettier', 'version', 'webpack', 'wpdeploy' ];

import { nsCreateProject } from './src/app.js';

const cli = meow( `
  ${ chalk.green.bold( 'Usage' ) }
    $ npx ${ chalk.green( 'ns-create-project' ) } ${ chalk.cyan( '<project-name>' ) } ${ chalk.yellow( '[options]' ) }

  ${ chalk.cyan.bold( 'Options' ) }
    ${ chalk.yellow( '-i, --include' ) } Include addons ( ${ chalk.yellow( 'default' ) } | ${ chalk.yellow( 'eslint' ) } | ${ chalk.yellow( 'husky' ) } | ${ chalk.yellow( 'prettier' ) } | ${ chalk.yellow( 'copyfiles' ) } | ${ chalk.yellow( 'wpdeploy' ) } | ${ chalk.yellow( 'pot' ) } | ${ chalk.yellow( 'version' ) } | ${ chalk.yellow( 'webpack' ) }). Multiple addons should be comma separated. Use ${ chalk.yellow( 'all' ) } to include all addons.

  ${ chalk.cyan.bold( 'Other options' ) }
    ${ chalk.yellow( '-h, --help' ) }     Show usage information.
    ${ chalk.yellow( '-v, --version' ) }  Output the version number.

  ${ chalk.cyanBright.bold( 'Examples' ) }
    $ npx ${ chalk.green( 'ns-create-project' ) } ${ chalk.cyan( 'hello-world' ) }
    $ npx ${ chalk.green( 'ns-create-project' ) } ${ chalk.cyan( 'hello-universe' ) } ${ chalk.yellow( '--include=eslint,prettier' ) }
    $ npx ${ chalk.green( 'ns-create-project' ) } ${ chalk.cyan( 'hello-country' ) } ${ chalk.yellow( '--include=all' ) }
`, {
	importMeta: import.meta,
	flags: {
		include: {
			type: 'string',
			default: 'default',
			alias: 'i',
		},
		version: {
			type: 'boolean',
			alias: 'v',
			desc: 'Output the version number.',
		},
		help: {
			type: 'boolean',
			alias: 'h',
			desc: 'Show usage information.',
		},
	},
} );

nsCreateProject( cli.input[ 0 ], cli.flags );
