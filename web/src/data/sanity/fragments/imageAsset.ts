export const fields = `
  _type,
  defined(_key) => {_key},
  "alt": coalesce(alt, ""),
  defined(crop) => {crop},
  defined(hotspot) => {hotspot},
  asset -> {
    _id,
    "height": metadata.dimensions.height,
    "width": metadata.dimensions.width,
    "aspectRatio": metadata.dimensions.aspectRatio,
  }
`

export const fragment = (name: string) => `${name}{${fields}}`

const exports = { fields, fragment }

export default exports
