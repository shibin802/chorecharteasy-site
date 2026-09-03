(() => {
  "use strict";
  const link = document.querySelector("#account-link");
  if (!link) return;
  fetch("/api/me", { headers: { Accept: "application/json" } })
    .then(response => response.ok ? response.json() : null)
    .then(payload => {
      if (!payload?.authenticated) return;
      link.textContent = "Account";
      link.title = `Signed in as ${payload.user.email}`;
    })
    .catch(() => {});
})();
