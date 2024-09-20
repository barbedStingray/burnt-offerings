import React from 'react'

// React.memo - wraps a functional component to memorize output
// if props stay the same between rerenders, the component wont rerender
// useMemo memorizes values or computations INSIDE a functional component

// ?React.memo/useMemo Quest? - callback to reduce re-renders?
// const DetailInput = React.memo({ inputDetails }) => {

const DetailInput = ({ inputDetails }) => {
  const { name, type, placeholder, required, minLength, maxLength, autoComplete, value, onChange } = inputDetails
  // console.log(name, type, placeholder, required, minLength, maxLength, autoComplete)
  // could add pattern for acceptable characters/numbers/symbols
  // todo what select doesnt use returns undefined

  // todo import your measurements to here... no need to pass them through props to createRecipe
  const measurementOptions = ['Tbsp', 'Cups', 'Tsp', 'oz']


  if (type === 'select') {
    return (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option>Looped Select...</option>
        {measurementOptions.map((option, i) => (
          <option key={i} value={option}>{option}</option>
        ))}
      </select>
    )
  }

  if (type === 'textarea') {
    return (
      <textarea
        // should have a key
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <input
      // should have a key
      name={`${name}`}
      type={`${type}`}
      placeholder={`${placeholder}`}
      value={value}
      onChange={onChange}
    />
  )
}

export default DetailInput
