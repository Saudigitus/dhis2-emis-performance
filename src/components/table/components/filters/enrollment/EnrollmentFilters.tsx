import React from 'react'
import ContentFilter from './ContentFilter';
import { useHeader } from '../../../../../hooks/tableHeader/useHeader';
import { VariablesTypes } from '../../../../../types/table/AttributeColumns';

function EnrollmentFilters(): React.ReactElement {
    const { columns } = useHeader()
    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: 10, marginTop: 10, marginLeft: 10 }}>
            <ContentFilter headers={columns?.filter(column => column?.type !== VariablesTypes?.Performance)} />
        </div>
    )
}

export default EnrollmentFilters
