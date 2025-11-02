import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import BannerTop from "./components/BannerTop";
import BannerBottom from "./components/BannerBottom";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";
import SeedLab from "./pages/SeedLab";
import Favorites from "./pages/Favorites";
import Defaults from "./pages/Defaults";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuth } from "./store/useAuth";
import CreditBadge from "./components/CreditBadge";
import BuyCreditsModal from "./components/BuyCreditsModal";
import { useState } from "react";

function Nav(){
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showBuyModal, setShowBuyModal] = useState(false);
  
  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`px-3 py-1.5 rounded-lg border transition ${
          isActive ? 'bg-gray-200 border-gray-300 font-medium' : 'border-gray-200 hover:bg-gray-50'
        }`}
      >
        {children}
      </Link>
    );
  };
  
  return (
    <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 text-sm mt-16">
      <NavLink to="/"><span className="font-semibold">MJ Prompt Builder</span></NavLink>
      <NavLink to="/builder">빌더</NavLink>
      <NavLink to="/templates">템플릿</NavLink>
      <NavLink to="/seedlab">시드</NavLink>
      <NavLink to="/favorites">즐겨찾기</NavLink>
      <NavLink to="/defaults">내설정</NavLink>
      <NavLink to="/billing">결제</NavLink>
      <NavLink to="/settings">설정</NavLink>
      <NavLink to="/profile">내정보</NavLink>
      <div className="ml-auto flex items-center gap-2">
        <CreditBadge />
        <button onClick={() => setShowBuyModal(true)} className="px-2 py-1 border rounded-lg text-xs">
          충전
        </button>
        {user ? <button onClick={logout} className="border rounded-lg px-2 py-1 hover:bg-gray-50">로그아웃</button> : <NavLink to="/login">로그인</NavLink>}
      </div>
      {showBuyModal && <BuyCreditsModal onClose={() => setShowBuyModal(false)} />}
    </nav>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <BannerTop />
      <Nav />
      <div className="min-h-[60vh] pb-16">
        <Routes>
          <Route path="/" element={<Builder />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/seedlab" element={<SeedLab />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/defaults" element={<Defaults />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Profile />} />
        </Routes>
      </div>
      <BannerBottom />
    </BrowserRouter>
  );
}

