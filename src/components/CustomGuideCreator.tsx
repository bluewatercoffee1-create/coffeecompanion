import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Share2 } from 'lucide-react';
import { useCommunityGuides } from '@/hooks/useCommunityGuides';
import { useAuth } from '@/hooks/useAuth';

interface Step {
  step: number;
  instruction: string;
  duration: string;
}

interface CustomGuideCreatorProps {
  onGuideCreated: () => void;
  onCancel: () => void;
}

export const CustomGuideCreator = ({ onGuideCreated, onCancel }: CustomGuideCreatorProps) => {
  const { createGuide } = useCommunityGuides();
  const { user } = useAuth();

  const [newGuide, setNewGuide] = useState({
    name: '',
    method: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    description: '',
    ratio: '1:16',
    grindSize: 'Medium',
    waterTemp: 200,
    brewTime: '3:00',
    targetFlavor: '',
    flavorProfile: [] as string[],
    steps: [{ step: 1, instruction: '', duration: '0:30' }] as Step[],
    tips: [''] as string[],
    science: '',
    shareWithCommunity: false
  });

  const addStep = () => {
    const newStep = {
      step: newGuide.steps.length + 1,
      instruction: '',
      duration: '0:30'
    };
    setNewGuide({
      ...newGuide,
      steps: [...newGuide.steps, newStep]
    });
  };

  const removeStep = (index: number) => {
    if (newGuide.steps.length <= 1) return;
    
    const updatedSteps = newGuide.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, step: i + 1 }));
    
    setNewGuide({
      ...newGuide,
      steps: updatedSteps
    });
  };

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const updatedSteps = newGuide.steps.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    );
    setNewGuide({
      ...newGuide,
      steps: updatedSteps
    });
  };

  const updateTip = (index: number, value: string) => {
    const updatedTips = newGuide.tips.map((tip, i) => 
      i === index ? value : tip
    );
    setNewGuide({
      ...newGuide,
      tips: updatedTips
    });
  };

  const addTip = () => {
    setNewGuide({
      ...newGuide,
      tips: [...newGuide.tips, '']
    });
  };

  const removeTip = (index: number) => {
    if (newGuide.tips.length <= 1) return;
    
    const updatedTips = newGuide.tips.filter((_, i) => i !== index);
    setNewGuide({
      ...newGuide,
      tips: updatedTips
    });
  };

  const addFlavorProfile = (flavor: string) => {
    if (flavor && !newGuide.flavorProfile.includes(flavor)) {
      setNewGuide({
        ...newGuide,
        flavorProfile: [...newGuide.flavorProfile, flavor]
      });
    }
  };

  const removeFlavorProfile = (flavor: string) => {
    setNewGuide({
      ...newGuide,
      flavorProfile: newGuide.flavorProfile.filter(f => f !== flavor)
    });
  };

  const createCustomGuide = async () => {
    if (user && newGuide.shareWithCommunity) {
      const guideData = {
        name: newGuide.name,
        method: newGuide.method,
        difficulty: newGuide.difficulty,
        brew_time: newGuide.brewTime,
        target_flavor: newGuide.targetFlavor,
        description: newGuide.description,
        water_temp: newGuide.waterTemp,
        grind_size: newGuide.grindSize,
        ratio: newGuide.ratio,
        steps: newGuide.steps.map(step => ({
          step: step.step,
          instruction: step.instruction,
          duration: step.duration
        })),
        science: newGuide.science,
        flavor_profile: newGuide.flavorProfile,
        tips: newGuide.tips.filter(t => t.trim() !== ''),
        is_public: true
      };
      
      await createGuide(guideData);
    }
    
    onGuideCreated();
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Guide Name</Label>
          <Input
            id="name"
            value={newGuide.name}
            onChange={(e) => setNewGuide({...newGuide, name: e.target.value})}
            placeholder="My Custom Guide"
          />
        </div>
        <div>
          <Label htmlFor="method">Brewing Method</Label>
          <Input
            id="method"
            value={newGuide.method}
            onChange={(e) => setNewGuide({...newGuide, method: e.target.value})}
            placeholder="V60, AeroPress, etc."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newGuide.description}
          onChange={(e) => setNewGuide({...newGuide, description: e.target.value})}
          placeholder="Describe your brewing guide..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select 
            value={newGuide.difficulty} 
            onValueChange={(value) => setNewGuide({...newGuide, difficulty: value as any})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="grindSize">Grind Size</Label>
          <Input
            id="grindSize"
            value={newGuide.grindSize}
            onChange={(e) => setNewGuide({...newGuide, grindSize: e.target.value})}
            placeholder="Medium, Fine, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ratio">Coffee Ratio</Label>
          <Input
            id="ratio"
            value={newGuide.ratio}
            onChange={(e) => setNewGuide({...newGuide, ratio: e.target.value})}
            placeholder="1:16"
          />
        </div>
        <div>
          <Label htmlFor="waterTemp">Water Temperature (°C)</Label>
          <Input
            id="waterTemp"
            type="number"
            value={newGuide.waterTemp}
            onChange={(e) => setNewGuide({...newGuide, waterTemp: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="brewTime">Total Brew Time</Label>
          <Input
            id="brewTime"
            value={newGuide.brewTime}
            onChange={(e) => setNewGuide({...newGuide, brewTime: e.target.value})}
            placeholder="3:00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="targetFlavor">Target Flavor</Label>
        <Input
          id="targetFlavor"
          value={newGuide.targetFlavor}
          onChange={(e) => setNewGuide({...newGuide, targetFlavor: e.target.value})}
          placeholder="Bright, fruity, balanced..."
        />
      </div>

      {/* Brewing Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-semibold">Brewing Steps</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </Button>
        </div>
        
        <div className="space-y-3">
          {newGuide.steps.map((step, index) => (
            <Card key={index} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                    {step.step}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                        <Input
                          value={step.instruction}
                          onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                          placeholder="Step instruction..."
                        />
                      </div>
                      <div>
                        <Input
                          value={step.duration}
                          onChange={(e) => updateStep(index, 'duration', e.target.value)}
                          placeholder="0:30"
                        />
                      </div>
                    </div>
                  </div>
                  {newGuide.steps.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-semibold">Pro Tips</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTip}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tip
          </Button>
        </div>
        
        <div className="space-y-2">
          {newGuide.tips.map((tip, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={tip}
                onChange={(e) => updateTip(index, e.target.value)}
                placeholder="Enter a helpful tip..."
              />
              {newGuide.tips.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTip(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="science">Science Notes (Optional)</Label>
        <Textarea
          id="science"
          value={newGuide.science}
          onChange={(e) => setNewGuide({...newGuide, science: e.target.value})}
          placeholder="Explain the science behind your brewing method..."
        />
      </div>

      {/* Share with Community Option */}
      {user && (
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="share-toggle" className="text-base font-medium flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share with Community
            </Label>
            <p className="text-sm text-muted-foreground">
              Make this guide public so other coffee enthusiasts can discover it
            </p>
          </div>
          <Switch
            id="share-toggle"
            checked={newGuide.shareWithCommunity}
            onCheckedChange={(checked) => setNewGuide({ ...newGuide, shareWithCommunity: checked })}
          />
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={createCustomGuide} disabled={!newGuide.name || !newGuide.method}>
          Create Guide
        </Button>
      </div>
    </div>
  );
};