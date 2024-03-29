import fs from 'fs'
import path from 'path'

import Mustache from 'mustache'
import chalk from 'chalk'

import readLineSync from 'readline-sync'

import { ncpGetTitle } from './utils.js'
import { ncpFilesList } from './files.js'
import { ncpUpdatePackageJsonContent } from './package.js'
import { ncpUpdateComposerJsonContent } from './composer.js'

const { keyInYN } = readLineSync

const ncpProcessFiles = (projectName, addons, pm) => {
  let destPath = ''

  if (nsUpdateExisting === true) {
    destPath = process.cwd()
    projectName = path.basename(process.cwd())
  } else {
    destPath = path.join(process.cwd(), projectName)
  }

  if (nsUpdateExisting === false) {
    const doesFolderExists = fs.existsSync(destPath)

    if (doesFolderExists) {
      if (!keyInYN(`${chalk.bold.green(projectName)} folder already exists. Do you want to update existing folder?`)) {
        process.exit()
      }
    } else {
      fs.mkdirSync(destPath)
    }
  }

  const isNonPackageMode = !!((addons.length === 1 && addons.includes('phpcs')))

  if (isNonPackageMode !== true) {
    // File package.json.
    const targetPackageFile = path.join(destPath, 'package.json')

    let packageContent = ''

    try {
      if (!fs.existsSync(targetPackageFile)) {
        const pkgMustache = path.join(__basedir, 'templates/package.mustache')

        const contents = fs.readFileSync(pkgMustache)

        const data = {
          project_name: projectName,
          project_title: ncpGetTitle(projectName)
        }

        packageContent = Mustache.render(contents.toString(), data)
      } else {
        console.log(chalk.green('package.json') + ' already exists. Updating existing file.')
        packageContent = fs.readFileSync(targetPackageFile)
      }
    } catch (err) {
      console.error(chalk.red(err))
    }

    // Update package.json file.
    packageContent = ncpUpdatePackageJsonContent(JSON.parse(packageContent), addons, pm)

    // Write package.json file.
    fs.writeFileSync(targetPackageFile, JSON.stringify(packageContent, '', '  '), function (err) {
      if (err) {
        throw err
      }
      console.log(`File ${chalk.green('package.json')} created.`)
    })
  }

  // For composer file.
  if (addons.includes('phpcs')) {
    const targetComposerFile = path.join(destPath, 'composer.json')

    let composerContent = ''

    try {
      if (!fs.existsSync(targetComposerFile)) {
        const pkgMustache = path.join(__basedir, 'templates/composer.mustache')

        const contents = fs.readFileSync(pkgMustache)

        const data = {
          project_name: projectName,
          project_title: ncpGetTitle(projectName)
        }

        composerContent = Mustache.render(contents.toString(), data)
      } else {
        console.log(chalk.green('composer.json') + ' already exists. Updating existing file.')
        composerContent = fs.readFileSync(targetComposerFile)
      }
    } catch (err) {
      console.error(chalk.red(err))
    }

    composerContent = ncpUpdateComposerJsonContent(JSON.parse(composerContent))

    // Write composer.json file.
    fs.writeFileSync(targetComposerFile, JSON.stringify(composerContent, '', '  '), function (err) {
      if (err) {
        throw err
      }
      console.log(`File ${chalk.green('composer.json')} created.`)
    })
  }

  // Get files list.
  const allFiles = ncpFilesList(addons)

  allFiles.forEach(function (item) {
    const srcFilePath = path.join(__basedir, item.src)
    const destFile = path.join(destPath, item.dest)

    let fileName = item.src.replace('templates/', '')

    if (fileName === 'gitignore.txt') {
      fileName = '.gitignore'
    }

    if (fileName === 'npmrc.txt') {
      fileName = '.npmrc'
    }

    try {
      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(srcFilePath, destFile)
        console.log(`Created ${chalk.green(fileName)}`)
      } else {
        console.log(`Skipping ${chalk.green(fileName)}. Already exists.`)
      }
    } catch (err) {
      console.error(chalk.red(err))
    }
  })

  console.log(chalk.cyan('Completed!'))

  if (addons.includes('freemius')) {
    const freemiusMessage = `
${chalk.cyan.bold('INFO')}: ${chalk.cyan('After package installation, plase update env file.')}

${chalk.yellow('FS__API_DEV_ID=12345')}
${chalk.yellow('FS__API_PLUGIN_ID=12345')}
${chalk.yellow('FS__API_PUBLIC_KEY="pk_YOUR_PUBLIC_KEY"')}
${chalk.yellow('FS__API_SECRET_KEY="sk_YOUR_SECRET_KEY"')}
`
    console.log(freemiusMessage)
  }
}

export { ncpProcessFiles }
