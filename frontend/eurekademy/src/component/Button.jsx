import React from 'react'

const Button = ({onClick, text, className}) => {
  return (
    <button
        onClick={onClick}
        className={`${className} rounded-full py-1 px-10 font-semibold`}
    >
        {text}
    </button>
  )
}

export default Button