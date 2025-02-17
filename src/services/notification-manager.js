export class NotificationManager {
  constructor(container) {
    this.container = container;
    this.notifications = new Set();
  }

  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `ai-notification ${type}`;
    notification.innerHTML = `
      ${message}
      <button class="notification-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    `;

    const close = () => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
        this.notifications.delete(notification);
      }, 300);
    };

    notification.querySelector('.notification-close').onclick = close;

    if (duration > 0) {
      setTimeout(close, duration);
    }

    this.container.appendChild(notification);
    this.notifications.clear();
    this.notifications.add(notification);
  }

  error(message, duration = 7000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 5000) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 4000) {
    this.show(message, 'info', duration);
  }

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }
}