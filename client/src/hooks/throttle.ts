import {useRef, useCallback} from 'react'

export function useThrottle(callback:Function, delay:number){
    const isThrottled = useRef<boolean | null>(null)

    const throttledCallback = useCallback((...args:any[])=>{
        if(isThrottled.current) {
            return;
        }

        isThrottled.current = true;
        callback(...args)
        setTimeout(()=>isThrottled.current = false, delay)

    },[callback, delay])
    return throttledCallback
}