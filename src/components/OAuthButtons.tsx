// src/components/OAuthButtons.tsx

import { OAUTH_PROVIDERS, useAuth } from "../store/useAuth";

export default function OAuthButtons(){

  const { loginWithOAuth, loginDemo, oauth } = useAuth();

  // providers 소스는 우선순위: export 상수 → store의 oauth → 기본값

  const providers = OAUTH_PROVIDERS ?? oauth?.providers ?? ["google", "github"];

  return (

    <div className="grid gap-2">

      {providers.map((p: string) => (

        <button

          key={p}

          onClick={() => loginWithOAuth?.(p)}

          className="w-full px-3 py-2 border rounded-xl hover:bg-gray-50"

        >

          Continue with {p.toUpperCase()}

        </button>

      ))}

      <button onClick={() => loginDemo?.()} className="w-full px-3 py-2 border rounded-xl">

        Demo login

      </button>

    </div>

  );

}