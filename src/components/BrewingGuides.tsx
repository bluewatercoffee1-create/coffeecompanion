import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Thermometer, Clock, Droplets, Target, ChevronRight, Beaker } from "lucide-react";
import { brewingGuides, BrewingGuide } from "@/data/brewingGuides";

export const BrewingGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState<BrewingGuide>(brewingGuides[0]);
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredGuides = brewingGuides.filter(guide => {
    const matchesMethod = filterMethod === 'all' || guide.method === filterMethod;
    const matchesDifficulty = filterDifficulty === 'all' || guide.difficulty === filterDifficulty;
    return matchesMethod && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueMethods = Array.from(new Set(brewingGuides.map(g => g.method)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Scientific Brewing Guides</h1>
        <p className="text-muted-foreground text-lg">Advanced techniques targeting specific flavor profiles using brewing science</p>
      </div>

      {/* Filters */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guide List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Brewing Guides</h3>
          {filteredGuides.map((guide) => (
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
          ))}
        </div>

        {/* Selected Guide Details */}
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
                        <Beaker className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                        <strong>Science:</strong> {step.scienceNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Science Breakdown */}
          <Card className="coffee-card p-6">
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <Beaker className="h-5 w-5 mr-2" />
              Brewing Science
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">Extraction</h4>
                <p className="text-sm text-muted-foreground">{selectedGuide.science.extraction}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Agitation</h4>
                <p className="text-sm text-muted-foreground">{selectedGuide.science.agitation}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Temperature</h4>
                <p className="text-sm text-muted-foreground">{selectedGuide.science.temperature}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Grind Size</h4>
                <p className="text-sm text-muted-foreground">{selectedGuide.science.grind}</p>
              </div>
            </div>
          </Card>

          {/* Pro Tips */}
          <Card className="coffee-card p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Pro Tips</h3>
            
            <ul className="space-y-2">
              {selectedGuide.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};