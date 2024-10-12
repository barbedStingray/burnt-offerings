import React, { useState } from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";


const PageBar = ({ pageStatus }) => {
    const { currentPage, setCurrentPage, totalPages, scrollToTopRef, apiSearching } = pageStatus

    const [isLoading, setIsLoading] = useState(false)

    
    // const handlePageChange = (newPage) => {
    //         setCurrentPage(newPage)

    //         setTimeout(() => {
    //             if (scrollToTopRef.current) {
    //                 scrollToTopRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    //             }
    //         }, 200)
    // }


    const handlePageChange = async (newPage) => {
        setIsLoading(true); // Start loading
    
        // Set the new current page
        setCurrentPage(newPage);
    
        // Wait for the new content to load
        await new Promise((resolve) => {
            const checkLoading = setInterval(() => {
                if (apiSearching !== 'loading') { // Wait until not loading
                    clearInterval(checkLoading);
                    resolve();
                }
            }, 100); // Check every 100ms
        });
    
        // After new content loads, scroll to the top
        if (scrollToTopRef.current) {
            scrollToTopRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    
        setIsLoading(false); // End loading
    };




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
