
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInterviews } from '@/context/InterviewContext';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';

const InterviewResults: React.FC = () => {
  const { user } = useAuth();
  const { interviews } = useInterviews();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter interviews by user and completed status
  const completedInterviews = interviews
    .filter(interview => 
      interview.userId === user?.id && 
      interview.status === 'completed' &&
      (searchTerm === '' || 
        interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDownloadTranscript = (interviewId: string) => {
    const interview = interviews.find(i => i.id === interviewId);
    if (!interview?.transcript) return;
    
    const element = document.createElement('a');
    const file = new Blob([interview.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `interview-${interview.id}-transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Completed Interviews</h1>
        
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidate or role..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {completedInterviews.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Results</CardTitle>
            <CardDescription>View and manage completed interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="font-medium">{interview.candidateName}</div>
                        <div className="text-sm text-muted-foreground">{interview.candidateEmail}</div>
                      </TableCell>
                      <TableCell>{interview.jobRole}</TableCell>
                      <TableCell>
                        {format(new Date(interview.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{interview.maxDuration} min</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/interviews/${interview.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadTranscript(interview.id)}>
                              Download Transcript
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No completed interviews found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When interviews are completed, they will appear here with their results and transcripts.
              </p>
              <Button asChild>
                <Link to="/interviews/new">
                  Create New Interview
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewResults;
