import mixedToNumber from "./mixedToNumber"
import numberToMixed from "./numberToMixed"


export default function displayQuantity(details, multiplier) {
    const numericValue = mixedToNumber(details)
    if (numericValue === null) return details // if conversion fails, return og string
    const multiplyQuantity = numericValue * multiplier
    const mixedNumberString = numberToMixed(multiplyQuantity)
    return mixedNumberString
}
