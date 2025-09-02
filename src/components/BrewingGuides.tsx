import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Thermometer, Clock, Droplets, Target, ChevronRight, Beaker } from "lucide-react";

interface BrewingGuide {
  id: string;
  name: string;
  method: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  brewTime: string;
  targetFlavor: string[];
  description: string;
  waterTemp: number;
  grindSize: string;
  ratio: string;
  steps: {
    step: number;
    time: string;
    action: string;
    technique: string;
    scienceNote?: string;
  }[];
  science: {
    extraction: string;
    agitation: string;
    temperature: string;
    grind: string;
  };
  flavorProfile: string;
  tips: string[];
}

const brewingGuides: BrewingGuide[] = [
  {
    id: 'v60-bright',
    name: 'V60 Bright & Floral',
    method: 'V60',
    difficulty: 'Intermediate',
    brewTime: '2:30-3:00',
    targetFlavor: ['Bright', 'Floral', 'Tea-like', 'Clean'],
    description: 'Optimized for light roasts and floral coffees with high acidity',
    waterTemp: 96,
    grindSize: 'Medium-Fine',
    ratio: '1:17',
    flavorProfile: 'High extraction technique emphasizing bright acidity and floral notes while maintaining clarity',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Pour 2x coffee weight in center, gentle spiral outward',
        scienceNote: 'CO2 degassing improves water penetration and even extraction'
      },
      {
        step: 2,
        time: '0:45',
        action: 'First Pour',
        technique: 'Slow spiral pour to 40% total water weight',
        scienceNote: 'Lower water temperature preserves delicate aromatics'
      },
      {
        step: 3,
        time: '1:15',
        action: 'Second Pour',
        technique: 'Center pour with gentle agitation',
        scienceNote: 'Minimal agitation prevents over-extraction of bitter compounds'
      },
      {
        step: 4,
        time: '1:45',
        action: 'Final Pour',
        technique: 'Complete to target weight, avoid disturbing bed',
        scienceNote: 'Consistent bed level ensures even extraction completion'
      }
    ],
    science: {
      extraction: '18-20% target extraction for bright, clean cup',
      agitation: 'Minimal agitation preserves floral compounds',
      temperature: '96°C optimal for light roast solubility without bitterness',
      grind: 'Medium-fine allows proper flow rate while maximizing surface area'
    },
    tips: [
      'Use paper rinsed with hot water to remove papery taste',
      'Maintain consistent pour speed throughout',
      'Target 2:30-3:00 total brew time for optimal extraction'
    ]
  },
  {
    id: 'v60-balanced',
    name: 'V60 Balanced Profile',
    method: 'V60',
    difficulty: 'Intermediate',
    brewTime: '2:45-3:15',
    targetFlavor: ['Balanced', 'Sweet', 'Complex', 'Round'],
    description: 'Versatile recipe for medium roasts emphasizing sweetness and balance',
    waterTemp: 94,
    grindSize: 'Medium',
    ratio: '1:16',
    flavorProfile: 'Balanced extraction highlighting sweetness while maintaining complexity and body',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Pour 2.5x coffee weight, stir gently once',
        scienceNote: 'Gentle stir ensures even saturation and CO2 release'
      },
      {
        step: 2,
        time: '0:30',
        action: 'Build',
        technique: 'Pour to 60% total weight in steady spiral',
        scienceNote: 'Steady pour maintains consistent extraction rate'
      },
      {
        step: 3,
        time: '1:30',
        action: 'Finish',
        technique: 'Complete pour with gentle pulses',
        scienceNote: 'Pulsed pouring extends contact time for better extraction'
      }
    ],
    science: {
      extraction: '20-22% target for balanced sweetness and complexity',
      agitation: 'Moderate agitation during bloom improves evenness',
      temperature: '94°C balances extraction efficiency with flavor preservation',
      grind: 'Medium grind provides good balance of flow rate and extraction'
    },
    tips: [
      'Adjust grind size based on flow rate',
      'Target total dissolved solids of 1.25-1.45%',
      'Use filtered water with 150-300 ppm TDS'
    ]
  },
  {
    id: 'aeropress-intense',
    name: 'AeroPress Intense',
    method: 'AeroPress',
    difficulty: 'Advanced',
    brewTime: '2:00',
    targetFlavor: ['Full-body', 'Rich', 'Syrupy', 'Intense'],
    description: 'High-extraction method for maximum flavor intensity and body',
    waterTemp: 88,
    grindSize: 'Fine',
    ratio: '1:12',
    flavorProfile: 'Maximum extraction with full body and intense flavor concentration',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Inverted Setup',
        technique: 'Fine grind, hot water, inverted method',
        scienceNote: 'Lower temperature prevents over-extraction of fine grind'
      },
      {
        step: 2,
        time: '0:10',
        action: 'Aggressive Stir',
        technique: '10 vigorous stirs to maximize extraction',
        scienceNote: 'High agitation breaks up clumps and increases extraction rate'
      },
      {
        step: 3,
        time: '1:30',
        action: 'Flip & Press',
        technique: 'Flip and press slowly over 30 seconds',
        scienceNote: 'Slow press prevents channeling and over-extraction'
      }
    ],
    science: {
      extraction: '22-24% for maximum flavor intensity',
      agitation: 'High agitation during steeping maximizes soluble extraction',
      temperature: '88°C prevents bitter extraction from fine grind',
      grind: 'Fine grind increases surface area for high extraction in short time'
    },
    tips: [
      'Use metal filter for fuller body',
      'Dilute with hot water if too intense',
      'Perfect for darker roasts and espresso-style drinks'
    ]
  },
  {
    id: 'chemex-clean',
    name: 'Chemex Ultra Clean',
    method: 'Chemex',
    difficulty: 'Beginner',
    brewTime: '4:00-5:00',
    targetFlavor: ['Clean', 'Bright', 'Tea-like', 'Delicate'],
    description: 'Emphasizes clarity and cleanliness with minimal oils and sediment',
    waterTemp: 95,
    grindSize: 'Medium-Coarse',
    ratio: '1:15',
    flavorProfile: 'Ultra-clean extraction with emphasis on clarity and bright acidity',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Even saturation, no stirring, 45-second bloom',
        scienceNote: 'Thick Chemex filter removes oils and fine particles'
      },
      {
        step: 2,
        time: '0:45',
        action: 'Slow Build',
        technique: 'Very slow spiral pour to avoid disturbing bed',
        scienceNote: 'Slow pour rate allows filter to trap more particles'
      },
      {
        step: 3,
        time: '3:00',
        action: 'Final Drip',
        technique: 'Allow complete drawdown',
        scienceNote: 'Long contact time compensates for coarser grind'
      }
    ],
    science: {
      extraction: '18-20% for clean, bright profile',
      agitation: 'Minimal agitation preserves filter bed integrity',
      temperature: '95°C provides good extraction despite coarse grind',
      grind: 'Coarse grind prevents clogging thick Chemex filter'
    },
    tips: [
      'Rinse filter thoroughly to remove paper taste',
      'Keep water level below rim to maintain flow',
      'Perfect for showcasing origin characteristics'
    ]
  }
];

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