import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Coffee, Save, RotateCcw, Star } from "lucide-react";

interface CuppingScore {
  fragrance: number;
  flavor: number;
  aftertaste: number;
  acidity: number;
  body: number;
  balance: number;
  sweetness: number;
  cleanCup: number;
  uniformity: number;
  overall: number;
}

interface CuppingSession {
  id: string;
  date: string;
  coffeeName: string;
  roaster: string;
  origin: string;
  process: string;
  roastLevel: string;
  roastDate?: string;
  cuppingProtocol: string;
  scores: CuppingScore;
  totalScore: number;
  finalRating: string;
  notes: {
    dry: string;
    crust: string;
    flavor: string;
    finish: string;
    overall: string;
  };
  defects: string[];
  recommendations: string;
}

const scoreCategories = [
  { key: 'fragrance', label: 'Fragrance/Aroma', description: 'Dry fragrance and wet aroma', weight: 1 },
  { key: 'flavor', label: 'Flavor', description: 'Primary taste impression', weight: 1 },
  { key: 'aftertaste', label: 'Aftertaste', description: 'Length and quality of finish', weight: 1 },
  { key: 'acidity', label: 'Acidity', description: 'Brightness and liveliness', weight: 1 },
  { key: 'body', label: 'Body', description: 'Tactile feeling and weight', weight: 1 },
  { key: 'balance', label: 'Balance', description: 'Harmony of flavor components', weight: 1 },
  { key: 'sweetness', label: 'Sweetness', description: 'Fullness and sweetness', weight: 1 },
  { key: 'cleanCup', label: 'Clean Cup', description: 'Lack of defects', weight: 1 },
  { key: 'uniformity', label: 'Uniformity', description: 'Consistency across cups', weight: 1 },
  { key: 'overall', label: 'Overall', description: 'Holistic impression', weight: 1 }
];

const cuppingProtocols = [
  'SCA Standard',
  'COE (Cup of Excellence)',
  'Q Grader Protocol',
  'Custom Protocol'
];

const mockSessions: CuppingSession[] = [
  {
    id: '1',
    date: '2024-01-15',
    coffeeName: 'Ethiopian Yirgacheffe',
    roaster: 'Blue Bottle Coffee',
    origin: 'Ethiopia, Yirgacheffe',
    process: 'Washed',
    roastLevel: 'Light',
    roastDate: '2024-01-10',
    cuppingProtocol: 'SCA Standard',
    totalScore: 86.5,
    finalRating: 'Excellent',
    scores: {
      fragrance: 8.5,
      flavor: 8.75,
      aftertaste: 8.5,
      acidity: 9.0,
      body: 7.5,
      balance: 8.75,
      sweetness: 8.5,
      cleanCup: 9.0,
      uniformity: 8.5,
      overall: 8.5
    },
    notes: {
      dry: 'Intense floral notes, bergamot, lemon zest',
      crust: 'Sweet florals, jasmine, bright citrus',
      flavor: 'Complex florals, lemon tea, bergamot, honey sweetness',
      finish: 'Long, clean finish with lingering florals',
      overall: 'Outstanding example of Yirgacheffe character'
    },
    defects: [],
    recommendations: 'Perfect for pour-over methods. Showcase coffee.'
  }
];

export const CuppingNotes = () => {
  const [sessions, setSessions] = useState<CuppingSession[]>(mockSessions);
  const [showForm, setShowForm] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<CuppingSession>>({
    scores: {
      fragrance: 6,
      flavor: 6,
      aftertaste: 6,
      acidity: 6,
      body: 6,
      balance: 6,
      sweetness: 6,
      cleanCup: 8,
      uniformity: 8,
      overall: 6
    },
    notes: {
      dry: '',
      crust: '',
      flavor: '',
      finish: '',
      overall: ''
    },
    defects: [],
    cuppingProtocol: 'SCA Standard'
  });

  const calculateTotalScore = (scores: CuppingScore): number => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(total * 10) / 10;
  };

  const getFinalRating = (score: number): string => {
    if (score >= 90) return 'Outstanding';
    if (score >= 85) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 75) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Below Standard';
  };

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'Outstanding': return 'bg-purple-100 text-purple-800';
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Very Good': return 'bg-blue-100 text-blue-800';
      case 'Good': return 'bg-yellow-100 text-yellow-800';
      case 'Fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const updateScore = (category: keyof CuppingScore, value: number) => {
    const newScores = { ...currentSession.scores!, [category]: value };
    setCurrentSession({
      ...currentSession,
      scores: newScores
    });
  };

  const updateNote = (category: keyof typeof currentSession.notes, value: string) => {
    setCurrentSession({
      ...currentSession,
      notes: {
        ...currentSession.notes!,
        [category]: value
      }
    });
  };

  const resetForm = () => {
    setCurrentSession({
      scores: {
        fragrance: 6,
        flavor: 6,
        aftertaste: 6,
        acidity: 6,
        body: 6,
        balance: 6,
        sweetness: 6,
        cleanCup: 8,
        uniformity: 8,
        overall: 6
      },
      notes: {
        dry: '',
        crust: '',
        flavor: '',
        finish: '',
        overall: ''
      },
      defects: [],
      cuppingProtocol: 'SCA Standard'
    });
  };

  const saveSession = () => {
    if (currentSession.coffeeName && currentSession.scores) {
      const totalScore = calculateTotalScore(currentSession.scores);
      const finalRating = getFinalRating(totalScore);
      
      const newSession: CuppingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        coffeeName: currentSession.coffeeName || '',
        roaster: currentSession.roaster || '',
        origin: currentSession.origin || '',
        process: currentSession.process || '',
        roastLevel: currentSession.roastLevel || '',
        roastDate: currentSession.roastDate,
        cuppingProtocol: currentSession.cuppingProtocol || 'SCA Standard',
        scores: currentSession.scores,
        totalScore,
        finalRating,
        notes: currentSession.notes || { dry: '', crust: '', flavor: '', finish: '', overall: '' },
        defects: currentSession.defects || [],
        recommendations: currentSession.recommendations || ''
      };
      
      setSessions([newSession, ...sessions]);
      resetForm();
      setShowForm(false);
    }
  };

  const currentTotal = currentSession.scores ? calculateTotalScore(currentSession.scores) : 0;
  const currentRating = getFinalRating(currentTotal);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Professional Cupping Notes</h1>
        <p className="text-muted-foreground text-lg">SCA-standard coffee evaluation and scoring system</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowForm(!showForm)} 
          size="lg"
          className="px-8"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Cupping Session
        </Button>
      </div>

      {/* Cupping Form */}
      {showForm && (
        <Card className="coffee-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center">
              <Trophy className="h-6 w-6 mr-2" />
              New Cupping Session
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{currentTotal}</p>
              <Badge className={getRatingColor(currentRating)}>
                {currentRating}
              </Badge>
            </div>
          </div>

          {/* Coffee Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="coffeeName">Coffee Name *</Label>
              <Input
                id="coffeeName"
                value={currentSession.coffeeName || ''}
                onChange={(e) => setCurrentSession({...currentSession, coffeeName: e.target.value})}
                placeholder="Ethiopian Yirgacheffe"
              />
            </div>
            
            <div>
              <Label htmlFor="roaster">Roaster</Label>
              <Input
                id="roaster"
                value={currentSession.roaster || ''}
                onChange={(e) => setCurrentSession({...currentSession, roaster: e.target.value})}
                placeholder="Blue Bottle Coffee"
              />
            </div>
            
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={currentSession.origin || ''}
                onChange={(e) => setCurrentSession({...currentSession, origin: e.target.value})}
                placeholder="Ethiopia, Yirgacheffe"
              />
            </div>
            
            <div>
              <Label htmlFor="process">Process</Label>
              <Select value={currentSession.process} onValueChange={(value) => setCurrentSession({...currentSession, process: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Washed">Washed</SelectItem>
                  <SelectItem value="Natural">Natural</SelectItem>
                  <SelectItem value="Honey">Honey</SelectItem>
                  <SelectItem value="Semi-Washed">Semi-Washed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="roastLevel">Roast Level</Label>
              <Select value={currentSession.roastLevel} onValueChange={(value) => setCurrentSession({...currentSession, roastLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select roast" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Light-Medium">Light-Medium</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Medium-Dark">Medium-Dark</SelectItem>
                  <SelectItem value="Dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="protocol">Cupping Protocol</Label>
              <Select value={currentSession.cuppingProtocol} onValueChange={(value) => setCurrentSession({...currentSession, cuppingProtocol: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  {cuppingProtocols.map(protocol => (
                    <SelectItem key={protocol} value={protocol}>{protocol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scoring Grid */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary mb-4">Cupping Scores (6-10 scale)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scoreCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="font-medium">{category.label}</Label>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">
                        {currentSession.scores?.[category.key as keyof CuppingScore] || 6}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[currentSession.scores?.[category.key as keyof CuppingScore] || 6]}
                    onValueChange={(value) => updateScore(category.key as keyof CuppingScore, value[0])}
                    min={6}
                    max={10}
                    step={0.25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>6.0</span>
                    <span>8.0</span>
                    <span>10.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary mb-4">Tasting Notes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dryNotes">Dry Fragrance</Label>
                <Textarea
                  id="dryNotes"
                  value={currentSession.notes?.dry || ''}
                  onChange={(e) => updateNote('dry', e.target.value)}
                  placeholder="Floral, citrus, spice notes..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="crustNotes">Crust/Wet Aroma</Label>
                <Textarea
                  id="crustNotes"
                  value={currentSession.notes?.crust || ''}
                  onChange={(e) => updateNote('crust', e.target.value)}
                  placeholder="Aromatics after breaking crust..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="flavorNotes">Flavor</Label>
                <Textarea
                  id="flavorNotes"
                  value={currentSession.notes?.flavor || ''}
                  onChange={(e) => updateNote('flavor', e.target.value)}
                  placeholder="Primary taste impressions..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="finishNotes">Finish/Aftertaste</Label>
                <Textarea
                  id="finishNotes"
                  value={currentSession.notes?.finish || ''}
                  onChange={(e) => updateNote('finish', e.target.value)}
                  placeholder="Lingering flavors and length..."
                  rows={2}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="overallNotes">Overall Impression</Label>
              <Textarea
                id="overallNotes"
                value={currentSession.notes?.overall || ''}
                onChange={(e) => updateNote('overall', e.target.value)}
                placeholder="Holistic assessment and standout characteristics..."
                rows={3}
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <Label htmlFor="recommendations">Brewing Recommendations</Label>
            <Textarea
              id="recommendations"
              value={currentSession.recommendations || ''}
              onChange={(e) => setCurrentSession({...currentSession, recommendations: e.target.value})}
              placeholder="Suggested brewing methods, ratios, and serving recommendations..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button onClick={saveSession} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Cupping Session
            </Button>
            <Button variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Previous Sessions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-primary">Cupping History</h3>
        
        {sessions.map((session) => (
          <Card key={session.id} className="coffee-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-primary flex items-center">
                  <Coffee className="h-5 w-5 mr-2" />
                  {session.coffeeName}
                </h4>
                <p className="text-muted-foreground">{session.roaster} • {session.origin}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(session.date).toLocaleDateString()} • {session.cuppingProtocol}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{session.totalScore}</p>
                <Badge className={getRatingColor(session.finalRating)}>
                  {session.finalRating}
                </Badge>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 text-sm">
              {scoreCategories.slice(0, 5).map((category) => (
                <div key={category.key} className="text-center">
                  <p className="text-xs text-muted-foreground">{category.label}</p>
                  <p className="font-semibold">{session.scores[category.key as keyof CuppingScore]}</p>
                </div>
              ))}
            </div>

            {/* Notes Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-primary mb-1">Flavor Profile</h5>
                <p className="text-sm text-muted-foreground italic">"{session.notes.flavor}"</p>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-1">Overall</h5>
                <p className="text-sm text-muted-foreground italic">"{session.notes.overall}"</p>
              </div>
            </div>

            {session.recommendations && (
              <div className="mt-4 p-3 bg-secondary rounded-lg">
                <h5 className="font-medium text-primary mb-1">Recommendations</h5>
                <p className="text-sm">{session.recommendations}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No cupping sessions yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start your first professional coffee evaluation!
          </p>
        </div>
      )}
    </div>
  );
};