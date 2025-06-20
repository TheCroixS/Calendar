import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import WelcomeSetup from './components/WelcomeSetup';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { Task, AppSettings } from './types';
import { storage } from './utils/storage';
import { NotificationManager } from './utils/notifications';

// Definir las props del componente
interface AppProps {
  isElectron?: boolean;
}

function App({ isElectron = false }: AppProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Configuración específica para Electron
  useEffect(() => {
    if (isElectron) {
      console.log('Ejecutando en entorno Electron');
      // Aquí puedes agregar lógica específica para Electron
    }
  }, [isElectron]);

  // Load settings and tasks from localStorage
    const savedSettings = storage.getSettings();
    const savedTasks = storage.getTasks();
    
    setSettings(savedSettings);
    setTasks(savedTasks);

    // Request notification permission and start periodic checks
    if (!savedSettings.isFirstRun) {
      const notificationManager = NotificationManager.getInstance();
      notificationManager.requestPermission().then(() => {
        notificationManager.startPeriodicCheck(savedTasks);
      });
    }
  }, []);

  const handleSetupComplete = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
    
    // Initialize notifications after setup
    const notificationManager = NotificationManager.getInstance();
    notificationManager.requestPermission();
  };

  const handleSettingsUpdate = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
    storage.addTask(task);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    storage.updateTask(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    storage.deleteTask(taskId);
  };

  const handleTasksImport = (importedTasks: Task[]) => {
    const allTasks = [...tasks, ...importedTasks];
    // Remove duplicates based on ID
    const uniqueTasks = allTasks.filter((task, index, self) => 
      self.findIndex(t => t.id === task.id) === index
    );
    setTasks(uniqueTasks);
    storage.saveTasks(uniqueTasks);
  };

  // Show welcome setup on first run
  if (!settings || settings.isFirstRun) {
    return (
      <>
        <WelcomeSetup onComplete={handleSetupComplete} />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} onViewChange={setCurrentView} />;
      case 'tasks':
        return (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'calendar':
        return <CalendarView tasks={tasks} calendarUrl={settings.calendarUrl} />;
      case 'analytics':
        return <Analytics tasks={tasks} />;
      case 'settings':
        return (
          <Settings
            settings={settings}
            tasks={tasks}
            onSettingsUpdate={handleSettingsUpdate}
            onTasksImport={handleTasksImport}
          />
        );
      default:
        return <Dashboard tasks={tasks} onViewChange={setCurrentView} />;
    }
  };

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;