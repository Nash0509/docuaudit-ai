import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Documents from "./pages/Documents";

import Reports from "./pages/Reports";

import Report from "./pages/Report";

import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/documents" element={<Documents />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/report/:id" element={<Report/>}/>

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
