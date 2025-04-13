
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { useInterviews } from '@/context/InterviewContext';
import elevenLabsService from '@/services/elevenLabsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock 
} from 'lucide-react';

interface InterviewFormData {
  candidateName: string;
  candidateEmail: string;
  jobRole: string;
  questions: { value: string }[];
  maxDuration: number;
  language: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
];

const DEFAULT_QUESTIONS = [
  { value: 'Can you tell me about yourself and your background?' },
  { value: 'Why are you interested in this position?' },
  { value: 'What are your strengths and weaknesses?' },
];

const CreateInterview: React.FC = () => {
  const { user } = useAuth();
  const { createInterview } = useInterviews();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<InterviewFormData>({
    defaultValues: {
      candidateName: '',
      candidateEmail: '',
      jobRole: '',
      questions: DEFAULT_QUESTIONS,
      maxDuration: 30,
      language: 'en',
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedFields = watch();
  
  const onSubmit = async (data: InterviewFormData) => {
    if (!user) {
      toast.error('You must be logged in to create an interview');
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate dynamic prompt based on job role and questions
      const dynamicPrompt = elevenLabsService.generateDynamicPrompt(
        data.jobRole,
        data.questions.map(q => q.value)
      );
      
      // Create conversational agent with ElevenLabs
      const agentResult = await elevenLabsService.createConversationalAgent(
        data.jobRole,
        data.questions.map(q => q.value),
        data.language
      );
      
      // Create interview in our system
      const interview = await createInterview({
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        jobRole: data.jobRole,
        questions: data.questions.map(q => q.value),
        maxDuration: data.maxDuration,
        language: data.language,
        userId: user.id,
      });
      
      toast.success('Interview created successfully');
      navigate(`/interviews/${interview.id}`);
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Failed to create interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate('/dashboard')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Create New Interview</h1>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-xs">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-500"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <div>Candidate Details</div>
                <div>Interview Questions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Candidate Details</CardTitle>
              <CardDescription>
                Enter the candidate's information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input
                  id="candidateName"
                  placeholder="John Doe"
                  {...register('candidateName', { required: 'Candidate name is required' })}
                />
                {errors.candidateName && (
                  <p className="text-sm text-red-500">{errors.candidateName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="candidateEmail">Candidate Email</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register('candidateEmail', { 
                    required: 'Candidate email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email'
                    }
                  })}
                />
                {errors.candidateEmail && (
                  <p className="text-sm text-red-500">{errors.candidateEmail.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobRole">Position / Job Role</Label>
                <Input
                  id="jobRole"
                  placeholder="Software Engineer"
                  {...register('jobRole', { required: 'Job role is required' })}
                />
                {errors.jobRole && (
                  <p className="text-sm text-red-500">{errors.jobRole.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">Interview Duration</Label>
                  <Select 
                    onValueChange={(value) => {
                      document.querySelectorAll<HTMLInputElement>('[name="maxDuration"]')[0].value = value;
                    }}
                    defaultValue={watchedFields.maxDuration.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('maxDuration', { required: true })} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Interview Language</Label>
                  <Select 
                    onValueChange={(value) => {
                      document.querySelectorAll<HTMLInputElement>('[name="language"]')[0].value = value;
                    }}
                    defaultValue={watchedFields.language}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('language', { required: true })} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions</CardTitle>
              <CardDescription>
                Define the questions for this interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium mr-2">Question {index + 1}</span>
                        {index >= 3 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        placeholder="Enter your question"
                        {...register(`questions.${index}.value` as const, {
                          required: 'Question is required'
                        })}
                        className="min-h-[80px]"
                      />
                      {errors.questions?.[index]?.value && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.questions[index]?.value?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ value: '' })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Interview'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
};

export default CreateInterview;
