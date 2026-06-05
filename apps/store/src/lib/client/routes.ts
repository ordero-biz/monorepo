export const clientRoutes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  attributes: '/products/attributes',
  attributeDetail: (attributeId: string | number) =>
    `/products/attributes/${attributeId}`,
} as const;

export type ClientRoute = (typeof clientRoutes)[keyof typeof clientRoutes];
