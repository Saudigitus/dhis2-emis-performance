import { type SelectedOptionsTypes, type HeadBarTypes } from "../../../types/headBar/HeadBarTypes"

function headBarData(selectedOptions: SelectedOptionsTypes): HeadBarTypes[] {
    return [
        {
            id: "c540ac7c",
            label: "School",
            value: selectedOptions?.schoolName ?? "Select a school",
            placeholder: "Search for organisation unit",
            component: "orgUnitTree"
        },
        {
            id: "981ed8a3",
            label: "Grade",
            value: selectedOptions?.grade ?? "Select a grade",
            placeholder: "Search for grade",
            optionSetId: "xbVWkOuF6CW",
            component: "menuItemContainer"
        },
        {
            id: "7ce5c7f3",
            label: "Class",
            value: selectedOptions?.class ?? "Select a class",
            placeholder: "Search for class",
            optionSetId: "hq8YJB1Kd4K",
            component: "menuItemContainer"
        },
        {
            id: "j2e9b216",
            label: "Academic Year",
            value: selectedOptions?.academicYear ?? "Select academic year",
            placeholder: "Search for academic year",
            optionSetId: "Mb3GXOfAze2",
            component: "menuItemContainer"
        }
    ]
}
export { headBarData }
