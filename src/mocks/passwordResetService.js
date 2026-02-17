const STORAGE_KEY = "oxy_password_reset_requests";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readRequests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRequests = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

const generateToken = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `rst-${Date.now()}-${random}`;
};

export const requestPasswordReset = async (email) => {
  await wait(800);
  const token = generateToken();
  const requests = readRequests();
  const request = {
    token,
    email,
    used: false,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 30,
  };
  requests.unshift(request);
  saveRequests(requests);
  return request;
};

export const validatePasswordResetToken = async (token) => {
  await wait(350);
  const requests = readRequests();
  const request = requests.find((item) => item.token === token);

  if (!request) {
    return { valid: false, reason: "invalid", email: "" };
  }

  if (request.used) {
    return { valid: false, reason: "used", email: request.email };
  }

  if (Date.now() > request.expiresAt) {
    return { valid: false, reason: "expired", email: request.email };
  }

  return { valid: true, reason: "", email: request.email };
};

export const completePasswordReset = async ({ token, newPassword }) => {
  await wait(850);
  const requests = readRequests();
  const index = requests.findIndex((item) => item.token === token);

  if (index < 0) {
    return { ok: false, message: "Token no valido." };
  }

  const current = requests[index];
  if (current.used || Date.now() > current.expiresAt) {
    return { ok: false, message: "El enlace de recuperacion ya no es valido." };
  }

  requests[index] = {
    ...current,
    used: true,
    updatedAt: Date.now(),
    mockPasswordLength: newPassword.length,
  };
  saveRequests(requests);
  return { ok: true };
};
