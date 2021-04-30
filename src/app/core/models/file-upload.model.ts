export interface ChunkDetails {
  blockId: string;
  chunkEnd: number;
}
export interface FileMetadata {
  file: any;
  status: string;
  progress?: number;
  fileName: string;
  size?: number;
  blobId: string[];
  lastChunk?: number;
  chunkDetails: ChunkDetails[];
  url?: string;
}

export interface BlobUploadResponse {
  blockId: string;
}
