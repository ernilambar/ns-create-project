#!/usr/bin/env node

import meow from 'meow';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

global.__basedir = __dirname;
global.nsUpdateExisting = false;

import { nsCreateProject } from './src/app.js';

const cli = meow( `
  Usage
    $ ns-create-project <project-name>

  Options
    --include    Include addons (eslint|prettier|copyfiles). Multiple addons should be comma separated. Use all to include all addons.
    --help       Show help information.
    --version    Output the version number.

  Examples
    $ ns-create-project hello-world
`, {
	importMeta: import.meta,
	flags: {
		include: {
			type: 'string',
			default: '',
			alias: 'i',
		},
	},
} );

nsCreateProject( cli.input[ 0 ], cli.flags );
