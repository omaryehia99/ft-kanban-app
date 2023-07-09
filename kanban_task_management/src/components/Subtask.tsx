import React  from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import boardsSlice from '../redux/boardsSlice';
interface Props {
  index: number;
  taskIndex: number;
  colIndex: number;
}

const Subtask: React.FC<Props> = ({ index, taskIndex, colIndex }) => {

    const dispatch = useDispatch();

    const boards = useSelector((state: any) => state.boards);
    const board = boards.find((board: { isActive: any; }) => board.isActive);
    const columns = board.columns;
    const col = columns.find((column:any, i:number) => colIndex === i);
    const task = col.tasks.find((col : any, i: number) => taskIndex === i);
    const subtask = task.subtasks.find((subtask: any, i: number) => i === index);
    const checked = subtask.isCompleted

    const onChange = () => {
        dispatch(
            boardsSlice.actions.setSubtaskCompleted({index , taskIndex ,colIndex})
        )
    }

  return (
    <div className=' w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740]
    rounded-md relative items-center justify-start dark:bg-[#20212c] p-3 gap-4
    bg-[#f4f7fd]'>
        <input type='checkbox' className=' w-4 h-4 accent-[#635fc7] cursor-pointer'
        checked={checked}
        onChange={onChange} />

        <p className={checked && ' line-through opacity-30'}>
                {subtask.title}
        </p>
    </div>
  )
}

export default Subtask