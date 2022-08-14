import fs from 'fs';
import path from 'path';

import Mustache from 'mustache';

import { nsSorter } from './utils.js';
import { nsFilesList } from './helpers.js';

const nsCreateProject = ( projectName, flags ) => {
	if ( ! projectName ) {
		console.log( '<project-name> is required.' );
		return;
	}

  const isValidName = ( /^([a-z\-\\_\d])+$/.test( projectName ) ) ? true : false;

  if ( ! isValidName ) {
    console.log( '<project-name> is invalid. Accepts small letters, numbers, dash and underscores.' );
    return;
  }

	nsCopyFiles( projectName, flags );
};

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

	const contents = fs.readFileSync( pkgMustache );

	const data = {
		project_name: projectName,
	};

	let packageContent = Mustache.render( contents.toString(), data );

	const targetPackageFile = path.join( path.join( process.cwd(), projectName ), 'package.json' );

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

	fs.writeFileSync( targetPackageFile, packageContent, function( err ) {
		if ( err ) {
			throw err;
		}
		console.log( 'File package.json created.' );
	} );

  // Get files list.
  const allFiles = nsFilesList( flags );

	allFiles.forEach( function( item ) {
		const srcFilePath = path.join( __basedir, item.src );
		const destFile = path.join( destPath, item.dest );

		try {
			if ( fs.existsSync( srcFilePath ) ) {
				fs.copyFileSync( srcFilePath, destFile );
				console.log( 'Copied file: ' + destFile );
			}
		} catch ( err ) {
			console.error( err );
		}
	} );

	console.log( 'Filed copied successfully.' );
};

export { nsCreateProject };
