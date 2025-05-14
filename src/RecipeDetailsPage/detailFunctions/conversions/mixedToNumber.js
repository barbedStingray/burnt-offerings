    // turns string quantity into whole number
    export default function mixedToNumber(qtyString) {

        qtyString = qtyString.trim()
        const mixedNumberPattern = /(\d+)\s+(\d+)\/(\d+)/; // e.g., 2 1/3 Mixed number
        const fractionPattern = /(\d+)\/(\d+)/; // e.g., 1/3 Proper fractions

        function sortProperFraction(fractionString) {
            const [numerator, denominator] = fractionString.split('/').map(Number)
            return numerator / denominator
        }

        function sortMixedNumber(mixedString) {
            const parts = mixedString.split(' ')
            const wholePart = Number(parts[0])
            const fractionPart = parts[1]

            if (fractionPart) {
                const [numerator, denominator] = fractionPart.split('/').map(Number)
                return wholePart + (numerator / denominator)
            }
        }

        if (mixedNumberPattern.test(qtyString)) {
            return sortMixedNumber(qtyString)
        } else if (fractionPattern.test(qtyString)) {
            return sortProperFraction(qtyString)
        }

        const wholeNumber = Number(qtyString)
        return isNaN(wholeNumber) ? null : wholeNumber
    }
