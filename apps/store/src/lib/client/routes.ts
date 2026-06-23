export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  attributes: '/products/attributes',
} as const;

export const getAttributeDetailRoute = (attributeId: string | number) =>
  `/products/attributes/${attributeId}`;

export type ClientRoute = (typeof clientRoutes)[keyof typeof clientRoutes];
