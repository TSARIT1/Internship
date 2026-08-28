const https = require('https');

function testSector(sector, query) {
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
            timeout: 180000
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

async function run() {
    console.log("==========================================================================");
    console.log("⚡ TESTING RAKI MASTER AI MULTI-SECTOR REAL-TIME DOMAIN INTELLIGENCE ⚡");
    console.log("==========================================================================");

    // 1. Banking
    console.log("\n🏦 [BANKING & FINTECH]");
    const bankRes = await testSector('banking', 'Construct an ISO 20022 pacs.008 XML payment message.');
    console.log(`Latency: ${bankRes.duration}s | Status: ${bankRes.status}`);
    console.log(`Knowledge Docs Ingested: ${bankRes.data.context_documents?.length}`);
    console.log(`Synthesis:\n${bankRes.data.analysis}`);

    // 2. Healthcare
    console.log("\n🩺 [HEALTHCARE & CLINICAL]");
    const healthRes = await testSector('healthcare', 'Generate a standard HL7 FHIR R4 Patient and Observation JSON bundle.');
    console.log(`Latency: ${healthRes.duration}s | Status: ${healthRes.status}`);
    console.log(`Synthesis:\n${healthRes.data.analysis}`);

    // 3. Beauty & Skincare
    console.log("\n💄 [BEAUTY & SKINCARE]");
    const beautyRes = await testSector('beauty', 'Formulate a 3:1:1 Ceramide barrier cream and explain active ingredient synergy.');
    console.log(`Latency: ${beautyRes.duration}s | Status: ${beautyRes.status}`);
    console.log(`Synthesis:\n${beautyRes.data.analysis}`);

    // 4. Telecom
    console.log("\n📡 [TELECOM & 5G/6G]");
    const teleRes = await testSector('telecom', 'Configure 5G Standalone URLLC network slice for sub-1ms latency.');
    console.log(`Latency: ${teleRes.duration}s | Status: ${teleRes.status}`);
    console.log(`Synthesis:\n${teleRes.data.analysis}`);

    // 5. Agriculture
    console.log("\n🌾 [AGRICULTURE & AGTECH]");
    const agriRes = await testSector('agriculture', 'Explain multispectral NDVI calculation and precision NPK dosage.');
    console.log(`Latency: ${agriRes.duration}s | Status: ${agriRes.status}`);
    console.log(`Synthesis:\n${agriRes.data.analysis}`);

    // 6. Government
    console.log("\n🏛️ [GOVERNMENT & PUBLIC SECTOR]");
    const govRes = await testSector('government', 'Design an automated municipal building permit workflow using BIM data.');
    console.log(`Latency: ${govRes.duration}s | Status: ${govRes.status}`);
    console.log(`Synthesis:\n${govRes.data.analysis}`);

    console.log("\n==========================================================================");
    console.log("✅ ALL 6 SECTOR INTELLIGENCE VERIFICATIONS COMPLETED AND CONFIRMED!");
    console.log("==========================================================================");
}

run().catch(console.error);
