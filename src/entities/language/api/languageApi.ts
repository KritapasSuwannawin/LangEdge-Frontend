import zod from 'zod';

import { ApiInvalidResponseError, requestJson } from '@/shared/api';

import type { Language } from '../model/language';

const languageSchema = zod.object({
  id: zod.number().int().positive(),
  name: zod.string(),
  code: zod.string(),
});

export const languageListResponseSchema = zod.object({
  languageArr: zod.array(languageSchema),
});

export type LanguageListResponse = zod.infer<typeof languageListResponseSchema>;

const sortLanguagesByName = (languageArr: ReadonlyArray<Language>): Language[] => {
  return [...languageArr].sort((firstLanguage, secondLanguage) => firstLanguage.name.localeCompare(secondLanguage.name));
};

export async function getLanguageList(): Promise<Language[]> {
  const response = await requestJson<unknown>({ path: '/api/language' });
  const parsedResult = languageListResponseSchema.safeParse(response.data);

  if (!parsedResult.success) {
    throw new ApiInvalidResponseError('Invalid data format', response.status, response.data);
  }

  const { languageArr } = parsedResult.data;

  if (languageArr.length === 0) {
    throw new ApiInvalidResponseError('No language available', response.status, response.data);
  }

  return sortLanguagesByName(languageArr);
}
