import React from "react";
import { useFavorites } from "../store/useFavorites";
import { useEffect } from "react";

export default function Favorites() {
  const { favorites, load } = useFavorites();
  
  useEffect(() => {
    load();
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>
      
      <div className="grid gap-4">
        {favorites.map((fav) => (
          <div key={fav} className="border rounded-lg p-4">
            {fav}
          </div>
        ))}
        {favorites.length === 0 && <div className="text-gray-500 text-center py-8">No favorites yet.</div>}
      </div>
    </div>
  );
}






