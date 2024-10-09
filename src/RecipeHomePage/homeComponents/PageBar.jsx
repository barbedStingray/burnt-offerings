import React from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";


const PageBar = ({ pageStatus }) => {
    const { currentPage, setCurrentPage, totalPages } = pageStatus

    return (
        <div className='paginationBar'>
            <div
                className={`homePageNext ${currentPage === 1 ? 'homeNextDeactivate' : ''}`}
                onClick={currentPage === 1 ? null : () => setCurrentPage(currentPage - 1)}
            >
                <IoIosArrowDropleft />
            </div>
            <div
                className={`homePageNext ${currentPage === totalPages ? 'homeNextDeactivate' : ''}`}
                onClick={currentPage === totalPages ? null : () => setCurrentPage(currentPage + 1)}
            >
                <IoIosArrowDropright />
            </div>
        </div>
    )
}

export default PageBar
