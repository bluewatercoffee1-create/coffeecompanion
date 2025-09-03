import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, DollarSign, Coffee, Filter, Scale, Thermometer, Timer, Zap, ExternalLink } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  category: 'Grinder' | 'Brewer' | 'Scale' | 'Kettle' | 'Filter' | 'Accessory';
  price: number;
  rating: number;
  pros: string[];
  cons: string[];
  bestFor: string[];
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  amazonLink?: string;
}

const equipment: Equipment[] = [
  {
    id: 'fellow-stagg-ekg-pro',
    name: 'Fellow Stagg EKG Pro Electric Gooseneck Kettle',
    category: 'Kettle',
    price: 195,
    rating: 4.8,
    pros: [
      'Precise temperature control',
      'Beautiful design',
      'Quick heating',
      'App connectivity'
    ],
    cons: [
      'Expensive',
      'Small capacity for families'
    ],
    bestFor: ['Pour over', 'Precision brewing', 'Temperature control'],
    description: 'Premium electric kettle with precise temperature control and stunning design. Perfect for serious coffee enthusiasts.',
    difficulty: 'Intermediate',
    amazonLink: 'https://amzn.to/3VC3mvb'
  },
  {
    id: 'hario-v60',
    name: 'Hario V60',
    category: 'Brewer',
    price: 25,
    rating: 4.6,
    pros: [
      'Affordable entry point',
      'Clean, bright flavors',
      'Widely available filters',
      'Easy to clean'
    ],
    cons: [
      'Requires technique',
      'Can be inconsistent for beginners'
    ],
    bestFor: ['Pour over', 'Single origin', 'Light roasts'],
    description: 'Classic cone-shaped dripper that produces clean, bright coffee with proper technique.',
    difficulty: 'Intermediate',
    amazonLink: 'https://amzn.to/3I1hDP3'
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    category: 'Brewer',
    price: 40,
    rating: 4.7,
    pros: [
      'Consistent results',
      'Travel friendly',
      'Forgiving technique',
      'Easy cleanup'
    ],
    cons: [
      'Small batch size',
      'Plastic construction',
      'Proprietary filters'
    ],
    bestFor: ['Travel', 'Quick brewing', 'Beginners'],
    description: 'Innovative brewing device that combines immersion and pressure for consistent, clean coffee.',
    difficulty: 'Beginner',
    amazonLink: 'https://amzn.to/41WUAvJ'
  },
  {
    id: 'timemore-scale',
    name: 'Timemore Scale',
    category: 'Scale',
    price: 45,
    rating: 4.5,
    pros: [
      'Accurate measurements',
      'Built-in timer',
      'Compact design',
      'Good value'
    ],
    cons: [
      'Basic features',
      'No app connectivity'
    ],
    bestFor: ['Home brewing', 'Basic measurements', 'Budget conscious'],
    description: 'Reliable coffee scale with timer function for consistent brewing ratios.',
    difficulty: 'Beginner',
    amazonLink: 'https://amzn.to/4lWgjuA'
  },
  {
    id: 'chemex',
    name: 'Chemex',
    category: 'Brewer',
    price: 55,
    rating: 4.4,
    pros: [
      'Beautiful design',
      'Clean, filtered taste',
      'Larger capacity',
      'No plastic parts'
    ],
    cons: [
      'Thick filters expensive',
      'Fragile glass',
      'Slower brewing'
    ],
    bestFor: ['Multiple cups', 'Clean taste', 'Display piece'],
    description: 'Elegant glass pour-over brewer that produces exceptionally clean coffee.',
    difficulty: 'Intermediate',
    amazonLink: 'https://amzn.to/480AILN'
  },
  {
    id: 'melodrip',
    name: 'MeloDrip',
    category: 'Accessory',
    price: 85,
    rating: 4.3,
    pros: [
      'Even water distribution',
      'Improved extraction',
      'Unique brewing experience',
      'Quality construction'
    ],
    cons: [
      'Expensive for accessory',
      'Learning curve',
      'Adds complexity'
    ],
    bestFor: ['Advanced brewing', 'Even extraction', 'Experimentation'],
    description: 'Innovative water distribution system for more even pour-over extraction.',
    difficulty: 'Advanced',
    amazonLink: 'https://amzn.to/460jsnk'
  },
  {
    id: 'fellow-opus',
    name: 'Fellow Opus Conical Burr Coffee Grinder',
    category: 'Grinder',
    price: 195,
    rating: 4.6,
    pros: [
      'Great grind consistency',
      'Beautiful design',
      'Wide grind range',
      'Easy to use'
    ],
    cons: [
      'Expensive',
      'Can be messy',
      'Limited hopper size'
    ],
    bestFor: ['Home brewing', 'Pour over', 'Espresso'],
    description: 'Premium burr grinder with excellent consistency across all grind sizes.',
    difficulty: 'Intermediate',
    amazonLink: 'https://amzn.to/460jsnk'
  },
  {
    id: 't64',
    name: 'T64',
    category: 'Grinder',
    price: 299,
    rating: 4.7,
    pros: [
      'Professional grade burrs',
      'Exceptional consistency',
      'Low retention',
      'Precise adjustments'
    ],
    cons: [
      'High price point',
      'Manual operation',
      'Learning curve'
    ],
    bestFor: ['Espresso', 'Competition', 'Professional use'],
    description: 'High-end manual grinder for serious coffee enthusiasts and professionals.',
    difficulty: 'Advanced',
    amazonLink: 'https://amzn.to/4ncARjy'
  },
  {
    id: '1zpresso-j-ultra',
    name: '1Zpresso J-Ultra',
    category: 'Grinder',
    price: 179,
    rating: 4.8,
    pros: [
      'Excellent build quality',
      'Great for espresso',
      'Portable design',
      'Consistent grind'
    ],
    cons: [
      'Manual operation',
      'Time consuming',
      'Small capacity'
    ],
    bestFor: ['Espresso', 'Travel', 'Manual grinding'],
    description: 'Premium manual grinder with exceptional espresso capabilities.',
    difficulty: 'Intermediate',
    amazonLink: 'https://amzn.to/45OQ4S8'
  },
  {
    id: 'hario-switch',
    name: 'Hario "Switch" Immersion Dripper',
    category: 'Brewer',
    price: 35,
    rating: 4.5,
    pros: [
      'Versatile brewing',
      'Forgiving technique',
      'Good value',
      'Combines immersion and drip'
    ],
    cons: [
      'Plastic construction',
      'Proprietary design',
      'Learning curve'
    ],
    bestFor: ['Versatile brewing', 'Beginners', 'Experimentation'],
    description: 'Innovative dripper that combines immersion and pour-over brewing methods.',
    difficulty: 'Beginner',
    amazonLink: 'https://amzn.to/3JLTP28'
  },
  {
    id: 'cafec-filters',
    name: 'CAFEC 100-Pack Cone-shaped V60 02 Paper Filter',
    category: 'Filter',
    price: 15,
    rating: 4.6,
    pros: [
      'High quality paper',
      'Clean taste',
      'Good flow rate',
      'Affordable'
    ],
    cons: [
      'Single use',
      'Ongoing cost',
      'Environmental impact'
    ],
    bestFor: ['V60 brewing', 'Clean extraction', 'Regular use'],
    description: 'Premium paper filters for V60 brewing with excellent flow characteristics.',
    difficulty: 'Beginner',
    amazonLink: 'https://amzn.to/47mdakg'
  },
  {
    id: 'ims-basket',
    name: 'IMS Precision Basket',
    category: 'Accessory',
    price: 35,
    rating: 4.7,
    pros: [
      'Improved extraction',
      'Precision holes',
      'Better espresso',
      'Professional grade'
    ],
    cons: [
      'Expensive for basket',
      'Machine specific',
      'Requires technique'
    ],
    bestFor: ['Espresso', 'Professional use', 'Better extraction'],
    description: 'Precision-engineered portafilter basket for improved espresso extraction.',
    difficulty: 'Advanced',
    amazonLink: 'https://amzn.to/3I4jiDn'
  },
  {
    id: 'mhw3bomber-portafilter',
    name: 'MHW-3BOMBER 58mm Bottomless Portafilter',
    category: 'Accessory',
    price: 65,
    rating: 4.4,
    pros: [
      'Visual extraction feedback',
      'Better crema',
      'Professional look',
      'Improved flow'
    ],
    cons: [
      'Messy if technique poor',
      'Machine specific size',
      'Learning curve'
    ],
    bestFor: ['Espresso training', 'Visual feedback', 'Advanced users'],
    description: 'Bottomless portafilter for visual espresso extraction feedback and training.',
    difficulty: 'Advanced',
    amazonLink: 'https://amzn.to/4g6E4yY'
  }
];

export const EquipmentGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredEquipment = equipment.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    let priceMatch = true;
    if (priceRange === 'under-50') priceMatch = item.price < 50;
    else if (priceRange === '50-100') priceMatch = item.price >= 50 && item.price <= 100;
    else if (priceRange === '100-200') priceMatch = item.price > 100 && item.price <= 200;
    else if (priceRange === 'over-200') priceMatch = item.price > 200;
    
    return categoryMatch && difficultyMatch && priceMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name':
      default: return a.name.localeCompare(b.name);
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grinder': return <Coffee className="h-5 w-5" />;
      case 'Brewer': return <Filter className="h-5 w-5" />;
      case 'Scale': return <Scale className="h-5 w-5" />;
      case 'Kettle': return <Thermometer className="h-5 w-5" />;
      case 'Filter': return <Filter className="h-5 w-5" />;
      case 'Accessory': return <Zap className="h-5 w-5" />;
      default: return <Coffee className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Coffee Equipment Guide</h1>
        <p className="text-muted-foreground text-lg">Curated equipment recommendations with Amazon affiliate links</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under-50">Under $50</SelectItem>
            <SelectItem value="50-100">$50 - $100</SelectItem>
            <SelectItem value="100-200">$100 - $200</SelectItem>
            <SelectItem value="over-200">Over $200</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="coffee-card hover:shadow-lg transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getCategoryIcon(item.category)}
                  </div>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                <Badge className={getDifficultyColor(item.difficulty)}>
                  {item.difficulty}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-primary mb-2">{item.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-lg">${item.price}</span>
                </div>
                <StarRating rating={item.rating} />
              </div>

              {item.amazonLink && (
                <Button 
                  className="w-full mb-4" 
                  onClick={() => window.open(item.amazonLink, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buy on Amazon
                </Button>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-primary mb-2">Pros:</h4>
                  <ul className="text-sm space-y-1">
                    {item.pros.slice(0, 3).map((pro, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-primary mb-2">Best For:</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.bestFor.slice(0, 3).map((use, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Buying Guide */}
      <div className="mt-16 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Coffee Equipment Buying Guide</h2>
          <p className="text-muted-foreground">Essential equipment for every coffee enthusiast</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="coffee-card p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Essential Starter Kit</h3>
            <ul className="space-y-2 text-sm">
              <li>• Quality burr grinder ($40-170)</li>
              <li>• Pour-over dripper ($25-55)</li>
              <li>• Digital scale ($25-45)</li>
              <li>• Gooseneck kettle ($35-195)</li>
              <li>• Quality filters ($10-15)</li>
            </ul>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm text-primary font-semibold">Total: $135-480</p>
            </div>
          </Card>

          <Card className="coffee-card p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Budget Recommendations</h3>
            <ul className="space-y-2 text-sm">
              <li>• AeroPress ($40)</li>
              <li>• Timemore Scale ($45)</li>
              <li>• Basic gooseneck kettle ($35)</li>
              <li>• Paper filters ($15)</li>
              <li>• Pre-ground coffee initially</li>
            </ul>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 font-semibold">Total: Under $150</p>
            </div>
          </Card>

          <Card className="coffee-card p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Pro Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Invest in a good grinder first</li>
              <li>• Buy fresh, whole bean coffee</li>
              <li>• Practice your technique consistently</li>
              <li>• Upgrade gradually over time</li>
              <li>• Focus on fundamentals before gadgets</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};