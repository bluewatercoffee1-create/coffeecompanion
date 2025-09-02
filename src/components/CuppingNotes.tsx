import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, FlaskConical, TrendingUp, Award, Loader2 } from "lucide-react";
import { useCuppingSessions, CuppingSessionInput } from "@/hooks/useCuppingData";

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

const scoreCategories = [
  { key: 'fragrance', label: 'Fragrance/Aroma', description: 'Dry fragrance and wet aroma', weight: 1 },
  { key: 'flavor', label: 'Flavor', description: 'Primary taste impression', weight: 1 },
  { key: 'aftertaste', label: 'Aftertaste', description: 'Length and quality of finish', weight: 1 },
  { key: 'acidity', label: 'Acidity', description: 'Brightness and liveliness', weight: 1 },
  { key: 'body', label: 'Body', description: 'Tactile feeling and weight', weight: 1 },
  { key: 'balance', label: 'Balance', description: 'Harmony of flavor components', weight: 1 },
  { key: 'sweetness', label: 'Sweetness', description: 'Fullness and sweetness', weight: 1 },
  { key: 'clean_cup', label: 'Clean Cup', description: 'Lack of defects', weight: 1 },
  { key: 'uniformity', label: 'Uniformity', description: 'Consistency across cups', weight: 1 },
  { key: 'overall', label: 'Overall', description: 'Holistic impression', weight: 1 }
];

const cuppingProtocols = [
  'SCA Standard',
  'COE (Cup of Excellence)',
  'Q Grader Protocol',
  'Custom Protocol'
];

const CuppingNotes = () => {
  const { sessions, isLoading, addSession } = useCuppingSessions();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentSession, setCurrentSession] = useState<Omit<CuppingSessionInput, 'total_score' | 'final_rating'>>({
    coffee_name: '',
    roaster: '',
    origin: '',
    process: '',
    roast_level: '',
    roast_date: '',
    cupping_protocol: 'SCA Standard',
    fragrance: 6.0,
    flavor: 6.0,
    aftertaste: 6.0,
    acidity: 6.0,
    body: 6.0,
    balance: 6.0,
    sweetness: 6.0,
    clean_cup: 6.0,
    uniformity: 6.0,
    overall: 6.0,
    notes_dry: '',
    notes_crust: '',
    notes_flavor: '',
    notes_finish: '',
    notes_overall: '',
    defects: [],
    recommendations: ''
  });

  const calculateTotalScore = (): number => {
    return currentSession.fragrance + currentSession.flavor + currentSession.aftertaste + 
           currentSession.acidity + currentSession.body + currentSession.balance + 
           currentSession.sweetness + currentSession.clean_cup + currentSession.uniformity + 
           currentSession.overall;
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
      case 'Outstanding': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Very Good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Good': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Fair': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const updateScore = (category: keyof Pick<CuppingSessionInput, 'fragrance' | 'flavor' | 'aftertaste' | 'acidity' | 'body' | 'balance' | 'sweetness' | 'clean_cup' | 'uniformity' | 'overall'>, value: number) => {
    setCurrentSession(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const updateNote = (category: keyof Pick<CuppingSessionInput, 'notes_dry' | 'notes_crust' | 'notes_flavor' | 'notes_finish' | 'notes_overall'>, value: string) => {
    setCurrentSession(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const resetForm = () => {
    setCurrentSession({
      coffee_name: '',
      roaster: '',
      origin: '',
      process: '',
      roast_level: '',
      roast_date: '',
      cupping_protocol: 'SCA Standard',
      fragrance: 6.0,
      flavor: 6.0,
      aftertaste: 6.0,
      acidity: 6.0,
      body: 6.0,
      balance: 6.0,
      sweetness: 6.0,
      clean_cup: 6.0,
      uniformity: 6.0,
      overall: 6.0,
      notes_dry: '',
      notes_crust: '',
      notes_flavor: '',
      notes_finish: '',
      notes_overall: '',
      defects: [],
      recommendations: ''
    });
  };

  const saveSession = async () => {
    setIsSubmitting(true);
    try {
      const totalScore = calculateTotalScore();
      const finalRating = getFinalRating(totalScore);
      
      const session: CuppingSessionInput = {
        ...currentSession,
        total_score: totalScore,
        final_rating: finalRating
      };
      
      await addSession(session);
      resetForm();
      setShowForm(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Professional Cupping Notes</h1>
        <p className="text-muted-foreground text-lg">SCA-standard coffee evaluation and scoring system</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <Button onClick={() => setShowForm(!showForm)} size="lg" className="px-8">
          <Plus className="h-5 w-5 mr-2" />
          New Cupping Session
        </Button>
      </div>

      {/* Cupping Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center">
              <FlaskConical className="h-6 w-6 mr-2" />
              New Cupping Session
            </h3>
            <div className="text-right">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {calculateTotalScore().toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Total Score</div>
                <Badge variant="secondary" className="mt-2">
                  {getFinalRating(calculateTotalScore())}
                </Badge>
              </div>
            </div>
          </div>

          {/* Coffee Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="coffeeName">Coffee Name *</Label>
              <Input
                id="coffeeName"
                value={currentSession.coffee_name}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, coffee_name: e.target.value }))}
                placeholder="e.g., Ethiopian Yirgacheffe"
              />
            </div>
            
            <div>
              <Label htmlFor="roaster">Roaster</Label>
              <Input
                id="roaster"
                value={currentSession.roaster}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, roaster: e.target.value }))}
                placeholder="Blue Bottle Coffee"
              />
            </div>
            
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={currentSession.origin}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, origin: e.target.value }))}
                placeholder="Ethiopia, Yirgacheffe"
              />
            </div>
            
            <div>
              <Label htmlFor="process">Process</Label>
              <Select 
                value={currentSession.process} 
                onValueChange={(value) => setCurrentSession(prev => ({ ...prev, process: value }))}
              >
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
              <Select 
                value={currentSession.roast_level} 
                onValueChange={(value) => setCurrentSession(prev => ({ ...prev, roast_level: value }))}
              >
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
              <Select
                value={currentSession.cupping_protocol}
                onValueChange={(value) => setCurrentSession(prev => ({ ...prev, cupping_protocol: value }))}
              >
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
            
            <div>
              <Label htmlFor="roastDate">Roast Date</Label>
              <Input
                id="roastDate"
                value={currentSession.roast_date}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, roast_date: e.target.value }))}
                type="date"
              />
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
                  </div>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[currentSession[category.key as keyof Pick<CuppingSessionInput, 'fragrance' | 'flavor' | 'aftertaste' | 'acidity' | 'body' | 'balance' | 'sweetness' | 'clean_cup' | 'uniformity' | 'overall'>]]}
                      onValueChange={(values) => updateScore(category.key as keyof Pick<CuppingSessionInput, 'fragrance' | 'flavor' | 'aftertaste' | 'acidity' | 'body' | 'balance' | 'sweetness' | 'clean_cup' | 'uniformity' | 'overall'>, values[0])}
                      max={10}
                      min={0}
                      step={0.25}
                      className="flex-1"
                    />
                    <span className="w-12 text-right font-mono">
                      {(currentSession[category.key as keyof Pick<CuppingSessionInput, 'fragrance' | 'flavor' | 'aftertaste' | 'acidity' | 'body' | 'balance' | 'sweetness' | 'clean_cup' | 'uniformity' | 'overall'>] as number).toFixed(2)}
                    </span>
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
                  value={currentSession.notes_dry}
                  onChange={(e) => updateNote('notes_dry', e.target.value)}
                  placeholder="Describe the dry fragrance..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="crustNotes">Crust/Wet Aroma</Label>
                <Textarea
                  id="crustNotes"
                  value={currentSession.notes_crust}
                  onChange={(e) => updateNote('notes_crust', e.target.value)}
                  placeholder="Describe the crust aroma..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="flavorNotes">Flavor</Label>
                <Textarea
                  id="flavorNotes"
                  value={currentSession.notes_flavor}
                  onChange={(e) => updateNote('notes_flavor', e.target.value)}
                  placeholder="Describe the flavor profile..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="finishNotes">Finish/Aftertaste</Label>
                <Textarea
                  id="finishNotes"
                  value={currentSession.notes_finish}
                  onChange={(e) => updateNote('notes_finish', e.target.value)}
                  placeholder="Describe the finish..."
                  rows={2}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="overallNotes">Overall Impression</Label>
              <Textarea
                id="overallNotes"
                value={currentSession.notes_overall}
                onChange={(e) => updateNote('notes_overall', e.target.value)}
                placeholder="Overall impressions..."
                rows={3}
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <Label htmlFor="recommendations">Brewing Recommendations</Label>
            <Textarea
              id="recommendations"
              value={currentSession.recommendations}
              onChange={(e) => setCurrentSession(prev => ({ ...prev, recommendations: e.target.value }))}
              placeholder="Suggested brewing methods, ratios, and serving recommendations..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button type="button" onClick={saveSession} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Session...
                </>
              ) : (
                "Save Cupping Session"
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Cupping Sessions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading cupping sessions...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Cupping Sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Start your professional coffee evaluation journey
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{session.coffee_name}</h3>
                      <p className="text-muted-foreground">{session.roaster} - {session.origin}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()} • {session.cupping_protocol}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{session.total_score.toFixed(1)}</div>
                      <Badge className={getRatingColor(session.final_rating)}>
                        {session.final_rating}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.fragrance.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Fragrance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.flavor.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Flavor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.aftertaste.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Aftertaste</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.acidity.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Acidity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.body.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Body</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.balance.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.sweetness.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Sweetness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.clean_cup.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Clean Cup</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.uniformity.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Uniformity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.overall.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Overall</div>
                    </div>
                  </div>
                  
                  {(session.notes_overall || session.recommendations) && (
                    <div className="border-t pt-4 space-y-2">
                      {session.notes_overall && (
                        <p className="text-sm italic">"{session.notes_overall}"</p>
                      )}
                      {session.recommendations && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Recommendations:</strong> {session.recommendations}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CuppingNotes;