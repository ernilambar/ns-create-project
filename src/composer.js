import Jsoner from './jsoner.js';

const ncpUpdateComposerJsonContent = ( jsonContent ) => {
	const composerObject = new Jsoner( jsonContent );

	composerObject.add( { scripts: {
		'pc:info': 'phpcs -i',
		'pc:config': 'phpcs --config-show',
		lint: 'phpcs .',
		'lint:fix': 'phpcbf .',
	} } );

	composerObject.add( { 'require-dev': {
		'dealerdirect/phpcodesniffer-composer-installer': '^0.7.2',
		'phpcompatibility/phpcompatibility-wp': '^2.1',
		'wp-coding-standards/wpcs': '^2.3',
	} } );

	composerObject.add( { config: { 'allow-plugins': {
		'dealerdirect/phpcodesniffer-composer-installer': true,
	} } } );

	composerObject.sort( 'require-dev' );

	return composerObject.content();
};

export { ncpUpdateComposerJsonContent };
