export interface UserProfile {
  userId: number;
  nickname: string;
  avatarUrl: string | null;
  roleId: number;
  roleName: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  nickname: string;
  avatarUrl: string | null;
}
