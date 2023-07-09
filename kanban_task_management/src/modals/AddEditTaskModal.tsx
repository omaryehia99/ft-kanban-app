import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid'
import crossIcon from '../assets/icon-cross.svg'
import { useDispatch, useSelector } from 'react-redux';
import boardsSlice from '../redux/boardsSlice';

interface AddEditTaskModalProps {
  type: string;
  device: string;
  setOpenAddEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  prevColIndex: number;
  taskIndex: number;
}


const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({ type, device, setIsTaskModalOpen, setOpenAddEditTask, taskIndex , prevColIndex = 0}) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
  const [isValid, setisValid] = useState(true)

  const board = useSelector((state: any) => state.boards).find(
    (board: any) => board.isActive
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true)
    const columns = board.columns
    const col = columns.find((col: any, index: number) => index === prevColIndex);

    const [status, setStatus] = useState(columns[prevColIndex].name)
    const [newColIndex, setNewColIndex] = useState(prevColIndex)
    const task = col ? col.tasks.find((task: any, index: number) => index === taskIndex) : [];


    const [subtasks, setSubTasks] = useState<Array<{title: string, isCompleted: boolean, id: string}>>([
        {title: '', isCompleted: false, id: uuidv4()},
        {title: '', isCompleted: false, id: uuidv4()},
    ]);

    if (type === 'edit' && isFirstLoad)
    {
      setSubTasks(
        task.subtasks.map((subtask : any) => {
          return { ...subtask , id:uuidv4() }
        })
      )
      setTitle(task.title)
      setDescription(task.description)
      setIsFirstLoad(false)
    }

    const onDelete = (id: string,) : void => {
        setSubTasks( (perState : any[]) => perState.filter((el) => el.id !== id) )
      
      }

      

      const onChange = (id: string, newValue: any): void => {
        setSubTasks((perState: any[]) => {
          const newState = [...perState];
          const subtask = newState.find((subtask) => subtask.id === id);
          subtask.title = newValue;
          return newState;
        });
      }

      const validate = () => {
        setisValid(false)
        if(!title.trim())
        {
          return false
        }

        for (let i = 0; i <subtasks.length; i++)
        {
          if (!subtasks[i].title.trim())
          {
            return false
          }
        }
        setisValid(true)
        return true
  }

  const onSubmit = (type: string): void => {
    if (type === 'add') {
      dispatch(
        boardsSlice.actions.addTask({
          title,
          description,
          subtasks,
          status,
          newColIndex,
        })
      );
    }else 
    {
        dispatch(
            boardsSlice.actions.editTask({
                title,
                description,
                status: '',
                subtasks,
                prevColIndex: 0,
                newColIndex,
                taskIndex,
            })
    )} 
  }

  const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  }
  
  
    return (
    <div 
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
      className={
        device === 'mobile' 
        ? 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]'
        : 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 bg-[#00000080]'
      }
    >


        {/* Modal Section */}

        <div className='scrollbar-hide overflow-y-scroll max-h-[100vh] my-auto bg-white dark:bg-[#2b2c37] text-black
        dark:text-white shadow-md shadow-[#364e7e1a] max-w-md mx-auto px-8 py-8 rounded-xl w-full
        '>
            <h3 className='text-lg font-bold '>
                {type === 'edit' ? 'Edit' : 'Add New'} Task
            </h3>
                        {/* Task Name */}
            
            <div
            className='mt-8 flex flex-col space-y-1'
            >
                <label className='text-sm font-bold dark:text-white text-gray-500'>
                    Title
                </label>
                <input type='text' 
                value={title}
                onChange={(e) => setTitle(e.target.value) }
                className='text-black bg-transparent px-4 py-2 outline-none 
                focus:border-0 rounded-md text-sm border border-gray-600
                focus:outline-[#635fc7] ring-0  dark:text-white'
                placeholder=' e.g Take coffee break' />
            </div>

            {/* Description */}

            <div
            className='mt-8 flex flex-col space-y-1'
            >
                <label className='text-sm font-bold dark:text-white text-gray-500'>
                Description
                </label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value) }
                className='text-black justify-start bg-transparent px-4 py-2 outline-none 
                focus:border-0 rounded-md text-sm border border-gray-600
                focus:outline-[#635fc7] ring-0 min-h-[200px]'
                placeholder=' e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little. ' />
            </div>

            {/* Subtasks Section */}
            <div
            className='mt-8 flex flex-col space-y-1'
            >
                <label className='text-sm font-bold dark:text-white text-gray-500'>
                Subtasks
                </label>

                {
                    subtasks.map((subtask ,index) => (
                        <div key={index} className=' flex items-center w-full'>
                            <input 
                            onChange={(e) =>
                            {
                                onChange (subtask.id, e.target.value);
                            } }
                            type='text' 
                            value={subtask.title} 
                            className='bg-transparent outline-none focus:border-0 flex-grow px-4 py-2
                            rounded-md text-sm border-gray-600 focus:outline-[#635fc7] border mt-2 mb-2
                            ' placeholder='e.g Take coffee break'/>
                            
                            <img 
                            onClick={() => 
                            {
                                onDelete(subtask.id);
                            }}
                            src={crossIcon} className='m-4 cursor-pointer' /> 
                        </div>

                    ))
                }
                <button
                onClick={()=> 
                {
                    setSubTasks((state) => [
                        ...state,
                        {title: '', isCompleted: false, id: uuidv4()},
                    ])
                }}
                className='w-full items-center dark:bg-white text-[#635fc7] bg-[#F4F7FD]
                py-2 rounded-full font-bold'>
                    + Add New Subtask
                </button>

            </div>

            {/* Current Status Section */}

            <div className='mt-8 flex flex-col space-y-3'>
                <label className='text-sm font-bold dark:text-white text-gray-500'>Status</label>
                <select
                value={status}
                onChange={onChangeStatus}
                className='
                select-status flex flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border
                border-gray-300 focus:outline-[#635fc7] outline-none
                '>
                    {columns.map((column: {name: string}, index: number) => (
                        <option
                            value={column.name}
                            key={index}>
                            {column.name}
                        </option>
                    ))}
                </select>

                <button 
                onClick={() => 
                {
                    const isValid = validate();
                    if (isValid)
                    {
                        onSubmit(type)
                        setIsTaskModalOpen(false)
                        type === 'edit' && setIsTaskModalOpen(false)
                    }
                }}
                className='w-full items-center font-bold text-white bg-[#635fc7] py-2 rounded-full'>
                    {type === 'edit' ? 'Save Edit' : 'Create Task'}
                </button>
            </div>


        </div>
    </div>
  );
}

export default AddEditTaskModal;