import mixedToNumber from "./mixedToNumber"
import numberToMixed from "./numberToMixed"


export default function displayQuantity(detail, multiplier) {
    const numericValue = mixedToNumber(detail)
    if (numericValue === null) return detail // if conversion fails, return og string
    const multiplyQuantity = numericValue * multiplier
    const mixedNumberString = numberToMixed(multiplyQuantity)
    return mixedNumberString
}
