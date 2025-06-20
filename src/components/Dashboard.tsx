import React from 'react';
import { CheckSquare, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardProps {
  tasks: Task[];
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onViewChange }) => {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const todayTasks = tasks.filter(task => isToday(new Date(task.startDate)));
  const tomorrowTasks = tasks.filter(task => isTomorrow(new Date(task.startDate)));
  const weekTasks = tasks.filter(task => isThisWeek(new Date(task.startDate)));

  const getTaskPriority = (task: Task) => {
    const today = new Date();
    const taskDate = new Date(task.startDate);
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays <= 7) return 'week';
    return 'later';
  };

  const urgentTasks = tasks.filter(task => 
    task.status === 'pending' && ['overdue', 'today', 'tomorrow'].includes(getTaskPriority(task))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
        <p className="text-gray-600 mt-2">
          Resumen de tus tareas y actividades del Centro de Estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
              <p className="text-3xl font-bold text-blue-600">{pendingTasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Para Hoy</p>
              <p className="text-3xl font-bold text-orange-600">{todayTasks.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-3xl font-bold text-purple-600">{weekTasks.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">Tareas Urgentes</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {urgentTasks.slice(0, 5).map((task) => {
                const priority = getTaskPriority(task);
                const priorityColors = {
                  overdue: 'bg-red-100 text-red-800 border-red-200',
                  today: 'bg-orange-100 text-orange-800 border-orange-200',
                  tomorrow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
                };

                return (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(task.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[priority as keyof typeof priorityColors]}`}>
                      {priority === 'overdue' && 'Atrasada'}
                      {priority === 'today' && 'Hoy'}
                      {priority === 'tomorrow' && 'Mañana'}
                    </div>
                  </div>
                );
              })}
            </div>
            {urgentTasks.length > 5 && (
              <button
                onClick={() => onViewChange('tasks')}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todas las tareas urgentes ({urgentTasks.length - 5} más)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onViewChange('tasks')}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Nueva Tarea</p>
            <p className="text-sm text-gray-600">Agregar nueva actividad</p>
          </button>

          <button
            onClick={() => onViewChange('calendar')}
            className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Ver Calendario</p>
            <p className="text-sm text-gray-600">Revisar agenda completa</p>
          </button>

          <button
            onClick={() => onViewChange('settings')}
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <AlertCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Configuración</p>
            <p className="text-sm text-gray-600">Ajustar preferencias</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;