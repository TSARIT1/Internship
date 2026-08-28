const { Client } = require('ssh2');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

const newLanguageProviderCode = `"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LANGUAGE_STORAGE_KEY = "tsar-selected-language";
const SCRIPT_ID = "google-translate-script";

const AVAILABLE_LANGUAGES = [
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
    nativeName: "English",
    direction: "ltr",
    locale: "en",
  },
  {
    code: "ar",
    label: "Arabic (UAE & GCC)",
    shortLabel: "AR",
    nativeName: "العربية",
    direction: "rtl",
    locale: "ar",
  },
  {
    code: "es",
    label: "Spanish",
    shortLabel: "ES",
    nativeName: "Español",
    direction: "ltr",
    locale: "es",
  },
  {
    code: "fr",
    label: "French",
    shortLabel: "FR",
    nativeName: "Français",
    direction: "ltr",
    locale: "fr",
  },
  {
    code: "de",
    label: "German",
    shortLabel: "DE",
    nativeName: "Deutsch",
    direction: "ltr",
    locale: "de",
  },
  {
    code: "it",
    label: "Italian",
    shortLabel: "IT",
    nativeName: "Italiano",
    direction: "ltr",
    locale: "it",
  },
  {
    code: "zh",
    label: "Chinese",
    shortLabel: "ZH",
    nativeName: "中文",
    direction: "ltr",
    locale: "zh-CN",
  },
  {
    code: "ja",
    label: "Japanese",
    shortLabel: "JA",
    nativeName: "日本語",
    direction: "ltr",
    locale: "ja",
  },
  {
    code: "ko",
    label: "Korean",
    shortLabel: "KO",
    nativeName: "한국어",
    direction: "ltr",
    locale: "ko",
  },
  {
    code: "ru",
    label: "Russian",
    shortLabel: "RU",
    nativeName: "Русский",
    direction: "ltr",
    locale: "ru",
  },
  {
    code: "hi",
    label: "Hindi",
    shortLabel: "HI",
    nativeName: "हिन्दी",
    direction: "ltr",
    locale: "hi",
  },
  {
    code: "ta",
    label: "Tamil",
    shortLabel: "TA",
    nativeName: "தமிழ்",
    direction: "ltr",
    locale: "ta",
  },
  {
    code: "te",
    label: "Telugu",
    shortLabel: "TE",
    nativeName: "తెలుగు",
    direction: "ltr",
    locale: "te",
  },
  {
    code: "kn",
    label: "Kannada",
    shortLabel: "KN",
    nativeName: "ಕನ್ನಡ",
    direction: "ltr",
    locale: "kn",
  },
  {
    code: "ml",
    label: "Malayalam",
    shortLabel: "ML",
    nativeName: "മലയാളം",
    direction: "ltr",
    locale: "ml",
  },
  {
    code: "gu",
    label: "Gujarati",
    shortLabel: "GU",
    nativeName: "ગુજરાતી",
    direction: "ltr",
    locale: "gu",
  },
  {
    code: "mr",
    label: "Marathi",
    shortLabel: "MR",
    nativeName: "मराठी",
    direction: "ltr",
    locale: "mr",
  },
  {
    code: "bn",
    label: "Bengali",
    shortLabel: "BN",
    nativeName: "বাংলা",
    direction: "ltr",
    locale: "bn",
  },
];

// Country to language mapping for IP auto-detection
const COUNTRY_TO_LANG = {
  AE: "ar", // UAE
  SA: "ar", // Saudi Arabia
  QA: "ar", // Qatar
  KW: "ar", // Kuwait
  BH: "ar", // Bahrain
  OM: "ar", // Oman
  EG: "ar", // Egypt
  JO: "ar", // Jordan
  LB: "ar", // Lebanon
  IQ: "ar", // Iraq
  ES: "es", // Spain
  MX: "es", // Mexico
  AR: "es", // Argentina
  CO: "es", // Colombia
  CL: "es", // Chile
  PE: "es", // Peru
  FR: "fr", // France
  DE: "de", // Germany
  AT: "de", // Austria
  IT: "it", // Italy
  CN: "zh", // China
  TW: "zh", // Taiwan
  HK: "zh", // Hong Kong
  JP: "ja", // Japan
  KR: "ko", // South Korea
  RU: "ru", // Russia
  BY: "ru", // Belarus
  KZ: "ru", // Kazakhstan
};

function setGoogtransCookie(locale) {
  if (typeof document === "undefined") return;
  const cookieVal = \`/en/\${locale}\`;
  const hostname = window.location.hostname;
  document.cookie = \`googtrans=\${cookieVal}; path=/;\`;
  document.cookie = \`googtrans=\${cookieVal}; path=/; domain=\${hostname};\`;
  const rootDomain = hostname.replace(/^www\\./, "");
  if (rootDomain.includes(".")) {
    document.cookie = \`googtrans=\${cookieVal}; path=/; domain=.\${rootDomain};\`;
  }
}

const LanguageContext = createContext({
  language: AVAILABLE_LANGUAGES[0].code,
  changeLanguage: () => {},
  availableLanguages: AVAILABLE_LANGUAGES,
  isTranslating: false,
});

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
  const pathname = usePathname();
  const [language, setLanguage] = useState(AVAILABLE_LANGUAGES[0].code);
  const [translatorReady, setTranslatorReady] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const appliedLocaleRef = useRef(AVAILABLE_LANGUAGES[0].locale);
  const translatorPromiseRef = useRef(null);

  const ensureDirectionAttributes = useCallback((code) => {
    if (typeof document === "undefined") return;
    const current =
      AVAILABLE_LANGUAGES.find((lang) => lang.code === code) ||
      AVAILABLE_LANGUAGES[0];
    document.documentElement.setAttribute("lang", current.locale);
    document.documentElement.setAttribute("dir", current.direction);
    if (document.body) {
      document.body.setAttribute("dir", current.direction);
      document.body.classList.toggle("rtl", current.direction === "rtl");
      document.body.dataset.locale = current.locale;
    }
  }, []);

  const initializeTranslator = useCallback(() => {
    if (typeof window === "undefined" || !window.google?.translate) {
      return false;
    }

    const container = document.getElementById("google_translate_container");
    if (container && container.childElementCount === 0) {
      try {
        const TranslateCtor = window.google.translate.TranslateElement;
        if (typeof TranslateCtor === "function") {
          new TranslateCtor(
            {
              pageLanguage: "en",
              includedLanguages: AVAILABLE_LANGUAGES.map(
                (lang) => lang.locale,
              ).join(","),
              autoDisplay: false,
            },
            "google_translate_container",
          );
        }
      } catch (err) {
        console.warn("Failed to initialize Google Translate element", err);
        return false;
      }
    }

    setTranslatorReady(true);
    return true;
  }, []);

  const ensureTranslator = useCallback(() => {
    if (typeof window === "undefined") {
      return Promise.resolve(false);
    }

    if (initializeTranslator()) {
      return Promise.resolve(true);
    }

    if (translatorPromiseRef.current) {
      return translatorPromiseRef.current;
    }

    translatorPromiseRef.current = new Promise((resolve, reject) => {
      let settled = false;
      const finish = (value, error) => {
        if (settled) return;
        settled = true;
        if (error) reject(error);
        else resolve(value);
      };

      window.googleTranslateElementInit = () => {
        try {
          finish(initializeTranslator());
        } catch (error) {
          finish(false, error);
        }
      };

      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => finish(initializeTranslator()),
          { once: true },
        );
        existingScript.addEventListener(
          "error",
          () => finish(false, new Error("Failed to load translation script.")),
          { once: true },
        );
        window.setTimeout(() => {
          if (window.google?.translate) finish(initializeTranslator());
        }, 0);
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onload = () => finish(initializeTranslator());
      script.onerror = () =>
        finish(false, new Error("Failed to load translation script."));
      document.body.appendChild(script);
    }).finally(() => {
      translatorPromiseRef.current = null;
    });

    return translatorPromiseRef.current;
  }, [initializeTranslator]);

  // 1. Auto-detect user IP & location / browser locale on first visit
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && AVAILABLE_LANGUAGES.some((l) => l.code === stored)) {
        setLanguage(stored);
        ensureDirectionAttributes(stored);
        const loc = AVAILABLE_LANGUAGES.find((l) => l.code === stored)?.locale || stored;
        setGoogtransCookie(loc);
        return;
      }
    } catch {}

    // First: Check Browser Navigator Language (instant)
    const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    const matchedLang = AVAILABLE_LANGUAGES.find(
      (l) => browserLang.startsWith(l.code) || browserLang === l.locale.toLowerCase()
    );

    if (matchedLang && matchedLang.code !== "en") {
      setLanguage(matchedLang.code);
      ensureDirectionAttributes(matchedLang.code);
      setGoogtransCookie(matchedLang.locale);
      return;
    }

    // Second: Check GeoIP for automatic location conversion (e.g. UAE -> Arabic)
    fetch("https://api.country.is/")
      .then((res) => res.json())
      .then((data) => {
        const countryCode = data?.country?.toUpperCase();
        if (countryCode && COUNTRY_TO_LANG[countryCode]) {
          const autoLangCode = COUNTRY_TO_LANG[countryCode];
          const autoLang = AVAILABLE_LANGUAGES.find((l) => l.code === autoLangCode);
          if (autoLang && autoLang.code !== "en") {
            setLanguage(autoLang.code);
            ensureDirectionAttributes(autoLang.code);
            setGoogtransCookie(autoLang.locale);
          }
        }
      })
      .catch(() => {
        // Fallback cleanly to English
      });
  }, [ensureDirectionAttributes]);

  // 2. Ensure direction attributes
  useEffect(() => {
    ensureDirectionAttributes(language);
  }, [language, ensureDirectionAttributes]);

  // 3. Trigger Translation when Language Changes or Route Changes
  useEffect(() => {
    const targetObj = AVAILABLE_LANGUAGES.find((lang) => lang.code === language);
    const targetLocale = targetObj?.locale ?? language;
    const defaultLocale = "en";

    setGoogtransCookie(targetLocale);

    if (targetLocale === defaultLocale) {
      setIsTranslating(true);
      const combo = document.querySelector("select.goog-te-combo");
      if (combo && combo.value !== defaultLocale) {
        combo.value = defaultLocale;
        combo.dispatchEvent(new Event("change"));
      }
      appliedLocaleRef.current = defaultLocale;
      const t = setTimeout(() => setIsTranslating(false), 300);
      return () => clearTimeout(t);
    }

    setIsTranslating(true);
    ensureTranslator().catch(() => {
      setTranslatorReady(false);
      setIsTranslating(false);
    });
  }, [ensureTranslator, language, pathname]);

  // 4. Apply Translation to Google Combo Element
  useEffect(() => {
    if (!translatorReady || typeof document === "undefined") return;

    const targetObj = AVAILABLE_LANGUAGES.find((lang) => lang.code === language);
    const targetLocale = targetObj?.locale ?? language;

    setIsTranslating(true);

    const attemptTranslate = (attempt = 0) => {
      const combo = document.querySelector("select.goog-te-combo");
      if (!combo) {
        if (attempt > 30) {
          setIsTranslating(false);
          return;
        }
        setTimeout(() => attemptTranslate(attempt + 1), 150);
        return;
      }
      if (combo.value !== targetLocale) {
        combo.value = targetLocale;
        combo.dispatchEvent(new Event("change"));
      }
      appliedLocaleRef.current = targetLocale;
      setTimeout(() => setIsTranslating(false), 500);
    };

    attemptTranslate();
  }, [language, translatorReady, pathname]);

  const changeLanguage = useCallback((nextCode) => {
    if (!AVAILABLE_LANGUAGES.some((lang) => lang.code === nextCode)) return;
    setIsTranslating(true);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextCode);
    } catch {}
    setLanguage(nextCode);
  }, []);

  const value = useMemo(
    () => ({
      language,
      changeLanguage,
      availableLanguages: AVAILABLE_LANGUAGES,
      isTranslating,
    }),
    [language, changeLanguage, isTranslating],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div
        id="google_translate_container"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
`;

async function main() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('SFTP connected to VPS...');
    conn.sftp((err, sftp) => {
      if (err) throw err;

      // 1. Write LanguageProvider.jsx
      const lpPath = '/var/www/tsaritservices/frontend/src/app/providers/LanguageProvider.jsx';
      sftp.writeFile(lpPath, newLanguageProviderCode, (wErr) => {
        if (wErr) throw wErr;
        console.log('✅ LanguageProvider.jsx successfully updated on VPS!');

        // 2. Update Navbar.jsx to have UAE / Arabic cleanly listed in categories
        const navbarPath = '/var/www/tsaritservices/frontend/src/app/layout/Navbar.jsx';
        sftp.readFile(navbarPath, 'utf8', (rErr, navContent) => {
          if (rErr) throw rErr;

          let updatedNav = navContent.replace(
            /const languagesByCategory = \{[\s\S]*?\n  \};/,
            `const languagesByCategory = {
    "Global & Popular": [
      { code: "en", label: "English", shortLabel: "EN", nativeName: "English" },
      { code: "es", label: "Spanish", shortLabel: "ES", nativeName: "Español" },
      { code: "fr", label: "French", shortLabel: "FR", nativeName: "Français" },
      { code: "de", label: "German", shortLabel: "DE", nativeName: "Deutsch" },
      { code: "it", label: "Italian", shortLabel: "IT", nativeName: "Italiano" },
    ],
    "Middle East & Asia": [
      { code: "ar", label: "Arabic (UAE & GCC)", shortLabel: "AR", nativeName: "العربية" },
      { code: "zh", label: "Chinese", shortLabel: "ZH", nativeName: "中文" },
      { code: "ja", label: "Japanese", shortLabel: "JA", nativeName: "日本語" },
      { code: "ko", label: "Korean", shortLabel: "KO", nativeName: "한국어" },
      { code: "ru", label: "Russian", shortLabel: "RU", nativeName: "Русский" },
    ],
    "Indian Languages": [
      { code: "hi", label: "Hindi", shortLabel: "HI", nativeName: "हिन्दी" },
      { code: "ta", label: "Tamil", shortLabel: "TA", nativeName: "தமிழ்" },
      { code: "te", label: "Telugu", shortLabel: "TE", nativeName: "తెలుగు" },
      { code: "kn", label: "Kannada", shortLabel: "KN", nativeName: "ಕನ್ನಡ" },
      { code: "ml", label: "Malayalam", shortLabel: "ML", nativeName: "മലയാളം" },
      { code: "gu", label: "Gujarati", shortLabel: "GU", nativeName: "ગુજરાતી" },
      { code: "mr", label: "Marathi", shortLabel: "MR", nativeName: "मराठी" },
      { code: "bn", label: "Bengali", shortLabel: "BN", nativeName: "বাংলা" },
    ],
  };`
          );

          sftp.writeFile(navbarPath, updatedNav, (navWErr) => {
            if (navWErr) throw navWErr;
            console.log('✅ Navbar.jsx successfully updated with UAE / Arabic categories!');

            // 3. Rebuild Docker container
            console.log('Rebuilding tsarit-frontend Docker container on VPS...');
            conn.exec('cd /var/www/tsaritservices && docker compose build tsarit-frontend && docker compose up -d tsarit-frontend', (execErr, stream) => {
              if (execErr) throw execErr;
              stream.on('close', () => {
                console.log('🎉 tsarit-frontend container rebuilt and running live!');
                conn.end();
              })
              .on('data', d => process.stdout.write(d))
              .stderr.on('data', d => process.stderr.write(d));
            });
          });
        });
      });
    });
  }).connect(config);
}

main();
