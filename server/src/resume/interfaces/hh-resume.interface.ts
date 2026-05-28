interface HhStringField {
  string: string;
}

interface HhResumeData {
  skills: HhStringField[];
  title: HhStringField[];
  firstName: HhStringField[];
  lastName: HhStringField[];
  keySkills: HhStringField[];
}

interface HhResumeResponse {
  applicantResume: HhResumeData;
}

export type { HhStringField, HhResumeData, HhResumeResponse };
