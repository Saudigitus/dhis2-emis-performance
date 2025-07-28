import { useSearchParams } from 'react-router-dom'
import React from 'react'

const useParams = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const add = (key: string, value: string) => {
        searchParams.set(key, value)
        setSearchParams(searchParams)
    }
    const remove = (key: string) => {
        searchParams.delete(key)
        setSearchParams(searchParams)
    }
    const useQuery = () => {
        return React.useMemo(() => new URLSearchParams(searchParams), [searchParams])
    }

    const urlParamiters = () => {
        return {
            orgUnit: useQuery().get('orgUnit'),
            orgUnitName: useQuery().get('orgUnitName'),
            program: useQuery().get('program'),
            tab: useQuery().get('tab'),
            orgUnitLevel: useQuery().get('orgUnitLevel'),
            grade: useQuery().get('grade'),
        }
    }
    return { add, remove, useQuery, urlParamiters }
}
export { useParams }
