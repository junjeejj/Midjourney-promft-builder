import React, { useEffect, useState } from "react";
import { useTemplateStore } from "../store/useTemplateStore";

export default function Templates() {
  const { templates, load, save, delete: del, toggleFavorite, exportJSON, importJSON } = useTemplateStore();
  const [name, setName] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  
  useEffect(() => {
    load();
  }, []);
  
  const handleSave = () => {
    if (!name) return;
    save({
      name,
      slots: {},
      params: {},
    });
    setName("");
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">템플릿 관리</h1>
      
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="템플릿 이름"
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          저장
        </button>
        <button onClick={() => setShowImport(true)} className="px-4 py-2 border rounded-lg">
          가져오기
        </button>
        <button onClick={() => navigator.clipboard.writeText(exportJSON())} className="px-4 py-2 border rounded-lg">
          내보내기
        </button>
      </div>
      
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-64 border rounded-lg p-3 font-mono text-sm"
              placeholder="JSON 템플릿 붙여넣기"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  if (importJSON(importText)) {
                    setShowImport(false);
                    setImportText("");
                  } else {
                    alert("잘못된 JSON 형식입니다.");
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                가져오기
              </button>
              <button onClick={() => setShowImport(false)} className="px-4 py-2 border rounded-lg">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleFavorite(t.id)} className="px-3 py-1 border rounded-lg">
                {t.isFavorite ? "★" : "☆"}
              </button>
              <button onClick={() => del(t.id)} className="px-3 py-1 border rounded-lg text-red-600">
                삭제
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && <div className="text-gray-500 text-center py-8">템플릿이 없습니다.</div>}
      </div>
    </div>
  );
}





