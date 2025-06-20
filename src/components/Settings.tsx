import React, { useState } from 'react';
import { Settings as SettingsIcon, Calendar, User, Download, Upload, RefreshCw } from 'lucide-react';
import { AppSettings, Task } from '../types';

interface SettingsProps {
  settings: AppSettings;
  tasks: Task[];
  onSettingsUpdate: (settings: AppSettings) => void;
  onTasksImport: (tasks: Task[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  settings, 
  tasks,
  onSettingsUpdate, 
  onTasksImport 
}) => {
  const [formData, setFormData] = useState({
    userName: settings.userName || '',
    calendarUrl: settings.calendarUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsUpdate({
      ...settings,
      ...formData,
    });
    alert('Configuración guardada correctamente');
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cee-tareas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTasksCSV = () => {
    const headers = ['Título', 'Descripción', 'Fecha Inicio', 'Fecha Término', 'Estado', 'Creado', 'Actualizado'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${task.description.replace(/"/g, '""')}"`,
        task.startDate,
        task.endDate,
        task.status === 'completed' ? 'Completada' : 'Pendiente',
        task.createdAt,
        task.updatedAt,
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cee-tareas-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedTasks)) {
          const validTasks = importedTasks.filter(task => 
            task.id && task.title && task.startDate && task.endDate
          );
          onTasksImport(validTasks);
          alert(`${validTasks.length} tareas importadas correctamente`);
        }
      } catch (error) {
        alert('Error al importar el archivo. Asegúrate de que sea un archivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Gestiona las preferencias y configuración de la aplicación
        </p>
      </div>

      {/* Personal Settings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <User size={20} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
              placeholder="Tu nombre completo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="calendarUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL del calendario (.ics)
            </label>
            <input
              type="url"
              id="calendarUrl"
              value={formData.calendarUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, calendarUrl: e.target.value }))}
              placeholder="https://outlook.office365.com/owa/calendar/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Sincroniza tu calendario de Outlook, Google Calendar u otro servicio compatible
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Configuración
          </button>
        </form>
      </div>

      {/* Calendar Settings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Configuración del Calendario</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Estado de Sincronización</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${settings.calendarUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {settings.calendarUrl ? 'Conectado' : 'No configurado'}
                </span>
              </div>
              {settings.calendarUrl && (
                <p className="text-xs text-gray-500 mt-2">
                  Última sincronización: Hace unos minutos
                </p>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Estadísticas</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Total de tareas: {tasks.length}</div>
                <div>Tareas completadas: {tasks.filter(t => t.status === 'completed').length}</div>
                <div>Tareas pendientes: {tasks.filter(t => t.status === 'pending').length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={20} className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Datos</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Exportar Datos</h3>
              <div className="space-y-2">
                <button
                  onClick={exportTasks}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Download size={16} />
                  <span>Exportar como JSON</span>
                </button>
                <button
                  onClick={exportTasksCSV}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Download size={16} />
                  <span>Exportar como CSV</span>
                </button>
              </div>
            </div>

            {/* Import */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Importar Datos</h3>
              <div className="space-y-2">
                <label className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload size={16} />
                  <span>Importar archivo JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Solo archivos JSON exportados desde esta aplicación
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-medium text-gray-900 mb-4">Información de la Aplicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Desarrollado para:</strong> Centro de Estudiantes Ingeniería Comercial</p>
            <p><strong>Universidad:</strong> Gabriela Mistral</p>
          </div>
          <div>
            <p><strong>Última actualización:</strong> Diciembre 2024</p>
            <p><strong>Soporte:</strong> Contactar al equipo de desarrollo</p>
            <p><strong>Licencia:</strong> Uso interno CEE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;