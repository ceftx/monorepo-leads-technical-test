// assets
import { IconUsers } from '@tabler/icons-react';

// ==============================|| USERS MENU ITEMS ||============================== //

const users = {
  id: 'users',
  title: 'Administración',
  type: 'group',
  adminOnly: true, // Solo visible para admin
  children: [
    {
      id: 'users-list',
      title: 'Gestión de Usuarios',
      type: 'item',
      url: '/users',
      icon: IconUsers,
      breadcrumbs: false
    }
  ]
};

export default users;
