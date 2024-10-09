
    export default function deletePackageItem(i, dataPackage, setDataPackage) {
        const newPackage = dataPackage.filter((_, index) => index !== i)
        setDataPackage(newPackage)
    }

    

