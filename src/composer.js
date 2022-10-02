import Jsoner from './jsoner.js'

const ncpUpdateComposerJsonContent = (jsonContent) => {
  const composerObject = new Jsoner(jsonContent)

  composerObject.add({
    scripts: {
      'pc:info': '@php ./vendor/squizlabs/php_codesniffer/bin/phpcs -i',
      'pc:config': '@php ./vendor/squizlabs/php_codesniffer/bin/phpcs --config-show',
      compat: '@php ./vendor/squizlabs/php_codesniffer/bin/phpcs --standard=.phpcompat.xml.dist --report-full --report-summary .',
      lint: '@php ./vendor/squizlabs/php_codesniffer/bin/phpcs --report-full --report-summary .',
      'lint:error': '@lint -n',
      'lint:fix': '@php ./vendor/squizlabs/php_codesniffer/bin/phpcbf --report-full --report-summary .'
    }
  })

  composerObject.add({
    'require-dev': {
      'dealerdirect/phpcodesniffer-composer-installer': '^0.7.2',
      'phpcompatibility/phpcompatibility-wp': '^2.1',
      'wp-coding-standards/wpcs': '^2.3'
    }
  })

  composerObject.add({
    config: {
      'allow-plugins': {
        'dealerdirect/phpcodesniffer-composer-installer': true
      }
    }
  })

  composerObject.sort('require-dev')

  return composerObject.content()
}

export { ncpUpdateComposerJsonContent }
