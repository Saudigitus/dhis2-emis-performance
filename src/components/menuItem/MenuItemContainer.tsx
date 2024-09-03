import React, { useEffect } from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponse, getDataStoreKeys } from '../../utils';
import { MenuItemContainerProps } from '../../types/menu/MenuItemTypes';
import { CustomDhis2RulesEngine } from '../../hooks/programRules/rules-engine/RulesEngine';
import { formatKeyValueTypeHeader } from '../../utils/programRules/formatKeyValueType';
import { useParams } from '../../hooks/commons/useQueryParams';

function MenuItemContainer(props: MenuItemContainerProps): React.ReactElement {
    const { dataElementId, onToggle } = props;
    const { urlParamiters } = useParams();
    const { school } = urlParamiters()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { monitoria } = getDataStoreKeys();

    const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
        variables: formatResponse(programConfigState, monitoria?.programStage, [], [], '', '')?.filter(element => element.rawId === dataElementId).map((x) => { return { ...x, name: x.rawId } }),
        values: { orgUnit: school },
        type: "programStage",
        formatKeyValueType: formatKeyValueTypeHeader(formatResponse(programConfigState, monitoria?.programStage, [], [], '', '')?.filter(element => element.rawId === dataElementId)) || []
    })

    useEffect(() => {
        runRulesEngine()
    }, [school])

    const options = updatedVariables?.find(element => element.rawId === dataElementId)?.options.optionSet.options ?? []

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
