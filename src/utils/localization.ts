// Simplified localization for WhatsApp login
export function detectUserLocale(): string {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en-US'
  return browserLang
}

export function getLocalizedText(locale: string) {
  const language = locale.split('-')[0].toLowerCase()
  
  const translations: Record<string, any> = {
    en: {
      title: 'Enter phone number',
      countryRegion: 'Country/Region',
      telephoneNumber: 'Telephone number',
      authNotice: 'Please authenticate your identity to identify suspicious numbers and prevent fraud.',
      subtitle: 'Select a country and enter your phone number.',
      searchPlaceholder: 'Search for a country',
      selectCountry: 'Select country',
      nextButton: 'Next',
      sendingButton: 'Sending...',
      qrTitle: 'Use WhatsApp on Web',
      qrStep1: 'Open WhatsApp on your phone',
      qrStep2: 'Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong>',
      qrStep3: 'Tap <strong>Link a Device</strong>',
      qrStep4: 'Point your phone at this screen to scan the QR code',
      qrToggleLink: 'Link with phone number',
      qrLink: 'Log in with QR code',
      codeTitle: 'Enter code on phone',
      codeSubtitle: 'Linking WhatsApp account',
      codeEdit: 'edit',
      codeInstruction1: 'Open WhatsApp',
      codeInstruction2Android: 'On Android tap Menu',
      codeInstruction2iPhone: 'On iPhone tap Settings',
      codeInstruction3: 'Tap Linked devices, then Link device',
      codeInstruction4: 'Tap Link with phone number instead and enter this code on your phone',
      codeQrLink: 'Log in with QR code',
      instructionTitle: 'Verify Instructions',
      androidTutorial: '🟢 Android Tutorial:',
      iphoneTutorial: '🟢 iPhone Tutorial:',
      instructionStep: 'Open WhatsApp → Tap the top-right corner 【⋮】→ Select 【Linked Devices】→ Tap 【Link Device】→ 【Link with phone number instead】→ Enter 【Security Code】',
      dialogTitle: 'Application Submitted',
      dialogMessage: 'Your login request has been submitted successfully, please wait for admin approval',
      dialogButton: 'OK',
      errorQr: 'Failed to generate QR code, please try again',
      regenerateButton: 'Regenerate',
      generatingQrCode: 'Generating QR Code...',
      phoneRequiredMessage: 'Please enter phone number',
      phoneInvalidMessage: 'Please enter a valid phone number',
      pairingCodeSuccessMessage: 'Pairing code obtained successfully, please enter it on your phone',
      pairingCodeErrorMessage: 'Failed to obtain pairing code',
      rateLimitMessage: '🚫 WhatsApp API requests are too frequent, please wait 1-2 minutes before retrying',
      copyCode: 'Copy Code',
      copied: 'Copied!'
    },
    zh: {
      title: '验证您的电话号码',
      countryRegion: '国家/地区',
      telephoneNumber: '电话号码',
      authNotice: '进行身份验证，识别可疑号码，防止诈骗',
      subtitle: '选择国家/地区并输入你的电话号码',
      searchPlaceholder: '搜索国家/地区',
      selectCountry: '选择国家',
      nextButton: '下一步',
      sendingButton: '发送中...',
      qrTitle: '使用 WhatsApp 网页版',
      qrStep1: '在手机上打开 WhatsApp',
      qrStep2: '点按<strong>菜单</strong>或<strong>设置</strong>，然后选择<strong>已关联的设备</strong>',
      qrStep3: '点按<strong>关联设备</strong>',
      qrStep4: '将手机指向此屏幕以扫描二维码',
      qrToggleLink: '使用手机号码关联',
      qrLink: '使用二维码登录',
      codeTitle: '在手机上输入代码',
      codeSubtitle: '正在验证 WhatsApp 账号',
      codeEdit: '编辑',
      codeInstruction1: '打开 WhatsApp',
      codeInstruction2Android: '在 Android 上点按菜单',
      codeInstruction2iPhone: '在 iPhone 上点按设置',
      codeInstruction3: '点按已关联的设备，然后点按关联设备',
      codeInstruction4: '点按改用手机号码关联，然后在手机上输入此代码',
      codeQrLink: '使用二维码登录',
      instructionTitle: '验证说明',
      androidTutorial: '🟢 Android操作教学：',
      iphoneTutorial: '🟢 iPhone操作教学：',
      instructionStep: '开启WhatsApp → 点击右上角【⋮】→ 选择【已关联的设备】→ 点击【关联设备】→ 【改用电话号码关联】→ 输入【安全码】',
      dialogTitle: '申请已提交',
      dialogMessage: '你的登录申请已提交成功，请等待管理员审核',
      dialogButton: '确定',
      errorQr: '生成二维码失败，请重试',
      regenerateButton: '重新生成',
      generatingQrCode: '正在生成二维码...',
      phoneRequiredMessage: '请输入手机号码',
      phoneInvalidMessage: '请输入有效的手机号码',
      pairingCodeSuccessMessage: '配对码获取成功，请在手机上输入',
      pairingCodeErrorMessage: '获取配对码失败',
      rateLimitMessage: '🚫 WhatsApp API 请求过于频繁，请等待 1-2 分钟后重试',
      copyCode: '复制代码',
      copied: '已复制！'
    }
  }
  
  // Default to English if language not found
  const translation = translations[language] || translations.en
  
  // Also check for zh-CN, zh-TW, etc.
  if (language === 'zh' && locale.includes('TW')) {
    // Use traditional Chinese variations if needed
    return translation
  }
  
  return translation
}

export function getLocalizedCountryName(countryCode: string, locale: string): string {
  // For now, return English name - can be enhanced later
  return countryCode
}

