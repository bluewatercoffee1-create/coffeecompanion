import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Timer, Droplets, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BrewStep {
  time: number;
  action: string;
  waterAmount?: number;
  temperature?: number;
  technique?: string;
}

interface BrewMethod {
  name: string;
  defaultRatio: number;
  defaultGrams: number;
  baseSteps: BrewStep[];
  flavorProfile: string;
  difficulty: string;
}

const brewMethods: Record<string, BrewMethod> = {
  v60: {
    name: "Hario V60",
    defaultRatio: 16.7,
    defaultGrams: 22,
    flavorProfile: "Bright, Clean, Complex",
    difficulty: "Intermediate",
    baseSteps: [
      { time: 0, action: "Bloom", waterAmount: 0.15, temperature: 96, technique: "Gentle spiral pour from center" },
      { time: 30, action: "First Pour", waterAmount: 0.3, temperature: 94, technique: "Slow spiral, maintain bed level" },
      { time: 60, action: "Second Pour", waterAmount: 0.25, temperature: 92, technique: "Center pour, avoid walls" },
      { time: 90, action: "Final Pour", waterAmount: 0.3, temperature: 90, technique: "Gentle finish pour" },
      { time: 120, action: "Drawdown", technique: "Let drip finish, target 2:30-3:00 total" }
    ]
  },
  chemex: {
    name: "Chemex",
    defaultRatio: 15,
    defaultGrams: 30,
    flavorProfile: "Clean, Bright, Tea-like",
    difficulty: "Beginner",
    baseSteps: [
      { time: 0, action: "Bloom", waterAmount: 0.2, temperature: 96, technique: "Even saturation, 45s bloom" },
      { time: 45, action: "First Pour", waterAmount: 0.4, temperature: 94, technique: "Slow spiral outward" },
      { time: 105, action: "Second Pour", waterAmount: 0.4, temperature: 92, technique: "Maintain water level" },
      { time: 165, action: "Drawdown", technique: "Total brew time 4-5 minutes" }
    ]
  },
  aeropress: {
    name: "AeroPress",
    defaultRatio: 14,
    defaultGrams: 18,
    flavorProfile: "Full-bodied, Clean, Versatile",
    difficulty: "Beginner",
    baseSteps: [
      { time: 0, action: "Add Coffee & Water", temperature: 85, technique: "Inverted method, all water at once" },
      { time: 10, action: "Stir", technique: "3 gentle stirs with paddle" },
      { time: 60, action: "Flip & Press", technique: "Steady 30-second press" },
      { time: 90, action: "Complete", technique: "Stop at hiss, dilute if needed" }
    ]
  },
  espresso: {
    name: "Espresso",
    defaultRatio: 2,
    defaultGrams: 18,
    flavorProfile: "Intense, Concentrated, Syrupy",
    difficulty: "Expert",
    baseSteps: [
      { time: 0, action: "Pre-infusion", temperature: 93, technique: "3-bar pressure, 2-4 seconds" },
      { time: 4, action: "Extraction", temperature: 93, technique: "9-bar pressure, watch flow" },
      { time: 25, action: "Complete", technique: "Target 25-30 seconds total" }
    ]
  }
};

export const BrewTimer = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('v60');
  const [selectedGuide, setSelectedGuide] = useState<string>('');
  const [coffeeGrams, setCoffeeGrams] = useState<number>(22);
  const [customRatio, setCustomRatio] = useState<number>(16.7);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scaledSteps, setScaledSteps] = useState<BrewStep[]>([]);
  const { toast } = useToast();

  const method = brewMethods[selectedMethod];
  const currentRatio = customRatio;
  const totalWater = Math.round(coffeeGrams * currentRatio);

  useEffect(() => {
    // Scale recipe based on coffee grams and update ratio when method changes
    setCustomRatio(method.defaultRatio);
  }, [selectedMethod, method]);

  useEffect(() => {
    // Scale recipe based on coffee grams
    const ratio = coffeeGrams / method.defaultGrams;
    const scaled = method.baseSteps.map(step => ({
      ...step,
      waterAmount: step.waterAmount ? Math.round(step.waterAmount * totalWater) : undefined
    }));
    setScaledSteps(scaled);
    setCurrentStepIndex(0);
    setCurrentTime(0);
  }, [selectedMethod, coffeeGrams, method, totalWater, customRatio]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Check for next step
          const nextStepIndex = scaledSteps.findIndex((step, index) => 
            index > currentStepIndex && step.time === newTime
          );
          
          if (nextStepIndex !== -1) {
            setCurrentStepIndex(nextStepIndex);
            toast({
              title: `Step ${nextStepIndex + 1}: ${scaledSteps[nextStepIndex].action}`,
              description: scaledSteps[nextStepIndex].technique || `Time: ${formatTime(newTime)}`,
            });
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, scaledSteps, currentStepIndex, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentStepIndex(0);
  };

  const currentStep = scaledSteps[currentStepIndex];
  const nextStep = scaledSteps[currentStepIndex + 1];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Advanced Brew Timer</h1>
        <p className="text-muted-foreground text-lg">Precision timing with gram-based recipe scaling</p>
      </div>

      {/* Method & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="coffee-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Brew Settings</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="method">Brewing Method</Label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(brewMethods).map(([key, method]) => (
                    <SelectItem key={key} value={key}>{method.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="grams">Coffee Amount (grams)</Label>
              <Input
                id="grams"
                type="number"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ratio">Water Ratio (1:X)</Label>
              <Input
                id="ratio"
                type="number"
                step="0.1"
                value={customRatio}
                onChange={(e) => setCustomRatio(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="coffee-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Recipe Info</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{method.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coffee:</span>
              <span className="font-medium">{coffeeGrams}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Water:</span>
              <span className="font-medium">{totalWater}ml</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ratio:</span>
              <span className="font-medium">1:{currentRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profile:</span>
              <span className="font-medium text-sm">{method.flavorProfile}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Timer Display */}
      <Card className="coffee-card p-8 text-center">
        <div className="space-y-6">
          <div className="text-8xl font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={toggleTimer}
              size="lg"
              className="px-8"
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            
            <Button onClick={resetTimer} size="lg" variant="outline" className="px-8">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Current Step */}
      {currentStep && (
        <Card className="coffee-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Timer className="mr-2 h-5 w-5" />
              Step {currentStepIndex + 1}: {currentStep.action}
            </h3>
            <div className="text-sm text-muted-foreground">
              {formatTime(currentStep.time)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStep.waterAmount && (
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  <strong>{currentStep.waterAmount}ml</strong> water
                </span>
              </div>
            )}
            
            {currentStep.temperature && (
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  <strong>{currentStep.temperature}°C</strong>
                </span>
              </div>
            )}
          </div>
          
          {currentStep.technique && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="text-sm font-medium">{currentStep.technique}</p>
            </div>
          )}
        </Card>
      )}

      {/* Next Step Preview */}
      {nextStep && (
        <Card className="coffee-card p-4 border-dashed">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm">
              Next: {nextStep.action} at {formatTime(nextStep.time)}
            </span>
          </div>
        </Card>
      )}

      {/* All Steps Overview */}
      <Card className="coffee-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Brewing Steps</h3>
        
        <div className="space-y-3">
          {scaledSteps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                index === currentStepIndex 
                  ? 'bg-primary/10 border border-primary/20' 
                  : index < currentStepIndex 
                    ? 'bg-secondary/50' 
                    : 'bg-secondary/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  index === currentStepIndex 
                    ? 'bg-primary' 
                    : index < currentStepIndex 
                      ? 'bg-primary/50' 
                      : 'bg-muted-foreground/30'
                }`} />
                <span className="font-medium">{step.action}</span>
                {step.waterAmount && (
                  <span className="text-sm text-muted-foreground">
                    {step.waterAmount}ml
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatTime(step.time)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};