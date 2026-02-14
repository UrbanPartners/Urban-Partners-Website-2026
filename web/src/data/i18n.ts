import { LANGUAGES } from '@/data'

// prettier-ignore
const I18N_ENGLISH = {
  // Blog
  postedBy: 'Posted by #{author}',
  readingTime: '#{readingTimeMinutes} min read',
  caseStudy: 'Case Study',
  readArticle: 'Read Article',
  numberOfArticles: '#{count} articles',
  resultsForTerm: 'Results for "#{term}"',
  resultsForCategory: 'Category: #{category}',
  resultsForReference: 'Referenced by #{reference}',

  // Case study
  location: 'Location',
  country: 'Country',
  transactionYear: 'Transaction Year',
  sector: 'Sector',
  fund: 'Fund',
  type: 'Type',
  size: 'Size (m²)',

  // Video
  playVideo: 'Play Video',
  pauseVideo: 'Pause Video',
}

const I18N_DK = {
  postedBy: 'Skrevet af #{author}',
  readingTime: '#{readingTimeMinutes} min læsetid',
  caseStudy: 'Case',
  readArticle: 'Læs artiklen',
  numberOfArticles: '#{count} Artikler',
  resultsForTerm: 'Resultater for "#{term}"',
  resultsForCategory: 'Kategori: #{category}',
  resultsForReference: 'Omtalt i #{reference}',
  location: 'Lokation',
  country: 'Land',
  transactionYear: 'Transaktionsår',
  sector: 'Sektor',
  fund: 'Fond',
  size: 'Størrelse (m²)',
  playVideo: 'Afspil video',
  pauseVideo: 'Sæt videon på pause',
}

const I18N_SE = {
  postedBy: 'Publicerad av #{author}',
  readingTime: '#{readingTimeMinutes} min lästid',
  caseStudy: 'Case',
  readArticle: 'Läs artikeln',
  numberOfArticles: '#{räkna} artiklar',
  resultsForTerm: 'Resultat för "#{term}"',
  resultsForCategory: 'Kategori: #{category}',
  resultsForReference: 'Omnämnd av #{reference}',
  location: 'Plats',
  country: 'Land',
  transactionYear: 'Transaktionsår',
  sector: 'Sektor or Bransch',
  fund: 'Fond',
  size: 'Storlek  (m²)',
  playVideo: 'Spela upp video',
  pauseVideo: 'Pausa video',
}

const I18N_DE = {
  postedBy: 'Veröffentlicht von #{author}',
  readingTime: '#{readingTimeMinutes} min lesezeit',
  caseStudy: 'Fallstudie',
  readArticle: 'Artikel lesen',
  numberOfArticles: '#{count} Artikel',
  resultsForTerm: 'Ergebnisse für "#{term}"',
  resultsForCategory: 'Kategorie: #{category}',
  resultsForReference: 'Referenziert von #{reference}',
  location: 'Standort',
  country: 'Land',
  transactionYear: 'Transaktionsjahr',
  sector: 'Sektor',
  fund: 'Fonds',
  size: 'Größe (m²)',
  playVideo: 'Video abspielen',
  pauseVideo: 'Video pausieren',
}

const I18N_FI = {
  postedBy: 'Julkaissut #{author}',
  readingTime: '#{readingTimeMinutes} min lukuaika.',
  caseStudy: 'Case ',
  readArticle: 'Lue artikkeli',
  numberOfArticles: '#{count} artikkelia',
  resultsForTerm: 'Tulokset  "#{term}"',
  resultsForCategory: 'Kategoria: #{category}',
  resultsForReference: 'Mainittu  #{reference}',
  location: 'Sijainti',
  country: 'Maa',
  transactionYear: 'Sijoitusvuosi',
  sector: 'Sektori',
  fund: 'Rahasto',
  size: 'Koko (m²)',
  playVideo: 'Toista video',
  pauseVideo: 'Pysäytä video',
}

const I18N_PL = {
  postedBy: 'Opublikowane przez #{author}',
  readingTime: '#{readingTimeMinutes} min czytania',
  caseStudy: 'Case Study',
  readArticle: 'Przeczytaj artykuł',
  numberOfArticles: '#{count} artykułów',
  resultsForTerm: 'Wyniki dla  "#{term}"',
  resultsForCategory: 'Kategoria: #{category}',
  resultsForReference: 'Wspomniane w #{reference}',
  location: 'Lokalizacja',
  country: 'Kraj',
  transactionYear: 'Data transakcji',
  sector: 'Sektor',
  fund: 'Fundusz',
  size: 'Powierzchnia (m²)',
  playVideo: 'Odtwórz video',
  pauseVideo: 'Wstrzymaj video',
}

const I18N_NO = {
  postedBy: 'Skrevet av #{author}',
  readingTime: '#{readingTimeMinutes} min lesetid',
  caseStudy: 'Case studie',
  readArticle: 'Lese en artikkel',
  numberOfArticles: '#{count} artikler',
  resultsForTerm: 'Resultat for "#{term}"',
  resultsForCategory: 'Kategori: #{category}',
  resultsForReference: 'Referanse #{reference}',
  location: 'Lokasjon',
  country: 'Land',
  transactionYear: 'Transaksjons år',
  sector: 'Sektor',
  fund: 'Fond',
  size: 'Størrelse  (m²)',
  playVideo: 'Spill film',
  pauseVideo: 'Pause film',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLangMerged = (langObject: any) => {
  return {
    ...I18N_ENGLISH,
    ...langObject,
  }
}

export const I18N_TEXT = {
  [LANGUAGES.EN]: I18N_ENGLISH,
  [LANGUAGES.DK]: getLangMerged(I18N_DK),
  [LANGUAGES.SE]: getLangMerged(I18N_SE),
  [LANGUAGES.DE]: getLangMerged(I18N_DE),
  [LANGUAGES.FI]: getLangMerged(I18N_FI),
  [LANGUAGES.PL]: getLangMerged(I18N_PL),
  [LANGUAGES.NO]: getLangMerged(I18N_NO),
}
