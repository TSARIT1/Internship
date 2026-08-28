const { Client } = require('ssh2');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

async function main() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('SFTP connected to VPS...');
    conn.sftp((err, sftp) => {
      if (err) throw err;

      // 1. Update Navbar.jsx
      const navbarPath = '/var/www/tsaritservices/frontend/src/app/layout/Navbar.jsx';
      sftp.readFile(navbarPath, 'utf8', (rErr, navContent) => {
        if (rErr) throw rErr;

        // Replace language selector logic with TCS Accordion structure
        const tcsRegionsCode = `
const TCS_REGIONS = [
  { id: "global", name: "Global (English)", regionName: "Global", code: "en" },
  { id: "apac", name: "Asia Pacific (English)", regionName: "Asia Pacific", code: "en" },
  { id: "anz", name: "Australia and New Zealand (English)", regionName: "Australia & NZ", code: "en" },
  { id: "eu", name: "Europe (English)", regionName: "Europe", code: "en" },
  { id: "in", name: "India (English)", regionName: "India", code: "en" },
  { id: "latam", name: "Latin America (English)", regionName: "Latin America", code: "en" },
  { id: "mea", name: "Middle East and Africa (English)", regionName: "Middle East & Africa", code: "en" },
  { id: "na", name: "North America (English)", regionName: "North America", code: "en" },
  { id: "uk", name: "UK and Ireland (English)", regionName: "UK & Ireland", code: "en" },
];

const TCS_LOCAL_SITES = [
  { code: "ar", label: "Middle East & UAE (العربية)", shortLabel: "AR" },
  { code: "zh", label: "Mainland China (中文)", shortLabel: "ZH" },
  { code: "ja", label: "Japan (日本語)", shortLabel: "JA" },
  { code: "ko", label: "South Korea (한국어)", shortLabel: "KO" },
  { code: "de", label: "Germany (Deutsch)", shortLabel: "DE" },
  { code: "fr", label: "France (Français)", shortLabel: "FR" },
  { code: "es", label: "Spain & Latin America (Español)", shortLabel: "ES" },
  { code: "it", label: "Italy (Italiano)", shortLabel: "IT" },
  { code: "ru", label: "Russia (Русский)", shortLabel: "RU" },
  { code: "hi", label: "India (हिन्दी - Hindi)", shortLabel: "HI" },
  { code: "te", label: "India (తెలుగు - Telugu)", shortLabel: "TE" },
  { code: "ta", label: "India (தமிழ் - Tamil)", shortLabel: "TA" },
  { code: "kn", label: "India (ಕನ್ನಡ - Kannada)", shortLabel: "KN" },
  { code: "ml", label: "India (മലയാളം - Malayalam)", shortLabel: "ML" },
  { code: "gu", label: "India (ગુજરાતી - Gujarati)", shortLabel: "GU" },
  { code: "mr", label: "India (मराठी - Marathi)", shortLabel: "MR" },
  { code: "bn", label: "India (বাংলা - Bengali)", shortLabel: "BN" },
];`;

        // Check if TCS constants already exist
        let updatedNav = navContent;
        if (!updatedNav.includes('TCS_REGIONS')) {
          updatedNav = updatedNav.replace('const Navbar = () => {', `${tcsRegionsCode}\n\nconst Navbar = () => {`);
        }

        // Add state for accordion
        if (!updatedNav.includes('isRegionsOpen')) {
          updatedNav = updatedNav.replace(
            'const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);',
            `const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(true);
  const [isLocalOpen, setIsLocalOpen] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("Global");

  useEffect(() => {
    try {
      const savedReg = localStorage.getItem("tsar-selected-region");
      if (savedReg) setSelectedRegion(savedReg);
    } catch {}
  }, []);`
          );
        }

        // Update language label logic & handlers
        const oldHandlersRegex = /const currentLanguage =[\s\S]*?const handleLanguageSelection = \(code\) => \{[\s\S]*?\};\n/m;
        const newHandlers = `  const currentLanguage =
    availableLanguages.find((item) => item.code === language) ||
    availableLanguages[0];

  const languageLabel =
    language === "en"
      ? \`\${selectedRegion} (En)\`
      : \`Global (\${currentLanguage?.shortLabel ?? "EN"})\`;

  const handleRegionSelection = (region) => {
    setSelectedRegion(region.regionName);
    try {
      localStorage.setItem("tsar-selected-region", region.regionName);
    } catch {}
    changeLanguage("en");
    setShowLanguageDropdown(false);
    setActiveDropdown(null);
  };

  const handleLocalLanguageSelection = (code) => {
    changeLanguage(code);
    setShowLanguageDropdown(false);
    setActiveDropdown(null);
  };
`;

        if (oldHandlersRegex.test(updatedNav)) {
          updatedNav = updatedNav.replace(oldHandlersRegex, newHandlers);
        }

        // Replace JSX for Language Selector Dropdown with TCS Accordion JSX
        const oldDropdownRegex = /\{showLanguageDropdown && \([\s\S]*?<div className="language-dropdown">[\s\S]*?<\/div>\s*\)\}/;
        const newDropdownJSX = `{showLanguageDropdown && (
                <div className="language-dropdown tcs-dropdown">
                  {/* Regions Accordion */}
                  <div className="tcs-accordion-section">
                    <button
                      type="button"
                      className="tcs-accordion-header"
                      onClick={() => setIsRegionsOpen(!isRegionsOpen)}
                    >
                      <span>Regions</span>
                      {isRegionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isRegionsOpen && (
                      <div className="tcs-accordion-body">
                        {TCS_REGIONS.map((reg) => {
                          const isActive = language === "en" && selectedRegion === reg.regionName;
                          return (
                            <button
                              key={reg.id}
                              type="button"
                              className={\`tcs-language-item \${isActive ? "active" : ""}\`}
                              onClick={() => handleRegionSelection(reg)}
                            >
                              <span>{reg.name}</span>
                              {isActive && <Check size={14} className="tcs-active-check" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Local Language Sites Accordion */}
                  <div className="tcs-accordion-section">
                    <button
                      type="button"
                      className="tcs-accordion-header"
                      onClick={() => setIsLocalOpen(!isLocalOpen)}
                    >
                      <span>Local Language Sites</span>
                      {isLocalOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isLocalOpen && (
                      <div className="tcs-accordion-body">
                        {TCS_LOCAL_SITES.map((site) => {
                          const isActive = language === site.code;
                          return (
                            <button
                              key={site.code}
                              type="button"
                              className={\`tcs-language-item \${isActive ? "active" : ""}\`}
                              onClick={() => handleLocalLanguageSelection(site.code)}
                            >
                              <span>{site.label}</span>
                              {isActive && <Check size={14} className="tcs-active-check" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {isTranslating && (
                    <div className="language-status" role="status">
                      Applying language translation...
                    </div>
                  )}
                </div>
              )}`;

        if (oldDropdownRegex.test(updatedNav)) {
          updatedNav = updatedNav.replace(oldDropdownRegex, newDropdownJSX);
        }

        // Also check if ChevronUp is imported in Navbar.jsx
        if (!updatedNav.includes('ChevronUp,')) {
          updatedNav = updatedNav.replace('ChevronDown,', 'ChevronDown,\n  ChevronUp,');
        }

        sftp.writeFile(navbarPath, updatedNav, (wErr) => {
          if (wErr) throw wErr;
          console.log('✅ Navbar.jsx successfully updated with TCS Accordion design!');

          // 2. Append TCS Styling to Navbar.css
          const cssPath = '/var/www/tsaritservices/frontend/src/app/layout/Navbar.css';
          sftp.readFile(cssPath, 'utf8', (cssErr, cssContent) => {
            if (cssErr) throw cssErr;

            const tcsCss = `
/* ===================================================
   TCS ENTERPRISE REGIONS & LANGUAGE ACCORDION STYLING
   =================================================== */
.tcs-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-height: 480px;
  background: #111119 !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 10px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
  z-index: 1202;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.tcs-dropdown::-webkit-scrollbar {
  width: 5px;
}

.tcs-dropdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.tcs-accordion-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.tcs-accordion-section:last-child {
  border-bottom: none;
}

.tcs-accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  background: #161622;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.tcs-accordion-header:hover {
  background: #1f1f2e;
}

.tcs-accordion-body {
  background: #0d0d14;
}

.tcs-language-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: #c4c4d2;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tcs-language-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  padding-left: 22px;
}

.tcs-language-item.active {
  background: rgba(122, 33, 42, 0.25);
  color: #ffffff;
  font-weight: 600;
  border-left: 3px solid var(--tsar-brand, #7a212a);
}

.tcs-active-check {
  color: #7dffd9;
  flex-shrink: 0;
}
`;

            let updatedCss = cssContent;
            if (!updatedCss.includes('TCS ENTERPRISE REGIONS & LANGUAGE')) {
              updatedCss += tcsCss;
            }

            sftp.writeFile(cssPath, updatedCss, (cssWErr) => {
              if (cssWErr) throw cssWErr;
              console.log('✅ Navbar.css updated with TCS Accordion styling!');

              // 3. Rebuild Next.js Container on VPS
              console.log('Rebuilding Docker container on VPS...');
              conn.exec('cd /var/www/tsaritservices && docker compose build tsarit-frontend && docker compose up -d tsarit-frontend', (execErr, stream) => {
                if (execErr) throw execErr;
                stream.on('close', () => {
                  console.log('🎉 Container rebuilt successfully with TCS Language & Regions design!');
                  conn.end();
                })
                .on('data', d => process.stdout.write(d))
                .stderr.on('data', d => process.stderr.write(d));
              });
            });
          });
        });
      });
    });
  }).connect(config);
}

main();
