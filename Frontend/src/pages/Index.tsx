
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, CheckCircle, Mic, Users, Calendar } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Link to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="text-white font-semibold">VI</span>
            </div>
            <span className="font-semibold text-xl">VoiceInterview</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            AI Voice Interviews<br />Made <span className="text-brand-600">Simple</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create, manage, and analyze AI-powered voice interviews with candidates.
            Save time and streamline your hiring process.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Interviews</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up interviews with custom questions and send unique links to candidates.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Voice Interaction</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI conducts natural voice interviews with your candidates, no human needed.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get detailed transcripts, summaries, and insights from each interview.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your hiring process?</h2>
          <p className="text-lg mb-8 text-brand-100">
            Join thousands of HR professionals using VoiceInterview to streamline their candidate screening.
          </p>
          <Link to="/signup">
            <Button variant="secondary" size="lg">
              Sign up for free
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">VI</span>
            </div>
            <span className="font-semibold">VoiceInterview</span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            &copy; 2025 VoiceInterview. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
