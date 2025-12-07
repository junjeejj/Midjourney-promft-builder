// src/components/SideBar.tsx
import { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import { SIDE_BAR_CATEGORIES, type Category } from "../config/SIDE_BAR";

export default function SideBar() {
  const { slots, setSlots } = useBuilderStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const currentCategory = selectedCategory
    ? SIDE_BAR_CATEGORIES.find((c) => c.id === selectedCategory)
    : null;

  return (
    <div className="flex h-[calc(100vh-200px)] border-r bg-gray-50">
      {/* 왼쪽: 카테고리 목록 */}
      <div className="w-64 border-r bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 z-10">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-2">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition ${
                selectedCategory === category.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 오른쪽: 선택된 카테고리의 토큰 목록 */}
      {currentCategory && (
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="sticky top-0 bg-white border-b p-4 z-10">
            <h3 className="font-semibold text-lg">{currentCategory.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {currentCategory.tokens.length}개의 토큰
            </p>
          </div>
          <div className="p-4 space-y-2">
            {currentCategory.tokens.map((tokenItem, index) => {
              const isSelected =
                slots.subject
                  ?.split(",")
                  .map((t) => t.trim())
                  .includes(tokenItem.token) || false;

              return (
                <button
                  key={index}
                  onClick={() => handleTokenClick(tokenItem.token)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="font-medium text-sm">{tokenItem.token}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tokenItem.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 카테고리 미선택 시 안내 */}
      {!currentCategory && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">카테고리를 선택하세요</p>
            <p className="text-sm">왼쪽에서 원하는 카테고리를 클릭하세요</p>
          </div>
        </div>
      )}
    </div>
  );
}

