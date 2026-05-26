import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export interface SavedDataset {
  id: string;
  user_id: string;
  filename: string;
  row_count: number;
  columns: string[];
  data: any[];
  created_at: string;
}

// Fallback to local storage when Supabase is not configured or fails
const LOCAL_STORAGE_KEY = 'business_analytics_datasets';

function getLocalDatasets(): SavedDataset[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalDataset(dataset: SavedDataset) {
  if (typeof window === 'undefined') return;
  try {
    const datasets = getLocalDatasets();
    datasets.push(dataset);
    
    // Keep only the last 5 local datasets to avoid QuotaExceededError
    if (datasets.length > 5) {
      datasets.shift();
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datasets));
  } catch (error) {
    console.error("Local storage quota exceeded:", error);
    // Fallback: clear older local datasets and keep only the newest one
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([dataset]));
    } catch (fallbackError) {
      console.error("Failed to save even a single dataset to local storage:", fallbackError);
    }
  }
}

function deleteLocalDataset(id: string) {
  if (typeof window === 'undefined') return;
  const datasets = getLocalDatasets();
  const filtered = datasets.filter(d => d.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Saves a dataset to Supabase (if configured and user logged in) or falls back to localStorage.
 */
export async function saveDataset(
  userId: string | undefined,
  filename: string,
  data: any[],
  columns: string[]
): Promise<SavedDataset | null> {
  const newDataset: SavedDataset = {
    id: userId ? crypto.randomUUID() : `local_${Date.now()}`,
    user_id: userId || 'guest',
    filename,
    row_count: data.length,
    columns,
    data,
    created_at: new Date().toISOString()
  };

  if (supabase && userId) {
    try {
      const { data: insertedData, error } = await supabase
        .from('datasets')
        .insert({
          id: newDataset.id,
          user_id: userId,
          filename: newDataset.filename,
          row_count: newDataset.row_count,
          columns: newDataset.columns,
          data: newDataset.data,
          created_at: newDataset.created_at
        })
        .select()
        .single();

      if (error) {
        // If table doesn't exist or permissions error, fall back to localStorage
        console.warn('Supabase DB save failed, falling back to localStorage:', error);
        saveLocalDataset(newDataset);
        toast.info('Saved dataset locally (Supabase table not found or unavailable)');
        return newDataset;
      }

      toast.success('Successfully synchronized dataset to cloud!');
      return insertedData as SavedDataset;
    } catch (err) {
      console.warn('DB save failed, saving locally:', err);
      saveLocalDataset(newDataset);
      toast.info('Saved dataset locally');
      return newDataset;
    }
  } else {
    saveLocalDataset(newDataset);
    if (userId) {
      toast.success('Saved dataset to local storage');
    }
    return newDataset;
  }
}

/**
 * Retrieves all datasets for the current user.
 */
export async function getUserDatasets(userId: string | undefined): Promise<SavedDataset[]> {
  const localDatasets = getLocalDatasets().filter(d => d.user_id === (userId || 'guest') || d.user_id === 'guest');

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase select failed, returning local storage:', error);
        return localDatasets;
      }

      // Combine both Supabase and guest datasets so the user doesn't lose current work
      const merged = [...(data as SavedDataset[]), ...localDatasets];
      // De-duplicate by ID
      const seen = new Set();
      return merged.filter(item => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
      });
    } catch (err) {
      console.warn('Supabase query failed, returning local storage:', err);
      return localDatasets;
    }
  }

  return localDatasets;
}

/**
 * Deletes a dataset.
 */
export async function deleteDataset(id: string, userId: string | undefined): Promise<boolean> {
  // Delete from local storage anyway
  deleteLocalDataset(id);

  if (supabase && userId && !id.startsWith('local_')) {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.warn('Supabase delete failed:', error);
        return true;
      }
      toast.success('Dataset removed from cloud');
      return true;
    } catch (err) {
      console.warn('Supabase delete error:', err);
      return true;
    }
  }

  toast.success('Dataset removed');
  return true;
}
