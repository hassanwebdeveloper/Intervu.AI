import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useConversation, Language } from '@11labs/react';
import { useInterviews } from '@/context/InterviewContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import elevenLabsService from '@/services/elevenLabsService';

// Define conversation status types
enum ConversationStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

const InterviewParticipant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInterview, updateInterview } = useInterviews();
  const [interview, setInterview] = useState(getInterview(id || ''));
  const [currentStatus, setCurrentStatus] = useState<ConversationStatus>(ConversationStatus.IDLE);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation using ElevenLabs React hook
  const conversation = useConversation({
    onConnect: () => {
      setCurrentStatus(ConversationStatus.CONNECTED);
      console.log("Connected to ElevenLabs conversation");
    },
    onDisconnect: () => {
      setCurrentStatus(ConversationStatus.IDLE);
      console.log("Disconnected from ElevenLabs conversation");
    },
    onMessage: (message) => {
      // Handle incoming messages from the conversational agent
      console.log("Received message:", message);
      
      if (message.source === 'agent') {
        setCurrentStatus(ConversationStatus.SPEAKING);
        addMessage('AI', message.message);
      } else if (message.source === 'user') {
        setCurrentStatus(ConversationStatus.LISTENING);
        addMessage('Candidate', message.message);
      } else if (message.source === 'system') {
        // System messages could be used for "thinking" states
        setCurrentStatus(ConversationStatus.PROCESSING);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      toast.error("Error in conversation. Please try again.");
      setCurrentStatus(ConversationStatus.ERROR);
    }
  });

  // Monitor conversation status
  useEffect(() => {
    if (conversation.status === 'connected') {
      setCurrentStatus(ConversationStatus.CONNECTED);
    } else if (conversation.status === 'disconnected') {
      setCurrentStatus(ConversationStatus.IDLE);
    }
    
    if (conversation.isSpeaking) {
      setCurrentStatus(ConversationStatus.SPEAKING);
    } else if (isMicEnabled && conversation.status === 'connected') {
      setCurrentStatus(ConversationStatus.LISTENING);
    }
  }, [conversation.status, conversation.isSpeaking, isMicEnabled]);

  useEffect(() => {
    if (!interview) {
      toast.error('Interview not found');
      navigate('/');
      return;
    }

    if (interview.status === 'completed') {
      setCompleted(true);
    }
  }, [interview, id, navigate]);

  useEffect(() => {
    // Auto scroll transcript to bottom
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  const startInterview = async () => {
    try {
      setLoading(true);
      
      // Request microphone permissions
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        toast.error('Microphone access is required for the interview');
        console.error('Microphone access error:', error);
        setLoading(false);
        return;
      }
      
      if (!interview) {
        toast.error('Interview details not found');
        setLoading(false);
        return;
      }
      
      // Generate dynamic prompt and first message based on interview details
      const dynamicPrompt = elevenLabsService.generateDynamicPrompt(
        interview.jobRole, 
        interview.questions
      );
      
      const firstMessage = elevenLabsService.generateFirstMessage(
        interview.candidateName,
        interview.jobRole
      );
      
      // For demo purposes - simulate an agent ID
      // In a real implementation, you would get this from your backend
      const agentId = "demo-agent-id";
      
      // Map language code to ElevenLabs language
      const mappedLanguage = elevenLabsService.mapLanguageCode(interview.language);
      
      // Start the conversation with ElevenLabs
      try {
        // In a real implementation, you would use a real agentId or URL
        // generated through your backend with the ElevenLabs API
        const convId = await conversation.startSession({
          agentId,
          overrides: {
            agent: {
              prompt: {
                prompt: dynamicPrompt,
              },
              firstMessage: firstMessage,
              language: mappedLanguage as Language,
            }
          }
        });
        
        setConversationId(convId);
        setHasStarted(true);
        setIsMicEnabled(true);
        
        // Add initial message to transcript
        addMessage('AI', firstMessage);
        
      } catch (error) {
        console.error("Failed to start conversation:", error);
        toast.error("Failed to start conversation. Please try again.");
      }
      
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMicrophone = async () => {
    try {
      // In the actual implementation, the microphone state is handled by the ElevenLabs SDK
      setIsMicEnabled(!isMicEnabled);
      
      if (!isMicEnabled) {
        toast.success('Microphone enabled');
      } else {
        toast.success('Microphone disabled');
      }
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
      toast.error('Failed to toggle microphone');
    }
  };
  
  const toggleAudio = async () => {
    try {
      // Set volume based on whether audio is enabled
      await conversation.setVolume({ volume: isAudioEnabled ? 0 : 1 });
      setIsAudioEnabled(!isAudioEnabled);
      
      if (!isAudioEnabled) {
        toast.success('Audio enabled');
      } else {
        toast.success('Audio disabled');
      }
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      toast.error('Failed to toggle audio');
    }
  };
  
  const addMessage = (speaker: 'AI' | 'Candidate', text: string) => {
    setTranscript(prev => [...prev, `${speaker}: ${text}`]);
  };
  
  const finishInterview = async () => {
    if (!interview || !id) return;
    
    try {
      setCurrentStatus(ConversationStatus.COMPLETED);
      setCompleted(true);
      
      // End the ElevenLabs conversation
      if (conversationId) {
        await conversation.endSession();
      }
      
      // Update interview status
      await updateInterview(id, { status: 'completed' });
      
      // Create transcript from conversation
      const fullTranscript = transcript.join('\n');
      
      await updateInterview(id, {
        transcript: fullTranscript,
        summary: 'The candidate demonstrated strong communication skills and provided thoughtful answers to the technical questions. They have relevant experience in the field and showed enthusiasm for the role.',
        candidateQueries: ['What is the next step in the interview process?', 'When can I expect to hear back about the position?']
      });
      
      // Update local state
      setInterview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'completed',
          transcript: fullTranscript
        };
      });
      
      toast.success('Interview completed successfully');
    } catch (error) {
      console.error('Failed to complete interview:', error);
      toast.error('Failed to complete interview');
    }
  };

  // For demo purposes - simulate completing the interview after a set time
  useEffect(() => {
    if (hasStarted && !completed) {
      const timer = setTimeout(() => {
        finishInterview();
      }, 60000); // Automatically finish after 1 minute for demo
      
      return () => clearTimeout(timer);
    }
  }, [hasStarted, completed]);

  if (!interview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="text-white font-semibold">VI</span>
            </div>
            <span className="font-semibold text-xl">VoiceInterview</span>
          </div>
          
          {hasStarted && !completed && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAudio}
                title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button
                variant={isMicEnabled ? "default" : "outline"}
                size="icon"
                onClick={toggleMicrophone}
                title={isMicEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                className={isMicEnabled ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {!hasStarted && !completed && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Welcome to your interview</CardTitle>
                <CardDescription>
                  You're about to start an AI-powered interview for the {interview.jobRole} position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Before you begin:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Make sure you're in a quiet environment with minimal background noise</li>
                    <li>Check that your microphone is working properly</li>
                    <li>Speak clearly and at a normal pace</li>
                    <li>The interview will take approximately {interview.maxDuration} minutes</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> You'll be asked to grant microphone permissions when you start the interview.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={startInterview} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {hasStarted && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{interview.jobRole} Interview</h2>
                  <p className="text-muted-foreground">
                    {completed ? 'Interview completed' : `Question ${currentQuestion + 1} of ${interview.questions.length}`}
                  </p>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                  currentStatus === ConversationStatus.SPEAKING
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                    : currentStatus === ConversationStatus.LISTENING
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      : currentStatus === ConversationStatus.PROCESSING
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                        : currentStatus === ConversationStatus.COMPLETED
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {currentStatus === ConversationStatus.SPEAKING ? (
                    <>
                      <Volume2 className="h-3 w-3 mr-1" />
                      AI Speaking
                    </>
                  ) : currentStatus === ConversationStatus.LISTENING ? (
                    <>
                      <Mic className="h-3 w-3 mr-1" />
                      Listening
                    </>
                  ) : currentStatus === ConversationStatus.PROCESSING ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing
                    </>
                  ) : currentStatus === ConversationStatus.COMPLETED ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </>
                  ) : (
                    'Ready'
                  )}
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Interview Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50 space-y-4">
                    {transcript.map((message, index) => {
                      const [speaker, ...textParts] = message.split(': ');
                      const text = textParts.join(': ');
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex ${
                            speaker === 'AI' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            speaker === 'AI' 
                              ? 'bg-white dark:bg-gray-700 text-left' 
                              : 'bg-brand-100 dark:bg-brand-900/30 text-right'
                          }`}>
                            <div className="text-xs font-medium mb-1 text-muted-foreground">
                              {speaker}
                            </div>
                            <div>{text}</div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={transcriptEndRef} />
                    
                    {/* Show "typing" indicator when AI is thinking */}
                    {currentStatus === ConversationStatus.PROCESSING && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] px-4 py-2 rounded-lg bg-white dark:bg-gray-700">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                {completed ? (
                  <CardFooter>
                    <div className="w-full p-4 bg-success-50 dark:bg-success-900/20 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                        <p className="text-success-800 dark:text-success-200 font-medium">
                          Interview completed successfully
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Thank you for completing the interview. The results will be reviewed and you'll be contacted with next steps.
                      </p>
                    </div>
                  </CardFooter>
                ) : hasStarted ? (
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {isMicEnabled ? (
                        <span className="flex items-center">
                          <Mic className="h-3 w-3 mr-1 text-red-500" />
                          Your microphone is active
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <MicOff className="h-3 w-3 mr-1" />
                          Click the microphone button to speak
                        </span>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={toggleMicrophone}
                    >
                      {isMicEnabled ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Mute
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Unmute
                        </>
                      )}
                    </Button>
                  </CardFooter>
                ) : null}
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewParticipant;
