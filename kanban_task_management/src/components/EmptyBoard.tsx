import React, { useState } from 'react';
import AddEditBoardModal from '../modals/AddEditBoardModal';

interface EmptyBoardProps {
  type: string;
}

const EmptyBoard: React.FC<EmptyBoardProps> = ({ type }) => {
  const [isBoardModal, setIsBoardModal] = useState(false);

  return (
    <div className='bg-white dark:bg-[#2b2c37] h-screen w-screen flex flex-col items-center justify-center'>
      <h3 className='text-gray-500 font-bold'>
        {type === 'edit' ? 'This board is empty. create a new column to get started' : 'There are no boards available. Create a new board to get started'}
      </h3>
      <button 
      onClick={() => 
    {
        setIsBoardModal (true)
    }}
      className='w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:-bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full'>
        {type === 'edit' ? '+ Add New Column' : '+ Add New Board'}
      </button>

      {
        isBoardModal && (
            <AddEditBoardModal 
            type={type}
            setboardModalOpen={setIsBoardModal}
            />
        )
      }
    </div>
  );
};

export default EmptyBoard;