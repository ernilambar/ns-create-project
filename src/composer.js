import Jsoner from './jsoner.js'

const ncpUpdateComposerJsonContent = (jsonContent) => {
  const composerObject = new Jsoner(jsonContent)

  composerObject.add({
    scripts: {
      'pc:info': '@php ./vendor/bin/phpcs -i',
      'pc:config': '@php ./vendor/bin/phpcs --config-show',
      lint: '@php ./vendor/bin/phpcs --report-full --report-summary .',
      'lint:error': '@lint -n',
      'lint:php': '@php ./vendor/bin/parallel-lint --exclude .git --exclude vendor --exclude node_modules .',
      'lint:fix': '@php ./vendor/bin/phpcbf --report-full --report-summary .',
      compat: '@php ./vendor/bin/phpcs --standard=.phpcompat.xml.dist --report-full --report-summary .'
    }
  })

  composerObject.add({
    'require-dev': {
      'dealerdirect/phpcodesniffer-composer-installer': '^1.0',
      'php-parallel-lint/php-parallel-lint': '^1.3',
      'phpcompatibility/phpcompatibility-wp': '^2.1',
      'wp-coding-standards/wpcs': 'dev-develop'
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
