import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Timer, Book, Calculator, Wrench, Trophy, Coffee, ChevronRight, LogOut, User, Menu } from "lucide-react";
import heroImage from "@/assets/coffee-hero.jpg";
import { BrewTimer } from "@/components/BrewTimer";
import CoffeeJournal from "@/components/CoffeeJournal";
import { RatioCalculator } from "@/components/RatioCalculator";
import { BrewingGuides } from "@/components/BrewingGuides";
import { EquipmentGuide } from "@/components/EquipmentGuide";
import CuppingNotes from "@/components/CuppingNotes";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<string>('home');
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

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
          <span className="text-lg font-semibold">Loading Coffee Compass...</span>
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-coffee-golden bg-clip-text text-transparent">
            Coffee Compass
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            The ultimate coffee enthusiast companion for perfect brewing, detailed tracking, and flavor mastery
          </p>
          <Button 
            onClick={() => setActiveFeature('timer')}
            size="lg" 
            className="coffee-gradient text-white font-semibold px-8 py-4 rounded-full coffee-shadow hover:scale-105 smooth-transition"
          >
            Start Brewing <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 cream-gradient">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">
            Master Your Coffee Journey
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            From precision brewing to flavor profiling, Coffee Compass provides everything you need to elevate your coffee experience
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className="coffee-card p-8 cursor-pointer group hover:scale-105 smooth-transition"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="golden-gradient p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex items-center text-primary font-medium">
                  Explore <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
                </div>
              </Card>
            ))}
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
              ☕ Coffee Compass
            </Button>
            
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
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
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-2">
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
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Welcome back!</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
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