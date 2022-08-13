#!/usr/bin/env node

import meow from 'meow';

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nsCreateProject = (input, flags) => {
  const destPath = input ? input : '.';
  // console.log( destPath, 'destPath' );
  // console.log( flags, 'flags' );
  nsCopyFiles();
}

const nsCopyFiles = () => {
  console.log('Copying...');

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
      }
    } catch(err) {
      console.error(err);
    }
  });
}


const cli = meow(`
  Usage
    $ ns-create-project path

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

nsCreateProject(cli.input[0], cli.flags);
