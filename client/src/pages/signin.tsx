import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";

export default function SignIn() {
  const [email, setEmail] = useState('shrikar.kaduluri@igloo.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        window.location.href = '/';
      } else {
        toast({
          title: "Sign In Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Demo login failed:', error);
      toast({
        title: "Sign In Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>
        <h2 className="text-lg text-muted-foreground text-center">
          Property Management Platform
        </h2>
        <p className="text-center text-muted-foreground mt-2">
          Sign in to manage property portfolios and workflows
        </p>
      </div>

      {/* Sign In Form */}
      <Card className="w-full max-w-md sketch-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-700 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-sm border-2 border-dashed border-gray-300 focus:border-primary"
                  placeholder="email@igloo.com"
                  data-testid="input-email"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-sm border-2 border-dashed border-gray-300 focus:border-primary"
                placeholder="••••••"
                data-testid="input-password"
                readOnly
              />
            </div>

            <Button
              type="submit"
              className="w-full sketch-button text-lg py-3"
              disabled={isLoading}
              data-testid="button-sign-in"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Demo Credentials */}
      <Card className="w-full max-w-md mt-6 bg-blue-50 border-2 border-dashed border-blue-200">
        <CardContent className="pt-4">
          <Badge className="mb-3 bg-blue-100 text-blue-800 border border-blue-300 rounded-sm">
            Demo Credentials
          </Badge>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-blue-700">Email:</span>{" "}
              <span className="text-blue-600">shrikar.kaduluri@igloo.com</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Password:</span>{" "}
              <span className="text-blue-600">demo123</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Attribution */}
      <div className="mt-16 text-center text-muted-foreground">
        <p className="text-lg mb-1">Portfolio Project by Shrikar Kaduluri</p>
        <p className="text-sm">Modern React + TypeScript Application</p>
      </div>
    </div>
  );
}