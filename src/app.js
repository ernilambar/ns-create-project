import { nsProcessFiles } from './helpers.js';

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

	nsProcessFiles( projectName, flags );
};

export { nsCreateProject };
