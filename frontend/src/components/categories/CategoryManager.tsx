import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategoryChange }) => {
  const { categories, loading, createCategory, deleteCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Введите название категории');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim() || undefined,
      });
      setNewCategoryName('');
      setNewCategoryDesc('');
      onCategoryChange?.();
    } catch {
      setError('Не удалось создать категорию');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Удалить категорию "${name}"?`)) return;
    
    try {
      await deleteCategory(id);
      onCategoryChange?.();
    } catch{
      setError('Не удалось удалить категорию');
    }
  };

  if (loading) {
    return <div className="text-text-secondary text-sm">Загрузка категорий...</div>;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h4 className="text-sm font-semibold text-text mb-3">📂 Управление категориями</h4>

      {/* Форма создания */}
      <form onSubmit={handleCreate} className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Название"
          className="flex-1 min-w-[120px] px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
          disabled={isCreating}
        />
        <input
          type="text"
          value={newCategoryDesc}
          onChange={(e) => setNewCategoryDesc(e.target.value)}
          placeholder="Описание (необязательно)"
          className="flex-1 min-w-[150px] px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
          disabled={isCreating}
        />
        <button
          type="submit"
          disabled={isCreating || !newCategoryName.trim()}
          className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/80 transition disabled:opacity-50"
        >
          {isCreating ? '...' : '+'}
        </button>
      </form>

      {error && (
        <div className="text-danger text-sm mb-2">{error}</div>
      )}

      {/* Список категорий */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-1 px-3 py-1 bg-hover rounded-full text-sm"
          >
            <span className="text-text">{cat.name}</span>
            <span className="text-text-secondary text-xs">({cat.word_count})</span>
            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              className="text-text-secondary hover:text-danger transition ml-1"
              title="Удалить категорию"
            >
              ×
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <span className="text-text-secondary text-sm">Нет категорий</span>
        )}
      </div>
    </div>
  );
};