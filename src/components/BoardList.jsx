import React from 'react';

export default function BoardList({ boards, onBoardClick, onInviteClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boards.map((board) => (
        <div key={board._id} className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
          {board.owner && <p className="text-sm text-gray-600 mb-4">Owner: {board.owner.name}</p>}
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => onBoardClick(board._id)}
            >
              View Board
            </button>
            {onInviteClick && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => onInviteClick(board._id)}
              >
                Invite
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}