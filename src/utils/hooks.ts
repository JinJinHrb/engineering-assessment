import React, { useMemo, useRef } from 'react'

/**
 * componentDidMount in hook way
 *
 * @export
 * @param {() => any} onMount
 * @returns
 */
export function useOnMount(onMount: () => any) {
    return React.useEffect(() => {
        if (onMount) {
            onMount()
        }
    }, [])
}

/**
 * componentWillUnmount in hook way
 *
 * @export
 * @param {() => any} onUnmount
 * @returns
 */
export function useOnUnmount(onUnmount: () => any) {
    return React.useEffect(() => {
        return () => onUnmount && onUnmount()
    }, [])
}

export function useMyMemoizedFn(fn: () => any) {
    const ref = useRef(fn)
    ref.current = useMemo(() => fn, [fn])
    const memoizedFn = useRef<() => any>()
    if (!memoizedFn.current) {
        memoizedFn.current = function (...args) {
            return ref.current.apply(this, args)
        }
    }
    return memoizedFn.current
}
