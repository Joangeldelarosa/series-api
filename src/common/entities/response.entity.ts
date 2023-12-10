export class ResponseEntity {
  message?: string;
  error?: string;
  token?: string;
  info?: {
    count: number;
    pages: number;
    next: string;
    prev: boolean;
  };
  results?: any[];
}
