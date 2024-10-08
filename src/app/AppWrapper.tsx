import React from 'react'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useDataStore } from '../hooks/appwrapper/useDataStore'

interface Props {
    children: React.ReactNode
}

export default function AppWrapper(props: Props) {
    const { data, error, loading } = useDataStore()

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error != null || !Object.prototype.hasOwnProperty.call(data?.config, "enrollment")) {
        return (
            <CenteredContent>
                Something went wrong wen loading the app, please check if you app is already configured
            </CenteredContent>
        )
    }

    return (
        <>{props.children}</>
    )
}
