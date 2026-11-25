import type { SidebarNavigationSectionConfig } from '@ordero/ui';
import { Building2, Plus } from 'lucide-react';
import { clientRoutes } from '@/lib/client/routes';

export const sidebarSections: SidebarNavigationSectionConfig[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      {
        id: 'stores',
        kind: 'link',
        label: 'Stores',
        href: clientRoutes.stores,
        icon: <Building2 />,
      },
      {
        id: 'add-store',
        kind: 'link',
        label: 'Add store',
        href: clientRoutes.addStore,
        icon: <Plus />,
      },
    ],
  },
];
