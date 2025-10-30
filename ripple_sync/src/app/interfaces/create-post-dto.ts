export interface CreatePostDto {
  messageContent: string;
  scheduledTimestamp: number;
  mediaAttachment: Array<string>;
  integrationIds: Array<number>;
}
