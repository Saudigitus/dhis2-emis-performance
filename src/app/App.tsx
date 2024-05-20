import React from 'react'
import "./App.module.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-select/dist/react-select.css";
import "../assets/style/colors.css"
import "../assets/style/font.css"
import "../assets/style/globalStyle.css"
import { Router } from "../components/routes"
import { RecoilRoot } from 'recoil';
import AppWrapper from './AppWrapper';
import AppConfigurations from './AppConfigurations';

function App() {
    return (
        <RecoilRoot>
            <AppWrapper>
                <AppConfigurations>
                    <Router />
                </AppConfigurations>
            </AppWrapper>
        </RecoilRoot>
    )
}
export default App
