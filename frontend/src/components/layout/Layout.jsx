import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",

        minHeight: "100vh",

        background: "#020617",

        color: "#e2e8f0",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,

          padding: "30px",
        }}
      >
        <Topbar />

        {children}
      </div>
    </div>
  );
}
