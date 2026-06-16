import { seedUsers } from "../../../shared/data/seedUsers";
import { delay } from "../../../shared/utils/delay";
import { getInitials, sanitizeUser } from "../../../shared/utils/authHelpers";

const USERS_KEY = "xini8_mock_users_v2";
const SESSION_KEY = "xini8_mock_session_v2";

function normalizeUser(user) {
  return { accountStatus: "active", verificationStatus: "pending", ...user };
}
function readUsers() {
  const saved = localStorage.getItem(USERS_KEY);
  if (!saved) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers.map(normalizeUser)));
    return seedUsers.map(normalizeUser);
  }
  return JSON.parse(saved).map(normalizeUser);
}
function writeUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users.map(normalizeUser))); }
function writeSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token: `mock_token_${Date.now()}`, loggedInAt: new Date().toISOString() })); }

export const authService = {
  async getSession() {
    await delay(250);
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  },
  async login({ email, password }) {
    await delay(700);
    const users = readUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) throw new Error("Invalid email or password.");
    if ((user.accountStatus || "active") !== "active") throw new Error("This account is not active.");
    const updated = { ...user, lastLoginAt: "Just now" };
    writeUsers(users.map((item) => (item.id === user.id ? updated : item)));
    const safe = sanitizeUser(updated);
    writeSession(safe);
    return { user: safe, message: "Login successful." };
  },
  async register(payload) {
    await delay(850);
    const users = readUsers();
    if (users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) throw new Error("An account with this email already exists.");
    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      country: payload.country || "Not selected",
      avatarInitials: getInitials(payload.fullName),
      verificationStatus: payload.role === "viewer" ? "verified" : "pending",
      accountStatus: "active",
      walletAddress: "",
      profileCompletion: payload.role === "viewer" ? 70 : 45,
      lastLoginAt: "Just now",
      createdAt: new Date().toISOString(),
    };
    writeUsers([newUser, ...users]);
    const safe = sanitizeUser(newUser);
    writeSession(safe);
    return { user: safe, message: "Account created successfully." };
  },
  async logout() { await delay(300); localStorage.removeItem(SESSION_KEY); return { message: "Logged out successfully." }; },
  async forgotPassword(email) { await delay(650); return { message: "If this email exists, a password reset link has been sent." }; },
  async updateProfile(userId, payload) {
    await delay(550);
    const users = readUsers();
    const updatedUsers = users.map((user) => user.id === userId ? { ...user, ...payload, avatarInitials: payload.fullName ? getInitials(payload.fullName) : user.avatarInitials } : user);
    writeUsers(updatedUsers);
    const updatedUser = sanitizeUser(updatedUsers.find((u) => u.id === userId));
    writeSession(updatedUser);
    return { user: updatedUser, message: "Profile updated." };
  },
  async connectWallet(userId, walletAddress) {
    await delay(600);
    const users = readUsers();
    const updatedUsers = users.map((user) => user.id === userId ? { ...user, walletAddress } : user);
    writeUsers(updatedUsers);
    const updatedUser = sanitizeUser(updatedUsers.find((u) => u.id === userId));
    writeSession(updatedUser);
    return { user: updatedUser, message: "Wallet connected." };
  },
  async disconnectWallet(userId) {
    await delay(450);
    const users = readUsers();
    const updatedUsers = users.map((user) => user.id === userId ? { ...user, walletAddress: "" } : user);
    writeUsers(updatedUsers);
    const updatedUser = sanitizeUser(updatedUsers.find((u) => u.id === userId));
    writeSession(updatedUser);
    return { user: updatedUser, message: "Wallet disconnected." };
  },
  async listUsers() { await delay(450); return readUsers().map(sanitizeUser); },
  async updateUserStatus(userId, payload) {
    await delay(500);
    const users = readUsers();
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, ...payload } : u);
    writeUsers(updatedUsers);
    return updatedUsers.map(sanitizeUser);
  },
};
