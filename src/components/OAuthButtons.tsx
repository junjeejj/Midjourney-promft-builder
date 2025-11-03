// src/components/OAuthButtons.tsx
import useAuth, { OAUTH_PROVIDERS } from "../store/useAuth";

export default function OAuthButtons() {
  const { loginWithOAuth, loginDemo, oauth } = useAuth();
  const providers = OAUTH_PROVIDERS ?? oauth?.providers ?? ["google"];
  return (
    <div className="flex gap-2">
      {providers.map((p) => (
        <button key={p} onClick={() => loginWithOAuth?.(p)} className="px-3 py-2 rounded border">
          Continue with {p}
        </button>
      ))}
      <button onClick={() => loginDemo?.()} className="px-3 py-2 rounded border">Try Demo</button>
    </div>
  );
}