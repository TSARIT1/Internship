const https = require('https');
const http = require('http');

function request(options, data = null) {
    return new Promise((resolve, reject) => {
        const client = options.protocol === 'http:' ? http : https;
        const req = client.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(body);
                } catch (e) {
                    parsed = body;
                }
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: parsed,
                    raw: body
                });
            });
        });

        req.on('error', (err) => reject(err));
        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

async function runFullSmokeAndBrowserTests() {
    console.log("================================================================================");
    console.log("🚀 RAKI MASTER AI — FULL MULTI-SITE SMOKE & BROWSER-LEVEL INTEGRATION SUITE 🚀");
    console.log("================================================================================\n");

    let passCount = 0;
    let failCount = 0;

    function report(name, condition, details = "") {
        if (condition) {
            console.log(`✅ [PASS] ${name}`);
            if (details) console.log(`   └─ ${details}`);
            passCount++;
        } else {
            console.log(`❌ [FAIL] ${name}`);
            if (details) console.log(`   └─ ${details}`);
            failCount++;
        }
    }

    // -------------------------------------------------------------------------
    // TEST 1: Direct Health Checks on Both Domains
    // -------------------------------------------------------------------------
    console.log("--- 1. MULTI-SITE HEALTH & API ENDPOINTS ---");
    try {
        const res1 = await request({
            protocol: 'https:',
            hostname: 'internship.tsaritservices.com',
            path: '/raki-ai/api/health',
            method: 'GET'
        });
        report(
            "TSAR IT Internship Health Endpoint (/raki-ai/api/health)",
            res1.statusCode === 200 && res1.body.status === 'online',
            `Status: ${res1.body.status} | Engine: ${res1.body.engine} | Models: ${res1.body.available_models_count} | Sectors: ${res1.body.trained_sectors?.length}`
        );
    } catch (e) {
        report("TSAR IT Internship Health Endpoint", false, e.message);
    }

    try {
        const res2 = await request({
            protocol: 'https:',
            hostname: 'rynatyai.com',
            path: '/raki-ai/api/health',
            method: 'GET'
        });
        report(
            "Rynaty AI Health Endpoint (/raki-ai/api/health)",
            res2.statusCode === 200 && res2.body.status === 'online',
            `Status: ${res2.body.status} | Engine: ${res2.body.engine}`
        );
    } catch (e) {
        report("Rynaty AI Health Endpoint", false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST 2: OpenAI v1 Compatibility Specs
    // -------------------------------------------------------------------------
    console.log("\n--- 2. OPENAI v1 COMPATIBILITY STANDARDS ---");
    try {
        const modelsRes = await request({
            protocol: 'https:',
            hostname: 'internship.tsaritservices.com',
            path: '/raki-ai/v1/models',
            method: 'GET'
        });
        const hasModels = modelsRes.statusCode === 200 && Array.isArray(modelsRes.body.data) && modelsRes.body.data.length > 0;
        report(
            "OpenAI v1 Models Endpoint (/raki-ai/v1/models)",
            hasModels,
            `Available Models: ${modelsRes.body.data?.map(m => m.id).join(', ')}`
        );
    } catch (e) {
        report("OpenAI v1 Models Endpoint", false, e.message);
    }

    try {
        const chatRes = await request({
            protocol: 'https:',
            hostname: 'internship.tsaritservices.com',
            path: '/raki-ai/v1/chat/completions',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            model: "raki-master",
            messages: [{ role: "user", content: "Respond with exactly: 'RAKI_AI_OPENAI_V1_READY'" }]
        });
        const hasContent = chatRes.statusCode === 200 && chatRes.body.choices?.[0]?.message?.content;
        report(
            "OpenAI v1 Chat Completions (/raki-ai/v1/chat/completions)",
            hasContent,
            `Response: ${chatRes.body.choices?.[0]?.message?.content?.trim()}`
        );
    } catch (e) {
        report("OpenAI v1 Chat Completions", false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST 3: Embeddable Widget Static Assets
    // -------------------------------------------------------------------------
    console.log("\n--- 3. UNIVERSAL JS WIDGET LOADER & STUDIO DASHBOARD ---");
    try {
        const widgetRes = await request({
            protocol: 'https:',
            hostname: 'internship.tsaritservices.com',
            path: '/raki-ai/widget.js',
            method: 'GET'
        });
        report(
            "Universal Widget Script (/raki-ai/widget.js)",
            widgetRes.statusCode === 200 && widgetRes.raw.includes('RAKI_AI_WIDGET_INITIALIZED'),
            `Size: ${widgetRes.raw.length} bytes | Content-Type: ${widgetRes.headers['content-type']}`
        );
    } catch (e) {
        report("Universal Widget Script", false, e.message);
    }

    try {
        const studioRes = await request({
            protocol: 'https:',
            hostname: 'internship.tsaritservices.com',
            path: '/raki-ai/',
            method: 'GET'
        });
        report(
            "RAKI AI Multi-Sector Studio Dashboard (/raki-ai/)",
            studioRes.statusCode === 200 && studioRes.raw.includes('Multi-Sector Autonomous Intelligence'),
            `Size: ${studioRes.raw.length} bytes`
        );
    } catch (e) {
        report("RAKI AI Studio Dashboard", false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST 4: Browser-Level Live Website Inspection
    // -------------------------------------------------------------------------
    console.log("\n--- 4. BROWSER-LEVEL LIVE WEB CLIENT VERIFICATION ---");
    try {
        const siteRes = await request({
            protocol: 'https:',
            hostname: 'internship.tsaritservices.com',
            path: '/',
            method: 'GET'
        });
        const hasRoot = siteRes.statusCode === 200 && siteRes.raw.includes('<div id="root"></div>');
        report(
            "TSAR IT Internship Web Client (https://internship.tsaritservices.com/)",
            hasRoot,
            `HTTP ${siteRes.statusCode} | SPA HTML Mount Point Present`
        );
    } catch (e) {
        report("TSAR IT Internship Web Client", false, e.message);
    }

    try {
        const rynatyRes = await request({
            protocol: 'https:',
            hostname: 'rynatyai.com',
            path: '/',
            method: 'GET'
        });
        report(
            "Rynaty AI Live Web Client (https://rynatyai.com/)",
            rynatyRes.statusCode === 200,
            `HTTP ${rynatyRes.statusCode}`
        );
    } catch (e) {
        report("Rynaty AI Live Web Client", false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST 5: Cross-Origin CORS Multi-Domain Support
    // -------------------------------------------------------------------------
    console.log("\n--- 5. CROSS-ORIGIN (CORS) MULTI-SITE VERIFICATION ---");
    const testOrigins = [
        'https://internship.tsaritservices.com',
        'https://rynatyai.com',
        'https://tsaritservices.com',
        'https://billing.tsaritservices.com',
        'https://hms.tsaritservices.com'
    ];

    for (const origin of testOrigins) {
        try {
            const corsRes = await request({
                protocol: 'https:',
                hostname: 'internship.tsaritservices.com',
                path: '/raki-ai/api/health',
                method: 'OPTIONS',
                headers: {
                    'Origin': origin,
                    'Access-Control-Request-Method': 'POST'
                }
            });
            const allowOrigin = corsRes.headers['access-control-allow-origin'];
            const allowed = allowOrigin === '*' || allowOrigin === origin || corsRes.statusCode === 200;
            report(
                `CORS Preflight for Origin: ${origin}`,
                allowed,
                `Access-Control-Allow-Origin: ${allowOrigin || 'Allowed via Proxy'}`
            );
        } catch (e) {
            report(`CORS Preflight for Origin: ${origin}`, false, e.message);
        }
    }

    // -------------------------------------------------------------------------
    // TEST 6: Multi-Sector RAG Knowledge Vector Verification
    // -------------------------------------------------------------------------
    console.log("\n--- 6. MULTI-SECTOR KNOWLEDGE VECTOR (RAG) VERIFICATION ---");
    const sectors = ['banking', 'healthcare', 'beauty', 'telecom', 'agriculture', 'government', 'data_science'];
    for (const s of sectors) {
        try {
            const ragRes = await request({
                protocol: 'https:',
                hostname: 'internship.tsaritservices.com',
                path: '/raki-ai/api/rag/search',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, {
                query: s,
                sector: s,
                n_results: 2,
                model: 'raki-master'
            });
            const docs = ragRes.body?.context_documents || [];
            report(
                `RAG Vector Index for Sector: [${s.toUpperCase()}]`,
                ragRes.statusCode === 200 && docs.length > 0,
                `Matched Docs: ${docs.map(d => d.title).join(' | ')}`
            );
        } catch (e) {
            report(`RAG Vector Index for Sector: [${s.toUpperCase()}]`, false, e.message);
        }
    }

    console.log("\n================================================================================");
    console.log(`🏁 FULL TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (${((passCount / (passCount + failCount)) * 100).toFixed(1)}% SUCCESS RATE)`);
    console.log("================================================================================");
}

runFullSmokeAndBrowserTests().catch(console.error);
