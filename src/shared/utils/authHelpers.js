export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function getInitials(name = "User") {
  return name.split(" ").filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "U";
}

export function getDashboardPath(role) {
  const paths = {
    creator: "/dashboard",
    investor: "/dashboard",
    viewer: "/dashboard",
    admin: "/dashboard",
  };
  return paths[role] || "/login";
}

export function createWalletAddress() {
  const first = Math.random().toString(16).slice(2, 6).toUpperCase();
  const last = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `0x${first}...${last}`;
}

export function getVerificationLabel(status) {
  return { verified: "Verified", pending: "Pending Verification", rejected: "Verification Rejected" }[status] || "Pending Verification";
}
