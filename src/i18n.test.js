import i18n from './i18n';

describe('i18n configuration', () => {
  let originalNavigator;

  beforeEach(() => {
    // Store original navigator
    originalNavigator = global.navigator;
    // Clear localStorage before each test
    localStorage.clear();
    // Reset i18n instance
    i18n.changeLanguage('en');
  });

  afterEach(() => {
    // Restore original navigator
    global.navigator = originalNavigator;
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

  test('should load language preference from localStorage on initialization', async () => {
    // Set a language preference in localStorage
    localStorage.setItem('i18nextLng', 'ru');
    
    // Reinitialize i18n
    await i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['customNavigator', 'localStorage', 'navigator', 'htmlTag', 'path'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('ru');
  });

  test('should fall back to browser language when no localStorage preference', async () => {
    // Mock navigator
    global.navigator = {
      ...originalNavigator,
      language: 'ru',
      languages: ['ru', 'en']
    };

    // Reinitialize i18n
    await i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['customNavigator', 'localStorage', 'navigator', 'htmlTag', 'path'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('ru');
  });

  test('should fall back to default language when no preferences found', async () => {
    // Mock navigator with unsupported language
    global.navigator = {
      ...originalNavigator,
      language: 'fr',
      languages: ['fr']
    };

    // Reinitialize i18n
    await i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['customNavigator', 'localStorage', 'navigator', 'htmlTag', 'path'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('en');
  });

  test('should handle invalid language codes gracefully', async () => {
    localStorage.setItem('i18nextLng', 'invalid');
    
    // Reinitialize i18n
    await i18n.init({
      resources: i18n.options.resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['customNavigator', 'localStorage', 'navigator', 'htmlTag', 'path'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      }
    });

    expect(i18n.language).toBe('en');
  });
}); 