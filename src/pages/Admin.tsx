/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Trash2, 
  FolderPlus, 
  MessageSquare, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Database, 
  HardDrive, 
  Lock, 
  Upload, 
  Edit, 
  X, 
  Plus, 
  Eye, 
  Link as LinkIcon,
  Tag,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Terminal,
  Award,
  Hash
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  projectsService, 
  contactService, 
  authService, 
  storageService,
  cmsService
} from '../services';
import { 
  Project, 
  ContactSubmission, 
  HomeSettings, 
  AboutSettings, 
  Skill, 
  Certification, 
  ContactChannel,
  HomeInfoItem,
  parseHomeInfoItem,
  formatHomeInfoItem,
  BiographyLeftSettings,
  BiographyCard,
  ProgramInfo
} from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries' | 'home' | 'about' | 'skills' | 'certs' | 'contacts'>('projects');
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null);

  // Home Metrics States
  const [expItem, setExpItem] = useState<HomeInfoItem>({ key: 'experience', label: 'EXPERIENCE', value: '', sortOrder: 0 });
  const [locItem, setLocItem] = useState<HomeInfoItem>({ key: 'location', label: 'LOCATION', value: '', sortOrder: 1 });
  const [stackItem, setStackItem] = useState<HomeInfoItem>({ key: 'primaryStack', label: 'PRIMARY STACK', value: '', sortOrder: 2 });
  const [infraItem, setInfraItem] = useState<HomeInfoItem>({ key: 'infrastructure', label: 'INFRASTRUCTURE', value: '', sortOrder: 3 });

  useEffect(() => {
    if (homeSettings) {
      setExpItem(parseHomeInfoItem('experience', homeSettings.experience, 'EXPERIENCE', 0));
      setLocItem(parseHomeInfoItem('location', homeSettings.location, 'LOCATION', 1));
      setStackItem(parseHomeInfoItem('primaryStack', homeSettings.primaryStack, 'PRIMARY STACK', 2));
      setInfraItem(parseHomeInfoItem('infrastructure', homeSettings.infrastructure, 'INFRASTRUCTURE', 3));
    }
  }, [homeSettings]);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null);
  
  // Biography States
  const [bioLeft, setBioLeft] = useState<BiographyLeftSettings | null>(null);
  const [bioCards, setBioCards] = useState<BiographyCard[]>([]);
  const [isSavingBioLeft, setIsSavingBioLeft] = useState(false);
  const [isBioCardModalOpen, setIsBioCardModalOpen] = useState(false);
  const [editingBioCard, setEditingBioCard] = useState<BiographyCard | null>(null);
  const [bioCardTitle, setBioCardTitle] = useState('');
  const [bioCardDescription, setBioCardDescription] = useState('');

  const [skills, setSkills] = useState<Skill[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [contacts, setContacts] = useState<ContactChannel[]>([]);
  const [loading, setLoading] = useState(true);

  // Saving states
  const [isSavingHome, setIsSavingHome] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [cmsSuccessMessage, setCmsSuccessMessage] = useState('');
  const [cmsErrorMessage, setCmsErrorMessage] = useState('');

  // Skill Modal/Edit States
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState<'design' | 'development' | 'tools'>('development');
  const [skillLevel, setSkillLevel] = useState<number>(85);
  const [skillIconName, setSkillIconName] = useState('FileCode');

  // Cert Modal/Edit States
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certName, setCertName] = useState('');
  const [certAuthority, setCertAuthority] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certCode, setCertCode] = useState('');

  // Contact Modal/Edit States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactChannel | null>(null);
  const [contactLabel, setContactLabel] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactIconName, setContactIconName] = useState('Mail');
  const [contactType, setContactType] = useState<'contact' | 'social'>('contact');
  
  // Supabase connection testing states
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionReport, setConnectionReport] = useState<{
    status: 'connected' | 'offline' | 'untested';
    dbOk: boolean;
    storageOk: boolean;
    authOk: boolean;
    details?: string;
  }>({
    status: 'untested',
    dbOk: false,
    storageOk: false,
    authOk: false
  });

  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedingMessage, setSeedingMessage] = useState('');

  // Project Modal / Edit States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Design');
  const [formCover, setFormCover] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [formTagsString, setFormTagsString] = useState('React, UI/UX, Motion');
  const [formRole, setFormRole] = useState('Senior UI Designer');
  const [formClient, setFormClient] = useState('Hyperion Labs');
  const [formYear, setFormYear] = useState('2026');
  const [formLink, setFormLink] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  
  // Dynamic CMS fields for Project Detail Page
  const [formDetailTitle, setFormDetailTitle] = useState('');
  const [formDetailQuote, setFormDetailQuote] = useState('');
  const [formSoftwarePrograms, setFormSoftwarePrograms] = useState<ProgramInfo[]>([]);
  const [formProjectHighlights, setFormProjectHighlights] = useState<string[]>([]);
  
  // Helpers for inline software programs & highlights management
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramRole, setNewProgramRole] = useState('');
  const [newProgramCategory, setNewProgramCategory] = useState('Design');
  const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(null);
  const [newHighlightText, setNewHighlightText] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Multi-image upload and drag & drop states
  const [formImages, setFormImages] = useState<string[]>([]);
  const [galleryUploads, setGalleryUploads] = useState<{ id: string; name: string; progress: number; error?: string }[]>([]);
  const [coverUploadProgress, setCoverUploadProgress] = useState<number | null>(null);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);

  // Authentication gate keeping
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await authService.getSession();
      if (!user) {
        navigate('/login');
      } else {
        // Double check if actually logged in via Supabase
        if (isSupabaseConfigured && supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            setIsSupabaseAuthenticated(!!session);
          } catch (e) {
            console.error('Error verifying Supabase auth session:', e);
            setIsSupabaseAuthenticated(false);
          }
        } else {
          setIsSupabaseAuthenticated(false);
        }
        await loadAllData();
        await autoTestConnection();
      }
    };
    verifyAuth();
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [projs, subs, home, about, loadedSkills, loadedCerts, loadedContacts, loadedBioLeft, loadedBioCards] = await Promise.all([
        projectsService.getProjects(),
        contactService.getSubmissions(),
        cmsService.getHomeSettings(),
        cmsService.getAboutSettings(),
        cmsService.getSkills(),
        cmsService.getCertifications(),
        cmsService.getContactChannels(),
        cmsService.getBioLeftSettings(),
        cmsService.getBioCards()
      ]);
      setProjects(projs);
      setSubmissions(subs);
      setHomeSettings(home);
      setAboutSettings(about);
      setSkills(loadedSkills);
      setCerts(loadedCerts);
      setContacts(loadedContacts);
      setBioLeft(loadedBioLeft);
      setBioCards(loadedBioCards);
    } catch (err) {
      console.error('Failed to load portfolio dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const autoTestConnection = async () => {
    if (!isSupabaseConfigured) {
      setConnectionReport({
        status: 'offline',
        dbOk: false,
        storageOk: false,
        authOk: false,
        details: 'API Keys are not defined in the environment variables.'
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      // 1. Test Auth Connection
      const { data: authData, error: authError } = await supabase!.auth.getSession();
      const authOk = !authError;

      // 2. Test DB select (projects table metadata fetch)
      const { error: dbError } = await supabase!
        .from('projects')
        .select('id')
        .limit(1);
      const dbOk = !dbError;

      // 3. Test Storage listing or access
      const { error: storageError } = await supabase!.storage.listBuckets();
      const storageOk = !storageError;

      const allOk = dbOk && storageOk && authOk;

      setConnectionReport({
        status: allOk ? 'connected' : 'offline',
        dbOk,
        storageOk,
        authOk,
        details: allOk 
          ? 'Successfully established high-fidelity pipelines to all Supabase nodes.' 
          : `Integration mismatch: DB ok? ${dbOk}, Storage ok? ${storageOk}, Auth ok? ${authOk}`
      });
    } catch (err: any) {
      setConnectionReport({
        status: 'offline',
        dbOk: false,
        storageOk: false,
        authOk: false,
        details: err.message || 'Network handshake failed.'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeedingLoading(true);
    setSeedingMessage('');
    try {
      const res = await projectsService.seedProjectsToSupabase();
      if (res.success) {
        setSeedingMessage(`SUCCESS: ${res.message} (${res.count} projects synchronized)`);
        await loadAllData();
      } else {
        setSeedingMessage(`ERROR: ${res.message}`);
      }
    } catch (err: any) {
      setSeedingMessage(`CATASTROPHIC FAILURE: ${err.message}`);
    } finally {
      setSeedingLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/');
  };

  // Inquiry management callbacks
  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'archived') => {
    try {
      await contactService.updateStatus(id, newStatus);
      const updatedSubs = await contactService.getSubmissions();
      setSubmissions(updatedSubs);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('이 문의 내역을 정말 삭제하시겠습니까?')) return;
    
    const originalSubmissions = [...submissions];
    setSubmissions(prev => prev.filter(s => s.id !== id));
    
    try {
      await contactService.deleteSubmission(id);
      showCmsSuccess('Inquiry successfully deleted from database.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete inquiry submission:', err);
      showCmsError('Failed to delete inquiry: ' + (err.message || err));
      setSubmissions(originalSubmissions);
    }
  };

  const showCmsSuccess = (msg: string) => {
    setCmsSuccessMessage(msg);
    setCmsErrorMessage('');
    setTimeout(() => setCmsSuccessMessage(''), 4000);
  };

  const showCmsError = (msg: string) => {
    setCmsErrorMessage(msg);
    setCmsSuccessMessage('');
    setTimeout(() => setCmsErrorMessage(''), 5000);
  };

  // Home Main text settings
  const handleSaveHomeSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeSettings) return;
    setIsSavingHome(true);
    try {
      const updatedSettings: HomeSettings = {
        ...homeSettings,
        experience: formatHomeInfoItem(expItem),
        location: formatHomeInfoItem(locItem),
        primaryStack: formatHomeInfoItem(stackItem),
        infrastructure: formatHomeInfoItem(infraItem)
      };
      await cmsService.updateHomeSettings(updatedSettings);
      setHomeSettings(updatedSettings);
      showCmsSuccess('Home text specifications successfully saved.');
    } catch (err: any) {
      showCmsError('Failed to save Home settings: ' + err.message);
    } finally {
      setIsSavingHome(false);
    }
  };

  // About profile settings
  const handleSaveAboutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutSettings) return;
    setIsSavingAbout(true);
    try {
      await cmsService.updateAboutSettings(aboutSettings);
      showCmsSuccess('About biography specifications successfully saved.');
    } catch (err: any) {
      showCmsError('Failed to save About settings: ' + err.message);
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleDeleteBiography = async () => {
    if (!aboutSettings) return;
    if (!window.confirm('소개글 단락들을 정말 모두 삭제하시겠습니까?')) return;
    
    const originalAbout = { ...aboutSettings };
    const clearedSettings: AboutSettings = {
      ...aboutSettings,
      p1: '',
      p2: '',
      p3: ''
    };
    
    setAboutSettings(clearedSettings);
    setIsSavingAbout(true);
    try {
      await cmsService.updateAboutSettings(clearedSettings);
      showCmsSuccess('Biography paragraphs successfully deleted/cleared.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete biography:', err);
      showCmsError('Failed to delete biography: ' + (err.message || err));
      setAboutSettings(originalAbout);
    } finally {
      setIsSavingAbout(false);
    }
  };

  // Biography Left settings saving handler
  const handleSaveBioLeftSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioLeft) return;
    setIsSavingBioLeft(true);
    try {
      await cmsService.updateBioLeftSettings(bioLeft);
      showCmsSuccess('Biography Overview Left specifications successfully saved.');
    } catch (err: any) {
      showCmsError('Failed to save Biography Left settings: ' + err.message);
    } finally {
      setIsSavingBioLeft(false);
    }
  };

  // Biography Right Card Modal & Submissions
  const openBioCardModal = (card: BiographyCard | null = null) => {
    if (card) {
      setEditingBioCard(card);
      setBioCardTitle(card.title);
      setBioCardDescription(card.description);
    } else {
      setEditingBioCard(null);
      setBioCardTitle('');
      setBioCardDescription('');
    }
    setIsBioCardModalOpen(true);
  };

  const handleBioCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioCardTitle.trim()) return;

    try {
      const payload = {
        title: bioCardTitle,
        description: bioCardDescription
      };

      if (editingBioCard?.id) {
        await cmsService.updateBioCard(editingBioCard.id, payload);
        showCmsSuccess('Biography card successfully updated.');
      } else {
        await cmsService.createBioCard(payload);
        showCmsSuccess('New biography card successfully created.');
      }

      const loadedCards = await cmsService.getBioCards();
      setBioCards(loadedCards);
      setIsBioCardModalOpen(false);
      setEditingBioCard(null);
    } catch (err: any) {
      showCmsError('Failed to save biography card: ' + err.message);
    }
  };

  const handleDeleteBioCard = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('이 경력 카드 항목을 정말 삭제하시겠습니까?')) return;

    const originalCards = [...bioCards];
    setBioCards(prev => prev.filter(c => c.id !== id));

    try {
      await cmsService.deleteBioCard(id);
      showCmsSuccess('Biography card successfully deleted.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete biography card:', err);
      showCmsError('Failed to delete biography card: ' + (err.message || err));
      setBioCards(originalCards);
    }
  };

  const handleMoveBioCard = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= bioCards.length) return;

    const updatedCards = [...bioCards];
    const [moved] = updatedCards.splice(index, 1);
    updatedCards.splice(nextIndex, 0, moved);

    setBioCards(updatedCards);

    try {
      const orderedIds = updatedCards.map(c => c.id).filter((id): id is string => !!id);
      await cmsService.reorderBioCards(orderedIds);
    } catch (err: any) {
      console.error('Failed to reorder biography cards:', err);
      showCmsError('Failed to reorder biography cards: ' + err.message);
    }
  };

  // Skills handlers
  const openSkillModal = (skill: Skill | null = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillName(skill.name);
      setSkillCategory(skill.category);
      setSkillLevel(skill.level);
      setSkillIconName(skill.iconName || 'FileCode');
    } else {
      setEditingSkill(null);
      setSkillName('');
      setSkillCategory('development');
      setSkillLevel(85);
      setSkillIconName('FileCode');
    }
    setIsSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    try {
      const payload = {
        name: skillName,
        category: skillCategory,
        level: skillLevel,
        iconName: skillIconName
      };

      if (editingSkill?.id) {
        await cmsService.updateSkill(editingSkill.id, payload);
        showCmsSuccess('Skill details successfully updated.');
      } else {
        await cmsService.createSkill(payload);
        showCmsSuccess('New tech asset successfully created.');
      }

      const loadedSkills = await cmsService.getSkills();
      setSkills(loadedSkills);
      setIsSkillModalOpen(false);
      setEditingSkill(null);
    } catch (err: any) {
      showCmsError('Failed to save skill: ' + err.message);
    }
  };

  const handleDeleteSkill = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('이 기술 항목을 정말 삭제하시겠습니까?')) return;
    
    const originalSkills = [...skills];
    setSkills(prev => prev.filter(s => s.id !== id));
    
    try {
      await cmsService.deleteSkill(id);
      showCmsSuccess('Skill successfully deleted from database.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete skill:', err);
      showCmsError('Failed to delete skill: ' + (err.message || err));
      setSkills(originalSkills);
    }
  };

  const handleMoveSkill = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= skills.length) return;

    const updatedSkills = [...skills];
    const [moved] = updatedSkills.splice(index, 1);
    updatedSkills.splice(nextIndex, 0, moved);

    setSkills(updatedSkills);

    try {
      const orderedIds = updatedSkills.map(s => s.id).filter((id): id is string => !!id);
      await cmsService.reorderSkills(orderedIds);
    } catch (err: any) {
      console.error('Failed to reorder skills:', err);
      showCmsError('Failed to reorder skills: ' + err.message);
    }
  };

  // Certifications handlers
  const openCertModal = (cert: Certification | null = null) => {
    if (cert) {
      setEditingCert(cert);
      setCertName(cert.name);
      setCertAuthority(cert.authority);
      setCertDate(cert.date);
      setCertCode(cert.code || '');
    } else {
      setEditingCert(null);
      setCertName('');
      setCertAuthority('');
      setCertDate('');
      setCertCode('');
    }
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certAuthority.trim()) return;

    try {
      const payload = {
        name: certName,
        authority: certAuthority,
        date: certDate,
        code: certCode
      };

      if (editingCert?.id) {
        await cmsService.updateCertification(editingCert.id, payload);
        showCmsSuccess('Certification details successfully updated.');
      } else {
        await cmsService.createCertification(payload);
        showCmsSuccess('New credential successfully cataloged.');
      }

      const loadedCerts = await cmsService.getCertifications();
      setCerts(loadedCerts);
      setIsCertModalOpen(false);
      setEditingCert(null);
    } catch (err: any) {
      showCmsError('Failed to save certification: ' + err.message);
    }
  };

  const handleDeleteCert = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('이 자격증 항목을 정말 삭제하시겠습니까?')) return;
    
    const originalCerts = [...certs];
    setCerts(prev => prev.filter(c => c.id !== id));
    
    try {
      await cmsService.deleteCertification(id);
      showCmsSuccess('Certification successfully deleted from database.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete certification:', err);
      showCmsError('Failed to delete certification: ' + (err.message || err));
      setCerts(originalCerts);
    }
  };

  const handleMoveCert = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= certs.length) return;

    const updatedCerts = [...certs];
    const [moved] = updatedCerts.splice(index, 1);
    updatedCerts.splice(nextIndex, 0, moved);

    setCerts(updatedCerts);

    try {
      const orderedIds = updatedCerts.map(c => c.id).filter((id): id is string => !!id);
      await cmsService.reorderCertifications(orderedIds);
    } catch (err: any) {
      console.error('Failed to reorder certifications:', err);
      showCmsError('Failed to reorder certifications: ' + err.message);
    }
  };

  // Contacts handlers
  const openContactModal = (contact: ContactChannel | null = null) => {
    if (contact) {
      setEditingContact(contact);
      setContactLabel(contact.label);
      setContactValue(contact.value);
      setContactIconName(contact.iconName);
      setContactType(contact.type);
    } else {
      setEditingContact(null);
      setContactLabel('');
      setContactValue('');
      setContactIconName('Mail');
      setContactType('contact');
    }
    setIsContactModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactLabel.trim() || !contactValue.trim()) return;

    try {
      const payload = {
        label: contactLabel,
        value: contactValue,
        iconName: contactIconName,
        type: contactType
      };

      if (editingContact?.id) {
        await cmsService.updateContactChannel(editingContact.id, payload);
        showCmsSuccess('Contact details successfully updated.');
      } else {
        await cmsService.createContactChannel(payload);
        showCmsSuccess('New communications port successfully mapped.');
      }

      const loadedContacts = await cmsService.getContactChannels();
      setContacts(loadedContacts);
      setIsContactModalOpen(false);
      setEditingContact(null);
    } catch (err: any) {
      showCmsError('Failed to save contact: ' + err.message);
    }
  };

  const handleDeleteContact = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('이 연락처 항목을 정말 삭제하시겠습니까?')) return;
    
    const originalContacts = [...contacts];
    setContacts(prev => prev.filter(c => c.id !== id));
    
    try {
      await cmsService.deleteContactChannel(id);
      showCmsSuccess('Contact channel successfully deleted from database.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete contact channel:', err);
      showCmsError('Failed to delete contact: ' + (err.message || err));
      setContacts(originalContacts);
    }
  };

  const handleMoveContact = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= contacts.length) return;

    const updatedContacts = [...contacts];
    const [moved] = updatedContacts.splice(index, 1);
    updatedContacts.splice(nextIndex, 0, moved);

    setContacts(updatedContacts);

    try {
      const orderedIds = updatedContacts.map(c => c.id).filter((id): id is string => !!id);
      await cmsService.reorderContactChannels(orderedIds);
    } catch (err: any) {
      console.error('Failed to reorder contacts:', err);
      showCmsError('Failed to reorder contacts: ' + err.message);
    }
  };

  // Image Upload handler with WebP and progress tracking
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCoverFile(file);
  };

  const uploadCoverFile = async (file: File) => {
    setFormError('');
    setCoverUploadProgress(1); // initialize progress indicator
    try {
      const url = await storageService.uploadFile(file, 'projects', (percent) => {
        setCoverUploadProgress(percent);
      });
      setFormCover(url);
      setFormSuccess('Cover image uploaded and WebP-optimized successfully.');
    } catch (err: any) {
      setFormError(`Cover upload failed: ${err.message}`);
    } finally {
      setCoverUploadProgress(null);
    }
  };

  // Gallery Multi-upload Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadGalleryFiles(Array.from(files));
  };

  const uploadGalleryFiles = async (files: File[]) => {
    setFormError('');
    
    // Process files sequentially or in parallel; let's do parallel with individual tracking for best speed and UX!
    const uploadPromises = files.map(async (file) => {
      const uploadId = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      
      // Add to active uploads
      setGalleryUploads(prev => [...prev, { id: uploadId, name: file.name, progress: 1 }]);
      
      try {
        const url = await storageService.uploadFile(file, 'projects', (percent) => {
          setGalleryUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: percent } : u));
        });
        
        // Add successfully uploaded url to images state
        setFormImages(prev => [...prev, url]);
        
        // Remove from active uploads list
        setGalleryUploads(prev => prev.filter(u => u.id !== uploadId));
      } catch (err: any) {
        console.error('Gallery file upload failed:', err);
        setGalleryUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 0, error: err.message || 'Upload failed' } : u));
        setFormError(`Gallery upload failed for "${file.name}":\n${err.message || err}`);
      }
    });

    await Promise.all(uploadPromises);
  };

  // Drag and Drop event handlers
  const handleDragOver = (e: React.DragEvent, type: 'cover' | 'gallery') => {
    e.preventDefault();
    if (type === 'cover') setIsCoverDragging(true);
    if (type === 'gallery') setIsGalleryDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent, type: 'cover' | 'gallery') => {
    e.preventDefault();
    if (type === 'cover') setIsCoverDragging(false);
    if (type === 'gallery') setIsGalleryDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, type: 'cover' | 'gallery') => {
    e.preventDefault();
    if (type === 'cover') {
      setIsCoverDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        await uploadCoverFile(file);
      }
    } else {
      setIsGalleryDragging(false);
      const files = Array.from(e.dataTransfer.files) as File[];
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        await uploadGalleryFiles(imageFiles);
      }
    }
  };

  // Reordering sub-images
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    // Swap elements
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    
    setFormImages(newImages);
  };

  // Deleting sub-images
  const handleDeleteGalleryImage = async (index: number) => {
    const url = formImages[index];
    try {
      // Opt-out confirmation to make delete feel incredibly snappy and interactive
      await storageService.deleteFile(url, 'projects');
      setFormImages(prev => prev.filter((_, idx) => idx !== index));
    } catch (err: any) {
      console.error('Failed to delete storage file, removing from list anyway:', err);
      setFormImages(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  // --- CMS List Handler Functions ---
  const handleAddProgram = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newProgramName.trim()) return;
    
    const newProg: ProgramInfo = {
      name: newProgramName.trim(),
      role: newProgramRole.trim(),
      category: newProgramCategory
    };

    if (editingProgramIndex !== null) {
      setFormSoftwarePrograms(prev => prev.map((p, idx) => idx === editingProgramIndex ? newProg : p));
      setEditingProgramIndex(null);
    } else {
      setFormSoftwarePrograms(prev => [...prev, newProg]);
    }

    setNewProgramName('');
    setNewProgramRole('');
    setNewProgramCategory('Design');
  };

  const handleEditProgram = (index: number) => {
    const prog = formSoftwarePrograms[index];
    setNewProgramName(prog.name);
    setNewProgramRole(prog.role || '');
    setNewProgramCategory(prog.category || 'Design');
    setEditingProgramIndex(index);
  };

  const handleDeleteProgram = (index: number) => {
    setFormSoftwarePrograms(prev => prev.filter((_, idx) => idx !== index));
    if (editingProgramIndex === index) {
      setEditingProgramIndex(null);
      setNewProgramName('');
      setNewProgramRole('');
    }
  };

  const handleMoveProgram = (index: number, direction: 'up' | 'down') => {
    const newProgs = [...formSoftwarePrograms];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newProgs.length) return;
    const temp = newProgs[index];
    newProgs[index] = newProgs[target];
    newProgs[target] = temp;
    setFormSoftwarePrograms(newProgs);
  };

  const handleAddHighlight = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newHighlightText.trim()) return;
    setFormProjectHighlights(prev => [...prev, newHighlightText.trim()]);
    setNewHighlightText('');
  };

  const handleDeleteHighlight = (index: number) => {
    setFormProjectHighlights(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveHighlight = (index: number, direction: 'up' | 'down') => {
    const newHighlights = [...formProjectHighlights];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newHighlights.length) return;
    const temp = newHighlights[index];
    newHighlights[index] = newHighlights[target];
    newHighlights[target] = temp;
    setFormProjectHighlights(newHighlights);
  };

  // Project creation & update submission handler
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formTitle || !formDesc || !formCategory || !formYear) {
      setFormError('Please enter all required specifications (Title, Desc, Category, Year).');
      return;
    }

    const tags = formTagsString.split(',').map((t) => t.trim()).filter(Boolean);

    const projectPayload: Omit<Project, 'id'> = {
      title: formTitle,
      description: formDesc,
      longDescription: formLongDesc,
      category: formCategory,
      coverImage: formCover,
      tags,
      role: formRole,
      client: formClient,
      year: formYear,
      link: formLink || undefined,
      github: formGithub || undefined,
      featured: formFeatured,
      
      // Dynamic CMS fields
      detailTitle: formDetailTitle,
      detailQuote: formDetailQuote,
      softwarePrograms: formSoftwarePrograms,
      projectHighlights: formProjectHighlights
    };

    try {
      if (editingProject) {
        // Update Action with multiple images list!
        await projectsService.updateProject(editingProject.id, {
          ...projectPayload,
          id: editingProject.id,
          images: formImages
        });
        setFormSuccess('Project specification updated successfully.');
      } else {
        // Create Action with multiple images list!
        await projectsService.createProject({
          ...projectPayload,
          images: formImages
        });
        setFormSuccess('New project created and cataloged successfully.');
      }

      await loadAllData();
      
      // Close Modal after brief delay
      setTimeout(() => {
        closeProjectModal();
      }, 1000);

    } catch (err: any) {
      setFormError(err.message || 'Failed to save project specs.');
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormDesc('');
    setFormLongDesc('');
    setFormCategory('Design');
    setFormCover('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    setFormImages([]);
    setGalleryUploads([]);
    setFormTagsString('React, UI/UX, Motion');
    setFormRole('Lead Designer');
    setFormClient('Aether Technologies');
    setFormYear('2026');
    setFormLink('');
    setFormGithub('');
    setFormFeatured(false);
    
    // Dynamic CMS fields
    setFormDetailTitle('');
    setFormDetailQuote('');
    setFormSoftwarePrograms([]);
    setFormProjectHighlights([]);
    setNewProgramName('');
    setNewProgramRole('');
    setNewProgramCategory('Design');
    setEditingProgramIndex(null);
    setNewHighlightText('');
    
    setFormError('');
    setFormSuccess('');
    setIsProjectModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormDesc(project.description);
    setFormLongDesc(project.longDescription || '');
    setFormCategory(project.category);
    setFormCover(project.coverImage);
    setFormImages(project.images || []);
    setGalleryUploads([]);
    setFormTagsString(project.tags.join(', '));
    setFormRole(project.role || '');
    setFormClient(project.client || '');
    setFormYear(project.year);
    setFormLink(project.link || '');
    setFormGithub(project.github || '');
    setFormFeatured(project.featured || false);

    // Dynamic CMS fields
    setFormDetailTitle(project.detailTitle || '');
    setFormDetailQuote(project.detailQuote || '');
    setFormSoftwarePrograms(project.softwarePrograms || []);
    setFormProjectHighlights(project.projectHighlights || []);
    setNewProgramName('');
    setNewProgramRole('');
    setNewProgramCategory('Design');
    setEditingProgramIndex(null);
    setNewHighlightText('');

    setFormError('');
    setFormSuccess('');
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
    setGalleryUploads([]);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('이 프로젝트를 영구적으로 삭제하시겠습니까?')) return;
    
    const originalProjects = [...projects];
    setProjects(prev => prev.filter(p => p.id !== id));
    
    try {
      await projectsService.deleteProject(id);
      showCmsSuccess('Project successfully deleted from database.');
    } catch (err: any) {
      console.error('[Delete Error] Failed to delete project:', err);
      showCmsError('Failed to delete project: ' + (err.message || err));
      setProjects(originalProjects);
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 min-h-screen bg-[#050505] text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ================= HEADER PANEL ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f27d26] animate-pulse" />
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">CONTROL PORTAL</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              ADMINISTRATIVE NODE
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-black tracking-widest uppercase rounded-sm bg-[#f27d26] hover:bg-white text-black transition-all shadow-lg shadow-[#f27d26]/10 cursor-pointer"
            >
              <Plus size={13} /> ADD NEW WORK
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold tracking-widest uppercase rounded-sm border border-white/10 hover:border-[#f27d26] hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              DISCONNECT <LogOut size={12} />
            </button>
          </div>
        </div>

        {/* ================= LOCAL BYPASS SESSION WARNING ================= */}
        {!isSupabaseAuthenticated && isSupabaseConfigured && (
          <div className="p-5 bg-amber-950/25 border border-[#f27d26]/40 rounded-sm text-amber-200 text-xs font-mono space-y-3">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#f27d26]">
              <AlertCircle size={15} className="shrink-0 text-[#f27d26]" />
              <span>WARNING: LOCAL BYPASS SESSION ACTIVE</span>
            </div>
            <p className="leading-relaxed text-zinc-300">
              You are logged in using the local bypass master password (<code className="text-white bg-white/10 px-1 py-0.5 rounded">1111</code>). 
              Since you do not have an active Supabase Authentication session, remote table operations (such as deleting projects, skills, or biography details) will fail under Row Level Security (RLS) rules.
            </p>
            <div className="pt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
              <span className="text-amber-400/90 font-bold">To resolve this:</span>
              <span className="text-zinc-400">1. Disconnect this session.</span>
              <span className="text-zinc-400">2. Log in using your registered Supabase Admin Email & Password (e.g., <code className="text-white bg-white/10 px-1 py-0.5 rounded">dodan556@gmail.com</code>).</span>
            </div>
          </div>
        )}

        {/* ================= SUPABASE INTEGRATION HEALTH CHECK INDICATOR ================= */}
        <div className="p-6 bg-[#090909] border border-white/5 rounded-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xs font-mono font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={13} className="text-[#f27d26]" />
                SUPABASE CONNECTIVITY REPORT // 연결 상태 점검
              </h2>
              <p className="text-[11px] text-zinc-500 font-light">
                Verifies database structures, media file storage bucket, and JSON schema syncing status.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={autoTestConnection}
                disabled={isTestingConnection}
                className="px-3 py-1.5 text-[9px] font-mono border border-white/10 hover:border-[#f27d26] rounded-sm uppercase tracking-widest bg-black text-zinc-400 hover:text-white transition-colors"
              >
                {isTestingConnection ? 'TESTING HANDSHAKE...' : 'TEST HANDSHAKE'}
              </button>

              <button
                onClick={handleSeedDatabase}
                disabled={seedingLoading || !isSupabaseConfigured}
                className={`px-3 py-1.5 text-[9px] font-mono rounded-sm uppercase tracking-widest transition-all ${
                  isSupabaseConfigured 
                    ? 'bg-[#f27d26]/10 text-[#f27d26] hover:bg-[#f27d26]/20 border border-[#f27d26]/30' 
                    : 'bg-zinc-950 border border-white/5 text-zinc-650 cursor-not-allowed'
                }`}
                title="If your Supabase database is connected but empty, click here to seed it with the portfolio items!"
              >
                {seedingLoading ? 'SEEDING DATABASE...' : 'SEED TABLES'}
              </button>
            </div>
          </div>

          {/* Active health nodes check */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2.5 bg-zinc-950/40 p-3 rounded-sm border border-white/5">
              <Database size={14} className={connectionReport.dbOk ? 'text-emerald-400' : 'text-zinc-550'} />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 block leading-none">DATABASE</span>
                <span className={`text-[10px] font-bold uppercase font-mono ${connectionReport.dbOk ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {connectionReport.dbOk ? 'ONLINE' : 'FALLBACK LOCAL'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-950/40 p-3 rounded-sm border border-white/5">
              <HardDrive size={14} className={connectionReport.storageOk ? 'text-emerald-400' : 'text-zinc-550'} />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 block leading-none">STORAGE</span>
                <span className={`text-[10px] font-bold uppercase font-mono ${connectionReport.storageOk ? 'text-emerald-400' : 'text-zinc-550'}`}>
                  {connectionReport.storageOk ? 'ONLINE' : 'FALLBACK BASE64'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-950/40 p-3 rounded-sm border border-white/5">
              <Lock size={14} className={connectionReport.authOk ? 'text-emerald-400' : 'text-zinc-550'} />
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 block leading-none">AUTH NODE</span>
                <span className={`text-[10px] font-bold uppercase font-mono ${connectionReport.authOk ? 'text-emerald-400' : 'text-zinc-550'}`}>
                  {connectionReport.authOk ? 'ACTIVE' : 'FALLBACK STATIC'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/45 border border-white/5 rounded-sm flex items-center justify-between text-xs font-mono">
              <div className="truncate pr-2">
                <span className="text-[8px] text-zinc-550 uppercase block">NETWORK CONTEXT</span>
                <span className="text-zinc-400 uppercase text-[9px] truncate tracking-wider block" title={connectionReport.details}>
                  {connectionReport.details || 'Connection untested.'}
                </span>
              </div>
              {connectionReport.status === 'connected' ? (
                <span className="px-1.5 py-0.5 bg-emerald-950/35 border border-emerald-900 text-emerald-400 font-bold text-[8px] rounded-sm">
                  OK
                </span>
              ) : (
                <span className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 text-zinc-500 font-bold text-[8px] rounded-sm">
                  OFFLINE
                </span>
              )}
            </div>
          </div>

          {seedingMessage && (
            <div className="p-3 bg-zinc-950 border border-[#f27d26]/20 text-[10px] font-mono text-[#f27d26] rounded-sm uppercase tracking-wide">
              {seedingMessage}
            </div>
          )}
        </div>

        {/* ================= INTERACTIVE TABS ================= */}
        <div className="flex border-b border-white/10 gap-1 flex-wrap">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'projects'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            PORTFOLIO WORKS ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            INQUIRIES ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'home'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            HOME HERO
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'about'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            ABOUT BIO
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'skills'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            SKILLS ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'certs'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            CERTS ({certs.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-3 text-[11px] font-mono uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-[#f27d26] text-white bg-white/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            CONTACTS ({contacts.length})
          </button>
        </div>

        {/* ================= TAB CONTENTS ================= */}
        {loading ? (
          <div className="text-center py-24 bg-[#090909] border border-white/5 rounded-sm font-mono text-zinc-500 text-xs">
            CONNECTING CLOUD DATABASES...
          </div>
        ) : activeTab === 'projects' ? (
          
          /* Projects Manager Grid View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                CATALOG INDEX // 리스트 목록 ({projects.length} Works)
              </span>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-sm bg-[#090909] border border-white/5 hover:border-white/15 transition-all group space-y-4"
                  >
                    <div className="aspect-video rounded-sm overflow-hidden bg-zinc-950 border border-white/5 relative">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 bg-[#f27d26] text-black text-[8px] font-mono font-bold uppercase rounded-sm">
                          {project.category}
                        </span>
                      </div>
                      {project.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 bg-amber-500 text-black text-[8px] font-mono font-bold uppercase rounded-sm flex items-center gap-1">
                            <Sparkles size={8} /> FEATURED
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase">
                        <span>{project.client || 'INTERNAL'}</span>
                        <span>{project.year}</span>
                      </div>
                      
                      <h3 className="font-display font-black text-base text-white truncate uppercase" title={project.title}>
                        {project.title}
                      </h3>
                      
                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 border border-white/5 bg-zinc-950 text-zinc-500 text-[8px] font-mono uppercase rounded-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[8px] text-zinc-600 font-mono">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[9px] font-mono text-zinc-600">ID: {project.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-[#f27d26]/40 text-zinc-400 hover:text-white rounded-sm transition-colors cursor-pointer"
                          title="Edit specifications"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 bg-zinc-950 hover:bg-rose-950/20 border border-white/5 hover:border-rose-900/50 text-rose-500 hover:text-rose-400 rounded-sm transition-colors cursor-pointer"
                          title="Delete work"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-sm">
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  PORTFOLIO IS EMPTY. CLICK 'SEED TABLES' ABOVE OR 'ADD NEW WORK' TO START!
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'inquiries' ? (
          
          /* Inquiries / Contacts Submissions list */
          <div className="p-6 md:p-8 rounded-sm bg-[#090909] border border-white/10 space-y-6">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="text-[#f27d26]" size={18} />
              <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                TRANSMITTED CLIENT INQUIRIES ({submissions.length})
              </h2>
            </div>

            {submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      <th className="pb-4 font-normal">SENDER</th>
                      <th className="pb-4 font-normal">TOPIC / SUBJECT</th>
                      <th className="pb-4 font-normal">MESSAGE NARRATIVE</th>
                      <th className="pb-4 font-normal">DATE TIMESTAMP</th>
                      <th className="pb-4 font-normal text-right">CONTROLS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className={`border-b border-white/5 text-sm font-sans last:border-b-0 hover:bg-zinc-950/45 ${
                          sub.status === 'unread' ? 'bg-[#f27d26]/5' : ''
                        }`}
                      >
                        <td className="py-4 pr-4">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-white block">
                              {sub.name}
                            </span>
                            <span className="text-xs text-zinc-500 font-mono block">{sub.email}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 align-top text-zinc-350 font-semibold uppercase text-xs">
                          {sub.subject || '—'}
                        </td>
                        <td className="py-4 pr-4 align-top text-xs text-zinc-400 max-w-xs whitespace-pre-wrap leading-relaxed font-light">
                          {sub.message}
                        </td>
                        <td className="py-4 pr-4 align-top text-xs text-zinc-400 font-mono">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            {sub.status === 'unread' ? (
                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'read')}
                                className="p-1.5 rounded-sm border border-white/10 text-zinc-400 hover:text-[#f27d26] hover:border-[#f27d26] transition-colors cursor-pointer"
                                title="Mark as Read"
                              >
                                <CheckCircle size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'unread')}
                                className="p-1.5 rounded-sm border border-white/10 text-zinc-400 hover:text-[#f27d26] hover:border-[#f27d26] transition-colors cursor-pointer"
                                title="Mark as Unread"
                              >
                                <Clock size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="p-1.5 rounded-sm border border-rose-950/40 text-rose-500 hover:bg-rose-950/20 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete inquiry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  NO CLIENT INQUIRIES TRANSMITTED YET
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'home' ? (
          
          /* Home Main text settings */
          <div className="p-6 md:p-8 rounded-sm bg-[#090909] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  HOME MAIN TEXT SPECIFICATIONS
                </h2>
                <p className="text-xs text-zinc-500">
                  메인 히어로 영역의 타이포그래피 문구와 하단 그리드의 메타데이터를 편집합니다.
                </p>
              </div>
            </div>

            {homeSettings ? (
              <form onSubmit={handleSaveHomeSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">HERO LINE 1 (KOREAN)</label>
                    <input
                      type="text"
                      required
                      value={homeSettings.line1}
                      onChange={(e) => setHomeSettings({ ...homeSettings, line1: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">HERO LINE 2 (ENGLISH - ACCENT)</label>
                    <input
                      type="text"
                      required
                      value={homeSettings.line2}
                      onChange={(e) => setHomeSettings({ ...homeSettings, line2: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-[#f27d26] rounded-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">HERO LINE 3 (KOREAN)</label>
                    <input
                      type="text"
                      required
                      value={homeSettings.line3}
                      onChange={(e) => setHomeSettings({ ...homeSettings, line3: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">SUB HEADLINE NARRATIVE</label>
                  <input
                    type="text"
                    required
                    value={homeSettings.subHeadline}
                    onChange={(e) => setHomeSettings({ ...homeSettings, subHeadline: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-mono text-[#f27d26] uppercase tracking-wider font-bold">
                    HERO BOTTOM METRICS (EDITABLE & SORTABLE)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item 1: Experience */}
                    <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">METRIC 1: EXPERIENCE</span>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">TITLE (LABEL)</label>
                          <input
                            type="text"
                            required
                            value={expItem.label}
                            onChange={(e) => setExpItem({ ...expItem, label: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">CONTENT (VALUE)</label>
                          <input
                            type="text"
                            required
                            value={expItem.value}
                            onChange={(e) => setExpItem({ ...expItem, value: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">SORT ORDER</label>
                          <input
                            type="number"
                            required
                            value={expItem.sortOrder}
                            onChange={(e) => setExpItem({ ...expItem, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Item 2: Location */}
                    <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">METRIC 2: LOCATION</span>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">TITLE (LABEL)</label>
                          <input
                            type="text"
                            required
                            value={locItem.label}
                            onChange={(e) => setLocItem({ ...locItem, label: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">CONTENT (VALUE)</label>
                          <input
                            type="text"
                            required
                            value={locItem.value}
                            onChange={(e) => setLocItem({ ...locItem, value: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">SORT ORDER</label>
                          <input
                            type="number"
                            required
                            value={locItem.sortOrder}
                            onChange={(e) => setLocItem({ ...locItem, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Item 3: Primary Stack */}
                    <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-mono text-[#f27d26] uppercase tracking-widest font-bold">METRIC 3: PRIMARY STACK</span>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">TITLE (LABEL)</label>
                          <input
                            type="text"
                            required
                            value={stackItem.label}
                            onChange={(e) => setStackItem({ ...stackItem, label: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">CONTENT (VALUE)</label>
                          <input
                            type="text"
                            required
                            value={stackItem.value}
                            onChange={(e) => setStackItem({ ...stackItem, value: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">SORT ORDER</label>
                          <input
                            type="number"
                            required
                            value={stackItem.sortOrder}
                            onChange={(e) => setStackItem({ ...stackItem, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Item 4: Infrastructure */}
                    <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">METRIC 4: INFRASTRUCTURE</span>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">TITLE (LABEL)</label>
                          <input
                            type="text"
                            required
                            value={infraItem.label}
                            onChange={(e) => setInfraItem({ ...infraItem, label: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">CONTENT (VALUE)</label>
                          <input
                            type="text"
                            required
                            value={infraItem.value}
                            onChange={(e) => setInfraItem({ ...infraItem, value: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">SORT ORDER</label>
                          <input
                            type="number"
                            required
                            value={infraItem.sortOrder}
                            onChange={(e) => setInfraItem({ ...infraItem, sortOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status messages in tab */}
                {(cmsSuccessMessage || cmsErrorMessage) && (
                  <div className={`p-3.5 text-xs font-mono rounded-sm border ${
                    cmsSuccessMessage ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' : 'bg-rose-950/20 border-rose-900 text-[#f27d26]'
                  }`}>
                    {cmsSuccessMessage || cmsErrorMessage}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={isSavingHome}
                    className="px-6 py-3 bg-[#f27d26] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    {isSavingHome ? 'SAVING SPECIFICATIONS...' : 'SAVE SPECIFICATIONS'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-zinc-500 font-mono text-xs">NO HOME SETTINGS STATE DETECTED</div>
            )}
          </div>
        ) : activeTab === 'about' ? (
          
          /* About biography settings */
          <div className="p-6 md:p-8 rounded-sm bg-[#090909] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  ABOUT BIOGRAPHY SPECIFICATIONS
                </h2>
                <p className="text-xs text-zinc-500">
                  소개 페이지의 제목, 부제목, 그리고 상세 소개글 단락들을 구성합니다.
                </p>
              </div>
            </div>

            {aboutSettings ? (
              <form onSubmit={handleSaveAboutSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">PAGE DISPLAY TITLE</label>
                    <input
                      type="text"
                      required
                      value={aboutSettings.title}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">PAGE PROFILE SUBTITLE</label>
                    <input
                      type="text"
                      required
                      value={aboutSettings.subtitle}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, subtitle: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-[#f27d26] rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">BIOGRAPHY PARAGRAPH 1</label>
                    <textarea
                      rows={3}
                      required
                      value={aboutSettings.p1}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, p1: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">BIOGRAPHY PARAGRAPH 2</label>
                    <textarea
                      rows={3}
                      required
                      value={aboutSettings.p2}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, p2: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">BIOGRAPHY PARAGRAPH 3</label>
                    <textarea
                      rows={3}
                      required
                      value={aboutSettings.p3}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, p3: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none resize-y"
                    />
                  </div>
                </div>

                {/* Status messages in tab */}
                {(cmsSuccessMessage || cmsErrorMessage) && (
                  <div className={`p-3.5 text-xs font-mono rounded-sm border ${
                    cmsSuccessMessage ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' : 'bg-rose-950/20 border-rose-900 text-[#f27d26]'
                  }`}>
                    {cmsSuccessMessage || cmsErrorMessage}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-white/5 gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteBiography}
                    disabled={isSavingAbout}
                    className="px-6 py-3 bg-zinc-900 hover:bg-rose-950/25 border border-white/10 hover:border-rose-500 text-rose-500 hover:text-rose-400 font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    DELETE BIOGRAPHY
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAbout}
                    className="px-6 py-3 bg-[#f27d26] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    {isSavingAbout ? 'SAVING BIOGRAPHY...' : 'SAVE BIOGRAPHY'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-zinc-500 font-mono text-xs">NO ABOUT SETTINGS STATE DETECTED</div>
            )}

            {/* Biography Left Settings */}
            <hr className="border-white/10 my-12" />

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  BIOGRAPHY OVERVIEW LEFT SETTINGS (메인 소개 왼쪽 구성)
                </h2>
                <p className="text-xs text-zinc-500">
                  메인 화면의 Biography Overview 왼쪽 영역에 표시될 타이틀, 상세 소개 및 레이블을 구성합니다.
                </p>
              </div>
            </div>

            {bioLeft ? (
              <form onSubmit={handleSaveBioLeftSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold text-[#f27d26]">SECTION LABEL</label>
                    <input
                      type="text"
                      required
                      value={bioLeft.sectionLabel}
                      onChange={(e) => setBioLeft({ ...bioLeft, sectionLabel: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold text-[#f27d26]">MAIN HEADING</label>
                    <input
                      type="text"
                      required
                      value={bioLeft.mainHeading}
                      onChange={(e) => setBioLeft({ ...bioLeft, mainHeading: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">DESCRIPTION LINE 1</label>
                    <textarea
                      rows={2}
                      required
                      value={bioLeft.descLine1}
                      onChange={(e) => setBioLeft({ ...bioLeft, descLine1: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">DESCRIPTION LINE 2</label>
                    <textarea
                      rows={2}
                      required
                      value={bioLeft.descLine2}
                      onChange={(e) => setBioLeft({ ...bioLeft, descLine2: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">DESCRIPTION LINE 3</label>
                    <textarea
                      rows={2}
                      required
                      value={bioLeft.descLine3}
                      onChange={(e) => setBioLeft({ ...bioLeft, descLine3: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">BUTTON CTA TEXT</label>
                    <input
                      type="text"
                      required
                      value={bioLeft.buttonText}
                      onChange={(e) => setBioLeft({ ...bioLeft, buttonText: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={isSavingBioLeft}
                    className="px-6 py-3 bg-[#f27d26] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    {isSavingBioLeft ? 'SAVING LEFT CONFIGS...' : 'SAVE LEFT CONFIGS'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-zinc-500 font-mono text-xs">NO BIOGRAPHY LEFT SETTINGS DETECTED</div>
            )}

            {/* Biography Right Cards CRUD List */}
            <hr className="border-white/10 my-12" />

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  BIOGRAPHY DETAIL CARDS (오른쪽 카드 CRUD 목록)
                </h2>
                <p className="text-xs text-zinc-500">
                  메인 화면의 Biography Overview 우측에 동적으로 표시될 포트폴리오 경력/상세 카드를 생성, 관리합니다.
                </p>
              </div>

              <button
                onClick={() => openBioCardModal(null)}
                className="px-3 py-1.5 bg-[#f27d26]/10 text-[#f27d26] hover:bg-[#f27d26]/20 border border-[#f27d26]/30 text-[10px] font-mono rounded-sm uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <Plus size={11} /> ADD NEW BIO CARD
              </button>
            </div>

            {bioCards.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[9px] font-mono text-zinc-500 uppercase tracking-widest px-4 pb-2 border-b border-white/5">
                  <div className="col-span-2">ORDER</div>
                  <div className="col-span-3">CARD TITLE</div>
                  <div className="col-span-5">DESCRIPTION PREVIEW</div>
                  <div className="col-span-2 text-right">CONTROLS</div>
                </div>

                <div className="divide-y divide-white/5">
                  {bioCards.map((card, idx) => (
                    <div key={card.id || idx} className="grid grid-cols-12 items-center gap-4 py-3 px-4 text-xs hover:bg-zinc-950/40 transition-colors">
                      {/* Sort control buttons */}
                      <div className="col-span-2 flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveBioCard(idx, 'up')}
                          className={`p-1 rounded-xs border border-white/5 transition-colors cursor-pointer ${
                            idx === 0 
                              ? 'text-zinc-700 cursor-not-allowed' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-white/10'
                          }`}
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          disabled={idx === bioCards.length - 1}
                          onClick={() => handleMoveBioCard(idx, 'down')}
                          className={`p-1 rounded-xs border border-white/5 transition-colors cursor-pointer ${
                            idx === bioCards.length - 1 
                              ? 'text-zinc-700 cursor-not-allowed' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-white/10'
                          }`}
                        >
                          <ArrowDown size={11} />
                        </button>
                        <span className="text-[10px] font-mono text-zinc-500 ml-1">#{idx + 1}</span>
                      </div>

                      {/* Card Title */}
                      <div className="col-span-3 font-bold text-white uppercase tracking-wide truncate">
                        {card.title}
                      </div>

                      {/* Card Description */}
                      <div className="col-span-5 text-zinc-400 truncate font-light">
                        {card.description}
                      </div>

                      {/* Card Operations */}
                      <div className="col-span-2 text-right flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openBioCardModal(card)}
                          className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-[#f27d26]/45 text-zinc-400 hover:text-white rounded-sm transition-all cursor-pointer"
                        >
                          <Edit size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteBioCard(card.id)}
                          className="p-1.5 bg-zinc-950 hover:bg-rose-950/20 border border-white/5 hover:border-rose-900/40 text-rose-500 hover:text-rose-400 rounded-sm transition-all cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-sm bg-zinc-950/10">
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  No Biography Cards listed yet. Click 'ADD NEW BIO CARD' to add one!
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'skills' ? (
          
          /* Skills Management list */
          <div className="p-6 md:p-8 rounded-sm bg-[#090909] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  SKILLS INVENTORY
                </h2>
                <p className="text-xs text-zinc-500">
                  디자인, 개발, 협업 툴 스킬을 추가, 수정, 삭제 및 드래그/이동하여 순서를 변경합니다.
                </p>
              </div>

              <button
                onClick={() => openSkillModal(null)}
                className="px-3 py-1.5 bg-[#f27d26]/10 text-[#f27d26] hover:bg-[#f27d26]/20 border border-[#f27d26]/30 text-[10px] font-mono rounded-sm uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <Plus size={11} /> ADD NEW SKILL
              </button>
            </div>

            {/* Status alerts */}
            {(cmsSuccessMessage || cmsErrorMessage) && (
              <div className={`p-3 text-xs font-mono rounded-sm border ${
                cmsSuccessMessage ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' : 'bg-rose-950/20 border-rose-900 text-[#f27d26]'
              }`}>
                {cmsSuccessMessage || cmsErrorMessage}
              </div>
            )}

            {skills.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[9px] font-mono text-zinc-500 uppercase tracking-widest px-4 pb-2 border-b border-white/5">
                  <div className="col-span-2">SORT</div>
                  <div className="col-span-4">SKILL NAME</div>
                  <div className="col-span-2">CATEGORY</div>
                  <div className="col-span-2 text-right">LEVEL</div>
                  <div className="col-span-2 text-right">CONTROLS</div>
                </div>

                {skills.map((skill, idx) => (
                  <div
                    key={skill.id || idx}
                    className="grid grid-cols-12 items-center bg-zinc-950/40 p-3 rounded-sm border border-white/5 hover:border-white/10 transition-all font-mono text-xs text-zinc-300"
                  >
                    <div className="col-span-2 flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSkill(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1 rounded-sm border ${idx === 0 ? 'text-zinc-700 border-transparent cursor-not-allowed' : 'text-zinc-400 border-white/5 hover:border-[#f27d26] hover:text-[#f27d26]'} transition-colors`}
                      >
                        <ArrowUp size={11} />
                      </button>
                      <button
                        onClick={() => handleMoveSkill(idx, 'down')}
                        disabled={idx === skills.length - 1}
                        className={`p-1 rounded-sm border ${idx === skills.length - 1 ? 'text-zinc-700 border-transparent cursor-not-allowed' : 'text-zinc-400 border-white/5 hover:border-[#f27d26] hover:text-[#f27d26]'} transition-colors`}
                      >
                        <ArrowDown size={11} />
                      </button>
                    </div>

                    <div className="col-span-4 font-bold text-white uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#f27d26]"></span>
                      {skill.name}
                    </div>

                    <div className="col-span-2 text-[10px] text-zinc-500 uppercase font-mono">
                      {skill.category}
                    </div>

                    <div className="col-span-2 text-right font-bold text-[#f27d26]">
                      {skill.level}%
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openSkillModal(skill)}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white rounded-sm transition-colors cursor-pointer"
                        title="Edit skill specs"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-white/5 text-rose-500 hover:text-rose-400 rounded-sm transition-colors cursor-pointer"
                        title="Delete skill"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  NO SKILLS DETECTED. CLICK 'ADD NEW SKILL' TO INITIATE INVENTORY.
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'certs' ? (
          
          /* Certifications list */
          <div className="p-6 md:p-8 rounded-sm bg-[#090909] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  CERTIFICATIONS & CREDENTIALS
                </h2>
                <p className="text-xs text-zinc-500">
                  공인 자격증, 수료증을 추가하고 순서를 정렬합니다.
                </p>
              </div>

              <button
                onClick={() => openCertModal(null)}
                className="px-3 py-1.5 bg-[#f27d26]/10 text-[#f27d26] hover:bg-[#f27d26]/20 border border-[#f27d26]/30 text-[10px] font-mono rounded-sm uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <Plus size={11} /> ADD CREDENTIAL
              </button>
            </div>

            {/* Status alerts */}
            {(cmsSuccessMessage || cmsErrorMessage) && (
              <div className={`p-3 text-xs font-mono rounded-sm border ${
                cmsSuccessMessage ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' : 'bg-rose-950/20 border-rose-900 text-[#f27d26]'
              }`}>
                {cmsSuccessMessage || cmsErrorMessage}
              </div>
            )}

            {certs.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[9px] font-mono text-zinc-500 uppercase tracking-widest px-4 pb-2 border-b border-white/5">
                  <div className="col-span-2">SORT</div>
                  <div className="col-span-4">CREDENTIAL NAME</div>
                  <div className="col-span-3">AUTHORITY / ISSUER</div>
                  <div className="col-span-1">DATE</div>
                  <div className="col-span-2 text-right">CONTROLS</div>
                </div>

                {certs.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="grid grid-cols-12 items-center bg-zinc-950/40 p-3 rounded-sm border border-white/5 hover:border-white/10 transition-all font-mono text-xs text-zinc-300"
                  >
                    <div className="col-span-2 flex items-center gap-1">
                      <button
                        onClick={() => handleMoveCert(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1 rounded-sm border ${idx === 0 ? 'text-zinc-700 border-transparent cursor-not-allowed' : 'text-zinc-400 border-white/5 hover:border-[#f27d26] hover:text-[#f27d26]'} transition-colors`}
                      >
                        <ArrowUp size={11} />
                      </button>
                      <button
                        onClick={() => handleMoveCert(idx, 'down')}
                        disabled={idx === certs.length - 1}
                        className={`p-1 rounded-sm border ${idx === certs.length - 1 ? 'text-zinc-700 border-transparent cursor-not-allowed' : 'text-zinc-400 border-white/5 hover:border-[#f27d26] hover:text-[#f27d26]'} transition-colors`}
                      >
                        <ArrowDown size={11} />
                      </button>
                    </div>

                    <div className="col-span-4 font-bold text-white uppercase truncate pr-4" title={cert.name}>
                      {cert.name}
                    </div>

                    <div className="col-span-3 text-[11px] text-zinc-400 pr-2 truncate">
                      {cert.authority}
                    </div>

                    <div className="col-span-1 text-[10px] text-zinc-500 font-mono">
                      {cert.date}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openCertModal(cert)}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white rounded-sm transition-colors cursor-pointer"
                        title="Edit credential details"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-white/5 text-rose-500 hover:text-rose-400 rounded-sm transition-colors cursor-pointer"
                        title="Delete credential"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  NO CERTS DETECTED. CLICK 'ADD CREDENTIAL' TO LOG A VALID CERTIFICATION.
                </p>
              </div>
            )}
          </div>
        ) : (
          
          /* Contacts / Social Links list */
          <div className="p-6 md:p-8 rounded-sm bg-[#090909] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="font-display font-black uppercase tracking-wider text-base text-white">
                  CONTACT CHANNELS & SOCIAL LINKS
                </h2>
                <p className="text-xs text-zinc-500">
                  직접 이메일 주소, 지역(Geography) 및 외부 소셜네트워크 링크들을 구성합니다.
                </p>
              </div>

              <button
                onClick={() => openContactModal(null)}
                className="px-3 py-1.5 bg-[#f27d26]/10 text-[#f27d26] hover:bg-[#f27d26]/20 border border-[#f27d26]/30 text-[10px] font-mono rounded-sm uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <Plus size={11} /> ADD CHANNEL
              </button>
            </div>

            {/* Status alerts */}
            {(cmsSuccessMessage || cmsErrorMessage) && (
              <div className={`p-3 text-xs font-mono rounded-sm border ${
                cmsSuccessMessage ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' : 'bg-rose-950/20 border-rose-900 text-[#f27d26]'
              }`}>
                {cmsSuccessMessage || cmsErrorMessage}
              </div>
            )}

            {contacts.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[9px] font-mono text-zinc-500 uppercase tracking-widest px-4 pb-2 border-b border-white/5">
                  <div className="col-span-2">SORT</div>
                  <div className="col-span-3">LABEL / NAME</div>
                  <div className="col-span-3">VALUE / URL</div>
                  <div className="col-span-2">TYPE</div>
                  <div className="col-span-2 text-right">CONTROLS</div>
                </div>

                {contacts.map((contact, idx) => (
                  <div
                    key={contact.id || idx}
                    className="grid grid-cols-12 items-center bg-zinc-950/40 p-3 rounded-sm border border-white/5 hover:border-white/10 transition-all font-mono text-xs text-zinc-300"
                  >
                    <div className="col-span-2 flex items-center gap-1">
                      <button
                        onClick={() => handleMoveContact(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1 rounded-sm border ${idx === 0 ? 'text-zinc-700 border-transparent cursor-not-allowed' : 'text-zinc-400 border-white/5 hover:border-[#f27d26] hover:text-[#f27d26]'} transition-colors`}
                      >
                        <ArrowUp size={11} />
                      </button>
                      <button
                        onClick={() => handleMoveContact(idx, 'down')}
                        disabled={idx === contacts.length - 1}
                        className={`p-1 rounded-sm border ${idx === contacts.length - 1 ? 'text-zinc-700 border-transparent cursor-not-allowed' : 'text-zinc-400 border-white/5 hover:border-[#f27d26] hover:text-[#f27d26]'} transition-colors`}
                      >
                        <ArrowDown size={11} />
                      </button>
                    </div>

                    <div className="col-span-3 font-bold text-white uppercase flex items-center gap-2 pr-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f27d26]"></span>
                      {contact.label}
                    </div>

                    <div className="col-span-3 text-[11px] text-zinc-400 truncate pr-4 font-sans" title={contact.value}>
                      {contact.value}
                    </div>

                    <div className="col-span-2">
                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold ${contact.type === 'contact' ? 'bg-[#f27d26]/10 text-[#f27d26]' : 'bg-blue-950/35 text-blue-400 border border-blue-900/30'}`}>
                        {contact.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openContactModal(contact)}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white rounded-sm transition-colors cursor-pointer"
                        title="Edit channel details"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-white/5 text-rose-500 hover:text-rose-400 rounded-sm transition-colors cursor-pointer"
                        title="Delete channel"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                  NO CHANNELS DETECTED. CLICK 'ADD CHANNEL' TO LINK GITHUB OR DIRECT INBOX.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= ADD/EDIT PROJECT SPECIFICATION MODAL ================= */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-850"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <FolderPlus size={18} className="text-[#f27d26]" />
                  <h2 className="font-display font-black uppercase text-lg tracking-tight">
                    {editingProject ? 'UPDATE WORK SPECIFICATION' : 'CATALOG NEW PORTFOLIO WORK'}
                  </h2>
                </div>
                <button
                  onClick={closeProjectModal}
                  className="p-1 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status messages in forms */}
              {formError && (
                <div className="p-3.5 bg-rose-950/15 border border-rose-900 text-[#f27d26] text-xs font-mono rounded-sm flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-500" />
                  <span className="whitespace-pre-line">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 bg-emerald-950/15 border border-emerald-900 text-emerald-400 text-xs font-mono rounded-sm flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProjectSubmit} className="space-y-6">
                
                {/* Title and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., DECENTRALIZED DATA CANVAS"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white placeholder:text-zinc-650 rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      CATEGORY / FIELD *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    >
                      <option value="Design">Design (UI/UX / Visual)</option>
                      <option value="Development">Development (React / FullStack)</option>
                      <option value="Creative">Creative (3D / Motion)</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle / Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    SHORT TEASER DESCRIPTION *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Short summary highlighting the UI/UX or engineering core..."
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white placeholder:text-zinc-650 rounded-sm focus:outline-none"
                  />
                </div>

                {/* Cover Image Upload (Drag-and-Drop + Optimization) */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    COVER IMAGE ASSET // 대표 커버 이미지 (드래그 업로드 & 최적화)
                  </label>
                  
                  <div 
                    onDragOver={(e) => handleDragOver(e, 'cover')}
                    onDragLeave={(e) => handleDragLeave(e, 'cover')}
                    onDrop={(e) => handleDrop(e, 'cover')}
                    className={`p-6 border-2 rounded-sm transition-all text-center flex flex-col items-center justify-center gap-4 ${
                      isCoverDragging 
                        ? 'border-[#f27d26] bg-[#f27d26]/10' 
                        : 'border-dashed border-white/10 bg-zinc-950 hover:bg-zinc-900/50'
                    }`}
                  >
                    {formCover ? (
                      <div className="relative group max-w-xs overflow-hidden rounded-sm border border-white/10">
                        <img 
                          src={formCover} 
                          alt="Cover Preview" 
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <span className="text-[10px] font-mono text-zinc-450 uppercase">ACTIVE COVER</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
                        <ImageIcon size={20} />
                      </div>
                    )}

                    <div className="space-y-1">
                      <p className="text-xs font-sans text-zinc-300">
                        Drag and drop your image here, or <span className="text-[#f27d26] font-bold cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>browse</span>
                      </p>
                      <p className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider">
                        Supports WebP, PNG, JPEG. Automatically WebP-optimized & resized.
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCoverUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <input
                      type="text"
                      value={formCover}
                      onChange={(e) => setFormCover(e.target.value)}
                      placeholder="Or enter image URL manually (https://images.unsplash.com/...)"
                      className="w-full max-w-lg px-3 py-1.5 bg-zinc-950 border border-white/5 focus:border-[#f27d26] text-[10px] font-mono text-zinc-400 placeholder:text-zinc-650 rounded-sm text-center focus:outline-none"
                    />
                  </div>

                  {coverUploadProgress !== null && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-450 leading-none">
                        <span>OPTIMIZING & TRANSMITTING ASSET...</span>
                        <span>{coverUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-[#f27d26] h-full transition-all duration-200 rounded-full" 
                          style={{ width: `${coverUploadProgress}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Multiple Images Upload (Gallery Explorer) */}
                <div className="space-y-3 p-4 bg-zinc-950/30 border border-white/5 rounded-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      EXPLORATION GALLERY IMAGES // 추가 프로젝트 이미지 (여러 장 업로드)
                    </label>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {formImages.length} ASSETS TOTAL
                    </span>
                  </div>

                  {/* Multi drag and drop box */}
                  <div 
                    onDragOver={(e) => handleDragOver(e, 'gallery')}
                    onDragLeave={(e) => handleDragLeave(e, 'gallery')}
                    onDrop={(e) => handleDrop(e, 'gallery')}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-sm transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
                      isGalleryDragging 
                        ? 'border-[#f27d26] bg-[#f27d26]/10' 
                        : 'border-white/10 bg-zinc-950/50 hover:bg-zinc-950'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                      <Upload size={16} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-sans text-zinc-300">
                        Drag & Drop multiple project images here, or <span className="text-[#f27d26] font-bold hover:underline">browse</span>
                      </p>
                      <p className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest">
                        WebP, PNG, JPEG. Converts all files to optimized WebP.
                      </p>
                    </div>

                    <input
                      type="file"
                      multiple
                      ref={galleryFileInputRef}
                      onChange={handleGalleryUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Live Active Multi-Upload Progress Rows */}
                  {galleryUploads.length > 0 && (
                    <div className="space-y-2 bg-[#090909] p-3 rounded-sm border border-white/5">
                      <h4 className="text-[9px] font-mono text-[#f27d26] uppercase tracking-wider block">
                        ACTIVE UPLOAD QUEUE ({galleryUploads.length})
                      </h4>
                      <div className="space-y-2.5">
                        {galleryUploads.map((upload) => (
                          <div key={upload.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="text-zinc-400 truncate max-w-[200px]">{upload.name}</span>
                              {upload.error ? (
                                <span className="text-rose-500 font-bold">{upload.error}</span>
                              ) : (
                                <span className="text-zinc-500">{upload.progress}%</span>
                              )}
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className={`h-full transition-all duration-200 rounded-full ${upload.error ? 'bg-rose-500' : 'bg-[#f27d26]'}`}
                                style={{ width: `${upload.progress}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generated Thumbnails Grid with delete and reorder controls */}
                  {formImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {formImages.map((imgUrl, index) => (
                        <div 
                          key={`${imgUrl}-${index}`}
                          className="relative group bg-[#090909] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between"
                        >
                          {/* Generated Thumbnail preview */}
                          <div className="relative aspect-video w-full bg-zinc-950">
                            <img 
                              src={imgUrl} 
                              alt={`Gallery asset ${index + 1}`} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                            
                            {/* Overlay tag indicator */}
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/75 backdrop-blur-md border border-white/10 rounded-xs text-[8px] font-mono text-zinc-400">
                              #{index + 1}
                            </span>
                          </div>

                          {/* Controls bar */}
                          <div className="p-1.5 bg-black/40 border-t border-white/5 flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1">
                              {/* Reorder Up/Left */}
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveImage(index, 'up')}
                                className={`p-1 rounded-xs border border-white/5 transition-all cursor-pointer ${
                                  index === 0 
                                    ? 'text-zinc-700 border-transparent cursor-not-allowed' 
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-white/10'
                                }`}
                                title="Move up / left"
                              >
                                <ArrowUp size={11} />
                              </button>

                              {/* Reorder Down/Right */}
                              <button
                                type="button"
                                disabled={index === formImages.length - 1}
                                onClick={() => handleMoveImage(index, 'down')}
                                className={`p-1 rounded-xs border border-white/5 transition-all cursor-pointer ${
                                  index === formImages.length - 1 
                                    ? 'text-zinc-700 border-transparent cursor-not-allowed' 
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-white/10'
                                }`}
                                title="Move down / right"
                              >
                                <ArrowDown size={11} />
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(index)}
                              className="p-1 rounded-xs border border-rose-950/50 hover:bg-rose-950/20 text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete gallery image"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-white/5 rounded-sm bg-zinc-950/20">
                      <p className="font-mono text-[9px] text-zinc-650 uppercase tracking-widest">
                        No additional gallery assets uploaded yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Detailed Narrative */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    DETAILED CASE STUDY NARRATIVE (프로젝트 상세 설명)
                  </label>
                  <textarea
                    rows={4}
                    value={formLongDesc}
                    onChange={(e) => setFormLongDesc(e.target.value)}
                    placeholder="Provide a comprehensive narrative of the challenges faced, the process taken, and the aesthetic or functional systems implemented..."
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white placeholder:text-zinc-650 rounded-sm focus:outline-none resize-y"
                  />
                </div>

                {/* Metadata Sidebar (Client, Role, Year, Tags) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      CLIENT CONTEXT
                    </label>
                    <input
                      type="text"
                      value={formClient}
                      onChange={(e) => setFormClient(e.target.value)}
                      placeholder="e.g., Apple Inc"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      ROLE / POSITION
                    </label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g., Lead Architect"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      RELEASE YEAR *
                    </label>
                    <input
                      type="text"
                      required
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="e.g., 2026"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      FEATURED STATE
                    </label>
                    <div className="flex items-center h-10">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                        <input
                          type="checkbox"
                          checked={formFeatured}
                          onChange={(e) => setFormFeatured(e.target.checked)}
                          className="w-4 h-4 accent-[#f27d26] bg-zinc-950 border border-white/10 rounded-sm"
                        />
                        FEATURE WORK
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags and Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-1">
                      <Tag size={10} /> PLATFORM TAGS
                    </label>
                    <input
                      type="text"
                      value={formTagsString}
                      onChange={(e) => setFormTagsString(e.target.value)}
                      placeholder="React, CSS, ThreeJS"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white placeholder:text-zinc-650 rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-1">
                      <Eye size={10} /> LIVE PREVIEW URL
                    </label>
                    <input
                      type="url"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="https://demo.io"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white placeholder:text-zinc-650 rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-1">
                      <LinkIcon size={10} /> GITHUB REPO URL
                    </label>
                    <input
                      type="url"
                      value={formGithub}
                      onChange={(e) => setFormGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white placeholder:text-zinc-650 rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 font-mono">
                  <button
                    type="button"
                    onClick={closeProjectModal}
                    className="px-4 py-3 text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 hover:bg-zinc-900 text-zinc-300 rounded-sm transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={uploadProgress}
                    className="px-6 py-3 text-xs uppercase tracking-widest font-black bg-[#f27d26] hover:bg-white text-black transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={13} /> {editingProject ? 'SAVE MODIFICATIONS' : 'CATALOG WORK'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD/EDIT SKILL MODAL ================= */}
      <AnimatePresence>
        {isSkillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={18} className="text-[#f27d26]" />
                  <h2 className="font-display font-black uppercase text-lg tracking-tight">
                    {editingSkill ? 'EDIT SKILL ASSET' : 'CREATE NEW SKILL ASSET'}
                  </h2>
                </div>
                <button
                  onClick={() => { setIsSkillModalOpen(false); setEditingSkill(null); }}
                  className="p-1 hover:bg-zinc-900 border border-transparent hover:border-white/10 text-zinc-400 hover:text-white rounded-sm transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSkillSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">SKILL NAME / TITLE</label>
                  <input
                    type="text"
                    required
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="e.g. React, Docker, Figma"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">CATEGORY</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                  >
                    <option value="development">DEVELOPMENT (개발)</option>
                    <option value="design">DESIGN & CREATIVE (디자인)</option>
                    <option value="collaboration">COLLABORATION & TOOLS (기타/협업)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">PROFICIENCY LEVEL</label>
                    <span className="text-xs font-mono text-[#f27d26] font-bold">{skillLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f27d26]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">LUCIDE ICON NAME</label>
                  <input
                    type="text"
                    required
                    value={skillIconName}
                    onChange={(e) => setSkillIconName(e.target.value)}
                    placeholder="e.g. Code2, Layout, Database"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Lucide Icon Name (예: Code2, Layout, Cpu, Database, Figma, Shield, Palette)
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => { setIsSkillModalOpen(false); setEditingSkill(null); }}
                    className="px-4 py-2.5 text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 hover:bg-zinc-900 text-zinc-300 rounded-sm transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs uppercase tracking-widest font-black bg-[#f27d26] hover:bg-white text-black transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={13} /> SAVE SKILL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD/EDIT CERTIFICATION MODAL ================= */}
      <AnimatePresence>
        {isCertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#f27d26]" />
                  <h2 className="font-display font-black uppercase text-lg tracking-tight">
                    {editingCert ? 'EDIT CERTIFICATION' : 'ADD CERTIFICATION'}
                  </h2>
                </div>
                <button
                  onClick={() => { setIsCertModalOpen(false); setEditingCert(null); }}
                  className="p-1 hover:bg-zinc-900 border border-transparent hover:border-white/10 text-zinc-400 hover:text-white rounded-sm transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCertSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">CREDENTIAL NAME</label>
                  <input
                    type="text"
                    required
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="e.g. Information Processing Engineer"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">ISSUER / AUTHORITY</label>
                  <input
                    type="text"
                    required
                    value={certAuthority}
                    onChange={(e) => setCertAuthority(e.target.value)}
                    placeholder="e.g. HRD Korea, AWS, Google"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">ISSUING DATE</label>
                    <input
                      type="text"
                      required
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="e.g. 2024.11"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">CREDENTIAL ID / CODE</label>
                    <input
                      type="text"
                      value={certCode}
                      onChange={(e) => setCertCode(e.target.value)}
                      placeholder="e.g. 2420102030"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => { setIsCertModalOpen(false); setEditingCert(null); }}
                    className="px-4 py-2.5 text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 hover:bg-zinc-900 text-zinc-300 rounded-sm transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs uppercase tracking-widest font-black bg-[#f27d26] hover:bg-white text-black transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={13} /> SAVE CREDENTIAL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD/EDIT CONTACT CHANNEL MODAL ================= */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-[#f27d26]" />
                  <h2 className="font-display font-black uppercase text-lg tracking-tight">
                    {editingContact ? 'EDIT CONTACT CHANNEL' : 'ADD CONTACT CHANNEL'}
                  </h2>
                </div>
                <button
                  onClick={() => { setIsContactModalOpen(false); setEditingContact(null); }}
                  className="p-1 hover:bg-zinc-900 border border-transparent hover:border-white/10 text-zinc-400 hover:text-white rounded-sm transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">LABEL / HEADER</label>
                  <input
                    type="text"
                    required
                    value={contactLabel}
                    onChange={(e) => setContactLabel(e.target.value)}
                    placeholder="e.g. Email, GitHub, Location"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">VALUE / INTERFACE URL</label>
                  <input
                    type="text"
                    required
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="e.g. mailto:park@example.com or url"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">CHANNEL TYPE</label>
                    <select
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value as 'contact' | 'social')}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    >
                      <option value="contact">CONTACT (직접 연락처)</option>
                      <option value="social">SOCIAL (SNS 링크)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">LUCIDE ICON</label>
                    <input
                      type="text"
                      required
                      value={contactIconName}
                      onChange={(e) => setContactIconName(e.target.value)}
                      placeholder="e.g. Mail, Github, MapPin"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-mono text-white rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => { setIsContactModalOpen(false); setEditingContact(null); }}
                    className="px-4 py-2.5 text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 hover:bg-zinc-900 text-zinc-300 rounded-sm transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs uppercase tracking-widest font-black bg-[#f27d26] hover:bg-white text-black transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={13} /> SAVE CHANNEL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD/EDIT BIOGRAPHY CARD MODAL ================= */}
      <AnimatePresence>
        {isBioCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Edit size={18} className="text-[#f27d26]" />
                  <h2 className="font-display font-black uppercase text-lg tracking-tight">
                    {editingBioCard ? 'EDIT BIOGRAPHY CARD' : 'ADD BIOGRAPHY CARD'}
                  </h2>
                </div>
                <button
                  onClick={() => { setIsBioCardModalOpen(false); setEditingBioCard(null); }}
                  className="p-1 hover:bg-zinc-900 border border-transparent hover:border-white/10 text-zinc-400 hover:text-white rounded-sm transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleBioCardSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">CARD TITLE</label>
                  <input
                    type="text"
                    required
                    value={bioCardTitle}
                    onChange={(e) => setBioCardTitle(e.target.value)}
                    placeholder="e.g. DETAIL PAGE DESIGN"
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">DESCRIPTION / CONTENT</label>
                  <textarea
                    rows={4}
                    required
                    value={bioCardDescription}
                    onChange={(e) => setBioCardDescription(e.target.value)}
                    placeholder="Describe specific design focuses, branding strategies, or redesigned pages details..."
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 focus:border-[#f27d26] text-xs font-sans text-white rounded-sm focus:outline-none resize-y"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => { setIsBioCardModalOpen(false); setEditingBioCard(null); }}
                    className="px-4 py-2.5 text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 hover:bg-zinc-900 text-zinc-300 rounded-sm transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs uppercase tracking-widest font-black bg-[#f27d26] hover:bg-white text-black transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={13} /> SAVE CARD
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
