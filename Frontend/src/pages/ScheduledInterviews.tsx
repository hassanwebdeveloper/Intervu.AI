import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInterviews } from '@/context/InterviewContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PlusCircle,
  Calendar,
  Copy,
  CheckCircle,
  MoreHorizontal,
  Search,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const ScheduledInterviews: React.FC = () => {
  const { user } = useAuth();
  const { interviews, updateInterview } = useInterviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const scheduledInterviews = interviews
    .filter(interview => 
      interview.userId === user?.id && 
      interview.status === 'scheduled' &&
      (searchTerm === '' || 
        interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Interview link copied to clipboard');
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCancelInterview = async (id: string) => {
    try {
      await updateInterview(id, { status: 'cancelled' });
      toast.success('Interview cancelled successfully');
    } catch (error) {
      console.error('Error cancelling interview:', error);
      toast.error('Failed to cancel interview');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Scheduled Interviews</h1>
        
        <div className="flex gap-4">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidate or role..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button asChild>
            <Link to="/interviews/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New
            </Link>
          </Button>
        </div>
      </div>

      {scheduledInterviews.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Manage your scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="font-medium">{interview.candidateName}</div>
                        <div className="text-sm text-muted-foreground">{interview.candidateEmail}</div>
                      </TableCell>
                      <TableCell>{interview.jobRole}</TableCell>
                      <TableCell>
                        {format(new Date(interview.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {interview.maxDuration} min
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => handleCopyLink(interview.id, interview.interviewLink)}
                        >
                          {copiedId === interview.id ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy Link
                            </>
                          )}
                        </Button>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleCopyLink(interview.id, interview.interviewLink)}>
                              Copy Interview Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancelInterview(interview.id)} className="text-red-600">
                              Cancel Interview
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No scheduled interviews</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don't have any upcoming interviews scheduled. Create a new interview to get started.
              </p>
              <Button asChild>
                <Link to="/interviews/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
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

export default ScheduledInterviews;
