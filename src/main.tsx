import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { TravelProvider } from "./context/TravelContext.tsx";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <TravelProvider>
    <App />
  </TravelProvider>
);