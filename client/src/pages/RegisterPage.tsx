import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Đăng ký thành công! Hãy đăng nhập.",
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Đăng ký thất bại");
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Tạo tài khoản</h1>

          <p className="mt-2 text-slate-400">Bắt đầu với AutoSocial AI</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
              Họ và tên
            </label>

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm text-slate-300"
            >
              Email
            </label>

            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm text-slate-300"
            >
              Mật khẩu
            </label>

            <input
              id="register-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm text-slate-300"
            >
              Xác nhận mật khẩu
            </label>

            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Đang đăng ký..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
