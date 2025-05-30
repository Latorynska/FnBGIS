import React, { useEffect } from 'react';

// start dokumentasi penggunaan
// contoh : 

{/* 
  <Pagination
    dataList={dataList}
    itemsPerPage={`10`}
    setCurrentData={setCurrentData}
    numberingData={true}
  /> 
*/}

// dimana props dataList merupakan data raw, atau data mentah berupa array dari objek,
// props itemsPerPage digunakan untuk mengatur dalam satu page tabel, akan menampilkan berapa banyak item
// props setCurrentData digunakan untuk set data yang akan di render di komponent parent, jadi parent perlu data mentah, dan currentData untuk dirender
// props numberingData merupakan opsional true false apabila memang ingin menampilkan numbering data di tabel, set props ini menjadi true
// CATATAN PENTING : apabila menggunakan component ini, artinya data yang di render harus currentData yang dimana setCurrentDatanya dikirim ke component ini sebagai props
// untuk contoh penggunaan secara lengkap, merujuk / lihat ke pages pengingat tanaman
// end dokumentasi penggunaan 


const Pagination = ({ dataList, itemsPerPage, setCurrentData, numberingData }) => {
    const totalItems = dataList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [currentPage, setCurrentPage] = React.useState(1);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        let currentData = dataList.slice(startIndex, endIndex);
        if (numberingData) {
            currentData = currentData.map((item, index) => ({ ...item, number: startIndex + index + 1 }));
        }

        setCurrentData(currentData);
    }, [currentPage, dataList, itemsPerPage, setCurrentData, numberingData]);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const totalPagesToShow = Math.min(totalPages, 4);

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else if (currentPage <= 3) {
            for (let i = 1; i <= Math.min(totalPagesToShow, totalPages); i++) {
                pageNumbers.push(i);
            }
            if (totalPages > totalPagesToShow) {
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        } else if (currentPage > 3 && currentPage <= totalPages - 2) {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = currentPage - 1; i <= Math.min(currentPage + 1, totalPages); i++) {
                pageNumbers.push(i);
            }
            if (totalPages > currentPage + 1) {
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        } else {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = Math.max(totalPages - totalPagesToShow + 2, 2); i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handleEllipsisClick = (direction) => {
        if (direction === 'left' && currentPage > 2) {
            setCurrentPage((prevPage) => prevPage - 2);
        } else if (direction === 'right' && currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 2);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-4 mb-4 gap-2">
            <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}>
                Previous
            </button>

            {generatePageNumbers().map((pageNumber, index) => (
                <button
                    key={index}
                    className={`px-3 py-1 rounded-lg ${currentPage === pageNumber
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-sm'
                            : 'bg-gray-700 hover:bg-gray-600 text-sm'
                        }`}
                    onClick={() => (pageNumber === '...' ? handleEllipsisClick(index === 1 ? 'left' : 'right') : setCurrentPage(pageNumber))}
                >
                    {pageNumber}
                </button>
            ))}

            <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
