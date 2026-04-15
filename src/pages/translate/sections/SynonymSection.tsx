import { useAppSelector } from '@/app/store/hooks';
import { type Language, selectLanguageArr, selectOutputLanguage } from '@/entities/language';
import { selectOriginalLanguageName, selectInputTextSynonyms, selectTranslationSynonyms } from '@/entities/translation';

interface SynonymSectionProps {
  type: 'inputSynonym' | 'translationSynonym';
  translateHandler: (inputText: string, outputLanguage: Language) => void;
}

function SynonymSection(props: SynonymSectionProps) {
  const { type, translateHandler } = props;

  const languageArr = useAppSelector(selectLanguageArr);
  const outputLanguage = useAppSelector(selectOutputLanguage);
  const originalLanguageName = useAppSelector(selectOriginalLanguageName);
  const inputTextSynonymArr = useAppSelector(selectInputTextSynonyms);
  const translationSynonymArr = useAppSelector(selectTranslationSynonyms);

  const className = type === 'inputSynonym' ? 'translate__synonym' : 'translate__more-translation';
  const synonymArr = type === 'inputSynonym' ? inputTextSynonymArr : translationSynonymArr;

  function synonymClickHandler(options: { synonym: string; isSwapLanguage?: boolean }) {
    if (!languageArr || !outputLanguage) {
      return;
    }

    const { synonym, isSwapLanguage } = options;

    translateHandler(
      synonym,
      isSwapLanguage ? (languageArr.find((language) => language.name === originalLanguageName) ?? outputLanguage) : outputLanguage,
    );
  }

  if (synonymArr.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="title">{type === 'inputSynonym' ? 'Synonyms' : 'More translations'}</h2>

      <ul className="list-container">
        {synonymArr.map((synonym, index) => (
          <li key={index} className="item">
            <button
              type="button"
              data-testid={`translate-${type}-synonym-button-${index}`}
              onClick={synonymClickHandler.bind(null, { synonym, isSwapLanguage: type === 'translationSynonym' })}
            >
              {synonym}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SynonymSection;
