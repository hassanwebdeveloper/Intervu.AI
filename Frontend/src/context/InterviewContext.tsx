import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type Interview = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  questions: string[];
  maxDuration: number;
  language: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledFor?: string;
  transcript?: string;
  summary?: string;
  candidateQueries?: string[];
  interviewLink: string;
  userId: string;
};

interface InterviewContextType {
  interviews: Interview[];
  loading: boolean;
  createInterview: (interviewData: Omit<Interview, 'id' | 'status' | 'createdAt' | 'interviewLink'>) => Promise<Interview>;
  getInterview: (id: string) => Interview | undefined;
  updateInterview: (id: string, interviewData: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedInterviews = localStorage.getItem('interviews');
    if (storedInterviews) {
      setInterviews(JSON.parse(storedInterviews));
    }
    setLoading(false);
  }, []);

  const saveInterviews = (updatedInterviews: Interview[]) => {
    setInterviews(updatedInterviews);
    localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
  };

  const createInterview = async (interviewData: Omit<Interview, 'id' | 'status' | 'createdAt' | 'interviewLink'>) => {
    try {
      setLoading(true);
      
      const id = Math.random().toString(36).substr(2, 9);
      
      const baseUrl = window.location.origin;
      const interviewLink = `${baseUrl}/interview/${id}`;
      
      const newInterview: Interview = {
        ...interviewData,
        id,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        interviewLink
      };
      
      const updatedInterviews = [...interviews, newInterview];
      saveInterviews(updatedInterviews);
      
      toast.success('Interview created successfully');
      return newInterview;
    } catch (error) {
      toast.error('Failed to create interview: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInterview = (id: string) => {
    return interviews.find(interview => interview.id === id);
  };

  const updateInterview = async (id: string, interviewData: Partial<Interview>) => {
    try {
      setLoading(true);
      
      const interviewIndex = interviews.findIndex(interview => interview.id === id);
      if (interviewIndex === -1) {
        throw new Error('Interview not found');
      }
      
      const updatedInterviews = [...interviews];
      updatedInterviews[interviewIndex] = {
        ...updatedInterviews[interviewIndex],
        ...interviewData
      };
      
      saveInterviews(updatedInterviews);
      
      toast.success('Interview updated successfully');
    } catch (error) {
      toast.error('Failed to update interview: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      setLoading(true);
      
      const updatedInterviews = interviews.filter(interview => interview.id !== id);
      
      saveInterviews(updatedInterviews);
      
      toast.success('Interview deleted successfully');
    } catch (error) {
      toast.error('Failed to delete interview: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <InterviewContext.Provider value={{ 
      interviews, 
      loading, 
      createInterview, 
      getInterview, 
      updateInterview, 
      deleteInterview 
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviews = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};
