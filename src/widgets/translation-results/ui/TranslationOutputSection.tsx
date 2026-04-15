interface TranslationOutputSectionProps {
  readonly outputTextareaRef: React.RefObject<HTMLTextAreaElement>;
  readonly translation: string;
}

function TranslationOutputSection(props: TranslationOutputSectionProps): JSX.Element {
  const { outputTextareaRef, translation } = props;

  return (
    <div className="translation-results__output">
      <div className="input-container">
        <textarea
          ref={outputTextareaRef}
          data-testid="translate-output-textarea"
          aria-label="Translation output"
          readOnly
          value={translation}
        />
      </div>
    </div>
  );
}

export default TranslationOutputSection;
