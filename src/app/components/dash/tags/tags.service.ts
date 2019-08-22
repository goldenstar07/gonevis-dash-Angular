import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Tag } from '@app/interfaces/v1/tag';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get blog tags
   */
  getTags(): Observable<ApiResponse<Tag>> {
    return this.http.get<ApiResponse<Tag>>(`${this.apiService.base.v1}tagool/tag`, {
      params: {
        site: BlogService.currentBlog.id,
        ordering: '-tagged_items_count',
      },
    });
  }

  /**
   * Delete tag of current blog
   *
   * @param slug Blog slug
   */
  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}tagool/tag/${slug}`, {
      params: {
        site: BlogService.currentBlog.id,
      },
    });
  }

  /**
   * Create blog tag
   *
   * @param name Tag name
   * @param slug Tga slug
   * @param description Tag description
   */
  create(name: string,  slug: string, description: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiService.base.v1}tagool/tag/`,
      { name, slug, description,
      site: BlogService.currentBlog.id, }).pipe();
  }
}
