
import React from 'react';
import { Link } from 'react-router-dom';
import { useInterviews } from '@/context/InterviewContext';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { interviews } = useInterviews();

  // Filter interviews by user
  const userInterviews = interviews.filter(interview => interview.userId === user?.id);
  
  // Get counts
  const scheduledCount = userInterviews.filter(i => i.status === 'scheduled').length;
  const completedCount = userInterviews.filter(i => i.status === 'completed').length;
  const recentInterviews = [...userInterviews].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/interviews/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userInterviews.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline">
            <div className="text-3xl font-bold">{scheduledCount}</div>
            <div className="ml-2 text-sm text-muted-foreground">pending</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline">
            <div className="text-3xl font-bold">{completedCount}</div>
            <div className="ml-2 text-sm text-muted-foreground">interviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Interviews</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/interviews/scheduled">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentInterviews.length > 0 ? (
          <div className="space-y-4">
            {recentInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardContent className="p-0">
                  <div className="flex items-center p-4 border-b">
                    <div className={`w-2 h-10 rounded-full mr-4 ${
                      interview.status === 'completed' 
                        ? 'bg-success-500' 
                        : interview.status === 'scheduled' 
                          ? 'bg-brand-500' 
                          : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold truncate">
                          {interview.candidateName}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{interview.jobRole}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      {interview.status === 'scheduled' ? (
                        <>
                          <Calendar className="h-4 w-4 mr-1 text-brand-500" />
                          <span>Scheduled</span>
                        </>
                      ) : interview.status === 'completed' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1 text-success-500" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1 text-red-500" />
                          <span>Cancelled</span>
                        </>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/interviews/${interview.id}`}>
                        View details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No interviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first AI voice interview.
                </p>
                <Button asChild>
                  <Link to="/interviews/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Interview
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
