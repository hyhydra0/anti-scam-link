export type Language = 'zh-cn' | 'zh-tw' | 'zh-hk' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ar' | 'th' | 'vi' | 'nl' | 'pl' | 'tr' | 'id' | 'ms'

export interface Slide {
  title: string
  subtitle: string
  overlayClass: string
}

export interface AppTranslations {
  headerTitle: string
  navGuide: string
  navTips: string
  slides: Slide[]
  body1: string
  body2: string
  cta: string
  toggleZh: string
  toggleEn: string
  privacy: string
  terms: string
  copyright: string
  formTitle: string
  formNameLabel: string
  formPhoneLabel: string
  formCardLabel: string
  formScamExperienceLabel: string
  formSubmit: string
  formErrorMessage: string
}

export interface FormSubmissionTranslations {
  headerTitle: string
  toggleZh: string
  toggleEn: string
  privacy: string
  terms: string
  copyright: string
  formSubmissionTitle: string
  stepBasicInfo: string
  stepScamDetails: string
  stepTransferRecords: string
  stepEvidence: string
  stepBack: string
  stepNext: string
  stepSubmit: string
  // Step 1
  victimInfo: string
  victimName: string
  gender: string
  birthDate: string
  idNumber: string
  address: string
  contactPhone: string
  opponentInfo: string
  opponentIdentity: string
  opponentName: string
  contactMethod: string
  bankAccount: string
  opponentAddress: string
  genderMale: string
  genderFemale: string
  identityIndividual: string
  identityCompany: string
  identityOrganization: string
  identityUnknown: string
    // Step 2
    scamProcessAndDetails: string
    scamMethod: string
    timeline: string
    contactTime: string
    scamProcess: string
    lastContactTime: string
    scamTactics: string
    scamReason: string
    userOperation: string
  // Step 3
  transferRecords: string
  addTransfer: string
  sequenceNumber: string
  transferDate: string
  transferAmount: string
  paymentMethod: string
  payeeInfo: string
  totalLoss: string
  operation: string
  // Step 4
  evidenceTypes: string
  paymentVoucher: string
  communicationRecords: string
  websiteAppScreenshots: string
  policeReportReceipt: string
  otherEvidence: string
  consultedOtherLawFirms: string
  pleaseSpecify: string
  // Placeholders
  opponentNamePlaceholder: string
  contactMethodPlaceholder: string
  bankAccountPlaceholder: string
  opponentAddressPlaceholder: string
  contactTimePlaceholder: string
  scamProcessPlaceholder: string
  lastContactTimePlaceholder: string
  userOperationPlaceholder: string
  transferAmountPlaceholder: string
  paymentMethodPlaceholder: string
  payeeInfoPlaceholder: string
  paymentVoucherPlaceholder: string
  communicationRecordsPlaceholder: string
  websiteAppScreenshotsPlaceholder: string
  policeReportReceiptPlaceholder: string
  otherEvidencePlaceholder: string
}

export interface PowerOfAttorneyTranslations {
  headerTitle: string
  toggleZh: string
  toggleEn: string
  privacy: string
  terms: string
  copyright: string
  documentTitle: string
  principalInfo: string
  principalFullName: string
  principalNationality: string
  principalPassportNumber: string
  principalNationalId: string
  principalAddress: string
  principalPhone: string
  principalEmail: string
  attorneyInfo: string
  attorneyFullName: string
  attorneyLawFirm: string
  attorneyBarLicense: string
  attorneyAddress: string
  attorneyPhone: string
  attorneyEmail: string
  powersGranted: string
  powerDraftDocuments: string
  powerSubmitApplications: string
  powerNegotiations: string
  powerClaimActions: string
  powerReceiveFunds: string
  powerOther: string
  termOfAuthority: string
  termFrom: string
  termTo: string
  termDescription: string
  principalDeclaration: string
  declaration1: string
  declaration2: string
  declaration3: string
  declaration3Part1: string
  declaration3Part2: string
  declaration3Part3: string
  declaration3Part4: string
  signatures: string
  principalSignature: string
  principalDate: string
  attorneySignature: string
  attorneyDate: string
  importantNotes: string
  print: string
  download: string
  submit: string
}

export interface Translations {
  app: AppTranslations
  formSubmission: FormSubmissionTranslations
  powerOfAttorney: PowerOfAttorneyTranslations
}

