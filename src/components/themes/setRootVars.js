
// Function to set CSS root variables based on the selected color set
export const setRootVariables = (colorSet) => {
  const root = document.documentElement;
  root.style.setProperty('--background-one', colorSet.backgroundOne)
  root.style.setProperty('--background-two', colorSet.backgroundTwo)
  root.style.setProperty('--prime-one', colorSet.primeOne)
  root.style.setProperty('--prime-two', colorSet.primeTwo)
  root.style.setProperty('--accent-one', colorSet.accentOne)
  root.style.setProperty('--accent-two', colorSet.accentTwo)
  root.style.setProperty('--shadow', colorSet.shadow)
  root.style.setProperty('--trans-color', colorSet.transColor)
  root.style.setProperty('--blend0', colorSet.blend0)
  root.style.setProperty('--blend1', colorSet.blend1)
  root.style.setProperty('--blend2', colorSet.blend2)
  root.style.setProperty('--blend3', colorSet.blend3)
  root.style.setProperty('--blend4', colorSet.blend4)
  root.style.setProperty('--blend5', colorSet.blend5)
}