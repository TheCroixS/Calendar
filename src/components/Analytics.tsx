import React, { useMemo } from 'react';
import { Task } from '../types';
import { AnalyticsEngine, TaskAnalytics } from '../utils/analytics';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  Clock,
  Target,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AnalyticsProps {
  tasks: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  const analytics: TaskAnalytics = useMemo(() => {
    return AnalyticsEngine.generateAnalytics(tasks);
  }, [tasks]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Mejorando';
      case 'down':
        return 'Declinando';
      default:
        return 'Estable';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análisis de Productividad</h1>
        <p className="text-gray-600 mt-2">
          Insights y métricas sobre tu gestión de tareas
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Completitud</p>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.averageCompletionTime.toFixed(1)}d
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tendencia</p>
              <p className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                {getTrendIcon(analytics.productivityTrend)}
                <span>{getTrendText(analytics.productivityTrend)}</span>
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximos Vencimientos</p>
              <p className="text-3xl font-bold text-orange-600">
                {analytics.upcomingDeadlines.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly vs Monthly Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Semanales</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completadas</span>
              <span className="text-lg font-bold text-green-600">
                {analytics.weeklyStats.completed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="text-lg font-bold text-blue-600">
                {analytics.weeklyStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Atrasadas</span>
              <span className="text-lg font-bold text-red-600">
                {analytics.weeklyStats.overdue}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Mensuales</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completadas</span>
              <span className="text-lg font-bold text-green-600">
                {analytics.monthlyStats.completed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="text-lg font-bold text-blue-600">
                {analytics.monthlyStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Atrasadas</span>
              <span className="text-lg font-bold text-red-600">
                {analytics.monthlyStats.overdue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categorías</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {analytics.upcomingDeadlines.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Próximos Vencimientos</h3>
          </div>
          <div className="space-y-3">
            {analytics.upcomingDeadlines.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(task.startDate), "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-orange-600">
                    {Math.ceil((new Date(task.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
        <div className="space-y-3">
          {analytics.completionRate < 70 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                Tu tasa de completitud está por debajo del 70%. Considera dividir tareas grandes en subtareas más manejables.
              </p>
            </div>
          )}
          
          {analytics.weeklyStats.overdue > 0 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                Tienes {analytics.weeklyStats.overdue} tarea(s) atrasada(s) esta semana. Prioriza completarlas pronto.
              </p>
            </div>
          )}
          
          {analytics.upcomingDeadlines.length > 3 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                Tienes muchas tareas próximas a vencer. Considera reorganizar tu agenda para distribuir mejor la carga de trabajo.
              </p>
            </div>
          )}
          
          {analytics.productivityTrend === 'up' && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                ¡Excelente! Tu productividad está mejorando. Mantén el buen ritmo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;