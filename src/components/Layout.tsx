import React from 'react';
import { Calendar, CheckSquare, Settings, Home, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Logo CEE */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Árbol estilizado basado en el logo */}
                  <div className="relative">
                    {/* Tronco */}
                    <div className="w-1 h-3 bg-yellow-400 mx-auto"></div>
                    {/* Hojas */}
                    <div className="absolute -top-2 -left-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full transform rotate-45"></div>
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full ml-1 -mt-1"></div>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full transform -rotate-45"></div>
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1 -mt-1"></div>
                    </div>
                    {/* Raíces */}
                    <div className="absolute -bottom-1 left-0 w-3 h-0.5 bg-yellow-400 transform rotate-12"></div>
                    <div className="absolute -bottom-1 right-0 w-3 h-0.5 bg-yellow-400 transform -rotate-12"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Centro de Estudiantes
                  </h1>
                  <p className="text-xs text-gray-500">Ingeniería Comercial</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Universidad Gabriela Mistral
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home size={18} />
                <span>Panel Principal</span>
              </button>
              
              <button
                onClick={() => onViewChange('tasks')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'tasks'
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CheckSquare size={18} />
                <span>Gestión de Tareas</span>
              </button>

              <button
                onClick={() => onViewChange('calendar')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'calendar'
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar size={18} />
                <span>Calendario</span>
              </button>

              <button
                onClick={() => onViewChange('analytics')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'analytics'
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 size={18} />
                <span>Análisis</span>
              </button>

              <button
                onClick={() => onViewChange('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'settings'
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={18} />
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;