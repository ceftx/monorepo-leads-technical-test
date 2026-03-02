// assets
import { IconUsers } from '@tabler/icons-react';

// ==============================|| USERS MENU ITEMS ||============================== //

const users = {
  id: 'users',
  title: 'Admin',
  type: 'group',
  adminOnly: true, // Solo visible para admin
  children: [
    {
      id: 'users-list',
      title: 'Users Management',
      type: 'item',
      url: '/users',
      icon: IconUsers,
      breadcrumbs: false
    }
  ]
};

export default users;
