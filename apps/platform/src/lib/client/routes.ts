export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  stores: '/stores',
  addStore: '/stores/add',
  terms: '/terms',
  privacy: '/privacy',
} as const;

export type ClientRoute = (typeof clientRoutes)[keyof typeof clientRoutes];
