import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Timer, Book, Calculator, Coffee, Wrench, Trophy, Users, Home, User, Menu } from "lucide-react";

interface MobileNavigationProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
  onProfileClick: () => void;
}

const MobileNavigation = ({ activeFeature, setActiveFeature, onProfileClick }: MobileNavigationProps) => {
  const features = [
    { id: 'home', icon: Home, title: 'Home' },
    { id: 'timer', icon: Timer, title: 'Timer' },
    { id: 'journal', icon: Book, title: 'Journal' },
    { id: 'calculator', icon: Calculator, title: 'Calculator' },
    { id: 'guides', icon: Coffee, title: 'Guides' },
    { id: 'equipment', icon: Wrench, title: 'Equipment' },
    { id: 'cupping', icon: Trophy, title: 'Cupping' },
    { id: 'community', icon: Users, title: 'Community' }
  ];

  const mainNavItems = features.slice(0, 4); // First 4 for bottom nav
  const moreItems = features.slice(4); // Rest for "More" menu

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFeature(item.id)}
              className={`flex flex-col items-center justify-center h-12 px-2 min-w-0 flex-1 ${
                activeFeature === item.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.title}</span>
            </Button>
          ))}
          
          {/* More Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center h-12 px-2 min-w-0 flex-1 text-muted-foreground"
              >
                <Menu className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>More Features</SheetTitle>
              </SheetHeader>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {moreItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeFeature === item.id ? "default" : "outline"}
                    onClick={() => setActiveFeature(item.id)}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <item.icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Button>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={onProfileClick}
                  className="w-full justify-start h-12"
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;