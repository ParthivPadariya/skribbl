import React from 'react'
import GameBoard from '@/components/gameBoard'

import GameChat from '@/components/gameChat'
import GamePlayer from '@/components/gamePlayer'

interface propsType {
  params : {
    game:string
  }
}
const page:React.FC<propsType> = ({params}) => {
  // console.log(params.game);
  
  return (
    <>
      <div className="flex justify-center item-center gap-3 mx-2">
        <GamePlayer/>
        <GameBoard user={params.game}/>
        <GameChat /> 
      </div>
    </>
  )
}

export default page
