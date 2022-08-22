import chalk from 'chalk';

import readLineSync from 'readline-sync';

const { keyInYN } = readLineSync;

import { ncpProcessFiles } from './helpers.js';

const nsCreateProject = ( projectName, flags ) => {
	let addons = [];

	if ( flags.include ) {
		if ( 'all' === flags.include ) {
			addons = allNCPAddons;
		} else {
			addons = flags.include.split( ',' );
		}
	}

	if ( ! projectName || 'undefined' === projectName ) {
		if ( ! keyInYN( `${ chalk.green( '<project-name>' ) } is not passed. Do you want to update existing folder?` ) ) {
			// Key that is not `Y` was pressed.
			process.exit();
		}

		nsUpdateExisting = true;
	}

	if ( false === nsUpdateExisting ) {
		const isValidName = ( /^([a-z\-\\_\d])+$/.test( projectName ) ) ? true : false;

		if ( ! isValidName ) {
			console.error( `${ chalk.red( 'ERROR:' ) } Project name ${ chalk.bold.green( projectName ) } is invalid. Accepts small letters, numbers, dash and underscores.` );
			process.exit();
		}
	}

	ncpProcessFiles( projectName, addons );
};

export { nsCreateProject };
