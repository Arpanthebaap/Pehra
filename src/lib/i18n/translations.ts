import type { Language, Verdict } from "@/lib/schema";

export interface UiTranslations {
  tagline: string;
  textSize: string;
  formHeading: string;
  formHint: string;
  languageSelectLabel: string;
  documentLabel: string;
  placeholder: string;
  privacyHint: string;
  btnRead: string;
  btnReading: string;
  btnExample: string;
  samplesLabel: string;
  btnExportPrint: string;
  btnCopyBriefing: string;
  copiedBriefing: string;
  checklistTitle: string;
  legalAidClinicTitle: string;
  characters: string;
  tooShort: string;
  tooLong: string;
  analyzingHint: string;
  stoppedHeading: string;
  summaryHeading: string;
  btnSpeak: string;
  maskedPrefix: string;
  clausesHeading: string;
  clausesHint: string;
  discardedHint: (count: number) => string;
  deadlinesHeading: string;
  questionsHeading: string;
  legalAidHint: string;
  footerText: string;
  modeAnalyze: string;
  modeCompare: string;
  compareHeading: string;
  compareHint: string;
  compareOriginalLabel: string;
  compareModifiedLabel: string;
  btnCompare: string;
  btnComparing: string;
  comparePresetsLabel: string;
  riskDeltaLabels: {
    higher_risk: string;
    similar_risk: string;
    improved: string;
  };
  changeCategoryLabels: {
    new_obligation: string;
    removed_protection: string;
    altered_term: string;
    neutral: string;
  };
  keyTakeawayHeading: string;
  qaTitle: string;
  qaHint: string;
  qaPlaceholder: string;
  btnAsk: string;
  btnAsking: string;
  qaRelevantClauses: string;
  qaStatuteHeading: string;
  qaLegalAidHeading: string;
  quickQuestionsLabel: string;
  inconsistenciesHeading: string;
  inconsistenciesHint: string;
  inconsistenciesEmpty: string;
  optionsHeading: string;
  optionsHint: string;
  optionCategoryLabels: {
    negotiation: string;
    dispute_resolution: string;
    legal_aid: string;
    pre_signing: string;
  };
  actionableChecklistHeading: string;
  checklistProgress: (done: number, total: number) => string;
  btnDownloadBrief: string;
  downloadedToast: string;
  verdictLabels: Record<Verdict, string>;
  confidenceNotes: {
    high: null;
    medium: string;
    low: string;
  };
  whatMeansForYou: string;
  absentProtectionAria: string;
  findingsEmpty: string;
  clockHero: {
    closedDaysAgo: (days: number) => string;
    lastDay: string;
    daysLeft: (days: number) => string;
    dateToWorkTo: string;
    customaryNotice: string;
  };
  deadlines: {
    empty: string;
    remainingDays: (days: number) => string;
    closedDaysAgo: (days: number) => string;
    countedFrom: string;
  };
  disclaimer: {
    heading: string;
    p1: string;
    p2: string;
  };
}

export const TRANSLATIONS: Record<Language, UiTranslations> = {
  en: {
    tagline: "Read the paperwork before it reads you. Built for India.",
    textSize: "Text size",
    formHeading: "What are you being asked to sign?",
    formHint:
      "Paste a rent agreement, a job contract, a loan document, an app’s terms, or a legal notice you have received. Pehra reads it against Indian law and tells you three things: which clauses cannot bind you, which protections are missing, and which deadlines are already running against you.",
    languageSelectLabel: "Answer me in",
    documentLabel: "The document",
    placeholder: "Paste the text here.",
    privacyHint:
      "Nothing you paste is stored. Aadhaar numbers, PAN, phone numbers, email addresses and account numbers are masked in your browser before the text is sent anywhere. Pattern matching is not perfect, so remove anything you would not want read by a stranger.",
    btnRead: "Read this document",
    btnReading: "Reading…",
    btnExample: "Load an example",
    samplesLabel: "Try an example document:",
    btnExportPrint: "Print / Save as PDF for Lawyer",
    btnCopyBriefing: "Copy case briefing",
    copiedBriefing: "Briefing copied to clipboard",
    checklistTitle: "Actionable Legal Checklist",
    legalAidClinicTitle: "Legal Aid Briefing (NALSA / DLSA)",
    characters: "characters",
    tooShort: " — too short to read",
    tooLong: " — too long, paste the parts you are worried about",
    analyzingHint: "Reading the document against Indian law…",
    stoppedHeading: "Pehra stopped",
    summaryHeading: "What this document is",
    btnSpeak: "Read this aloud",
    maskedPrefix: "Masked before sending: ",
    clausesHeading: "Clause by clause",
    clausesHint:
      "Struck-through backgrounds mark protections that are absent from the document rather than present in it.",
    discardedHint: (count: number) =>
      `Pehra dropped ${count} finding${count === 1 ? "" : "s"} it could not tie to a specific provision. It would rather say less than say something you might act on and find is not the law.`,
    deadlinesHeading: "Clocks that are already running",
    questionsHeading: "Take these questions to a lawyer",
    legalAidHint:
      "Legal aid is free if you qualify under s. 12 of the Legal Services Authorities Act. Walk into the District Legal Services Authority at your district court, or call 15100.",
    footerText:
      "Pehra reads against a fixed corpus of Indian statutory provisions and cites every one of them. It never stores your document. Analysis is generated by Google Gemini and constrained to that corpus.",
    modeAnalyze: "Single Document Analyzer",
    modeCompare: "Compare Contracts & Policies",
    compareHeading: "Compare Two Contract Versions or Policies",
    compareHint:
      "Paste the original agreement (or model policy) on the left, and modified renewal/amendment on the right. Pehra checks for added penalties, slipped-in restrictions, and stripped statutory protections.",
    compareOriginalLabel: "Original Agreement / Base Document (Version A)",
    compareModifiedLabel: "Renewal / Amendment / Modified Document (Version B)",
    btnCompare: "Compare both documents",
    btnComparing: "Comparing documents…",
    comparePresetsLabel: "Try a comparison preset:",
    riskDeltaLabels: {
      higher_risk: "Higher Risk in Revision",
      similar_risk: "Similar Risk Profile",
      improved: "Improved Terms / Lower Risk",
    },
    changeCategoryLabels: {
      new_obligation: "New Obligation Added",
      removed_protection: "Protection Removed",
      altered_term: "Altered Term",
      neutral: "Administrative Update",
    },
    keyTakeawayHeading: "Negotiation Takeaway & Next Step",
    qaTitle: "Ask Questions on This Document",
    qaHint:
      "Have a specific concern about deposit deductions, notice periods, or non-compete clauses? Ask Pehra for a grounded answer citing Indian statutory provisions.",
    qaPlaceholder: "e.g., Can my landlord forfeit my entire deposit if I leave early?",
    btnAsk: "Ask Question",
    btnAsking: "Consulting corpus…",
    qaRelevantClauses: "Relevant Clauses in Document",
    qaStatuteHeading: "Applicable Indian Law & Protection",
    qaLegalAidHeading: "Questions for Legal Aid (NALSA 15100)",
    quickQuestionsLabel: "Suggested questions:",
    inconsistenciesHeading: "Clause-against-clause Inconsistencies & Contradictions",
    inconsistenciesHint:
      "Pehra checks the document for internal contradictions — clauses where one term grants a right or notice period that another term silently takes away or conflicts with.",
    inconsistenciesEmpty: "No internal clause-against-clause contradictions detected.",
    optionsHeading: "Your Legal Options & Potential Next Steps",
    optionsHint:
      "Practical paths you can choose depending on whether you have already signed or are negotiating before signing.",
    optionCategoryLabels: {
      negotiation: "Negotiation & Redlining",
      dispute_resolution: "Dispute Redressal & Consumer Forum",
      legal_aid: "Free Legal Aid (NALSA 15100)",
      pre_signing: "Pre-signing Protective Steps",
    },
    actionableChecklistHeading: "Actionable Legal Checklist",
    checklistProgress: (done: number, total: number) =>
      `${done} of ${total} action items completed`,
    btnDownloadBrief: "Download Case Brief (.txt)",
    downloadedToast: "Case brief downloaded to your device",
    verdictLabels: {
      void: "Not binding on you",
      one_sided: "Legal, but weighted against you",
      standard: "Ordinary",
      missing: "Protection missing",
    },
    confidenceNotes: {
      high: null,
      medium: "Pehra is fairly sure about this one, but check it with a lawyer.",
      low: "Pehra is unsure about this one. Treat it as a question to ask, not a fact.",
    },
    whatMeansForYou: "What that means for you: ",
    absentProtectionAria: "Not present in the document:",
    findingsEmpty:
      "Pehra found nothing in this text that it could tie to a provision it knows. That is not a clean bill of health - it may mean the document falls outside what Pehra covers. Take it to a legal aid lawyer.",
    clockHero: {
      closedDaysAgo: (days: number) =>
        `That window closed ${days} ${days === 1 ? "day" : "days"} ago`,
      lastDay: "Today is the last day",
      daysLeft: (days: number) => `${days} ${days === 1 ? "day" : "days"} left`,
      dateToWorkTo: "The date to work to is",
      customaryNotice:
        " This one is convention rather than statute - check the document for the exact period it gives you.",
    },
    deadlines: {
      empty:
        "No dates were written in this document, so there is no clock to run yet. If you know the date the problem started, add it to the text and read it again.",
      remainingDays: (days: number) => `${days} days remaining. `,
      closedDaysAgo: (days: number) => `Closed ${days} days ago. `,
      countedFrom: "Counted from: ",
    },
    disclaimer: {
      heading: "Pehra is not your lawyer",
      p1: "This is legal information, not legal advice. Pehra reads your document against a fixed set of Indian statutory provisions and shows you what it finds. It does not know your full situation, your State’s local law, or anything that is not on the page you gave it.",
      p2: "Free legal aid is a right, not a favour. Your District Legal Services Authority sits in the district court complex, and the NALSA helpline is 15100.",
    },
  },

  hi: {
    tagline: "कागज़ात को अपने ऊपर हावी होने से पहले खुद समझें। भारत के लिए निर्मित।",
    textSize: "फ़ॉन्ट का आकार",
    formHeading: "आपसे क्या हस्ताक्षर करने के लिए कहा जा रहा है?",
    formHint:
      "किराया समझौता, नौकरी का अनुबंध, ऋण दस्तावेज़, किसी ऐप की शर्तें, या प्राप्त हुआ कोई कानूनी नोटिस यहाँ चिपकाएँ। पहरा इसे भारतीय कानून के तहत पढ़ता है और आपको तीन बातें बताता है: कौन सी धाराएं आप पर लागू नहीं हो सकतीं, कौन सी सुरक्षाएं गायब हैं, और कौन सी समय सीमाएं आपके खिलाफ पहले से चल रही हैं।",
    languageSelectLabel: "मुझे जवाब दें",
    documentLabel: "दस्तावेज़",
    placeholder: "यहाँ टेक्स्ट पेस्ट करें।",
    privacyHint:
      "आपके द्वारा पेस्ट की गई कोई भी जानकारी सुरक्षित नहीं की जाती। आधार नंबर, पैन, फोन नंबर, ईमेल पते और बैंक खाता नंबर कहीं भी भेजे जाने से पहले आपके ब्राउज़र में ही छिपा (मास्क) दिए जाते हैं। पैटर्न मिलान पूर्णतः त्रुटिहीन नहीं है, इसलिए ऐसी कोई भी बात हटा दें जिसे आप किसी अजनबी द्वारा नहीं पढ़ा जाना चाहते।",
    btnRead: "यह दस्तावेज़ पढ़ें",
    btnReading: "पढ़ा जा रहा है…",
    btnExample: "उदाहरण लोड करें",
    samplesLabel: "उदाहरण दस्तावेज़ चुनें:",
    btnExportPrint: "वकील के लिए प्रिंट / PDF सहेजें",
    btnCopyBriefing: "केस का विवरण कॉपी करें",
    copiedBriefing: "विवरण क्लिपबोर्ड पर कॉपी किया गया",
    checklistTitle: "कार्रवाई योग्य कानूनी चेकलिस्ट",
    legalAidClinicTitle: "कानूनी सहायता केस विवरण (नालसा / डीएलएसए)",
    characters: "अक्षर",
    tooShort: " — पढ़ने के लिए बहुत छोटा है",
    tooLong: " — बहुत लंबा है, केवल वे हिस्से पेस्ट करें जिनकी आपको चिंता है",
    analyzingHint: "भारतीय कानून के आधार पर दस्तावेज़ पढ़ा जा रहा है…",
    stoppedHeading: "पहरा रुक गया",
    summaryHeading: "यह दस्तावेज़ क्या है",
    btnSpeak: "इसे बोलकर सुनाएँ",
    maskedPrefix: "भेजने से पहले छिपाया गया: ",
    clausesHeading: "धारा दर धारा विश्लेषण",
    clausesHint:
      "स्ट्राइक-थ्रू (कटा हुआ) बैकग्राउंड उन सुरक्षाओं को दर्शाता है जो दस्तावेज़ में मौजूद होने के बजाय गायब हैं।",
    discardedHint: (count: number) =>
      `पहरा ने ${count} निष्कर्ष हटा दिए जिन्हें वह किसी विशिष्ट कानूनी प्रावधान से नहीं जोड़ सका। यह कुछ गलत कहने के बजाय कम कहना बेहतर समझता है।`,
    deadlinesHeading: "समय सीमाएं जो पहले से चल रही हैं",
    questionsHeading: "ये सवाल किसी वकील के पास लेकर जाएँ",
    legalAidHint:
      "यदि आप विधिक सेवा प्राधिकरण अधिनियम की धारा 12 के तहत पात्र हैं तो कानूनी सहायता मुफ्त है। अपनी जिला अदालत में जिला विधिक सेवा प्राधिकरण से संपर्क करें, या 15100 पर कॉल करें।",
    footerText:
      "पहरा भारतीय कानूनी प्रावधानों के एक निश्चित संग्रह के आधार पर पढ़ता है और उनमें से प्रत्येक को उद्धृत करता है। यह आपके दस्तावेज़ को कभी संग्रहीत नहीं करता। विश्लेषण गूगल जेमिनी द्वारा तैयार किया गया है और उसी संग्रह तक सीमित है।",
    modeAnalyze: "एकल दस्तावेज़ विश्लेषक",
    modeCompare: "अनुबंध व नीति तुलना",
    compareHeading: "दो अनुबंधों या नीतियों की तुलना करें",
    compareHint:
      "बाएं मूल समझौता (या मानक नीति) और दाएं संशोधित नवीनीकरण/संशोधन पेस्ट करें। पहरा नए जोड़े गए जुर्माने, छिपी पाबंदियों और हटाई गई कानूनी सुरक्षाओं की जांच करता है।",
    compareOriginalLabel: "मूल समझौता / प्राथमिक दस्तावेज़ (संस्करण A)",
    compareModifiedLabel: "नवीनीकरण / संशोधन / नया दस्तावेज़ (संस्करण B)",
    btnCompare: "दोनों दस्तावेज़ों की तुलना करें",
    btnComparing: "तुलना की जा रही है…",
    comparePresetsLabel: "तुलना का उदाहरण चुनें:",
    riskDeltaLabels: {
      higher_risk: "संशोधन में अधिक जोखिम",
      similar_risk: "समान जोखिम स्तर",
      improved: "बेहतर शर्तें / कम जोखिम",
    },
    changeCategoryLabels: {
      new_obligation: "नया दायित्व जोड़ा गया",
      removed_protection: "सुरक्षा हटा दी गई",
      altered_term: "शर्त में बदलाव",
      neutral: "प्रशासनिक बदलाव",
    },
    keyTakeawayHeading: "बातचीत का मुख्य बिंदु व अगला कदम",
    qaTitle: "इस दस्तावेज़ के बारे में सवाल पूछें",
    qaHint:
      "जमानत राशि कटौती, नोटिस अवधि, या अपने अधिकारों के बारे में कोई शंका है? भारतीय कानूनी धाराओं के संदर्भ में सीधा उत्तर पाएं।",
    qaPlaceholder: "उदा. क्या समय से पहले खाली करने पर मकान मालिक पूरी जमानत राशि ज़ब्त कर सकता है?",
    btnAsk: "सवाल पूछें",
    btnAsking: "कानून जांचा जा रहा है…",
    qaRelevantClauses: "दस्तावेज़ के संबंधित खंड",
    qaStatuteHeading: "लागू भारतीय कानून व सुरक्षा",
    qaLegalAidHeading: "कानूनी सहायता के लिए प्रश्न (नालसा 15100)",
    quickQuestionsLabel: "सुझाए गए प्रश्न:",
    inconsistenciesHeading: "धारा-बनाम-धारा आंतरिक अंतर्विरोध व विसंगतियां",
    inconsistenciesHint:
      "पहरा दस्तावेज़ की आंतरिक विसंगतियों की जांच करता है — जहां एक खंड अधिकार या नोटिस अवधि देता है और दूसरा खंड चुपके से उसे छीन लेता है।",
    inconsistenciesEmpty: "इस दस्तावेज़ में कोई आंतरिक अंतर्विरोध नहीं मिला।",
    optionsHeading: "आपके कानूनी विकल्प व संभावित अगले कदम",
    optionsHint:
      "व्यावहारिक रास्ते जो आप हस्ताक्षर करने से पहले या बाद में अपना सकते हैं।",
    optionCategoryLabels: {
      negotiation: "बातचीत व संशोधन (रेडलाइनिंग)",
      dispute_resolution: "विवाद निवारण व उपभोक्ता फोरम",
      legal_aid: "मुफ्त कानूनी सहायता (नालसा 15100)",
      pre_signing: "हस्ताक्षर से पहले सुरक्षात्मक कदम",
    },
    actionableChecklistHeading: "कार्रवाई योग्य कानूनी चेकलिस्ट",
    checklistProgress: (done: number, total: number) =>
      `${total} में से ${done} कार्य पूरे हुए`,
    btnDownloadBrief: "केस विवरण डाउनलोड करें (.txt)",
    downloadedToast: "केस विवरण आपके डिवाइस पर डाउनलोड हो गया",
    verdictLabels: {
      void: "आप पर बाध्यकारी नहीं है",
      one_sided: "कानूनी है, पर आपके विरुद्ध झुका हुआ है",
      standard: "सामान्य",
      missing: "सुरक्षा गायब है",
    },
    confidenceNotes: {
      high: null,
      medium: "पहरा इस बारे में काफी हद तक आश्वस्त है, लेकिन किसी वकील से इसकी पुष्टि ज़रूर करें।",
      low: "पहरा इस बारे में अनिश्चित है। इसे पूछने योग्य सवाल समझें, कोई तथ्य नहीं।",
    },
    whatMeansForYou: "आपके लिए इसका क्या मतलब है: ",
    absentProtectionAria: "दस्तावेज़ में मौजूद नहीं है:",
    findingsEmpty:
      "पहरा को इस दस्तावेज़ में ऐसा कुछ नहीं मिला जिसे वह अपने ज्ञात कानूनी प्रावधानों से जोड़ सके। इसका मतलब यह नहीं है कि दस्तावेज़ पूरी तरह सुरक्षित है - हो सकता है कि दस्तावेज़ पहरा के दायरे से बाहर हो। इसे किसी कानूनी सहायता वकील को दिखाएं।",
    clockHero: {
      closedDaysAgo: (days: number) => `यह समय सीमा ${days} दिन पहले समाप्त हो चुकी है`,
      lastDay: "आज आखिरी दिन है",
      daysLeft: (days: number) => `${days} दिन बचे हैं`,
      dateToWorkTo: "कार्य करने की अंतिम तिथि",
      customaryNotice:
        " यह कानून के बजाय प्रथागत है - सटीक समय सीमा के लिए दस्तावेज़ देखें।",
    },
    deadlines: {
      empty:
        "इस दस्तावेज़ में कोई तारीख नहीं लिखी थी, इसलिए अभी कोई समय सीमा लागू नहीं है। यदि आप जानते हैं कि समस्या किस तारीख को शुरू हुई थी, तो उसे टेक्स्ट में जोड़ें और दोबारा पढ़ें।",
      remainingDays: (days: number) => `${days} दिन शेष। `,
      closedDaysAgo: (days: number) => `${days} दिन पहले समाप्त। `,
      countedFrom: "गणना की गई: ",
    },
    disclaimer: {
      heading: "पहरा आपका वकील नहीं है",
      p1: "यह कानूनी जानकारी है, कानूनी सलाह नहीं। पहरा भारतीय कानूनी प्रावधानों के एक निश्चित संग्रह के आधार पर आपके दस्तावेज़ को पढ़ता है और जो मिलता है वह आपको दिखाता है। यह आपकी पूरी स्थिति, आपके राज्य के स्थानीय कानून, या आपके द्वारा दिए गए पृष्ठ के बाहर की किसी भी बात से अवगत नहीं है।",
      p2: "मुफ्त कानूनी सहायता एक अधिकार है, कोई उपकार नहीं। आपका जिला विधिक सेवा प्राधिकरण जिला अदालत परिसर में बैठता है, और नालसा (NALSA) हेल्पलाइन 15100 है।",
    },
  },

  bn: {
    tagline: "কাগজপত্র আপনাকে বোঝার আগেই আপনি তা বুঝে নিন। ভারতের জন্য তৈরি।",
    textSize: "হরফের আকার",
    formHeading: "আপনাকে কী স্বাক্ষর করতে বলা হচ্ছে?",
    formHint:
      "ভাড়া চুক্তি, চাকরির চুক্তি, ঋণের নথি, কোনো অ্যাপের শর্তাবলী বা আপনার পাওয়া আইনি নোটিশ এখানে পেস্ট করুন। পাহারা ভারতীয় আইনের ভিত্তিতে এটি পড়ে আপনাকে তিনটি বিষয় জানায়: কোন ধারাগুলি আপনার ওপর বাধ্যতামূলক নয়, কোন সুরক্ষাগুলি অনুপস্থিত, এবং কোন সময়সীমাগুলি ইতিমধ্যে আপনার বিরুদ্ধে চলছে।",
    languageSelectLabel: "আমাকে উত্তর দিন",
    documentLabel: "নথি",
    placeholder: "এখানে টেক্সট পেস্ট করুন।",
    privacyHint:
      "আপনার পেস্ট করা কোনো তথ্য সংরক্ষণ করা হয় না। কোনো কিছু পাঠানোর আগেই আপনার ব্রাউজারে আধার নম্বর, প্যান, ফোন নম্বর, ইমেল এবং অ্যাকাউন্ট নম্বর মাস্ক করে দেওয়া হয়। প্যাটার্ন শনাক্তকরণ শতভাগ নিখুঁত নাও হতে পারে, তাই অচেনা কেউ পড়ুক এমন না চাইলে সংবেদনশীল তথ্য সরিয়ে নিন।",
    btnRead: "এই নথিটি পড়ুন",
    btnReading: "পড়া হচ্ছে…",
    btnExample: "একটি উদাহরণ লোড করুন",
    samplesLabel: "একটি উদাহরণ নথি বেছে নিন:",
    btnExportPrint: "আইনজীবীর জন্য প্রিন্ট / PDF সংরক্ষণ করুন",
    btnCopyBriefing: "কেসের বিবরণ কপি করুন",
    copiedBriefing: "বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে",
    checklistTitle: "কার্যকরী আইনি চেকলিস্ট",
    legalAidClinicTitle: "আইনি সহায়তা কেস বিবরণ (নালসা / ডিএলএসএ)",
    characters: "অক্ষর",
    tooShort: " — পড়ার জন্য খুব সংক্ষিপ্ত",
    tooLong: " — অতিরিক্ত দীর্ঘ, যে অংশগুলো নিয়ে আপনি চিন্তিত শুধু সেগুলো পেস্ট করুন",
    analyzingHint: "ভারতীয় আইনের ভিত্তিতে নথিটি বিশ্লেষণ করা হচ্ছে…",
    stoppedHeading: "পাহারা থেমে গেছে",
    summaryHeading: "এই নথিটি আসলে কী",
    btnSpeak: "এটি পড়ে শোনান",
    maskedPrefix: "পাঠানোর আগে মাস্ক করা হয়েছে: ",
    clausesHeading: "ধারাবাহিক বিশ্লেষণ",
    clausesHint:
      "স্ট্রাইক-থ্রু ব্যাকগ্রাউন্ড সেই সুরক্ষাগুলোকে নির্দেশ করে যা নথিতে থাকার কথা ছিল কিন্তু অনুপস্থিত।",
    discardedHint: (count: number) =>
      `পাহারা এমন ${count}টি ফলাফল বাদ দিয়েছে যা নির্দিষ্ট কোনো আইনের সাথে সরাসরি মেলানো যায়নি। এমন কিছু বলার চেয়ে কম বলা শ্রেয় যা আইনের ভিত্তিহীন হতে পারে।`,
    deadlinesHeading: "সময়সীমা যা ইতিমধ্যে চলছে",
    questionsHeading: "এই প্রশ্নগুলো একজন আইনজীবীকে করুন",
    legalAidHint:
      "আইনি পরিষেবা কর্তৃপক্ষ আইনের ১২ ধারা অনুযায়ী যোগ্য হলে আইনি সহায়তা সম্পূর্ণ বিনামূল্যে। আপনার জেলা আদালতের জেলা আইনি পরিষেবা কর্তৃপক্ষের কাছে যান বা ১৫১০০ নম্বরে কল করুন।",
    footerText:
      "পাহারা ভারতীয় আইনের একটি নির্দিষ্ট সংকলনের ভিত্তিতে বিশ্লেষণ করে এবং প্রতিটির সুনির্দিষ্ট উল্লেখ দেয়। এটি কখনই আপনার নথি সংরক্ষণ করে না। বিশ্লেষণটি গুগল জেমিনাই দ্বারা পরিচালিত এবং সংকলনটির মধ্যেই সীমাবদ্ধ।",
    modeAnalyze: "একক নথি বিশ্লেষক",
    modeCompare: "চুক্তি ও নীতি তুলনা",
    compareHeading: "দুটি চুক্তি বা সংস্করণের তুলনা করুন",
    compareHint:
      "বামে মূল চুক্তি এবং ডানে পরিবর্তিত চুক্তি বা পুনর্নবীকরণ পেস্ট করুন। পাহারা নতুন জরিমানা, গোপনে যোগ করা বিধিনিষেধ এবং অপসারিত আইনি সুরক্ষা চিহ্নিত করবে।",
    compareOriginalLabel: "मूल চুক্তি / প্রাথমিক নথি (সংস্করণ ক)",
    compareModifiedLabel: "পুনর্নবীকরণ / সংশোধিত নথি (সংস্করণ খ)",
    btnCompare: "উভয় নথির তুলনা করুন",
    btnComparing: "তুলনা করা হচ্ছে…",
    comparePresetsLabel: "তুলনার নমুনা দেখুন:",
    riskDeltaLabels: {
      higher_risk: "সংশোধনে অধিক ঝুঁকি",
      similar_risk: "অনুরূপ ঝুঁকি",
      improved: "উন্নত শর্তাবলী / কম ঝুঁকি",
    },
    changeCategoryLabels: {
      new_obligation: "নতুন বাধ্যবাধকতা যুক্ত হয়েছে",
      removed_protection: "সুরক্ষা প্রত্যাহার করা হয়েছে",
      altered_term: "শর্তের পরিবর্তন",
      neutral: "প্রশাসনিক আপডেট",
    },
    keyTakeawayHeading: "আলোচনার প্রধান বিষয় ও পরবর্তী পদক্ষেপ",
    qaTitle: "এই নথি সম্পর্কে কোনো প্রশ্ন করুন",
    qaHint:
      "জামানত অর্থ কর্তন, নোটিশের সময় বা অধিকার নিয়ে কোনো সন্দেহ রয়েছে? ভারতীয় আইনের ধারার ভিত্তিতে সরাসরি উত্তর জানুন।",
    qaPlaceholder: "যেমন: আমি আগে বাড়ি ছাড়লে কি বাড়িওয়ালা সম্পূর্ণ জামানত বাজেয়াপ্ত করতে পারে?",
    btnAsk: "প্রশ্ন করুন",
    btnAsking: "আইন যাচাই করা হচ্ছে…",
    qaRelevantClauses: "নথির প্রাসঙ্গিক ধারা",
    qaStatuteHeading: "প্রযোজ্য ভারতীয় আইন ও সুরক্ষা",
    qaLegalAidHeading: "আইনি সহায়তার কাছে রাখার মতো প্রশ্ন (নালসা ১৫১০০)",
    quickQuestionsLabel: "প্রস্তাবিত প্রশ্নাবলী:",
    inconsistenciesHeading: "ধারা-বনাম-ধারা অভ্যন্তরীণ অসঙ্গতি ও বিরোধ",
    inconsistenciesHint:
      "পাহারা নথির ভেতরের পরস্পরবিরোধী ধারা চিহ্নিত করে — যেখানে একটি শর্ত কোনো অধিকার বা নোটিশের সুযোগ দেয় কিন্তু অন্য কোনো শর্ত গোপনে তা বাতিল করে।",
    inconsistenciesEmpty: "এই নথিতে কোনো অভ্যন্তরীণ পরস্পরবিরোধী শর্ত পাওয়া যায়নি।",
    optionsHeading: "আপনার আইনি বিকল্প ও সম্ভাব্য পরবর্তী পদক্ষেপ",
    optionsHint:
      "স্বাক্ষর করার আগে বা স্বাক্ষর করার পর আপনার গ্রহণ করার মতো বাস্তবিক পদক্ষেপসমূহ।",
    optionCategoryLabels: {
      negotiation: "আলোচনা ও সংশোধন (রেডলাইনিং)",
      dispute_resolution: "বিরোধ নিষ্পত্তি ও ভোক্তা আদালত",
      legal_aid: "বিনামূল্যে আইনি সহায়তা (নালসা ১৫১০০)",
      pre_signing: "স্বাক্ষর করার আগের সতর্কতামূলক পদক্ষেপ",
    },
    actionableChecklistHeading: "কার্যকরী আইনি চেকলিস্ট",
    checklistProgress: (done: number, total: number) =>
      `${total}টির মধ্যে ${done}টি কাজ সম্পন্ন হয়েছে`,
    btnDownloadBrief: "কেস বিবরণ ডাউনলোড করুন (.txt)",
    downloadedToast: "কেস বিবরণ আপনার ডিভাইসে ডাউনলোড হয়েছে",
    verdictLabels: {
      void: "আপনার জন্য বাধ্যতামূলক নয়",
      one_sided: "আইনগত, তবে আপনার প্রতিকূলে ঝুঁকে রয়েছে",
      standard: "স্বাভাবিক",
      missing: "সুরক্ষা অনুপস্থিত",
    },
    confidenceNotes: {
      high: null,
      medium: "পাহারা এই বিষয়ে মোটামুটি নিশ্চিত, তবে একজন আইনজীবীর সাথে যাচাই করে নিন।",
      low: "পাহারা এই বিষয়ে নিশ্চিত নয়। এটিকে তথ্যের বদলে আইনজীবীকে জিজ্ঞাসা করার মতো একটি প্রশ্ন হিসেবে বিবেচনা করুন।",
    },
    whatMeansForYou: "আপনার জন্য এর অর্থ: ",
    absentProtectionAria: "নথিতে উপস্থিত নেই:",
    findingsEmpty:
      "পাহারা এই টেক্সটে এমন কিছু খুঁজে পায়নি যা তার পরিচিত কোনো আইনের ধারার সাথে মেলাতে পারে। এর মানে এই নয় যে নথিটি সম্পূর্ণ নিরাপদ - এমনও হতে পারে নথিটি পাহারার আওতার বাইরে। এটি একজন আইনি সহায়তা আইনজীবীকে দেখান।",
    clockHero: {
      closedDaysAgo: (days: number) => `এই সময়সীমা ${days} দিন আগে শেষ হয়েছে`,
      lastDay: "আজই শেষ দিন",
      daysLeft: (days: number) => `${days} দিন বাকি আছে`,
      dateToWorkTo: "নির্ধারিত তারিখ হলো",
      customaryNotice:
        " এটি আইনের চেয়ে প্রচলিত নিয়ম - সঠিক সময়সীমার জন্য নথিটি দেখুন।",
    },
    deadlines: {
      empty:
        "এই নথিতে কোনো তারিখ লেখা ছিল না, তাই গণনা করার মতো কোনো সময়সীমা এখনও নেই। সমস্যা শুরু হওয়ার তারিখ জানা থাকলে টেক্সটে যোগ করে আবার পড়ুন।",
      remainingDays: (days: number) => `${days} দিন বাকি। `,
      closedDaysAgo: (days: number) => `${days} দিন আগে শেষ হয়েছে। `,
      countedFrom: "গণনা করা হয়েছে: ",
    },
    disclaimer: {
      heading: "পাহারা আপনার আইনজীবী নয়",
      p1: "এটি আইনি তথ্য, কোনো আইনি পরামর্শ নয়। পাহারা ভারতীয় আইনের একটি নির্দিষ্ট সংকলনের সাথে মিলিয়ে আপনার নথিটি পড়ে এবং যা পায় তা তুলে ধরে। এটি আপনার সামগ্রিক পরিস্থিতি, আপনার রাজ্যের স্থানীয় আইন বা আপনার দেওয়া পৃষ্ঠার বাইরের কোনো তথ্য জানে না।",
      p2: "বিনামূল্যে আইনি সহায়তা একটি অধিকার, কোনো অনুগ্রহ নয়। আপনার জেলা আইনি পরিষেবা কর্তৃপক্ষ জেলা আদালত চত্বরে অবস্থিত এবং নালসা (NALSA) হেল্পলাইন নম্বর ১৫১০০।",
    },
  },
};

export function t(language: Language = "en"): UiTranslations {
  return TRANSLATIONS[language] ?? TRANSLATIONS.en;
}
