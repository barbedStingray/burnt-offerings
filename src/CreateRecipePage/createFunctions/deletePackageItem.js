    // deletePackageItem

    export default function deletePackageItem(i, dataPackage, setDataPackage) {
        console.log('tagindex', i)
        const newPackage = dataPackage.filter((_, index) => index !== i)
        console.log('newPackage', newPackage)
        setDataPackage(newPackage)
    }

    

