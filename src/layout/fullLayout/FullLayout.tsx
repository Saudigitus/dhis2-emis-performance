import React from 'react'
import style from "../Layout.module.css"
import { MainHeader, SideBar } from '../../components'
import { useParams } from '../../hooks/commons/useQueryParams';
import InfoPage from '../../components/info/InfoPage';

export default function FullLayout({ children }: { children: React.ReactNode }) {
    // useGetInitialValues()
    const { urlParamiters } = useParams();

    console.log(urlParamiters());

    return (
        <div className={style.LayoutContainer}>
            <SideBar />
            <div className={style.FullLayoutContainer}>
                <MainHeader />
                <main className={style.MainContentContainer}>
                    {
                        (urlParamiters().school != null) ? children : <InfoPage />
                    }
                </main>
            </div>
        </div>
    )
}
