/* ============================================================
   TRIVERSE AI — Client persistence (localStorage) & toasts
   SSR-safe: every access checks typeof window.
   ============================================================ */

const KEYS = {
  users: "triverse:users",
  session: "triverse:session",
  trips: "triverse:trips",
  achievements: "triverse:achievements",
  remember: "triverse:remember",
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — demo app degrades gracefully */
  }
}

/* ---------- users & session ---------- */

export function getUsers() {
  return read(KEYS.users, []);
}

export function findUser(email) {
  const e = String(email || "").trim().toLowerCase();
  return getUsers().find((u) => u.email === e) || null;
}

export function createUser({ name, email, password }) {
  const users = getUsers();
  if (findUser(email)) return { ok: false, error: "An account with this email already exists." };
  const user = {
    id: "u-" + Date.now().toString(36),
    name: name.trim(),
    email: String(email).trim().toLowerCase(),
    password, // demo-only local credential store
    createdAt: Date.now(),
    preferences: [],
  };
  users.push(user);
  write(KEYS.users, users);
  setSession(user);
  return { ok: true, user };
}

export function signInUser(email, password) {
  const user = findUser(email);
  if (!user) return { ok: false, error: "No account found with this email." };
  if (user.password !== password) return { ok: false, error: "Incorrect password. Try again." };
  setSession(user);
  return { ok: true, user };
}

export function updateUser(patch) {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === session.id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  write(KEYS.users, users);
  setSession(users[idx]);
  return users[idx];
}

export function getSession() {
  return read(KEYS.session, null);
}

export function setSession(user) {
  write(KEYS.session, user);
}

export function clearSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEYS.session);
  }
}

/* ---------- trips ---------- */

export function getTrips() {
  const trips = read(KEYS.trips, []);
  return trips.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getTrip(id) {
  return getTrips().find((t) => t.id === id) || null;
}

export function saveTrip(trip) {
  const trips = read(KEYS.trips, []);
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx === -1) trips.push(trip);
  else trips[idx] = trip;
  write(KEYS.trips, trips);
  return trip;
}

export function deleteTrip(id) {
  const trips = read(KEYS.trips, []).filter((t) => t.id !== id);
  write(KEYS.trips, trips);
}

export function duplicateTrip(id) {
  const src = getTrip(id);
  if (!src) return null;
  const copy = JSON.parse(JSON.stringify(src));
  copy.id = "t-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  copy.createdAt = Date.now();
  copy.updatedAt = Date.now();
  copy.startDate = addDaysLocal(copy.startDate, 30);
  copy.itinerary = copy.itinerary.map((d) => ({ ...d, date: addDaysLocal(d.date, 30) }));
  copy.status = "planned";
  copy.disruptions = [];
  copy.decisions = { flightChoice: copy.decisions.flightChoice, hotelChoice: copy.decisions.hotelChoice, applied: [], declined: [] };
  saveTrip(copy);
  return copy;
}

function addDaysLocal(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ---------- achievements ---------- */

export function getAchievements() {
  return read(KEYS.achievements, {});
}

export function unlockAchievements(map, at) {
  const existing = getAchievements();
  const fresh = [];
  for (const [id, ts] of Object.entries(map)) {
    if (!existing[id]) {
      existing[id] = ts || at;
      fresh.push(id);
    }
  }
  write(KEYS.achievements, existing);
  return { unlocked: existing, fresh };
}

export function resetAll() {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}

/* ---------- remembered email ---------- */

export function getRememberedEmail() {
  return read(KEYS.remember, "");
}

export function setRememberedEmail(email) {
  write(KEYS.remember, email || "");
}

/* ---------- toasts ---------- */

export function toast(message, type = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("triverse:toast", { detail: { message, type } })
  );
}

export function notifyAchievement(id) {
  toast(`Achievement unlocked: ${id}`, "success");
}
