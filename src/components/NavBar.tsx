import Image from 'next/image'
import React from 'react'

// Image
import Timer from '../assets/Timer.png'
import Setting from '../assets/Setting.png'

const NavBar = () => {

  const randomName = ["Lion","Bag", "Elephants", "Milk", "Water", "Rain", "River", "grass"];
  const randomIndex = Math.floor(Math.random()*10+1);

  // const size = randomName[randomIndex].length;
  // console.log(randomIndex);
  
  return (
    <div className='flex justify-center items-center p-2 my-2 mt-8 w-11/12 border'>
        
        <Image 
          src={Timer}
          width={50}
          height={50}
          alt="Picture of Timer"/>
        <p>No of Round:1</p>

        <div className='flex flex-col justify-center items-center w-10/12 '>
            <p>Guess This</p> 
            {
              <div>
                <span>_</span>
                <span>_</span>
                <span>_</span>
                <span>_</span>
              </div>

            }
        </div>

        <Image 
          src={Setting}
          width={50}
          height={50}
          alt="Picture of Setting"/>
    
    </div>
  )
}

export default NavBar
