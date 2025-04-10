import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "Ugandan Legal Assistant";

// Add Inter and Merriweather fonts
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap";
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
