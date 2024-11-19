import React from 'react';

export default function InvitationList({ invitations, onAccept, onReject }) {
  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <div key={invitation._id} className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{invitation.board.name}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Invited by {invitation.inviter.name} ({invitation.inviter.email})
          </p>
          <p className="mb-4">You've been invited to collaborate on this board.</p>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => onReject(invitation._id)}
            >
              Reject
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => onAccept(invitation._id)}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}