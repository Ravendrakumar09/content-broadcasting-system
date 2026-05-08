"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/auth.service";
import { validateLoginForm } from "../../validations/auth.schema";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import ToastStack from "../ui/ToastStack";

export default function LoginForm({ nextRoute: incomingNextRoute = "" }) {
  const router = useRouter();
  const { login } = useAuthContext();
  const { toasts, pushToast, dismissToast } = useToast();

  const nextRoute = useMemo(() => {
    if (
      incomingNextRoute.startsWith("/teacher") ||
      incomingNextRoute.startsWith("/principal")
    ) {
      return incomingNextRoute;
    }

    return "";
  }, [incomingNextRoute]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      login(payload);
      pushToast("Login successful.", "success");

      if (nextRoute) {
        router.push(nextRoute);
        return;
      }

      if (payload.role === "principal") {
        router.push("/principal/dashboard");
      } else {
        router.push("/teacher/dashboard");
      }
    } catch (error) {
      pushToast(error.message || "Invalid login credentials.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Content Broadcasting System
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use your teacher/principal credentials to continue.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none"
              placeholder="name@school.com"
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none"
              placeholder="Enter password"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Credentials</p>
          <p className="mt-1">Teacher: teacher@test.com / 123456</p>
          <p>Principal: principal@test.com / 123456</p>
        </div>
      </div>
    </>
  );
}
