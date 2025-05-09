export interface getUserDto {
  page: number;
  limit?: number;
  username?: string;
  roles?: string;
  gender?: string;
  sort?: string;
}
