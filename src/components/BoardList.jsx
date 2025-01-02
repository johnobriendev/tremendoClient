import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { getButtonStyles } from '../utils/styleSystem';

const BoardList = ({ boards, onBoardClick, onEditClick, onDeleteClick, onInviteClick, isOwned }) => {
  const { colors } = useTheme();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boards.map((board) => (
        <div 
          key={board._id} 
          className="rounded-lg p-4 shadow-md"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary
          }}
        >
          <h3 className="text-lg font-semibold mb-2">
            {board.name}
          </h3>
          
          {!isOwned && board.owner && (
            <p 
              className="text-sm mb-3"
              style={{ color: colors.text.secondary }}
            >
              Owner: {board.owner.name}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            <button
              {...getButtonStyles('primary')}
              onClick={() => onBoardClick(board._id)}
            >
              View
            </button>
            
            {isOwned && (
              <>
                <button
                  {...getButtonStyles('success')}
                  onClick={() => onEditClick(board)}
                >
                  Edit
                </button>
                <button
                  {...getButtonStyles('danger')}
                  onClick={() => onDeleteClick(board._id)}
                >
                  Delete
                </button>
                <button
                  {...getButtonStyles('special')}
                  onClick={() => onInviteClick(board._id)}
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