import { SafeUrl } from "@angular/platform-browser";

export interface PostsByUserResponseDto{
  data: PostDto[]
}
export interface PostDto {
  postId: string;
  messageContent: string;
  statusName: string;
  mediaIds: string[];
  timestamp: number;
  platforms: string[];
}
