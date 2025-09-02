import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Coffee, Droplets, Scale, Target } from "lucide-react";

interface PresetRatio {
  name: string;
  ratio: number;
  description: string;
  methods: string[];
  strength: string;
}

const presetRatios: PresetRatio[] = [
  {
    name: "Light & Bright", 
    ratio: 18,
    description: "Perfect for light roasts and floral coffees",
    methods: ["V60", "Chemex", "Kalita Wave"],
    strength: "Light"
  },
  {
    name: "Balanced Standard",
    ratio: 16,
    description: "Universal ratio for most brewing methods",
    methods: ["V60", "Chemex", "Pour Over"],
    strength: "Medium"
  },
  {
    name: "Rich & Full",
    ratio: 14,
    description: "Stronger brew for darker roasts",
    methods: ["AeroPress", "French Press"],
    strength: "Strong"
  },
  {
    name: "Concentrated",
    ratio: 12,
    description: "Bold and intense flavors",
    methods: ["AeroPress", "Espresso Lungo"],
    strength: "Very Strong"
  },
  {
    name: "Cold Brew",
    ratio: 7,
    description: "Cold brew concentrate",
    methods: ["Cold Brew", "Japanese Iced"],
    strength: "Concentrate"
  },
  {
    name: "Espresso",
    ratio: 2,
    description: "Traditional espresso ratio",
    methods: ["Espresso"],
    strength: "Espresso"
  }
];

export const RatioCalculator = () => {
  const [coffeeAmount, setCoffeeAmount] = useState<number>(25);
  const [waterAmount, setWaterAmount] = useState<number>(400);
  const [ratio, setRatio] = useState<number>(16);
  const [calculationMode, setCalculationMode] = useState<'coffee' | 'water' | 'ratio'>('coffee');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const calculateFromCoffee = (coffee: number) => {
    const water = Math.round(coffee * ratio);
    setWaterAmount(water);
  };

  const calculateFromWater = (water: number) => {
    const coffee = Math.round(water / ratio);
    setCoffeeAmount(coffee);
  };

  const calculateFromRatio = (newRatio: number) => {
    if (calculationMode === 'coffee') {
      const water = Math.round(coffeeAmount * newRatio);
      setWaterAmount(water);
    } else {
      const coffee = Math.round(waterAmount / newRatio);
      setCoffeeAmount(coffee);
    }
  };

  const handleCoffeeChange = (value: number) => {
    setCoffeeAmount(value);
    if (calculationMode === 'coffee') {
      calculateFromCoffee(value);
    } else {
      const newRatio = parseFloat((waterAmount / value).toFixed(1));
      setRatio(newRatio);
    }
  };

  const handleWaterChange = (value: number) => {
    setWaterAmount(value);
    if (calculationMode === 'water') {
      calculateFromWater(value);
    } else {
      const newRatio = parseFloat((value / coffeeAmount).toFixed(1));
      setRatio(newRatio);
    }
  };

  const handleRatioChange = (value: number) => {
    setRatio(value);
    calculateFromRatio(value);
  };

  const applyPreset = (presetName: string) => {
    const preset = presetRatios.find(p => p.name === presetName);
    if (preset) {
      setRatio(preset.ratio);
      calculateFromRatio(preset.ratio);
      setSelectedPreset(presetName);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Light': return 'text-yellow-600';
      case 'Medium': return 'text-orange-600';
      case 'Strong': return 'text-red-600';
      case 'Very Strong': return 'text-red-800';
      case 'Concentrate': return 'text-purple-600';
      case 'Espresso': return 'text-coffee-bean';
      default: return 'text-muted-foreground';
    }
  };

  const currentPreset = presetRatios.find(p => Math.abs(p.ratio - ratio) < 0.5);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Ratio Calculator</h1>
        <p className="text-muted-foreground text-lg">Perfect coffee-to-water ratios for every brewing method</p>
      </div>

      {/* Calculation Mode */}
      <Card className="coffee-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Calculation Mode</h3>
        <div className="flex space-x-2">
          <Button
            variant={calculationMode === 'coffee' ? 'default' : 'outline'}
            onClick={() => setCalculationMode('coffee')}
          >
            <Coffee className="h-4 w-4 mr-2" />
            From Coffee
          </Button>
          <Button
            variant={calculationMode === 'water' ? 'default' : 'outline'}
            onClick={() => setCalculationMode('water')}
          >
            <Droplets className="h-4 w-4 mr-2" />
            From Water
          </Button>
          <Button
            variant={calculationMode === 'ratio' ? 'default' : 'outline'}
            onClick={() => setCalculationMode('ratio')}
          >
            <Scale className="h-4 w-4 mr-2" />
            From Ratio
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {calculationMode === 'coffee' && "Enter coffee amount, calculate water needed"}
          {calculationMode === 'water' && "Enter water amount, calculate coffee needed"}
          {calculationMode === 'ratio' && "Enter ratio, maintain proportions"}
        </p>
      </Card>

      {/* Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="coffee-card p-6">
          <div className="text-center">
            <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
            <Label htmlFor="coffee" className="text-lg font-semibold">Coffee</Label>
            <Input
              id="coffee"
              type="number"
              value={coffeeAmount}
              onChange={(e) => handleCoffeeChange(Number(e.target.value))}
              className="text-center text-2xl font-bold mt-2 mb-2"
            />
            <p className="text-sm text-muted-foreground">grams</p>
          </div>
        </Card>

        <Card className="coffee-card p-6">
          <div className="text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <Label htmlFor="ratio" className="text-lg font-semibold">Ratio</Label>
            <Input
              id="ratio"
              type="number"
              step="0.1"
              value={ratio}
              onChange={(e) => handleRatioChange(Number(e.target.value))}
              className="text-center text-2xl font-bold mt-2 mb-2"
            />
            <p className="text-sm text-muted-foreground">1 : {ratio} (coffee : water)</p>
          </div>
        </Card>

        <Card className="coffee-card p-6">
          <div className="text-center">
            <Droplets className="h-12 w-12 text-primary mx-auto mb-4" />
            <Label htmlFor="water" className="text-lg font-semibold">Water</Label>
            <Input
              id="water"
              type="number"
              value={waterAmount}
              onChange={(e) => handleWaterChange(Number(e.target.value))}
              className="text-center text-2xl font-bold mt-2 mb-2"
            />
            <p className="text-sm text-muted-foreground">ml / grams</p>
          </div>
        </Card>
      </div>

      {/* Current Recipe Info */}
      <Card className="coffee-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Current Recipe
          </h3>
          {currentPreset && (
            <div className="text-right">
              <p className="font-medium">{currentPreset.name}</p>
              <p className={`text-sm ${getStrengthColor(currentPreset.strength)}`}>
                {currentPreset.strength}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{coffeeAmount}g</p>
            <p className="text-sm text-muted-foreground">Coffee</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{waterAmount}ml</p>
            <p className="text-sm text-muted-foreground">Water</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">1:{ratio}</p>
            <p className="text-sm text-muted-foreground">Ratio</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{Math.round((coffeeAmount / (coffeeAmount + waterAmount)) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Coffee %</p>
          </div>
        </div>
        
        {currentPreset && (
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm font-medium mb-2">{currentPreset.description}</p>
            <p className="text-sm text-muted-foreground">
              Recommended for: {currentPreset.methods.join(', ')}
            </p>
          </div>
        )}
      </Card>

      {/* Preset Ratios */}
      <Card className="coffee-card p-6">
        <h3 className="text-xl font-semibold mb-6 text-primary">Preset Ratios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presetRatios.map((preset) => (
            <Card 
              key={preset.name}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                selectedPreset === preset.name 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => applyPreset(preset.name)}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-primary">{preset.name}</h4>
                <span className={`text-sm font-medium ${getStrengthColor(preset.strength)}`}>
                  {preset.strength}
                </span>
              </div>
              
              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-primary">1:{preset.ratio}</p>
                <p className="text-sm text-muted-foreground">ratio</p>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{preset.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {preset.methods.map(method => (
                  <span 
                    key={method}
                    className="text-xs bg-secondary px-2 py-1 rounded-full"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Ratio Comparison */}
      <Card className="coffee-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Ratio Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Ratio</th>
                <th className="text-center py-2">25g Coffee</th>
                <th className="text-center py-2">30g Coffee</th>
                <th className="text-center py-2">Strength</th>
                <th className="text-left py-2">Best For</th>
              </tr>
            </thead>
            <tbody>
              {presetRatios.map((preset) => (
                <tr key={preset.name} className="border-b hover:bg-secondary/30">
                  <td className="py-2 font-medium">1:{preset.ratio}</td>
                  <td className="py-2 text-center">{Math.round(25 * preset.ratio)}ml</td>
                  <td className="py-2 text-center">{Math.round(30 * preset.ratio)}ml</td>
                  <td className={`py-2 text-center ${getStrengthColor(preset.strength)}`}>
                    {preset.strength}
                  </td>
                  <td className="py-2 text-sm text-muted-foreground">
                    {preset.methods.slice(0, 2).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};