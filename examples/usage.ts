import { HiggsFieldClient } from "../index";

const clerkSessionId = process.env.CLERK_SESSION_ID;
const clerkClientToken = process.env.CLERK_CLIENT_TOKEN;
const staticToken = process.env.HIGGSFIELD_TOKEN;

if (!clerkSessionId && !staticToken) {
  console.error("Set CLERK_SESSION_ID + CLERK_CLIENT_TOKEN (auto-refresh) or HIGGSFIELD_TOKEN (static)");
  process.exit(1);
}

const client =
  clerkSessionId && clerkClientToken
    ? new HiggsFieldClient({
        clerk: { sessionId: clerkSessionId, clientToken: clerkClientToken },
      })
    : new HiggsFieldClient({ token: staticToken as string });

const user = await client.user.getMe();
console.log("Current user:", JSON.stringify(user, null, 2));

const plans = await client.subscription.getPlans();
console.log("Subscription plans:", JSON.stringify(plans, null, 2));

const workspaces = await client.workspace.list();
console.log("Workspaces:", JSON.stringify(workspaces, null, 2));

const assets = await client.asset.list(5, "image");
console.log("Recent image assets:", JSON.stringify(assets, null, 2));

const tours = await client.misc.getTours();
console.log("Tours:", JSON.stringify(tours, null, 2));
