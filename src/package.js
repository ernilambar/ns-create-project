import Jsoner from './jsoner.js';

const ncpUpdatePackageJsonContent = ( content, modes ) => {
	const packageObject = new Jsoner( content );

	if ( modes.includes( 'copyfiles' ) ) {
		packageObject.add( { scripts: {
			predeploy: 'shx rm -rf vendor/ && composer install --no-dev --no-scripts -o',
			deploy: 'shx rm -rf deploy/ && shx mkdir deploy && copy-files-from-to && cd deploy/ && cross-var shx mv temp $npm_package_name && cross-var bestzip ../$npm_package_name.zip * && cd .. && cross-var shx mv $npm_package_name.zip deploy/',
		} } );

		packageObject.add( { devDependencies: {
			bestzip: '^2.2.1',
			'copy-files-from-to': '^3.2.2',
			'cross-var': '^1.1.0',
			shx: '^0.3.4',
		} } );
	}

	if ( modes.includes( 'eslint' ) ) {
		packageObject.add( { scripts: {
			eslint: 'eslint --quiet .',
			'eslint:fix': 'eslint --quiet --fix .',
		} } );

		packageObject.add( { devDependencies: {
			'@wordpress/eslint-plugin': '^12.8.0',
			eslint: '^8.21.0',
		} } );
	}

	if ( modes.includes( 'husky' ) ) {
		packageObject.add( { scripts: {
			prepare: 'husky install',
		} } );

		packageObject.add( { devDependencies: {
			husky: '^8.0.1',
			'lint-staged': '^13.0.3',
			'@commitlint/cli': '^17.0.3',
			'@commitlint/config-conventional': '^17.0.3',
		} } );

		packageObject.add( { commitlint: {
			extends: '@commitlint/config-conventional',
		} } );
	}

	if ( modes.includes( 'pot' ) ) {
		packageObject.add( { scripts: {
			pot: 'wpi18n makepot --domain-path=languages --exclude=vendor,deploy,node_modules',
			textdomain: 'wpi18n addtextdomain --exclude=vendor,deploy,node_modules',
		} } );

		packageObject.add( { devDependencies: {
			'node-wp-i18n': '^1.2.6',
		} } );
	}

	if ( modes.includes( 'prettier' ) ) {
		packageObject.add( {
			prettier: '@wordpress/prettier-config',
		} );

		packageObject.add( { scripts: {
			format: 'prettier --write "src/**/*.scss"',
		} } );

		packageObject.add( { devDependencies: {
			'@wordpress/prettier-config': '^1.4.0',
			prettier: '^2.7.1',
		} } );
	}

	if ( modes.includes( 'version' ) ) {
		packageObject.add( { scripts: {
			version: 'easy-replace-in-files',
		} } );

		packageObject.add( { devDependencies: {
			'easy-replace-in-files': '^1.0.2',
		} } );
	}

	if ( modes.includes( 'webpack' ) ) {
		packageObject.add( { scripts: {
			dev: 'webpack --watch',
			build: 'webpack',
			prod: 'NODE_ENV=production webpack',
		} } );

		packageObject.add( { devDependencies: {
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
		} } );
	}

	if ( modes.includes( 'wpdeploy' ) ) {
		packageObject.add( { scripts: {
			prewpdeploy: 'pnpm run deploy',
			wpdeploy: 'grunt wpdeploy',
		} } );

		packageObject.add( { devDependencies: {
			grunt: '^1.5.3',
			'grunt-wp-deploy': '^2.1.2',
		} } );
	}

	packageObject.sort( 'devDependencies' );

	return packageObject.content();
};

export { ncpUpdatePackageJsonContent };
