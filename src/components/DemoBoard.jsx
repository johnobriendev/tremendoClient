import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { BsThreeDots } from 'react-icons/bs'
import { MdOutlineModeEdit } from 'react-icons/md'

const initialLists = [
  {
    id: 'list-1',
    name: 'To Do',
    cards: [
      { id: 'card-1', name: 'Learn React' },
      { id: 'card-2', name: 'Build a Trello clone' },
    ],
  },
  {
    id: 'list-2',
    name: 'In Progress',
    cards: [
      { id: 'card-3', name: 'Create demo section' },
    ],
  },
  {
    id: 'list-3',
    name: 'Done',
    cards: [
      { id: 'card-4', name: 'Set up project' },
    ],
  },
]

const Card = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-2 mb-2 bg-white rounded shadow group relative"
        >
          <span className="block">{card.name}</span>
          <MdOutlineModeEdit
            className="text-gray-400 absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 ease-in-out"
            size={20}
          />
        </div>
      )}
    </Draggable>
  )
}

const List = ({ list, index }) => {
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-[#c4d5e5] rounded-md p-4 w-[264px] max-h-[calc(100vh-10rem)] flex flex-col shadow-md"
        >
          <div className="flex items-center justify-between mb-4" {...provided.dragHandleProps}>
            <h3 className="font-semibold">{list.name}</h3>
            <BsThreeDots className="text-gray-600 cursor-pointer" />
          </div>
          <Droppable droppableId={list.id} type="CARD">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-grow overflow-y-auto"
              >
                {list.cards.map((card, cardIndex) => (
                  <Card key={card.id} card={card} index={cardIndex} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button className="mt-2 w-full text-left text-gray-600 hover:text-gray-800">
            + Add a card
          </button>
        </div>
      )}
    </Draggable>
  )
}

export default function DemoBoard() {
  const [lists, setLists] = useState(initialLists)

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'LIST') {
      const newLists = Array.from(lists)
      const [reorderedList] = newLists.splice(source.index, 1)
      newLists.splice(destination.index, 0, reorderedList)

      setLists(newLists)
      return
    }

    const sourceList = lists.find(list => list.id === source.droppableId)
    const destList = lists.find(list => list.id === destination.droppableId)
    const draggedCard = sourceList.cards.find(card => card.id === draggableId)

    if (sourceList === destList) {
      const newCards = Array.from(sourceList.cards)
      newCards.splice(source.index, 1)
      newCards.splice(destination.index, 0, draggedCard)

      const newList = {
        ...sourceList,
        cards: newCards
      }

      const newLists = lists.map(list =>
        list.id === newList.id ? newList : list
      )

      setLists(newLists)
    } else {
      const sourceCards = Array.from(sourceList.cards)
      sourceCards.splice(source.index, 1)
      const newSourceList = {
        ...sourceList,
        cards: sourceCards
      }

      const destCards = Array.from(destList.cards)
      destCards.splice(destination.index, 0, draggedCard)
      const newDestList = {
        ...destList,
        cards: destCards
      }

      const newLists = lists.map(list => {
        if (list.id === newSourceList.id) {
          return newSourceList
        } else if (list.id === newDestList.id) {
          return newDestList
        } else {
          return list
        }
      })

      setLists(newLists)
    }
  }

  return (
    <div className="p-4 bg-gray-100 overflow-x-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Try Our Demo Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex space-x-4"
            >
              {lists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}