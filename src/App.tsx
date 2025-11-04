export default function App() {

  return (

    <div style={{

      padding: 24,

      font: "16px/1.6 system-ui, -apple-system, Segoe UI, Roboto, sans-serif"

    }}>

      <div style={{

        height: "40vh",

        background: "linear-gradient(135deg, #ffd54f, #ff7043)",

        borderRadius: 16,

        display: "grid",

        placeItems: "center",

        color: "#111",

        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"

      }}>

        <h1 style={{ margin: 0 }}>화면 출력 OK</h1>

      </div>



      <p style={{ marginTop: 16 }}>

        이 박스가 보이면 "스타일 때문에 안 보이던" 문제가 해결된 거예요.

        다음 단계로 라우터/배너를 다시 붙이면 됩니다.

      </p>

    </div>

  );

}
