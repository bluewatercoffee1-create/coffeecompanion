import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Clock, Thermometer, Users, Eye, Share2, HeartHandshake, Edit, Trash2 } from 'lucide-react';
import { useCommunityGuides, CommunityBrewGuide } from '@/hooks/useCommunityGuides';
import { useAuth } from '@/hooks/useAuth';

const CommunityGuides = () => {
  const { guides, myGuides, likedGuides, userLikes, loading, toggleLike, updateGuide, deleteGuide } = useCommunityGuides();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState<CommunityBrewGuide | null>(null);
  const [editingGuide, setEditingGuide] = useState<CommunityBrewGuide | null>(null);

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

  const GuideCard = ({ guide, showAuthor = true, showControls = false }: { guide: CommunityBrewGuide; showAuthor?: boolean; showControls?: boolean }) => (
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
              <button 
                className="text-sm text-primary hover:text-primary/80 underline cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${guide.user_id}`);
                }}
              >
                by {guide.profiles.display_name}
              </button>
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
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 p-1 h-auto ${
                userLikes.has(guide.id) ? 'text-destructive' : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(guide.id);
              }}
            >
              <Heart className={`h-4 w-4 ${userLikes.has(guide.id) ? 'fill-current' : ''}`} />
              {guide.likes_count}
            </Button>
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
            <div className="flex items-center gap-2">
              {showControls && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGuide(guide);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this guide?')) {
                        deleteGuide(guide.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(guide.created_at)}
              </span>
            </div>
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
          <TabsList className={`grid w-full max-w-lg mx-auto ${user ? 'grid-cols-3' : 'grid-cols-1'} mb-8`}>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Explore
            </TabsTrigger>
            {user && (
              <>
                <TabsTrigger value="mine" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  My Guides
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4" />
                  Favorites
                </TabsTrigger>
              </>
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
            <>
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
                      <GuideCard key={guide.id} guide={guide} showAuthor={false} showControls={true} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites">
                {likedGuides.length === 0 ? (
                  <div className="text-center py-12">
                    <HeartHandshake className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      No Favorite Guides Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Like community guides to save them here for easy access!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedGuides.map(guide => (
                      <GuideCard key={guide.id} guide={guide} showAuthor={true} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Edit Guide Dialog */}
        {editingGuide && (
          <Dialog open={!!editingGuide} onOpenChange={() => setEditingGuide(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Guide</DialogTitle>
                <DialogDescription>Update your brew guide details</DialogDescription>
              </DialogHeader>
              <EditGuideForm 
                guide={editingGuide} 
                onSave={(updatedGuide) => {
                  updateGuide(editingGuide.id, updatedGuide);
                  setEditingGuide(null);
                }}
                onCancel={() => setEditingGuide(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const EditGuideForm = ({ guide, onSave, onCancel }: { 
  guide: CommunityBrewGuide; 
  onSave: (guide: Partial<CommunityBrewGuide>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: guide.name,
    description: guide.description,
    method: guide.method,
    difficulty: guide.difficulty,
    water_temp: guide.water_temp,
    grind_size: guide.grind_size,
    ratio: guide.ratio,
    brew_time: guide.brew_time,
    target_flavor: guide.target_flavor,
    steps: guide.steps,
    science: guide.science || '',
    flavor_profile: guide.flavor_profile || [],
    tips: guide.tips || [],
    is_public: guide.is_public
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Guide Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="V60">V60</option>
            <option value="Chemex">Chemex</option>
            <option value="French Press">French Press</option>
            <option value="AeroPress">AeroPress</option>
            <option value="Espresso">Espresso</option>
            <option value="Cold Brew">Cold Brew</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded-md"
          rows={2}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Water Temperature (°C)</label>
          <input
            type="number"
            value={formData.water_temp}
            onChange={(e) => setFormData({ ...formData, water_temp: parseInt(e.target.value) })}
            className="w-full p-2 border rounded-md"
            min="80"
            max="100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Grind Size</label>
          <input
            type="text"
            value={formData.grind_size}
            onChange={(e) => setFormData({ ...formData, grind_size: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Medium-Fine"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ratio</label>
          <input
            type="text"
            value={formData.ratio}
            onChange={(e) => setFormData({ ...formData, ratio: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 1:15"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brew Time</label>
          <input
            type="text"
            value={formData.brew_time}
            onChange={(e) => setFormData({ ...formData, brew_time: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., 3-4 minutes"
            required
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="is_public" className="text-sm font-medium">Make Public</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Target Flavor</label>
        <textarea
          value={formData.target_flavor}
          onChange={(e) => setFormData({ ...formData, target_flavor: e.target.value })}
          className="w-full p-2 border rounded-md"
          rows={2}
          required
        />
      </div>

      {/* Steps Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Brewing Steps</label>
        <div className="space-y-3">
          {formData.steps.map((step, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Step {step.step}</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newSteps = formData.steps.filter((_, i) => i !== index);
                    setFormData({ ...formData, steps: newSteps });
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
              <input
                type="text"
                placeholder="Step instruction"
                value={step.instruction}
                onChange={(e) => {
                  const newSteps = [...formData.steps];
                  newSteps[index].instruction = e.target.value;
                  setFormData({ ...formData, steps: newSteps });
                }}
                className="w-full p-2 text-sm border rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Duration (e.g., 30s)"
                  value={step.duration || ''}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[index].duration = e.target.value;
                    setFormData({ ...formData, steps: newSteps });
                  }}
                  className="w-full p-2 text-sm border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Temperature (°C)"
                  value={step.temperature || ''}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[index].temperature = e.target.value ? parseInt(e.target.value) : undefined;
                    setFormData({ ...formData, steps: newSteps });
                  }}
                  className="w-full p-2 text-sm border rounded-md"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newSteps = [...formData.steps, {
                step: formData.steps.length + 1,
                instruction: '',
                duration: '',
                temperature: undefined
              }];
              setFormData({ ...formData, steps: newSteps });
            }}
            className="w-full"
          >
            Add Step
          </Button>
        </div>
      </div>

      {/* Tips Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Pro Tips</label>
        <div className="space-y-2">
          {formData.tips.map((tip, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tip}
                onChange={(e) => {
                  const newTips = [...formData.tips];
                  newTips[index] = e.target.value;
                  setFormData({ ...formData, tips: newTips });
                }}
                className="flex-1 p-2 text-sm border rounded-md"
                placeholder="Enter a pro tip..."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newTips = formData.tips.filter((_, i) => i !== index);
                  setFormData({ ...formData, tips: newTips });
                }}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newTips = [...formData.tips, ''];
              setFormData({ ...formData, tips: newTips });
            }}
            className="w-full"
          >
            Add Tip
          </Button>
        </div>
      </div>

      {/* Flavor Profile Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Flavor Profile</label>
        <div className="space-y-2">
          {formData.flavor_profile.map((flavor, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={flavor}
                onChange={(e) => {
                  const newFlavors = [...formData.flavor_profile];
                  newFlavors[index] = e.target.value;
                  setFormData({ ...formData, flavor_profile: newFlavors });
                }}
                className="flex-1 p-2 text-sm border rounded-md"
                placeholder="Enter flavor note..."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newFlavors = formData.flavor_profile.filter((_, i) => i !== index);
                  setFormData({ ...formData, flavor_profile: newFlavors });
                }}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newFlavors = [...formData.flavor_profile, ''];
              setFormData({ ...formData, flavor_profile: newFlavors });
            }}
            className="w-full"
          >
            Add Flavor Note
          </Button>
        </div>
      </div>

      {/* Science Section */}
      <div>
        <label className="block text-sm font-medium mb-1">The Science (Optional)</label>
        <textarea
          value={formData.science}
          onChange={(e) => setFormData({ ...formData, science: e.target.value })}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Explain the science behind this brewing method..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="coffee-gradient text-white">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default CommunityGuides;