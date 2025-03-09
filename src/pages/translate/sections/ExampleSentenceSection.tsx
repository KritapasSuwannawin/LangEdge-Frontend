import { useAppSelector } from '../../../hooks/useRedux';

function ExampleSentenceSection() {
  const translationOutput = useAppSelector((state) => state.translation.translationOutput);

  const { exampleSentenceArr } = translationOutput ?? {};

  if (!exampleSentenceArr || exampleSentenceArr.length === 0) {
    return null;
  }

  return (
    <div className="translate__example-sentence">
      <h2 className="title">Example sentences</h2>

      <ul className="list-container">
        {exampleSentenceArr.map(({ sentence, translation }, index) => (
          <li key={index} className="item">
            <p className="sentence">{sentence}</p>
            <p className="translation">{translation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExampleSentenceSection;
