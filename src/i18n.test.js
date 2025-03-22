import i18n from './i18n';

describe('i18n configuration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset i18n instance
    i18n.changeLanguage('en');
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  test('should initialize with default language (en)', () => {
    expect(i18n.language).toBe('en');
  });

  test('should save language preference to localStorage when changed', () => {
    i18n.changeLanguage('ru');
    expect(localStorage.getItem('i18nextLng')).toBe('ru');
  });

  test('should load language preference from localStorage on initialization', () => {
    // Set a language preference in localStorage
    localStorage.setItem('i18nextLng', 'ru');
    
    // Reinitialize i18n
    i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'cookie', 'path'],
        caches: ['localStorage', 'cookie'],
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('ru');
  });

  test('should fall back to browser language when no localStorage preference', () => {
    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      value: 'ru',
      configurable: true
    });

    // Reinitialize i18n
    i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'cookie', 'path'],
        caches: ['localStorage', 'cookie'],
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('ru');
  });

  test('should fall back to default language when no preferences found', () => {
    // Reinitialize i18n
    i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'cookie', 'path'],
        caches: ['localStorage', 'cookie'],
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('en');
  });

  test('should handle invalid language codes gracefully', () => {
    localStorage.setItem('i18nextLng', 'invalid');
    
    // Reinitialize i18n
    i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'cookie', 'path'],
        caches: ['localStorage', 'cookie'],
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('en');
  });
}); 