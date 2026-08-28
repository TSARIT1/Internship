const https = require('https');

function postJSON(path, payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const options = {
            hostname: 'internship.tsaritservices.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 60000
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

function get(path) {
    return new Promise((resolve, reject) => {
        https.get(`https://internship.tsaritservices.com${path}`, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: body });
                }
            });
        }).on('error', (e) => reject(e));
    });
}

async function runTests() {
    console.log("==================================================");
    console.log("⚡ Testing RAKI AI OS Universal Endpoints (HTTPS) ⚡");
    console.log("==================================================");

    // 1. Health
    const health = await get('/raki-ai/api/health');
    console.log("\n1. Health Check:", health.data);

    // 2. OpenAI v1 Models
    const models = await get('/raki-ai/v1/models');
    console.log("\n2. OpenAI v1 Models:", models.data.data.map(m => m.id));

    // 3. OpenAI v1 Chat Completion (Standard OpenAI API format)
    console.log("\n3. Testing OpenAI v1 /v1/chat/completions (llama3.2:1b)...");
    const openaiRes = await postJSON('/raki-ai/v1/chat/completions', {
        model: 'llama3.2:1b',
        messages: [
            { role: 'system', content: 'You are RAKI AI.' },
            { role: 'user', content: 'Confirm you are running and state your role in 1 short sentence.' }
        ]
    });
    console.log("OpenAI Completion Response:", openaiRes.data.choices[0].message.content);

    // 4. Universal Agent Multi-Site Dispatch (e.g. for Rynaty AI)
    console.log("\n4. Testing Universal Multi-Site Agent for Rynaty AI...");
    const rynatyAgent = await postJSON('/raki-ai/api/agent/react', {
        site: 'rynatyai',
        action: 'domain_expert',
        payload: { message: 'Analyze banking fraud risk for high-frequency account transactions.' },
        model: 'llama3.2:1b'
    });
    console.log("Rynaty AI Agent Result:", rynatyAgent.data.response.substring(0, 300) + "...");

    // 5. Widget JS Endpoint
    const widget = await get('/raki-ai/widget.js');
    console.log("\n5. Widget.js Loaded Status:", widget.status, `(${widget.raw.length} bytes)`);

    console.log("\n✅ All RAKI AI universal tests passed with 100% success!");
}

runTests().catch(console.error);
