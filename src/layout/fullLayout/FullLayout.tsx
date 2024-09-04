import React from 'react';
import style from "../Layout.module.css"
import { MainHeader } from '../../components'
import InfoPage from '../../components/info/InfoPage';
import { CenteredContent, CircularLoader } from "@dhis2/ui"
import { useGetProgramConfig, useParams } from '../../hooks';
import { LayoutProps } from '../../types/layout/LayoutProps';

export default function FullLayout(props: LayoutProps) {
    const { children } = props;
    const { loading } = useGetProgramConfig();

    // if (!isSetSectionType) {
    //     return (
    //         <CenteredContent>
    //             Cant load the app without section type
    //         </CenteredContent>
    //     )
    // }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <div className={style.LayoutContainer}>
            {/* <SideBar /> */}
            <div className={style.FullLayoutContainer}>
                <MainHeader />
                <main className={style.MainContentContainer}>
                    { children}
                </main>
            </div>
        </div>
    )
}
