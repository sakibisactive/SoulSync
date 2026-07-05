import React, { useState, useEffect, useRef } from 'react';
import { useGetChatsQuery, useGetMessagesQuery, useSendMessageMutation } from '../../redux/services/messageApi';
import { useSocket } from '../../contexts/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MessageSquare, Send, User, Circle, Sparkles } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { socket, onlineUsers } = useSocket();

  const { data: chatsData } = useGetChatsQuery({});
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(selectedChatId, {
    skip: !selectedChatId,
  });

  const [sendMessage] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto select first chat
  useEffect(() => {
    if (chatsData?.chats?.length > 0 && !selectedChatId) {
      setSelectedChatId(chatsData.chats[0]._id);
    }
  }, [chatsData]);

  // Join Socket chat room
  useEffect(() => {
    if (socket && selectedChatId) {
      socket.emit('join_chat', selectedChatId);

      socket.on('receive_message', (msg: any) => {
        if (msg.chatId === selectedChatId) {
          refetchMessages();
        }
      });

      socket.on('typing', () => setIsTyping(true));
      socket.on('stop_typing', () => setIsTyping(false));

      return () => {
        socket.off('receive_message');
        socket.off('typing');
        socket.off('stop_typing');
      };
    }
  }, [socket, selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChatId) return;

    const textToSend = messageText;
    setMessageText('');

    try {
      await sendMessage({ chatId: selectedChatId, messageText: textToSend }).unwrap();
      refetchMessages();
    } catch (e) {}
  };

  const getOtherParticipant = (chat: any) => {
    return chat.participants?.find((p: any) => p._id !== user?.id) || chat.participants?.[0];
  };

  return (
    <div className="h-[75vh] glass-panel rounded-3xl border border-slate-800 flex overflow-hidden shadow-2xl">
      {/* Sidebar: Chats List */}
      <div className="w-full sm:w-80 border-r border-slate-800/80 bg-slate-950/50 flex flex-col">
        <div className="p-4 border-b border-slate-800/80">
          <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Conversations
          </h2>
        </div>

        <div className="flex-grow overflow-y-auto divide-y divide-slate-800/40">
          {chatsData?.chats?.map((chat: any) => {
            const other = getOtherParticipant(chat);
            const isOnline = onlineUsers.includes(other?._id);
            const isSelected = selectedChatId === chat._id;

            return (
              <button
                key={chat._id}
                onClick={() => setSelectedChatId(chat._id)}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                    {other?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {isOnline && (
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 absolute bottom-0 right-0" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{other?.name || 'Partner'}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {chat.lastMessage?.text || 'Start conversation...'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden sm:flex flex-grow flex-col bg-slate-900/40">
        {selectedChatId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Chat</h3>
                  {isTyping && <span className="text-[10px] text-indigo-400 animate-pulse">Typing...</span>}
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messagesData?.messages?.map((msg: any) => {
                const isMe = msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white rounded-br-none shadow-lg'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <span className="text-[9px] opacity-70 block text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 rounded-xl glass-input text-sm"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-bold text-sm flex items-center gap-2 hover:opacity-95 shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="m-auto text-center text-slate-500 space-y-2">
            <MessageSquare className="w-12 h-12 mx-auto" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};
