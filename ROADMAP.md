# 🗺️ Roadmap de Mejoras

> Prioridades y funcionalidades a implementar para mejorar el sistema de gestión de leads.

---

## 📌 Versión 1.1 - Notificaciones en Tiempo Real

### Estado: ✅ Parcialmente implementado

El sistema ya cuenta con WebSocket para notificaciones en tiempo real, pero faltan algunos casos de uso.

### Completado ✅

- [x] Notificación cuando se **crea** un lead
- [x] Notificación cuando se **cambia el estado** de un lead
- [x] Notificación cuando se **elimina** un lead
- [x] Frontend escucha notificaciones y actualiza la lista automáticamente
- [x] Sistema de rooms por usuario (cada usuario recibe sus notificaciones)

### Pendiente 🔄

- [ ] **Notificación de edición de lead** (datos: nombre, email, empresa, monto)
    - Falta método `notifyLeadUpdated` en `NotificationService`
    - `UpdateLead.ts` actualmente llama incorrectamente a `notifyLeadCreated`
    - No hay tipo `LEAD_UPDATED` en el frontend
    - **Impacto**: Cuando un usuario edita un lead, los demás usuarios no ven el cambio automáticamente

---

## 📌 Versión 1.2 - Mejoras de UX/UI

### Pendiente 🔄

- [ ] **Notificaciones visuales** en el navbar (badge con contador)
- [ ] **Panel de notificaciones** con historial
- [ ] **Filtros avanzados** en la lista de leads (por fecha, rango de monto)
- [ ] **Exportación** de leads a CSV/Excel
- [ ] **Edición inline** de leads desde la tabla
- [ ] **Confirmación con undo** antes de eliminar lead

---

## 📌 Versión 1.3 - Funcionalidades de Negocio

### Pendiente 🔄

- [ ] **Etiquetas/Tags** para categorizar leads
- [ ] **Notas/Comentarios** en cada lead
- [ ] **Historial de cambios** (auditoría)
- [ ] **Seguimiento de actividades** (llamadas, emails, reuniones)
- [ ] **Pipeline visual** (Kanban) para gestionar estado de leads
- [ ] **Validación de emails** (formato, verificación de existencia)
- [ ] **Asignación masiva** de leads a vendedores (admin)

---

## 📌 Versión 1.4 - Integraciones

### Pendiente 🔄

- [ ] **Webhooks** para notificar a sistemas externos
- [ ] **Integración con email** (send emails when status changes)
- [ ] **Integración con CRM** externo (HubSpot, Salesforce)
- [ ] **API REST pública** para integraciones
- [ ] **Dashboard en tiempo real** con gráficos animados

---

## 📌 Versión 2.0 - Escalabilidad

### Pendiente 🔄

- [ ] **Tests unitarios** y de integración (coverage > 80%)
- [ ] **Documentación de API** con examples (Swagger improvements)
- [ ] **Rate limiting** en endpoints
- [ ] **Cacheo** con Redis
- [ ] **Colas (Bull/Redis)** para procesamiento de notificaciones
- [ ] **Logging centralizado** (ELK stack o similar)
- [ ] **Métricas** (Prometheus + Grafana)
- [ ] **Docker Compose** para desarrollo local

---

## 🔥 Prioridades Inmediatas

| #   | Tarea                                | Impacto | Dificultad |
| --- | ------------------------------------ | ------- | ---------- |
| 1   | Notificación de edición de lead      | Alto    | Baja       |
| 2   | Badge de notificaciones en navbar    | Medio   | Baja       |
| 3   | Panel de historial de notificaciones | Medio   | Media      |
| 4   | Filtros avanzados en leads           | Alto    | Media      |
| 5   | Exportación CSV                      | Medio   | Baja       |

---

## 💡 Ideas Futuras

- App móvil (React Native / Expo)
- IA para scoring de leads
- Chat interno entre usuarios
- Encuestas de satisfacción post-cierre
- Recordatorios automáticos de seguimiento

---

_Última actualización: Marzo 2026_
