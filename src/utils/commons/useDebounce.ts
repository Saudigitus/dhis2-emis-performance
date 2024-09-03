import React from 'react'

export default function useDebounce (value : string, delay: number){
    const [debouncedValue, setDebouncedValue] = React.useState(value)
  
    React.useEffect(() => {
        const timeoutValue = setTimeout(() =>{
            setDebouncedValue(value)
        }, delay)
  
        return () => clearTimeout(timeoutValue)
    }, [value])
  
    return debouncedValue
  }