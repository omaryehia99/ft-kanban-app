import React, { useState } from 'react';
import logo from '../assets/logo-mobile.svg';
import iconDown from '../assets/icon-chevron-down.svg';
import iconUp from '../assets/icon-chevron-up.svg';
import elipsis from '../assets/icon-vertical-ellipsis.svg';
import '../index.css';

import HeaderDropDown from './HeaderDropDown';
import AddEditBoardModal from '../modals/AddEditBoardModal';
import { useDispatch, useSelector } from 'react-redux';
import AddEditTaskModal from '../modals/AddEditTaskModal';
import ElipsisMenu from './ElipsisMenu';
import DeleteModal from '../modals/DeleteModal';
import boardsSlice from '../redux/boardsSlice';

interface Props {
  setboardModalOpen: any;
  boardModalOpen: any;
}

interface Board {
  id: number;
  isActive: boolean;
  name: string; // Add name property
}

const Header: React.FC<Props> = ({ setboardModalOpen, boardModalOpen }) => {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openAddEditTask, setopenAddEditTask] = useState(false);
  const [isElipsisOpen, setIsElipsisOpen] = useState(false);
  const [boardType, setBoardType] = useState<'add' | 'edit'>('add'); // Specify type

  const onDropDownClick = () => {
    setOpenDropdown((state) => !state);
    setIsElipsisOpen(false);
    setBoardType('add');
  };

  const boards: Board[] = useSelector((state: any) => state.boards);
  const board: Board | undefined = boards.find((board: Board) => board.isActive);

  const setOpenEditModal = () => {
    setboardModalOpen(true);
    setIsElipsisOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsElipsisOpen(false);
  };

  const onDeleteBtnClick = () => {
    dispatch(boardsSlice.actions.deleteBoard());
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0">
      <header className="flex justify-between dark:text-white items-center">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-4 ">
          <img src={logo} alt="logo" className="h-6 w-6 " />
          <h3 className="hidden md:inline-block font-sans font-bold md:text-4xl ">
            Kanban
          </h3>
          <div className="flex items-center ">
            <h3 className="truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              {board?.name}
            </h3>
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown icon"
              className="w-3 ml-2 cursor-pointer md:hidden"
              onClick={onDropDownClick}
            />
          </div>
        </div>

        {/*Right Side */}
        <div className="flex space-x-4 items-center md:space-x-6">
          <button
            onClick={() => {
              setopenAddEditTask((state) => !state);
            }}
            className="hidden md:block button"
          >
            + Add New Task
          </button>

          <button
            className="button py-1 px-3 md:hidden"
            onClick={() => {
              setopenAddEditTask((state) => !state);
            }}
          >
            +
          </button>
          <img
            src={elipsis}
            onClick={() => {
              setBoardType('edit');
              setOpenDropdown(false);
              setIsElipsisOpen((state) => !state);
            }}
            alt="3Dots icon"
            className="cursor-pointer h-6"
          />

          {isElipsisOpen && (
            <ElipsisMenu
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              type="Boards"
            />
          )}
        </div>
      </header>

      {openDropdown && (
        <HeaderDropDown
          setboardModalOpen={setboardModalOpen}
          setOpenDropdown={setOpenDropdown}
        />
      )}

      {boardModalOpen && (
        <AddEditBoardModal
          type={boardType}
          setboardModalOpen={setboardModalOpen}
        />
      )}

      {openAddEditTask && (
        <AddEditTaskModal
          setOpenAddEditTask={setopenAddEditTask}
          setIsTaskModalOpen={setIsTaskModalOpen}
          device="mobile"
          type="add"
          prevColIndex={0}
          taskIndex={0}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="board"
          title={board?.name}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )}
    </div>
  );
};

export default Header;