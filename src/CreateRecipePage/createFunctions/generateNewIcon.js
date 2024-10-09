
const iconStrings = ['dinner', 'fish', 'lunch', 'snack', 'egg']

export default function randomIconNumber() {
    const randomNumber = Math.floor(Math.random() * iconStrings.length)
    return iconStrings[randomNumber]
}
