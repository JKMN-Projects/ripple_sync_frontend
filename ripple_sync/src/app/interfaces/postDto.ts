export interface PostsByUserResponseDto{
  data: PostDto[]
}
export interface PostDto {
  id: number;
  messageContent: string;
  statusName: string;
  mediaAttachment: string[];
  timestamp: number;
  platforms: string[];
}
