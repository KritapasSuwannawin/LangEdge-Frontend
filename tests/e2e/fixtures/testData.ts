export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface MockLanguage {
  readonly id: number;
  readonly name: string;
  readonly code: string;
}

export interface MockUser {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly pictureUrl: string;
  readonly lastUsedLanguageId?: number;
}

export interface MockTranslation {
  readonly originalLanguageName: string;
  readonly inputTextSynonymArr?: string[];
  readonly translation: string;
  readonly translationSynonymArr?: string[];
  readonly exampleSentenceArr?: ReadonlyArray<{
    readonly sentence: string;
    readonly translation: string;
  }>;
}

const PROFILE_PICTURE_URL =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%230f766e%22/%3E%3C/svg%3E';

export const DEFAULT_AUTH_TOKENS: AuthTokens = {
  accessToken: 'e2e-access-token',
  refreshToken: 'e2e-refresh-token',
};

export const DEFAULT_LANGUAGES: MockLanguage[] = [
  { id: 1, name: 'English', code: 'en' },
  { id: 2, name: 'German', code: 'de' },
  { id: 3, name: 'Spanish', code: 'es' },
];

export const RESTORED_USER: MockUser = {
  userId: 'user-restored',
  email: 'restored@langedge.test',
  name: 'Restored User',
  pictureUrl: PROFILE_PICTURE_URL,
  lastUsedLanguageId: 2,
};

export const MANUAL_SIGN_IN_USER: MockUser = {
  userId: 'user-manual',
  email: 'manual@langedge.test',
  name: 'Manual User',
  pictureUrl: PROFILE_PICTURE_URL,
  lastUsedLanguageId: 1,
};

export const INITIAL_TRANSLATION: MockTranslation = {
  originalLanguageName: 'Spanish',
  inputTextSynonymArr: ['kitty'],
  translation: 'cat',
  translationSynonymArr: ['feline'],
  exampleSentenceArr: [{ sentence: 'El gato duerme.', translation: 'The cat is sleeping.' }],
};

export const INPUT_SYNONYM_TRANSLATION: MockTranslation = {
  originalLanguageName: 'Spanish',
  inputTextSynonymArr: ['kitten'],
  translation: 'kitty',
  translationSynonymArr: ['young cat'],
  exampleSentenceArr: [{ sentence: 'La kitty juega.', translation: 'The kitty is playing.' }],
};

export const MORE_TRANSLATION_RESULT: MockTranslation = {
  originalLanguageName: 'English',
  inputTextSynonymArr: ['cat'],
  translation: 'felino',
  translationSynonymArr: ['gato'],
  exampleSentenceArr: [{ sentence: 'The feline ran.', translation: 'El felino corrio.' }],
};
