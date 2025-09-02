import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, DollarSign, Coffee, Filter, Scale, Thermometer, Timer, Zap } from "lucide-react";

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
  image?: string;
}

const equipment: Equipment[] = [
  {
    id: 'baratza-encore',
    name: 'Baratza Encore',
    category: 'Grinder',
    price: 169,
    rating: 4.5,
    pros: [
      'Consistent grind quality',
      'Easy to use and clean',
      'Reliable burr mechanism',
      'Good customer support'
    ],
    cons: [
      'Can be messy',
      'Slower grinding speed',
      'Plastic construction'
    ],
    bestFor: ['Pour over', 'Drip coffee', 'French press'],
    description: 'Entry-level burr grinder perfect for getting started with fresh ground coffee. Offers 40 grind settings and consistent results.',
    difficulty: 'Beginner'
  },
  {
    id: 'comandante-c40',
    name: 'Comandante C40 MK4',
    category: 'Grinder',
    price: 349,
    rating: 4.8,
    pros: [
      'Exceptional grind consistency',
      'Premium build quality',
      'Portable design',
      'Precise adjustments'
    ],
    cons: [
      'Manual grinding required',
      'Higher price point',
      'Time-consuming for large batches'
    ],
    bestFor: ['Pour over', 'AeroPress', 'Espresso'],
    description: 'Premium hand grinder with surgical steel burrs. Offers micro-adjustments and exceptional consistency for all brewing methods.',
    difficulty: 'Advanced'
  },
  {
    id: 'hario-v60',
    name: 'Hario V60 Dripper',
    category: 'Brewer',
    price: 25,
    rating: 4.6,
    pros: [
      'Excellent extraction control',
      'Affordable price point',
      'Wide availability',
      'Multiple material options'
    ],
    cons: [
      'Requires technique mastery',
      'Needs specific filters',
      'Can be inconsistent for beginners'
    ],
    bestFor: ['Single origin', 'Light roasts', 'Bright coffee'],
    description: 'Iconic pour-over dripper with spiral ridges and large opening. Allows for precise control over extraction variables.',
    difficulty: 'Intermediate'
  },
  {
    id: 'chemex-classic',
    name: 'Chemex Classic',
    category: 'Brewer',
    price: 65,
    rating: 4.4,
    pros: [
      'Clean, bright extraction',
      'Beautiful design',
      'Thick filters remove oils',
      'Easy to use'
    ],
    cons: [
      'Expensive filters',
      'Limited control over variables',
      'Fragile glass construction'
    ],
    bestFor: ['Clean coffee', 'Medium roasts', 'Entertaining'],
    description: 'Elegant hourglass brewer with thick filters. Produces exceptionally clean cups with bright, tea-like characteristics.',
    difficulty: 'Beginner'
  },
  {
    id: 'acaia-pearl',
    name: 'Acaia Pearl Scale',
    category: 'Scale',
    price: 169,
    rating: 4.7,
    pros: [
      'Precise 0.1g accuracy',
      'Built-in timer',
      'Water-resistant design',
      'Smartphone connectivity'
    ],
    cons: [
      'Expensive for a scale',
      'Battery life concerns',
      'App complexity'
    ],
    bestFor: ['Pour over', 'Espresso', 'Professional brewing'],
    description: 'Professional-grade scale with built-in timer and smartphone app connectivity. Essential for precision brewing.',
    difficulty: 'Intermediate'
  },
  {
    id: 'fellow-stagg',
    name: 'Fellow Stagg EKG',
    category: 'Kettle',
    price: 195,
    rating: 4.6,
    pros: [
      'Precise temperature control',
      'Elegant design',
      'Perfect pour spout',
      'Hold temperature function'
    ],
    cons: [
      'Premium price',
      'Electric only',
      'Limited capacity'
    ],
    bestFor: ['Pour over', 'Tea', 'Precision brewing'],
    description: 'Electric kettle with precise temperature control and gooseneck spout. Perfect for controlled pouring and temperature consistency.',
    difficulty: 'Beginner'
  },
  {
    id: 'aeropress-original',
    name: 'AeroPress Original',
    category: 'Brewer',
    price: 39,
    rating: 4.5,
    pros: [
      'Versatile brewing methods',
      'Nearly indestructible',
      'Easy cleanup',
      'Great for travel'
    ],
    cons: [
      'Single cup capacity',
      'Proprietary filters',
      'Learning curve for optimization'
    ],
    bestFor: ['Travel', 'Office', 'Full-body coffee'],
    description: 'Innovative pressure brewing device that combines immersion and pressure. Produces smooth, full-bodied coffee with low acidity.',
    difficulty: 'Beginner'
  },
  {
    id: 'timemore-black-mirror',
    name: 'Timemore Black Mirror',
    category: 'Scale',
    price: 89,
    rating: 4.3,
    pros: [
      'Good accuracy',
      'Built-in timer',
      'Affordable price',
      'Fast response time'
    ],
    cons: [
      'Basic app integration',
      'Build quality concerns',
      'Limited features'
    ],
    bestFor: ['Home brewing', 'Budget-conscious users'],
    description: 'Affordable scale with timer function and decent accuracy. Good entry point for precision brewing without breaking the bank.',
    difficulty: 'Beginner'
  }
];

export const EquipmentGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredEquipment = equipment
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        switch (priceRange) {
          case 'budget':
            matchesPrice = item.price < 100;
            break;
          case 'mid':
            matchesPrice = item.price >= 100 && item.price < 250;
            break;
          case 'premium':
            matchesPrice = item.price >= 250;
            break;
        }
      }
      
      return matchesCategory && matchesDifficulty && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.rating - a.rating;
      }
    });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grinder': return Coffee;
      case 'Brewer': return Filter;
      case 'Scale': return Scale;
      case 'Kettle': return Thermometer;
      case 'Filter': return Filter;
      case 'Accessory': return Zap;
      default: return Coffee;
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

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'fill-coffee-golden text-coffee-golden' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Equipment Guide</h1>
        <p className="text-muted-foreground text-lg">Comprehensive gear recommendations with pros, cons, and expert ratings</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="budget">Under $100</SelectItem>
            <SelectItem value="mid">$100 - $250</SelectItem>
            <SelectItem value="premium">$250+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
          {filteredEquipment.length} items found
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEquipment.map((item) => {
          const IconComponent = getCategoryIcon(item.category);
          
          return (
            <Card key={item.id} className="coffee-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="golden-gradient p-2 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold text-primary">${item.price}</span>
                  </div>
                  <StarRating rating={item.rating} />
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge className={getDifficultyColor(item.difficulty)}>
                  {item.difficulty}
                </Badge>
                <Badge variant="outline">
                  {item.rating}/5.0
                </Badge>
              </div>

              <p className="text-muted-foreground mb-4">{item.description}</p>

              {/* Best For */}
              <div className="mb-4">
                <h4 className="font-semibold text-primary mb-2">Best For:</h4>
                <div className="flex flex-wrap gap-1">
                  {item.bestFor.map(use => (
                    <Badge key={use} variant="secondary" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {item.pros.slice(0, 3).map((pro, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-green-500 mr-2">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {item.cons.slice(0, 3).map((con, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-red-500 mr-2">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No equipment found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}

      {/* Buying Guide */}
      <Card className="coffee-card p-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Coffee Equipment Buying Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-primary mb-3">Essential Equipment</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Coffee className="h-4 w-4 mr-2 text-primary" />
                Quality burr grinder
              </li>
              <li className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                Pour-over dripper
              </li>
              <li className="flex items-center">
                <Scale className="h-4 w-4 mr-2 text-primary" />
                Digital scale with timer
              </li>
              <li className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2 text-primary" />
                Temperature-controlled kettle
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">Budget Recommendations</h4>
            <ul className="space-y-2 text-sm">
              <li><strong>Starter ($200-300):</strong> AeroPress, Timemore scale, basic kettle</li>
              <li><strong>Intermediate ($400-600):</strong> Baratza Encore, V60, Stagg kettle</li>
              <li><strong>Advanced ($800+):</strong> Premium grinder, multiple brewers, Acaia scale</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">Pro Tips</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Invest in a good grinder first</li>
              <li>• Consistency matters more than complexity</li>
              <li>• Buy once, cry once - quality lasts</li>
              <li>• Start simple, upgrade gradually</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};