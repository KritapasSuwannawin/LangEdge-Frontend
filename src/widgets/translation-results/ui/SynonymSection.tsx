interface SynonymSectionProps {
  readonly type: 'inputSynonym' | 'translationSynonym';
  readonly synonymArr: string[];
  readonly onSynonymClick: (synonym: string) => void;
}

function SynonymSection(props: SynonymSectionProps): JSX.Element | null {
  const { type, synonymArr, onSynonymClick } = props;

  if (synonymArr.length === 0) {
    return null;
  }

  const className = type === 'inputSynonym' ? 'translation-results__synonym' : 'translation-results__more-translation';
  const title = type === 'inputSynonym' ? 'Synonyms' : 'More translations';

  return (
    <div className={className}>
      <h2 className="title">{title}</h2>

      <ul className="list-container">
        {synonymArr.map((synonym, index) => (
          <li key={`${synonym}-${index}`} className="item">
            <button type="button" data-testid={`translate-${type}-synonym-button-${index}`} onClick={() => onSynonymClick(synonym)}>
              {synonym}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SynonymSection;
