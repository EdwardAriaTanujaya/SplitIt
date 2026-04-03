import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useFriendStore from '../store/FriendStore';
import useUserAuth from '../store/UserAuthStore';

function Chat() {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const user = useUserAuth((state) => state.user);
  const { acceptedFriends, messages, loading, fetchFriends, fetchConversation, sendMessage } = useFriendStore();
  const [draft, setDraft] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) {
      fetchFriends(user.id);
    }
  }, [user, fetchFriends]);

  useEffect(() => {
    if (user && friendId) {
      fetchConversation(user.id, friendId);
    }
  }, [user, friendId, fetchConversation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const friend = acceptedFriends.find((friend) => friend.friendId === friendId);
  const friendName = friend?.friend?.name ?? 'Friend';

  const handleSendMessage = async () => {
    if (!draft.trim() || !user || !friendId) return;

    try {
      await sendMessage(user.id, friendId, draft.trim());
      setDraft('');
      await fetchConversation(user.id, friendId);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">

      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="text-gray-700 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Chat with {friendName}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && <p className="text-center text-sm text-gray-500">Loading conversation...</p>}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 pt-20">
            <p className="text-sm font-semibold">No messages yet.</p>
            <p className="text-xs mt-2">Send the first message to start chatting.</p>
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((message: any) => {
              const isMine = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`block w-fit max-w-[80%] rounded-3xl px-4 py-3 shadow-sm break-words ${isMine ? 'ml-auto bg-[var(--color-secondary)] text-black' : 'bg-white text-gray-900'}`}
                >
                  <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[var(--color-lightgray)] text-right">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Write a message to ${friendName}`}
            className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={handleSendMessage}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
