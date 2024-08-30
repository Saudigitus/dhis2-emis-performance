import React, { useEffect } from 'react';
import style from "../Layout.module.css"
import { MainHeader, SideBar } from '../../components'
import InfoPage from '../../components/info/InfoPage';
import { CenteredContent, CircularLoader } from "@dhis2/ui"
import { useGetInitialValues, useGetProgramConfig, useParams } from '../../hooks';
import { LayoutProps } from '../../types/layout/LayoutProps';
import { getDataStoreKeys } from '../../utils';

export default function FullLayout(props: LayoutProps) {
    const { children } = props;
    const { urlParamiters, add, useQuery } = useParams();
    const { school } = urlParamiters();
    const { isSetSectionType } = useGetInitialValues()
    const { loading } = useGetProgramConfig();

    if (!isSetSectionType) {
        return (
            <CenteredContent>
                Cant load the app without section type
            </CenteredContent>
        )
    }

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
