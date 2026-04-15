import type { ExampleSentence } from '@/entities/translation';

interface ExampleSentenceSectionProps {
  readonly exampleSentenceArr: ExampleSentence[];
}

function ExampleSentenceSection(props: ExampleSentenceSectionProps): JSX.Element | null {
  const { exampleSentenceArr } = props;

  if (exampleSentenceArr.length === 0) {
    return null;
  }

  return (
    <div className="translation-results__example-sentence">
      <h2 className="title">Example sentences</h2>

      <ul className="list-container">
        {exampleSentenceArr.map(({ sentence, translation }, index) => (
          <li key={`${sentence}-${index}`} className="item">
            <p className="sentence">{sentence}</p>
            <p className="translation">{translation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExampleSentenceSection;
