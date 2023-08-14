import React from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponse } from '../../utils/table/header/formatResponse';

function MenuItemContainer({ dataElementId, onToggle }: { dataElementId: string, onToggle: () => void }): React.ReactElement {
    const programConfigState = useRecoilValue(ProgramConfigState);
    //TODO: Change this hardcoded value
    const options = formatResponse(programConfigState, "Ni2qsy2WJn4")?.find(element => element.id === dataElementId)?.options.optionSet.options ?? [];

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
