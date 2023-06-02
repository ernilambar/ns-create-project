import Jsoner from './jsoner.js'

const ncpUpdatePackageJsonContent = (content, modes) => {
  const packageObject = new Jsoner(content)

  if (modes.includes('copyfiles')) {
    packageObject.add({
      scripts: {
        'ready:vendor': 'shx rm -rf vendor/ && composer install --no-dev --no-scripts -o',
        predeploy: 'pnpm run ready:vendor',
        deploy: 'packtor'
      }
    })

    packageObject.add({
      devDependencies: {
        packtor: '^1.0.2',
        shx: '^0.3.4'
      }
    })

    packageObject.add({
      packtor: {
        files: ['**/*', '!*.js', '!*.json', '!*.lock', '!*.lockb', '!*.yaml']
      }
    })
  }

  if (modes.includes('eslint')) {
    packageObject.add({
      scripts: {
        eslint: 'eslint --quiet .',
        'eslint:fix': 'eslint --quiet --fix .'
      }
    })

    packageObject.add({
      devDependencies: {
        '@wordpress/eslint-plugin': '^14.7.0',
        eslint: '^8.41.0'
      }
    })
  }

  if (modes.includes('freemius')) {
    packageObject.add({
      freemiusDeployer: {
        zipPath: 'deploy/',
        zipName: `${packageObject.jsonContent.name}.zip`,
        addContributor: false
      }
    })

    packageObject.add({
      scripts: {
        prefdeploy: 'pnpm run deploy',
        fdeploy: 'freemius-deployer'
      }
    })

    packageObject.add({
      devDependencies: {
        'freemius-deployer': '^1.0.3'
      }
    })
  }

  if (modes.includes('husky')) {
    packageObject.add({
      scripts: {
        prepare: 'husky install && pnpm run prepare:hooks',
        'prepare:hooks': 'pnpm dlx husky add .husky/pre-commit "pnpm dlx lint-staged"'
      }
    })

    packageObject.add({
      devDependencies: {
        husky: '^8.0.3',
        'lint-staged': '^13.2.2'
      }
    })
  }

  if (modes.includes('pot')) {
    packageObject.add({
      scripts: {
        pot: 'wpi18n makepot --domain-path=languages --exclude=vendor,deploy,node_modules',
        textdomain: 'wpi18n addtextdomain --exclude=vendor,deploy,node_modules'
      }
    })

    packageObject.add({
      devDependencies: {
        'node-wp-i18n': '^1.2.7'
      }
    })
  }

  if (modes.includes('prettier')) {
    packageObject.add({
      prettier: '@wordpress/prettier-config'
    })

    packageObject.add({
      scripts: {
        format: 'prettier --write "src/**/*.scss"'
      }
    })

    packageObject.add({
      devDependencies: {
        '@wordpress/prettier-config': '^2.17.0',
        prettier: '^2.8.8'
      }
    })
  }

  if (modes.includes('version')) {
    packageObject.add({
      scripts: {
        version: 'easy-replace-in-files'
      }
    })

    packageObject.add({
      devDependencies: {
        'easy-replace-in-files': '^1.0.3'
      }
    })
  }

  if (modes.includes('webpack')) {
    packageObject.add({
      scripts: {
        dev: 'webpack --watch',
        build: 'webpack',
        prod: 'NODE_ENV=production webpack'
      }
    })

    packageObject.add({
      devDependencies: {
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
        'webpack-cli': '^4.10.0'
      }
    })
  }

  if (modes.includes('wpscripts')) {
    packageObject.add({
      scripts: {
        dev: 'wp-scripts start',
        build: 'wp-scripts build',
        'lint:css': "wp-scripts lint-style 'src/**/*.{css,scss}'",
        'lint:css:fix': "wp-scripts lint-style 'src/**/*.{css,scss}' --fix",
        'lint:js': 'wp-scripts lint-js ./src webpack.config.js',
        'lint:js:fix': 'wp-scripts lint-js ./src webpack.config.js --fix',
        'lint:json:fix': 'wp-scripts format composer.json package.json'
      }
    })

    packageObject.add({
      devDependencies: {
        '@wordpress/scripts': '^26.5.0',
        'browser-sync': '^2.29.3',
        'browser-sync-webpack-plugin': '^2.3.0',
        dotenv: '^16.1.3'
      }
    })
  }

  if (modes.includes('wpdeploy')) {
    packageObject.add({
      wpDeployer: {
        repoType: 'plugin',
        username: 'yourusername',
        buildDir: `deploy/${packageObject.jsonContent.name}`,
        deployAssets: false
      }
    })

    packageObject.add({
      scripts: {
        prewpdeploy: 'pnpm run deploy',
        wpdeploy: 'wp-deployer'
      }
    })

    packageObject.add({
      devDependencies: {
        'wp-deployer': '^1.0.3'
      }
    })
  }

  packageObject.sort('devDependencies')

  return packageObject.content()
}

export { ncpUpdatePackageJsonContent }
