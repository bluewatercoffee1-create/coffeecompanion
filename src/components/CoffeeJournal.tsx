import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Search, Filter, Calendar, MapPin, Bean } from "lucide-react";

interface CoffeeEntry {
  id: string;
  date: string;
  coffeeName: string;
  roaster: string;
  origin: string;
  process: string;
  roastLevel: string;
  brewMethod: string;
  grindSize: string;
  waterTemp: number;
  brewTime: string;
  ratio: string;
  rating: number;
  tastingNotes: string;
  flavorProfile: string[];
  price: number;
}

const mockEntries: CoffeeEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    coffeeName: 'Ethiopian Yirgacheffe',
    roaster: 'Blue Bottle Coffee',
    origin: 'Ethiopia, Yirgacheffe',
    process: 'Washed',
    roastLevel: 'Light',
    brewMethod: 'V60',
    grindSize: 'Medium-Fine',
    waterTemp: 96,
    brewTime: '2:45',
    ratio: '1:16',
    rating: 4.5,
    tastingNotes: 'Bright acidity with floral notes, hints of lemon and tea-like finish',
    flavorProfile: ['Floral', 'Citrus', 'Tea-like', 'Bright'],
    price: 24
  },
  {
    id: '2',
    date: '2024-01-14',
    coffeeName: 'Colombian Huila',
    roaster: 'Counter Culture',
    origin: 'Colombia, Huila',
    process: 'Natural',
    roastLevel: 'Medium',
    brewMethod: 'Chemex',
    grindSize: 'Medium',
    waterTemp: 94,
    brewTime: '4:30',
    ratio: '1:15',
    rating: 4,
    tastingNotes: 'Chocolate and caramel sweetness with nutty undertones',
    flavorProfile: ['Chocolate', 'Caramel', 'Nutty', 'Sweet'],
    price: 22
  }
];

export const CoffeeJournal = () => {
  const [entries, setEntries] = useState<CoffeeEntry[]>(mockEntries);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoaster, setFilterRoaster] = useState('all');
  const [newEntry, setNewEntry] = useState<Partial<CoffeeEntry>>({
    rating: 0,
    flavorProfile: [],
    waterTemp: 94
  });

  const flavorOptions = [
    'Floral', 'Citrus', 'Berry', 'Chocolate', 'Caramel', 'Nutty', 'Spicy',
    'Fruity', 'Wine-like', 'Tea-like', 'Bright', 'Sweet', 'Earthy', 'Smoky'
  ];

  const addFlavorProfile = (flavor: string) => {
    if (!newEntry.flavorProfile?.includes(flavor)) {
      setNewEntry({
        ...newEntry,
        flavorProfile: [...(newEntry.flavorProfile || []), flavor]
      });
    }
  };

  const removeFlavorProfile = (flavor: string) => {
    setNewEntry({
      ...newEntry,
      flavorProfile: newEntry.flavorProfile?.filter(f => f !== flavor) || []
    });
  };

  const handleSubmit = () => {
    if (newEntry.coffeeName && newEntry.roaster) {
      const entry: CoffeeEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        coffeeName: newEntry.coffeeName || '',
        roaster: newEntry.roaster || '',
        origin: newEntry.origin || '',
        process: newEntry.process || '',
        roastLevel: newEntry.roastLevel || '',
        brewMethod: newEntry.brewMethod || '',
        grindSize: newEntry.grindSize || '',
        waterTemp: newEntry.waterTemp || 94,
        brewTime: newEntry.brewTime || '',
        ratio: newEntry.ratio || '',
        rating: newEntry.rating || 0,
        tastingNotes: newEntry.tastingNotes || '',
        flavorProfile: newEntry.flavorProfile || [],
        price: newEntry.price || 0
      };
      
      setEntries([entry, ...entries]);
      setNewEntry({ rating: 0, flavorProfile: [], waterTemp: 94 });
      setShowForm(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.coffeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.roaster.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoaster = filterRoaster === 'all' || entry.roaster === filterRoaster;
    return matchesSearch && matchesRoaster;
  });

  const uniqueRoasters = Array.from(new Set(entries.map(e => e.roaster)));

  const StarRating = ({ rating, onRatingChange, interactive = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer ${
            star <= rating ? 'fill-coffee-golden text-coffee-golden' : 'text-muted-foreground'
          }`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );

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
          
          <Select value={filterRoaster} onValueChange={setFilterRoaster}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
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
        <Card className="coffee-card p-6">
          <h3 className="text-xl font-semibold mb-6 text-primary">New Coffee Entry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="coffeeName">Coffee Name *</Label>
              <Input
                id="coffeeName"
                value={newEntry.coffeeName || ''}
                onChange={(e) => setNewEntry({...newEntry, coffeeName: e.target.value})}
                placeholder="Ethiopian Yirgacheffe"
              />
            </div>
            
            <div>
              <Label htmlFor="roaster">Roaster *</Label>
              <Input
                id="roaster"
                value={newEntry.roaster || ''}
                onChange={(e) => setNewEntry({...newEntry, roaster: e.target.value})}
                placeholder="Blue Bottle Coffee"
              />
            </div>
            
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={newEntry.origin || ''}
                onChange={(e) => setNewEntry({...newEntry, origin: e.target.value})}
                placeholder="Ethiopia, Yirgacheffe"
              />
            </div>
            
            <div>
              <Label htmlFor="process">Process</Label>
              <Select value={newEntry.process} onValueChange={(value) => setNewEntry({...newEntry, process: value})}>
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
              <Select value={newEntry.roastLevel} onValueChange={(value) => setNewEntry({...newEntry, roastLevel: value})}>
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
              <Select value={newEntry.brewMethod} onValueChange={(value) => setNewEntry({...newEntry, brewMethod: value})}>
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
              <Label htmlFor="waterTemp">Water Temperature (°C)</Label>
              <Input
                id="waterTemp"
                type="number"
                value={newEntry.waterTemp || ''}
                onChange={(e) => setNewEntry({...newEntry, waterTemp: Number(e.target.value)})}
                placeholder="94"
              />
            </div>
            
            <div>
              <Label htmlFor="brewTime">Brew Time</Label>
              <Input
                id="brewTime"
                value={newEntry.brewTime || ''}
                onChange={(e) => setNewEntry({...newEntry, brewTime: e.target.value})}
                placeholder="2:45"
              />
            </div>
            
            <div>
              <Label htmlFor="ratio">Ratio</Label>
              <Input
                id="ratio"
                value={newEntry.ratio || ''}
                onChange={(e) => setNewEntry({...newEntry, ratio: e.target.value})}
                placeholder="1:16"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label>Rating</Label>
            <StarRating 
              rating={newEntry.rating || 0} 
              onRatingChange={(rating) => setNewEntry({...newEntry, rating})}
              interactive={true}
            />
          </div>
          
          <div className="mb-4">
            <Label>Flavor Profile</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {flavorOptions.map(flavor => (
                <Button
                  key={flavor}
                  type="button"
                  variant={newEntry.flavorProfile?.includes(flavor) ? "default" : "outline"}
                  size="sm"
                  onClick={() => 
                    newEntry.flavorProfile?.includes(flavor) 
                      ? removeFlavorProfile(flavor)
                      : addFlavorProfile(flavor)
                  }
                >
                  {flavor}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="tastingNotes">Tasting Notes</Label>
            <Textarea
              id="tastingNotes"
              value={newEntry.tastingNotes || ''}
              onChange={(e) => setNewEntry({...newEntry, tastingNotes: e.target.value})}
              placeholder="Describe the flavor, aroma, and overall experience..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-4">
            <Button onClick={handleSubmit}>Save Entry</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="coffee-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{entry.coffeeName}</h3>
                <p className="text-muted-foreground">{entry.roaster}</p>
              </div>
              <div className="text-right">
                <StarRating rating={entry.rating} />
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{entry.origin}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Bean className="h-4 w-4 mr-2 text-primary" />
                <span>{entry.process} • {entry.roastLevel}</span>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Brew:</span> {entry.brewMethod} • {entry.ratio} • {entry.waterTemp}°C
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {entry.flavorProfile.map(flavor => (
                  <Badge key={flavor} variant="secondary" className="text-xs">
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground italic">
              "{entry.tastingNotes}"
            </p>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No coffee entries found</p>
          <p className="text-sm text-muted-foreground mt-2">
            {searchTerm || filterRoaster !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Start by adding your first coffee entry!'
            }
          </p>
        </div>
      )}
    </div>
  );
};