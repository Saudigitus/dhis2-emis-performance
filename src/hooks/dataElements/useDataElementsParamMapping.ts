import { getDataStoreKeys } from "../../utils";
import { formatFilterItems } from "../../utils/constants/headBar/formatFilterItemsMapping";

const useDataElementsParamMapping = () => {
    const { registration, filterItems } = getDataStoreKeys();
    return {
        ...formatFilterItems(filterItems)

    }
}
export default useDataElementsParamMapping;
