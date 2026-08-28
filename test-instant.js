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

async function run() {
    console.log("Testing Banking Analysis on raki-master...");
    const res = await test('banking', 'What are the three core ISO 20022 message schemas used in banking payments?');
    console.log(`Status: ${res.status} | Latency: ${res.duration}s`);
    console.log(`Ingested RAG Docs: ${res.data?.context_documents?.length}`);
    console.log(`Response:\n${res.data?.analysis}`);
}

run().catch(console.error);
