import { Task } from '../types';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval,
  differenceInDays,
  format
} from 'date-fns';
import { es } from 'date-fns/locale';

export interface TaskAnalytics {
  completionRate: number;
  averageCompletionTime: number;
  productivityTrend: 'up' | 'down' | 'stable';
  weeklyStats: {
    completed: number;
    pending: number;
    overdue: number;
  };
  monthlyStats: {
    completed: number;
    pending: number;
    overdue: number;
  };
  categoryBreakdown: Record<string, number>;
  upcomingDeadlines: Task[];
}

export class AnalyticsEngine {
  static generateAnalytics(tasks: Task[]): TaskAnalytics {
    const now = new Date();
    const weekStart = startOfWeek(now, { locale: es });
    const weekEnd = endOfWeek(now, { locale: es });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Filtrar tareas por períodos
    const weeklyTasks = tasks.filter(task => 
      isWithinInterval(new Date(task.startDate), { start: weekStart, end: weekEnd })
    );
    
    const monthlyTasks = tasks.filter(task => 
      isWithinInterval(new Date(task.startDate), { start: monthStart, end: monthEnd })
    );

    // Calcular estadísticas semanales
    const weeklyStats = {
      completed: weeklyTasks.filter(t => t.status === 'completed').length,
      pending: weeklyTasks.filter(t => t.status === 'pending' && new Date(t.startDate) >= now).length,
      overdue: weeklyTasks.filter(t => t.status === 'pending' && new Date(t.startDate) < now).length,
    };

    // Calcular estadísticas mensuales
    const monthlyStats = {
      completed: monthlyTasks.filter(t => t.status === 'completed').length,
      pending: monthlyTasks.filter(t => t.status === 'pending' && new Date(t.startDate) >= now).length,
      overdue: monthlyTasks.filter(t => t.status === 'pending' && new Date(t.startDate) < now).length,
    };

    // Tasa de completitud
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Tiempo promedio de completitud
    const completedTasksWithTime = tasks.filter(t => t.status === 'completed');
    const averageCompletionTime = completedTasksWithTime.length > 0 
      ? completedTasksWithTime.reduce((acc, task) => {
          const created = new Date(task.createdAt);
          const updated = new Date(task.updatedAt);
          return acc + differenceInDays(updated, created);
        }, 0) / completedTasksWithTime.length
      : 0;

    // Próximos vencimientos (próximos 7 días)
    const upcomingDeadlines = tasks
      .filter(t => t.status === 'pending')
      .filter(t => {
        const taskDate = new Date(t.startDate);
        const daysUntil = differenceInDays(taskDate, now);
        return daysUntil >= 0 && daysUntil <= 7;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5);

    // Categorización automática por palabras clave
    const categoryBreakdown = this.categorizeTasks(tasks);

    // Tendencia de productividad (simplificada)
    const recentTasks = tasks.filter(t => 
      differenceInDays(now, new Date(t.createdAt)) <= 14
    );
    const recentCompletionRate = recentTasks.length > 0 
      ? (recentTasks.filter(t => t.status === 'completed').length / recentTasks.length) * 100
      : 0;
    
    let productivityTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentCompletionRate > completionRate + 10) productivityTrend = 'up';
    else if (recentCompletionRate < completionRate - 10) productivityTrend = 'down';

    return {
      completionRate,
      averageCompletionTime,
      productivityTrend,
      weeklyStats,
      monthlyStats,
      categoryBreakdown,
      upcomingDeadlines,
    };
  }

  private static categorizeTasks(tasks: Task[]): Record<string, number> {
    const categories: Record<string, number> = {
      'Académico': 0,
      'Reuniones': 0,
      'Eventos': 0,
      'Administrativo': 0,
      'Otros': 0,
    };

    tasks.forEach(task => {
      const title = task.title.toLowerCase();
      const description = task.description.toLowerCase();
      const text = `${title} ${description}`;

      if (text.includes('clase') || text.includes('examen') || text.includes('estudio') || text.includes('tarea')) {
        categories['Académico']++;
      } else if (text.includes('reunión') || text.includes('junta') || text.includes('meeting')) {
        categories['Reuniones']++;
      } else if (text.includes('evento') || text.includes('actividad') || text.includes('celebración')) {
        categories['Eventos']++;
      } else if (text.includes('documento') || text.includes('trámite') || text.includes('gestión')) {
        categories['Administrativo']++;
      } else {
        categories['Otros']++;
      }
    });

    return categories;
  }
}