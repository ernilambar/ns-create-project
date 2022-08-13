#!/usr/bin/env node

import meow from 'meow';

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nsCreateProject = (flags) => {
  nsCopyFiles();
}

const nsCopyFiles = () => {
  console.log( 'Copying...' );

  let files = [
    { src: 'templates/editorconfig.txt', dest: '.editorconfig' },
    { src: 'templates/env.example.txt', dest: '.env.example' },
    { src: 'templates/env.example.txt', dest: '.env' },
    { src: 'templates/gitignore.txt', dest: '.gitignore' }
  ];

  files.forEach( function( item, index ) {
    const srcFilePath = path.join( __dirname, item.src );
    const destFile = item.dest;

    try {
      if (fs.existsSync( srcFilePath ) ) {
        fs.copyFileSync( srcFilePath, destFile );
        console.log( 'Copied file: ' + destFile );
      }
    } catch( err ) {
      console.error( err );
    }
  });

  console.log( 'Filed copied successfully.' );
}


const cli = meow(`
  Usage
    $ ns-create-project

  Options
    --eslint Include eslint

  Examples
    $ ns-create-project --eslint
`, {
  importMeta: import.meta,
  flags: {
    eslint: {
      type: 'boolean'
    }
  }
});

nsCreateProject(cli.flags);
