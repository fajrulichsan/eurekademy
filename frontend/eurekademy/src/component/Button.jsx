import React from 'react'

const Button = ({onClick, text, className, disabled}) => {
  return (
    <button
        onClick={onClick}
        className={`${className}`}
        disabled = {disabled}
    >
        {text}
    </button>
  )
}

export default Button