import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import i18n from '../i18n';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers as any)

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Initialize i18next for tests
i18n.init({
  resources: {
    en: {
      translation: {
        // Add minimal translations needed for tests
        level: 'Level',
        score: 'Score',
        progress: 'Progress',
        wordHints: 'Word Hints',
        bonusWords: 'Bonus Words',
        noBonusWords: 'No bonus words found yet',
        showDefinitions: 'Show Definitions',
        typeGuess: 'Type your guess...',
        levelCompletePlaceholder: 'Level Complete!',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        backToGame: 'Back to Game',
        adminAccess: 'Admin Access',
        password: 'Password',
        invalidPassword: 'Invalid password',
        login: 'Login',
        levelAdministration: 'Level Administration',
        validateLevels: 'Validate Levels',
        addLevel: 'Add Level',
        editLevel: 'Edit Level',
        addNewLevel: 'Add New Level',
        subWords: 'Sub Words',
        subWordsHint: 'Enter words separated by commas',
        actions: 'Actions',
        baseWord: 'Base Word',
        totalWords: 'Total Words',
        validWords: 'Valid Words',
        invalidWords: 'Invalid Words',
        duplicateWords: 'Duplicate Words',
        notRealWords: 'Not Real Words',
        wordStatusValid: 'Valid',
        wordStatusInvalid: 'Invalid',
        wordStatusDuplicate: 'Duplicate',
        wordStatusNotReal: 'Not a real word',
        levelValidation: 'Level Validation',
        english: '🇺🇸 English',
        russian: '🇷🇺 Русский'
      }
    },
    ru: {
      translation: {
        // Add minimal translations needed for tests
        level: 'Уровень',
        score: 'Счет',
        progress: 'Прогресс',
        wordHints: 'Подсказки слов',
        bonusWords: 'Бонусные слова',
        noBonusWords: 'Бонусных слов пока не найдено',
        showDefinitions: 'Показать определения',
        typeGuess: 'Введите ваше слово...',
        levelCompletePlaceholder: 'Уровень пройден!',
        submit: 'Отправить',
        cancel: 'Отмена',
        save: 'Сохранить',
        backToGame: 'Вернуться к игре',
        adminAccess: 'Доступ администратора',
        password: 'Пароль',
        invalidPassword: 'Неверный пароль',
        login: 'Войти',
        levelAdministration: 'Управление уровнями',
        validateLevels: 'Проверить уровни',
        addLevel: 'Добавить уровень',
        editLevel: 'Редактировать уровень',
        addNewLevel: 'Добавить новый уровень',
        subWords: 'Подслова',
        subWordsHint: 'Введите слова через запятую',
        actions: 'Действия',
        baseWord: 'Базовое слово',
        totalWords: 'Всего слов',
        validWords: 'Валидные слова',
        invalidWords: 'Невалидные слова',
        duplicateWords: 'Дубликаты',
        notRealWords: 'Несуществующие слова',
        wordStatusValid: 'Валидное',
        wordStatusInvalid: 'Невалидное',
        wordStatusDuplicate: 'Дубликат',
        wordStatusNotReal: 'Несуществующее слово',
        levelValidation: 'Проверка уровня',
        english: '🇺🇸 English',
        russian: '🇷🇺 Русский'
      }
    }
  },
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