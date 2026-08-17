"use client";
import { useEffect, useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SiteFrame from "@/components/layout/SiteFrame";
import BrandLogo from "@/components/layout/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { Eye, EyeOff, Lock, User, Mail, Phone, ArrowRight } from "lucide-react";

function sanitizeNextUrl(next: string | null): string {
  if (!next) return "/account";
  if (next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")) {
    return next;
  }
  return "/account";
}

function AccountAuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");
  const urlMode = searchParams.get("mode");
  const initialMode = urlToken || urlMode === "reset" ? "reset" : urlMode === "forgot" ? "forgot" : urlMode === "signup" ? "signup" : "signin";
  const rawNext = searchParams.get("next");
  const nextTarget = sanitizeNextUrl(rawNext);

  const { login } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");

  const [resetToken, setResetToken] = useState(urlToken || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const u = await login(loginEmail.trim(), loginPassword);
      if (u.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(nextTarget);
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    if (registerPassword.length < 10) {
      setError("Password must be at least 10 characters long.");
      setBusy(false);
      return;
    }

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: registerName.trim(),
          email: registerEmail.trim(),
          phone: registerPhone.trim() || undefined,
          password: registerPassword,
        }),
      });

      // Auto login after successful signup
      const u = await login(registerEmail.trim(), registerPassword);
      setSuccess("Account created successfully!");
      if (u.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(nextTarget);
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please verify your details.");
    } finally {
      setBusy(false);
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const res = await api<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      setSuccess(res.message || "If an account exists for that email, a reset link has been sent.");
    } catch (err: any) {
      setError(err?.message || "Failed to process request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    if (!resetToken.trim()) {
      setError("Reset token is missing. Please request a new password reset link.");
      setBusy(false);
      return;
    }

    if (newPassword.length < 10) {
      setError("Password must be at least 10 characters long.");
      setBusy(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      setBusy(false);
      return;
    }

    try {
      const res = await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: resetToken.trim(), password: newPassword }),
      });
      setSuccess(res.message || "Password successfully reset! Please sign in with your new password.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setMode("signin");
      }, 2500);
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-container">
      {(mode === "signin" || mode === "signup") && (
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => {
              setMode("signin");
              setError("");
              setSuccess("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setError("");
              setSuccess("");
            }}
          >
            Sign Up
          </button>
        </div>
      )}

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      {mode === "signin" && (
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email address *</label>
            <div className="password-input-wrap">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="athlete@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Password *</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: 0,
                  color: "var(--lime)",
                  fontSize: 11,
                  fontFamily: "var(--font-space)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  padding: 0
                }}
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setSuccess("");
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary full"
            disabled={busy}
            style={{ marginTop: 18 }}
          >
            {busy ? "Signing in…" : "Sign In to Account"}
          </button>
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={handleRegister}>
          <div className="field">
            <label>Full name *</label>
            <input
              type="text"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              placeholder="Alex Turner"
              autoComplete="name"
              required
            />
          </div>

          <div className="field">
            <label>Email address *</label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="athlete@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label>Phone number (optional)</label>
            <input
              type="tel"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
              placeholder="+44 7700 900123"
              autoComplete="tel"
            />
          </div>

          <div className="field">
            <label>Password *</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Minimum 10 characters"
                autoComplete="new-password"
                minLength={10}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <small style={{ display: "block", fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
              Must contain at least 10 characters.
            </small>
          </div>

          <button
            type="submit"
            className="btn primary full"
            disabled={busy}
            style={{ marginTop: 18 }}
          >
            {busy ? "Creating account…" : "Create Customer Account"}
          </button>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={handleForgot}>
          <div style={{ marginBottom: 18, textAlign: "left" }}>
            <span className="eyebrow">Password Assistance</span>
            <h3 className="display" style={{ fontSize: 26, margin: "6px 0 8px" }}>
              Reset Your Password
            </h3>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              Enter your email address and we will send you a secure link to reset your account password.
            </p>
          </div>

          <div className="field">
            <label>Email address *</label>
            <div className="password-input-wrap">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="athlete@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn primary full"
            disabled={busy}
            style={{ marginTop: 18 }}
          >
            {busy ? "Sending link…" : "Send Reset Link"}
          </button>

          <button
            type="button"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--muted)",
              fontSize: 12,
              cursor: "pointer",
              marginTop: 14,
              width: "100%",
              textAlign: "center",
              display: "block"
            }}
            onClick={() => {
              setMode("signin");
              setError("");
              setSuccess("");
            }}
          >
            ← Back to Sign In
          </button>
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={handleReset}>
          <div style={{ marginBottom: 18, textAlign: "left" }}>
            <span className="eyebrow">Security Update</span>
            <h3 className="display" style={{ fontSize: 26, margin: "6px 0 8px" }}>
              Set New Password
            </h3>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              Create a new secure password for your XLIME account (minimum 10 characters).
            </p>
          </div>

          {!urlToken && (
            <div className="field">
              <label>Reset Token *</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Enter 64-character token from email"
                required
              />
            </div>
          )}

          <div className="field">
            <label>New Password *</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 10 characters"
                autoComplete="new-password"
                minLength={10}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="field">
            <label>Confirm New Password *</label>
            <div className="password-input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
                minLength={10}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary full"
            disabled={busy}
            style={{ marginTop: 18 }}
          >
            {busy ? "Updating password…" : "Set New Password"}
          </button>

          <button
            type="button"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--muted)",
              fontSize: 12,
              cursor: "pointer",
              marginTop: 14,
              width: "100%",
              textAlign: "center",
              display: "block"
            }}
            onClick={() => {
              setMode("signin");
              setError("");
              setSuccess("");
            }}
          >
            ← Back to Sign In
          </button>
        </form>
      )}
    </div>
  );
}

export default function Account() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      api<{ orders: Order[] }>("/orders/mine")
        .then((r) => setOrders(r.orders))
        .catch(() => setOrders([]));
    }
  }, [user]);

  if (loading) {
    return (
      <SiteFrame>
        <div className="section wrap" style={{ textAlign: "center", padding: "80px 20px" }}>
          Loading account…
        </div>
      </SiteFrame>
    );
  }

  if (!user) {
    return (
      <SiteFrame>
        <div className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">Home › Account</div>
            <h1 className="page-title">XLIME Account</h1>
            <p className="muted" style={{ maxWidth: 620 }}>
              Access your order history, manage requests, and track your custom sportswear.
            </p>
          </div>
        </div>
        <section className="section">
          <div className="wrap">
            <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}>Loading…</div>}>
              <AccountAuthCard />
            </Suspense>
          </div>
        </section>
      </SiteFrame>
    );
  }

  const active = orders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
  const recent = orders[0];

  return (
    <SiteFrame>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">Home › Account</div>
          <h1 className="page-title">Customer account</h1>
        </div>
      </div>
      <section className="section">
        <div className="wrap dashboard">
          <aside className="side">
            <div className="logo logo-image">
              <BrandLogo className="brand-logo" width={140} height={90} />
            </div>
            <a className="active">Dashboard</a>
            <a>Orders</a>
            <a>Track orders</a>
            <Link href="/custom-kits">Saved kits</Link>
            <Link href="/team-orders">Quotes & approvals</Link>
            <a>Addresses</a>
            <a>Profile details</a>
            <button type="button" className="account-logout" onClick={logout}>
              Log out
            </button>
          </aside>
          <div className="dash-main">
            <div className="section-head">
              <div>
                <span className="eyebrow">Welcome back</span>
                <h2 className="h2" style={{ fontSize: 42 }}>
                  {user.name}
                </h2>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <span className="muted">Orders</span>
                <strong>{orders.length}</strong>
              </div>
              <div className="stat">
                <span className="muted">In progress</span>
                <strong>{active.length}</strong>
              </div>
              <div className="stat">
                <span className="muted">Saved kits</span>
                <strong>0</strong>
              </div>
              <div className="stat">
                <span className="muted">Quotes pending</span>
                <strong>0</strong>
              </div>
            </div>
            <div className="dash-grid">
              <div className="dash-card">
                <span className="eyebrow">Recent order</span>
                {recent ? (
                  <>
                    <h3 className="display" style={{ fontSize: 32 }}>
                      {recent.orderNumber}
                    </h3>
                    <p>
                      {recent.items.length} item{recent.items.length === 1 ? "" : "s"} •{" "}
                      {recent.status.replaceAll("_", " ")}
                    </p>
                    <div className="account-progress">
                      <div
                        style={{
                          width: recent.status === "COMPLETED" ? "100%" : "65%",
                        }}
                      />
                    </div>
                    <div className="summary-line">
                      <span>Submitted</span>
                      <b>{new Date(recent.createdAt).toLocaleDateString("en-GB")}</b>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="display" style={{ fontSize: 32 }}>
                      No orders yet
                    </h3>
                    <p className="muted">
                      Start with sports, activewear, custom kits or team orders.
                    </p>
                  </>
                )}
                <Link className="btn primary" href={recent ? "/shop" : "/shop"}>
                  {recent ? "Continue shopping" : "Explore XLIME"}
                </Link>
              </div>
              <div className="dash-card">
                <span className="eyebrow">Next actions</span>
                <p>
                  <Link href="/custom-kits">Create a custom kit →</Link>
                </p>
                <p>
                  <Link href="/team-orders">Request a team quote →</Link>
                </p>
                <p>
                  <Link href="/shop">Review latest products →</Link>
                </p>
              </div>
            </div>
            <div className="dash-card" style={{ marginTop: 14 }}>
              <h3 className="display" style={{ fontSize: 28 }}>
                Order history
              </h3>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length ? (
                      orders.map((o) => (
                        <tr key={o.id}>
                          <td>{o.orderNumber}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                          <td>
                            <span className="status">{o.status.replaceAll("_", " ")}</span>
                          </td>
                          <td>{o.items.length}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>No submitted orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
