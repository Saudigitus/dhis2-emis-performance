import React from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponse } from '../../utils/table/header/formatResponse';
import { DataStoreState } from '../../schema/dataStoreSchema';

function MenuItemContainer({ dataElementId, onToggle }: { dataElementId: string, onToggle: () => void }): React.ReactElement {
    const dataStoreState = useRecoilValue(DataStoreState);

    const programConfigState = useRecoilValue(ProgramConfigState);
    const options = formatResponse(programConfigState, dataStoreState?.find((section) => section.key === "student")?.registration.programStage)?.find(element => element.id === dataElementId)?.options.optionSet.options ?? [];

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
