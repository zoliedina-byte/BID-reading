
export interface BibleReading {
  reference: string;
  link: string;
  category: string;
}

export interface DailyReadingPlan {
  day: number;
  label: string;
  readings: BibleReading[];
}

// Added Passage interface to resolve geminiService.ts import error
export interface Passage {
  id: string;
  title: string;
  content: string;
  link: string;
  linkLabel: string;
  category: string;
}

// Added DailyData interface to resolve geminiService.ts import error
export interface DailyData {
  date: string;
  passages: Passage[];
}
