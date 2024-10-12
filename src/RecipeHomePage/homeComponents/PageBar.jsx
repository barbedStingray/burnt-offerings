import React from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";


const PageBar = ({ pageStatus }) => {
    const { currentPage, setCurrentPage, totalPages, scrollToTopRef } = pageStatus


    const handlePageChange = (newPage) => {
            setCurrentPage(newPage)

            setTimeout(() => {
                if (scrollToTopRef.current) {
                    const scrollHeight = scrollToTopRef.current.scrollHeight
                    const clientHeight = scrollToTopRef.current.clientHeight
                    if (scrollHeight > clientHeight) {
                        scrollToTopRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                }
            }, 500)
    }


    return (
        <div className='paginationBar'>
            <div
                className={`homePageNext ${currentPage === 1 ? 'homeNextDeactivate' : ''}`}
                onClick={currentPage === 1 ? null : () => handlePageChange(currentPage - 1)}
            >
                <IoIosArrowDropleft />
            </div>
            <div
                className={`homePageNext ${currentPage === totalPages ? 'homeNextDeactivate' : ''}`}
                onClick={currentPage === totalPages ? null : () => handlePageChange(currentPage + 1)}
            >
                <IoIosArrowDropright />
            </div>
        </div>
    )
}

export default PageBar
