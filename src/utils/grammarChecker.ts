// Simulación de corrección gramatical
// En una aplicación real, esto se conectaría con LanguageTool API
export const grammarChecker = {
  correctText: async (text: string): Promise<string> => {
    // Simulación de correcciones comunes en español
    const corrections: Record<string, string> = {
      'aser': 'hacer',
      'haber': 'a ver',
      'echo': 'hecho',
      'halla': 'halla',
      'aya': 'haya',
      'tubo': 'tuvo',
      'balla': 'vaya',
      'valla': 'vaya',
      'aver': 'a ver',
      'asido': 'ha sido'
    };

    let correctedText = text;
    
    // Aplicar correcciones básicas
    Object.entries(corrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      correctedText = correctedText.replace(regex, correct);
    });

    // Simular un pequeño delay como si fuera una API real
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return correctedText;
  },

  hasCorrections: (original: string, corrected: string): boolean => {
    return original !== corrected;
  }
};