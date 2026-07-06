/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, ProgramInfo } from '../types';
import { DatabaseProject } from '../types/supabase';
import { INITIAL_PROJECTS } from '../lib/portfolioData';

// Generate robust fallback details for existing mock portfolio items or newly created items
function getFallbacksForProject(id: string) {
  if (id === '1') {
    return {
      detailTitle: 'PROJECT DISCLOSURE // 상세 소개',
      detailQuote: '모든 상호 작용과 공간 구성은 미니멀리즘과 심층적 기능 분석을 기반으로 합니다. 기술적 안정성과 정교한 시각 디자인 시스템의 결합을 통해 완벽한 사용자 정서 조화를 유도하였습니다.',
      softwarePrograms: [
        { name: 'Figma', role: 'UI/UX 디자인 및 고해상도 프로토타이핑', category: 'Design' },
        { name: 'Visual Studio Code', role: '컴포넌트 개발 및 상태 관리 구현', category: 'Development' },
        { name: 'Adobe Photoshop', role: '제품 이미지 가공 및 비주얼 리터칭', category: 'Creative' },
        { name: 'Framer Motion', role: '정밀 인터랙션 및 프레임워크 트랜지션', category: 'Animation' }
      ],
      projectHighlights: [
        '상세페이지 기획 및 레이아웃 설계',
        '중국 1688 이미지 한글화 가공',
        '브랜드 아이덴티티 시각 디자인 반영',
        '구매 전환율을 고려한 UX 설계'
      ]
    };
  }
  if (id === '2') {
    return {
      detailTitle: 'GALLERY CONFIGURATIONS',
      detailQuote: '가상 전시장을 가로지르는 비선형 공간 설계와 WebGL 프레임 레이트 안정화를 통해, 관객이 작품 자체의 텍스처와 무게감에만 온전히 감각을 집중할 수 있도록 유도합니다.',
      softwarePrograms: [
        { name: 'Figma', role: '비정형 레이아웃 오가닉 설계', category: 'Design' },
        { name: 'Visual Studio Code', role: 'WebGL 연동 프론트엔드 최적화', category: 'Development' },
        { name: 'Three.js / WebGL', role: '실시간 3D 그래픽 렌더링 파이프라인', category: 'Graphics' },
        { name: 'Blender', role: '가상 미술관 3D 오브젝트 에셋 모델링', category: 'Creative' }
      ],
      projectHighlights: [
        '3D 미술관 공간 렌더링 및 카메라 워크',
        '고해상도 미술작품 질감 리얼리스틱 맵 세팅',
        '모바일 스무스 터치 핀치 제스처 최적화',
        '반응형 웹 그리드 커스텀 오가닉 포지셔닝'
      ]
    };
  }
  if (id === '3') {
    return {
      detailTitle: 'CORE SYSTEM ARCHITECTURE',
      detailQuote: '개별 제품 단위의 무작위 디자인 변형을 억제하고, 유기적으로 제어되는 디자인 토큰을 통해 전사적 개발 자원의 정렬 속도를 3배 이상 단축시키는 효율적 공유 가치를 창출합니다.',
      softwarePrograms: [
        { name: 'Figma', role: '디자인 시스템 아토믹 컴포넌트 토큰 설계', category: 'Design' },
        { name: 'Storybook', role: '독립형 컴포넌트 샌드박스 테스팅', category: 'Development' },
        { name: 'Visual Studio Code', role: 'Tailwind 기반 유틸리티 CSS 컴포넌팅', category: 'Development' },
        { name: 'GitHub Workspace', role: '버전 관리 및 배포 자동화 파이프라인', category: 'DevOps' }
      ],
      projectHighlights: [
        '유체 다이내믹 타이포그래피 스케일 수립',
        '다크/라이트 테마 대비 웹 접근성 표준 준수',
        '100+ 아토믹 컴포넌트 디자인 토큰 연동',
        '컴포넌트 단위 테스팅 파이프라인 정밀 수립'
      ]
    };
  }
  if (id === '4') {
    return {
      detailTitle: 'TACTILE INTERFACE DESIGN',
      detailQuote: '눈부심을 억제한 야간 다크 테마 조도 설계와 고주파 노이즈를 제어한 공간 입체 음향의 기하학적 배치를 통해 사용자가 스크린 너머의 깊은 휴식 상태로 진입하게 돕습니다.',
      softwarePrograms: [
        { name: 'Figma', role: '뉴모피즘 오디오 데크 GUI 설계', category: 'Design' },
        { name: 'Visual Studio Code', role: 'Web Audio API 핵심 제어 로직 설계', category: 'Development' },
        { name: 'Adobe Audition', role: '공간 음향 입체 오디오 음원 엔지니어링', category: 'Creative' },
        { name: 'Blender', role: '다이얼 노브 질감 메탈릭 매핑 렌더링', category: 'Creative' }
      ],
      projectHighlights: [
        '뉴모피즘 기반 다이내믹 섀도 인터페이스',
        'Web Audio API 무손실 패닝 음향 제어',
        '소리 주파수 연동 실시간 파형 시각화',
        '사용자 상태별 세분화된 사운드 프리셋 구성'
      ]
    };
  }
  return {
    detailTitle: 'PROJECT DISCLOSURE // 상세 소개',
    detailQuote: '이 프로젝트는 디자인과 정밀한 개발의 이상적인 결합을 통해 사용자 가치를 극대화하고, 명확한 브랜드 가치를 전달하는 데 중점을 두었습니다.',
    softwarePrograms: [
      { name: 'Figma', role: '제품 인터페이스 & 컴포넌트 기획', category: 'Design' },
      { name: 'Visual Studio Code', role: '프로토타입 애플리케이션 프론트엔드 빌드', category: 'Development' },
      { name: 'GitHub', role: '오픈소스 형상 관리 및 빌드 파이프라인', category: 'DevOps' }
    ],
    projectHighlights: [
      '사용자 중심의 직관적인 디자인 레이아웃',
      '세련되고 감각적인 비주얼 요소 구성',
      '성능 및 웹 표준에 최적화된 구현',
      '다양한 기기 및 환경을 위한 반응형 설계'
    ]
  };
}

// Map database project model to UI project model
function mapDbToUi(db: DatabaseProject): Project {
  const fallbacks = getFallbacksForProject(db.id);
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
    
    // CMS fields with DB value if exists, else graceful fallback
    detailTitle: db.detail_title !== undefined && db.detail_title !== null ? db.detail_title : fallbacks.detailTitle,
    detailQuote: db.detail_quote !== undefined && db.detail_quote !== null ? db.detail_quote : fallbacks.detailQuote,
    softwarePrograms: db.software_programs !== undefined && db.software_programs !== null ? db.software_programs : fallbacks.softwarePrograms,
    projectHighlights: db.project_highlights !== undefined && db.project_highlights !== null ? db.project_highlights : fallbacks.projectHighlights
  };
}

// Map UI project model to database model
function mapUiToDb(ui: Project): DatabaseProject {
  const fallbacks = getFallbacksForProject(ui.id);
  return {
    id: ui.id,
    title: ui.title,
    description: ui.description,
    long_description: ui.longDescription,
    cover_image: ui.coverImage,
    images: ui.images,
    category: ui.category,
    tags: ui.tags,
    role: ui.role,
    client: ui.client,
    year: ui.year,
    link: ui.link,
    github: ui.github,
    featured: ui.featured,
    
    detail_title: ui.detailTitle !== undefined ? ui.detailTitle : fallbacks.detailTitle,
    detail_quote: ui.detailQuote !== undefined ? ui.detailQuote : fallbacks.detailQuote,
    software_programs: ui.softwarePrograms !== undefined ? ui.softwarePrograms : fallbacks.softwarePrograms,
    project_highlights: ui.projectHighlights !== undefined ? ui.projectHighlights : fallbacks.projectHighlights
  };
}

const LOCAL_STORAGE_KEY = 'supabase_fallback_projects';

export const projectsService = {
  /**
   * Fetches all projects from Supabase or localStorage fallback.
   */
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        if (data && data.length > 0) {
          return data.map(mapDbToUi);
        }

        console.log('Supabase projects table is empty. Fetching local data...');
      } catch (err: any) {
        console.error('Failed to load projects from Supabase:', err);
        throw err;
      }
    }

    // Fallback logic
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const list: Project[] = JSON.parse(cached);
        // Ensure everyone has detailed CMS fields filled out
        return list.map(p => {
          const fb = getFallbacksForProject(p.id);
          return {
            ...p,
            detailTitle: p.detailTitle !== undefined ? p.detailTitle : fb.detailTitle,
            detailQuote: p.detailQuote !== undefined ? p.detailQuote : fb.detailQuote,
            softwarePrograms: p.softwarePrograms !== undefined ? p.softwarePrograms : fb.softwarePrograms,
            projectHighlights: p.projectHighlights !== undefined ? p.projectHighlights : fb.projectHighlights
          };
        });
      } catch {
        return INITIAL_PROJECTS.map(p => ({ ...p, ...getFallbacksForProject(p.id) }));
      }
    }
    
    const seeded = INITIAL_PROJECTS.map(p => ({ ...p, ...getFallbacksForProject(p.id) }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  },

  /**
   * Fetches a project by ID from Supabase or localStorage fallback.
   */
  async getProjectById(id: string): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        return data ? mapDbToUi(data) : null;
      } catch (err: any) {
        console.error(`Failed to load project with ID ${id} from Supabase:`, err);
        throw err;
      }
    }

    // Fallback
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  /**
   * Creates a new project in Supabase or local storage.
   */
  async createProject(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
    const newId = project.id || String(Date.now());
    const fb = getFallbacksForProject(newId);
    
    const completeProject: Project = {
      ...project,
      id: newId,
      images: project.images || [],
      detailTitle: project.detailTitle || fb.detailTitle,
      detailQuote: project.detailQuote || fb.detailQuote,
      softwarePrograms: project.softwarePrograms || fb.softwarePrograms,
      projectHighlights: project.projectHighlights || fb.projectHighlights
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
            
            // Keep local storage cache complete
            const projects = await this.getProjects().catch(() => []);
            const updated = [completeProject, ...projects.filter(p => p.id !== completeProject.id)];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return completeProject;
          }
          
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        const savedProject = mapDbToUi(data);
        const projects = await this.getProjects().catch(() => []);
        const updated = [savedProject, ...projects.filter(p => p.id !== savedProject.id)];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

        return savedProject;
      } catch (err: any) {
        console.error('Failed to create project in Supabase:', err);
        throw err;
      }
    }

    // Fallback
    const projects = await this.getProjects();
    const updated = [completeProject, ...projects];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return completeProject;
  },

  /**
   * Updates an existing project in Supabase or local storage.
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
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
            
            const projects = await this.getProjects().catch(() => []);
            const updatedList = projects.map(p => p.id === id ? mergedUi : p);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
            
            return mergedUi;
          }
          
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        const savedProject = mapDbToUi(data);
        const projects = await this.getProjects().catch(() => []);
        const updatedList = projects.map(p => p.id === id ? savedProject : p);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

        return savedProject;
      } catch (err: any) {
        console.error(`Failed to update project ${id} in Supabase:`, err);
        throw err;
      }
    }

    // Fallback
    const projects = await this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found.`);
    }

    const updatedProject = { ...projects[index], ...updates };
    const updatedList = [...projects];
    updatedList[index] = updatedProject;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedProject;
  },

  /**
   * Deletes a project from Supabase or local storage.
   */
  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          throw new Error('No active database session found. Please log in first to perform deletions.');
        }

        const { data, error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
        }

        if (!data || data.length === 0) {
          throw new Error('Deletion failed. The row was not deleted. This is typically due to Row Level Security (RLS) policies blocking deletes, or the ID does not exist.');
        }

        // Sync local cache
        const projects = await this.getProjects().catch(() => []);
        const filtered = projects.filter((p) => p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

        return true;
      } catch (err: any) {
        console.error(`Failed to delete project ${id} from Supabase:`, err);
        throw err;
      }
    }

    // Fallback
    const projects = await this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Seed all initial projects to Supabase (helper tool for first setups).
   */
  async seedProjectsToSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, count: 0, message: 'Supabase is not configured yet.' };
    }

    try {
      // First check if already has items
      const { data: existing, error: checkError } = await supabase
        .from('projects')
        .select('id');

      if (checkError) {
        throw new Error(`Could not query projects: ${checkError.message}`);
      }

      if (existing && existing.length > 0) {
        return { 
          success: true, 
          count: existing.length, 
          message: 'Table already has existing project rows. Skipping seeding.' 
        };
      }

      // Convert and Insert
      const dbRows = INITIAL_PROJECTS.map(mapUiToDb);
      const { data, error } = await supabase
        .from('projects')
        .insert(dbRows)
        .select();

      if (error) {
        throw new Error(`Insert failed: ${error.message}`);
      }

      return { 
        success: true, 
        count: data ? data.length : 0, 
        message: 'Successfully seeded default projects into Supabase.' 
      };
    } catch (err: any) {
      console.error('Seeding process failed:', err);
      return { success: false, count: 0, message: err.message || 'Unknown seeding failure' };
    }
  }
};
