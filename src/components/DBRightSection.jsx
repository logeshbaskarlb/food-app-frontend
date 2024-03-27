import React from 'react'
import {DBHeader, DBHome, DBItems, DBNewItems, DBOrder, DBUser} from '../components'
import { Route, Routes } from 'react-router-dom'

const DBRightSection = () => {
  return (
    <div className='flex flex-col py-12 px-12 flex-1 h-full '>
      <DBHeader />
      <div className='flex flex-col flex-1 overflow-y-scroll scrollbar-none'>
        <Routes>
            <Route path='/home' element={<DBHome />}></Route>
            <Route path='/orders' element={<DBOrder />}></Route>
            <Route path='/items' element={<DBItems />}></Route>
            <Route path='/newItem' element={<DBNewItems />}></Route>
            <Route path='/users' element={<DBUser />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default DBRightSection
