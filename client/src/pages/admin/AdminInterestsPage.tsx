import React, { useState } from 'react';
import { useCreateInterestMutation, useDeleteInterestMutation } from '../../redux/services/adminApi';
import { useGetInterestsQuery } from '../../redux/services/profileApi';
import { Plus, Trash2, Sparkles } from 'lucide-react';

export const AdminInterestsPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetInterestsQuery({});
  const [createInterest] = useCreateInterestMutation();
  const [deleteInterest] = useDeleteInterestMutation();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await createInterest({ name, category }).unwrap();
      setName('');
      refetch();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInterest(id).unwrap();
      refetch();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" /> Manage System Interest Tags
        </h1>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl border border-slate-800 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Interest Tag (e.g. Scuba Diving)..."
          className="flex-grow p-3 rounded-xl glass-input text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-xl glass-input text-sm bg-slate-900"
        >
          <option value="General">General</option>
          <option value="Sports">Sports</option>
          <option value="Tech">Tech</option>
          <option value="Arts">Arts</option>
          <option value="Adventure">Adventure</option>
        </select>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Tag
        </button>
      </form>

      {/* Tag List */}
      {isLoading ? (
        <div className="py-10 text-center text-slate-400">Loading interests...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data?.interests?.map((item: any) => (
            <div
              key={item._id}
              className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-bold text-white">#{item.name}</span>
                <span className="block text-[10px] text-slate-500">{item.category}</span>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
