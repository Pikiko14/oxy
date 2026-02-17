const AUTH_KEY = "oxy_auth_session";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginMock = async ({ email, password, rememberSession }) => {
  await wait(700);
  const passwordLength = password?.length ?? 0;
  const auth = {
    isAuthenticated: true,
    user: {
      email,
      name: "Operador OXY",
      role: "Administrador",
    },
    createdAt: Date.now(),
    rememberSession: Boolean(rememberSession),
    token: `mock-${Date.now()}`,
    mockPasswordLength: passwordLength,
  };

  const storage = rememberSession ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, JSON.stringify(auth));
  if (rememberSession) {
    sessionStorage.removeItem(AUTH_KEY);
  } else {
    localStorage.removeItem(AUTH_KEY);
  }

  return auth;
};

export const getAuthSession = () => {
  const local = localStorage.getItem(AUTH_KEY);
  const session = sessionStorage.getItem(AUTH_KEY);
  const raw = local || session;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getAuthSession()?.isAuthenticated);

export const logoutMock = () => {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
};
