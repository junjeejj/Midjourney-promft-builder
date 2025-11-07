import { Link } from "react-router-dom";



export default function SafeHome() {

  return (

    <div className="mx-auto max-w-2xl p-6">

      <h1 className="text-2xl font-bold mb-2">MJ Prompt Builder</h1>

      <p className="opacity-70 mb-4">홈 렌더 확인용. 아래 버튼으로 빌더로 이동해 보세요.</p>

      <Link to="/builder" className="px-4 py-2 rounded bg-black text-white">빌더 열기</Link>

    </div>

  );

}



