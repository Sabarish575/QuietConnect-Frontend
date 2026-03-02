import React from 'react'

function Card() {
const features = [
  {
    title: "Interest-Based Communities",
    description: "Join quiet spaces to share thoughts and connect over your interests with like-minded people."
  },
  {
    title: "Private Text Conversations",
    description: "Have simple one-on-one chats built for clarity, comfort, and shared interests—text only."
  },
  {
    title: "Social Energy Tracker",
    description: "Check in daily, track your social mood, and get gentle activity suggestions based on your energy."
  }
];



  return (

    <section className='w-full flex items-center justify-center mb-25'>
      <div className='flex flex-col space-x-5 lg:flex-row'>
        {features.map((item,index)=>
          <div key={index} className="w-[250px] cursor-pointer flex flex-col items-center space-y-3 text-white px-4 py-6 rounded-2xl hover:shadow-lg hover:translate-y-2 hover:shadow-gray-900/60 bg-gradient-to-tr transition-all duration-300 ease-in  hover:from-gray-800 hover:via-gray-700 hover:to-gray-900">
            <h1 className="text-xl text-center font-semibold tracking-wide md:text-2xl">{item.title}</h1>
            <p className="text-gray-300 text-center">{item.description}</p>
          </div>
        )}
      </div>
    </section>

  )
}

export default Card