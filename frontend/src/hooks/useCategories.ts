/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, type Category, type CategoryCreate } from '../api/categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await categoriesApi.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CategoryCreate) => {
    try {
      const newCategory = await categoriesApi.create(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadCategories(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    categories,
    loading,
    error,
    loadCategories,
    createCategory,
    deleteCategory,
  };
}