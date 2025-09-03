import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Coffee, Thermometer, Clock, Droplets, Target, ChevronRight, Beaker, Plus, Share2, User, Heart, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brewingGuides, BrewingGuide } from "@/data/brewingGuides";
import { useCommunityGuides, CommunityBrewGuide } from "@/hooks/useCommunityGuides";
import { useAuth } from "@/hooks/useAuth";
import { CustomGuideCreator } from "./CustomGuideCreator";

export const BrewingGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState<BrewingGuide | null>(brewingGuides[0]);
  const [selectedCommunityGuide, setSelectedCommunityGuide] = useState<CommunityBrewGuide | null>(null);
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [customGuides, setCustomGuides] = useState<BrewingGuide[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGuide, setEditingGuide] = useState<CommunityBrewGuide | null>(null);
  const [activeTab, setActiveTab] = useState('explore');
  const { myGuides, likedGuides, updateGuide, deleteGuide } = useCommunityGuides();
  const { user } = useAuth();

  // Listen for navigation events from community page
  useEffect(() => {
    const handleNavigateToBrewingGuides = (event: any) => {
      if (event.detail?.createMode) {
        setShowCreateDialog(true);
      }
    };

    window.addEventListener('navigateToBrewingGuides', handleNavigateToBrewingGuides);
    return () => window.removeEventListener('navigateToBrewingGuides', handleNavigateToBrewingGuides);
  }, []);

  const allGuides = [...brewingGuides, ...customGuides];
  
  const filteredGuides = allGuides.filter(guide => {
    const matchesMethod = filterMethod === 'all' || guide.method === filterMethod;
    const matchesDifficulty = filterDifficulty === 'all' || guide.difficulty === filterDifficulty;
    return matchesMethod && matchesDifficulty;
  });

  const handleGuideCreated = () => {
    setShowCreateDialog(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-success/20 text-success border-success/30';
      case 'intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-secondary/20 text-secondary border-secondary/30';
    }
  };

  const formatCommunityGuideForDisplay = (guide: CommunityBrewGuide): BrewingGuide => {
    return {
      id: guide.id,
      name: guide.name,
      method: guide.method,
      description: guide.description,
      difficulty: guide.difficulty as any,
      brewTime: guide.brew_time,
      waterTemp: guide.water_temp,
      grindSize: guide.grind_size,
      ratio: guide.ratio,
      targetFlavor: guide.flavor_profile || [],
      flavorProfile: guide.target_flavor,
      steps: guide.steps.map(step => ({
        step: step.step,
        action: step.instruction,
        time: step.duration || '',
        technique: step.instruction,
        scienceNote: undefined
      })),
      tips: guide.tips || [],
      science: guide.science ? {
        extraction: guide.science,
        agitation: '',
        temperature: '',
        grind: ''
      } : undefined
    };
  };

  const handleCommunityGuideSelect = (guide: CommunityBrewGuide) => {
    setSelectedCommunityGuide(guide);
    setSelectedGuide(formatCommunityGuideForDisplay(guide));
  };

  const uniqueMethods = Array.from(new Set(allGuides.map(g => g.method)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Scientific Brewing Guides</h1>
        <p className="text-muted-foreground text-lg">Advanced techniques targeting specific flavor profiles using brewing science</p>
      </div>

      {/* Filters and Create Button */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {uniqueMethods.map(method => (
              <SelectItem key={method} value={method}>{method}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create Custom Brewing Guide</DialogTitle>
            </DialogHeader>
            
            <CustomGuideCreator 
              onGuideCreated={handleGuideCreated}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-8">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          {user && (
            <>
              <TabsTrigger value="mine" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                My Guides
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>

        <TabsContent value="explore">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Guide List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Built-in Brewing Guides</h3>
              {filteredGuides.map((guide) => (
                <Card 
                  key={guide.id}
                  className={`coffee-card p-4 cursor-pointer transition-all hover:scale-105 ${
                    selectedGuide?.id === guide.id && !selectedCommunityGuide ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    setSelectedGuide(guide);
                    setSelectedCommunityGuide(null);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-primary">{guide.name}</h4>
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-primary" />
                      <span>{guide.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{guide.brewTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {guide.targetFlavor.slice(0, 2).map(flavor => (
                      <Badge key={flavor} variant="secondary" className="text-xs">
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Selected Guide Details */}
            {selectedGuide && (
              <div className="lg:col-span-2 space-y-6">
                <Card className="coffee-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-2">{selectedGuide.name}</h2>
                      <p className="text-muted-foreground">{selectedGuide.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                        {selectedGuide.difficulty}
                      </Badge>
                      {selectedCommunityGuide && selectedCommunityGuide.user_id === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingGuide(selectedCommunityGuide)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Recipe Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Thermometer className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{selectedGuide.waterTemp}°C</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Ratio</p>
                      <p className="font-semibold">{selectedGuide.ratio}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Brew Time</p>
                      <p className="font-semibold">{selectedGuide.brewTime}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Coffee className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Grind</p>
                      <p className="font-semibold">{selectedGuide.grindSize}</p>
                    </div>
                  </div>

                  {/* Target Flavors */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-primary mb-3">Target Flavor Profile</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedGuide.targetFlavor.map(flavor => (
                        <Badge key={flavor} variant="default" className="text-sm">
                          {flavor}
                        </Badge>
                      ))}
                    </div>
                    {selectedGuide.flavorProfile && (
                      <p className="text-sm text-muted-foreground italic">
                        {selectedGuide.flavorProfile}
                      </p>
                    )}
                  </div>
                </Card>

                {/* Brewing Steps */}
                <Card className="coffee-card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                    <Droplets className="h-5 w-5 mr-2" />
                    Brewing Steps
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedGuide.steps.map((step) => (
                      <div key={step.step} className="border-l-2 border-primary/20 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary">
                            Step {step.step}: {step.action}
                          </h4>
                          <span className="text-sm text-muted-foreground">{step.time}</span>
                        </div>
                        
                        <p className="text-sm mb-2">{step.technique}</p>
                        
                        {step.scienceNote && (
                          <div className="bg-secondary/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-start">
                              <Beaker className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                              {step.scienceNote}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Tips */}
                {selectedGuide.tips.length > 0 && (
                  <Card className="coffee-card p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4">Pro Tips</h3>
                    <ul className="space-y-2">
                      {selectedGuide.tips.map((tip, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <ChevronRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Science Section */}
                {selectedGuide.science && (
                  <Card className="coffee-card p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                      <Beaker className="h-5 w-5 mr-2" />
                      The Science Behind The Brew
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Extraction Science</h4>
                        <p className="text-sm text-muted-foreground">{selectedGuide.science.extraction}</p>
                      </div>
                      
                      {selectedGuide.science.agitation && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Agitation Effects</h4>
                          <p className="text-sm text-muted-foreground">{selectedGuide.science.agitation}</p>
                        </div>
                      )}
                      
                      {selectedGuide.science.temperature && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Temperature Control</h4>
                          <p className="text-sm text-muted-foreground">{selectedGuide.science.temperature}</p>
                        </div>
                      )}
                      
                      {selectedGuide.science.grind && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Grind Impact</h4>
                          <p className="text-sm text-muted-foreground">{selectedGuide.science.grind}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {user && (
          <>
            <TabsContent value="mine">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Guides List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-primary">My Custom Guides</h3>
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Create Custom Brewing Guide</DialogTitle>
                        </DialogHeader>
                        
                        <CustomGuideCreator 
                          onGuideCreated={handleGuideCreated}
                          onCancel={() => setShowCreateDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {myGuides.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You haven't created any guides yet.
                      </p>
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Guide
                      </Button>
                    </div>
                  ) : (
                    myGuides.map(guide => (
                      <Card 
                        key={guide.id} 
                        className={`coffee-card p-4 cursor-pointer transition-all hover:scale-105 ${
                          selectedCommunityGuide?.id === guide.id ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleCommunityGuideSelect(guide)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-primary">{guide.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(guide.difficulty)}>
                              {guide.difficulty}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingGuide(guide);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this guide?')) {
                                    deleteGuide(guide.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{guide.description}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-primary" />
                            <span>{guide.method}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{guide.brew_time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            {guide.flavor_profile?.slice(0, 2).map(flavor => (
                              <Badge key={flavor} variant="secondary" className="text-xs">
                                {flavor}
                              </Badge>
                            ))}
                          </div>
                          {guide.is_public && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* Selected Guide Details */}
                {selectedCommunityGuide && selectedGuide && activeTab === 'mine' && (
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="coffee-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-primary mb-2">{selectedGuide.name}</h2>
                          <p className="text-muted-foreground">{selectedGuide.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                            {selectedGuide.difficulty}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingGuide(selectedCommunityGuide)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Recipe Overview */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Thermometer className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="font-semibold">{selectedGuide.waterTemp}°C</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Ratio</p>
                          <p className="font-semibold">{selectedGuide.ratio}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Brew Time</p>
                          <p className="font-semibold">{selectedGuide.brewTime}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Coffee className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Grind</p>
                          <p className="font-semibold">{selectedGuide.grindSize}</p>
                        </div>
                      </div>

                      {/* Target Flavors */}
                      {selectedGuide.targetFlavor.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-primary mb-3">Target Flavor Profile</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {selectedGuide.targetFlavor.map(flavor => (
                              <Badge key={flavor} variant="default" className="text-sm">
                                {flavor}
                              </Badge>
                            ))}
                          </div>
                          {selectedGuide.flavorProfile && (
                            <p className="text-sm text-muted-foreground italic">
                              {selectedGuide.flavorProfile}
                            </p>
                          )}
                        </div>
                      )}
                    </Card>

                    {/* Brewing Steps */}
                    <Card className="coffee-card p-6">
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                        <Droplets className="h-5 w-5 mr-2" />
                        Brewing Steps
                      </h3>
                      
                      <div className="space-y-4">
                        {selectedGuide.steps.map((step) => (
                          <div key={step.step} className="border-l-2 border-primary/20 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-primary">
                                Step {step.step}: {step.action}
                              </h4>
                              {step.time && <span className="text-sm text-muted-foreground">{step.time}</span>}
                            </div>
                            
                            <p className="text-sm mb-2">{step.technique}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Tips */}
                    {selectedGuide.tips.length > 0 && (
                      <Card className="coffee-card p-6">
                        <h3 className="text-xl font-semibold text-primary mb-4">Pro Tips</h3>
                        <ul className="space-y-2">
                          {selectedGuide.tips.map((tip, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <ChevronRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    {/* Science Section */}
                    {selectedGuide.science && selectedGuide.science.extraction && (
                      <Card className="coffee-card p-6">
                        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                          <Beaker className="h-5 w-5 mr-2" />
                          The Science Behind The Brew
                        </h3>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">{selectedGuide.science.extraction}</p>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Favorites List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Favorite Guides</h3>
                  
                  {likedGuides.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        You haven't liked any community guides yet.
                      </p>
                    </div>
                  ) : (
                    likedGuides.map(guide => (
                      <Card 
                        key={guide.id} 
                        className={`coffee-card p-4 cursor-pointer transition-all hover:scale-105 ${
                          selectedCommunityGuide?.id === guide.id ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleCommunityGuideSelect(guide)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-primary">{guide.name}</h4>
                          <Badge className={getDifficultyColor(guide.difficulty)}>
                            {guide.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{guide.description}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-primary" />
                            <span>{guide.method}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{guide.brew_time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            {guide.flavor_profile?.slice(0, 2).map(flavor => (
                              <Badge key={flavor} variant="secondary" className="text-xs">
                                {flavor}
                              </Badge>
                            ))}
                          </div>
                          {guide.profiles && (
                            <p className="text-xs text-muted-foreground">
                              by {guide.profiles.display_name}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* Selected Guide Details */}
                {selectedCommunityGuide && selectedGuide && activeTab === 'favorites' && (
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="coffee-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-primary mb-2">{selectedGuide.name}</h2>
                          <p className="text-muted-foreground">{selectedGuide.description}</p>
                          {selectedCommunityGuide.profiles && (
                            <p className="text-sm text-muted-foreground mt-2">
                              by {selectedCommunityGuide.profiles.display_name}
                            </p>
                          )}
                        </div>
                        <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                          {selectedGuide.difficulty}
                        </Badge>
                      </div>

                      {/* Recipe Overview - Same as mine tab */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Thermometer className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="font-semibold">{selectedGuide.waterTemp}°C</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Ratio</p>
                          <p className="font-semibold">{selectedGuide.ratio}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Brew Time</p>
                          <p className="font-semibold">{selectedGuide.brewTime}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Coffee className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Grind</p>
                          <p className="font-semibold">{selectedGuide.grindSize}</p>
                        </div>
                      </div>

                      {/* Target Flavors */}
                      {selectedGuide.targetFlavor.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-primary mb-3">Target Flavor Profile</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {selectedGuide.targetFlavor.map(flavor => (
                              <Badge key={flavor} variant="default" className="text-sm">
                                {flavor}
                              </Badge>
                            ))}
                          </div>
                          {selectedGuide.flavorProfile && (
                            <p className="text-sm text-muted-foreground italic">
                              {selectedGuide.flavorProfile}
                            </p>
                          )}
                        </div>
                      )}
                    </Card>

                    {/* Brewing Steps */}
                    <Card className="coffee-card p-6">
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                        <Droplets className="h-5 w-5 mr-2" />
                        Brewing Steps
                      </h3>
                      
                      <div className="space-y-4">
                        {selectedGuide.steps.map((step) => (
                          <div key={step.step} className="border-l-2 border-primary/20 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-primary">
                                Step {step.step}: {step.action}
                              </h4>
                              {step.time && <span className="text-sm text-muted-foreground">{step.time}</span>}
                            </div>
                            
                            <p className="text-sm mb-2">{step.technique}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Tips */}
                    {selectedGuide.tips.length > 0 && (
                      <Card className="coffee-card p-6">
                        <h3 className="text-xl font-semibold text-primary mb-4">Pro Tips</h3>
                        <ul className="space-y-2">
                          {selectedGuide.tips.map((tip, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <ChevronRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    {/* Science Section */}
                    {selectedGuide.science && selectedGuide.science.extraction && (
                      <Card className="coffee-card p-6">
                        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                          <Beaker className="h-5 w-5 mr-2" />
                          The Science Behind The Brew
                        </h3>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">{selectedGuide.science.extraction}</p>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}

        <TabsContent value="local">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Custom Guides List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Local Custom Guides</h3>
              {customGuides.length === 0 ? (
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No local guides yet</p>
                  <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                    Create First Guide
                  </Button>
                </div>
              ) : (
                customGuides.map((guide) => (
                  <Card 
                    key={guide.id}
                    className={`coffee-card p-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedGuide.id === guide.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-primary">{guide.name}</h4>
                      <Badge className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-primary" />
                        <span>{guide.method}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{guide.brewTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {guide.targetFlavor.slice(0, 2).map(flavor => (
                        <Badge key={flavor} variant="secondary" className="text-xs">
                          {flavor}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Selected Guide Details (same as explore tab) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="coffee-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">{selectedGuide.name}</h2>
                    <p className="text-muted-foreground">{selectedGuide.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                    {selectedGuide.difficulty}
                  </Badge>
                </div>

                {/* Recipe Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Thermometer className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="font-semibold">{selectedGuide.waterTemp}°C</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Ratio</p>
                    <p className="font-semibold">{selectedGuide.ratio}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Brew Time</p>
                    <p className="font-semibold">{selectedGuide.brewTime}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Coffee className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Grind</p>
                    <p className="font-semibold">{selectedGuide.grindSize}</p>
                  </div>
                </div>

                {/* Target Flavors */}
                <div className="mb-6">
                  <h4 className="font-semibold text-primary mb-3">Target Flavor Profile</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedGuide.targetFlavor.map(flavor => (
                      <Badge key={flavor} variant="default" className="text-sm">
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    {selectedGuide.flavorProfile}
                  </p>
                </div>
              </Card>

              {/* Brewing Steps */}
              <Card className="coffee-card p-6">
                <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                  <Droplets className="h-5 w-5 mr-2" />
                  Brewing Steps
                </h3>
                
                <div className="space-y-4">
                  {selectedGuide.steps.map((step) => (
                    <div key={step.step} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary">
                          Step {step.step}: {step.action}
                        </h4>
                        <span className="text-sm text-muted-foreground">{step.time}</span>
                      </div>
                      
                      <p className="text-sm mb-2">{step.technique}</p>
                      
                      {step.scienceNote && (
                        <div className="bg-secondary/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground flex items-start">
                            <Beaker className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                            {step.scienceNote}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Tips */}
              {selectedGuide.tips.length > 0 && (
                <Card className="coffee-card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">Pro Tips</h3>
                  <ul className="space-y-2">
                    {selectedGuide.tips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <ChevronRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Science Section */}
              {selectedGuide.science && (
                <Card className="coffee-card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                    <Beaker className="h-5 w-5 mr-2" />
                    The Science Behind The Brew
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Extraction Science</h4>
                      <p className="text-sm text-muted-foreground">{selectedGuide.science.extraction}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Agitation Effects</h4>
                      <p className="text-sm text-muted-foreground">{selectedGuide.science.agitation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Temperature Control</h4>
                      <p className="text-sm text-muted-foreground">{selectedGuide.science.temperature}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Grind Impact</h4>
                      <p className="text-sm text-muted-foreground">{selectedGuide.science.grind}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        {/* Edit Guide Dialog */}
        {editingGuide && (
          <Dialog open={!!editingGuide} onOpenChange={() => setEditingGuide(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Guide</DialogTitle>
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
      </Tabs>
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