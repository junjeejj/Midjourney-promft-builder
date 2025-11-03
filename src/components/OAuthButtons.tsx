import { OAUTH_PROVIDERS, useAuth } from "../store/useAuth";

export default function OAuthButtons(){

  const { oauth, loginDemo } = useAuth();

  return (

    <div className="grid gap-2">

      {OAUTH_PROVIDERS.map(p=>(

        <button key={p} onClick={()=>oauth(p)} className="w-full px-3 py-2 border rounded-xl hover:bg-gray-50">

          Continue with {p.toUpperCase()}

        </button>

      ))}

      <button onClick={loginDemo} className="w-full px-3 py-2 border rounded-xl">Demo login</button>

    </div>

  );

}
