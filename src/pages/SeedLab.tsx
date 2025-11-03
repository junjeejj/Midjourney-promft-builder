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
      <h1 className="text-2xl font-bold mb-6">시드 랩</h1>
      
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="시드 검색..."
        className="w-full border rounded-lg px-4 py-3 mb-6"
      />
      
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
              onClick={() => updateParams({ seed: s.seed })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              적용
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}





