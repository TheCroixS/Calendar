import React, { useState } from 'react';
import { Calendar, User, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { AppSettings } from '../types';
import { CalendarParser } from '../utils/calendarParser';
import toast from 'react-hot-toast';

interface WelcomeSetupProps {
  onComplete: (settings: AppSettings) => void;
}

const WelcomeSetup: React.FC<WelcomeSetupProps> = ({ onComplete }) => {
  const [userName, setUserName] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingCalendar, setValidatingCalendar] = useState(false);
  const [calendarValid, setCalendarValid] = useState<boolean | null>(null);

  const validateCalendar = async () => {
    if (!calendarUrl) return;
    
    setValidatingCalendar(true);
    try {
      const isValid = await CalendarParser.validateCalendarUrl(calendarUrl);
      setCalendarValid(isValid);
      if (isValid) {
        toast.success('Calendario validado correctamente');
      } else {
        toast.error('No se pudo validar el calendario');
      }
    } catch (error) {
      setCalendarValid(false);
      toast.error('Error al validar el calendario');
    } finally {
      setValidatingCalendar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar calendario si se proporcionó
      if (calendarUrl && calendarValid === null) {
        await validateCalendar();
      }

      const settings: AppSettings = {
        userName,
        calendarUrl,
        isFirstRun: false
      };

      onComplete(settings);
      toast.success('¡Configuración completada!');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-900 rounded-xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
            {/* Logo CEE estilizado */}
            <div className="relative">
              {/* Tronco */}
              <div className="w-1.5 h-4 bg-yellow-400 mx-auto"></div>
              {/* Hojas superiores */}
              <div className="absolute -top-3 -left-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full transform rotate-45"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full ml-1 -mt-1"></div>
              </div>
              <div className="absolute -top-3 -right-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full transform -rotate-45"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 -mt-1"></div>
              </div>
              {/* Raíces */}
              <div className="absolute -bottom-1 left-0 w-4 h-0.5 bg-yellow-400 transform rotate-12"></div>
              <div className="absolute -bottom-1 right-0 w-4 h-0.5 bg-yellow-400 transform -rotate-12"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido al CEE!
          </h1>
          <p className="text-gray-600">
            Configura tu gestor de tareas del Centro de Estudiantes de Ingeniería Comercial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del usuario */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2" />
              Tu nombre completo
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ej: Juan Pérez González"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* URL del calendario */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="mr-2" />
              Enlace de tu calendario (.ics)
            </label>
            <div className="relative">
              <input
                type="url"
                value={calendarUrl}
                onChange={(e) => {
                  setCalendarUrl(e.target.value);
                  setCalendarValid(null);
                }}
                placeholder="https://outlook.office365.com/owa/calendar/..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {calendarUrl && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {calendarValid === true && <CheckCircle size={20} className="text-green-500" />}
                  {calendarValid === false && <AlertCircle size={20} className="text-red-500" />}
                </div>
              )}
            </div>
            
            {calendarUrl && (
              <button
                type="button"
                onClick={validateCalendar}
                disabled={validatingCalendar}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-blue-400"
              >
                {validatingCalendar ? 'Validando...' : 'Validar calendario'}
              </button>
            )}

            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <ExternalLink size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">¿Cómo obtener tu enlace de calendario?</p>
                  <p className="mb-2">Para Outlook/Office 365:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Ve a tu calendario en Outlook Web</li>
                    <li>Clic en "Configuración" → "Ver toda la configuración de Outlook"</li>
                    <li>Ve a "Calendario" → "Calendarios compartidos"</li>
                    <li>Copia el enlace ICS de tu calendario</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (calendarUrl && calendarValid === false)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-colors font-medium"
          >
            {loading ? 'Configurando...' : 'Comenzar a usar la aplicación'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
          <p className="font-medium">Universidad Gabriela Mistral</p>
          <p>Centro de Estudiantes Ingeniería Comercial</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSetup;