#!/usr/bin/env node

import meow from 'meow';

const foo = (input, flags) => {
  console.log( input, 'input' );
  console.log( flags, 'flags' );
}

const cli = meow(`
  Usage
    $ foo <input>

  Options
    --rainbow, -r  Include a rainbow

  Examples
    $ foo unicorns --rainbow
    🌈 unicorns 🌈
`, {
  importMeta: import.meta,
  flags: {
    rainbow: {
      type: 'boolean',
      alias: 'r'
    }
  }
});

foo(cli.input[0], cli.flags);
