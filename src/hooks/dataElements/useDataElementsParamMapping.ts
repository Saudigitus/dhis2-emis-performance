import { getDataStoreKeys } from "../../utils";

const useDataElementsParamMapping = () => {
    const { registration } = getDataStoreKeys();
    return {
        [registration?.academicYear]: "academicYear",
        [registration?.section]: "class",
        [registration?.grade]: "grade"
    }
}
export default useDataElementsParamMapping;
