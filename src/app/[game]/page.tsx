import React from 'react'
import GameBoard from '@/components/gameBoard'

import GameChat from '@/components/gameChat'
import GamePlayer from '@/components/gamePlayer'

interface paramsType {
  game:string
}
const page:React.FC<paramsType> = (params) => {
  
  return (
    <>
      <div className="flex justify-center item-center gap-3 mx-2">
        <GamePlayer/>
        <GameBoard/>
        <GameChat userName={params.game}/> 
      </div>
    </>
  )
}

export default page
