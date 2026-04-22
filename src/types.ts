// 앱 전역 타입 정의

// 섹션 색상 키 — 색상 팔레트는 constants/colors.ts에서 매핑
export type SectionColorKey = 'primary' | 'secondary' | 'tertiary' | 'neutral';

// 분석 결과의 섹션 하나
export type Section = {
  label: string; // 예: "A", "B", "A'", "서주", "Coda"
  name: string; // 예: "주제부", "대조부"
  measureStart: number;
  measureEnd: number;
  colorKey: SectionColorKey;
  details: string[]; // 간결한 객관적 관찰 (3~5개)
};

// 전체 형식 (3부 형식 등)
export type OverallForm = {
  korean: string; // "3부 형식"
  english: string; // "Ternary Form"
  notation: string; // "A-B-A'"
};

// Gemini/AI가 반환하는 분석 결과 JSON 스키마
export type AnalysisResult = {
  known: boolean;
  composer: string;
  year: string | null;
  pieceName: string;
  key: string; // 조성 (예: "E장조")
  timeSignature: string; // 박자 (예: "4/4")
  tempo: string; // 빠르기 (예: "Lento ma non troppo (♩=58)")
  totalMeasures: number;
  overallForm: OverallForm;
  sections: Section[];
};

// 로컬 저장 폴더
export type Folder = {
  id: string;
  name: string;
  isDefault: boolean; // "미분류"는 삭제 불가
  createdAt: number;
};

// 로컬 저장 북마크
export type Bookmark = {
  id: string;
  folderId: string;
  pieceName: string;
  composer: string;
  musicKey: string; // 조성 (예: "E장조") — key라는 이름이 React key와 겹쳐 musicKey로 명명
  overallFormKorean: string;
  analysisJson: AnalysisResult;
  createdAt: number;
};
