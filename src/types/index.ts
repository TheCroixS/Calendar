export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    description?: string;
    status?: string;
  };
}

export interface AppSettings {
  calendarUrl: string;
  isFirstRun: boolean;
  userName?: string;
}