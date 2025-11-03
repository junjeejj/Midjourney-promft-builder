import React, { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import type { SeedSuggestion } from "../types";

const MOCK_SEEDS: SeedSuggestion[] = [
  { seed: 123456, prompt: "a beautiful sunset", tags: ["nature", "sunset"] },
  { seed: 789012, prompt: "a cat sitting", tags: ["animal", "cat"] },
  { seed: 345678, prompt: "futuristic city", tags: ["city", "future"] },
];

export default function SeedLab() {
  const [search, setSearch] = useState("");
  const { updateParams } = useBuilderStore();
  const filtered = MOCK_SEEDS.filter((s) => s.prompt.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Similar seed search</h1>
      
      <div className="text-sm text-gray-600 mb-4">Desired seed style</div>
      
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full border rounded-lg px-4 py-3 mb-6"
      />
      
      <p className="text-xs text-gray-500 mb-4">Demo: using Picsum images. Real version will match Midjourney gallery/community datasets.</p>
      
      <div className="grid gap-4">
        {filtered.map((s) => (
          <div key={s.seed} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">Seed: {s.seed}</div>
              <div className="text-sm text-gray-600">{s.prompt}</div>
              <div className="flex gap-2 mt-2">
                {s.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                updateParams({ seed: s.seed });
                navigator.clipboard.writeText(String(s.seed));
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Copy seed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}






