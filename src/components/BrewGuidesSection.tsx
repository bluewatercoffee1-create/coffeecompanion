import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Clock, Thermometer, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BrewGuide {
  id: string;
  name: string;
  description: string;
  method: string;
  difficulty: string;
  water_temp: number;
  grind_size: string;
  ratio: string;
  brew_time: string;
  target_flavor: string;
  steps: any;
  science?: string;
  flavor_profile?: string[];
  tips?: string[];
  is_public: boolean;
  likes_count: number;
  created_at: string;
}

interface BrewGuidesSectionProps {
  userId: string;
}

export const BrewGuidesSection = ({ userId }: BrewGuidesSectionProps) => {
  const [guides, setGuides] = useState<BrewGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<BrewGuide | null>(null);

  const fetchUserGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('community_brew_guides')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching brew guides:', error);
      toast.error('Failed to load brew guides');
    } finally {
      setLoading(false);
    }
  };

  const deleteGuide = async (guideId: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return;

    try {
      const { error } = await supabase
        .from('community_brew_guides')
        .delete()
        .eq('id', guideId);

      if (error) throw error;
      
      toast.success('Guide deleted successfully');
      fetchUserGuides();
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast.error('Failed to delete guide');
    }
  };

  const togglePublic = async (guideId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('community_brew_guides')
        .update({ is_public: !isPublic })
        .eq('id', guideId);

      if (error) throw error;
      
      toast.success(`Guide ${!isPublic ? 'published' : 'unpublished'} successfully`);
      fetchUserGuides();
    } catch (error) {
      console.error('Error updating guide:', error);
      toast.error('Failed to update guide');
    }
  };

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
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchUserGuides();
  }, [userId]);

  if (loading) {
    return <div className="animate-pulse">Loading brew guides...</div>;
  }

  if (guides.length === 0) {
    return (
      <Card className="text-center p-8">
        <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          You haven't created any brew guides yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Create guides from the main app's Brewing Guides section.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {guides.map((guide) => (
        <Card key={guide.id} className="coffee-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {guide.name}
                  {guide.is_public ? (
                    <Badge variant="secondary" className="text-xs">Public</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Private</Badge>
                  )}
                </CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(guide.difficulty)}>
                  {guide.difficulty}
                </Badge>
              </div>
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

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedGuide(guide)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
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
                          {Array.isArray(guide.steps) && guide.steps.map((step: any, index: number) => (
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
                
                <Button
                  size="sm"
                  variant={guide.is_public ? "default" : "outline"}
                  onClick={() => togglePublic(guide.id, guide.is_public)}
                >
                  {guide.is_public ? 'Public' : 'Make Public'}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteGuide(guide.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};