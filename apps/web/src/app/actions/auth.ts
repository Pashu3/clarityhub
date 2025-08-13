'use server';

import { cookies } from 'next/headers';
import { apiURL } from '@/constants/api';

type UserData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
};
interface UserInfo {
  id: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string;
  role?: string;
  isActive?: boolean;
}
interface AuthStatusResponse {
  isAuthenticated: boolean;
  user: UserInfo | null;
}
export const getAuthStatus = async (): Promise<AuthStatusResponse> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const refreshToken = cookieStore.get('refreshToken');
    
    const res = await fetch(`${apiURL}/auth/status`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken.value}` } : {})
      },
    });
    
    if (!res.ok) {
      console.error(`Auth status check failed with status: ${res.status}`);
      return { isAuthenticated: false, user: null };
    }
    
    const contentType = res.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Auth status response is not JSON');
      return { isAuthenticated: false, user: null };
    }
    
    const data = await res.json();
    
    if (data?.isAuthenticated === true) {
      return { 
        isAuthenticated: true, 
        user: data.user || null
      };
    } else {
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('Auth status check exception:', error);
    return { isAuthenticated: false, user: null };
  }
};

export async function registerUser(userData: UserData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${apiURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Registration failed',
      };
    }

    const cookieStore = await cookies();

    if (data.accessToken) {
      cookieStore.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
        path: '/',
      });
    }

    if (data.refreshToken) {
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function loginUser(loginData: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${apiURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }

    const cookieStore = await cookies();

    if (data.accessToken) {
      cookieStore.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
        path: '/',
      });
    }

    if (data.refreshToken) {
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function handleOAuthCallback(params: {
  accessToken?: string;
  refreshToken?: string;
  user?: string;
}): Promise<AuthResponse> {
  try {
    const { accessToken, refreshToken, user: userData } = params;

    if (!accessToken) {
      return {
        success: false,
        message: 'No access token provided',
      };
    }

    let user;
    if (userData) {
      try {
        user = JSON.parse(decodeURIComponent(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    if (refreshToken) {
      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred processing the OAuth callback',
    };
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${apiURL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to send password reset email',
      };
    }

    return {
      success: true,
      message: data.message || 'Password reset email sent',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('user_info');

  return { success: true };
}
