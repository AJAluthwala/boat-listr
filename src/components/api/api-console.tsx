"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type RequestConfig = {
  path: string;
  method: Method;
  body?: Record<string, unknown>;
  auth?: boolean;
};

type ApiResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOptionalNumber(value: string) {
  if (!value.trim()) return undefined;
  return toNumber(value);
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function prettify(data: unknown) {
  return JSON.stringify(data, null, 2);
}

export default function ApiConsole() {
  const pathname = usePathname();
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("1");
  const [listingId, setListingId] = useState("1");
  const [conversationId, setConversationId] = useState("1");
  const [notificationId, setNotificationId] = useState("1");

  const [registerName, setRegisterName] = useState("New User");
  const [registerEmail, setRegisterEmail] = useState("newuser@example.com");
  const [registerPassword, setRegisterPassword] = useState("StrongPass123!");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerContactNumber, setRegisterContactNumber] = useState("");

  const [loginEmail, setLoginEmail] = useState("newuser@example.com");
  const [loginPassword, setLoginPassword] = useState("StrongPass123!");

  const [refreshToken, setRefreshToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [forgotEmail, setForgotEmail] = useState("newuser@example.com");
  const [newPassword, setNewPassword] = useState("NewStrongPass123!");

  const [profileName, setProfileName] = useState("Updated User Name");
  const [profileAddress, setProfileAddress] = useState("Chennai, India");
  const [profileContactNumber, setProfileContactNumber] = useState("+910000000000");

  const [listingTitle, setListingTitle] = useState("Sea Breeze 320");
  const [listingCategory, setListingCategory] = useState("Sailboat");
  const [listingYear, setListingYear] = useState("2020");
  const [listingLengthFt, setListingLengthFt] = useState("35");
  const [listingShortDescription, setListingShortDescription] = useState("Clean and ready for the season");
  const [listingMainDescription, setListingMainDescription] = useState("Detailed description of features and maintenance history.");
  const [listingLocation, setListingLocation] = useState("Miami");
  const [listingValueUsd, setListingValueUsd] = useState("145000");
  const [listingEngine, setListingEngine] = useState("Yanmar Diesel");
  const [listingPower, setListingPower] = useState("45");
  const [listingBrand, setListingBrand] = useState("Beneteau");
  const [listingCapacity, setListingCapacity] = useState("8");

  const [messageBody, setMessageBody] = useState("Hi, is this listing still available?");
  const [notificationType, setNotificationType] = useState("INFO");
  const [notificationTitle, setNotificationTitle] = useState("API Test Notification");
  const [notificationBody, setNotificationBody] = useState("This notification was created from the API Console UI.");

  const [paymentAmount, setPaymentAmount] = useState("99");
  const [paymentDescription, setPaymentDescription] = useState("Featured listing payment");
  const [subscriptionId, setSubscriptionId] = useState("sub_test_001");
  const [subscriptionPriceId, setSubscriptionPriceId] = useState("price_test_001");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const hasToken = useMemo(() => token.trim().length > 0, [token]);

  async function run(config: RequestConfig) {
    setLoading(true);
    try {
      const url = `${baseUrl}${config.path}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (config.auth !== false && hasToken) {
        headers.Authorization = `Bearer ${token.trim()}`;
      }

      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      const text = await response.text();
      const data = text ? safeJsonParse(text) : {};

      if (typeof data === "object" && data && "token" in data && typeof (data as { token?: unknown }).token === "string") {
        setToken((data as { token: string }).token);
      }

      if (typeof data === "object" && data && "user" in data) {
        const maybeUser = (data as { user?: { id?: unknown } }).user;
        if (maybeUser && typeof maybeUser.id === "number") {
          setUserId(String(maybeUser.id));
        }
      }

      if (typeof data === "object" && data && "listing" in data) {
        const maybeListing = (data as { listing?: { id?: unknown } }).listing;
        if (maybeListing && typeof maybeListing.id === "number") {
          setListingId(String(maybeListing.id));
        }
      }

      if (typeof data === "object" && data && "conversation" in data) {
        const maybeConversation = (data as { conversation?: { id?: unknown } }).conversation;
        if (maybeConversation && typeof maybeConversation.id === "number") {
          setConversationId(String(maybeConversation.id));
        }
      }

      setResult({ ok: response.ok, status: response.status, data });
    } catch (error) {
      setResult({
        ok: false,
        status: 0,
        data: {
          error: error instanceof Error ? error.message : "Unexpected error",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run({
      method: "POST",
      path: "/api/auth/register",
      auth: false,
      body: {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        address: registerAddress || undefined,
        contactNumber: registerContactNumber || undefined,
      },
    });
  }

  async function onLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run({ method: "POST", path: "/api/auth/login", auth: false, body: { email: loginEmail, password: loginPassword } });
  }

  async function onCreateListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run({
      method: "POST",
      path: "/api/listings",
      body: {
        title: listingTitle,
        category: listingCategory,
        manufacturedYear: toNumber(listingYear),
        lengthFt: toNumber(listingLengthFt),
        shortDescription: listingShortDescription,
        mainDescription: listingMainDescription,
        location: listingLocation,
        valueUSD: toNumber(listingValueUsd),
        engine: listingEngine || undefined,
        totalPowerHP: toOptionalNumber(listingPower),
        brand: listingBrand || undefined,
        capacity: toOptionalNumber(listingCapacity),
      },
    });
  }

  return (
    <main style={{ padding: "1.5rem", maxWidth: 1200, margin: "0 auto", display: "grid", gap: "1rem" }}>
      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem" }}>
        <h1 style={{ margin: "0 0 0.5rem" }}>Boat Listr API Console</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>Current page: {pathname}</p>
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Session Settings</h2>
        <label>
          Base URL
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Bearer Token
          <input value={token} onChange={(e) => setToken(e.target.value)} style={{ width: "100%" }} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem" }}>
          <label>User ID<input value={userId} onChange={(e) => setUserId(e.target.value)} style={{ width: "100%" }} /></label>
          <label>Listing ID<input value={listingId} onChange={(e) => setListingId(e.target.value)} style={{ width: "100%" }} /></label>
          <label>Conversation ID<input value={conversationId} onChange={(e) => setConversationId(e.target.value)} style={{ width: "100%" }} /></label>
          <label>Notification ID<input value={notificationId} onChange={(e) => setNotificationId(e.target.value)} style={{ width: "100%" }} /></label>
        </div>
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Auth APIs</h2>
        <form onSubmit={onRegisterSubmit} style={{ display: "grid", gap: "0.5rem" }}>
          <strong>POST /api/auth/register</strong>
          <input placeholder="name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
          <input placeholder="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
          <input placeholder="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
          <input placeholder="address" value={registerAddress} onChange={(e) => setRegisterAddress(e.target.value)} />
          <input placeholder="contact number" value={registerContactNumber} onChange={(e) => setRegisterContactNumber(e.target.value)} />
          <button type="submit" disabled={loading}>Register User</button>
        </form>

        <form onSubmit={onLoginSubmit} style={{ display: "grid", gap: "0.5rem" }}>
          <strong>POST /api/auth/login</strong>
          <input placeholder="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <input placeholder="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          <button type="submit" disabled={loading}>Login</button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/auth/logout", body: {} })}>POST /api/auth/logout</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/auth/refresh-token", auth: false, body: { refreshToken } })}>POST /api/auth/refresh-token</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/auth/forgot-password", auth: false, body: { email: forgotEmail } })}>POST /api/auth/forgot-password</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/auth/reset-password", auth: false, body: { token: resetToken, password: newPassword } })}>POST /api/auth/reset-password</button>
        </div>

        <label>
          Refresh Token
          <input value={refreshToken} onChange={(e) => setRefreshToken(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Forgot Password Email
          <input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Reset Token
          <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          New Password
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%" }} />
        </label>
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>User APIs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/users/me" })}>GET /api/users/me</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: `/api/users/${userId}` })}>GET /api/users/{'{id}'}</button>
          <button disabled={loading} onClick={() => run({ method: "DELETE", path: `/api/users/${userId}` })}>DELETE /api/users/{'{id}'}</button>
        </div>
        <button
          disabled={loading}
          onClick={() =>
            run({
              method: "PATCH",
              path: "/api/users/me",
              body: {
                name: profileName,
                address: profileAddress,
                contactNumber: profileContactNumber,
              },
            })
          }
        >
          PATCH /api/users/me
        </button>
        <button
          disabled={loading}
          onClick={() =>
            run({
              method: "PATCH",
              path: `/api/users/${userId}`,
              body: {
                name: profileName,
                address: profileAddress,
                contactNumber: profileContactNumber,
              },
            })
          }
        >
          PATCH /api/users/{'{id}'}
        </button>
        <input placeholder="profile name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
        <input placeholder="profile address" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} />
        <input placeholder="profile contact number" value={profileContactNumber} onChange={(e) => setProfileContactNumber(e.target.value)} />
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Listing APIs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/listings?page=1&pageSize=20" })}>GET /api/listings</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: `/api/listings/${listingId}` })}>GET /api/listings/{'{id}'}</button>
          <button disabled={loading} onClick={() => run({ method: "DELETE", path: `/api/listings/${listingId}` })}>DELETE /api/listings/{'{id}'}</button>
        </div>

        <form onSubmit={onCreateListing} style={{ display: "grid", gap: "0.5rem" }}>
          <strong>POST /api/listings</strong>
          <input value={listingTitle} onChange={(e) => setListingTitle(e.target.value)} placeholder="title" />
          <input value={listingCategory} onChange={(e) => setListingCategory(e.target.value)} placeholder="category" />
          <input value={listingYear} onChange={(e) => setListingYear(e.target.value)} placeholder="manufacturedYear" />
          <input value={listingLengthFt} onChange={(e) => setListingLengthFt(e.target.value)} placeholder="lengthFt" />
          <input value={listingShortDescription} onChange={(e) => setListingShortDescription(e.target.value)} placeholder="shortDescription" />
          <input value={listingMainDescription} onChange={(e) => setListingMainDescription(e.target.value)} placeholder="mainDescription" />
          <input value={listingLocation} onChange={(e) => setListingLocation(e.target.value)} placeholder="location" />
          <input value={listingValueUsd} onChange={(e) => setListingValueUsd(e.target.value)} placeholder="valueUSD" />
          <input value={listingEngine} onChange={(e) => setListingEngine(e.target.value)} placeholder="engine" />
          <input value={listingPower} onChange={(e) => setListingPower(e.target.value)} placeholder="totalPowerHP" />
          <input value={listingBrand} onChange={(e) => setListingBrand(e.target.value)} placeholder="brand" />
          <input value={listingCapacity} onChange={(e) => setListingCapacity(e.target.value)} placeholder="capacity" />
          <button type="submit" disabled={loading}>Create Listing</button>
        </form>

        <button
          disabled={loading}
          onClick={() =>
            run({
              method: "PATCH",
              path: `/api/listings/${listingId}`,
              body: {
                title: listingTitle,
                category: listingCategory,
                manufacturedYear: toNumber(listingYear),
                lengthFt: toNumber(listingLengthFt),
                shortDescription: listingShortDescription,
                mainDescription: listingMainDescription,
                location: listingLocation,
                valueUSD: toNumber(listingValueUsd),
                engine: listingEngine,
                totalPowerHP: toOptionalNumber(listingPower),
                brand: listingBrand,
                capacity: toOptionalNumber(listingCapacity),
              },
            })
          }
        >
          PATCH /api/listings/{'{id}'}
        </button>
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Favorites + Conversations + Messages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/favorites" })}>GET /api/favorites</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/favorites", body: { listingId: toNumber(listingId) } })}>POST /api/favorites</button>
          <button disabled={loading} onClick={() => run({ method: "DELETE", path: "/api/favorites", body: { listingId: toNumber(listingId) } })}>DELETE /api/favorites</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/conversations" })}>GET /api/conversations</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/conversations", body: { listingId: toNumber(listingId) } })}>POST /api/conversations</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: `/api/conversations/${conversationId}/messages` })}>GET /api/conversations/{'{id}'}/messages</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: `/api/conversations/${conversationId}/messages`, body: { body: messageBody } })}>POST /api/conversations/{'{id}'}/messages</button>
        </div>
        <input value={messageBody} onChange={(e) => setMessageBody(e.target.value)} placeholder="message body" />
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Notifications APIs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/notifications" })}>GET /api/notifications</button>
          <button
            disabled={loading}
            onClick={() => run({ method: "POST", path: "/api/notifications", body: { type: notificationType, title: notificationTitle, body: notificationBody } })}
          >
            POST /api/notifications
          </button>
          <button
            disabled={loading}
            onClick={() => run({ method: "PATCH", path: "/api/notifications/mark-read", body: { notificationId: toNumber(notificationId) } })}
          >
            PATCH /api/notifications/mark-read
          </button>
        </div>
        <input value={notificationType} onChange={(e) => setNotificationType(e.target.value)} placeholder="type" />
        <input value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} placeholder="title" />
        <input value={notificationBody} onChange={(e) => setNotificationBody(e.target.value)} placeholder="body" />
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Payments + Subscriptions APIs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button
            disabled={loading}
            onClick={() =>
              run({
                method: "POST",
                path: "/api/payments/create-payment-intent",
                body: {
                  amountUSD: toNumber(paymentAmount),
                  description: paymentDescription,
                  metadata: { listingId: listingId },
                },
              })
            }
          >
            POST /api/payments/create-payment-intent
          </button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/payments/history" })}>GET /api/payments/history</button>
          <button
            disabled={loading}
            onClick={() =>
              run({
                method: "POST",
                path: "/api/subscriptions/create",
                body: {
                  stripeSubId: subscriptionId,
                  stripePriceId: subscriptionPriceId,
                  status: "ACTIVE",
                },
              })
            }
          >
            POST /api/subscriptions/create
          </button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/subscriptions/cancel", body: { stripeSubId: subscriptionId } })}>POST /api/subscriptions/cancel</button>
          <button disabled={loading} onClick={() => run({ method: "POST", path: "/api/subscriptions/portal", body: {} })}>POST /api/subscriptions/portal</button>
        </div>
        <input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="amountUSD" />
        <input value={paymentDescription} onChange={(e) => setPaymentDescription(e.target.value)} placeholder="payment description" />
        <input value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)} placeholder="stripeSubId" />
        <input value={subscriptionPriceId} onChange={(e) => setSubscriptionPriceId(e.target.value)} placeholder="stripePriceId" />
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Admin Read APIs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/admin/analytics" })}>GET /api/admin/analytics</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/admin/reports" })}>GET /api/admin/reports</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/admin/users" })}>GET /api/admin/users</button>
          <button disabled={loading} onClick={() => run({ method: "GET", path: "/api/admin/listings" })}>GET /api/admin/listings</button>
        </div>
      </section>

      <section style={{ background: "#111827", color: "#f9fafb", borderRadius: 12, padding: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>Latest API Response</h2>
        {loading ? <p>Running request...</p> : null}
        {!result ? <p>Run any API action to see response here.</p> : null}
        {result ? (
          <>
            <p style={{ marginTop: 0 }}>
              Status: <strong>{result.status}</strong> | Success: <strong>{String(result.ok)}</strong>
            </p>
            <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>{prettify(result.data)}</pre>
          </>
        ) : null}
      </section>
    </main>
  );
}
