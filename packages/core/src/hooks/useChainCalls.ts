import { useContext, useEffect, useMemo } from 'react'
import { ChainCall } from '../providers/chainState/callsReducer'
import { ChainStateContext } from '../providers/chainState/context'
import { Falsy } from '../model/types'

export function useChainCalls(calls: (ChainCall | Falsy)[]) {
  const { dispatchCalls, value } = useContext(ChainStateContext)

  useEffect(() => {
    const filteredCalls = calls.filter(Boolean) as ChainCall[]
    dispatchCalls({ type: 'ADD_CALLS', calls: filteredCalls })
    return () => dispatchCalls({ type: 'REMOVE_CALLS', calls: filteredCalls })
  }, [JSON.stringify(calls), dispatchCalls])

  return {
    results: useMemo(
      () =>
        calls.map((call) => {
          if (call && value) {
            return value.state?.[call.address]?.[call.data]
          }
        }),
      [JSON.stringify(calls), value]
    ),
    error: value?.error,
  }
}

export function useChainCall(call: ChainCall | Falsy) {
  const { results, error } = useChainCalls([call])
  return { result: results[0], error }
}
