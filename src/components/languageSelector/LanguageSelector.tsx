import { useState, useEffect, useRef, forwardRef, ForwardedRef } from 'react';
import { Language } from '../../interfaces';

import './LanguageSelector.scss';

interface LanguageSelectorProps {
  isOpen: boolean;
  languageArr: Language[];
  selectedLanguage: Language;
  languageSelectHandler: (language: Language) => void;
}

function LanguageSelector(props: LanguageSelectorProps, ref: ForwardedRef<HTMLDivElement>) {
  const { isOpen, languageArr, selectedLanguage, languageSelectHandler } = props;
  const [searchQuery, setSearchQuery] = useState('');

  const searchQueryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchQueryRef.current?.focus();
  }, [isOpen]);

  function searchQueryChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value.trim());
  }

  // Filter languages based on search query & Sort them based on whether they start with the search query
  const filteredLanguages = languageArr
    .filter((language) => language.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());

      if (aStartsWith && !bStartsWith) {
        return -1;
      }

      if (!aStartsWith && bStartsWith) {
        return 1;
      }

      return 0;
    });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="language-selector" ref={ref}>
      <input
        ref={searchQueryRef}
        className="language-selector__search-query"
        type="text"
        placeholder="Search languages"
        value={searchQuery}
        onChange={searchQueryChangeHandler}
      />

      <div className={`language-selector__item-container ${searchQuery.length > 0 ? 'search-active' : ''}`}>
        {filteredLanguages.map((language) => (
          <div
            key={language.id}
            className={`item ${selectedLanguage.name === language.name ? 'selected' : ''}`}
            onClick={languageSelectHandler.bind(null, language)}
          >
            <label>{language.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default forwardRef(LanguageSelector);
