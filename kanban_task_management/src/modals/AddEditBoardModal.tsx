
import React , {useState} from "react";
import {v4 as uuidv4} from 'uuid';
import iconCross from '../assets/icon-cross.svg'
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardsSlice";


interface Props {
  setboardModalOpen: (isOpen: boolean) => void;
  type: string;
}
const AddEditBoardModal: React.FC<Props> = ({ setboardModalOpen, type }) => {
  const dispatch = useDispatch()
  const [name , setName ]: [string, (value: string) => void] = useState('')
  const [isFirstLoad, setisFirstLoad] = useState(false)
  const [isValid, setisValid] = useState(true)
  const board = useSelector((state: any) => state.boards.find((board : any) => board.isActive));

  const [newColumns, setnewColumns] = useState(
    [
      {name : 'Todo' , task : [] , id: uuidv4()},
      {name : 'Doing' , task : [] , id: uuidv4()},
      
    ]
  )

  if (type === 'edit' && isFirstLoad) {
    setnewColumns(
      board.columns.map((col: any) => {
        return { ...col, id: uuidv4() };
      })
    );
    setName(board.name);
    setisFirstLoad(false);
  }

  const onChange = (id: string, newValue: any): void => {
    setnewColumns((perState: any[]) => {
      const newState = [...perState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  }

  const onDelete = (id: string,) : void => {
    setnewColumns( (perState : any[]) => perState.filter((el) => el.id !== id) )
  
  }


  const validate = () => {
        setisValid(false)
        if(!name.trim())
        {
          return false
        }

        for (let i = 0; i <newColumns.length; i++)
        {
          if (!newColumns[i].name.trim())
          {
            return false
          }
        }
        setisValid(true)
        return true
  }


  const onSubmit = (type: string): void =>
  {
    if (type === 'add')
    {
      dispatch(boardsSlice.actions.addBoard({name, newColumns}));
    } else 
    {
      dispatch(boardsSlice.actions.editBoard({name, newColumns}));
    }
  
  }



    return (
      <div
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          setboardModalOpen(false);
        }}
        className="fixed right-0 left-0 top-0 bottom-0 px-2 scrollbar-hide py-4 overflow-scroll z-50 justify-center items-center flex bg-[#00000080]"
      >

        {/* Modal Section */}
        <div className=' scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white shadow-md shadow-[#364e7e1a]
        max-w-md smx-auto w-full px-8 py-8 rounded-xl'>
        

        <h3 className='text-lg font-bold'>
            { type  === 'edit' ? 'Edit' : 'Add New'} Board
        </h3>

        
            {/* Task Name */}
            <div className='mt-8 flex flex-col space-y-3'>
              <label className='text-sm dark:text-white font-bold text-gray-500'>
                Board Name
              </label>
              <input className=' bg-transparent px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#735fc7] outline-l ring-0'
              placeholder=' e.g Web Design'
              value={name}
              onChange={(e) => 
              {
                setName(e.target.value);
              }}
              />
            </div>
            {/* Board Columns */}

            <div className=' mt-8 flex flex-col space-y-3'>
              <label> 
                Board Columns 
              </label>

              {
                newColumns.map((column , index) =>(
                  <div key={index} className=' flex items-center w-full'>
                    <input className='bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#735fc7] '
                    onChange={(e) => 
                    {
                      onChange(column.id , e.target.value)
                    }}
                    placeholder=""
                    value={column.name}
                    type="text" />
                    <img src={iconCross} alt="" className='cursor-pointer m-4'
                    onClick={() => 
                    {
                      onDelete(column.id)
                    }} />
                  </div>
                ))
              }
            </div>

            <div>
              <button className='w-full items-center hover:opacity-75 text-[#635fc7]
              dark:bg-white bg-[#F4F7FD] mt-2 py-2 rounded-full font-bold'
              onClick={() => 
              {
                setnewColumns ( (state) => 
                [
                  ...state,
                  {name : '' , task : [] , id: uuidv4()},
                ])
              }} >
                +Add New Column
              </button>

              <button className='w-full items-center hover:opacity-75 dark:text-white 
              dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full
              font-bold 
              '
              onClick={() => 
              {
                const isValid = validate()
                if (isValid === true) onSubmit (type)
              }}>
                { type === 'add' ? 'Create New Board' : 'Save Changes'}
              </button>
            </div>

            </div>
      </div>
    );
  };
  
  export default AddEditBoardModal;

  