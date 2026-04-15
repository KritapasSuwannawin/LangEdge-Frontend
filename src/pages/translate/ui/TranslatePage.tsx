import { useAppSelector } from '@/app/store/hooks';
import { selectIsLanguageReady, useInitializeLanguages } from '@/entities/language';
import { selectLastUsedLanguageId } from '@/entities/user';
import { Spinner } from '@/shared/ui';
import { TranslationResults } from '@/widgets/translation-results';
import { TranslationWorkspace } from '@/widgets/translation-workspace';

import './TranslatePage.scss';

function TranslatePage(): JSX.Element {
  const lastUsedLanguageId = useAppSelector(selectLastUsedLanguageId);
  const isLanguageReady = useAppSelector(selectIsLanguageReady);

  useInitializeLanguages(lastUsedLanguageId);

  if (!isLanguageReady) {
    return (
      <div className="page-spinner-container" data-testid="translate-page-loading-spinner">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="translate">
      <main className="translate__main">
        <TranslationWorkspace />

        <TranslationResults />
      </main>
    </div>
  );
}

export default TranslatePage;
