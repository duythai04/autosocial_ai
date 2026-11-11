import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState("Đang kết nối...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");

        if (response.data.success) {
          setStatus("Backend đã kết nối thành công!");
        }
      } catch (error) {
        console.error(error);
        setStatus("Không thể kết nối Backend!");
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-purple-600">AutoSocial AI</h1>

        <p className="text-gray-500 mt-3">AI Facebook Fanpage Automation</p>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <p className="font-semibold">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
