import fs from 'fs';
import path from 'path';

import Mustache from 'mustache';
import chalk from 'chalk';

import readLineSync from 'readline-sync';

const { keyInYN } = readLineSync;

import { nsSorter } from './utils.js';

const nsFilesList = ( addons ) => {
	const files = [
		{ src: 'templates/npmrc.txt', dest: '.npmrc' },
		{ src: 'templates/.editorconfig', dest: '.editorconfig' },
		{ src: 'templates/.env.example', dest: '.env.example' },
		{ src: 'templates/.env', dest: '.env' },
		{ src: 'templates/gitignore.txt', dest: '.gitignore' },
	];

	if ( addons.includes( 'eslint' ) ) {
		files.push( { src: 'templates/.eslintignore', dest: '.eslintignore' } );
		files.push( { src: 'templates/.eslintrc.json', dest: '.eslintrc.json' } );
	}

	if ( addons.includes( 'copyfiles' ) ) {
		files.push( { src: 'templates/copy-files-from-to.json', dest: 'copy-files-from-to.json' } );
	}

	if ( addons.includes( 'prettier' ) ) {
		files.push( { src: 'templates/.prettierignore', dest: '.prettierignore' } );
	}

	if ( addons.includes( 'wpdeploy' ) ) {
		files.push( { src: 'templates/Gruntfile.js', dest: 'Gruntfile.js' } );
	}

	return files;
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

	if ( 'wpdeploy' === mode ) {
		const newScripts = {
			prewpdeploy: 'pnpm run deploy',
			wpdeploy: 'grunt wpdeploy',
		};

		jsonContent.scripts = { ...jsonContent.scripts, ...newScripts };

		const devDeps = {
			grunt: '^1.5.3',
			'grunt-wp-deploy': '^2.1.2',
		};

		jsonContent.devDependencies = { ...jsonContent.devDependencies, ...devDeps };
		jsonContent.devDependencies = nsSorter( jsonContent.devDependencies );
	}

	if ( 'pot' === mode ) {
		const newScripts = {
			pot: 'wpi18n makepot --domain-path=languages --exclude=vendor,deploy,node_modules',
			textdomain: 'wpi18n addtextdomain --exclude=vendor,deploy,node_modules',
		};

		jsonContent.scripts = { ...jsonContent.scripts, ...newScripts };

		const devDeps = {
			'node-wp-i18n': '^1.2.6',
		};

		jsonContent.devDependencies = { ...jsonContent.devDependencies, ...devDeps };
		jsonContent.devDependencies = nsSorter( jsonContent.devDependencies );
	}

	return JSON.stringify( jsonContent, false, '  ' );
};

const nsProcessFiles = ( projectName, addons ) => {
	let destPath = '';

	console.log( 'Copying...' );

	if ( true === nsUpdateExisting ) {
		destPath = process.cwd();
	} else {
		destPath = path.join( process.cwd(), projectName );
	}

	if ( false === nsUpdateExisting ) {
		const doesFolderExists = fs.existsSync( destPath );

		if ( doesFolderExists ) {
			if ( ! keyInYN( `${ chalk.bold.green( projectName ) } folder already exists. Do you want to update existing folder?` ) ) {
				process.exit();
			}
		} else {
			// Create directory.
			fs.mkdirSync( destPath );
		}
	}

	// File package.json.
	const targetPackageFile = path.join( destPath, 'package.json' );

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
	if ( addons.includes( 'eslint' ) ) {
		packageContent = nsUpdatePackageJsonContent( packageContent, 'eslint' );
	}

	if ( addons.includes( 'prettier' ) ) {
		packageContent = nsUpdatePackageJsonContent( packageContent, 'prettier' );
	}

	if ( addons.includes( 'copyfiles' ) ) {
		packageContent = nsUpdatePackageJsonContent( packageContent, 'copyfiles' );
	}

	if ( addons.includes( 'wpdeploy' ) ) {
		packageContent = nsUpdatePackageJsonContent( packageContent, 'wpdeploy' );
	}

	if ( addons.includes( 'pot' ) ) {
		packageContent = nsUpdatePackageJsonContent( packageContent, 'pot' );
	}

	// Write package.json file.
	fs.writeFileSync( targetPackageFile, packageContent, function( err ) {
		if ( err ) {
			throw err;
		}
		console.log( `File ${ chalk.green( 'package.json' ) } created.` );
	} );

	// Get files list.
	const allFiles = nsFilesList( addons );

	allFiles.forEach( function( item ) {
		const srcFilePath = path.join( __basedir, item.src );
		const destFile = path.join( destPath, item.dest );

		let fileName = item.src.replace( 'templates/', '' );

		if ( 'gitignore.txt' === fileName ) {
			fileName = '.gitignore';
		}

		if ( 'npmrc.txt' === fileName ) {
			fileName = '.npmrc';
		}

		try {
			if ( ! fs.existsSync( destFile ) ) {
				fs.copyFileSync( srcFilePath, destFile );
				console.log( `Copied ${ chalk.green( fileName ) }` );
			} else {
				console.log( `Skipping ${ chalk.green( fileName ) }. Already exists.` );
			}
		} catch ( err ) {
			console.error( chalk.red( err ) );
		}
	} );

	console.log( chalk.cyan( 'Completed.' ) );
};

export { nsProcessFiles };
