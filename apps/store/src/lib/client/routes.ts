export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
} as const;

export type ClientRoute = (typeof clientRoutes)[keyof typeof clientRoutes];
