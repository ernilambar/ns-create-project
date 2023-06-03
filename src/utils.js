const ncpGetTitle = (slug) => {
  return slug.replace(/-/g, ' ').replace(/\b[a-z]/g, function () {
    return arguments[0].toUpperCase()
  })
}

const ncpGetPmx = (pm) => {
  let pmx

  switch (pm) {
    case 'yarn':
      pmx = 'yarn dlx'
      break
    case 'pnpm':
      pmx = 'pnpm dlx'
      break
    case 'bun':
      pmx = 'bunx'
      break
    default:
      pmx = 'npx'
  }

  return pmx
}

export { ncpGetTitle, ncpGetPmx }
