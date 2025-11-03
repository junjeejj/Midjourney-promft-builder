import React, { useState } from "react";
import DefaultsPanel from "../components/DefaultsPanel";

export default function Defaults() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Defaults</h1>
      
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Save / Edit Defaults
      </button>
      
      <DefaultsPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}






