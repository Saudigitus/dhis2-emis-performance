import { useDataQuery } from '@dhis2/app-runtime'
import { OrganisationUnitTree, CenteredContent, CircularLoader, Help } from "@dhis2/ui"
import React, { useState } from 'react'
import { useParams } from '../../hooks/commons/useQueryParams';

const ORG_UNIT_QUERY = {
    results: {
        resource: "me",
        params: {
            fields: "organisationUnits[id,displayName]"
        }
    }
}

export default function OrgUnitTree({ onToggle }: { onToggle: () => void }): React.ReactElement {
    const { loading, data, error } = useDataQuery<{ results: { organisationUnits: [{ id: string, displayName: string }] } }>(ORG_UNIT_QUERY);
    const [selectedOu, setSelectedOu] = useState<{ id: string, displayName: string, selected: any }>()
    const { add } = useParams();

    const onOuChange = (event: { id: string, displayName: string, selected: any }) => {
        add("school", event?.id);
        add("schoolName", event?.displayName);
        setSelectedOu(event);
        onToggle()
    }

    if (error != null) {
        return <Help error>
            Something went wrong when loading the organisation units!
        </Help>
    }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader small />
            </CenteredContent>
        )
    }

    return (
        <OrganisationUnitTree
            name={data?.results.organisationUnits[0].displayName}
            roots={data?.results.organisationUnits[0].id}
            singleSelection
            selected={selectedOu?.selected}
            onChange={onOuChange}
        />
    )
}
