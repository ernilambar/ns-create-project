#!/usr/bin/env node

import meow from 'meow';

import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nsCreateProject = ( projectName, flags ) => {
  if ( ! projectName ) {
    console.log( '<project-name> is required.' );
    return;
  }

  nsCopyFiles( projectName, flags );
}

const nsCopyFiles = ( projectName, flags ) => {
  console.log( 'Copying...' );

  const destPath = process.cwd() + '/' + projectName;

  const doesFolderExists = fs.existsSync( destPath );

  if ( doesFolderExists ) {
    console.log( 'Folder already exists.' );
    return;
  }

  // Create directory.
  fs.mkdirSync( destPath );

  const pkgMustache = path.join( __dirname, 'templates/packages.mustache' );

  let contents = fs.readFileSync( pkgMustache );

  const data = {
    project_name: projectName
  }

  const packageContent = Mustache.render( contents.toString(), data );

  // console.log( 'Contents: ', contents.toString() );

  const targetPackageFile = path.join( path.join(process.cwd(), projectName), 'packages.json' );

  // console.log( targetPackageFile );

  fs.writeFileSync( targetPackageFile, packageContent, function (err) {
    if ( err ) { throw err };
    console.log( 'File packages.json created.' );
  });

  let files = [
    { src: 'templates/npmrc.txt', dest: '.npmrc' },
    { src: 'templates/editorconfig.txt', dest: '.editorconfig' },
    { src: 'templates/env.example.txt', dest: '.env.example' },
    { src: 'templates/env.example.txt', dest: '.env' },
    { src: 'templates/gitignore.txt', dest: '.gitignore' }
  ];

  if ( true === flags.eslint ) {
    files.push( { src: 'templates/eslintignore.txt', dest: '.eslintignore' } );
    files.push( { src: 'templates/eslintrc.json', dest: '.eslintrc.json' } );
  }

  files.forEach( function( item, index ) {
    const srcFilePath = path.join( __dirname, item.src );
    const destFile = path.join(destPath, item.dest);

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
    $ ns-create-project <project-name>

  Options
    --eslint Include eslint

  Examples
    $ ns-create-project <project-name> --eslint
`, {
  importMeta: import.meta,
  flags: {
    eslint: {
      type: 'boolean'
    }
  }
});

nsCreateProject( cli.input[0], cli.flags );
