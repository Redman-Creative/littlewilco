"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export default function SubscribeForm({ id = "subscribe" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMessage(data.message || "You're on the list. Look for the lineup on Thursday.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "That didn't go through. Try again in a minute?");
      }
    } catch {
      setStatus("error");
      setMessage("That didn't go through. Try again in a minute?");
    }
  }

  return (
    <form className="subscribe" onSubmit={onSubmit} id={id}>
      <label className="sr-only" htmlFor={`${id}-email`}>
        Email address
      </label>
      <input
        id={`${id}-email`}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
      />
      <button className="btn btn--primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Adding you…" : "Send me the lineup"}
      </button>
      {message && (
        <p
          className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}
          role="status"
          style={{ flexBasis: "100%" }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
