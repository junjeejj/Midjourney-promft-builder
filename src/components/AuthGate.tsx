import OAuthButtons from "./OAuthButtons";

export default function AuthGate(){

  return (

    <main className="min-h-[60vh] grid place-items-center p-6">

      <div className="w-full max-w-sm border rounded-2xl bg-white p-6 shadow">

        <div className="text-xl font-semibold mb-4">Sign in</div>

        <OAuthButtons />

      </div>

    </main>

  );

}
