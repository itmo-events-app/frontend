import { uid } from 'uid';
import styles from './index.module.css'
import { ArrowLeft } from '@shared/ui/icons'
import { ArrowRight } from '@shared/ui/icons'

type Props = {
    page: number,
    size: number,
    total: number,
    onPageChange: (page: number, size:number)=>void,
    items: PageEntry[]
    pageSpread?: number,
}

class PageEntry {
    id: string
    render_func: any
  
    constructor(
      render_func: any
    ) {
      this.id = uid();
      this.render_func = render_func;
    }
}

function Pagination(props: Props) {
    const totalPages = Math.ceil(props.total/props.size);
    
    const handlePageClick = (page: number) => {
        if (page<1||page>totalPages) return
        props.onPageChange(page,props.size);
    };
    const handleSizeClick = (size: number) => {
        if (size<1||size>50) return
        props.onPageChange(1,size);
    };

    const renderPagination = () => {
        const pages = [];
        const visiblePages = [];
        const pageSpread = props.pageSpread?props.pageSpread:1;
        pages.push(
            <a key={1} href="#" className={`${styles.nav_button} ${1 === props.page ? styles.current_page : ''}`} onClick={() => handlePageClick(1)}>
                1
            </a>
        );
        for (let i = props.page - pageSpread; i <= props.page + pageSpread; i++) {
            if (i > 1 && i < totalPages) {
                visiblePages.push(i);
            }
        }
        if (visiblePages[0] > 2) {
            pages.push(<span className={styles.nav_button} key="ellipsis1">...</span>);
        }
        visiblePages.forEach((page) => {
            pages.push(
                <a key={page} href="#" className={`${styles.nav_button} ${page === props.page ? styles.current_page : ''}`} onClick={() => handlePageClick(page)}>
                    {page}
                </a>
            );
        });
        if (visiblePages[visiblePages.length - 1] < totalPages - 1) {
            pages.push(<span key="ellipsis2">...</span>);
        }
        if (totalPages > 1) {
            pages.push(
                <a key={totalPages} href="#" className={`${styles.nav_button} ${totalPages === props.page ? styles.current_page : ''}`} onClick={() => handlePageClick(totalPages)}>
                    {totalPages}
                </a>
            );
        }
        return pages;
    };

    const renderItems = () => {
        const rendererdItems = [];
        for (let i = 0; i < props.items.length; i++) {
            rendererdItems.push(props.items[i].render_func());
        }
        return (
            <div>
                {rendererdItems}
            </div>
        );
    };

    function _navInfo() {
        return (
          <div className={styles.nav_page_nums}>
            <div className={styles.nav_page_num_selected}>
              {(props.page - 1)*props.size+1}
            </div>
            <div className={styles.nav_page_num_selected}>
              {"-"}
            </div>
            <div className={styles.nav_page_num_selected}>
              {Math.min(props.total, (props.page-1)*props.size+props.size)}
            </div>
            <div className={styles.nav_page_num}>
              {"из"}
            </div>
            <div className={styles.nav_page_num}>
              {props.total}
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
                <a href="#" className={styles.nav_button} onClick={()=>handlePageClick(props.page-1)}>
                    <ArrowLeft className={styles.arrow}/>
                </a>
                {renderPagination()}
                <a href="#" className={styles.nav_button} onClick={()=>handlePageClick(props.page+1)}>
                    <ArrowRight className={styles.arrow}/>
                </a>
                </div>
                <div className={styles.nav_info}>
                {_navInfo()}
                </div>
                <div className={styles.nav_buttons}>
                <a href="#" className={styles.nav_button} onClick={()=>handleSizeClick(props.size-1)}>
                    <ArrowLeft className={styles.arrow}/>
                </a>
                <div className={styles.nav_page_num}>
                    Размер страницы:
                </div>
                <div className={styles.nav_page_num}>
                    {props.size}
                </div>
                <a href="#" className={styles.nav_button} onClick={()=>handleSizeClick(props.size+1)}>
                    <ArrowRight className={styles.arrow}/>
                </a>
                </div>
            </div>
            <div className={styles.list}>
                {renderItems()}
            </div>
        </div>
    );
}

export default Pagination;
export { PageEntry }
