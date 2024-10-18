    // turn whole number into a string fraction/mixed
    export default function numberToMixed(value) {
        const wholePart = Math.floor(value)
        const fractionPart = value - wholePart
        if (fractionPart === 0) return wholePart.toString() // no fractions

        const scale = [
            { decimal: 0, fraction: '<1/8' },
            { decimal: 0.125, fraction: '1/8' },
            { decimal: 0.25, fraction: '1/4' },
            { decimal: 0.333, fraction: '1/3' },
            { decimal: 0.375, fraction: '3/8' },
            { decimal: 0.5, fraction: '1/2' },
            { decimal: 0.625, fraction: '5/8' },
            { decimal: 0.666, fraction: '2/3' },
            { decimal: 0.75, fraction: '3/4' },
            { decimal: 0.875, fraction: '7/8' },
            { decimal: 1.0, fraction: '1' }
        ]

        function findClosestFraction(decimal) {
            let closest = scale[0]
            let minDiff = Math.abs(decimal - closest.decimal)
            scale.forEach(item => {
                const diff = Math.abs(decimal - item.decimal)
                if (diff < minDiff) {
                    closest = item
                    minDiff = diff
                }
            })
            return closest.fraction
        }

        const fractionString = findClosestFraction(fractionPart)
        if (fractionString === '1') {
            return `${wholePart + 1}`
        }
        return wholePart === 0 ? `${fractionString}` : `${wholePart} ${fractionString}`
    }
