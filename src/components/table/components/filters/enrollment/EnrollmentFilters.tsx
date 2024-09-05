import React from 'react'
import ContentFilter from './ContentFilter';
import { VariablesTypes } from '../../../../../types/variables/AttributeColumns';
import styles from './EnrollmentFilter.module.css'
import { useHeader } from '../../../../../hooks';

function EnrollmentFilters(): React.ReactElement {
    const { columns } = useHeader()
    const headers = columns?.filter(column => column?.type !== VariablesTypes?.Performance)

    return (
        <div className={styles.container}>
            <ContentFilter headers={headers} />
        </div>
    )
}

export default EnrollmentFilters
