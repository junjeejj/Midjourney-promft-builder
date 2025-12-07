// src/components/SideBar.tsx
import { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import { SIDE_BAR_CATEGORIES } from "../config/SIDE_BAR";
import SelectedSummary from "./SelectedSummary";
import ParamPanel from "./ParamPanel";

export default function SideBar() {
  const { slots, setSlots } = useBuilderStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // 카테고리 펼치기/접기 토글
  function toggleCategory(categoryId: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  // 토큰 클릭 시 subject에 추가
  function handleTokenClick(token: string) {
    const currentSubject = slots.subject || "";
    // 이미 포함되어 있으면 제거, 없으면 추가
    const tokens = currentSubject
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    const tokenIndex = tokens.indexOf(token);
    if (tokenIndex >= 0) {
      // 제거
      tokens.splice(tokenIndex, 1);
    } else {
      // 추가
      tokens.push(token);
    }
    
    setSlots({ subject: tokens.join(", ") });
  }

  // 검색 필터링
  const filteredCategories = SIDE_BAR_CATEGORIES.map((category) => ({
    ...category,
    tokens: category.tokens.filter(
      (token) =>
        token.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.tokens.length > 0);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] border-r bg-white">
      {/* 상단: 검색바 */}
      <div className="border-b p-3 bg-white">
        <input
          type="text"
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 중간: 아코디언 카테고리 목록 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            
            return (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                {/* 카테고리 헤더 */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </button>
                
                {/* 토큰 목록 (펼쳐질 때만 표시) */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-2 space-y-1 max-h-96 overflow-y-auto">
                    {category.tokens.map((tokenItem, index) => {
                      const isSelected =
                        slots.subject
                          ?.split(",")
                          .map((t) => t.trim())
                          .includes(tokenItem.token) || false;

                      return (
                        <button
                          key={index}
                          onClick={() => handleTokenClick(tokenItem.token)}
                          className={`w-full text-left px-3 py-2 rounded border transition text-sm ${
                            isSelected
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <div className="font-medium">{tokenItem.token}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {tokenItem.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단: SelectedSummary + ParamPanel */}
      <div className="border-t bg-white overflow-y-auto" style={{ maxHeight: "40vh" }}>
        <div className="p-3 space-y-3">
          <SelectedSummary />
          <ParamPanel />
        </div>
      </div>
    </div>
  );
}

