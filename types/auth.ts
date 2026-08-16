export interface AuthUser {
  id: string;
  nickname: string;
  role: string;
  status: string;
  avatar: string | null;
  bio: string | null;
  xp: number;
  streak: number;
  maxStreak: number;
  lastLoginAt: Date | null;
  lastActiveAt: Date | null;
  createdAt: Date;
  level: {
    id: string;
    name: string;
    number: number;
    color: string;
  } | null;
  _count: {
    comments: number;
    submissions: number;
    ctfSubmissions: number;
    bookmarks: number;
    achievements: number;
  };
}

export interface SafeUser {
  id: string;
  nickname: string;
  role: string;
  status: string;
  avatar: string | null;
  xp: number;
  streak: number;
  level: {
    name: string;
    number: number;
  } | null;
}

export interface AuthState {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
