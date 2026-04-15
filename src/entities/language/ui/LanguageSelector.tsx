import { useState, useEffect, useRef, useId, forwardRef, type ForwardedRef } from 'react';

import ArrowIcon from '@/assets/arrow.svg?react';

import type { Language } from '@/entities/language/model/language';

import './LanguageSelector.scss';

interface LanguageSelectorProps {
  readonly panelId?: string;
  readonly isOpen: boolean;
  readonly languageArr: Language[];
  readonly selectedLanguage: Language;
  readonly languageSelectHandler: (language: Language) => void;
  readonly backButtonClickedHandler: () => void;
}

function LanguageSelector(props: LanguageSelectorProps, ref: ForwardedRef<HTMLDivElement>) {
  const { panelId, isOpen, languageArr, selectedLanguage, languageSelectHandler, backButtonClickedHandler } = props;

  const [searchQuery, setSearchQuery] = useState('');

  const searchQueryRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  useEffect(() => {
    setSearchQuery('');

    if (!isOpen) {
      return;
    }

    searchQueryRef.current?.focus();
  }, [isOpen]);

  function searchQueryChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value.trim());
  }

  if (!isOpen) {
    return null;
  }

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredLanguages = languageArr
    .filter((language) => language.name.toLowerCase().includes(normalizedSearchQuery))
    .sort((firstLanguage, secondLanguage) => {
      const firstStartsWithQuery = firstLanguage.name.toLowerCase().startsWith(normalizedSearchQuery);
      const secondStartsWithQuery = secondLanguage.name.toLowerCase().startsWith(normalizedSearchQuery);

      if (firstStartsWithQuery && !secondStartsWithQuery) {
        return -1;
      }

      if (!firstStartsWithQuery && secondStartsWithQuery) {
        return 1;
      }

      return 0;
    });

  return (
    <div id={panelId} className="language-selector" ref={ref} role="dialog" aria-modal="false" aria-label="Output language selector">
      <div className="language-selector__search-container">
        <button
          type="button"
          aria-label="Close language selector"
          data-testid="language-selector-back-button"
          onClick={backButtonClickedHandler}
        >
          <ArrowIcon aria-hidden="true" />
        </button>

        <div className="language-selector__search-field">
          <input
            id={searchInputId}
            ref={searchQueryRef}
            type="text"
            aria-label="Search languages"
            placeholder="Search languages"
            value={searchQuery}
            onChange={searchQueryChangeHandler}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-testid="language-selector-search-input"
          />
        </div>
      </div>

      <div className={`language-selector__item-container ${searchQuery.length > 0 ? 'search-active' : ''}`}>
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((language) => {
            const isSelectedLanguage = selectedLanguage.name === language.name;

            return (
              <button
                key={language.id}
                type="button"
                className={`item ${isSelectedLanguage ? 'selected' : ''}`}
                aria-pressed={isSelectedLanguage}
                data-testid={`language-selector-option-${language.id}`}
                onClick={() => languageSelectHandler(language)}
              >
                <span>{language.name}</span>
              </button>
            );
          })
        ) : (
          <p className="language-selector__empty-state" role="status" data-testid="language-selector-empty-state">
            No languages found
          </p>
        )}
      </div>
    </div>
  );
}

export default forwardRef(LanguageSelector);
