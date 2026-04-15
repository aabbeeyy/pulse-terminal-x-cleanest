export type StoredUser = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = "market-pulse-users";
const SESSION_KEY = "market-pulse-session";
const SUBSCRIPTION_KEY = "market-pulse-subscription";

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function registerUser(user: StoredUser) {
  const users = getUsers();
  const exists = users.some((item) => item.email.toLowerCase() === user.email.toLowerCase());
  if (exists) throw new Error("An account with this email already exists.");
  const nextUsers = [...users, user];
  window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

export function loginUser(email: string, password: string) {
  const users = getUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) throw new Error("Invalid email or password.");
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

export function getSession(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getSubscription(): { plan: string; active: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(SUBSCRIPTION_KEY) || "null");
  } catch {
    return null;
  }
}

export function setSubscription(plan: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({ plan, active: true }));
}
