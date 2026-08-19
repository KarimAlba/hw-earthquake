export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }
    throw new Error(mapFetchErrorToRu(error))
  }

  if (!response.ok) {
    throw new Error(mapHttpStatusToRu(response.status))
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error('Не удалось разобрать ответ USGS.')
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function mapFetchErrorToRu(error: unknown): string {
  if (error instanceof Error) {
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(error.message)) {
      return 'Нет подключения к интернету.'
    }
  }

  return 'Не удалось загрузить данные.'
}

function mapHttpStatusToRu(status: number): string {
  if (status === 404) {
    return 'Данные не найдены.'
  }
  if (status === 429) {
    return 'Слишком много запросов. Попробуйте позже.'
  }
  if (status >= 500) {
    return 'Сервис USGS временно недоступен.'
  }
  return 'Не удалось получить данные от USGS.'
}
