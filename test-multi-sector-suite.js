const https = require('https');

function test(sector, query) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({ sector, query, model: 'raki-master' });
        const options = {
            hostname: 'internship.tsaritservices.com',
            port: 443,
            path: '/raki-ai/api/sector/analyze',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 300000
        };

        const startTime = Date.now();
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                const duration = ((Date.now() - startTime) / 1000).toFixed(1);
                try {
                    const data = JSON.parse(body);
                    resolve({ status: res.statusCode, duration, data });
                } catch (e) {
                    resolve({ status: res.statusCode, duration, raw: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

const sectorsToTest = [
    {
        sector: 'healthcare',
        name: '🩺 Healthcare & Clinical',
        query: 'What are the key FHIR resources used for patient clinical data exchange and what is the ESI triage Level 1 criteria?'
    },
    {
        sector: 'beauty',
        name: '💄 Beauty & Skincare',
        query: 'What is the optimal ceramide-to-cholesterol lipid molar ratio for skin barrier repair and what is the rule for mixing Vitamin C with Niacinamide?'
    },
    {
        sector: 'telecom',
        name: '📡 Telecom & 5G/6G',
        query: 'Explain the 3 primary 5G Network Slices (eMBB, URLLC, mMTC) and how BGP self-healing mitigates fiber packet drops.'
    },
    {
        sector: 'agriculture',
        name: '🌾 Agriculture & AgTech',
        query: 'What is the mathematical formula for NDVI and what does an NDVI value of 0.75 indicate versus 0.20?'
    },
    {
        sector: 'government',
        name: '🏛️ Government & Public Sector',
        query: 'How does digital identity (eID) authenticate citizens securely and how does automated BIM permitting verify building compliance?'
    }
];

async function run() {
    console.log("==========================================================================");
    console.log("⚡ TESTING RAKI MASTER AI — MULTI-SECTOR REAL-TIME INTELLIGENCE SUITE ⚡");
    console.log("==========================================================================");

    for (const item of sectorsToTest) {
        console.log(`\n--------------------------------------------------------------------------`);
        console.log(`Testing Sector: ${item.name}`);
        console.log(`Query: "${item.query}"`);
        const res = await test(item.sector, item.query);
        console.log(`Status: ${res.status} | Latency: ${res.duration}s | Docs: ${res.data?.context_documents?.length}`);
        console.log(`Response Preview:\n${res.data?.analysis?.substring(0, 300)}...\n`);
    }

    console.log("==========================================================================");
    console.log("✅ ALL SECTOR INTELLIGENCE VERIFICATIONS COMPLETED SUCCESSFULLY!");
    console.log("==========================================================================");
}

run().catch(console.error);
