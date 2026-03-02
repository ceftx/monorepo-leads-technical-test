// assets
import { IconFileDescription } from '@tabler/icons-react';

// ==============================|| LEADS MENU ITEMS ||============================== //

const leads = {
  id: 'leads',
  title: 'Leads',
  type: 'group',
  children: [
    {
      id: 'leads-list',
      title: 'Gestionar Leads',
      type: 'item',
      url: '/leads',
      icon: IconFileDescription,
      breadcrumbs: false
    }
  ]
};

export default leads;
