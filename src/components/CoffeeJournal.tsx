import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Search, Coffee, Calendar, MapPin, Loader2 } from "lucide-react";
import { useCoffeeEntries, CoffeeEntryInput } from "@/hooks/useCoffeeData";

const CoffeeJournal = () => {
  const { entries, isLoading, addEntry } = useCoffeeEntries();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoaster, setSelectedRoaster] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEntry = async (newEntry: CoffeeEntryInput) => {
    setIsSubmitting(true);
    try {
      await addEntry(newEntry);
      setShowForm(false);
    } catch (error) {
      // Error handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.coffee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.roaster.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoaster = selectedRoaster === 'all' || entry.roaster === selectedRoaster;
    return matchesSearch && matchesRoaster;
  });

  const uniqueRoasters = Array.from(new Set(entries.map(entry => entry.roaster)));

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const flavorTags = (formData.get('flavorProfile') as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const entry: CoffeeEntryInput = {
      coffee_name: formData.get('coffeeName') as string,
      roaster: formData.get('roaster') as string,
      origin: formData.get('origin') as string,
      process: formData.get('process') as string,
      roast_level: formData.get('roastLevel') as string,
      brew_method: formData.get('brewMethod') as string,
      grind_size: formData.get('grindSize') as string,
      water_temp: Number(formData.get('waterTemp')),
      brew_time: formData.get('brewTime') as string,
      ratio: formData.get('ratio') as string,
      rating: Number(formData.get('rating')),
      tasting_notes: formData.get('tastingNotes') as string,
      flavor_profile: flavorTags,
      price: Number(formData.get('price')) || undefined
    };

    handleAddEntry(entry);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Coffee Journal</h1>
        <p className="text-muted-foreground text-lg">Track your coffee journey and tasting experiences</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search coffee, roaster, or origin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedRoaster} onValueChange={setSelectedRoaster}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by roaster" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roasters</SelectItem>
              {uniqueRoasters.map(roaster => (
                <SelectItem key={roaster} value={roaster}>{roaster}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setShowForm(!showForm)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-primary">New Coffee Entry</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="coffeeName">Coffee Name *</Label>
                <Input
                  id="coffeeName"
                  name="coffeeName"
                  placeholder="Ethiopian Yirgacheffe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="roaster">Roaster *</Label>
                <Input
                  id="roaster"
                  name="roaster"
                  placeholder="Blue Bottle Coffee"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  name="origin"
                  placeholder="Ethiopia, Yirgacheffe"
                />
              </div>
              
                <div>
                <Label htmlFor="process">Process</Label>
                <Select name="process">
                  <SelectTrigger>
                    <SelectValue placeholder="Select process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Washed">Washed</SelectItem>
                    <SelectItem value="Natural">Natural</SelectItem>
                    <SelectItem value="Honey - Yellow">Honey - Yellow</SelectItem>
                    <SelectItem value="Honey - Red">Honey - Red</SelectItem>
                    <SelectItem value="Honey - Black">Honey - Black</SelectItem>
                    <SelectItem value="Honey - White">Honey - White</SelectItem>
                    <SelectItem value="Semi-Washed">Semi-Washed</SelectItem>
                    <SelectItem value="Anaerobic Natural">Anaerobic Natural</SelectItem>
                    <SelectItem value="Anaerobic Washed">Anaerobic Washed</SelectItem>
                    <SelectItem value="Anaerobic Honey">Anaerobic Honey</SelectItem>
                    <SelectItem value="Carbonic Maceration">Carbonic Maceration</SelectItem>
                    <SelectItem value="Thermal Shock">Thermal Shock</SelectItem>
                    <SelectItem value="Extended Fermentation">Extended Fermentation</SelectItem>
                    <SelectItem value="Lactic Process">Lactic Process</SelectItem>
                    <SelectItem value="Yeast Inoculation">Yeast Inoculation</SelectItem>
                    <SelectItem value="Co-fermentation">Co-fermentation</SelectItem>
                    <SelectItem value="Experimental">Experimental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="roastLevel">Roast Level</Label>
                <Select name="roastLevel">
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
                <Label htmlFor="brewMethod">Brew Method</Label>
                <Select name="brewMethod">
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V60">V60</SelectItem>
                    <SelectItem value="Chemex">Chemex</SelectItem>
                    <SelectItem value="AeroPress">AeroPress</SelectItem>
                    <SelectItem value="French Press">French Press</SelectItem>
                    <SelectItem value="Espresso">Espresso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="grindSize">Grind Size</Label>
                <Input
                  id="grindSize"
                  name="grindSize"
                  placeholder="Medium-Fine"
                />
              </div>
              
              <div>
                <Label htmlFor="waterTemp">Water Temperature (°C)</Label>
                <Input
                  id="waterTemp"
                  name="waterTemp"
                  type="number"
                  placeholder="94"
                  min="80"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="brewTime">Brew Time</Label>
                <Input
                  id="brewTime"
                  name="brewTime"
                  placeholder="2:45"
                />
              </div>
              
              <div>
                <Label htmlFor="ratio">Ratio</Label>
                <Input
                  id="ratio"
                  name="ratio"
                  placeholder="1:16"
                />
              </div>
              
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="24.99"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="flavorProfile">Flavor Profile (comma-separated)</Label>
              <Input
                id="flavorProfile"
                name="flavorProfile"
                placeholder="Floral, Citrus, Tea-like, Bright"
              />
            </div>
            
            <div>
              <Label htmlFor="tastingNotes">Tasting Notes</Label>
              <Textarea
                id="tastingNotes"
                name="tastingNotes"
                placeholder="Describe the flavor, aroma, and overall experience..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Entry...
                  </>
                ) : (
                  "Add Coffee Entry"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading your coffee entries...</span>
        </div>
      ) : (
        /* Coffee Cards Grid */
        <div className="grid gap-4 md:gap-6">
          {filteredEntries.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Coffee Entries Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedRoaster !== 'all' 
                    ? 'Try adjusting your search filters' 
                    : 'Start your coffee journey by adding your first entry'}
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Coffee Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{entry.coffee_name}</h3>
                          <p className="text-lg text-muted-foreground">{entry.roaster}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarRating rating={entry.rating} />
                          <span className="font-semibold ml-2">{entry.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {entry.origin}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{entry.process}</Badge>
                        <Badge variant="secondary">{entry.roast_level}</Badge>
                        <Badge variant="outline">{entry.brew_method}</Badge>
                        {entry.price && <Badge variant="outline">${entry.price}</Badge>}
                      </div>
                      
                      {entry.flavor_profile.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.flavor_profile.map((flavor, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {flavor}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Brewing Details */}
                    <div className="md:w-64 bg-muted/30 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Brewing Details
                      </h4>
                      <div className="grid grid-cols-2 gap-y-1 text-sm">
                        <span className="text-muted-foreground">Grind:</span>
                        <span>{entry.grind_size}</span>
                        <span className="text-muted-foreground">Water:</span>
                        <span>{entry.water_temp}°C</span>
                        <span className="text-muted-foreground">Time:</span>
                        <span>{entry.brew_time}</span>
                        <span className="text-muted-foreground">Ratio:</span>
                        <span>{entry.ratio}</span>
                      </div>
                    </div>
                  </div>
                  
                  {entry.tasting_notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground italic">
                        "{entry.tasting_notes}"
                      </p>
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

export default CoffeeJournal;