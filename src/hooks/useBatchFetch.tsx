import { useCallback, useState } from 'react'

type AsyncRunFn<T> = (id: string) => Promise<T>

interface BatchRequestState<T> {
  loading: boolean
  finished: boolean
  currentIndex: number
  results: (T | null)[]
  errors: (Error | null)[]
}

export function useBatchRequest<T = any>(asyncRun: AsyncRunFn<T>, ids: string[]) {
  const [state, setState] = useState<BatchRequestState<T>>({
    loading: false,
    finished: false,
    currentIndex: -1,
    results: [],
    errors: [],
  })

  const runBatch = useCallback(async () => {
    setState({
      loading: true,
      finished: false,
      currentIndex: -1,
      results: Array(ids.length).fill(null),
      errors: Array(ids.length).fill(null),
    })

    const results: (T | null)[] = []
    const errors: (Error | null)[] = []

    for (let i = 0; i < ids.length; i++) {
      try {
        const result = await asyncRun(ids[i])
        results[i] = result
        errors[i] = null
      } catch (err) {
        results[i] = null
        errors[i] = err instanceof Error ? err : new Error(String(err))
      }

      setState(prev => ({
        ...prev,
        currentIndex: i,
        results: [...results],
        errors: [...errors],
      }))

      // 等待 500ms 后再处理下一个（最后一个不需要等待）
      if (i < ids.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    setState({
      loading: false,
      finished: true,
      currentIndex: ids.length - 1,
      results,
      errors,
    })
  }, [ids, asyncRun])

  // Add the reset function
  const reset = useCallback(() => {
    setState({
      loading: false,
      finished: false,
      currentIndex: -1,
      results: [],
      errors: [],
    })
  }, [])

  // 返回状态和控制方法
  return {
    ...state,
    start: runBatch,
    reset, // Add reset to the returned object
    progress: state.currentIndex + 1, // 当前完成的数量
    total: ids.length, // 总任务数
  }
}
