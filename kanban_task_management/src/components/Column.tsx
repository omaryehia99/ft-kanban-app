import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {shuffle} from 'lodash'
import Task from './Task';
import boardsSlice from '../redux/boardsSlice';
interface ColumnProps {
  colIndex: number;
}

const Column: React.FC<ColumnProps> = ({ colIndex }) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-indigo-500',
    'bg-sky-500',
  ];

  const [color, setColor] = useState<string | null>(null);
  const dispatch = useDispatch();

  const boards: any = useSelector((state: any) => state.boards);
  const board: any = boards.find((board: any) => board.isActive);
  const col: any = board?.columns.find((col: any, i: number) => i === colIndex);

  useEffect(() => setColor(shuffle(colors).pop()), [dispatch]);


  const handleOnDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const { prevColIndex, taskIndex } = JSON.parse(
        e.dataTransfer.getData("text")
    );

    if (colIndex !== prevColIndex)
    {
      dispatch (
        boardsSlice.actions.dragTask({colIndex , prevColIndex , taskIndex})
      )
    }
}

  return (
    <div
    onDrop={handleOnDrop} 
    onDragOver={handleOnDragOver}
    className=' scrollbar-hide mx-5 pt-[90px] min-w-[280px] '>
        <p className=' font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]'>
            <div className={` rounded-full w-4 h-4 ${color}`}/>
            {col.name} ({col?.tasks?.length})
        </p>
        {
    col.tasks?.map((task: any, index: number) => 
    (
        <Task key={index} taskIndex={index} colIndex={colIndex} />
    ))
}
    </div>
  )
};

export default Column;
