import http from '../utils/request';
import { config } from '../config';

export interface UploadResponse {
  url: string;  // 服务器返回的图片URL片段
  filename: string;  // 文件名
}

export const uploadService = {
  // 上传图片
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    return http.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取完整的图片URL
  getImageUrl(url: string) {
    return `${config.endpoint}${url}`;
  }
}; 