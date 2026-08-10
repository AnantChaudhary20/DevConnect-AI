const { execFileSync } = require("child_process");
const path = require("path");

// Resolve project files from the repository root.
// This works even when the script is executed from /server.
const root = path.resolve(__dirname, "..");

const checks = [
    [
        "Node API syntax",
        [
            path.join(root, "server", "server.js"),
            path.join(root, "server", "app.js")
        ]
    ],
    [
        "Auth controller syntax",
        [
            path.join(
                root,
                "server",
                "controllers",
                "authController.js"
            )
        ]
    ],
    [
        "Intelligence controller syntax",
        [
            path.join(
                root,
                "server",
                "controllers",
                "intelligenceController.js"
            )
        ]
    ]
];

let failed = false;

for (const [name, files] of checks) {
    try {
        for (const file of files) {
            execFileSync(
                process.execPath,
                ["--check", file],
                { stdio: "inherit" }
            );
        }

        console.log(`PASS: ${name}`);

    } catch {
        failed = true;
        console.error(`FAIL: ${name}`);
    }
}

process.exit(failed ? 1 : 0);
