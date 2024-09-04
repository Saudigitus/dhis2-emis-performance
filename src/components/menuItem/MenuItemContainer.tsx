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
    const { urlParamiters } = useParams();
    const { grade, orgUnit } = urlParamiters()
    const { getDataStoreData } = getSelectedKey()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { registration } = getDataStoreKeys();

    const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
        variables: formatResponse(programConfigState, registration?.programStage)?.filter(element => element.rawId === dataElementId).map((x) => { return { ...x, name: x.rawId } }),
        values: { orgUnit: orgUnit, [getDataStoreData.registration.grade as string]: grade },
        type: "programStage",
        formatKeyValueType: formatKeyValueTypeHeader(formatResponse(programConfigState, registration?.programStage)?.filter(element => element.rawId === dataElementId)) || []
    })

    useEffect(() => {
        runRulesEngine()
    }, [orgUnit])

    const options = updatedVariables?.find(element => element.rawId === dataElementId)?.options.optionSet.options ?? []

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
