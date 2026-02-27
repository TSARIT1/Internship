const fs = require('fs');

try {
    const data = fs.readFileSync('D:/Desktop/NewWebsite/New Web/Backend/gemini_models.json', 'utf8');
    const json = JSON.parse(data);
    if (json.models) {
        console.log('Available Models:');
        json.models.forEach(m => console.log(m.name));
    } else {
        console.log('No models found in JSON.');
    }
} catch (err) {
    // If utf8 fails, try utf16le? Or maybe log the error
    console.error('Error reading file:', err.message);
    // fallback: try simple regex on raw string if JSON parse fails due to encoding
}
