import React from 'react'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useDataStore } from '../hooks/appwrapper/useDataStore'
import { useGetProgramRules } from '../hooks/programRules/useGetProgramRules';
import { useGetProgramRulesVariables } from '../hooks/programRules/useGetProgramRulesVariables';
import { useGetOptionGroups } from '../hooks/optionGroup/useGetOptionGroups';
import { useOrgUnitsGroups } from '../hooks/orgUnitsGroup/useOrgUnitsGroups';

interface Props {
    children: React.ReactNode
}

export default function AppWrapper(props: Props) {
    const { error, loading } = useDataStore()
    const { loadingPRules } = useGetProgramRules();
    const { loadingPRulesVariables } = useGetProgramRulesVariables();
    const { loadingOptionGroups } = useGetOptionGroups();
    const { loadingOrgUnitsGroups } = useOrgUnitsGroups()

    if (loading || loadingPRules || loadingPRulesVariables || loadingOptionGroups || loadingOrgUnitsGroups) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error != null) {
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
