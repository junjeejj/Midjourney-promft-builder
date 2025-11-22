// src/components/OAuthButtons.tsx
import useAuth from "../store/useAuth";
import { OAUTH_PROVIDERS, DEMO_USER_ENABLED } from "../config/constants";

export default function OAuthButtons() {
  const { loginWithOAuth, loginDemo, oauth } = useAuth();
  const providers = oauth?.providers ?? OAUTH_PROVIDERS;
  return (
    <div className="flex gap-2">
      {providers.map((p) => (
        <button key={p} onClick={() => loginWithOAuth?.(p)} className="px-3 py-2 rounded border">
          Continue with {p}
        </button>
      ))}
      {DEMO_USER_ENABLED && (
        <button onClick={() => loginDemo?.()} className="px-3 py-2 rounded border">Try Demo</button>
      )}
    </div>
  );
}