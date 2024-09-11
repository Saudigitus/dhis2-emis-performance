import { Navigate } from "react-router-dom";
import React from "react";
import { SimpleLayout, FullLayout } from "../../layout"
import History from "../../pages/history/History";
import View from "../../pages/view/View";
import { TableComponent } from "../../pages";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/financing?" replace />
        },
        {
            path: "/financing",
            layout: FullLayout,
            component: () => <TableComponent />
        },
        {
            path: "/history",
            layout: FullLayout,
            component: () => <History />
        },
        {
            path: "/view",
            layout: FullLayout,
            component: () => <View />
        }
    ]
}
