import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"
import { type SideBarItemProps } from "../../../types/sideBar/SideBarTypes"
import home from "../../../assets/images/sidebar/home.svg"
import { subItemRoute } from "./subItemRoute"
import { filterItem } from "../../../types/dataStore/DataStoreConfig"

function sideBarData(locationParms: string, filterDataElements: filterItem[]): SideBarItemProps[] {

    return [
        {
            title: "Navigation",
            subItems: [
                {
                    icon: home,
                    label: "Home",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS",
                    route: `home`,
                    pathName: "/home"
                }
            ]
        },
        {
            title: "Student",
            subItems: [
                {
                    icon: listAdd,
                    label: "Enrollment",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Enrollment",
                    route: `enrollment?${subItemRoute(locationParms.slice(1), '', filterDataElements)}`,
                    pathName: "/enrollment/student"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance",
                    route: `attendance?${subItemRoute(locationParms.slice(1), '', filterDataElements)}`,
                    pathName: "/attendance/student"
                },
                {
                    icon: fileDocument,
                    label: "Performance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Performance",
                    route: `performance?${subItemRoute(locationParms.slice(1), '', filterDataElements, false, true)}`,
                    pathName: "/performance/student"
                },
                {
                    icon: gauge,
                    label: "Final result",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Final-Result",
                    route: `final-result?${subItemRoute(locationParms.slice(1), '', filterDataElements)}`,
                    pathName: "/final-result/student"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Transfer",
                    route: `transfer?${subItemRoute(locationParms.slice(1), '', filterDataElements, true)}`,
                    pathName: "/transfer/student"
                }
            ]
        },
        {
            title: "Staff",
            subItems: [
                {
                    icon: userGroup,
                    label: "Staff registry",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Enrollment",
                    route: `enrollment?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements)}`,
                    pathName: "/enrollment/staff"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance",
                    route: `attendance?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements)}`,
                    pathName: "/attendance/staff"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Transfer",
                    route: `transfer?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements, true)}`,
                    pathName: "/transfer/staff"
                }
            ]
        }
    ]
}
export { sideBarData }
