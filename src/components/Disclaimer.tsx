import type { Language } from "@/lib/schema";
import { t } from "@/lib/i18n/translations";

/**
 * Shown on every screen, not behind a dismiss button.
 *
 * The scope note matters as much as the caveat: telling someone what the tool
 * *is* for is what stops them treating it as something it is not.
 */
export function Disclaimer({ language = "en" }: { language?: Language } = {}) {
  const tr = t(language).disclaimer;

  return (
    <aside className="notice" aria-labelledby="disclaimer-heading">
      <h2 id="disclaimer-heading" style={{ fontSize: "1.0625rem" }}>
        {tr.heading}
      </h2>
      <p>{tr.p1}</p>
      <p>
        {language === "en" ? (
          <>
            Free legal aid is a right, not a favour. Your District Legal Services
            Authority sits in the district court complex, and the NALSA helpline is{" "}
            <strong>15100</strong>.
          </>
        ) : language === "hi" ? (
          <>
            मुफ्त कानूनी सहायता एक अधिकार है, कोई उपकार नहीं। आपका जिला विधिक सेवा प्राधिकरण जिला अदालत परिसर में बैठता है, और नालसा (NALSA) हेल्पलाइन{" "}
            <strong>15100</strong> है।
          </>
        ) : (
          <>
            বিনামূল্যে আইনি সহায়তা একটি অধিকার, কোনো অনুগ্রহ নয়। আপনার জেলা আইনি পরিষেবা কর্তৃপক্ষ জেলা আদালত চত্বরে অবস্থিত এবং নালসা (NALSA) হেল্পলাইন নম্বর{" "}
            <strong>১৫১০০</strong>।
          </>
        )}
      </p>
    </aside>
  );
}
