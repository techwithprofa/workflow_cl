'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Todo, AppState, FilterState, UIState, DashboardStats, Category, Priority } from '@/types';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { calculateStats, filterTodos, sortTodos, generateId } from '@/utils/helpers';

type AppAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_UI_STATE'; payload: Partial<UIState> }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  todos: [],
  filter: {
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    dateRange: {},
    tags: [],
  },
  ui: {
    sidebarOpen: true,
    currentView: 'week',
    selectedDate: new Date(),
    modalOpen: false,
    theme: 'system',
    notifications: true,
  },
  stats: {
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    overdueTodos: 0,
    completionRate: 0,
    categoryStats: {} as Record<Category, number>,
    priorityStats: {} as Record<Priority, number>,
    weeklyProgress: [],
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: Todo = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newTodos = [...state.todos, newTodo];
      const stats = calculateStats(newTodos);

      return {
        ...state,
        todos: newTodos,
        stats,
      };
    }

    case 'UPDATE_TODO': {
      const newTodos = state.todos.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates, updatedAt: new Date() }
          : todo
      );

      const stats = calculateStats(newTodos);

      return {
        ...state,
        todos: newTodos,
        stats,
      };
    }

    case 'DELETE_TODO': {
      const newTodos = state.todos.filter(todo => todo.id !== action.payload);
      const stats = calculateStats(newTodos);

      return {
        ...state,
        todos: newTodos,
        stats,
      };
    }

    case 'SET_FILTERS': {
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    }

    case 'SET_UI_STATE': {
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };
    }

    case 'SET_TODOS': {
      const stats = calculateStats(action.payload);
      return {
        ...state,
        todos: action.payload,
        stats,
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'RESET_STATE': {
      return initialState;
    }

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  filteredTodos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setUIState: (ui: Partial<UIState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEYS.TODOS);
      const storedUIState = localStorage.getItem(LOCAL_STORAGE_KEYS.UI_STATE);
      const storedFilters = localStorage.getItem(LOCAL_STORAGE_KEYS.FILTERS);

      if (storedState || storedUIState || storedFilters) {
        const loadedState: AppState = {
          ...initialState,
          todos: storedState ? JSON.parse(storedState) : [],
          ui: storedUIState ? JSON.parse(storedUIState) : initialState.ui,
          filter: storedFilters ? JSON.parse(storedFilters) : initialState.filter,
        };

        // Convert date strings back to Date objects
        loadedState.todos = loadedState.todos.map(todo => ({
          ...todo,
          dueDate: new Date(todo.dueDate),
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          reminder: todo.reminder ? new Date(todo.reminder) : undefined,
        }));

        if (loadedState.ui.selectedDate) {
          loadedState.ui.selectedDate = new Date(loadedState.ui.selectedDate);
        }

        dispatch({ type: 'LOAD_STATE', payload: loadedState });
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [state.todos]);

  // Save UI state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.UI_STATE, JSON.stringify(state.ui));
    } catch (error) {
      console.error('Error saving UI state to localStorage:', error);
    }
  }, [state.ui]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FILTERS, JSON.stringify(state.filter));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  }, [state.filter]);

  // Calculate filtered todos
  const filteredTodos = React.useMemo(() => {
    const filtered = filterTodos(state.todos, state.filter);
    return sortTodos(filtered, 'dueDate');
  }, [state.todos, state.filter]);

  // Action creators
  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TODO', payload: todo });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const setFilters = (filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setUIState = (ui: Partial<UIState>) => {
    dispatch({ type: 'SET_UI_STATE', payload: ui });
  };

  const value: AppContextType = {
    state,
    dispatch,
    filteredTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    setFilters,
    setUIState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}