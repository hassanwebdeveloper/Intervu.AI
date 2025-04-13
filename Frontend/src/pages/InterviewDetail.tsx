import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useInterviews } from '@/context/InterviewContext';
import elevenLabsService from '@/services/elevenLabsService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
  ChevronLeft,
  Copy,
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  User,
  FileText,
  Globe,
  Link2,
  BarChart,
  MessageSquare,
  Download,
  Loader2,
} from 'lucide-react';

const InterviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInterview, updateInterview } = useInterviews();
  const [interview, setInterview] = useState(getInterview(id || ''));
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!interview) {
      toast.error('Interview not found');
      navigate('/dashboard');
      return;
    }

    if (interview.status === 'completed' && !results) {
      fetchResults();
    }
  }, [interview, id]);

  const fetchResults = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await elevenLabsService.getInterviewResults(id);
      setResults(data);
      
      if (!interview?.transcript) {
        await updateInterview(id, {
          transcript: data.transcript,
          summary: data.summary,
          candidateQueries: data.candidateQueries
        });
        
        setInterview(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            transcript: data.transcript,
            summary: data.summary,
            candidateQueries: data.candidateQueries
          };
        });
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load interview results');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!interview) return;
    
    navigator.clipboard.writeText(interview.interviewLink);
    setCopied(true);
    toast.success('Interview link copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadTranscript = () => {
    if (!interview?.transcript) return;
    
    const element = document.createElement('a');
    const file = new Blob([interview.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `interview-${interview.id}-transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!interview) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate('/dashboard')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">{interview.candidateName}</h1>
            <div className={`rounded-full px-2 py-1 text-xs font-medium ${
              interview.status === 'scheduled' 
                ? 'bg-brand-100 text-brand-800' 
                : interview.status === 'completed'
                  ? 'bg-success-100 text-success-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
            </div>
          </div>
          <p className="text-muted-foreground">{interview.jobRole}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          
          {interview.status === 'completed' && (
            <Button
              size="sm"
              className="gap-1"
              onClick={handleDownloadTranscript}
              disabled={!interview.transcript}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Candidate Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{interview.candidateName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{interview.candidateEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interview Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <span>Created: {format(new Date(interview.createdAt), 'PPP')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span>Duration: {interview.maxDuration} minutes</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                <span>Language: {LANGUAGE_NAMES[interview.language] || interview.language}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interview Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm space-x-2 truncate">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{interview.interviewLink}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={handleCopyLink}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="questions">
        <TabsList className="mb-4">
          <TabsTrigger value="questions">
            <FileText className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="results" disabled={interview.status !== 'completed'}>
            <BarChart className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions</CardTitle>
              <CardDescription>
                Questions that will be asked during the interview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interview.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Question {index + 1}
                    </div>
                    <div>{question}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : interview.transcript ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Summary</CardTitle>
                  <CardDescription>
                    AI-generated summary of the interview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md whitespace-pre-line">
                    {interview.summary}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Full Transcript</CardTitle>
                  <CardDescription>
                    Complete interview transcript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 whitespace-pre-line">
                    {interview.transcript}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={handleDownloadTranscript}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Transcript
                  </Button>
                </CardFooter>
              </Card>
              
              {interview.candidateQueries && interview.candidateQueries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Questions</CardTitle>
                    <CardDescription>
                      Questions asked by the candidate during the interview
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {interview.candidateQueries.map((query, index) => (
                        <div key={index} className="flex items-start p-3 border rounded-md">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <span>{query}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results available</h3>
                  <p className="text-muted-foreground mb-4">
                    Results will be available after the interview is completed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'zh': 'Chinese',
  'ja': 'Japanese',
};

export default InterviewDetail;
