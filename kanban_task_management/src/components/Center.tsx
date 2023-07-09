import React, { useEffect, useState } from "react"
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import AddEditBoardModal from "../modals/AddEditBoardModal";


interface Props {
  setboardModalOpen: (isOpen: boolean) => void;
}

const Center: React.FC<Props> = ({ setboardModalOpen }) => {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerHeight,
    window.innerWidth
  ]);

  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
 const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)

  const boards: any[] = useSelector((state: any) => state.boards);
  const board = boards.find((board: any) => board.isActive === true);
  const columns = board.columns;



  // use effect bysa3ed n-track el device screen size immediately men gher dependacies.
  useEffect(() => {
      const handleWindowResize = () => {
            setWindowSize([window.innerWidth , window.innerHeight])
      }
      window.addEventListener("resize", handleWindowResize)

      return () => {
          window.removeEventListener("resize", handleWindowResize)
      }
  },[])

  return (
    <div
    className={
      windowSize[0] >= 768 && isSideBarOpen ? 'bg-[#f4f7fd] scrollbar-hide h-screen flex dark:bg-[#20212c] overflow-x-scroll gap-6 ml-[261px]'
      : 'bg-[#f4f7fd] scrollbar h-screen flex dark:bg-[#20212c] overflow-x-scroll gap-6'
    }
    >
      {
        windowSize[0] >= 768 && (
          <SideBar 
          setIsBoardModalOpen={setboardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          />
        )
      }



      {/*  Column Section*/}
      {columns.length > 0 ? (
        <>
          {columns.map((col: any, index : number) => (
            <Column key={index} colIndex={index} />
          ))}
          <div
            onClick={() => {
              setboardModalOpen(true);
            }}
            className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
          >
            + New Column
          </div>
        </>
      ): (
        <>
          <EmptyBoard type='edit' />
        </>
      )}

      {
        isBoardModalOpen && (
          <AddEditBoardModal
          type="edit"
          setboardModalOpen={setIsBoardModalOpen}
          />
        )
      }

    </div>
  );
}

export default Center;