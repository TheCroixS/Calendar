import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { grammarChecker } from '../utils/grammarChecker';
import TaskForm from './TaskForm';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Aplicar corrección gramatical
    const correctedTitle = await grammarChecker.correctText(taskData.title);
    const correctedDescription = await grammarChecker.correctText(taskData.description);

    const task: Task = {
      ...taskData,
      title: correctedTitle,
      description: correctedDescription,
      id: editingTask?.id || crypto.randomUUID(),
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTask) {
      onUpdateTask(task);
    } else {
      onAddTask(task);
    }

    setShowForm(false);
    setEditingTask(null);
  };

  const toggleTaskStatus = (task: Task) => {
    onUpdateTask({
      ...task,
      status: task.status === 'pending' ? 'completed' : 'pending',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      onDeleteTask(taskId);
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-orange-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
          <p className="text-gray-600 mt-2">
            Organiza y gestiona las actividades del Centro de Estudiantes
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pendientes ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completadas ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay tareas {filter === 'all' ? '' : filter === 'pending' ? 'pendientes' : 'completadas'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Crea tu primera tarea para comenzar' : `No tienes tareas ${filter === 'pending' ? 'pendientes' : 'completadas'} por el momento`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${
                task.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="mt-1 flex-shrink-0"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`mt-2 ${
                        task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Inicio: {format(new Date(task.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                      <span>
                        Término: {format(new Date(task.endDate), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar tarea"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar tarea"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <TaskForm
              initialTask={editingTask}
              onSubmit={handleTaskSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;