import ICAL from 'ical.js';
import { CalendarEvent } from '../types';

export class CalendarParser {
  static async parseICSFromUrl(url: string): Promise<CalendarEvent[]> {
    try {
      console.log('Obteniendo calendario de:', url);
      
      // Usar CORS Anywhere como proxy
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      console.log('Usando proxy CORS:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'text/calendar, text/plain, */*',
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest' // Algunos proxies lo requieren
        }
      });

      console.log('Respuesta recibida. Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', errorText);
        throw new Error(`Error al obtener el calendario: ${response.status} - ${response.statusText}`);
      }
      
      const icsData = await response.text();
      console.log('Datos recibidos (primeros 200 caracteres):', icsData.substring(0, 200));
      
      // Verificar si los datos parecen ser un archivo iCalendar
      if (!icsData.includes('BEGIN:VCALENDAR') || !icsData.includes('VEVENT')) {
        console.error('Formato de calendario inválido. Contenido recibido:', icsData.substring(0, 500));
        throw new Error('El archivo no parece ser un calendario iCalendar (ICS) válido');
      }
      
      // Guardar en localStorage para depuración
      localStorage.setItem('lastCalendarResponse', icsData);
      return this.parseICSData(icsData);
    } catch (error) {
      console.error('Error parsing calendar:', error);
      throw new Error('No se pudo sincronizar el calendario. Verifica la URL.');
    }
  }

  static parseICSData(icsData: string): CalendarEvent[] {
    try {
      const jcalData = ICAL.parse(icsData);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      return vevents.map((vevent, index) => {
        const event = new ICAL.Event(vevent);
        
        return {
          id: `cal-${index}-${Date.now()}`,
          title: event.summary || 'Sin título',
          start: event.startDate.toJSDate().toISOString(),
          end: event.endDate ? event.endDate.toJSDate().toISOString() : undefined,
          backgroundColor: this.getEventColor(event.summary || ''),
          borderColor: this.getEventColor(event.summary || ''),
          extendedProps: {
            description: event.description || '',
            location: event.location || '',
            isExternal: true,
            organizer: event.organizer || '',
          },
        };
      });
    } catch (error) {
      console.error('Error parsing ICS data:', error);
      throw new Error('Formato de calendario inválido');
    }
  }

  private static getEventColor(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('clase') || titleLower.includes('cátedra')) {
      return '#3B82F6'; // Azul para clases
    }
    if (titleLower.includes('examen') || titleLower.includes('prueba')) {
      return '#EF4444'; // Rojo para exámenes
    }
    if (titleLower.includes('reunión') || titleLower.includes('meeting')) {
      return '#F59E0B'; // Amarillo para reuniones
    }
    if (titleLower.includes('taller') || titleLower.includes('laboratorio')) {
      return '#10B981'; // Verde para talleres
    }
    if (titleLower.includes('entrega') || titleLower.includes('deadline')) {
      return '#8B5CF6'; // Púrpura para entregas
    }
    
    return '#6B7280'; // Gris por defecto
  }

  static async validateCalendarUrl(url: string): Promise<boolean> {
    try {
      const events = await this.parseICSFromUrl(url);
      return events.length >= 0; // Válido incluso si está vacío
    } catch {
      return false;
    }
  }
}