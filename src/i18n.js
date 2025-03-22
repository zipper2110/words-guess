import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "login": "Log In",
      "signup": "Sign Up",
      "dashboard": "Dashboard",
      "settings": "Settings",
      "logout": "Log Out",
      "language": "Language",
      "resetGame": "Reset Game",
      "admin": "Admin",
      "resetGameConfirm": "This will reset your progress to Level 1 and clear your score. Are you sure?",
      "cancel": "Cancel",
      "levelComplete": "🎉 Level Complete! 🎉",
      "levelCompleteMessage": "Great job! Ready for the next challenge?",
      "nextLevel": "Next Level",
      "howToPlay": "How to Play",
      "helpIntro": "Welcome to Word Game! Create as many words as you can using letters from the main word.",
      "helpRule1": "Form words using the letters from the base word",
      "helpRule2": "Each word must be at least 3 letters long",
      "helpRule3": "You can use each letter only once per word",
      "helpRule4": "All words must be valid English words",
      "helpRule5": "Score points based on the length of each word you find",
      "helpRule6": "Find all possible words to complete the level",
      "helpRule7": "Need help? Use the menu to get a clue for an unfound word",
      "level": "Level",
      "score": "Score",
      "progress": "Progress",
      "wordHints": "Word Hints",
      "bonusWords": "Bonus Words",
      "noBonusWords": "No bonus words found yet",
      "showDefinitions": "Show Definitions",
      "typeGuess": "Type your guess...",
      "levelCompletePlaceholder": "Level Complete!",
      "submit": "Submit"
      // Add more translations as needed
    }
  },
  ru: {
    translation: {
      "welcome": "Добро пожаловать",
      "login": "Войти",
      "signup": "Зарегистрироваться",
      "dashboard": "Панель управления",
      "settings": "Настройки",
      "logout": "Выйти",
      "language": "Язык",
      "resetGame": "Сбросить игру",
      "admin": "Админ",
      "resetGameConfirm": "Это сбросит ваш прогресс до уровня 1 и очистит счет. Вы уверены?",
      "cancel": "Отмена",
      "levelComplete": "🎉 Уровень пройден! 🎉",
      "levelCompleteMessage": "Отличная работа! Готовы к следующему испытанию?",
      "nextLevel": "Следующий уровень",
      "howToPlay": "Как играть",
      "helpIntro": "Добро пожаловать в Word Game! Создавайте как можно больше слов, используя буквы из основного слова.",
      "helpRule1": "Составляйте слова из букв основного слова",
      "helpRule2": "Каждое слово должно содержать минимум 3 буквы",
      "helpRule3": "Каждую букву можно использовать только один раз в слове",
      "helpRule4": "Все слова должны быть правильными английскими словами",
      "helpRule5": "Набирайте очки в зависимости от длины найденных слов",
      "helpRule6": "Найдите все возможные слова для завершения уровня",
      "helpRule7": "Нужна помощь? Используйте меню, чтобы получить подсказку для ненайденного слова",
      "level": "Уровень",
      "score": "Счет",
      "progress": "Прогресс",
      "wordHints": "Подсказки слов",
      "bonusWords": "Бонусные слова",
      "noBonusWords": "Бонусных слов пока не найдено",
      "showDefinitions": "Показать определения",
      "typeGuess": "Введите ваше слово...",
      "levelCompletePlaceholder": "Уровень пройден!",
      "submit": "Отправить"
      // Add more translations as needed
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['navigator', 'htmlTag', 'cookie', 'localStorage', 'path'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n; 