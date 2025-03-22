declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: {
        level: string;
        score: string;
        progress: string;
        wordHints: string;
        bonusWords: string;
        noBonusWords: string;
        showDefinitions: string;
        typeGuess: string;
        levelCompletePlaceholder: string;
        submit: string;
        cancel: string;
        save: string;
        backToGame: string;
        adminAccess: string;
        password: string;
        invalidPassword: string;
        login: string;
        levelAdministration: string;
        validateLevels: string;
        addLevel: string;
        editLevel: string;
        addNewLevel: string;
        subWords: string;
        subWordsHint: string;
        actions: string;
        baseWord: string;
        totalWords: string;
        validWords: string;
        invalidWords: string;
        duplicateWords: string;
        notRealWords: string;
        wordStatusValid: string;
        wordStatusInvalid: string;
        wordStatusDuplicate: string;
        wordStatusNotReal: string;
        levelValidation: string;
        english: string;
        russian: string;
      }
    }
  }
}

declare module './i18n' {
  import i18next from 'i18next';
  export default i18next;
} 