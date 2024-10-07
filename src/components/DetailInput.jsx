import React from 'react'
import measurementOptions from './measurements'

// React.memo - wraps a functional component to memorize output
// if props stay the same between rerenders, the component wont rerender
// useMemo memorizes values or computations INSIDE a functional component

// ?React.memo/useMemo Quest? - callback to reduce re-renders?
// const DetailInput = React.memo({ inputDetails }) => {

  // ! there is no e in this... ? does that matter? 
const DetailInput = ({ inputDetails }) => {
  const { name, className, type, placeholder, required, minLength, maxLength, autoComplete, value, onChange } = inputDetails
  // console.log(name, type, placeholder, required, minLength, maxLength, autoComplete)
  // could add pattern for acceptable characters/numbers/symbols
  // todo what select doesnt use returns undefined



  if (type === 'select') {
    return (
      <select
        name={name}
        className={className}
        value={value}
        onChange={onChange}
        required
      >
        <option value=''>Mea.</option>
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
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <input
      // should have a key
      name={`${name}`} // todo see if these need to be `${}` ?
      className={className} // this works...
      type={`${type}`}
      placeholder={`${placeholder}`}
      value={value}
      onChange={onChange}
      minLength={minLength}
      maxLength={maxLength}
    />
  )
}

export default DetailInput
