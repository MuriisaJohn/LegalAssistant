import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, FileText, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-[#14284b] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-serif font-bold mb-6">
              About Our Legal Assistant
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Empowering legal professionals and individuals with AI-powered document analysis and insights
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#14284b] mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600">
              To democratize access to legal document analysis and make complex legal information more accessible and understandable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-[#14284b] mb-4" />
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Leveraging cutting-edge AI technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our system uses advanced natural language processing and machine learning algorithms to analyze legal documents, providing accurate and insightful analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-[#14284b] mb-4" />
                <CardTitle>User-Focused Design</CardTitle>
                <CardDescription>
                  Built for legal professionals and individuals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We've designed our platform with both legal professionals and individuals in mind, ensuring an intuitive and efficient user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-[#14284b] mb-12 text-center">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-[#14284b] mb-4" />
                <CardTitle>Document Analysis</CardTitle>
                <CardDescription>
                  Smart document processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Automatic document classification</li>
                  <li>• Key point extraction</li>
                  <li>• Summary generation</li>
                  <li>• Legal terminology explanation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-[#14284b] mb-4" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Intelligent legal guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 24/7 legal document assistance</li>
                  <li>• Context-aware responses</li>
                  <li>• Legal research support</li>
                  <li>• Case law references</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-[#14284b] mb-4" />
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>
                  Enterprise-grade protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• End-to-end encryption</li>
                  <li>• Secure document storage</li>
                  <li>• Regular security audits</li>
                  <li>• Compliance with data protection laws</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-[#14284b] mb-12 text-center">
            Technology Stack
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Frontend</h3>
                    <p className="text-gray-600">React, TypeScript, TailwindCSS</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Backend</h3>
                    <p className="text-gray-600">Node.js, Express, TypeScript</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">AI</h3>
                    <p className="text-gray-600">Gemini</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Database</h3>
                    <p className="text-gray-600">PostgreSQL, Drizzle ORM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-[#14284b] mb-6">
            Ready to Experience the Future of Legal Analysis?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using our AI legal assistant to understand their documents better.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-[#14284b] text-white hover:bg-[#0f203a]">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 