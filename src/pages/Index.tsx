import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Timer, Book, Calculator, Wrench, Trophy, Coffee, ChevronRight, LogOut, User, Menu, Users } from "lucide-react";
import heroImage from "@/assets/coffee-hero.jpg";
import { BrewTimer } from "@/components/BrewTimer";
import CoffeeJournal from "@/components/CoffeeJournal";
import { RatioCalculator } from "@/components/RatioCalculator";
import { BrewingGuides } from "@/components/BrewingGuides";
import { EquipmentGuide } from "@/components/EquipmentGuide";
import CuppingNotes from "@/components/CuppingNotes";
import CommunityGuides from "@/components/CommunityGuides";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<string>('home');
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Coffee className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-lg font-semibold">Loading Coffee Companion...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const features = [
    {
      id: 'timer',
      icon: Timer,
      title: 'Brew Timer',
      description: 'Advanced timers with gram-based recipe scaling',
      component: BrewTimer
    },
    {
      id: 'journal',
      icon: Book,
      title: 'Coffee Journal',
      description: 'Track beans, origins, and tasting notes',
      component: CoffeeJournal
    },
    {
      id: 'calculator',
      icon: Calculator,
      title: 'Ratio Calculator',
      description: 'Perfect coffee-to-water ratios',
      component: RatioCalculator
    },
    {
      id: 'guides',
      icon: Coffee,
      title: 'Brewing Guides',
      description: 'Scientific brewing methods for flavor profiles',
      component: BrewingGuides
    },
    {
      id: 'equipment',
      icon: Wrench,
      title: 'Equipment Guide',
      description: 'Gear recommendations and reviews',
      component: EquipmentGuide
    },
    {
      id: 'cupping',
      icon: Trophy,
      title: 'Cupping Notes',
      description: 'Professional coffee scoring system',
      component: CuppingNotes
    },
    {
      id: 'community',
      icon: Users,
      title: 'Community',
      description: 'Discover and share brew guides with fellow enthusiasts',
      component: CommunityGuides
    }
  ];

  const renderActiveComponent = () => {
    const feature = features.find(f => f.id === activeFeature);
    if (feature && feature.component) {
      const Component = feature.component;
      return <Component />;
    }
    return renderHome();
  };

  const renderHome = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-coffee-sunshine via-coffee-peach to-coffee-coral">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-coffee-orange/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-32 right-24 w-48 h-48 bg-coffee-mint/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-coffee-sky/25 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-coffee-gold/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-bounce-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
              Your Coffee Companion
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse-glow"></div>
              <p className="text-2xl md:text-3xl mb-0 text-white/95 font-medium drop-shadow-lg">
                Let's brew something amazing together!
              </p>
              <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse-glow"></div>
            </div>
            <p className="text-lg md:text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Your friendly companion for perfect brewing, detailed tracking, and flavor discovery. 
              Ready to explore the wonderful world of coffee with you! 🌟
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setActiveFeature('timer')}
                size="lg" 
                className="bg-white text-coffee-warm font-bold px-10 py-6 rounded-full bright-shadow hover:scale-110 bounce-transition text-lg"
              >
                Start Brewing Together <ChevronRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                onClick={() => setActiveFeature('journal')}
                size="lg" 
                variant="outline"
                className="bg-white/20 border-white/30 text-white font-semibold px-8 py-6 rounded-full backdrop-blur-sm hover:bg-white/30 bounce-transition text-lg"
              >
                Explore Features 🚀
              </Button>
            </div>
          </div>
        </div>
        
        {/* Additional floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="w-12 h-12 bg-white/15 rounded-full blur-lg"></div>
        </div>
        <div className="absolute top-1/2 left-16 animate-float" style={{ animationDelay: '2.5s' }}>
          <div className="w-8 h-8 bg-white/20 rounded-full blur-md"></div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-16 px-4 bg-gradient-to-br from-coffee-light to-coffee-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="companion-text mb-6">
            Hey there, coffee lover! 👋
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            I'm here to be your brewing buddy, taste-testing partner, and coffee journey companion. 
            Together, we'll discover new flavors, perfect your technique, and make every cup special! 
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-3 text-lg font-medium text-primary">
              <div className="w-3 h-3 bg-coffee-orange rounded-full"></div>
              Always here to help
            </div>
            <div className="flex items-center gap-3 text-lg font-medium text-primary">
              <div className="w-3 h-3 bg-coffee-coral rounded-full"></div>
              Learn together
            </div>
            <div className="flex items-center gap-3 text-lg font-medium text-primary">
              <div className="w-3 h-3 bg-coffee-sunshine rounded-full"></div>
              Celebrate great brews
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-coffee-light/50 to-coffee-cream/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="companion-text">Let's Explore Together!</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every feature is designed to make your coffee journey more enjoyable and successful. 
              Think of me as your personal coffee coach and cheerleader! 🎉
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.id}
                className="companion-card cursor-pointer group hover:scale-110 bounce-transition"
                onClick={() => setActiveFeature(feature.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-8 text-center">
                  <div className="feature-icon mx-auto mb-6 group-hover:scale-110 bounce-transition">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-coffee-orange bounce-transition">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-center text-primary font-semibold group-hover:text-coffee-orange">
                    <span>Let's try it!</span>
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 bounce-transition" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 companion-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready for Your Coffee Adventure? ☕🌟
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            I can't wait to help you discover new flavors, master brewing techniques, 
            and create memories one cup at a time. Let's get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setActiveFeature('timer')}
              size="lg" 
              className="bg-white text-coffee-warm font-bold px-10 py-6 rounded-full warm-shadow hover:scale-110 bounce-transition text-lg"
            >
              Start Brewing Now! 🚀
            </Button>
            <Button 
              onClick={() => setActiveFeature('community')}
              size="lg" 
              variant="outline"
              className="border-white/50 text-white font-semibold px-8 py-6 rounded-full backdrop-blur-sm hover:bg-white/20 bounce-transition text-lg"
            >
              Join Our Community 👥
            </Button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setActiveFeature('home')}
              className="text-2xl font-bold text-primary hover:bg-transparent"
            >
              ☕ Coffee Companion
            </Button>
            
            <div className="flex items-center gap-4">
              {/* Mobile & Tablet Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    <Button
                      variant={activeFeature === 'home' ? "default" : "ghost"}
                      onClick={() => setActiveFeature('home')}
                      className="justify-start"
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                    {features.map((feature) => (
                      <Button
                        key={feature.id}
                        variant={activeFeature === feature.id ? "default" : "ghost"}
                        onClick={() => setActiveFeature(feature.id)}
                        className="justify-start"
                      >
                        <feature.icon className="h-4 w-4 mr-2" />
                        {feature.title}
                      </Button>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <Button
                        variant="ghost"
                        onClick={handleProfileClick}
                        className="justify-start w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => signOut()}
                        className="justify-start w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Menu */}
              <div className="hidden lg:flex space-x-2">
                {features.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={activeFeature === feature.id ? "default" : "ghost"}
                    onClick={() => setActiveFeature(feature.id)}
                    className="text-sm"
                  >
                    <feature.icon className="h-4 w-4 mr-2" />
                    {feature.title}
                  </Button>
                ))}
              </div>
              
                <div className="hidden lg:flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Welcome back!</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Index;