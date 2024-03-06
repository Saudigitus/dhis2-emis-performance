import React from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { MenuItemContainerProps } from '../../types/menu/MenuItemTypes';
import { formatResponse, getDataStoreKeys } from '../../utils';

function MenuItemContainer(props: MenuItemContainerProps): React.ReactElement {
    const { dataElementId, onToggle } = props;
    const { registration } = getDataStoreKeys();

    const programConfigState = useRecoilValue(ProgramConfigState);
    const options = formatResponse(programConfigState, registration?.programStage)?.find(element => element.id === dataElementId)?.options.optionSet.options ?? [];

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
