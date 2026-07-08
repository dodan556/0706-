/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, ProgramInfo } from '../types';
import { DatabaseProject } from '../types/supabase';

// Map database project model to UI project model
function mapDbToUi(db: DatabaseProject): Project {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    longDescription: db.long_description,
    coverImage: db.cover_image,
    images: db.images || [],
    category: db.category,
    tags: db.tags || [],
    role: db.role,
    client: db.client,
    year: db.year,
    link: db.link,
    github: db.github,
    featured: db.featured || false,
    
    // CMS fields directly mapped from DB (using safe types)
    detailTitle: db.detail_title || undefined,
    detailQuote: db.detail_quote || undefined,
    softwarePrograms: Array.isArray(db.software_programs) ? db.software_programs as ProgramInfo[] : undefined,
    projectHighlights: Array.isArray(db.project_highlights) ? db.project_highlights as string[] : undefined
  };
}

// Map UI project model to database model
function mapUiToDb(ui: Project): DatabaseProject {
  return {
    id: ui.id,
    title: ui.title,
    description: ui.description,
    long_description: ui.longDescription,
    cover_image: ui.coverImage,
    images: ui.images || [],
    category: ui.category,
    tags: ui.tags || [],
    role: ui.role,
    client: ui.client,
    year: ui.year,
    link: ui.link,
    github: ui.github,
    featured: ui.featured || false,
    
    detail_title: ui.detailTitle,
    detail_quote: ui.detailQuote,
    software_programs: ui.softwarePrograms,
    project_highlights: ui.projectHighlights
  };
}

export const projectsService = {
  /**
   * Fetches all projects from Supabase.
   */
  async getProjects(): Promise<Project[]> {
    console.log('[projectsService.getProjects] isSupabaseConfigured:', isSupabaseConfigured);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        console.log(`[projectsService.getProjects] Successfully fetched ${data?.length || 0} projects.`);
        return (data || []).map(mapDbToUi);
      } catch (err: any) {
        console.error('[projectsService.getProjects] Failed to load projects from Supabase:', err);
        throw err;
      }
    }

    console.warn('[projectsService.getProjects] Supabase is not configured.');
    return [];
  },

  /**
   * Fetches a project by ID from Supabase.
   */
  async getProjectById(id: string): Promise<Project | null> {
    console.log(`[projectsService.getProjectById] Fetching project with id: ${id}`);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.warn(`[projectsService.getProjectById] Project not found in DB with id: ${id}`);
            return null;
          }
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        return data ? mapDbToUi(data) : null;
      } catch (err: any) {
        console.error(`[projectsService.getProjectById] Failed to load project with ID ${id} from Supabase:`, err);
        throw err;
      }
    }

    return null;
  },

  /**
   * Creates a new project in Supabase.
   */
  async createProject(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
    const newId = project.id || String(Date.now());
    console.log(`[projectsService.createProject] Creating project with ID: ${newId}`);
    
    const completeProject: Project = {
      ...project,
      id: newId,
      images: project.images || []
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const dbProject = mapUiToDb(completeProject);
        const { data, error } = await supabase
          .from('projects')
          .insert([dbProject])
          .select()
          .single();

        if (error) {
          if (error.code === '42703') {
            console.warn('[Supabase Warning] Table "projects" is missing CMS columns. Retrying with basic columns.');
            const { detail_title, detail_quote, software_programs, project_highlights, ...basicDbProject } = dbProject as any;
            const retryRes = await supabase
              .from('projects')
              .insert([basicDbProject])
              .select()
              .single();

            if (retryRes.error) {
              throw new Error(`[Supabase Error] ${retryRes.error.message} (${retryRes.error.code})`);
            }
            
            return completeProject;
          }
          
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        return mapDbToUi(data);
      } catch (err: any) {
        console.error('[projectsService.createProject] Failed to create project in Supabase:', err);
        throw err;
      }
    }

    throw new Error('Supabase is not configured. Cannot create project.');
  },

  /**
   * Updates an existing project in Supabase.
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    console.log(`[projectsService.updateProject] Updating project with ID: ${id}`);
    if (isSupabaseConfigured && supabase) {
      try {
        const dbUpdates: Partial<DatabaseProject> = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.longDescription !== undefined) dbUpdates.long_description = updates.longDescription;
        if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
        if (updates.images !== undefined) dbUpdates.images = updates.images;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.client !== undefined) dbUpdates.client = updates.client;
        if (updates.year !== undefined) dbUpdates.year = updates.year;
        if (updates.link !== undefined) dbUpdates.link = updates.link;
        if (updates.github !== undefined) dbUpdates.github = updates.github;
        if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
        
        // CMS detail fields
        if (updates.detailTitle !== undefined) dbUpdates.detail_title = updates.detailTitle;
        if (updates.detailQuote !== undefined) dbUpdates.detail_quote = updates.detailQuote;
        if (updates.softwarePrograms !== undefined) dbUpdates.software_programs = updates.softwarePrograms;
        if (updates.projectHighlights !== undefined) dbUpdates.project_highlights = updates.projectHighlights;

        const { data, error } = await supabase
          .from('projects')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === '42703') {
            console.warn('[Supabase Warning] Table "projects" is missing CMS columns. Retrying with basic columns.');
            const { detail_title, detail_quote, software_programs, project_highlights, ...basicDbUpdates } = dbUpdates as any;
            const retryRes = await supabase
              .from('projects')
              .update(basicDbUpdates)
              .eq('id', id)
              .select()
              .single();

            if (retryRes.error) {
              throw new Error(`[Supabase Error] ${retryRes.error.message} (${retryRes.error.code})`);
            }
            
            const originalUi = await this.getProjectById(id);
            const mergedUi = { ...originalUi, ...updates } as Project;
            return mergedUi;
          }
          
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        return mapDbToUi(data);
      } catch (err: any) {
        console.error(`[projectsService.updateProject] Failed to update project ${id} in Supabase:`, err);
        throw err;
      }
    }

    throw new Error('Supabase is not configured. Cannot update project.');
  },

  /**
   * Deletes a project from Supabase.
   */
  async deleteProject(id: string): Promise<boolean> {
    console.log(`[projectsService.deleteProject] 1. 삭제 버튼 클릭 후 삭제 서비스 진입. ID: "${id}"`);
    if (isSupabaseConfigured && supabase) {
      try {
        console.log(`[projectsService.deleteProject] 4. Supabase delete() 요청 실행 시작`);
        
        const { data, error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .select();

        console.log(`[projectsService.deleteProject] 5. Supabase delete() 응답 결과 - data:`, data, `error:`, error);

        if (error) {
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        // 6. 삭제 성공 후 Database에서 실제 삭제되었는지 추가 확인
        console.log(`[projectsService.deleteProject] 6. 삭제 완료 검증 중...`);
        const { data: checkData, error: checkError } = await supabase
          .from('projects')
          .select('id')
          .eq('id', id);

        console.log(`[projectsService.deleteProject] 검증 데이터 조회 결과:`, checkData, `error:`, checkError);

        if (checkData && checkData.length > 0) {
          throw new Error('Deletion failed. Row level security (RLS) policies may have blocked this operation, or the deletion request did not succeed.');
        }

        console.log(`[projectsService.deleteProject] 6. 검증 성공: 프로젝트가 데이터베이스에서 제거되었습니다.`);
        return true;
      } catch (err: any) {
        console.error(`[projectsService.deleteProject] Failed to delete project ${id}:`, err);
        throw err;
      }
    }

    throw new Error('Supabase is not configured. Cannot delete project.');
  }
};
