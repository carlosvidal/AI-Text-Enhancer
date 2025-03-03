// Actualización de la clase NotificationManager en src/services/notification-manager.js

export class NotificationManager {
  constructor(container) {
    if (!container) {
      console.error("[NotificationManager] No se proporcionó un contenedor");
      this.container = null;
      return;
    }

    // Si el contenedor es un componente o elemento HTML con shadowRoot
    if (container.shadowRoot) {
      // Buscar el contenedor de notificaciones en el shadowRoot
      this.container = container.shadowRoot.querySelector(
        ".notifications-container"
      );

      // Si no existe, crearlo
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.className = "notifications-container";
        container.shadowRoot.appendChild(this.container);
      }
    } else {
      // Si es un elemento DOM normal
      this.container = container;
    }

    this.notifications = new Set();
    console.log(
      "[NotificationManager] Inicializado con contenedor:",
      this.container
    );
  }

  show(message, type = "info", duration = 5000) {
    if (!this.container) {
      console.error(
        "[NotificationManager] No hay contenedor de notificaciones disponible"
      );
      // Fallback: mostrar en la consola
      console.log(`[${type.toUpperCase()}] ${message}`);
      return null;
    }

    try {
      const notification = document.createElement("div");
      notification.className = `ai-notification ${type}`;
      notification.setAttribute("role", "alert");

      // Usar un símbolo apropiado según el tipo
      const icon = this.getIconForType(type);

      notification.innerHTML = `
        ${icon}
        <div class="notification-content">${message}</div>
        <button class="notification-close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      `;

      // Función para cerrar la notificación
      const close = () => {
        notification.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
          this.notifications.delete(notification);
        }, 300);
      };

      // Agregar manejador de eventos al botón de cierre
      const closeButton = notification.querySelector(".notification-close");
      if (closeButton) {
        closeButton.onclick = close;
      }

      // Cierre automático si la duración es mayor que 0
      if (duration > 0) {
        setTimeout(close, duration);
      }

      // Agregar la notificación al contenedor
      this.container.appendChild(notification);
      this.notifications.add(notification);

      console.log(`[NotificationManager] Notificación mostrada: ${type}`);

      // Auto-eliminar notificaciones antiguas si hay demasiadas
      this.cleanupOldNotifications();

      return notification;
    } catch (error) {
      console.error(
        "[NotificationManager] Error al mostrar notificación:",
        error
      );
      return null;
    }
  }

  // Métodos de conveniencia para diferentes tipos de notificaciones
  error(message, duration = 7000) {
    return this.show(message, "error", duration);
  }

  warning(message, duration = 5000) {
    return this.show(message, "warning", duration);
  }

  info(message, duration = 4000) {
    return this.show(message, "info", duration);
  }

  success(message, duration = 3000) {
    return this.show(message, "success", duration);
  }

  // Limitar el número de notificaciones simultáneas
  cleanupOldNotifications(maxNotifications = 3) {
    const notificationsArray = Array.from(this.notifications);

    if (notificationsArray.length > maxNotifications) {
      // Eliminar las notificaciones más antiguas
      const oldNotifications = notificationsArray.slice(
        0,
        notificationsArray.length - maxNotifications
      );

      oldNotifications.forEach((notification) => {
        if (notification.parentNode) {
          notification.remove();
        }
        this.notifications.delete(notification);
      });
    }
  }

  // Obtener un ícono SVG según el tipo de notificación
  getIconForType(type) {
    switch (type) {
      case "error":
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        `;
      case "warning":
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        `;
      case "success":
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        `;
      case "info":
      default:
        return `
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        `;
    }
  }

  // Limpiar todas las notificaciones
  clearAll() {
    this.notifications.forEach((notification) => {
      if (notification.parentNode) {
        notification.remove();
      }
    });
    this.notifications.clear();
  }
}

// Función de fábrica para crear gestores de notificaciones
export function createNotificationManager(container) {
  return new NotificationManager(container);
}
