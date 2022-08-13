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

  const destPath = path.join( process.cwd(), projectName );

  const doesFolderExists = fs.existsSync( destPath );

  if ( doesFolderExists ) {
    console.log( 'Folder already exists.' );
    return;
  }

  // Create directory.
  fs.mkdirSync( destPath );

  const pkgMustache = path.join( __basedir, 'templates/package.mustache' );

  let contents = fs.readFileSync( pkgMustache );

  const data = {
    project_name: projectName
  }

  let packageContent = Mustache.render( contents.toString(), data );

  // Update packages.json file.
  if ( true === flags.eslint ) {
    let jsonPackageContent = JSON.parse( packageContent );

    const newObj = {
      "eslint": "eslint --quiet .",
      "eslint:fix": "eslint --quiet --fix ."
    }

    jsonPackageContent.scripts = {...jsonPackageContent.scripts, ...newObj };

    jsonPackageContent.devDependencies = { "eslint": "^8.21.0" };

    packageContent = JSON.stringify( jsonPackageContent, false, '  ' );
  }

  const targetPackageFile = path.join( path.join(process.cwd(), projectName), 'package.json' );

  fs.writeFileSync( targetPackageFile, packageContent, function (err) {
    if ( err ) { throw err };
    console.log( 'File package.json created.' );
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
    const srcFilePath = path.join( __basedir, item.src );
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

export { nsCreateProject };
