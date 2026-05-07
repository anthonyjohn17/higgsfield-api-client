import { HiggsFieldClient } from "../index";

const clerkSessionId = process.env.CLERK_SESSION_ID;
const clerkClientToken = process.env.CLERK_CLIENT_TOKEN;

if (!clerkSessionId || !clerkClientToken) {
  console.error("Set CLERK_SESSION_ID and CLERK_CLIENT_TOKEN env vars");
  process.exit(1);
}

const client = new HiggsFieldClient({
  clerk: { sessionId: clerkSessionId, clientToken: clerkClientToken },
});

const user = (await client.user.getMe()) as { email?: string; plan_type?: string };
console.log("User:", user.email, "-", user.plan_type);

const prompt = process.argv[2] ?? "a cute cat wearing a tiny hat, digital art";
const jobType = process.argv[3] ?? "nano_banana_2";

console.log(`\nGenerating with "${jobType}": ${prompt}`);
console.log(`POST /jobs/${jobType.replace(/_/g, "-")}`);
console.log('Body: { prompt, count: 1, aspect_ratio: "3:4", image_size: "1k" }');

console.log("\nNote: The POST /jobs/* endpoint is protected by DataDome bot detection.");
console.log("Read endpoints (GET) all work fine from CLI.");
console.log("To call generation from CLI, you need to proxy through a browser or use a headless browser.");
console.log("\nThe generation flow discovered:");
console.log("  1. POST /jobs/{job-set-type}        - Create job (protected by DataDome)");
console.log("  2. GET  /jobs/{jobId}/status         - Poll for completion");
console.log("  3. GET  /jobs/{jobId}                - Get completed result with asset URLs");
console.log("  4. GET  /jobs/accessible?job_set_type - List all jobs by type");
