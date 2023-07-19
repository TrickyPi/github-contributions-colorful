import { createRoot } from "react-dom/client";
import App from "./App";

const domRoot = document.querySelector("#app")!;
const root = createRoot(domRoot);

root.render(<App />);
