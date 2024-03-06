import React from 'react'
import styles from '../../table.module.css';

export function TextPagination(text: string): React.ReactElement {
    return (
        <span className={styles.textPagination}>
            {text}
        </span>
    )
}
