#!/usr/bin/env node

import meow from 'meow';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

global.__basedir = __dirname;

import { nsCreateProject } from './src/app.js';

const cli = meow( `
  Usage
    $ ns-create-project <project-name>

  Options
    --eslint Include eslint
    --copyfiles Include copy files setup

  Examples
    $ ns-create-project <project-name> --eslint
`, {
	importMeta: import.meta,
	flags: {
		eslint: {
			type: 'boolean',
		},
		copyfiles: {
			type: 'boolean',
		},
	},
} );

nsCreateProject( cli.input[ 0 ], cli.flags );
