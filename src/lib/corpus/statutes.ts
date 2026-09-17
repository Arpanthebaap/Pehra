/**
 * Pehra's grounding corpus.
 *
 * This is the single source of legal truth in the application. The language
 * model is never permitted to assert that a clause is void, or that a right is
 * missing, unless it can point at an `id` in this file. Findings that cite an
 * unknown id are discarded in `groundFindings()` before they reach the user.
 *
 * Summaries are plain-language paraphrases written for a non-lawyer, not
 * reproductions of statutory text. `citation` gives the reader the exact place
 * to verify the point for themselves.
 *
 * Scope note: this corpus covers the everyday agreements an ordinary person in
 * India is asked to sign - rent, employment, consumer purchases, loans. It is
 * deliberately narrow. Narrow and correct beats broad and wrong.
 */

export type LegalDomain =
  | "rent"
  | "employment"
  | "consumer"
  | "loan"
  | "general";

export type StatuteLanguage = "en" | "hi" | "bn";

export interface Statute {
  /** Stable id. The model must return one of these to make a claim. */
  id: string;
  act: string;
  section: string;
  citation: string;
  /** Short title a non-lawyer can scan. */
  title: string;
  /** Plain-language paraphrase of the rule. Shown in the UI next to findings. */
  plain: string;
  /** What this provision lets a person actually do about it. */
  soWhat: string;
  domains: LegalDomain[];
}

export const STATUTES: readonly Statute[] = [
  {
    id: "ica-1872-s23",
    act: "Indian Contract Act, 1872",
    section: "Section 23",
    citation: "Indian Contract Act, 1872, s. 23",
    title: "Agreements against the law or public policy are void",
    plain:
      "An agreement is void if what it asks for is forbidden by law, would defeat the purpose of a law, or is opposed to public policy. Courts have used this to strike down terms that are grossly unfair between parties of very unequal bargaining power.",
    soWhat:
      "A void term binds nobody. You do not have to perform it, and the other side cannot enforce it in court - even though you signed.",
    domains: ["general", "employment", "rent", "consumer"],
  },
  {
    id: "ica-1872-s27",
    act: "Indian Contract Act, 1872",
    section: "Section 27",
    citation: "Indian Contract Act, 1872, s. 27",
    title: "Blanket bans on working elsewhere are void",
    plain:
      "An agreement that restrains someone from carrying on a lawful profession, trade or business is void to that extent. The main exception is the sale of a business's goodwill. Indian law is markedly stricter here than English or US law: a non-compete that bites after employment ends is generally unenforceable.",
    soWhat:
      "A clause stopping you from joining a competitor after you leave is usually unenforceable in India. Confidentiality and non-solicitation obligations are treated differently and may still hold.",
    domains: ["employment"],
  },
  {
    id: "ica-1872-s28",
    act: "Indian Contract Act, 1872",
    section: "Section 28",
    citation: "Indian Contract Act, 1872, s. 28",
    title: "Clauses that block you from going to court are void",
    plain:
      "An agreement that absolutely stops a party from enforcing their rights through the ordinary courts or tribunals, or that shortens the time limit the law gives them to do so, is void to that extent. Genuine arbitration agreements are carved out.",
    soWhat:
      "A term saying you 'waive all right to complain' or must sue within 30 days cannot take away a limitation period the law gives you.",
    domains: ["general", "consumer", "employment", "rent"],
  },
  {
    id: "ica-1872-s74",
    act: "Indian Contract Act, 1872",
    section: "Section 74",
    citation: "Indian Contract Act, 1872, s. 74",
    title: "A penalty written into a contract is a ceiling, not an entitlement",
    plain:
      "Where a contract names a sum to be paid on breach, the injured party is entitled only to reasonable compensation, not exceeding that sum, whether or not actual loss is proved. The named figure is an upper limit, and courts routinely award far less.",
    soWhat:
      "Automatic forfeiture of your whole deposit, or a flat penalty unconnected to any real loss, can be challenged. Ask them to show what they actually lost.",
    domains: ["general", "rent", "employment", "consumer"],
  },
  {
    id: "ica-1872-s16",
    act: "Indian Contract Act, 1872",
    section: "Section 16",
    citation: "Indian Contract Act, 1872, s. 16",
    title: "Contracts signed under undue influence can be set aside",
    plain:
      "Where one party is in a position to dominate the will of another and the transaction appears unconscionable, the burden shifts to the stronger party to prove the contract was not obtained by undue influence.",
    soWhat:
      "If you had no realistic choice but to sign - a standard form handed over with no negotiation - that imbalance is legally relevant, not just unfair.",
    domains: ["general", "employment", "loan"],
  },
  {
    id: "cpa-2019-s2-46",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(46)",
    citation: "Consumer Protection Act, 2019, s. 2(46)",
    title: "The law names six kinds of unfair contract term",
    plain:
      "An 'unfair contract' is one that causes significant change in a consumer's rights, including: demanding excessive security deposits; imposing a penalty on breach that is wholly disproportionate to the loss; refusing to accept early repayment; letting one side terminate without reasonable cause; letting one side assign the contract to your detriment without consent; or imposing any unreasonable charge or obligation that puts you at a disadvantage.",
    soWhat:
      "State and National Consumer Commissions can declare such terms null and void. You do not have to prove fraud - only unfairness.",
    domains: ["consumer", "rent", "loan", "general"],
  },
  {
    id: "cpa-2019-s69",
    act: "Consumer Protection Act, 2019",
    section: "Section 69",
    citation: "Consumer Protection Act, 2019, s. 69",
    title: "Two years to file a consumer complaint",
    plain:
      "A consumer complaint must be filed within two years from the date the cause of action arises. A commission may admit a later complaint only if it records reasons it is satisfied there was sufficient cause for the delay.",
    soWhat:
      "The clock starts when the problem happened, not when you found out you had rights. After two years your case can be dismissed without anyone looking at whether you were wronged.",
    domains: ["consumer"],
  },
  {
    id: "cpa-2019-s35",
    act: "Consumer Protection Act, 2019",
    section: "Section 35",
    citation: "Consumer Protection Act, 2019, s. 35",
    title: "You can file a consumer complaint yourself, where you live",
    plain:
      "A complaint may be filed by the consumer personally - no lawyer is required - before the District Commission where the consumer resides or works, in addition to where the other party operates. Filing can be done electronically.",
    soWhat:
      "You do not have to travel to the company's head office city, and you do not have to hire anyone to file.",
    domains: ["consumer"],
  },
  {
    id: "mta-2021-s11",
    act: "Model Tenancy Act, 2021",
    section: "Section 11",
    citation: "Model Tenancy Act, 2021, s. 11",
    title: "Security deposit capped at two months' rent for a home",
    plain:
      "Under the Model Tenancy Act the security deposit may not exceed two months' rent for residential premises, or six months' rent for non-residential premises, and must be refunded when the tenant vacates, after lawful deductions.",
    soWhat:
      "The Model Tenancy Act is a template the Centre circulated in 2021; it binds you only in States that have enacted it. Check your State's tenancy law - but a ten-month deposit is a strong signal something is wrong, and the cap is a reasonable benchmark to negotiate against.",
    domains: ["rent"],
  },
  {
    id: "mta-2021-s21",
    act: "Model Tenancy Act, 2021",
    section: "Section 21",
    citation: "Model Tenancy Act, 2021, s. 21",
    title: "A landlord cannot evict you by force",
    plain:
      "A tenant cannot be evicted except in accordance with the Act - which means an order from the Rent Authority or Rent Court. Cutting off essential supplies such as water or electricity to force a tenant out is separately prohibited.",
    soWhat:
      "Lock-changing, belongings thrown out, or power cut off is not a remedy the landlord has. It is something you can complain about.",
    domains: ["rent"],
  },
  {
    id: "limitation-1963-art55",
    act: "Limitation Act, 1963",
    section: "Article 55, Schedule",
    citation: "Limitation Act, 1963, Sch., Art. 55",
    title: "Three years to sue for breach of contract",
    plain:
      "A suit for compensation for breach of a contract must be brought within three years of the date the contract is broken, or - where the breach is continuing - when it stops.",
    soWhat:
      "Different from the two-year consumer window. If your matter is not a consumer dispute, this is usually the clock that applies.",
    domains: ["general", "rent", "employment", "loan"],
  },
  {
    id: "limitation-1963-art113",
    act: "Limitation Act, 1963",
    section: "Article 113, Schedule",
    citation: "Limitation Act, 1963, Sch., Art. 113",
    title: "Three years for anything the schedule does not otherwise cover",
    plain:
      "The residuary article: where no other article applies, the period is three years from when the right to sue accrues.",
    soWhat: "The default backstop clock when nothing more specific fits.",
    domains: ["general"],
  },
  {
    id: "ni-1881-s138",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 138",
    citation: "Negotiable Instruments Act, 1881, s. 138",
    title: "A bounced cheque has three deadlines, in sequence",
    plain:
      "When a cheque is returned unpaid: the payee must send a written demand within 30 days of receiving the bank's return memo; the drawer then has 15 days to pay; and if they do not, the complaint must be filed within one month of that 15-day period ending.",
    soWhat:
      "Miss the 30-day demand and the criminal remedy is gone for that cheque. This is the most commonly forfeited right in Indian commercial life.",
    domains: ["loan", "general"],
  },
  {
    id: "pwa-1936-s7",
    act: "Payment of Wages Act, 1936",
    section: "Section 7",
    citation: "Payment of Wages Act, 1936, s. 7",
    title: "Only listed deductions may be taken from wages",
    plain:
      "Wages must be paid without deductions except those the Act expressly authorises - such as fines imposed under the Act's own procedure, absence from duty, or recovery of advances. Total deductions are also capped as a proportion of wages.",
    soWhat:
      "An employer cannot invent a deduction. 'Training cost recovery' or an open-ended penalty taken from your salary needs a lawful basis.",
    domains: ["employment"],
  },
  {
    id: "lsa-1987-s12",
    act: "Legal Services Authorities Act, 1987",
    section: "Section 12",
    citation: "Legal Services Authorities Act, 1987, s. 12",
    title: "Who gets a free lawyer, as of right",
    plain:
      "Free legal services are available to, among others: members of Scheduled Castes and Scheduled Tribes; women and children; persons with disabilities; industrial workmen; victims of trafficking or mass disaster; persons in custody; and anyone whose annual income falls below the limit set by the State (or by the Centre for Supreme Court matters).",
    soWhat:
      "This is a right, not charity. Walk into your District Legal Services Authority at the district court complex, or call the NALSA helpline on 15100.",
    domains: ["general", "consumer", "employment", "rent", "loan"],
  },
] as const;

const BY_ID: ReadonlyMap<string, Statute> = new Map(
  STATUTES.map((s) => [s.id, s]),
);

type StatuteOverrides = Pick<Statute, "title" | "plain" | "soWhat"> &
  Partial<Pick<Statute, "act" | "section" | "citation">>;

const STATUTE_TRANSLATIONS: Record<"hi" | "bn", Record<string, StatuteOverrides>> = {
  hi: {
    "ica-1872-s23": {
      act: "भारतीय अनुबंध अधिनियम, 1872",
      section: "धारा 23",
      citation: "भारतीय अनुबंध अधिनियम, 1872, धारा 23",
      title: "कानून या लोक नीति के विरुद्ध समझौते शून्य हैं",
      plain:
        "यदि कोई समझौता ऐसा काम करने को कहता है जो कानून द्वारा निषिद्ध है, कानून के उद्देश्य को विफल करता है, या लोक नीति के विरुद्ध है, तो वह शून्य (अमान्य) है। अदालतों ने असमान सौदेबाजी क्षमता वाले पक्षों के बीच अत्यधिक अनुचित शर्तों को रद्द करने के लिए इसका प्रयोग किया है।",
      soWhat:
        "शून्य शर्त किसी पर बाध्यकारी नहीं होती। आपको इसका पालन करने की आवश्यकता नहीं है, और हस्ताक्षर होने के बावजूद दूसरा पक्ष इसे अदालत में लागू नहीं करवा सकता।",
    },
    "ica-1872-s27": {
      act: "भारतीय अनुबंध अधिनियम, 1872",
      section: "धारा 27",
      citation: "भारतीय अनुबंध अधिनियम, 1872, धारा 27",
      title: "अन्यत्र काम करने पर पूर्ण प्रतिबंध शून्य है",
      plain:
        "कोई भी समझौता जो किसी व्यक्ति को कोई वैध पेशा, व्यापार या व्यवसाय करने से रोकता है, उस सीमा तक शून्य है। मुख्य अपवाद व्यवसाय की साख (गुडविल) की बिक्री है। भारतीय कानून यहाँ स्पष्ट रूप से सख्त है: नौकरी समाप्त होने के बाद लागू होने वाला गैर-प्रतिस्पर्धा खंड (non-compete) सामान्यतः लागू नहीं कराया जा सकता।",
      soWhat:
        "नौकरी छोड़ने के बाद आपको प्रतिस्पर्धी कंपनी में जाने से रोकने वाला खंड भारत में आमतौर पर अप्रवर्तनीय है। हालांकि गोपनीयता और ग्राहकों/कर्मियों को न लुभाने की शर्तें मान्य रह सकती हैं।",
    },
    "ica-1872-s28": {
      act: "भारतीय अनुबंध अधिनियम, 1872",
      section: "धारा 28",
      citation: "भारतीय अनुबंध अधिनियम, 1872, धारा 28",
      title: "अदालत जाने से रोकने वाली शर्तें शून्य हैं",
      plain:
        "कोई भी समझौता जो किसी पक्ष को सामान्य अदालतों या न्यायाधिकरणों के माध्यम से अपने अधिकारों को लागू करने से पूरी तरह रोकता है, या ऐसा करने के लिए कानून द्वारा दी गई समय सीमा को छोटा करता है, उस सीमा तक शून्य है। वास्तविक मध्यस्थता (आर्बिट्रेशन) समझौते इसके अपवाद हैं।",
      soWhat:
        "यह कहने वाली शर्त कि 'आप शिकायत करने का सारा अधिकार छोड़ते हैं' या 30 दिनों में मुकदमा करना होगा, कानून द्वारा दी गई समय सीमा को छीन नहीं सकती।",
    },
    "ica-1872-s74": {
      act: "भारतीय अनुबंध अधिनियम, 1872",
      section: "धारा 74",
      citation: "भारतीय अनुबंध अधिनियम, 1872, धारा 74",
      title: "अनुबंध में लिखा गया जुर्माना अधिकतम सीमा है, स्वतः अधिकार नहीं",
      plain:
        "जहाँ किसी अनुबंध में उल्लंघन पर भुगतान की जाने वाली राशि तय की गई हो, वहाँ पीड़ित पक्ष केवल उचित मुआवजे का हकदार है (जो उस राशि से अधिक न हो), चाहे वास्तविक नुकसान साबित हो या न हो। अनुबंध में लिखी राशि केवल ऊपरी सीमा है, और अदालतें आमतौर पर उससे काफी कम मुआवजा देती हैं।",
      soWhat:
        "आपकी पूरी जमा राशि की स्वतः जब्ती, या वास्तविक नुकसान से असंबद्ध एकमुश्त जुर्माने को चुनौती दी जा सकती है। उनसे पूछें कि उन्हें वास्तव में क्या नुकसान हुआ है।",
    },
    "ica-1872-s16": {
      act: "भारतीय अनुबंध अधिनियम, 1872",
      section: "धारा 16",
      citation: "भारतीय अनुबंध अधिनियम, 1872, धारा 16",
      title: "अनुचित प्रभाव में हस्ताक्षरित अनुबंध रद्द किए जा सकते हैं",
      plain:
        "जहाँ एक पक्ष दूसरे की इच्छा पर हावी होने की स्थिति में हो और लेनदेन अत्यधिक अनुचित प्रतीत होता हो, वहाँ यह साबित करने का भार मजबूत पक्ष पर आ जाता है कि अनुबंध अनुचित प्रभाव से प्राप्त नहीं किया गया था।",
      soWhat:
        "यदि आपके पास हस्ताक्षर करने के अलावा कोई वास्तविक विकल्प नहीं था - बिना किसी बातचीत के थमाया गया मानक फॉर्म - तो यह असंतुलन कानूनी रूप से प्रासंगिक है, केवल अनुचित ही नहीं।",
    },
    "cpa-2019-s2-46": {
      act: "उपभोक्ता संरक्षण अधिनियम, 2019",
      section: "धारा 2(46)",
      citation: "उपभोक्ता संरक्षण अधिनियम, 2019, धारा 2(46)",
      title: "कानून में छह प्रकार की अनुचित अनुबंध शर्तों का उल्लेख है",
      plain:
        "'अनुचित अनुबंध' वह है जो उपभोक्ता के अधिकारों में महत्वपूर्ण प्रतिकूल बदलाव करता है, जिसमें शामिल हैं: अत्यधिक सुरक्षा जमा की मांग करना; उल्लंघन पर ऐसा जुर्माना लगाना जो नुकसान से पूरी तरह असंगत हो; समय से पहले भुगतान स्वीकार करने से इनकार करना; बिना उचित कारण एकतरफा अनुबंध समाप्त करना; बिना सहमति के आपके नुकसान के लिए अनुबंध किसी अन्य को सौंपना; या कोई भी अनुचित शुल्क या दायित्व थोपना।",
      soWhat:
        "राज्य और राष्ट्रीय उपभोक्ता आयोग ऐसी शर्तों को अमान्य और शून्य घोषित कर सकते हैं। आपको धोखाधड़ी साबित करने की आवश्यकता नहीं है - केवल अनुचितता साबित करनी होगी।",
    },
    "cpa-2019-s69": {
      act: "उपभोक्ता संरक्षण अधिनियम, 2019",
      section: "धारा 69",
      citation: "उपभोक्ता संरक्षण अधिनियम, 2019, धारा 69",
      title: "उपभोक्ता शिकायत दर्ज करने के लिए दो वर्ष का समय",
      plain:
        "उपभोक्ता शिकायत विवाद का कारण उत्पन्न होने की तारीख से दो साल के भीतर दर्ज की जानी चाहिए। आयोग किसी विलंबित शिकायत को तभी स्वीकार कर सकता है जब वह संतुष्ट होने के लिखित कारण दर्ज करे कि देरी के लिए पर्याप्त कारण मौजूद था।",
      soWhat:
        "समय सीमा तब से शुरू होती है जब समस्या हुई, न कि तब जब आपको अधिकारों की जानकारी मिली। दो साल बाद आपके मामले को बिना यह देखे खारिज किया जा सकता है कि आपके साथ गलत हुआ था या नहीं।",
    },
    "cpa-2019-s35": {
      act: "उपभोक्ता संरक्षण अधिनियम, 2019",
      section: "धारा 35",
      citation: "उपभोक्ता संरक्षण अधिनियम, 2019, धारा 35",
      title: "आप जहाँ रहते हैं, वहीं स्वयं उपभोक्ता शिकायत दर्ज कर सकते हैं",
      plain:
        "शिकायत उपभोक्ता द्वारा व्यक्तिगत रूप से दर्ज की जा सकती है - किसी वकील की आवश्यकता नहीं है - उस जिला आयोग के समक्ष जहाँ उपभोक्ता रहता है या काम करता है। शिकायत ऑनलाइन (ई-दाखिल) भी दर्ज की जा सकती है।",
      soWhat:
        "आपको कंपनी के मुख्यालय वाले शहर जाने की आवश्यकता नहीं है, और शिकायत दर्ज करने के लिए किसी को किराए पर लेने की आवश्यकता नहीं है।",
    },
    "mta-2021-s11": {
      act: "मॉडल किरायेदारी अधिनियम, 2021",
      section: "धारा 11",
      citation: "मॉडल टेनेंसी एक्ट, 2021, धारा 11",
      title: "घर के लिए सुरक्षा जमा (डिपॉजिट) अधिकतम दो महीने के किराए तक सीमित",
      plain:
        "मॉडल टेनेंसी एक्ट के तहत आवासीय परिसर के लिए सुरक्षा जमा दो महीने के किराए से अधिक नहीं हो सकता (गैर-आवासीय के लिए छह महीने), और वैध कटौती के बाद किरायेदार द्वारा खाली करने पर इसे वापस लौटाया जाना अनिवार्य है।",
      soWhat:
        "मॉडल टेनेंसी एक्ट केंद्र द्वारा 2021 में जारी एक प्रारूप कानून है; यह केवल उन्हीं राज्यों में बाध्यकारी है जिन्होंने इसे लागू किया है। अपने राज्य के किरायेदारी कानून की जांच करें - लेकिन 10 महीने की जमा राशि अनुचित होने का एक मजबूत संकेत है, और यह सीमा बातचीत के लिए एक उचित मानक है।",
    },
    "mta-2021-s21": {
      act: "मॉडल किरायेदारी अधिनियम, 2021",
      section: "धारा 21",
      citation: "मॉडल टेनेंसी एक्ट, 2021, धारा 21",
      title: "मकान मालिक आपको जबरन बेदखल नहीं कर सकता",
      plain:
        "रेंट अथॉरिटी या रेंट कोर्ट के आदेश के बिना किसी किरायेदार को बेदखल नहीं किया जा सकता। किरायेदार को बाहर निकालने के लिए पानी या बिजली जैसी आवश्यक आपूर्ति काटना विशेष रूप से कानूनन निषिद्ध है।",
      soWhat:
        "ताला बदलना, सामान बाहर फेंकना, या बिजली काटना मकान मालिक का कानूनी अधिकार नहीं है। इसके खिलाफ आप तुरंत शिकायत दर्ज कर सकते हैं।",
    },
    "limitation-1963-art55": {
      act: "परिसीमा अधिनियम, 1963",
      section: "अनुसूची, अनुच्छेद 55",
      citation: "परिसीमा अधिनियम, 1963, अनुसूची, अनु. 55",
      title: "अनुबंध उल्लंघन के लिए मुकदमा करने हेतु तीन वर्ष का समय",
      plain:
        "अनुबंध के उल्लंघन के लिए मुआवजे का मुकदमा अनुबंध टूटने की तारीख से तीन साल के भीतर लाया जाना चाहिए, या - जहाँ उल्लंघन जारी है - इसके समाप्त होने की तारीख से।",
      soWhat:
        "यह दो साल की उपभोक्ता समय सीमा से भिन्न है। यदि आपका मामला उपभोक्ता विवाद नहीं है, तो आमतौर पर यही समय सीमा लागू होती है।",
    },
    "limitation-1963-art113": {
      act: "परिसीमा अधिनियम, 1963",
      section: "अनुसूची, अनुच्छेद 113",
      citation: "परिसीमा अधिनियम, 1963, अनुसूची, अनु. 113",
      title: "जो कुछ भी अनुसूची में अन्यत्र शामिल नहीं है, उसके लिए तीन वर्ष",
      plain:
        "अवशिष्ट (रेसिड्यूरी) अनुच्छेद: जहाँ कोई अन्य विशिष्ट अनुच्छेद लागू नहीं होता, वहाँ मुकदमा करने का अधिकार उत्पन्न होने की तारीख से तीन साल की समय सीमा होती है।",
      soWhat:
        "जब कोई विशिष्ट नियम लागू न हो, तो यह कानून की डिफ़ॉल्ट बैकस्टॉप समय सीमा है।",
    },
    "ni-1881-s138": {
      act: "परक्राम्य लिखत अधिनियम, 1881",
      section: "धारा 138",
      citation: "परक्राम्य लिखत अधिनियम, 1881, धारा 138",
      title: "चेक बाउंस होने पर तीन क्रमिक समय सीमाएं हैं",
      plain:
        "जब कोई चेक अनादरित होकर लौटता है: तो बैंक का रिटर्न मेमो मिलने के 30 दिनों के भीतर लिखित नोटिस भेजना होगा; चेक जारीकर्ता के पास भुगतान के लिए 15 दिन होते हैं; और भुगतान न होने पर उस 15-दिवसीय अवधि की समाप्ति के एक महीने के भीतर शिकायत दर्ज करनी होगी।",
      soWhat:
        "यदि 30 दिन का नोटिस छूट गया, तो उस चेक के लिए आपराधिक उपाय समाप्त हो जाता है। यह भारतीय व्यावसायिक जीवन में सबसे अधिक खोया जाने वाला अधिकार है।",
    },
    "pwa-1936-s7": {
      act: "वेतन भुगतान अधिनियम, 1936",
      section: "धारा 7",
      citation: "वेतन भुगतान अधिनियम, 1936, धारा 7",
      title: "वेतन से केवल कानून में सूचीबद्ध कटौतियां ही की जा सकती हैं",
      plain:
        "वेतन का भुगतान उन कटौतियों के बिना पूरा किया जाना चाहिए जिन्हें यह अधिनियम स्पष्ट रूप से अनुमति नहीं देता - जैसे कि निर्धारित प्रक्रिया के तहत जुर्माने, अनुपस्थिति, या अग्रिम राशि की वसूली। कुल कटौतियों का अनुपात भी वेतन के एक निश्चित हिस्से तक सीमित है।",
      soWhat:
        "नियोक्ता अपनी मर्जी से कोई भी कटौती नहीं थोप सकता। आपके वेतन से 'प्रशिक्षण लागत की वसूली' या कोई अनिश्चित जुर्माना काटने का स्पष्ट कानूनी आधार होना चाहिए।",
    },
    "lsa-1987-s12": {
      act: "विधिक सेवा प्राधिकरण अधिनियम, 1987",
      section: "धारा 12",
      citation: "विधिक सेवा प्राधिकरण अधिनियम, 1987, धारा 12",
      title: "कानूनी अधिकार के रूप में मुफ्त वकील किन्हें मिलता है",
      plain:
        "मुफ्त कानूनी सेवाएं इनके लिए उपलब्ध हैं: अनुसूचित जाति और अनुसूचित जनजाति के सदस्य; महिलाएं और बच्चे; दिव्यांग व्यक्ति; औद्योगिक कामगार; मानव तस्करी या आपदा के शिकार; हिरासत में मौजूद व्यक्ति; और कोई भी व्यक्ति जिसकी वार्षिक आय निर्धारित सीमा से कम हो।",
      soWhat:
        "यह एक अधिकार है, कोई दान नहीं। अपने जिला अदालत परिसर में जिला विधिक सेवा प्राधिकरण में जाएँ, या 15100 पर नालसा (NALSA) हेल्पलाइन पर कॉल करें।",
    },
  },
  bn: {
    "ica-1872-s23": {
      act: "ভারতীয় চুক্তি আইন, ১৮৭২",
      section: "ধারা ২৩",
      citation: "ভারতীয় চুক্তি আইন, ১৮৭২, ধারা ২৩",
      title: "আইন বা জননীতির পরিপন্থী চুক্তি বাতিল",
      plain:
        "কোনো চুক্তি যদি আইনত নিষিদ্ধ হয়, আইনের উদ্দেশ্যকে ব্যর্থ করে বা জননীতির বিরোধী হয়, তবে তা বাতিল বলে গণ্য হবে। দরকষাকষির অসম ক্ষমতার কারণে তৈরি চরম অন্যায্য শর্ত বাতিল করতে আদালত এই ধারা প্রয়োগ করে থাকে।",
      soWhat:
        "বাতিল শর্ত কারও জন্যই বাধ্যতামূলক নয়। আপনার এটি মানার বাধ্যবাধকতা নেই, এবং স্বাক্ষর থাকা সত্ত্বেও অপর পক্ষ আদালতে এটি কার্যকর করতে পারবে না।",
    },
    "ica-1872-s27": {
      act: "ভারতীয় চুক্তি আইন, ১৮৭২",
      section: "ধারা ২৭",
      citation: "ভারতীয় চুক্তি আইন, ১৮৭২, ধারা ২৭",
      title: "অন্য কোথাও কাজ করার ওপর সর্বাত্মক নিষেধাজ্ঞা অবৈধ",
      plain:
        "যে চুক্তি কাউকে কোনো বৈধ পেশা, ব্যবসা বা বাণিজ্য পরিচালনায় বাধা দেয়, তা সেই পরিমাণ পর্যন্ত বাতিল। প্রধান ব্যতিক্রম হলো ব্যবসার সুনাম (গুডউইল) বিক্রি। ভারতীয় আইন এই ক্ষেত্রে অত্যন্ত কঠোর: চাকরি ছাড়ার পরের নন-কম্পিট বা প্রতিযোগিতাবিরোধী শর্ত সাধারণত প্রয়োগযোগ্য নয়।",
      soWhat:
        "চাকরি ছাড়ার পর প্রতিযোগী প্রতিষ্ঠানে যোগদানে বাধা দেওয়ার ধারা ভারতে সাধারণত অকার্যকর। তবে গোপনীয়তা রক্ষা এবং কর্মী ভাগিয়ে না নেওয়ার বাধ্যবাধকতা কার্যকর থাকতে পারে।",
    },
    "ica-1872-s28": {
      act: "ভারতীয় চুক্তি আইন, ১৮৭২",
      section: "ধারা ২৮",
      citation: "ভারতীয় চুক্তি আইন, ১৮৭২, ধারা ২৮",
      title: "আদালতে যাওয়ার পথ বন্ধ করার ধারা বাতিল",
      plain:
        "যে চুক্তি কোনো পক্ষকে আদালত বা ট্রাইব্যুনালের মাধ্যমে অধিকার প্রয়োগে সম্পূর্ণ বাধা দেয় অথবা আইন প্রদত্ত সময়সীমা সংকুচিত করে, তা বাতিল। প্রকৃত সালিশি (আর্বিট্রেশন) চুক্তি এর আওতামুক্ত।",
      soWhat:
        "'অভিযোগের অধিকার ত্যাগ করছেন' বা ৩০ দিনের মধ্যে মামলা করার মতো শর্ত আইন প্রদত্ত সময়সীমার অধিকার কেড়ে নিতে পারে না।",
    },
    "ica-1872-s74": {
      act: "ভারতীয় চুক্তি আইন, ১৮৭২",
      section: "ধারা ৭৪",
      citation: "ভারতীয় চুক্তি আইন, ১৮৭২, ধারা ৭৪",
      title: "চুক্তিতে উল্লিখিত জরিমানা একটি সর্বোচ্চ সীমা, বাধ্যতামূলক দাবি নয়",
      plain:
        "চুক্তিভঙ্গের ক্ষেত্রে কোনো নির্দিষ্ট ক্ষতিপূরণের অঙ্ক লেখা থাকলেও ক্ষতিগ্রস্ত পক্ষ কেবল যুক্তিসঙ্গত ক্ষতিপূরণ পাওয়ার অধিকারী, যা ওই অঙ্কের বেশি হবে না। নির্ধারিত অঙ্কটি কেবল একটি সর্বোচ্চ সীমা, এবং আদালত সাধারণত অনেক কম ক্ষতিপূরণ ধার্য করে থাকে।",
      soWhat:
        "পুরো জামানত সরাসরি বাজেয়াপ্ত করা বা ক্ষতির সাথে অসামঞ্জস্যপূর্ণ জরিমানা দাবি করা হলে তাকে চ্যালেঞ্জ করা যায়। তাদের প্রকৃত ক্ষতির প্রমাণ দিতে বলুন।",
    },
    "ica-1872-s16": {
      act: "ভারতীয় চুক্তি আইন, ১৮৭২",
      section: "ধারা ১৬",
      citation: "ভারতীয় চুক্তি আইন, ১৮৭২, ধারা ১৬",
      title: "অন্যায় প্রভাবে স্বাক্ষরিত চুক্তি বাতিলযোগ্য",
      plain:
        "যখন এক পক্ষ অন্য পক্ষের ইচ্ছাকে প্রভাবিত বা নিয়ন্ত্রণ করার অবস্থানে থাকে এবং লেনদেনটি চরম অন্যায্য মনে হয়, তখন চুক্তিটি যে অন্যায় প্রভাবে করা হয়নি তা প্রমাণের দায়িত্ব শক্তিশালী পক্ষের ওপর বর্তায়।",
      soWhat:
        "যদি স্বাক্ষর করা ছাড়া আপনার কোনো বাস্তবসম্মত বিকল্প না থেকে থাকে (যেমন দরকষাকষিহীন একতরফা ফর্ম), তবে এই অসমতা শুধু অন্যায়ই নয়, আইনিভাবেও বিচার্য।",
    },
    "cpa-2019-s2-46": {
      act: "ভোক্তা সুরক্ষা আইন, ২০১৯",
      section: "ধারা ২(৪৬)",
      citation: "ভোক্তা সুরক্ষা আইন, ২০১৯, ধারা ২(৪৬)",
      title: "আইনে ছয় ধরণের অন্যায্য চুক্তিভিত্তিক শর্তের উল্লেখ রয়েছে",
      plain:
        "'অন্যায্য চুক্তি' হলো এমন চুক্তি যা ভোক্তার অধিকারে বড় ধরনের বৈষম্য তৈরি করে, যেমন: অতিরিক্ত জামানত দাবি করা; ক্ষতির তুলনায় মাত্রাতিরিক্ত জরিমানা চাপানো; সময়ের আগে ঋণ পরিশোধ গ্রহণে অস্বীকৃতি; যুক্তিসঙ্গত কারণ ছাড়া একতরফা চুক্তি বাতিল; অনুমতি ছাড়া আপনার স্বার্থের পরিপন্থী চুক্তি হস্তান্তর; বা কোনো অযৌক্তিক শর্ত বা দায় চাপিয়ে দেওয়া।",
      soWhat:
        "রাজ্য ও জাতীয় ভোক্তা কমিশন এই জাতীয় শর্ত বাতিল ঘোষণা করতে পারে। প্রতারণা প্রমাণ করার প্রয়োজন নেই - কেবল অন্যায্যতাই যথেষ্ট।",
    },
    "cpa-2019-s69": {
      act: "ভোক্তা সুরক্ষা আইন, ২০১৯",
      section: "ধারা ৬৯",
      citation: "ভোক্তা সুরক্ষা আইন, ২০১৯, ধারা ৬৯",
      title: "ভোক্তা অভিযোগ দায়েরের জন্য দুই বছর সময়",
      plain:
        "সমস্যা বা কারণ উদ্ভব হওয়ার তারিখ থেকে দুই বছরের মধ্যে ভোক্তা অভিযোগ দায়ের করতে হবে। বিলম্বে দায়েরের ক্ষেত্রে কমিশন শুধুমাত্র তখনই অনুমতি দিতে পারে যদি তারা সন্তুষ্ট হয় যে দেরির উপযুক্ত কারণ ছিল।",
      soWhat:
        "সমস্যা তৈরি হওয়ার দিন থেকেই সময় গণনা শুরু হয়, অধিকার জানার দিন থেকে নয়। দুই বছর পেরিয়ে গেলে আপনার প্রতি অন্যায় হয়েছিল কিনা তা বিবেচনা না করেই মামলা বাতিল হতে পারে।",
    },
    "cpa-2019-s35": {
      act: "ভোক্তা সুরক্ষা আইন, ২০১৯",
      section: "ধারা ৩৫",
      citation: "ভোক্তা সুরক্ষা আইন, ২০১৯, ধারা ৩৫",
      title: "আপনি যেখানে বাস করেন সেখান থেকেই নিজে ভোক্তা অভিযোগ দায়ের করতে পারেন",
      plain:
        "ভোক্তা নিজে সরাসরি অভিযোগ দায়ের করতে পারেন - কোনো আইনজীবীর প্রয়োজন নেই - যে জেলায় ভোক্তা বসবাস করেন বা কাজ করেন সেই জেলা কমিশনে, পাশাপাশি অপর পক্ষের কার্যক্রমের স্থানেও। ইলেকট্রনিকভাবেও ফাইল করা সম্ভব।",
      soWhat:
        "কোম্পানির প্রধান কার্যালয়ের শহরে যাওয়ার প্রয়োজন নেই, এবং অভিযোগ জমা দেওয়ার জন্য কাউকে নিয়োগ করারও প্রয়োজন নেই।",
    },
    "mta-2021-s11": {
      act: "মডেল ভাড়াটে আইন, ২০২১",
      section: "ধারা ১১",
      citation: "মডেল টেন্যান্সি অ্যাক্ট, ২০২১, ধারা ১১",
      title: "বাসস্থানের জন্য জামানত সর্বোচ্চ দুই মাসের ভাড়ায় সীমিত",
      plain:
        "মডেল টেন্যান্সি অ্যাক্টের অধীনে আবাসিক এলাকার জন্য সিকিউরিটি ডিপোজিট সর্বোচ্চ দুই মাসের ভাড়া এবং অনাবাসিকের ক্ষেত্রে ছয় মাসের ভাড়ার বেশি হতে পারবে না, এবং ভাড়াটে বাড়ি ছাড়ার পর বৈধ কর্তন বাদে তা ফেরত দিতে হবে।",
      soWhat:
        "মডেল টেন্যান্সি অ্যাক্ট হলো ২০২১ সালে কেন্দ্রের তৈরি একটি খসড়া আইন; যে রাজ্যগুলি এটি কার্যকর করেছে সেখানেই এটি বাধ্যতামূলক। আপনার রাজ্যের বাড়িভাড়া আইন যাচাই করুন - তবে ১০ মাসের ডিপোজিট দাবি স্পষ্টতই অতিরিক্ত এবং দরকষাকষির একটি জোরালো ভিত্তি।",
    },
    "mta-2021-s21": {
      act: "মডেল ভাড়াটে আইন, ২০২১",
      section: "ধারা ২১",
      citation: "মডেল টেন্যান্সি অ্যাক্ট, ২০২১, ধারা ২১",
      title: "বাড়িওয়ালা জোরপূর্বক আপনাকে উচ্ছেদ করতে পারেন না",
      plain:
        "রেন্ট অথরিটি বা আদালতের নির্দেশ ব্যতিরেকে কোনো ভাড়াটেকে উচ্ছেদ করা যায় না। উচ্ছেদ করতে জল বা বিদ্যুতের মতো জরুরি পরিষেবা বন্ধ করা আইনত কঠোরভাবে নিষিদ্ধ।",
      soWhat:
        "তালা বদলে দেওয়া, জিনিসপত্র ফেলে দেওয়া বা বিদ্যুৎ বিচ্ছিন্ন করা কোনো বৈধ পদক্ষেপ নয়। এর বিরুদ্ধে অবিলম্বে অভিযোগ দায়ের করা যায়।",
    },
    "limitation-1963-art55": {
      act: "তামাদি আইন, ১৯৬৩",
      section: "তফসিল, অনুচ্ছেদ ৫৫",
      citation: "তামাদি আইন, ১৯৬৩, তফসিল, অনু. ৫৫",
      title: "চুক্তিভঙ্গের মামলার জন্য তিন বছর সময়",
      plain:
        "চুক্তি লঙ্ঘনের ক্ষতিপূরণের মামলা চুক্তি ভঙ্গের তারিখ থেকে তিন বছরের মধ্যে করতে হবে, অথবা লঙ্ঘন চলমান থাকলে তা বন্ধ হওয়ার দিন থেকে তিন বছর।",
      soWhat:
        "এটি ভোক্তা অধিকারের দুই বছরের সময়সীমা থেকে আলাদা। আপনার বিষয়টি ভোক্তা বিরোধ না হলে সাধারণত এই সময়সীমাটিই প্রযোজ্য।",
    },
    "limitation-1963-art113": {
      act: "তামাদি আইন, ১৯৬৩",
      section: "তফসিল, অনুচ্ছেদ ১১৩",
      citation: "তামাদি আইন, ১৯৬৩, তফসিল, অনু. ১১৩",
      title: "তফসিলে নির্দিষ্টভাবে উল্লেখ না থাকা সব বিষয়ের জন্য তিন বছর",
      plain:
        "অবশিষ্টাংশ ধারা: যেখানে অন্য কোনো নির্দিষ্ট ধারা খাটে না, সেখানে মামলা করার অধিকার তৈরির দিন থেকে তিন বছর সময় মেলে।",
      soWhat:
        "সুনির্দিষ্ট কোনো নিয়ম না থাকলে এটিই সাধারণ ব্যাকস্টপ সময়সীমা।",
    },
    "ni-1881-s138": {
      act: "হস্তান্তরযোগ্য দলিল আইন, ১৮৮১",
      section: "ধারা ১৩৮",
      citation: "হস্তান্তরযোগ্য দলিল আইন, ১৮৮১, ধারা ১৩৮",
      title: "চেক বাউন্সের ক্ষেত্রে পরপর তিনটি সময়সীমা রয়েছে",
      plain:
        "চেক বাউন্স হলে: ব্যাংকের মেমো পাওয়ার ৩০ দিনের মধ্যে প্রাপককে লিখিত ডিমান্ড নোটিশ পাঠাতে হবে; চেক প্রদানকারীকে টাকা পরিশোধে ১৫ দিন সময় দিতে হবে; এবং টাকা না দিলে ওই ১৫ দিন শেষ হওয়ার এক মাসের মধ্যে মামলা দায়ের করতে হবে।",
      soWhat:
        "৩০ দিনের মধ্যে নোটিশ পাঠাতে ব্যর্থ হলে চেক সংক্রান্ত ফৌজদারি প্রতিকার পাওয়ার অধিকার নষ্ট হয়। ভারতীয় বাণিজ্যে এটি সবচেয়ে বেশি হাতছাড়া হওয়া আইনি অধিকার।",
    },
    "pwa-1936-s7": {
      act: "মজুরি প্রদান আইন, ১৯৩৬",
      section: "ধারা ৭",
      citation: "মজুরি প্রদান আইন, ১৯৩৬, ধারা ৭",
      title: "বেতন থেকে কেবল তালিকাভুক্ত নির্দিষ্ট কর্তনই করা যাবে",
      plain:
        "আইন দ্বারা সুস্পষ্টভাবে অনুমোদিত কারণ ছাড়া (যেমন নির্দিষ্ট নিয়মে জরিমানা, অনুপস্থিতি বা অগ্রিম পরিশোধ) বেতন থেকে কোনো অর্থ কাটা যাবে না। মোট কর্তনের পরিমাণেরও একটি নির্দিষ্ট সীমা রয়েছে।",
      soWhat:
        "নিয়োগকর্তা নিজের ইচ্ছামতো কোনো কর্তন চাপিয়ে দিতে পারেন না। বেতন থেকে 'ট্রেনিং খরচ বাবদ টাকা কাটা' বা অন্যায্য জরিমানার অবশ্যই আইনগত ভিত্তি থাকতে হবে।",
    },
    "lsa-1987-s12": {
      act: "আইনি পরিষেবা কর্তৃপক্ষ আইন, ১৯৮৭",
      section: "ধারা ১২",
      citation: "আইনি পরিষেবা কর্তৃপক্ষ আইন, ১৯৮৭, ধারা ১২",
      title: "অধিকার হিসেবে কারা বিনামূল্যে আইনজীবী পাবেন",
      plain:
        "বিনামূল্যে আইনি সেবা পাওয়ার অধিকারীদের মধ্যে রয়েছেন: তফশিলি জাতি ও উপজাতিভুক্ত ব্যক্তি; নারী ও শিশু; প্রতিবন্ধী ব্যক্তি; কারখানার শ্রমিক; পাচার বা দুর্যোগের শিকার ব্যক্তি; হেফাজতে থাকা ব্যক্তি; এবং যাদের বার্ষিক আয় রাজ্য নির্ধারিত সীমার নিচে।",
      soWhat:
        "এটি কোনো দয়া নয়, নাগরিক অধিকার। আপনার জেলা আদালতের জেলা আইনি পরিষেবা কর্তৃপক্ষের কাছে যান বা ১৫১০০ নম্বরে কল করুন।",
    },
  },
};

export function getStatute(id: string, language: StatuteLanguage = "en"): Statute | undefined {
  const base = BY_ID.get(id);
  if (!base) return undefined;
  if (language === "en") return base;

  const overrides = STATUTE_TRANSLATIONS[language]?.[id];
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
  };
}

export function isKnownStatute(id: string): boolean {
  return BY_ID.has(id);
}

/** The id whitelist handed to the model, so it cannot invent a citation. */
export const STATUTE_IDS: readonly string[] = STATUTES.map((s) => s.id);

/**
 * A compact catalogue injected into the prompt. Kept terse on purpose: the
 * model needs enough to choose the right provision, not the whole corpus.
 */
export function corpusBriefing(): string {
  return STATUTES.map(
    (s) => `${s.id} | ${s.citation} | ${s.title} | applies to: ${s.domains.join(", ")}`,
  ).join("\n");
}
