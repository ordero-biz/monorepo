export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
} as const;

export type ClientRoute = (typeof clientRoutes)[keyof typeof clientRoutes];
