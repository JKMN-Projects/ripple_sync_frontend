export interface PostsByUserResponseDto{
  data: PostDto[]
}
export interface PostDto {
  postId: string;
  messageContent: string;
  statusName: string;
  mediaAttachment: string[];
  timestamp: number;
  platforms: string[];
}
