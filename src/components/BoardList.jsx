import React from 'react';


const BoardList = ({ boards, onBoardClick, onEditClick, onDeleteClick, onInviteClick, isOwned }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boards.map((board) => (
        <div key={board._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{board.name}</h3>
          {!isOwned && board.owner && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Owner: {board.owner.name}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onBoardClick(board._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              View
            </button>
            {isOwned && (
              <>
                <button
                  onClick={() => onEditClick(board)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteClick(board._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => onInviteClick(board._id)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                >
                  Invite
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardList;

// export default function BoardList({ boards, onBoardClick, onInviteClick }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//       {boards.map((board) => (
//         <div key={board._id} className="bg-white shadow rounded-lg p-4">
//           <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
//           {board.owner && <p className="text-sm text-gray-600 mb-4">Owner: {board.owner.name}</p>}
//           <div className="flex justify-between">
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               onClick={() => onBoardClick(board._id)}
//             >
//               View Board
//             </button>
//             {onInviteClick && (
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                 onClick={() => onInviteClick(board._id)}
//               >
//                 Invite
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }