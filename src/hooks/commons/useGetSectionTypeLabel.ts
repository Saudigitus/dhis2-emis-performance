import { formatCamelToTitleCase } from "../../utils/commons/formatCamelCaseToWords";
import { useParams } from "./useQueryParams";

const useGetSectionTypeLabel = () => {
    const { urlParamiters } = useParams()
    const sectionType = urlParamiters().sectionType;

    return { sectionName: "student" };
}
export default useGetSectionTypeLabel;
