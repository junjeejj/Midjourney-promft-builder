// src/pages/Success.tsx

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";



export default function Success() {

  const navigate = useNavigate();



  // 3초 후 자동으로 메인 화면(/builder)으로 이동

  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/builder"); // 메인 화면 경로: 필요하면 "/pricing" 이나 "/" 로 바꿔도 됨

    }, 3000);



    return () => clearTimeout(timer);

  }, [navigate]);



  return (

    <div className="min-h-screen flex flex-col items-center justify-center px-4">

      <h1 className="text-2xl font-bold mb-4">결제가 완료되었습니다.</h1>

      <p className="mb-6 text-gray-600">

        3초 후 메인 화면으로 이동합니다.

        <br />

        바로 이동하려면 아래 버튼을 눌러주세요.

      </p>

      <button

        onClick={() => navigate("/builder")} // 여기 경로도 위랑 같이 맞춰 주세요

        className="px-4 py-2 rounded bg-black text-white"

      >

        메인 화면으로 가기

      </button>

    </div>

  );

}
