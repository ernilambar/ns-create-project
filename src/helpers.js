import fs from 'fs';
import path from 'path';

import Mustache from 'mustache';
import chalk from 'chalk';

import { nsSorter } from './utils.js';

const nsFilesList = ( flags ) => {
  let files = [
    { src: 'templates/.npmrc', dest: '.npmrc' },
    { src: 'templates/.editorconfig', dest: '.editorconfig' },
    { src: 'templates/.env.example', dest: '.env.example' },
    { src: 'templates/.env.example', dest: '.env' },
    { src: 'templates/gitignore.txt', dest: '.gitignore' },
  ];

  if ( true === flags.eslint ) {
    files.push( { src: 'templates/.eslintignore', dest: '.eslintignore' } );
    files.push( { src: 'templates/.eslintrc.json', dest: '.eslintrc.json' } );
  }

  if ( true === flags.copyfiles ) {
    files.push( { src: 'templates/copy-files-from-to.json', dest: 'copy-files-from-to.json' } );
  }

  if ( true === flags.prettier ) {
    files.push( { src: 'templates/.prettierignore', dest: '.prettierignore' } );
  }

  return files;
}

const nsUpdatePackageJsonContent = ( content, mode ) => {
  let jsonContent = JSON.parse( content );

  if ( 'eslint' === mode ) {
    const newScripts = {
      eslint: 'eslint --quiet .',
      'eslint:fix': 'eslint --quiet --fix .',
    };

    jsonContent.scripts = { ...jsonContent.scripts, ...newScripts };

    const devDeps = {
      '@wordpress/eslint-plugin': '^12.8.0',
      eslint: '^8.21.0',
    };

    jsonContent.devDependencies = { ...jsonContent.devDependencies, ...devDeps };
    jsonContent.devDependencies = nsSorter( jsonContent.devDependencies );
  }

  if ( 'prettier' === mode ) {
    const newParams = {
      prettier: '@wordpress/prettier-config',
    };

    jsonContent = { ...jsonContent, ...newParams };

    const newScripts = {
      format: 'prettier --write "src/**/*.scss"',
    };

    jsonContent.scripts = { ...jsonContent.scripts, ...newScripts };

    const devDeps = {
      '@wordpress/prettier-config': '^1.4.0',
      prettier: '^2.7.1',
    };

    jsonContent.devDependencies = { ...jsonContent.devDependencies, ...devDeps };
    jsonContent.devDependencies = nsSorter( jsonContent.devDependencies );
  }

  if ( 'copyfiles' === mode ) {
    const newScripts = {
      deploy: 'shx rm -rf deploy/ && shx mkdir deploy && copy-files-from-to && cd deploy/ && cross-var shx mv temp $npm_package_name && cross-var bestzip ../$npm_package_name.zip * && cd .. && cross-var shx mv $npm_package_name.zip deploy/',
    };

    jsonContent.scripts = { ...jsonContent.scripts, ...newScripts };

    const devDeps = {
      bestzip: '^2.2.1',
      'copy-files-from-to': '^3.2.2',
      'cross-var': '^1.1.0',
      shx: '^0.3.4',
    };

    jsonContent.devDependencies = { ...jsonContent.devDependencies, ...devDeps };
    jsonContent.devDependencies = nsSorter( jsonContent.devDependencies );
  }

  return JSON.stringify( jsonContent, false, '  ' );
};

const nsProcessFiles = ( projectName, flags ) => {
  console.log( 'Copying...' );

  const destPath = path.join( process.cwd(), projectName );

  const doesFolderExists = fs.existsSync( destPath );

  if ( doesFolderExists ) {
    console.log( chalk.green( projectName ) + ' folder already exists. Updating in the existing folder.' );
  } else {
    // Create directory.
    fs.mkdirSync( destPath );
  }

  // File package.json.
  const targetPackageFile = path.join( path.join( process.cwd(), projectName ), 'package.json' );
  let packageContent = '';

  try {
    if ( ! fs.existsSync( targetPackageFile ) ) {
      const pkgMustache = path.join( __basedir, 'templates/package.mustache' );

      const contents = fs.readFileSync( pkgMustache );

      const data = {
        project_name: projectName,
      };

      packageContent = Mustache.render( contents.toString(), data );
    } else {
      console.log( chalk.green( 'package.json' ) + ' already exists. Updating existing file.' );
      packageContent = fs.readFileSync( targetPackageFile );
    }
  } catch ( err ) {
    console.error( chalk.red( err ) );
  }

  // Update packages.json file.
  if ( true === flags.eslint ) {
    packageContent = nsUpdatePackageJsonContent( packageContent, 'eslint' );
  }

  if ( true === flags.prettier ) {
    packageContent = nsUpdatePackageJsonContent( packageContent, 'prettier' );
  }

  if ( true === flags.copyfiles ) {
    packageContent = nsUpdatePackageJsonContent( packageContent, 'copyfiles' );
  }

  // Write package.json file.
  fs.writeFileSync( targetPackageFile, packageContent, function( err ) {
    if ( err ) {
      throw err;
    }
    console.log( `File ${chalk.green('package.json')} created.` );
  } );

  // Get files list.
  const allFiles = nsFilesList( flags );

  allFiles.forEach( function( item ) {
    const srcFilePath = path.join( __basedir, item.src );
    const destFile = path.join( destPath, item.dest );

    let fileName = item.src.replace('templates/', '');

    if ( 'gitignore.txt' === fileName ) {
      fileName = '.gitignore';
    }

    try {
      if ( ! fs.existsSync( destFile ) ) {
        fs.copyFileSync( srcFilePath, destFile );
        console.log( `Copied ${chalk.green(fileName)}` );
      } else {
        console.log( `Skipping ${chalk.green(fileName)}. Already exists.` );
      }
    } catch ( err ) {
      console.error( chalk.red( err ) );
    }
  } );

  console.log( chalk.cyan( 'Completed.' ) );
};

export { nsProcessFiles };
