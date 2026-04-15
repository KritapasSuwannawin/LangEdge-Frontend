import { type Locator, type Page } from '@playwright/test';

export class LangEdgePage {
  constructor(private readonly page: Page) {}

  get appBootstrapSpinner(): Locator {
    return this.page.getByTestId('app-bootstrap-spinner');
  }

  get inputTextarea(): Locator {
    return this.page.getByTestId('translate-input-textarea');
  }

  get languageSelectorBackButton(): Locator {
    return this.page.getByTestId('language-selector-back-button');
  }

  get languageSelectorEmptyState(): Locator {
    return this.page.getByTestId('language-selector-empty-state');
  }

  get languageSelectorSearchInput(): Locator {
    return this.page.getByTestId('language-selector-search-input');
  }

  get navigationSignInButton(): Locator {
    return this.page.getByTestId('nav-sign-in-button');
  }

  get outputLanguageButton(): Locator {
    return this.page.getByTestId('translate-output-language-button');
  }

  get outputTextarea(): Locator {
    return this.page.getByTestId('translate-output-textarea');
  }

  get pageLoadingSpinner(): Locator {
    return this.page.getByTestId('translate-page-loading-spinner');
  }

  get profileDetails(): Locator {
    return this.page.getByTestId('nav-profile-details');
  }

  get profileSignOutButton(): Locator {
    return this.page.getByTestId('nav-sign-out-button');
  }

  get profileToggle(): Locator {
    return this.page.getByTestId('nav-profile-toggle');
  }

  get translateSubmitButton(): Locator {
    return this.page.getByTestId('translate-submit-button');
  }

  get workspaceSignInButton(): Locator {
    return this.page.getByTestId('translate-sign-in-button');
  }

  getHeading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }

  getInputSynonymButton(index: number): Locator {
    return this.page.getByTestId(`translate-inputSynonym-synonym-button-${index}`);
  }

  getLanguageOption(languageId: number): Locator {
    return this.page.getByTestId(`language-selector-option-${languageId}`);
  }

  getToast(message: string): Locator {
    return this.page.getByText(message, { exact: true });
  }

  getTranslationSynonymButton(index: number): Locator {
    return this.page.getByTestId(`translate-translationSynonym-synonym-button-${index}`);
  }

  async clickInputSynonym(index: number): Promise<void> {
    await this.getInputSynonymButton(index).click();
  }

  async clickTranslationSynonym(index: number): Promise<void> {
    await this.getTranslationSynonymButton(index).click();
  }

  async fillInputText(value: string): Promise<void> {
    await this.inputTextarea.fill(value);
  }

  async goto(): Promise<void> {
    await this.page.goto('/translate');
  }

  async openLanguageSelector(): Promise<void> {
    await this.outputLanguageButton.click();
  }

  async openProfile(): Promise<void> {
    await this.profileToggle.click();
  }

  async searchLanguages(query: string): Promise<void> {
    await this.languageSelectorSearchInput.fill(query);
  }

  async selectLanguage(languageId: number): Promise<void> {
    await this.getLanguageOption(languageId).click();
  }

  async signInFromNavigation(): Promise<void> {
    await this.navigationSignInButton.click();
  }

  async signInFromWorkspace(): Promise<void> {
    await this.workspaceSignInButton.click();
  }

  async signOut(): Promise<void> {
    await this.profileSignOutButton.click();
  }

  async submitTranslation(): Promise<void> {
    await this.translateSubmitButton.click();
  }
}
