import { useTranslationResults } from '@/widgets/translation-results/model/useTranslationResults';

import ExampleSentenceSection from '@/widgets/translation-results/ui/ExampleSentenceSection';
import SynonymSection from '@/widgets/translation-results/ui/SynonymSection';
import TranslationOutputSection from '@/widgets/translation-results/ui/TranslationOutputSection';

import '@/widgets/translation-results/ui/TranslationResults.scss';

function TranslationResults(): JSX.Element {
  const {
    exampleSentenceArr,
    inputTextSynonymArr,
    outputTextareaRef,
    translation,
    translationSynonymArr,
    handleInputTextSynonymClick,
    handleTranslationSynonymClick,
  } = useTranslationResults();

  return (
    <>
      <TranslationOutputSection outputTextareaRef={outputTextareaRef} translation={translation} />

      <SynonymSection type="inputSynonym" synonymArr={inputTextSynonymArr} onSynonymClick={handleInputTextSynonymClick} />

      <SynonymSection type="translationSynonym" synonymArr={translationSynonymArr} onSynonymClick={handleTranslationSynonymClick} />

      <ExampleSentenceSection exampleSentenceArr={exampleSentenceArr} />
    </>
  );
}

export default TranslationResults;
