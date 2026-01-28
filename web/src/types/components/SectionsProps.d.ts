// prettier-ignore
type SectionsSchema = (
  /* INJECT_SECTIONS_TYPE */
    SanityBasicAccordion |
    SanityOurStoryScroller |
    SanityNewsList |
    SanityFeaturedArticle |
    SanityNewsSearchAndTitle |
    SanityInfoTiles |
    SanityPeopleAccordion |
    SanityTextTiles |
    SanityTextBlockWithImage |
    SanityPagePromo |
    SanityTextBlocksWithImageSwapper |
    SanityTextAccordion |
    SanityImageAndTextAccordion |
    SanityLargeTitleHeroWithMedia |
    SanityTextTickerSection |
    SanityExpandingImageAndContent |
    SanityGridContent |
    SanityNumberAndText |
    SanityHomeHero |
    SanityFactList |
    SanityExpandingCarousel |
    SanityIntroText |
    SanityImageBlocks |
    SanityQuote |
    SanityBigMedia |
    SanityBlogPostHero |
    SanitySpacer |
    SanityRichTextSection |
  SanityFourOhFour |
  SanityValuesList |
  SanityTimeline |
  SanityRichTextContent |
  SanityEventDetails |
  SanityContactForm |
  SanityAccordionItemsWithSideNavigation |
  SanityGuestServicesHero |
  SanityTextAndImageHeroWithBreadcrumbs |
  SanityRichTextHero |
  SanityEcommerceItemList |
  SanityContentCards |
  SanityGiftCardGrid |
  SanityPressHighlightListing |
  SanityTextAndAccordion |
  SanityGiftCardIframe |
  SanityMenuListing |
  SanityStaggeredImages |
  SanityMerchandiseShowcase |
  SanityEmailSignup |
  SanityReviews |
  SanityHomepageHero |
  SanityLocationsList |
  SanityMediaBackgroundAndTitle |
  SanityStats |
  SanityTextAndImage |
  SanityThreeUp |
  SanityTestComponent |
  TextAndImageHeroWithBreadcrumbs |
  LocationHero |
  BlogPost
)[]

type SectionsProps = {
  sections: SectionsSchema
  disableFooter?: boolean
}
