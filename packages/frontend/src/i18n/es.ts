// Spanish translations - Primary language
const es = {
  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    filter: 'Filtrar',
    actions: 'Acciones',
    yes: 'Sí',
    no: 'No',
    back: 'Volver',
    confirm: 'Confirmar',
    close: 'Cerrar',
    view: 'Ver',
    add: 'Agregar',
    remove: 'Quitar',
    refresh: 'Actualizar',
    noData: 'No hay datos',
    required: 'Requerido',
    optional: 'Opcional',
    all: 'Todos',
    status: 'Estado',
    date: 'Fecha',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono'
  },

  // Navigation
  nav: {
    dashboard: 'Panel',
    leads: 'Leads',
    users: 'Usuarios',
    authentication: 'Autenticación',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    manageLeads: 'Gestionar Leads',
    usersManagement: 'Gestión de Usuarios',
    admin: 'Administración'
  },

  // Auth
  auth: {
    loginTitle: 'Iniciar Sesión',
    loginSubtitle: 'Ingresa tus credenciales para continuar',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signIn: 'Iniciar Sesión',
    loginError: 'Credenciales inválidas',
    loginSuccess: '¡Sesión iniciada correctamente!',

    registerTitle: 'Registrarse',
    registerSubtitle: 'Ingresa tus datos para continuar',
    firstName: 'Nombre',
    lastName: 'Apellido',
    confirmPassword: 'Confirmar Contraseña',
    terms: 'Acepto los Términos y Condiciones',
    signUp: 'Registrarse',
    registerError: 'Error al registrar usuario',
    registerSuccess: '¡Registro exitoso! Por favor inicia sesión.',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    noAccount: '¿No tienes una cuenta?'
  },

  // Dashboard
  dashboard: {
    title: 'Panel de Control',
    globalDashboard: 'Panel Global',
    myDashboard: 'Mi Panel',
    welcomeBack: '¡Bienvenido de nuevo,',
    totalLeads: 'Total de Leads',
    totalAmount: 'Monto Total',
    last7Days: 'Últimos 7 Días',
    totalUsers: 'Total de Usuarios',
    distributionByStatus: 'Distribución por Estado',
    topVendorsByRevenue: 'Mejores Vendedores por Ingresos',
    rank: 'Ranking',
    vendor: 'Vendedor',
    wonLeads: 'Leads Ganados',
    revenue: 'Ingresos',
    noMetricsAvailable: 'No hay métricas disponibles'
  },

  // Leads
  leads: {
    title: 'Leads',
    manageLeads: 'Gestionar Leads',
    newLead: 'Nuevo Lead',
    editLead: 'Editar Lead',
    deleteLead: 'Eliminar Lead',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este lead?',
    leadCreated: 'Lead creado exitosamente',
    leadUpdated: 'Lead actualizado exitosamente',
    leadDeleted: 'Lead eliminado exitosamente',
    noLeads: 'No hay leads disponibles',
    searchLeads: 'Buscar leads...',
    searchLeadsPlaceholder: 'Buscar leads por nombre, email, empresa o estado...',
    noLeadsSearch: 'No se encontraron leads con tu búsqueda.',
    statusTooltip: 'Haz clic en el estado para cambiarlo',
    statusFinal: 'Estado final - no se puede cambiar',
    statusChange: 'Haz clic para cambiar el estado',

    // Lead fields
    leadName: 'Nombre del Lead',
    company: 'Empresa',
    contact: 'Contacto',
    source: 'Fuente',
    assignedTo: 'Asignado a',
    estimatedAmount: 'Monto Estimado',
    notes: 'Notas',
    createdAt: 'Fecha de Creación',
    updatedAt: 'Fecha de Actualización',

    // Lead status
    status: {
      NUEVO: 'Nuevo',
      CONTACTADO: 'Contactado',
      PROPUESTA: 'Propuesta',
      GANADO: 'Ganado',
      PERDIDO: 'Perdido'
    }
  },

  // Users
  users: {
    title: 'Usuarios',
    manageUsers: 'Gestionar Usuarios',
    newUser: 'Nuevo Usuario',
    editUser: 'Editar Usuario',
    deleteUser: 'Eliminar Usuario',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este usuario?',
    userCreated: 'Usuario creado exitosamente',
    userUpdated: 'Usuario actualizado exitosamente',
    userDeleted: 'Usuario eliminado exitosamente',
    noUsers: 'No hay usuarios disponibles',
    searchUsers: 'Buscar usuarios...',

    // User fields
    userName: 'Nombre',
    role: 'Rol',
    createdAt: 'Fecha de Creación',
    updatedAt: 'Fecha de Actualización',

    // Roles
    roles: {
      ADMIN: 'Administrador',
      VENDEDOR: 'Vendedor'
    }
  },

  // Form validation
  validation: {
    required: 'Este campo es requerido',
    emailInvalid: 'Ingresa un correo electrónico válido',
    passwordMin: 'La contraseña debe tener al menos 6 caracteres',
    passwordMatch: 'Las contraseñas no coinciden',
    firstNameMin: 'El nombre debe tener al menos 2 caracteres',
    lastNameMin: 'El apellido debe tener al menos 2 caracteres',
    termsRequired: 'Debes aceptar los términos y condiciones'
  },

  // Messages
  messages: {
    sessionExpired: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
    unauthorized: 'No tienes autorización para acceder a este recurso.',
    serverError: 'Error del servidor. Por favor intenta más tarde.',
    networkError: 'Error de conexión. Verifica tu conexión a internet.',
    confirmAction: '¿Estás seguro de que deseas continuar?'
  }
};

export default es;
