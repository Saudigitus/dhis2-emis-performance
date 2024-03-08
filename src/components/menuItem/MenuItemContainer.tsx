import React, { useEffect } from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponse, getDataStoreKeys } from '../../utils';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { MenuItemContainerProps } from '../../types/menu/MenuItemTypes';
import { CustomDhis2RulesEngine } from '../../hooks/programRules/rules-engine/RulesEngine';
import { formatKeyValueTypeHeader } from '../../utils/programRules/formatKeyValueType';
import { useParams } from '../../hooks/commons/useQueryParams';

function MenuItemContainer(props: MenuItemContainerProps): React.ReactElement {
    const { dataElementId, onToggle } = props;
    const { useQuery } = useParams();
    const orgUnit = useQuery().get("school");
    const grade = useQuery().get("grade");
    const { getDataStoreData } = getSelectedKey()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { registration } = getDataStoreKeys();

    const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
        variables: formatResponse(programConfigState, registration?.programStage)?.filter(element => element.id === dataElementId).map((x) => { return { ...x, name: x.id } }),
        values: { orgUnit, [getDataStoreData.registration.grade as string]: grade },
        type: "programStage",
        formatKeyValueType: formatKeyValueTypeHeader(formatResponse(programConfigState, registration?.programStage)?.filter(element => element.id === dataElementId)) || []
    })

    useEffect(() => {
        runRulesEngine()
    }, [orgUnit])

    const options = updatedVariables?.find(element => element.id === dataElementId)?.options.optionSet.options ?? []

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
