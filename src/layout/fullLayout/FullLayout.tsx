import React, { useEffect } from 'react';
import style from "../Layout.module.css"
import { MainHeader } from '../../components'
import InfoPage from '../../components/info/InfoPage';
import { CenteredContent, CircularLoader } from "@dhis2/ui"
import { useGetProgramConfig, useParams } from '../../hooks';
import { LayoutProps } from '../../types/layout/LayoutProps';

export default function FullLayout(props: LayoutProps) {
    const { children } = props;
    const { urlParamiters } = useParams();
    const { school } = urlParamiters();
    const { loading } = useGetProgramConfig();


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
                    {(school === null || school === undefined) ? <InfoPage /> : children}
                </main>
            </div>
        </div>
    )
}
