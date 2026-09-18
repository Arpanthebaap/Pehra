import type { Language } from "./schema";

/**
 * Demonstration documents representing the everyday paperwork ordinary Indians face.
 *
 * Each document is deliberately composed around statutory protections in the corpus:
 * - Rent: Model Tenancy Act s.11/20/21, Contract Act s.74, Court bars under s.28.
 * - Employment: Non-compete covenants (Contract Act s.27), arbitrary bond damages
 *   (s.74), unauthorized wage deductions (Payment of Wages Act s.7).
 * - Cheque Notice: Statutory notice under NI Act s.138, triggering 15-day demand
 *   window and 30-day magistrate complaint limitation under s.142.
 * - Digital Loan: Unilateral interest rate hikes, contact harassment, and court bars
 *   under CPA 2019 s.2(46) and ICA s.28.
 * - Consumer Warranty: Defect disclaimers, unfair limitation of liability, and the
 *   2-year limitation clock under CPA 2019 s.69.
 */
export const SAMPLE_RENT_AGREEMENT = `LEAVE AND LICENCE AGREEMENT

This agreement is made on 12th January 2026 between Shri R. Mohanty (the Licensor) and the Licensee, for the residential flat at Plot 44, Sector 9.

1. RENT. The Licensee shall pay Rs. 18,000 per month, payable in advance on or before the 5th day of each month.

2. SECURITY DEPOSIT. The Licensee shall deposit Rs. 1,80,000, being ten months' rent, with the Licensor. The deposit shall carry no interest.

3. FORFEITURE. If the Licensee vacates before completion of eleven months for any reason whatsoever, the entire security deposit shall stand forfeited absolutely to the Licensor, without any requirement to show loss.

4. ENTRY. The Licensor or his representatives may enter the premises at any time without prior notice to the Licensee for inspection or any other purpose.

5. REPAIRS. All repairs of every nature, structural or otherwise, shall be carried out by the Licensee at the Licensee's own cost.

6. TERMINATION. The Licensor may terminate this agreement at any time by giving twenty-four hours' notice, without assigning any reason. The Licensee may not terminate before eleven months under any circumstances.

7. DISPUTES. The Licensee agrees and undertakes that he shall not file any complaint, suit or proceeding against the Licensor before any court, forum or consumer commission in respect of any matter arising out of this agreement. The decision of the Licensor shall be final and binding.

8. ESSENTIAL SUPPLIES. In the event of any default in payment, the Licensor shall be entitled to disconnect the water and electricity supply to the premises until the default is cured.

9. The Licensee has paid Rs. 1,80,000 on 12th January 2026. The Licensor failed to hand over possession of the flat on the agreed date of 1st February 2026 and possession remains with the Licensor.`;

export const SAMPLE_EMPLOYMENT_CONTRACT = `EMPLOYMENT AGREEMENT & SERVICE BOND

This Employment Agreement is executed on 1st November 2025 by Apex Cloud Solutions Pvt. Ltd. (Employer) and the Employee.

1. POSITION AND SALARY. The Employee is appointed as Junior Software Engineer at a monthly gross salary of Rs. 28,000.

2. MANDATORY SERVICE BOND. The Employee agrees to serve the Employer continuously for a minimum period of 36 months from the joining date of 15th November 2025. If the Employee resigns, abandons, or is discharged for any reason before 36 months, the Employee shall immediately pay Rs. 3,50,000 as liquidated damages and training costs to the Employer without demur, regardless of whether any actual training expense was incurred.

3. POST-EMPLOYMENT NON-COMPETE. The Employee expressly covenants that for a period of 24 months following termination or resignation of employment for any reason, the Employee shall NOT directly or indirectly accept employment, consult, advise, or provide services to any company or business operating in software development or technology services anywhere within the territory of India.

4. SALARY DEDUCTIONS. The Employer shall be entitled at its sole discretion to deduct up to 40% of the Employee's monthly wage towards discretionary company reserve funds, operational costs, or alleged project delays without prior show-cause notice or domestic inquiry.

5. DISPUTES AND JURISDICTION. The Employee waives all rights to approach any labour court, industrial tribunal, or civil court regarding wages or termination. The decision of the Managing Director shall be final.

6. The Employee tendered resignation on 10th February 2026 after completing 3 months of service. The Employer withheld salary for January 2026 on 1st February 2026 and issued a demand for Rs. 3,50,000.`;

export const SAMPLE_LEGAL_NOTICE_138 = `LEGAL DEMAND NOTICE
Under Section 138 of the Negotiable Instruments Act, 1881

To:
M/s Verma Trading Co.,
Through its proprietor Shri Rajesh Verma,
G-12, Commercial Complex, Delhi - 110092

Sir/Madam,

Under instructions from my client, Shri Ashok Gupta, resident of B-4, Preet Vihar, Delhi, I hereby serve you with this statutory legal notice:

1. In discharge of your legally enforceable debt and liability for goods supplied under Invoice No. 402, you issued Cheque No. 492011 dated 10th January 2026 for an amount of Rs. 85,000/- drawn on HDFC Bank Ltd.

2. My client presented the said cheque for clearance through his banker State Bank of India. However, the said cheque was returned dishonoured and unpaid on 15th January 2026 with the Cheque Return Memo marked "Funds Insufficient".

3. My client received the Cheque Return Memo from his bank on 18th January 2026.

4. You are hereby called upon to pay the entire cheque amount of Rs. 85,000/- (Rupees Eighty-Five Thousand only) within fifteen (15) days from the date of receipt of this statutory notice.

5. Take notice that if you fail to make the payment within the stipulated 15 days, my client shall initiate criminal proceedings against you under Section 138 read with Section 142 of the Negotiable Instruments Act, 1881 before the competent Metropolitan Magistrate Court at your sole risk, cost and criminal consequences.

Notice dispatched by Speed Post on 20th January 2026. Delivered and acknowledged on 22nd January 2026.`;

export const SAMPLE_LOAN_AGREEMENT = `DIGITAL CREDIT FACILITY & LOAN AGREEMENT

This Agreement is executed digitally on 5th December 2025 between QuickRupee Fintech Capital Ltd. (Lender) and the Borrower.

1. LOAN AMOUNT & INITIAL INTEREST. The Lender agrees to disburse an instant micro-loan of Rs. 45,000 at an initial interest rate of 18% per annum for a tenure of 12 months.

2. UNILATERAL INTEREST MODIFICATION. The Lender reserves the absolute and unfettered right to increase the rate of interest up to 48% per annum at any time without prior written notice to the Borrower, and the Borrower shall be bound to pay the revised EMI automatically.

3. THIRD-PARTY CONTACT & DATA ACCESS. The Borrower grants the Lender and its third-party recovery agencies irrevocable permission to access the Borrower's entire mobile contact list, call logs, and gallery, and expressly authorizes the Lender to contact the Borrower's relatives, employers, and social contacts to recover overdue amounts. The Borrower waives all harassment and privacy claims.

4. PREPAYMENT PENALTY. If the Borrower seeks to foreclose or prepay the loan prior to maturity, a mandatory prepayment penalty of 12% of the outstanding principal shall be levied.

5. ARBITRATION & JURISDICTION. The Borrower agrees that all disputes shall be referred to a sole arbitrator appointed solely by the Lender in Mumbai. The Borrower waives any right to file a consumer complaint before any District or State Consumer Commission.

6. The Borrower paid monthly EMIs until 5th January 2026. On 10th January 2026, the Lender unilaterally increased the interest rate to 45% APR and debited an unauthorized penalty.`;

export const SAMPLE_CONSUMER_WARRANTY = `PRODUCT SALES TERMS AND WARRANTY CONDITIONS
Apex Appliances India Pvt. Ltd.

Product: ArcticCool Double-Door Inverter Refrigerator (Serial No. AC-2025-9941)
Date of Purchase: 10th November 2025
Invoice Amount: Rs. 36,500

1. LIMITED WARRANTY. The manufacturer warrants this product against manufacturing defects for 12 months from the date of purchase.

2. COMPLETE EXCLUSION OF LIABILITY. The manufacturer and dealer shall have no liability whatsoever for compressor failure, refrigerant gas leakage, electrical part malfunction, or food spoilage caused by cooling failure. The consumer's sole and exclusive remedy shall be repair at the consumer's cost for spare parts and labour.

3. SEVEN-DAY REPLACEMENT BAR. No replacement or refund shall be entertained under any circumstances after seven (7) days from the date of invoice, even if the appliance is completely non-functional upon delivery.

4. CONSUMER FORUM WAIVER. The purchaser expressly waives the right to approach the District Consumer Disputes Redressal Commission or any other statutory authority under the Consumer Protection Act, 2019. Any claim not raised within thirty (30) days of delivery shall be forever barred.

5. The appliance suffered total compressor failure on 5th January 2026. The consumer lodged a service request on 8th January 2026. The company officially refused replacement or free repair on 15th January 2026, citing Clause 2 and Clause 3.`;

export interface SampleDocument {
  id: string;
  category: "rent" | "employment" | "cheque_notice" | "loan" | "consumer";
  title: Record<Language, string>;
  description: Record<Language, string>;
  text: string;
}

export const SAMPLE_DOCUMENTS: readonly SampleDocument[] = [
  {
    id: "rent",
    category: "rent",
    title: {
      en: "Rent Agreement",
      hi: "किराया समझौता",
      bn: "ভাড়া চুক্তি",
    },
    description: {
      en: "Excessive 10-month deposit, blanket forfeiture, arbitrary entry, and court bar.",
      hi: "अवैध 10 महीने का डिपॉजिट, मनमानी जब्ती और अदालत जाने पर रोक।",
      bn: "১০ মাসের বেআইনি ডিপোজিট, নির্বিচারে বাজেয়াপ্তকরণ এবং আদালতে বাধার ধারা।",
    },
    text: SAMPLE_RENT_AGREEMENT,
  },
  {
    id: "employment",
    category: "employment",
    title: {
      en: "Job Bond & Non-Compete",
      hi: "नौकरी अनुबंध व बॉन्ड",
      bn: "চাকরির বন্ড ও শর্ত",
    },
    description: {
      en: "2-year post-job non-compete covenant, Rs. 3.5L bond forfeiture, and arbitrary pay cuts.",
      hi: "2 साल का गैर-प्रतिस्पर्धा खंड, 3.5 लाख का बॉन्ड और वेतन से मनमानी कटौती।",
      bn: "২ বছরের নন-কম্পিট ক্লজ, ৩.৫ লাখ টাকার বন্ড এবং বেতন থেকে অননুমোদিত কর্তন।",
    },
    text: SAMPLE_EMPLOYMENT_CONTRACT,
  },
  {
    id: "cheque_notice",
    category: "cheque_notice",
    title: {
      en: "Cheque Bounce Notice (s. 138)",
      hi: "चेक बाउंस नोटिस (धारा 138)",
      bn: "চেক বাউন্স নোটিশ (ধারা ১৩৮)",
    },
    description: {
      en: "Section 138 demand notice triggering 15-day payment window and 30-day limitation.",
      hi: "धारा 138 नोटिस: 15 दिन की भुगतान मियाद और 30 दिन की शिकायत सीमा।",
      bn: "ধারা ১৩৮ নোটিশ: ১৫ দিনের দাবি ও ৩০ দিনের ম্যাজিস্ট্রেট অভিযোগের সময়সীমা।",
    },
    text: SAMPLE_LEGAL_NOTICE_138,
  },
  {
    id: "loan",
    category: "loan",
    title: {
      en: "Instant Digital Loan",
      hi: "डिजिटल लोन शर्तें",
      bn: "ডিজিটাল ঋণের শর্তাবলী",
    },
    description: {
      en: "Unilateral interest hike from 18% to 48%, contact harassment waiver, and forced arbitration.",
      hi: "मनमाना ब्याज बढ़ाना, संपर्कों को परेशान करने की अनुमति और उपभोक्ता फोरम पर रोक।",
      bn: "একতরফা চড়া সুদ বৃদ্ধি, আত্মীয়দের হেনস্থার অনুমতি এবং উপভোক্তা ফোরাম বর্জন।",
    },
    text: SAMPLE_LOAN_AGREEMENT,
  },
  {
    id: "consumer",
    category: "consumer",
    title: {
      en: "Appliance Warranty",
      hi: "उपकरण वारंटी व बिक्री",
      bn: "সরঞ্জাম ওয়ারেন্টি শর্ত",
    },
    description: {
      en: "7-day replacement bar, total liability disclaimer, and 2-year CPA limitation clock.",
      hi: "7 दिन में रिप्लेसमेंट बंद, उत्तरदायित्व से इनकार और 2 साल की उपभोक्ता अदालत सीमा।",
      bn: "৭ দিনের পর পরিবর্তন নিষিদ্ধ, দায় অস্বীকার এবং ২ বছরের ভোক্তা আদালতের সময়সীমা।",
    },
    text: SAMPLE_CONSUMER_WARRANTY,
  },
];

export interface ComparisonSample {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  originalText: string;
  modifiedText: string;
}

export const COMPARISON_SAMPLES: ComparisonSample[] = [
  {
    id: "tenancy_renewal",
    title: {
      en: "Tenancy Renewal vs Original Lease",
      hi: "किराया नवीनीकरण बनाम मूल अनुबंध",
      bn: "ভাড়া চুক্তি পুনর্নবীকরণ বনাম মূল চুক্তি",
    },
    description: {
      en: "Landlord increased deposit to 10 months, removed 30-day notice, and added power/water shutoff rights.",
      hi: "मकान मालिक ने 10 महीने की जमानत राशि मांगी, 30 दिन का नोटिस हटाया और बिजली-पानी काटने का अधिकार जोड़ा।",
      bn: "বাড়িওয়ালা ১০ মাসের জামানত দাবি করেছে, ৩০ দিনের নোটিশ বাতিল করেছে এবং বিদ্যুৎ-জল কাটার অধিকার যুক্ত করেছে।",
    },
    originalText: `RESIDENTIAL TENANCY LEASE (ORIGINAL - 2025)
Date: 1st April 2025. Between Shri S. Sharma (Landlord) and Sri A. Roy (Tenant).
1. RENT & DEPOSIT: Monthly rent is Rs. 20,000 payable on 5th of each month. Security deposit is Rs. 40,000 (two months rent), refundable within 15 days of vacating.
2. NOTICE & TERMINATION: Either party may terminate this agreement by giving 30 days written notice.
3. ENTRY & PRIVACY: Landlord may inspect the premises with 24 hours prior notice at reasonable daytime hours.
4. UTILITIES & SERVICES: Landlord shall ensure regular supply of electricity and municipal water.
5. MAINTENANCE: Major structural repairs shall be borne by the Landlord; minor wear by Tenant.`,
    modifiedText: `RESIDENTIAL TENANCY LEASE (REVISED RENEWAL - 2026)
Date: 1st April 2026. Between Shri S. Sharma (Landlord) and Sri A. Roy (Tenant).
1. RENT & DEPOSIT: Monthly rent is Rs. 26,000. Tenant must deposit an additional Rs. 2,00,000, bringing total deposit to Rs. 2,40,000 (ten months rent). Deposit is non-interest bearing and subject to blanket forfeiture at Landlord's discretion.
2. NOTICE & TERMINATION: Landlord may terminate this agreement with 24 hours notice without assigning reasons. Tenant cannot terminate before 12 months without complete deposit forfeiture.
3. ENTRY & PRIVACY: Landlord or his representatives may enter the premises at any hour without prior notice.
4. UTILITIES & DISCONNECTION: In case of rent delay beyond the 3rd of any month, Landlord reserves absolute right to disconnect water and electricity supplies immediately.
5. REPAIRS: All structural and external repairs must be carried out by Tenant at Tenant's sole expense.
6. DISPUTES: Tenant undertakes not to approach any Rent Authority, Civil Court, or Consumer Forum.`,
  },
  {
    id: "employment_amendment",
    title: {
      en: "Employment Amendment vs Offer Letter",
      hi: "नौकरी संशोधन बनाम मूल नियुक्ति पत्र",
      bn: "চাকরির সংশোধন বনাম মূল নিয়োগপত্র",
    },
    description: {
      en: "Employer inserted 2-year post-job non-compete restraint, Rs. 3.5 Lakh penalty bond, and wage deductions.",
      hi: "नियोक्ता ने 2 साल का गैर-प्रतिस्पर्धा प्रतिबंध, 3.5 लाख का बॉन्ड और वेतन से कटौती की शर्तें जोड़ीं।",
      bn: "নিয়োগকারী ২ বছরের কর্মসংস্থান নিষেধাজ্ঞা, ৩.৫ লাখ টাকার বন্ড জরিমানা এবং বেতন কর্তনের শর্ত চাপিয়েছে।",
    },
    originalText: `APPOINTMENT LETTER (ORIGINAL OFFER - 2025)
Date: 10th January 2025. Nexa Dynamics Pvt Ltd (Employer) and Ms. P. Verma (Employee).
1. DESIGNATION & SALARY: Junior Developer at gross monthly salary of Rs. 35,000.
2. PROBATION & NOTICE: 3 months probation. Either party may terminate with 30 days written notice or pay in lieu thereof.
3. CONFIDENTIALITY: Employee agrees to preserve confidentiality of proprietary code and customer records.
4. INTELLECTUAL PROPERTY: Work product created during work hours for the Employer belongs to the Employer.`,
    modifiedText: `EMPLOYMENT CONTRACT AMENDMENT & SERVICE BOND (REVISION - 2026)
Date: 10th January 2026. Nexa Dynamics Pvt Ltd (Employer) and Ms. P. Verma (Employee).
1. DESIGNATION & SALARY: Software Developer at gross monthly salary of Rs. 45,000.
2. MANDATORY BOND & PENALTY: Employee covenants to serve for minimum 36 months continuously. If Employee resigns or leaves before 36 months, Employee must pay Rs. 3,50,000 as liquidated damages and training costs, regardless of whether any training was conducted.
3. POST-TERMINATION NON-COMPETE: For 24 months following cessation of employment for any reason, Employee is strictly prohibited from working with or consulting for any tech company anywhere in India.
4. SALARY DEDUCTIONS: Employer reserves unconditional right to deduct up to 40% of monthly salary for project delays or reserve funds without notice.
5. DISPUTES: Employee agrees not to seek redress before any Labour Court or Civil Court.`,
  },
];

export interface QuickQuestion {
  id: string;
  label: Record<Language, string>;
  question: Record<Language, string>;
}

export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "q_deposit",
    label: {
      en: "Deposit Forfeiture",
      hi: "जमानत राशि ज़ब्ती",
      bn: "জামানত অর্থ বাজেয়াপ্ত",
    },
    question: {
      en: "Can the other party forfeit my entire security deposit without proving actual financial loss?",
      hi: "क्या दूसरा पक्ष वास्तविक वित्तीय नुकसान साबित किए बिना मेरी पूरी सुरक्षा जमा राशि ज़ब्त कर सकता है?",
      bn: "অপর পক্ষ কি প্রকৃত আর্থিক ক্ষতি প্রমাণ না করে আমার সম্পূর্ণ জামানতের টাকা বাজেয়াপ্ত করতে পারে?",
    },
  },
  {
    id: "q_noncompete",
    label: {
      en: "Non-Compete Legality",
      hi: "गैर-प्रतिस्पर्धा वैधता",
      bn: "নন-কম্পিট ক্লজের বৈধতা",
    },
    question: {
      en: "Is the post-termination non-compete clause legally binding or enforceable against me under Indian law?",
      hi: "क्या नौकरी छोड़ने के बाद गैर-प्रतिस्पर्धा खंड भारतीय कानून के तहत मुझ पर कानूनी रूप से लागू हो सकता है?",
      bn: "চাকরি ছাড়ার পর প্রতিযোগিতামূলক সংস্থায় কাজে যোগ না দেওয়ার শর্তটি কি ভারতীয় আইনে বৈধ?",
    },
  },
  {
    id: "q_deadlines",
    label: {
      en: "Deadlines & Next Steps",
      hi: "समय सीमा व आगे के कदम",
      bn: "সময়সীমা ও পরবর্তী পদক্ষেপ",
    },
    question: {
      en: "What are the strict statutory deadlines or reply time limits mentioned in or triggered by this document?",
      hi: "इस दस्तावेज़ में उल्लिखित या इसके कारण शुरू होने वाली सख्त कानूनी समय-सीमाएं या जवाब देने की अंतिम तिथि क्या है?",
      bn: "এই নথিতে উল্লিখিত বা এর প্রেক্ষিতে আমার জন্য নির্দিষ্ট আইনি সময়সীমা বা পদক্ষেপের শেষ তারিখ কী?",
    },
  },
  {
    id: "q_waiver",
    label: {
      en: "Court/Forum Waivers",
      hi: "अदालत जाने पर रोक",
      bn: "আদালত বর্জনের শর্ত",
    },
    question: {
      en: "Can a clause prevent me from approaching consumer commissions or courts if a dispute arises?",
      hi: "क्या कोई खंड विवाद होने पर मुझे उपभोक्ता अदालत या न्यायालय जाने से रोक सकता है?",
      bn: "কোনো শর্ত কি আমাকে বিরোধ দেখা দিলে ভোক্তা আদালত বা কোর্টে যাওয়া থেকে আটকাতে পারে?",
    },
  },
];
