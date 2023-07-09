import { useDispatch, useSelector } from "react-redux";
import Center from "./components/Center";
import Header from "./components/Header";
import {useState} from 'react'
import boardsSlice from "./redux/boardsSlice";
import EmptyBoard from "./components/EmptyBoard";

function App ()
{
  const dispatch = useDispatch()
  const boards = useSelector((state:any) => state.boards)
  const activeBoard = boards.find((board: any) => board.isActive)

      if (!activeBoard && boards.length > 0) {
      dispatch(boardsSlice.actions.setBoardActive({index : 0}))
      }

 const [boardModalOpen, setboardModalOpen] = useState(false)

  return (
    
    <div className=' overflow-hidden overflow-x-scroll  scrollbar-hide'>
      <>
      {boards.length > 0 ?
      <>
                {/*Header Section */}
                <Header boardModalOpen = {boardModalOpen} setboardModalOpen = {setboardModalOpen} />

                {/*Center Section */}
                <Center setboardModalOpen={setboardModalOpen}/>
      </>
      :
      <>
          <EmptyBoard type='add' />
      </>
    }


      </>
    </div>
  )
}
export default App;