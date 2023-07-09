import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskModal from '../modals/TaskModal';

interface TaskProps {
  taskIndex: number;
  colIndex: number;
}

const Task: React.FC<TaskProps> = ({ taskIndex, colIndex }) => {
    
  const boards: any = useSelector((state: any) => state.boards);
  const board: any = boards.find((board: any) => board.isActive);
  const columns: any = board.columns;
    const col: any = columns.find((col: any, i: number) => i === colIndex);
    const task = col.tasks.find((task: any , i: number) => i === taskIndex);


    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

    let completed: number = 0;
    let subtasks: Subtask[] = task.subtasks;
    
    subtasks.forEach((subtask: Subtask) => {
        if (subtask.isCompleted) {
            completed++;
        }
    });
    
    interface Subtask {
        isCompleted: boolean;
    }

    const handleOnDrag = (e: React.DragEvent<HTMLDivElement>): void => {
        e.dataTransfer.setData(
            "text",
            JSON.stringify({ taskIndex, prevColIndex: colIndex })
        );
    };

  return (
    <div>
        <div
        onDragStart={handleOnDrag}
        draggable
        onClick={() => 
        {
            setIsTaskModalOpen(true)
        }}
        className='w-[280px] first:my-5 rounded-lg bg-white dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7]
        dark:text-white dark:hover:text-[#635fc7] cursor-pointer'>

                <p className=' font-bold tracking-wide '>
                    {task.title}
                </p>
                <p className=' font-bold text-xs tracking-tighter mt-2 text-gray-500'>
                    {completed} of {subtasks.length} completed tasks
                </p>
        </div>
        {
            isTaskModalOpen && (
                <TaskModal 
                colIndex = {colIndex}
                taskIndex = {taskIndex}
                setIsTaskModalOpen = {setIsTaskModalOpen}/>
            )
        }
    </div>
  );
};

export default Task;