import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Book, Calculator, Wrench, Trophy, Coffee, ChevronRight, Users, Heart } from "lucide-react";
import { BrewTimer } from "@/components/BrewTimer";
import CoffeeJournal from "@/components/CoffeeJournal";
import { RatioCalculator } from "@/components/RatioCalculator";
import { BrewingGuides } from "@/components/BrewingGuides";
import { EquipmentGuide } from "@/components/EquipmentGuide";
import CuppingNotes from "@/components/CuppingNotes";
import CommunityGuides from "@/components/CommunityGuides";
import { useAuth } from "@/hooks/useAuth";
import MobileNavigation from "@/components/MobileNavigation";
import MobileHeader from "@/components/MobileHeader";

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
    <div className="min-h-screen pb-20">
      {/* Mobile Hero Section */}
      <section className="px-4 pt-8 pb-12 bg-gradient-to-br from-coffee-sunshine via-coffee-peach to-coffee-coral">
        <div className="text-center text-white max-w-sm mx-auto">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Coffee className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
            Coffee Companion
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Your brewing buddy for perfect coffee every time! ☕
          </p>
          <Button 
            onClick={() => setActiveFeature('timer')}
            size="lg" 
            className="bg-white text-coffee-warm font-bold px-8 py-4 rounded-full w-full shadow-lg"
          >
            Start Brewing <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-8 bg-background">
        <h2 className="text-xl font-semibold mb-6 text-center">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <Button
            onClick={() => setActiveFeature('timer')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <Timer className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm font-medium">Start Timer</span>
          </Button>
          <Button
            onClick={() => setActiveFeature('journal')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <Book className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm font-medium">Add Entry</span>
          </Button>
          <Button
            onClick={() => setActiveFeature('calculator')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <Calculator className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm font-medium">Calculator</span>
          </Button>
          <Button
            onClick={() => setActiveFeature('community')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <Users className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm font-medium">Community</span>
          </Button>
        </div>
      </section>

      {/* Features List */}
      <section className="px-4 py-8 bg-muted/20">
        <h2 className="text-xl font-semibold mb-6 text-center">All Features</h2>
        <div className="space-y-3 max-w-sm mx-auto">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className="cursor-pointer transition-all active:scale-95"
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className="flex items-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Daily Motivation */}
      <section className="px-4 py-8 bg-primary/5">
        <div className="max-w-sm mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Today's Brew</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            "Every cup is a chance to create something amazing. Let's make today's brew special!"
          </p>
        </div>
      </section>
    </div>
  );

  const getFeatureTitle = () => {
    const feature = features.find(f => f.id === activeFeature);
    return feature ? feature.title : 'Coffee Companion';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader
        title={getFeatureTitle()}
        showBack={activeFeature !== 'home'}
        onBack={() => setActiveFeature('home')}
        onSignOut={signOut}
        onProfile={handleProfileClick}
      />

      {/* Content */}
      <div className="pt-14 pb-20">
        {renderActiveComponent()}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        onProfileClick={handleProfileClick}
      />
    </div>
  );
};

export default Index;