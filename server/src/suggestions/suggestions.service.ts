import { Injectable } from '@nestjs/common';
import { AreaDto } from './dto/area.dto';

const AREAS: AreaDto[] = [
  { value: 0, label: 'Без региона' },
  { value: 113, label: 'Россия' },
  { value: 1, label: 'Москва' },
  { value: 2, label: 'Санкт-Петербург' },
];

const GRADES = ['Junior', 'Middle', 'Senior'] as const;

const withGrades = (role: string): string[] =>
  GRADES.map((grade) => `${grade} ${role}`);

const VACANCY_NAMES: string[] = [
  // Frontend
  ...withGrades('frontend разработчик'),
  ...withGrades('React разработчик'),
  ...withGrades('Vue.js разработчик'),
  ...withGrades('Angular разработчик'),
  'Next.js разработчик',
  'Nuxt.js разработчик',
  'JavaScript разработчик',
  'TypeScript разработчик',
  'Веб-разработчик',
  // Backend
  ...withGrades('backend разработчик'),
  ...withGrades('Node.js разработчик'),
  ...withGrades('Python разработчик'),
  ...withGrades('Java разработчик'),
  ...withGrades('Go разработчик'),
  ...withGrades('PHP разработчик'),
  'C# разработчик',
  '.NET разработчик',
  'Scala разработчик',
  'Spring Boot разработчик',
  'Django разработчик',
  'FastAPI разработчик',
  'Laravel разработчик',
  'NestJS разработчик',
  // Фулстек
  ...withGrades('fullstack разработчик'),
  'Fullstack JavaScript разработчик',
  'Fullstack Python разработчик',
  // Мобильная разработка
  ...withGrades('iOS разработчик'),
  ...withGrades('Android разработчик'),
  ...withGrades('Flutter разработчик'),
  'React Native разработчик',
  'Swift разработчик',
  'Kotlin разработчик',
  'Мобильный разработчик',
  // DevOps / Инфраструктура
  ...withGrades('DevOps инженер'),
  'Site Reliability Engineer',
  'Облачный инженер',
  'Kubernetes инженер',
  'Системный администратор',
  'Linux администратор',
  // Данные / ИИ / ML
  ...withGrades('инженер по данным'),
  ...withGrades('ML инженер'),
  'Data Scientist',
  'Аналитик данных',
  'BI разработчик',
  'MLOps инженер',
  'Инженер по компьютерному зрению',
  // Тестирование / QA
  ...withGrades('QA инженер'),
  ...withGrades('инженер по автоматизации тестирования'),
  'Ручной тестировщик',
  'Тестировщик',
  // Архитектура / Лидерство
  'Архитектор программного обеспечения',
  'Системный архитектор',
  'Тимлид',
  'Технический директор',
  // Безопасность
  'Инженер по информационной безопасности',
  'Специалист по кибербезопасности',
  'Пентестер',
  // Прочее
  'Unity разработчик',
  'Unreal Engine разработчик',
  'C++ разработчик',
  'Rust разработчик',
  'Администратор баз данных',
  '1С разработчик',
  'Разработчик Битрикс',
  'SAP разработчик',
  'Scrum мастер',
  'Продуктовый менеджер',
  'Технический писатель',
];

@Injectable()
class SuggestionsService {
  getVacancyNames(query?: string): string[] {
    if (!query) return VACANCY_NAMES.slice(0, 10);
    const lower = query.toLowerCase();
    return VACANCY_NAMES.filter((name) => name.toLowerCase().includes(lower));
  }

  getAreas(): AreaDto[] {
    return AREAS;
  }
}

export { SuggestionsService };
