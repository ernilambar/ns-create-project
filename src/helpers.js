import fs from 'fs';
import path from 'path';

import Mustache from 'mustache';
import chalk from 'chalk';

import readLineSync from 'readline-sync';

const { keyInYN } = readLineSync;

import { nsSorter, nsMergeObjects } from './utils.js';

const nsFilesList = ( addons ) => {
	const files = [];

	if ( addons.includes( 'default' ) ) {
		files.push( { src: 'templates/npmrc.txt', dest: '.npmrc' } );
		files.push( { src: 'templates/.editorconfig', dest: '.editorconfig' } );
		files.push( { src: 'templates/.env.example', dest: '.env.example' } );
		files.push( { src: 'templates/.env', dest: '.env' } );
		files.push( { src: 'templates/gitignore.txt', dest: '.gitignore' } );
	}

	if ( addons.includes( 'eslint' ) ) {
		files.push( { src: 'templates/.eslintignore', dest: '.eslintignore' } );
		files.push( { src: 'templates/.eslintrc.json', dest: '.eslintrc.json' } );
	}

	if ( addons.includes( 'husky' ) ) {
		files.push( { src: 'templates/.lintstagedrc', dest: '.lintstagedrc' } );
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

	if ( addons.includes( 'version' ) ) {
		files.push( { src: 'templates/easy-replace-in-files.json', dest: 'easy-replace-in-files.json' } );
	}

	if ( addons.includes( 'webpack' ) ) {
		files.push( { src: 'templates/webpack.config.js', dest: 'webpack.config.js' } );
	}

	return files;
};

const nsUpdatePackageJsonContent = ( content, mode ) => {
	let jsonContent = JSON.parse( content );

	if ( 'eslint' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			eslint: 'eslint --quiet .',
			'eslint:fix': 'eslint --quiet --fix .',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			'@wordpress/eslint-plugin': '^12.8.0',
			eslint: '^8.21.0',
		} );
	}

	if ( 'husky' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			prepare: 'husky install',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			husky: '^8.0.1',
			'lint-staged': '^13.0.3',
			'@commitlint/cli': '^17.0.3',
			'@commitlint/config-conventional': '^17.0.3',
		} );
	}

	if ( 'prettier' === mode ) {
		jsonContent = nsMergeObjects( jsonContent, {
			prettier: '@wordpress/prettier-config',
		} );

		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			format: 'prettier --write "src/**/*.scss"',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			'@wordpress/prettier-config': '^1.4.0',
			prettier: '^2.7.1',
		} );
	}

	if ( 'copyfiles' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			predeploy: 'shx rm -rf vendor/ && composer install --no-dev --no-scripts -o',
			deploy: 'shx rm -rf deploy/ && shx mkdir deploy && copy-files-from-to && cd deploy/ && cross-var shx mv temp $npm_package_name && cross-var bestzip ../$npm_package_name.zip * && cd .. && cross-var shx mv $npm_package_name.zip deploy/',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			bestzip: '^2.2.1',
			'copy-files-from-to': '^3.2.2',
			'cross-var': '^1.1.0',
			shx: '^0.3.4',
		} );
	}

	if ( 'wpdeploy' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			prewpdeploy: 'pnpm run deploy',
			wpdeploy: 'grunt wpdeploy',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			grunt: '^1.5.3',
			'grunt-wp-deploy': '^2.1.2',
		} );
	}

	if ( 'pot' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			pot: 'wpi18n makepot --domain-path=languages --exclude=vendor,deploy,node_modules',
			textdomain: 'wpi18n addtextdomain --exclude=vendor,deploy,node_modules',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			'node-wp-i18n': '^1.2.6',
		} );
	}

	if ( 'version' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			version: 'easy-replace-in-files',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			'easy-replace-in-files': '^1.0.2',
		} );
	}

	if ( 'webpack' === mode ) {
		jsonContent.scripts = nsMergeObjects( jsonContent.scripts, {
			dev: 'webpack --watch',
			build: 'webpack',
			prod: 'NODE_ENV=production webpack',
		} );

		jsonContent.devDependencies = nsMergeObjects( jsonContent.devDependencies, {
			'@babel/cli': '^7.18.10',
			'@babel/core': '^7.18.10',
			'@babel/preset-env': '^7.18.10',
			'babel-loader': '^8.2.5',
			'clean-webpack-plugin': '^4.0.0',
			'css-loader': '^6.7.1',
			'css-minimizer-webpack-plugin': '^4.0.0',
			'mini-css-extract-plugin': '^2.6.1',
			postcss: '^8.4.14',
			'postcss-loader': '^7.0.1',
			'postcss-preset-env': '^7.7.2',
			sass: '^1.54.3',
			'sass-loader': '^13.0.2',
			'style-loader': '^3.3.1',
			'terser-webpack-plugin': '^5.3.3',
			webpack: '^5.74.0',
			'webpack-cli': '^4.10.0',
		} );
	}

	jsonContent.devDependencies = nsSorter( jsonContent.devDependencies );

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
	addons.forEach( function( addon ) {
		packageContent = nsUpdatePackageJsonContent( packageContent, addon );
	} );

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

	if ( addons.includes( 'husky' ) ) {
		const huskyMessage = `
${ chalk.cyan.bold( 'INFO' ) }: ${ chalk.cyan( 'After package installation, run following commands to setup husky hooks.' ) }

${ chalk.yellow( "npx husky add .husky/commit-msg 'npx commitlint --edit $1'" ) }
${ chalk.yellow( "npx husky add .husky/pre-commit 'npx lint-staged'" ) }
`;
		console.log( huskyMessage );
	}
};

export { nsProcessFiles };
