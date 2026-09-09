export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  status: string;
  location: string;
  tagline: string;
  resume_link: string;
  copyright: string;
}

export interface NavItem {
  id: string;
  num: string;
  label: string;
  bracket: string;
}

export interface SocialLink {
  name: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'mail';
  url: string;
  aria: string;
}

export interface AboutStat {
  value: string;
  label: string;
  has_link: boolean;
  link: string;
}

export interface ActivityStat {
  key: string;
  val: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  repo: string;
  date: string;
  url: string;
}

export interface ActivityData {
  title: string;
  handle: string;
  handle_url: string;
  matrix: number[][];
  progress: number;
  stats: ActivityStat[];
  commits_count?: number | string;
  is_loading?: boolean;
  has_live_data?: boolean;
}

export interface AboutSectionData {
  section_id: string;
  section_num: string;
  section_header: string;
  nav_badge: string;
  bio_paragraphs: string[];
  stats: AboutStat[];
  activity: ActivityData;
}

export interface ProjectItem {
  title: string;
  period: string;
  badge: string;
  description: string;
  tech: string[];
  stats: string;
  live_url: string;
  github_url: string;
}

export interface ProjectsSectionData {
  section_id: string;
  section_num: string;
  section_header: string;
  nav_badge: string;
  items: ProjectItem[];
}

export interface StackSkillItem {
  name: string;
  icon: string;
  description?: string;
}

export interface StackCategory {
  title: string;
  skills: (string | StackSkillItem)[];
}

export interface StackSectionData {
  section_id: string;
  section_num: string;
  section_header: string;
  nav_badge: string;
  categories: StackCategory[];
}

export interface ContactChannel {
  label: string;
  val: string;
  action: string;
  type: 'email' | 'text' | 'badge';
}

export interface ContactSectionData {
  section_id: string;
  section_num: string;
  section_header: string;
  nav_badge: string;
  headline: string;
  subtitle: string;
  email: string;
  channels: ContactChannel[];
}

export interface VouchItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  company_or_institution: string;
  initials: string;
  created_at?: string;
}

export interface VouchSectionData {
  section_id: string;
  section_num: string;
  section_header: string;
  nav_badge: string;
  items: VouchItem[];
}

export interface PortfolioData {
  page_title: string;
  meta_description: string;
  user: UserProfile;
  nav_items: NavItem[];
  social_links: SocialLink[];
  about: AboutSectionData;
  projects: ProjectsSectionData;
  stack: StackSectionData;
  vouch: VouchSectionData;
  contact: ContactSectionData;
}
