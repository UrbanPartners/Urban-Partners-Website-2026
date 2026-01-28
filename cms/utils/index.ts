import {Rule, ValidationContext} from 'sanity'

export const decodeAssetId = (
  id: string,
): {dimensions: {width: number; height: number}} | {dimensions: null} => {
  const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/
  const imageContents = pattern.exec(id)
  if (!imageContents) return {dimensions: null}
  const [width, height] = imageContents[2].split('x').map((v: any) => parseInt(v, 10))

  return {
    dimensions: {width, height},
  }
}

export const getImageValidation = ({
  image,
  imageName,
  width,
  height,
  minWidth,
  minHeight,
  required,
}: {
  image: any
  width?: number
  height?: number
  imageName?: string
  required?: boolean
  minWidth?: number
  minHeight?: number
}) => {
  const {dimensions} = decodeAssetId(image?.asset?._ref)
  if (!image && required) return `${imageName || 'Image'} is required.`
  if (!image && !required) return true

  if (!dimensions)
    return `There has been an error with your ${imageName || 'your image'}. Please try again.`

  let isCorrectDimensions = false
  let imageShouldBeText = ''

  if (width && !height) {
    isCorrectDimensions = dimensions.width === width
    imageShouldBeText = `should be ${width}px in width.`
  } else if (height && !width) {
    isCorrectDimensions = dimensions.height === height
    imageShouldBeText = `should be ${height}px in height.`
  } else if (width && height) {
    isCorrectDimensions = dimensions.height === height && dimensions.width === width
    imageShouldBeText = `should be ${width}x${height}.`
  }

  if (minWidth && !minHeight) {
    isCorrectDimensions = dimensions.width >= minWidth
    imageShouldBeText = `should be at least ${minWidth}px in width.`
  } else if (minHeight && !minWidth) {
    isCorrectDimensions = dimensions.height >= minHeight
    imageShouldBeText = `should be at least ${minHeight}px in height.`
  } else if (minWidth && minHeight) {
    isCorrectDimensions = dimensions.width >= minWidth && dimensions.height >= minHeight
    imageShouldBeText = `should be at least ${minWidth}px in width and at least ${minHeight}px in height.`
  }

  const error = `${imageName || 'Image'} is ${dimensions.width}x${dimensions.height} and ${imageShouldBeText}`

  return isCorrectDimensions || error
}

export const getRequiredImageDimensionsValidation = ({
  width,
  height,
  minWidth,
  minHeight,
  Rule,
  required,
  addedValidation,
}: {
  width?: number
  height?: number
  Rule: Rule
  required?: boolean
  minWidth?: number
  minHeight?: number
  addedValidation?: (
    context: ValidationContext,
    dimensions?: {width: number; height: number},
  ) => string | boolean | null | undefined
}) => {
  let validation = Rule

  return validation.custom((image: {asset: {_ref: string}}, context) => {
    const {dimensions} = decodeAssetId(image?.asset?._ref)

    if (addedValidation) {
      const value = addedValidation(context, dimensions || {width: 0, height: 0})
      if (value) return value
    }

    return getImageValidation({image, width, height, required, minWidth, minHeight})
  })
}
