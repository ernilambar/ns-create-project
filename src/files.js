const ncpFilesList = (addons) => {
  const files = []

  if (addons.includes('default')) {
    files.push({ src: 'templates/npmrc.txt', dest: '.npmrc' })
    files.push({ src: 'templates/.editorconfig', dest: '.editorconfig' })
    files.push({ src: 'templates/.env.example', dest: '.env.example' })
    files.push({ src: 'templates/.env', dest: '.env' })
    files.push({ src: 'templates/gitignore.txt', dest: '.gitignore' })
  }

  if (addons.includes('eslint')) {
    files.push({ src: 'templates/.eslintignore', dest: '.eslintignore' })
    files.push({ src: 'templates/.eslintrc.json', dest: '.eslintrc.json' })
  }

  if (addons.includes('husky')) {
    files.push({ src: 'templates/.lintstagedrc', dest: '.lintstagedrc' })
  }

  if (addons.includes('phpcs')) {
    files.push({ src: 'templates/.phpcs.xml.dist', dest: '.phpcs.xml.dist' })
    files.push({ src: 'templates/.phpcompat.xml.dist', dest: '.phpcompat.xml.dist' })
  }

  if (addons.includes('prettier')) {
    files.push({ src: 'templates/.prettierignore', dest: '.prettierignore' })
  }

  if (addons.includes('version')) {
    files.push({ src: 'templates/easy-replace-in-files.json', dest: 'easy-replace-in-files.json' })
  }

  if (addons.includes('webpack')) {
    files.push({ src: 'templates/webpack.config.js', dest: 'webpack.config.js' })
  }

  return files
}

export { ncpFilesList }
