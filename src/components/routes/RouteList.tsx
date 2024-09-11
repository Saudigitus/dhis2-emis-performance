import { Navigate } from "react-router-dom";
import React from "react";
import { SimpleLayout, FullLayout } from "../../layout"
import { TableComponent } from "../../pages";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/mapping" replace />
        },
        {
            path: "/mapping",
            layout: FullLayout,
            component: () => <TableComponent />
        }
    ]
}
