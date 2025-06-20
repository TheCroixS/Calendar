import { Task } from '../types';
import { differenceInDays, differenceInHours, isToday, isTomorrow } from 'date-fns';

export class NotificationManager {
  private static instance: NotificationManager;
  private notificationPermission: NotificationPermission = 'default';

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
      return this.notificationPermission === 'granted';
    }
    return false;
  }

  showNotification(title: string, body: string, icon?: string): void {
    if (this.notificationPermission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  }

  checkTaskReminders(tasks: Task[]): void {
    const now = new Date();
    
    tasks.forEach(task => {
      if (task.status === 'completed') return;
      
      const taskDate = new Date(task.startDate);
      const hoursUntilTask = differenceInHours(taskDate, now);
      const daysUntilTask = differenceInDays(taskDate, now);
      
      // Notificación para tareas de hoy
      if (isToday(taskDate) && hoursUntilTask <= 2 && hoursUntilTask > 0) {
        this.showNotification(
          '⏰ Tarea próxima',
          `"${task.title}" comienza en ${hoursUntilTask} hora(s)`
        );
      }
      
      // Notificación para tareas de mañana
      if (isTomorrow(taskDate)) {
        this.showNotification(
          '📅 Recordatorio',
          `Mañana tienes: "${task.title}"`
        );
      }
      
      // Notificación para tareas atrasadas
      if (daysUntilTask < 0) {
        this.showNotification(
          '🚨 Tarea atrasada',
          `"${task.title}" debía completarse hace ${Math.abs(daysUntilTask)} día(s)`
        );
      }
    });
  }

  startPeriodicCheck(tasks: Task[]): void {
    // Verificar cada 30 minutos
    setInterval(() => {
      this.checkTaskReminders(tasks);
    }, 30 * 60 * 1000);
  }
}