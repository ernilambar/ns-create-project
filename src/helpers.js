
const nsFilesList = ( flags ) => {
  let files = [
    { src: 'templates/npmrc.txt', dest: '.npmrc' },
    { src: 'templates/editorconfig.txt', dest: '.editorconfig' },
    { src: 'templates/env.example.txt', dest: '.env.example' },
    { src: 'templates/env.example.txt', dest: '.env' },
    { src: 'templates/gitignore.txt', dest: '.gitignore' },
  ];

  if ( true === flags.eslint ) {
    files.push( { src: 'templates/eslintignore.txt', dest: '.eslintignore' } );
    files.push( { src: 'templates/eslintrc.json', dest: '.eslintrc.json' } );
  }

  if ( true === flags.copyfiles ) {
    files.push( { src: 'templates/copy-files-from-to.json', dest: 'copy-files-from-to.json' } );
  }

  if ( true === flags.prettier ) {
    files.push( { src: 'templates/prettierignore.txt', dest: '.prettierignore' } );
  }

  return files;
}

export { nsFilesList };
