import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node"

// Ensure to call this before requiring any other modules!
init({
  dsn: "https://9ce2ae41601822b0fdae80d2354c5cdf@o4506858583883776.ingest.us.sentry.io/4507843418324992",
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
})
