export const fields = `
  _key,
  _type,
  label,
  linkType,
  linkType == "internal" => {
    'link': internalLink -> {
      _id,
      _type,
      'slug': slug.current
    }
  },
  linkType == "file" => {
    'link': fileLink.asset->url
  },
  linkType == "external" => { 'link': externalLink },
  videoPopoutType,
  videoId,
  hash,
  icon,
  navigationOffset
`

export const fragment = (name = 'link') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
