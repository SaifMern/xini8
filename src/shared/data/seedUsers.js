export const USER_ROLES = { CREATOR: "creator", INVESTOR: "investor", VIEWER: "viewer", ADMIN: "admin" };

export const roleOptions = [
  { value: USER_ROLES.CREATOR, label: "Creator", description: "Create projects, manage teams, milestones, and project updates." },
  { value: USER_ROLES.INVESTOR, label: "Investor", description: "View approved projects and track lifecycle progress." },
  { value: USER_ROLES.VIEWER, label: "Viewer", description: "Discover public projects and follow updates." },
  { value: USER_ROLES.ADMIN, label: "Administrator", description: "Review users, verify accounts, and govern project workflows." },
];

export const seedUsers = [
  { id: "usr_creator_001", fullName: "Ayan Malik", email: "creator@xini8.com", password: "12345678", role: "creator", country: "United States", avatarInitials: "AM", verificationStatus: "verified", accountStatus: "active", walletAddress: "", profileCompletion: 82, lastLoginAt: "Just now", createdAt: "2026-06-01" },
  { id: "usr_investor_001", fullName: "Sophia Rehman", email: "investor@xini8.com", password: "12345678", role: "investor", country: "UAE", avatarInitials: "SR", verificationStatus: "verified", accountStatus: "active", walletAddress: "0x71bC...91F2", profileCompletion: 94, lastLoginAt: "Just now", createdAt: "2026-05-18" },
  { id: "usr_viewer_001", fullName: "Daniel Cross", email: "viewer@xini8.com", password: "12345678", role: "viewer", country: "United Kingdom", avatarInitials: "DC", verificationStatus: "pending", accountStatus: "active", walletAddress: "", profileCompletion: 58, lastLoginAt: "Yesterday", createdAt: "2026-05-22" },
  { id: "usr_admin_001", fullName: "Platform Admin", email: "admin@xini8.com", password: "12345678", role: "admin", country: "United States", avatarInitials: "PA", verificationStatus: "verified", accountStatus: "active", walletAddress: "0x9Ad2...88E1", profileCompletion: 100, lastLoginAt: "Just now", createdAt: "2026-04-10" },
];
