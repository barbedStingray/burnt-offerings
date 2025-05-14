import React from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";


const PageBar = ({ pageStatus }) => {
    const { currentPage, setCurrentPage, totalPages, bouncedKeywords, scrollToTopRef } = pageStatus

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)

        setTimeout(() => {
            if (scrollToTopRef.current) {
                scrollToTopRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }, 200)
    }


    return (
        <div className={`paginationBar ${bouncedKeywords.length > 0 ? 'visible' : 'invisible'} `}>
            <div
                className={`homePageNext ${currentPage === 1 ? 'homeNextDeactivate' : ''}`}
                onClick={currentPage === 1 ? null : () => handlePageChange(currentPage - 1)}
            >
                <IoIosArrowDropleft />
            </div>
            <div
                className={`homePageNext ${(currentPage == totalPages || totalPages === 0) ? 'homeNextDeactivate' : ''}`}
                onClick={(currentPage === totalPages || totalPages === 0) ? null : () => handlePageChange(currentPage + 1)}
            >
                <IoIosArrowDropright />
            </div>
        </div>
    )
}

export default PageBar
