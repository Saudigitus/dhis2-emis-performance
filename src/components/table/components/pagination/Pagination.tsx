import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import React from 'react'
import Select from 'react-select';
import styles from '../table.module.css';
import { TextPagination } from './components/TextPagination';
import { IconButtonPagination } from './components/IconButtonPagination';
import { PaginationProps } from '../../../../types/table/PaginationProps';
import { disableNextPage, rowsPerPages } from '../../../../utils';

function Pagination(props: PaginationProps): React.ReactElement {
    const { page, rowsPerPage, onPageChange, onRowsPerPageChange, loading, totalPerPage, option } = props;
    return (
        <div className={styles.pagination}>
            <div />

            <div className={styles.rootPagination}>
                {TextPagination("Linhas por página")}

                <Select
                    className={styles.textPagination}
                    value={rowsPerPage}
                    clearValueText={false}
                    options={option ? option : rowsPerPages}
                    clearable={false}
                    searchable={false}
                    onChange={onRowsPerPageChange}
                    menuContainerStyle={{ top: 'auto', bottom: '100%' }}
                />
                {TextPagination(`Página ${page}`)}

                <div className={styles.separator} />

                <IconButtonPagination
                    Icon={<KeyboardArrowLeft />}
                    ariaLabel='Página Anterior'
                    disabled={page <= 1 || loading}
                    onPageChange={() => { onPageChange(page - 1); }}
                />

                <IconButtonPagination
                    Icon={<KeyboardArrowRight />}
                    ariaLabel='Próxima Página'
                    disabled={disableNextPage({ rowsPerPage, totalPerPage }) || loading}
                    onPageChange={() => { onPageChange(page + 1); }}
                />

            </div>
        </div>
    )
}

export default Pagination
