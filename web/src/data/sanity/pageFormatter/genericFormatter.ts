export const genericFormatter = (data: SanityPage): SanityPage => {
  if (!data?.sections) {
    data.sections = []
  }

  const sections = data.sections
  if (sections.length > 0) {
    const lastSection = sections[sections.length - 1]
    const disallowLastSpacerOnTypes = ['pagePromo', 'spacer']
    if (!disallowLastSpacerOnTypes.includes(lastSection?._type)) {
      sections.push({
        _type: 'spacer',
        desktop: 'auto',
        mobile: 'auto',
      })
    }
  }

  // spacers
  if (data?.sections?.length) {
    // eslint-disable-next-line
    data?.sections.forEach((section: any, i: number) => {
      if (section._type === 'spacer') {
        const itemBefore = (data?.sections || [])[i - 1]
        const itemAfter = (data?.sections || [])[i + 1]

        if (itemBefore && !itemBefore?.spacerSettings) {
          itemBefore.spacerSettings = {}
        }

        if (itemAfter && !itemAfter?.spacerSettings) {
          itemAfter.spacerSettings = {}
        }

        if (section?.hasLine) {
          if (itemBefore) {
            itemBefore.spacerSettings.bottomDesktop = null
            itemBefore.spacerSettings.bottomMobile = null
          }
          if (itemAfter) {
            itemAfter.spacerSettings.topDesktop = null
            itemAfter.spacerSettings.topMobile = null
          }

          section.spacerSettings = {
            topDesktop: section.topDesktop,
            topMobile: section.topMobile,
            bottomDesktop: section.bottomDesktop,
            bottomMobile: section.bottomMobile,
          }
        }

        if (!section?.hasLine) {
          const desktopSpacing = section?.desktop || 'auto'
          const mobileSpacing = section?.mobile || 'auto'
          if (itemBefore) {
            itemBefore.spacerSettings.bottomDesktop = desktopSpacing
            itemBefore.spacerSettings.bottomMobile = mobileSpacing
          }
          if (itemAfter) {
            itemAfter.spacerSettings.topDesktop = desktopSpacing
            itemAfter.spacerSettings.topMobile = mobileSpacing
          }
        }
      }
    })
  }

  return data
}
