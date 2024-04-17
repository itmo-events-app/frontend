import { uid } from 'uid';
import styles from './index.module.css'
import { ArrowLeft } from '@shared/ui/icons'
import { ArrowRight } from '@shared/ui/icons'
import React, { FC } from 'react';

export type PageProps = {
    page: number,
    size: number,
    total: number,
}

type Props = {
    pageProps: PageProps,
    onPageChange: (page: number, size:number)=>void,
    items: PageEntry[],
    listWrapper?: JSX.Element,
    pageSpread?: number,
}

class PageEntry {
    id: string
    render_func: FC

    constructor(
      render_func: FC
    ) {
      this.id = uid();
      this.render_func = render_func;
    }
}

function Pagination(props: Props) {
    const totalPages = Math.ceil(props.pageProps.total/props.pageProps.size);

    const _handlePageClick = (page: number) => {
        if (page<1||page>totalPages) return
        props.onPageChange(page,props.pageProps.size);
    };
    const _handleSizeClick = (size: number) => {
        if (size<1||size>50) return
        props.onPageChange(1,size);
    };

    const renderPagination = () => {
        const pages = [];
        const visiblePages = [];
        const pageSpread = props.pageSpread?props.pageSpread:1;
        pages.push(
            <a key={1} className={`${styles.nav_page_num} ${1 === props.pageProps.page ? styles.nav_page_num_selected2 : ''}`} onClick={() => _handlePageClick(1)}>
                1
            </a>
        );
        for (let i = props.pageProps.page - pageSpread; i <= props.pageProps.page + pageSpread; i++) {
            if (i > 1 && i < totalPages) {
                visiblePages.push(i);
            }
        }
        if (visiblePages[0] > 2) {
            pages.push(<span className={styles.nav_page_num} key="ellipsis1">...</span>);
        }
        visiblePages.forEach((page) => {
            pages.push(
                <a key={page} className={`${styles.nav_page_num} ${page === props.pageProps.page ? styles.nav_page_num_selected2 : ''}`} onClick={() => _handlePageClick(page)}>
                    {page}
                </a>
            );
        });
        if (visiblePages[visiblePages.length - 1] < totalPages - 1) {
            pages.push(<span className={styles.nav_page_num} key="ellipsis2">...</span>);
        }
        if (totalPages > 1) {
            pages.push(
                <a key={totalPages} className={`${styles.nav_page_num} ${totalPages === props.pageProps.page ? styles.nav_page_num_selected2 : ''}`} onClick={() => _handlePageClick(totalPages)}>
                    {totalPages}
                </a>
            );
        }
        return pages;
    };

    const renderItems = (listWrapper?: JSX.Element) => {
        const rendererdItems = props.items.map((item) => item.render_func({}));
        if (listWrapper===null||listWrapper===undefined)
        return <div className={styles.list}>{rendererdItems}</div>
        return <>{React.cloneElement(listWrapper, {child: rendererdItems})}</>;
    };

    function _navInfo() {
        return (
          <div className={styles.nav_page_nums}>
            <div className={styles.nav_page_num_selected}>
              {(props.pageProps.page - 1)*props.pageProps.size+1}
            </div>
            <div className={styles.nav_page_num_selected}>
              {"-"}
            </div>
            <div className={styles.nav_page_num_selected}>
              {Math.min(props.pageProps.total, (props.pageProps.page-1)*props.pageProps.size+props.pageProps.size)}
            </div>
            <div className={styles.nav_page_num}>
              {"из"}
            </div>
            <div className={styles.nav_page_num}>
              {props.pageProps.total}
            </div>
            <div className={styles.nav_page_num}>
              {((props.items.length % 10 == 1) && (Math.floor(props.items.length / 10) % 10 != 1)) ? "элемента" : "элементов"}
            </div>
          </div>
        );
    }
    return (
        <div className={styles.list_container}>
            <div className={styles.navigator}>
                <div className={styles.nav_buttons}>
                    <a className={styles.nav_button} onClick={()=>_handlePageClick(props.pageProps.page-1)}>
                        <ArrowLeft className={styles.arrow}/>
                    </a>
                    <a className={styles.nav_button} onClick={()=>_handlePageClick(props.pageProps.page+1)}>
                        <ArrowRight className={styles.arrow}/>
                    </a>
                </div>
                <div className={styles.nav_info}>
                    {_navInfo()}
                </div>
                <div className={styles.nav_buttons}>
                    <a className={styles.nav_button} onClick={()=>_handlePageClick(props.pageProps.page-1)}>
                        <ArrowLeft className={styles.arrow}/>
                    </a>
                    <div className={styles.nav_page_nums}>
                        {renderPagination()}
                    </div>
                    <a className={styles.nav_button} onClick={()=>_handlePageClick(props.pageProps.page+1)}>
                        <ArrowRight className={styles.arrow}/>
                    </a>
                </div>
                <div className={styles.nav_buttons}>
                    <a className={styles.nav_button} onClick={()=>_handleSizeClick(props.pageProps.size-1)}>
                        <ArrowLeft className={styles.arrow}/>
                    </a>
                    <div className={styles.nav_page_num}>
                        Размер страницы:
                    </div>
                    <div className={styles.nav_page_num}>
                        {props.pageProps.size}
                    </div>
                    <a className={styles.nav_button} onClick={()=>_handleSizeClick(props.pageProps.size+1)}>
                        <ArrowRight className={styles.arrow}/>
                    </a>
                </div>
            </div>
            {renderItems(props.listWrapper)}
        </div>
    );
}

export default Pagination;
export { PageEntry }
