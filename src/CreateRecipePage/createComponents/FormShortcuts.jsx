import React from 'react'
import scrollToForm from '../createFunctions/scrollFunctions/scrollToForm'


const FormShortcuts = ({ formIndex, formContainerRef }) => {
    const formShortcuts = ['R', 'sR', 'IN', 'ST', 'TA', 'Check']

    return (
        <div className='createFormNavigation'>
            {formShortcuts.map((label, i) => (
                <div
                    className={`
                navigateForm
                ${formIndex === i ? 'identifyNavigate' : ''}
                ${i === formShortcuts.length - 1 ? 'lastNavigate' : ''}
                `}
                    key={i}
                    onClick={() => scrollToForm(i, formContainerRef)}
                >{label}</div>
            ))}
        </div>
    )
}

export default FormShortcuts
