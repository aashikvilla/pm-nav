const { execSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const keyMatch = envFile.match(/OPENROUTER_API_KEY="(.*)"/);
if (!keyMatch) {
  console.log("No key found");
  process.exit(1);
}
const key = keyMatch[1];

const data = JSON.stringify({
  model: "google/gemini-2.0-flash-lite-preview-02-05:free",
  max_tokens: 10,
  messages: [{ role: "user", content: "Hi" }]
});

fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json'
  },
  body: data
}).then(r => r.json()).then(d => {
  if (d.error) console.error("API Error:", d.error);
  else console.log("API Success:", d.choices[0].message.content);
}).catch(console.error);
