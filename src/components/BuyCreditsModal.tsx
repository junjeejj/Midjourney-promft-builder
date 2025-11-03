import { useState } from "react";

import { useWalletStore } from "../store/useWalletStore";

export default function BuyCreditsModal(){

  const { addCredits } = useWalletStore();

  const [open, setOpen] = useState(false);

  const [qty, setQty] = useState(100);

  function buy(){ addCredits(qty); setOpen(false); }

  return (

    <>

      <button onClick={()=>setOpen(true)} className="px-2 py-1 border rounded-lg text-sm">Buy Credits</button>

      {open && (

        <div className="fixed inset-0 bg-black/30 grid place-items-center">

          <div className="bg-white rounded-2xl p-4 w-full max-w-sm shadow">

            <div className="font-semibold mb-2">Buy Credits (demo)</div>

            <label className="block text-sm mb-2">

              Amount

              <input type="number" className="w-full border rounded-lg px-3 py-2 mt-1" value={qty} onChange={e=>setQty(Number(e.target.value||0))}/>

            </label>

            <div className="flex justify-end gap-2">

              <button onClick={()=>setOpen(false)} className="px-3 py-2 border rounded-lg">Cancel</button>

              <button onClick={buy} className="px-3 py-2 border rounded-lg bg-black text-white">Purchase</button>

            </div>

            <p className="text-xs text-gray-500 mt-2">※ Real Stripe/PortOne checkout will be wired on deployment.</p>

          </div>

        </div>

      )}

    </>

  );

}