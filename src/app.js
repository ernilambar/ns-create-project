import chalk from 'chalk'

import readLineSync from 'readline-sync'

import { ncpProcessFiles } from './helpers.js'

const { keyInYN } = readLineSync

const nsCreateProject = (projectName, flags) => {
  let addons = []

  if (flags.include) {
    if (flags.include === 'all') {
      addons = allNCPAddons
    } else {
      addons = flags.include.split(',')
    }
  }

  if (!projectName || projectName === 'undefined') {
    if (!keyInYN(`${chalk.green('<project-name>')} is not passed. Do you want to update existing folder?`)) {
      // Key that is not `Y` was pressed.
      process.exit()
    }

    nsUpdateExisting = true
  }

  if (nsUpdateExisting === false) {
    const isValidName = !!(/^([a-z\-\\_\d])+$/.test(projectName))

    if (!isValidName) {
      console.error(`${chalk.red('ERROR:')} Project name ${chalk.bold.green(projectName)} is invalid. Accepts small letters, numbers, dash and underscores.`)
      process.exit()
    }
  }

  ncpProcessFiles(projectName, addons)
}

export { nsCreateProject }
