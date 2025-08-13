import React from 'react'

function Button({text}) {
  return (
    <button className='bg-btn-blue text-white p-2 lg:p-3 rounded-lg text-xs md:text-sm lg:text-base lg:hover:bg-white lg:hover:text-black lg:hover:border-2 lg:hover:border-btn-blue lg:hover:p-2'>
      {text}
    </button>
  )
}

export default Button;
