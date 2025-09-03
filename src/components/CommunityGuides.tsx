import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Clock, Thermometer, Users, Eye, Share2 } from 'lucide-react';
import { useCommunityGuides, CommunityBrewGuide } from '@/hooks/useCommunityGuides';
import { useAuth } from '@/hooks/useAuth';

const CommunityGuides = () => {
  const { guides, myGuides, loading } = useCommunityGuides();
  const { user } = useAuth();
  const [selectedGuide, setSelectedGuide] = useState<CommunityBrewGuide | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-success/20 text-success border-success/30';
      case 'intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-secondary/20 text-secondary border-secondary/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const GuideCard = ({ guide, showAuthor = true }: { guide: CommunityBrewGuide; showAuthor?: boolean }) => (
    <Card className="glass-card coffee-shadow hover:scale-105 smooth-transition cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-primary group-hover:text-primary/80 smooth-transition">
              {guide.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {guide.description}
            </CardDescription>
            {showAuthor && guide.profiles && (
              <p className="text-sm text-muted-foreground">
                by {guide.profiles.display_name}
              </p>
            )}
          </div>
          <Badge className={getDifficultyColor(guide.difficulty)}>
            {guide.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {guide.brew_time}
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              {guide.water_temp}°C
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {guide.likes_count}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="coffee-border">
                {guide.method}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {guide.ratio}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(guide.created_at)}
            </span>
          </div>

          {guide.flavor_profile && guide.flavor_profile.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {guide.flavor_profile.slice(0, 3).map((flavor, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {flavor}
                </Badge>
              ))}
              {guide.flavor_profile.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{guide.flavor_profile.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="w-full coffee-gradient text-white"
                onClick={() => setSelectedGuide(guide)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-primary">{guide.name}</DialogTitle>
                <DialogDescription>{guide.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Method</div>
                    <Badge className="w-full">{guide.method}</Badge>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-semibold">{guide.brew_time}</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Temperature</div>
                    <div className="font-semibold">{guide.water_temp}°C</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Ratio</div>
                    <div className="font-semibold">{guide.ratio}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-primary">Grind Size</h4>
                  <p className="text-muted-foreground">{guide.grind_size}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-primary">Target Flavor</h4>
                  <p className="text-muted-foreground">{guide.target_flavor}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-primary">Brewing Steps</h4>
                  <div className="space-y-3">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{step.instruction}</p>
                          {step.duration && (
                            <p className="text-xs text-muted-foreground mt-1">Duration: {step.duration}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {guide.science && (
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">The Science</h4>
                    <p className="text-sm text-muted-foreground">{guide.science}</p>
                  </div>
                )}

                {guide.tips && guide.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Pro Tips</h4>
                    <ul className="space-y-1">
                      {guide.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guide.flavor_profile && guide.flavor_profile.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Flavor Profile</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.flavor_profile.map((flavor, index) => (
                        <Badge key={index} variant="secondary">
                          {flavor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-lg font-semibold">Loading Community Guides...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Community Brew Guides
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing brewing techniques shared by coffee enthusiasts from around the world, 
            or share your own perfect recipe with the community.
          </p>
        </div>

        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Explore
            </TabsTrigger>
            {user && (
              <TabsTrigger value="mine" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                My Guides
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="explore">
            {guides.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No Community Guides Yet
                </h3>
                <p className="text-muted-foreground">
                  Be the first to share your amazing brew recipe with the community!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => (
                  <GuideCard key={guide.id} guide={guide} showAuthor={true} />
                ))}
              </div>
            )}
          </TabsContent>

          {user && (
            <TabsContent value="mine">
              {myGuides.length === 0 ? (
                <div className="text-center py-12">
                  <Share2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No Guides Created Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first brew guide to share with the community!
                  </p>
                  <Button 
                    className="coffee-gradient text-white"
                    onClick={() => {
                      // Navigate to brewing guides with create mode
                      const event = new CustomEvent('navigateToBrewingGuides', { detail: { createMode: true } });
                      window.dispatchEvent(event);
                    }}
                  >
                    Create Guide
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGuides.map(guide => (
                    <GuideCard key={guide.id} guide={guide} showAuthor={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityGuides;