#!/usr/bin/env node

import meow from 'meow'
import chalk from 'chalk'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { nsCreateProject } from './src/app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

global.__basedir = __dirname
global.nsUpdateExisting = false
global.allNCPAddons = ['copyfiles', 'default', 'eslint', 'freemius', 'husky', 'phpcs', 'pot', 'prettier', 'version', 'webpack', 'wpdeploy', 'wpscripts']

const cli = meow(`
  ${chalk.green.bold('Usage')}
    $ npx ${chalk.green('ns-create-project')} ${chalk.cyan('<project-name>')} ${chalk.yellow('[options]')}

  ${chalk.cyan.bold('Options')}
    ${chalk.yellow('-i, --include')}  Include addons (${chalk.yellow('default')} | ${chalk.yellow('copyfiles')} | ${chalk.yellow('eslint')} | ${chalk.yellow('freemius')} | ${chalk.yellow('husky')} | ${chalk.yellow('phpcs')} | ${chalk.yellow('pot')} | ${chalk.yellow('prettier')} | ${chalk.yellow('version')} | ${chalk.yellow('webpack')} | ${chalk.yellow('wpdeploy')} | ${chalk.yellow('wpscripts')}). Default: ${chalk.yellow('default')}. Multiple addons should be comma separated. Use ${chalk.yellow('all')} to include all addons.
    ${chalk.yellow('-p, --pm')}       Package manager (${chalk.yellow('pnpm')} | ${chalk.yellow('npm')} | ${chalk.yellow('yarn')} | ${chalk.yellow('bun')}). Default is ${chalk.yellow('pnpm')}.

  ${chalk.cyan.bold('Other options')}
    ${chalk.yellow('-h, --help')}     Show usage information.
    ${chalk.yellow('-v, --version')}  Output the version number.

  ${chalk.cyanBright.bold('Examples')}
    $ npx ${chalk.green('ns-create-project')} ${chalk.cyan('hello-world')}
    $ npx ${chalk.green('ns-create-project')} ${chalk.cyan('hello-universe')} ${chalk.yellow('--include=eslint,prettier')}
    $ npx ${chalk.green('ns-create-project')} ${chalk.cyan('hello-country')} ${chalk.yellow('--include=all')}
`, {
  importMeta: import.meta,
  flags: {
    include: {
      type: 'string',
      default: 'default',
      shortFlag: 'i'
    },
    pm: {
      type: 'string',
      default: 'pnpm',
      shortFlag: 'p'
    },
    version: {
      type: 'boolean',
      shortFlag: 'v',
      desc: 'Output the version number.'
    },
    help: {
      type: 'boolean',
      shortFlag: 'h',
      desc: 'Show usage information.'
    }
  }
})

nsCreateProject(cli.input[0], cli.flags)
