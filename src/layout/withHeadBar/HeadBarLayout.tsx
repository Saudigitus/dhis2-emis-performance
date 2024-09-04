import React from 'react'
import style from "../Layout.module.css"
import { MainHeader } from '../../components'
import InfoPage from '../../components/info/InfoPage';
import { useParams } from '../../hooks';
import { LayoutProps } from '../../types/layout/LayoutProps';

export default function HeadBarLayout(props: LayoutProps): React.ReactElement {
    const { children } = props;
    const { urlParamiters } = useParams();

    return (
        <div className={style.HeadBarLayoutContainer}>
            <MainHeader />
            <main className={style.MainContentContainer}>{
                (urlParamiters().orgUnit != null) ? children : <InfoPage />
            }</main>
        </div>
    )
}
