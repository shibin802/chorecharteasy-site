-- DEVELOPMENT ONLY. Never apply to production.
-- All identities use the reserved .test top-level domain.

INSERT OR IGNORE INTO users (
  id, email, email_hash, status, created_at, updated_at
) VALUES (
  'dev-user-family-pack',
  'member@example.test',
  '8ba467122dd52d3a2aa3c4ed5ffd1b865c507e00c6ffbe9b955cfc9c0f699072',
  'active',
  0,
  0
);

INSERT OR IGNORE INTO memberships (
  id, user_id, plan, status, grant_source, starts_at, created_at, updated_at
) VALUES (
  'dev-membership-family-pack',
  'dev-user-family-pack',
  'family_pack',
  'active',
  'pilot',
  0,
  0,
  0
);
