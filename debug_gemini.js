
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

async function test() {
    try {
        console.log("Reading .env...");
        const envContent = fs.readFileSync('.env', 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

        if (!match) {
            console.error("VITE_GEMINI_API_KEY not found in .env");
            return;
        }

        const apiKey = match[1].trim();
        console.log("API Key found:", apiKey.substring(0, 8) + "...");

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        console.log("\nStarting connectivity test...");

        for (const modelName of modelsToTry) {
            console.log(`\nTesting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you working?");
                const response = await result.response;
                console.log(`SUCCESS! Model ${modelName} responded:`, response.text().substring(0, 50) + "...");
                return; // Stop after first success
            } catch (error) {
                console.error(`FAILED ${modelName}:`, error.message.split('\n')[0]);
                if (error.message.includes("404")) {
                    console.log("  -> 404 indicates model not found or API version mismatch.");
                } else if (error.message.includes("403")) {
                    console.log("  -> 403 indicates permission denied (API key or project setting).");
                }
            }
        }

        console.log("\nAll models failed.");

    } catch (err) {
        console.error("Script error:", err);
    }
}

test();
