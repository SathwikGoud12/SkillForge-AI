import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '📝',
      title: 'Smart Notes + Markdown Editor',
      description: 'Create beautiful, structured notes with our powerful markdown editor and syntax highlighting.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🏷️',
      title: 'Tags & Notebooks Organization',
      description: 'Organize your learning materials with smart tags and customizable notebooks.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🔍',
      title: 'Instant Search',
      description: 'Find any note, topic, or resource instantly with AI-powered search.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '💾',
      title: 'Offline Auto-Save',
      description: 'Never lose your progress with automatic offline saving and sync.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🤖',
      title: 'AI Learning Assistant',
      description: 'Get instant help, explanations, and personalized recommendations from AI.',
      gradient: 'from-pink-500 to-red-500'
    },
    {
      icon: '🏆',
      title: 'Streaks, Points & Certificates',
      description: 'Stay motivated with gamification, track streaks, and earn certificates.',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Learners' },
    { value: '500+', label: 'Topics' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'AI Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Developer',
      avatar: '👩‍💻',
      text: 'SkillForge helped me transition from design to development in just 6 months. The AI assistant is like having a personal mentor!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Data Science Student',
      avatar: '👨‍🎓',
      text: 'The structured learning paths and smart notes feature made complex topics so much easier to understand. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      avatar: '👩‍💼',
      text: 'I love the streak tracking and gamification. It keeps me motivated to learn something new every day. Best learning platform!',
      rating: 5
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      </div>

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-purple-500/10 border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <span className="text-xl sm:text-2xl font-bold">SF</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                SkillForge
              </span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('features')}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                Features
              </Button>
              <Button 
                variant="ghost"
                onClick={() => scrollToSection('how-it-works')}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                How It Works
              </Button>
              <Button 
                variant="ghost"
                onClick={() => scrollToSection('pricing')}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                Pricing
              </Button>
              <Button 
                variant="ghost"
                onClick={() => scrollToSection('faq')}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                FAQ
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transform hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </Button>
            </div>

            {/* Mobile CTA */}
            <Button 
              onClick={handleGetStarted}
              className="md:hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-300%">
                  Master Any Skill
                </span>
                <br />
                <span className="text-white">with AI Precision</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Structured learning paths, smart notes, streak tracking, and AI support — all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Button 
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started Free →
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('features')}
                  className="w-full sm:w-auto border-2 border-purple-500/50 text-white px-8 py-6 text-lg rounded-xl hover:bg-purple-500/10 hover:border-purple-400 transform hover:scale-105 transition-all duration-300"
                >
                  See Features
                </Button>
              </div>
            </div>

            {/* Right: Dashboard Mockup Illustration */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                
                {/* Dashboard SVG Mockup */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                        <div className="space-y-1">
                          <div className="w-20 sm:w-24 h-3 bg-white/20 rounded" />
                          <div className="w-16 sm:w-20 h-2 bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full border-2 border-green-400 animate-pulse" />
                    </div>

                    {/* Progress Card */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-20 sm:w-32 h-4 bg-white/30 rounded" />
                        <div className="text-xs sm:text-sm font-bold text-purple-300">75%</div>
                      </div>
                      <div className="w-full h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      {[
                        { icon: '🔥', value: '12', label: 'Day Streak' },
                        { icon: '⭐', value: '450', label: 'Points' },
                        { icon: '🏆', value: '8', label: 'Badges' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 sm:p-4 text-center">
                          <div className="text-xl sm:text-2xl mb-1">{stat.icon}</div>
                          <div className="text-base sm:text-xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Course List */}
                    <div className="space-y-2 sm:space-y-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 sm:p-3 hover:bg-white/10 transition-colors">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0" />
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="w-3/4 h-2.5 sm:h-3 bg-white/20 rounded" />
                            <div className="w-1/2 h-1.5 sm:h-2 bg-white/10 rounded" />
                          </div>
                          <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-green-500/50 rounded-full flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID (6 cards) */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Features Built to Boost Your Learning
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">
              Everything you need to master any skill efficiently
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl hover:border-purple-500/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 steps) */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">
              Start your learning journey in 3 simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connecting Line - Desktop */}
            <div className="hidden sm:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 -z-10" />
            
            {[
              { 
                step: '01', 
                title: 'Signup', 
                desc: 'Create your free account in seconds',
                icon: '👤'
              },
              { 
                step: '02', 
                title: 'Choose Domain', 
                desc: 'Select your learning path from 500+ topics',
                icon: '📚'
              },
              { 
                step: '03', 
                title: 'Learn & Track Progress', 
                desc: 'Study with AI assistance and earn certificates',
                icon: '🚀'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative p-6 sm:p-8 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl hover:border-purple-500/50 transform hover:scale-105 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 sm:mb-6 shadow-lg shadow-purple-500/50 relative z-10">
                  {item.step}
                </div>
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF STATS */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Trusted by Thousands
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">
              Join our growing community of successful learners
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              What Our Learners Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">
              Real success stories from our community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl hover:border-purple-500/50 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base text-white">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Transform Your Skills?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Join thousands of learners who are already mastering new skills with SkillForge's AI-powered platform. Start your journey today — completely free!
            </p>
            <Button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 transition-all duration-300"
            >
              Start Learning Now →
            </Button>
            <p className="mt-4 text-xs sm:text-sm text-gray-400">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Pricing & FAQ Placeholders */}
      <div id="pricing" className="h-20" />
      <div id="faq" className="h-20" />

      {/* 8. FOOTER */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-full lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold">SF</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SkillForge
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                AI-powered learning platform helping you master any skill with precision and efficiency.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © 2026 SkillForge AI. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
