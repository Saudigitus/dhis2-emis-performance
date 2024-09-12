import { Paper } from '@material-ui/core'
import React from 'react'
import styles from "./infoPage.module.css"

export default function InfoPage() {
    return (
        <div className={styles.containerInit}>
            <Paper elevation={1} className={styles.paperInit}>
                <h2>Fortalecimento das ASCAS</h2>
                <span>Módulos Obrigatórios:</span>
                <ul>
                    <li className={styles.paperOtherText}>Módulo de Educação Financeira</li>
                    <li className={styles.paperOtherText}>Módulo de Produtos e Serviços Financeiros para ASCAs</li>
                    <li className={styles.paperOtherText}>Módulo de Governação Eficaz, Liderança e Gestão das ASCAs</li>
                    <li className={styles.paperOtherText}>Módulo de Gestão de Registos, Escrituração e Contabilidade para ASCAs</li>
                </ul>
                <span>Módulos Opcionais:</span>
                <ul>
                    <li className={styles.paperOtherText}>Módulo de GALs</li>
                    <li className={styles.paperOtherText}>Módulo de Nutrição</li>
                    <li className={styles.paperOtherText}>Módulo de Mudanças Climáticas</li>
                    <li className={styles.paperOtherText}>Módulo de Género, Juventude e inclusão Social</li>
                </ul>
            </Paper>
        </div>
    )
}
