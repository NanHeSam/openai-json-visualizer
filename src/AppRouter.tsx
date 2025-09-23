import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { App } from "./App";
export function AppRouter() {
  return <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
          <Analytics />
      </BrowserRouter>;
}
