import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task, CalendarEvent } from '../types';
import { Calendar, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CalendarParser } from '../utils/calendarParser';
import toast from 'react-hot-toast';

interface CalendarViewProps {
  tasks: Task[];
  calendarUrl: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, calendarUrl }) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [externalEvents, setExternalEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const convertTasksToEvents = (tasks: Task[]): CalendarEvent[] => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.startDate,
      end: task.endDate,
      backgroundColor: task.status === 'completed' ? '#10B981' : '#3B82F6',
      borderColor: task.status === 'completed' ? '#10B981' : '#3B82F6',
      extendedProps: {
        description: task.description,
        status: task.status,
        isTask: true,
      },
    }));
  };

  const syncCalendar = async () => {
    if (!calendarUrl) {
      toast.error('No hay URL de calendario configurada');
      return;
    }
    
    setLoading(true);
    setSyncError(null);
    
    try {
      const events = await CalendarParser.parseICSFromUrl(calendarUrl);
      setExternalEvents(events);
      setLastSync(new Date());
      toast.success(`Calendario sincronizado: ${events.length} eventos cargados`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setSyncError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const taskEvents = convertTasksToEvents(tasks);
    setCalendarEvents([...taskEvents, ...externalEvents]);
  }, [tasks, externalEvents]);

  useEffect(() => {
    if (calendarUrl) {
      syncCalendar();
    }
  }, [calendarUrl]);

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const isTask = event.extendedProps?.isTask;
    
    if (isTask) {
      const task = tasks.find(t => t.id === event.id);
      if (task) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <Clock className="h-6 w-6 text-blue-400" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {task.description || 'Sin descripción'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Estado: {task.status === 'completed' ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        ), { duration: 5000 });
      }
    } else {
      const extProps = event.extendedProps;
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {event.title}
                </p>
                {extProps?.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {extProps.description}
                  </p>
                )}
                {extProps?.location && (
                  <p className="mt-1 text-xs text-gray-400">
                    📍 {extProps.location}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Evento del calendario externo
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario Integrado</h1>
          <p className="text-gray-600 mt-2">
            Vista completa de tus tareas y eventos sincronizados
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastSync && (
            <span className="text-sm text-gray-500">
              Última sincronización: {lastSync.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={syncCalendar}
            disabled={loading || !calendarUrl}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-blue-400"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* Sync Status */}
      {syncError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error de sincronización</h3>
              <p className="text-sm text-red-700 mt-1">{syncError}</p>
            </div>
          </div>
        </div>
      )}

      {!calendarUrl && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-yellow-500" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Calendario no configurado</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Ve a Configuración para agregar la URL de tu calendario .ics
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Resumen del Calendario</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-sm text-gray-600">Tareas Totales</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {externalEvents.length}
            </div>
            <div className="text-sm text-gray-600">Eventos Externos</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {calendarEvents.length}
            </div>
            <div className="text-sm text-gray-600">Total Eventos</div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día'
            }}
            dayHeaderFormat={{ weekday: 'long' }}
            eventDisplay="block"
            displayEventTime={true}
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leyenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Tareas Pendientes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Tareas Completadas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Exámenes/Pruebas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Reuniones</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;