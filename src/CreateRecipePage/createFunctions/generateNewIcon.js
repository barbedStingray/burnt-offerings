
const iconStrings = ['dinner', 'fish', 'lunch', 'snack', 'egg']

export default function randomIconNumber() {
    const randomNumber = Math.floor(Math.random() * 5)
    return iconStrings[randomNumber]
}
