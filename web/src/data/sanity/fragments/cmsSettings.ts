export const fields = `
  isHidden,
  cmsTitle,
  id,
  zIndex
`

export const fragment = (name = 'cmsSettings') => `${name}{ ${fields} }`

export default fragment
