import { getDataStoreKeys } from "../../utils";

const useDataElementsParamMapping = () => {
    const { registration } = getDataStoreKeys();
    return {
        [registration?.academicYear]: "academicYear",
        "RhABRLO2Fae": "class",
        "kNNoif9gASf": "grade"
    }
}
export default useDataElementsParamMapping;
