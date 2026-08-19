export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(mapHttpStatusToRu(response.status))
  }

  return (await response.json()) as T
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
