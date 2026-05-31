import { Injectable } from '@nestjs/common';

const VACANCY_NAMES: string[] = [
  // Frontend
  'Frontend Developer',
  'React Developer',
  'Vue.js Developer',
  'Angular Developer',
  'Next.js Developer',
  'Nuxt.js Developer',
  'JavaScript Developer',
  'TypeScript Developer',
  'UI Developer',
  'Web Developer',
  'Senior Frontend Developer',
  'Middle Frontend Developer',
  'Junior Frontend Developer',
  'Frontend Engineer',
  'Svelte Developer',
  // Backend
  'Backend Developer',
  'Node.js Developer',
  'Python Developer',
  'Java Developer',
  'Go Developer',
  'Golang Developer',
  'PHP Developer',
  'Ruby Developer',
  'C# Developer',
  '.NET Developer',
  'Scala Developer',
  'Spring Boot Developer',
  'Django Developer',
  'FastAPI Developer',
  'Laravel Developer',
  'Backend Engineer',
  'Senior Backend Developer',
  'Middle Backend Developer',
  'Junior Backend Developer',
  'NestJS Developer',
  // Full Stack
  'Full Stack Developer',
  'Full Stack Engineer',
  'MEAN Stack Developer',
  'MERN Stack Developer',
  'Full Stack JavaScript Developer',
  // Mobile
  'iOS Developer',
  'Android Developer',
  'React Native Developer',
  'Flutter Developer',
  'Swift Developer',
  'Kotlin Developer',
  'Mobile Developer',
  'Xamarin Developer',
  'Cross-platform Developer',
  // DevOps / Infra
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Platform Engineer',
  'Cloud Engineer',
  'AWS Engineer',
  'Kubernetes Engineer',
  'CI/CD Engineer',
  'Infrastructure Engineer',
  'Linux System Administrator',
  'System Administrator',
  'Terraform Engineer',
  // Data / AI / ML
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Data Analyst',
  'Business Intelligence Developer',
  'MLOps Engineer',
  'Computer Vision Engineer',
  'NLP Engineer',
  'Big Data Engineer',
  // QA
  'QA Engineer',
  'QA Automation Engineer',
  'SDET',
  'Manual QA Engineer',
  'Performance Engineer',
  'Test Lead',
  'Quality Assurance Specialist',
  // Architecture / Lead
  'Software Architect',
  'Solutions Architect',
  'Enterprise Architect',
  'Technical Lead',
  'Tech Lead',
  'Engineering Manager',
  'Principal Engineer',
  'Staff Engineer',
  // Security
  'Security Engineer',
  'Penetration Tester',
  'Application Security Engineer',
  'InfoSec Engineer',
  'Cybersecurity Analyst',
  // Other
  'Blockchain Developer',
  'Game Developer',
  'Embedded Developer',
  'C++ Developer',
  'Rust Developer',
  'Database Administrator',
  'Salesforce Developer',
  'SAP Developer',
  '1C Developer',
  'Scrum Master',
];

@Injectable()
class SuggestionsService {
  getVacancyNames(query?: string): string[] {
    if (!query) return VACANCY_NAMES.slice(0, 10);
    const lower = query.toLowerCase();
    return VACANCY_NAMES.filter((name) => name.toLowerCase().includes(lower));
  }
}

export { SuggestionsService };
