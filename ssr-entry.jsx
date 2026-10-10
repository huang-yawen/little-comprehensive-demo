import { renderToString } from "react-dom/server";
import QuestionManage from "./src/component/QuestionManage.jsx";
import Dialog from "./src/component/Dialog.jsx";

console.log("===== 1) render QuestionManage (dialog closed) =====");
try {
  const html = renderToString(<QuestionManage />);
  console.log("[OK] QuestionManage html length =", html.length);
} catch (e) {
  console.error("[THREW] QuestionManage:", e);
}

console.log("===== 2) render Dialog with open=true =====");
try {
  const html2 = renderToString(<Dialog open onSubmit={() => {}} onClose={() => {}} />);
  console.log("[OK] Dialog html length =", html2.length);
} catch (e) {
  console.error("[THREW] Dialog:", e);
}
