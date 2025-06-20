import { Task, AppSettings } from '../types';

const TASKS_KEY = 'cee_tasks';
const SETTINGS_KEY = 'cee_settings';

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  addTask: (task: Task): void => {
    const tasks = storage.getTasks();
    tasks.push(task);
    storage.saveTasks(tasks);
  },

  updateTask: (updatedTask: Task): void => {
    const tasks = storage.getTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      storage.saveTasks(tasks);
    }
  },

  deleteTask: (taskId: string): void => {
    const tasks = storage.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    storage.saveTasks(filteredTasks);
  },

  // Settings
  getSettings: (): AppSettings => {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { isFirstRun: true, calendarUrl: '' };
  },

  saveSettings: (settings: AppSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};