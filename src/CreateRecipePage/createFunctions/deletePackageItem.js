    // deletePackageItem

    export default function deletePackageItem(i, dataPackage, setDataPackage) {
        console.log('tagindex', i)
        const newPackage = dataPackage.filter((_, index) => index !== i)
        console.log('newPackage', newPackage)
        setDataPackage(newPackage)
    }

    // export default function deletePackageItem(i, dataPackage, setDataPackage) {
    //     if (window.confirm('Are you sure you would like to delete this item?')) {
    //         console.log('tagindex', i)
    //         const newPackage = dataPackage.filter((_, index) => index !== i)
    //         console.log('newPackage', newPackage)
    //         setDataPackage(newPackage)
    //     }
    // }
    

