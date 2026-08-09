const { execSync } = require("child_process");

const commands = [
    ["Node API syntax", "node --check server/server.js && node --check server/app.js"],
    ["Auth controller syntax", "node --check server/controllers/authController.js"],
    ["Intelligence controller syntax", "node --check server/controllers/intelligenceController.js"],
];

let failed = false;
for (const [name, command] of commands) {
    try {
        execSync(command, { stdio: "inherit" });
        console.log(`PASS: ${name}`);
    } catch {
        failed = true;
        console.error(`FAIL: ${name}`);
    }
}

process.exit(failed ? 1 : 0);
