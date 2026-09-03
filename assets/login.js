(() => {
  "use strict";
  const form = document.querySelector("#login-form");
  const email = document.querySelector("#login-email");
  const submit = document.querySelector("#login-submit");
  const status = document.querySelector("#login-status");
  const signedIn = document.querySelector("#signed-in-state");
  const signedInEmail = document.querySelector("#signed-in-email");
  const logout = document.querySelector("#logout-button");

  function showStatus(message, state = "") {
    status.textContent = message;
    status.className = `login-status${state ? ` ${state}` : ""}`;
  }

  async function json(response) {
    try { return await response.json(); } catch { return null; }
  }

  async function initialize() {
    try {
      const [capabilityResponse, accountResponse] = await Promise.all([
        fetch("/api/membership", { headers: { Accept: "application/json" } }),
        fetch("/api/me", { headers: { Accept: "application/json" } }),
      ]);
      const capability = await json(capabilityResponse);
      const account = await json(accountResponse);
      if (accountResponse.ok && account?.authenticated) {
        form.hidden = true;
        signedIn.hidden = false;
        signedInEmail.textContent = account.user.email;
        showStatus("Your account session is active.", "success");
        return;
      }
      if (!capabilityResponse.ok || !capability?.accounts?.enabled) {
        showStatus("Email sign-in is being configured. Please try again after setup is complete.", "error");
        return;
      }
      form.querySelector("fieldset").disabled = false;
      showStatus("We’ll email you a one-time sign-in link that expires in 15 minutes.", "ready");
    } catch {
      showStatus("Sign-in availability could not be confirmed. Please try again later.", "error");
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = "Sending link…";
    showStatus("Requesting your secure sign-in link…", "ready");
    try {
      const response = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim() }),
      });
      const payload = await json(response);
      if (!response.ok) throw new Error(payload?.error?.message || "The sign-in link could not be sent.");
      form.querySelector("fieldset").disabled = true;
      showStatus(payload.message || "Check your email for a sign-in link.", "success");
      if (payload.debug?.verifyUrl && ["localhost", "127.0.0.1"].includes(location.hostname)) {
        const link = document.createElement("a");
        link.href = payload.debug.verifyUrl;
        link.textContent = "Open local development sign-in link";
        status.append(document.createElement("br"), link);
      }
    } catch (error) {
      submit.disabled = false;
      submit.textContent = "Email me a sign-in link";
      showStatus(error instanceof Error ? error.message : "The sign-in link could not be sent.", "error");
    }
  });

  logout.addEventListener("click", async () => {
    logout.disabled = true;
    await fetch("/api/logout", { method: "POST", headers: { Accept: "application/json" } });
    location.assign("/");
  });

  initialize();
})();
