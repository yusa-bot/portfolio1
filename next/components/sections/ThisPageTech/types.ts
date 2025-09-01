// ThisPageTech セクションの型定義

export interface TechStack {
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'database' | 'infrastructure' | 'tools';
  version?: string;
  icon?: string;
}

export interface TechnicalFeature {
  title: string;
  description: string;
  technologies: string[];
  codeExample?: string;
  highlights: string[];
}

export interface UpdatesFeature {
  title: string;
  description: string;
  implementation: {
    apiEndpoint: string;
    method: string;
    features: string[];
  };
  technicalDetails: string[];
  codeSnippet?: string;
}

export interface ThisPageTechProps {
  className?: string;
}
