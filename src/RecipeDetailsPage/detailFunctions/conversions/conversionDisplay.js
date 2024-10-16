import mixedToNumber from "./mixedToNumber"
import numberToMixed from "./numberToMixed"


const conversionMap = {
    Cup: { tbsp: 16 },
    Tbsp: { tsp: 3 },
}

const conversionThresholds = {
    Cup: 0.25,
    Tbsp: 0.5,
}

function convertUnits(quantity, fromUnit, toUnit) {
    if (conversionMap[fromUnit] && conversionMap[fromUnit][toUnit]) {
        const conversionFactor = conversionMap[fromUnit][toUnit]
        return quantity * conversionFactor
    }
    return quantity
}


export default function conversionDisplay(detail, measurement, multiplier) {
    const numericValue = mixedToNumber(detail)
    if (numericValue === null) return { quantity: detail, measurement } // if conversion fails, return original values

    let multipliedQuantity = numericValue * multiplier

    const formatQuantity = measurement === 'oz' ?
        multipliedQuantity
        :
        numberToMixed(multipliedQuantity.toFixed(2)) // back to fraction if necessary

    console.log('final FORMAT', formatQuantity, measurement)
    return { quantity: formatQuantity, measurement: measurement }
}
