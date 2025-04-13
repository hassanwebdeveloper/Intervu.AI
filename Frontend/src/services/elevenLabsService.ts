import { toast } from "sonner";
import { Language } from '@11labs/react';

// Mock for interview transcripts - in a real app these would come from ElevenLabs
const mockTranscripts = [
  {
    "id": "sample1",
    "transcript": "Interviewer: Tell me about your experience with project management.\n\nCandidate: I've been working as a project manager for 5 years, primarily in software development. I'm PMP certified and have led teams of up to 15 people. My most recent project involved migrating our company's infrastructure to the cloud, which we completed ahead of schedule and under budget.",
    "summary": "The candidate has 5 years of project management experience in software development, is PMP certified, and has led teams up to 15 people. They successfully led a recent cloud migration project that was completed ahead of schedule and under budget.",
    "candidateQueries": ["What project management methodologies does your company use?", "How large is the team I would be managing?"]
  },
  {
    "id": "sample2",
    "transcript": "Interviewer: How do you handle conflicts within a team?\n\nCandidate: When conflicts arise, I first try to understand each person's perspective by having one-on-one conversations. I believe in addressing conflicts early before they escalate. I then bring the parties together to find common ground and establish clear expectations. I've found that most conflicts stem from miscommunication or misaligned goals.",
    "summary": "The candidate approaches conflict resolution by first understanding individual perspectives through one-on-one conversations, then facilitating joint discussions to find common ground. They believe in early intervention and identify miscommunication as a root cause of most conflicts.",
    "candidateQueries": ["How often do conflicts arise in the current team?", "What is the team culture like?"]
  }
];

// Generate dynamic prompts based on job role and questions
export const generateDynamicPrompt = (jobRole: string, questions: string[]) => {
  return `You are an AI interviewer conducting a job interview for the ${jobRole} position. 
Your goal is to evaluate candidates based on their responses to your questions.

Here are the specific questions you need to ask:
${questions.map((q, index) => `${index + 1}. ${q}`).join('\n')}

Guidelines for the interview:
- Start by introducing yourself and explaining the interview process
- Ask one question at a time and allow the candidate to respond fully
- Listen attentively to the candidate's responses
- If the candidate's answer is unclear or incomplete, ask follow-up questions
- Be professional, courteous, and respectful throughout the interview
- After all questions have been asked, thank the candidate for their time and end the interview
`;
};

// Generate a dynamic first message
export const generateFirstMessage = (candidateName: string, jobRole: string) => {
  return `Hello ${candidateName}, I'm your AI interviewer for the ${jobRole} position. I'll be asking you a series of questions to better understand your qualifications and experience. Please speak clearly when answering. Are you ready to begin?`;
};

// Map string language codes to ElevenLabs Language enum values
export const mapLanguageCode = (languageCode: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'de': 'german',
    'it': 'italian',
    'pt': 'portuguese',
    'pl': 'polish',
    'hi': 'hindi',
    'ar': 'arabic',
    'zh': 'chinese',
    'ja': 'japanese',
    'ko': 'korean',
    'nl': 'dutch'
  };

  return languageMap[languageCode] || 'english';
};

// Create conversational agent
export const createConversationalAgent = async (
  jobRole: string,
  questions: string[],
  language: string
) => {
  console.log('Creating conversational agent with:', { jobRole, questions, language });
  
  try {
    // In a real implementation, this would call the ElevenLabs API
    // to create and configure the conversational agent
    
    // Generate dynamic prompt based on job role and questions
    const prompt = generateDynamicPrompt(jobRole, questions);
    
    // Mock successful creation
    return {
      success: true,
      agentId: Math.random().toString(36).substr(2, 9),
      prompt
    };
  } catch (error) {
    console.error('Error creating conversational agent:', error);
    toast.error('Failed to create conversational agent');
    throw error;
  }
};

export const getInterviewResults = async (interviewId: string) => {
  console.log('Getting interview results for ID:', interviewId);
  
  try {
    // In a real implementation, this would fetch the results from ElevenLabs
    
    // Return mock transcript data
    const mockIndex = interviewId.charCodeAt(0) % mockTranscripts.length;
    return mockTranscripts[mockIndex];
  } catch (error) {
    console.error('Error getting interview results:', error);
    toast.error('Failed to get interview results');
    throw error;
  }
};

// ElevenLabs service object
export const elevenLabsService = {
  createConversationalAgent,
  getInterviewResults,
  generateDynamicPrompt,
  generateFirstMessage,
  mapLanguageCode
};

export default elevenLabsService;
