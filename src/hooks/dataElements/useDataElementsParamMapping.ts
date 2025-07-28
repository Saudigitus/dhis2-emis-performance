import { getDataStoreKeys } from "../../utils";
import { formatFilterItems } from "../../utils/constants/headBar/formatFilterItemsMapping";

const useDataElementsParamMapping = () => {
    const { registration, filterItems } = getDataStoreKeys();
    return {
        program: 'program',
        ...formatFilterItems(filterItems)
    }
}
export default useDataElementsParamMapping;
