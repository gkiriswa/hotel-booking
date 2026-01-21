import React from 'react'

const Title = ({ title, subtitle, align='center', font }) => {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];
  return (
    <div className={alignmentClass}>
        <h1 className={`text-4xl md:text-[40px] ${font || "font-playfair"}`}>{title}</h1>
        <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>{subtitle}</p>
    </div>
  )
}

export default Title