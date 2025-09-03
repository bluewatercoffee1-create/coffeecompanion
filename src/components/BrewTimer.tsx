import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Clock, Droplets, Target, Scale, ChevronLeft, Coffee } from "lucide-react";
import { getGuidesByMethod, getAllMethods, BrewingGuide } from "@/data/brewingGuides";

export const BrewTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [brewMethod, setBrewMethod] = useState<string>('');
  const [selectedGuide, setSelectedGuide] = useState<BrewingGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [customRatio, setCustomRatio] = useState('1:16');
  const [coffeeAmount, setCoffeeAmount] = useState(25);
  const [showMethodSelection, setShowMethodSelection] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeRatio = selectedGuide?.ratio || customRatio;
  const waterAmount = Math.round(coffeeAmount * parseFloat(activeRatio.split(':')[1]));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isRunning && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const selectMethod = (method: string) => {
    setBrewMethod(method);
    setShowMethodSelection(false);
    setSelectedGuide(null);
  };

  const selectGuide = (guide: BrewingGuide) => {
    setSelectedGuide(guide);
    setCustomRatio(guide.ratio);
    reset();
  };

  const backToMethodSelection = () => {
    setShowMethodSelection(true);
    setBrewMethod('');
    setSelectedGuide(null);
    reset();
  };

  const backToGuideSelection = () => {
    setSelectedGuide(null);
    reset();
  };

  // Auto-advance steps based on time
  useEffect(() => {
    if (selectedGuide && isRunning && time > 0) {
      // Calculate cumulative time for each step
      let cumulativeTime = 0;
      for (let i = 0; i <= currentStep; i++) {
        const step = selectedGuide.steps[i];
        if (step) {
          const [minutes, seconds] = step.time.split(':').map(Number);
          cumulativeTime += minutes * 60 + seconds;
        }
      }
      
      // Check if we should advance to the next step
      if (time >= cumulativeTime && currentStep < selectedGuide.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [time, selectedGuide, currentStep, isRunning]);

  if (showMethodSelection) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Brew Timer</h1>
          <p className="text-muted-foreground text-lg">Choose your brewing method to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllMethods().map((method) => (
            <Card 
              key={method}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => selectMethod(method)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Coffee className="h-12 w-12 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-primary">{method}</h3>
                <p className="text-muted-foreground mt-2">
                  {getGuidesByMethod(method).length} brewing guides available
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedGuide) {
    const methodGuides = getGuidesByMethod(brewMethod);
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={backToMethodSelection} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Methods
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2 text-primary">{brewMethod} Brewing Guides</h1>
            <p className="text-muted-foreground text-lg">Select a specific brewing guide to follow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodGuides.map((guide) => (
            <Card 
              key={guide.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => selectGuide(guide)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-primary">{guide.name}</h3>
                  <Badge variant={
                    guide.difficulty === 'Beginner' ? 'default' :
                    guide.difficulty === 'Intermediate' ? 'secondary' :
                    guide.difficulty === 'Advanced' ? 'outline' : 'destructive'
                  }>
                    {guide.difficulty}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{guide.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{guide.brewTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span>{guide.ratio}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4">
                  {guide.targetFlavor.slice(0, 3).map(flavor => (
                    <Badge key={flavor} variant="secondary" className="text-xs">
                      {flavor}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={backToGuideSelection} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Guides
        </Button>
        <div>
          <h1 className="text-4xl font-bold mb-2 text-primary">{selectedGuide.name}</h1>
          <p className="text-muted-foreground text-lg">Follow the step-by-step guide</p>
        </div>
      </div>

      {/* Recipe Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{selectedGuide.waterTemp}°C</div>
          <div className="text-sm text-muted-foreground">Water Temp</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{activeRatio}</div>
          <div className="text-sm text-muted-foreground">Ratio</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{coffeeAmount}g</div>
          <div className="text-sm text-muted-foreground">Coffee</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{waterAmount}g</div>
          <div className="text-sm text-muted-foreground">Water</div>
        </Card>
      </div>

      {/* Ratio Adjustment */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coffee-amount">Coffee Amount (g)</Label>
              <Input
                id="coffee-amount"
                type="number"
                value={coffeeAmount}
                onChange={(e) => setCoffeeAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="ratio">Custom Ratio (optional)</Label>
              <Input
                id="ratio"
                value={customRatio}
                onChange={(e) => setCustomRatio(e.target.value)}
                placeholder={selectedGuide.ratio}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Clock className="mr-2 h-5 w-5" />
            Timer & Current Step
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-mono font-bold text-primary mb-6">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button onClick={toggleTimer} size="lg">
              {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={reset} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Current Step Display */}
          {selectedGuide.steps[currentStep] && (
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary">
                  Step {selectedGuide.steps[currentStep].step}: {selectedGuide.steps[currentStep].action}
                </h3>
                <Badge variant="outline">{selectedGuide.steps[currentStep].time}</Badge>
              </div>
              <p className="text-lg mb-3">{selectedGuide.steps[currentStep].technique}</p>
              {selectedGuide.steps[currentStep].scienceNote && (
                <p className="text-sm text-muted-foreground italic">
                  💡 {selectedGuide.steps[currentStep].scienceNote}
                </p>
              )}
            </div>
          )}

          {/* Step Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {selectedGuide.steps.length}</span>
              <span>{Math.round(((currentStep + 1) / selectedGuide.steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentStep + 1) / selectedGuide.steps.length) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Brewing Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Droplets className="mr-2 h-5 w-5" />
            All Brewing Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedGuide.steps.map((step, index) => (
              <div 
                key={step.step} 
                className={`p-4 rounded-lg border transition-all ${
                  index === currentStep 
                    ? 'border-primary bg-primary/5' 
                    : index < currentStep 
                    ? 'border-green-200 bg-green-50 opacity-60' 
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${index === currentStep ? 'text-primary' : 'text-foreground'}`}>
                    Step {step.step}: {step.action}
                  </h4>
                  <span className="text-sm text-muted-foreground">{step.time}</span>
                </div>
                <p className="text-sm">{step.technique}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};