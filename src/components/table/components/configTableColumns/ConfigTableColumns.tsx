import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n';
import { IconSettings24 } from '@dhis2/ui';
import { IconButton, Tooltip } from '@material-ui/core';
import DialogConfigColumns from './DialogConfigColumns';
import { ConfigTableColumnsProps } from '../../../../types/table/ConfigColumnsProps';
import styles from "./configTableColumns.module.css"

function ConfigTableColumns(props: ConfigTableColumnsProps) {
    const { headers, updateVariables, filteredHeaders } = props;
    const [open, setopen] = useState(false)

    const closeDialog = () => {
        setopen(false)
    }

    const openDialog = () => {
        setopen(true)
    }

    return (
        <div className={styles['config-table__columns']}>
            <Tooltip
                disableFocusListener
                disableTouchListener
                enterDelay={500}
                title={i18n.t('Select columns')}
                className="my-auto"
            >
                <IconButton
                    onClick={openDialog}
                >
                    <IconSettings24 />
                </IconButton>
            </Tooltip>
            <DialogConfigColumns
                open={open}
                onClose={closeDialog}
                updateVariables={updateVariables}
                headers={headers}
                filteredHeaders={filteredHeaders}
            />
        </div>
    )
}

export default ConfigTableColumns
