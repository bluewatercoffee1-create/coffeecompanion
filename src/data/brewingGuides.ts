export interface BrewingGuide {
  id: string;
  name: string;
  method: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  brewTime: string;
  targetFlavor: string[];
  description: string;
  waterTemp: number;
  grindSize: string;
  ratio: string;
  steps: {
    step: number;
    time: string;
    action: string;
    technique: string;
    scienceNote?: string;
  }[];
  science: {
    extraction: string;
    agitation: string;
    temperature: string;
    grind: string;
  };
  flavorProfile: string;
  tips: string[];
}

export const brewingGuides: BrewingGuide[] = [
  // V60 Methods
  {
    id: 'v60-bright',
    name: 'V60 Bright & Floral',
    method: 'V60',
    difficulty: 'Intermediate',
    brewTime: '2:30-3:00',
    targetFlavor: ['Bright', 'Floral', 'Tea-like', 'Clean'],
    description: 'Optimized for light roasts and floral coffees with high acidity',
    waterTemp: 96,
    grindSize: 'Medium-Fine',
    ratio: '1:17',
    flavorProfile: 'High extraction technique emphasizing bright acidity and floral notes while maintaining clarity',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Pour 2x coffee weight in center, gentle spiral outward',
        scienceNote: 'CO2 degassing improves water penetration and even extraction'
      },
      {
        step: 2,
        time: '0:45',
        action: 'First Pour',
        technique: 'Slow spiral pour to 40% total water weight',
        scienceNote: 'Lower water temperature preserves delicate aromatics'
      },
      {
        step: 3,
        time: '1:15',
        action: 'Second Pour',
        technique: 'Center pour with gentle agitation',
        scienceNote: 'Minimal agitation prevents over-extraction of bitter compounds'
      },
      {
        step: 4,
        time: '1:45',
        action: 'Final Pour',
        technique: 'Complete to target weight, avoid disturbing bed',
        scienceNote: 'Consistent bed level ensures even extraction completion'
      }
    ],
    science: {
      extraction: '18-20% target extraction for bright, clean cup',
      agitation: 'Minimal agitation preserves floral compounds',
      temperature: '96°C optimal for light roast solubility without bitterness',
      grind: 'Medium-fine allows proper flow rate while maximizing surface area'
    },
    tips: [
      'Use paper rinsed with hot water to remove papery taste',
      'Maintain consistent pour speed throughout',
      'Target 2:30-3:00 total brew time for optimal extraction'
    ]
  },
  {
    id: 'v60-balanced',
    name: 'V60 Balanced Profile',
    method: 'V60',
    difficulty: 'Intermediate',
    brewTime: '2:45-3:15',
    targetFlavor: ['Balanced', 'Sweet', 'Complex', 'Round'],
    description: 'Versatile recipe for medium roasts emphasizing sweetness and balance',
    waterTemp: 94,
    grindSize: 'Medium',
    ratio: '1:16',
    flavorProfile: 'Balanced extraction highlighting sweetness while maintaining complexity and body',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Pour 2.5x coffee weight, stir gently once',
        scienceNote: 'Gentle stir ensures even saturation and CO2 release'
      },
      {
        step: 2,
        time: '0:30',
        action: 'Build',
        technique: 'Pour to 60% total weight in steady spiral',
        scienceNote: 'Steady pour maintains consistent extraction rate'
      },
      {
        step: 3,
        time: '1:30',
        action: 'Finish',
        technique: 'Complete pour with gentle pulses',
        scienceNote: 'Pulsed pouring extends contact time for better extraction'
      }
    ],
    science: {
      extraction: '20-22% target for balanced sweetness and complexity',
      agitation: 'Moderate agitation during bloom improves evenness',
      temperature: '94°C balances extraction efficiency with flavor preservation',
      grind: 'Medium grind provides good balance of flow rate and extraction'
    },
    tips: [
      'Adjust grind size based on flow rate',
      'Target total dissolved solids of 1.25-1.45%',
      'Use filtered water with 150-300 ppm TDS'
    ]
  },
  {
    id: 'v60-body',
    name: 'V60 Full Body',
    method: 'V60',
    difficulty: 'Advanced',
    brewTime: '3:30-4:00',
    targetFlavor: ['Full-body', 'Rich', 'Chocolatey', 'Sweet'],
    description: 'Extended extraction for maximum body and sweetness from darker roasts',
    waterTemp: 92,
    grindSize: 'Medium-Coarse',
    ratio: '1:15',
    flavorProfile: 'Extended contact time creates full body while avoiding over-extraction',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Pour 3x coffee weight, vigorous stir, 60-second bloom',
        scienceNote: 'Extended bloom time allows full CO2 degassing'
      },
      {
        step: 2,
        time: '1:00',
        action: 'Slow Build',
        technique: 'Very slow pour to 50% total weight over 90 seconds',
        scienceNote: 'Slow pour maximizes contact time without over-agitation'
      },
      {
        step: 3,
        time: '2:30',
        action: 'Final Pour',
        technique: 'Complete to target weight in center pour',
        scienceNote: 'Center pour maintains even bed for final extraction phase'
      }
    ],
    science: {
      extraction: '22-24% for maximum body and sweetness',
      agitation: 'High initial agitation, minimal during pouring',
      temperature: '92°C prevents bitter extraction from extended contact',
      grind: 'Coarser grind slows flow for extended contact time'
    },
    tips: [
      'Perfect for medium-dark to dark roasts',
      'Use bypass method if too strong',
      'Monitor flow rate - should be very slow'
    ]
  },

  // AeroPress Methods
  {
    id: 'aeropress-intense',
    name: 'AeroPress Intense',
    method: 'AeroPress',
    difficulty: 'Advanced',
    brewTime: '2:00',
    targetFlavor: ['Full-body', 'Rich', 'Syrupy', 'Intense'],
    description: 'High-extraction method for maximum flavor intensity and body',
    waterTemp: 88,
    grindSize: 'Fine',
    ratio: '1:12',
    flavorProfile: 'Maximum extraction with full body and intense flavor concentration',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Inverted Setup',
        technique: 'Fine grind, hot water, inverted method',
        scienceNote: 'Lower temperature prevents over-extraction of fine grind'
      },
      {
        step: 2,
        time: '0:10',
        action: 'Aggressive Stir',
        technique: '10 vigorous stirs to maximize extraction',
        scienceNote: 'High agitation breaks up clumps and increases extraction rate'
      },
      {
        step: 3,
        time: '1:30',
        action: 'Flip & Press',
        technique: 'Flip and press slowly over 30 seconds',
        scienceNote: 'Slow press prevents channeling and over-extraction'
      }
    ],
    science: {
      extraction: '22-24% for maximum flavor intensity',
      agitation: 'High agitation during steeping maximizes soluble extraction',
      temperature: '88°C prevents bitter extraction from fine grind',
      grind: 'Fine grind increases surface area for high extraction in short time'
    },
    tips: [
      'Use metal filter for fuller body',
      'Dilute with hot water if too intense',
      'Perfect for darker roasts and espresso-style drinks'
    ]
  },
  {
    id: 'aeropress-standard',
    name: 'AeroPress Standard',
    method: 'AeroPress',
    difficulty: 'Beginner',
    brewTime: '2:30',
    targetFlavor: ['Clean', 'Bright', 'Balanced', 'Smooth'],
    description: 'Classic AeroPress method for clean, balanced extraction',
    waterTemp: 85,
    grindSize: 'Medium-Fine',
    ratio: '1:15',
    flavorProfile: 'Clean extraction with good balance of acidity and body',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Standard Setup',
        technique: 'Add coffee, pour to number 2, stir gently',
        scienceNote: 'Standard position allows gravity-assisted extraction'
      },
      {
        step: 2,
        time: '1:00',
        action: 'Steep',
        technique: 'Let steep without disturbance',
        scienceNote: 'Immersion brewing allows even extraction without channeling'
      },
      {
        step: 3,
        time: '2:00',
        action: 'Press',
        technique: 'Press steadily for 30 seconds',
        scienceNote: 'Consistent pressure ensures complete extraction'
      }
    ],
    science: {
      extraction: '18-20% for clean, balanced profile',
      agitation: 'Minimal agitation prevents over-extraction',
      temperature: '85°C provides good extraction without bitterness',
      grind: 'Medium-fine balances extraction speed and clarity'
    },
    tips: [
      'Use paper filter for cleanest cup',
      'Rinse filter to remove paper taste',
      'Great for beginners and daily brewing'
    ]
  },
  {
    id: 'aeropress-cold',
    name: 'AeroPress Cold Brew',
    method: 'AeroPress',
    difficulty: 'Intermediate',
    brewTime: '24:00',
    targetFlavor: ['Smooth', 'Sweet', 'Low-acid', 'Refreshing'],
    description: 'Cold extraction method for smooth, sweet concentrate',
    waterTemp: 20,
    grindSize: 'Coarse',
    ratio: '1:10',
    flavorProfile: 'Cold extraction eliminates acids and bitterness for ultra-smooth concentrate',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Cold Setup',
        technique: 'Add coarse coffee, fill with room temperature water',
        scienceNote: 'Cold water extracts differently, avoiding bitter compounds'
      },
      {
        step: 2,
        time: '0:02',
        action: 'Stir & Steep',
        technique: 'Stir well, refrigerate for 24 hours',
        scienceNote: 'Long extraction compensates for low temperature'
      },
      {
        step: 3,
        time: '24:00',
        action: 'Press & Serve',
        technique: 'Press slowly, dilute 1:1 with cold water or ice',
        scienceNote: 'Slow press prevents over-extraction of concentrate'
      }
    ],
    science: {
      extraction: '15-18% over extended time for sweetness without acidity',
      agitation: 'Initial stir only, then undisturbed steeping',
      temperature: 'Room temperature prevents extraction of bitter compounds',
      grind: 'Coarse grind prevents over-extraction during long steeping'
    },
    tips: [
      'Makes concentrate - dilute before serving',
      'Keep refrigerated, lasts 5-7 days',
      'Perfect for hot weather and low-acid preference'
    ]
  },

  // Espresso Methods
  {
    id: 'espresso-classic',
    name: 'Classic Espresso',
    method: 'Espresso',
    difficulty: 'Expert',
    brewTime: '0:25-0:30',
    targetFlavor: ['Intense', 'Syrupy', 'Balanced', 'Crema'],
    description: 'Traditional espresso extraction for balanced intensity and sweetness',
    waterTemp: 93,
    grindSize: 'Fine',
    ratio: '1:2',
    flavorProfile: 'High-pressure extraction creating concentrated, balanced shot with rich crema',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Dose & Distribute',
        technique: 'Dose 18g, level and distribute evenly',
        scienceNote: 'Even distribution prevents channeling during extraction'
      },
      {
        step: 2,
        time: '0:05',
        action: 'Tamp',
        technique: 'Tamp with 30lbs pressure, level and polish',
        scienceNote: 'Proper tamping creates resistance for optimal extraction pressure'
      },
      {
        step: 3,
        time: '0:10',
        action: 'Extract',
        technique: 'Start extraction, aim for 36g output in 25-30 seconds',
        scienceNote: '9 bars pressure forces water through compressed coffee bed'
      }
    ],
    science: {
      extraction: '18-22% in short time due to high pressure and fine grind',
      agitation: 'No agitation - pressure and grind size control extraction',
      temperature: '93°C optimal for espresso extraction without scalding',
      grind: 'Fine grind creates resistance needed for pressure extraction'
    },
    tips: [
      'Grind adjustment is critical - start coarser if too slow',
      'Look for honey-like flow from portafilter',
      'Crema should be golden-brown and persistent'
    ]
  },
  {
    id: 'espresso-modern',
    name: 'Modern Light Roast Espresso',
    method: 'Espresso',
    difficulty: 'Expert',
    brewTime: '0:30-0:35',
    targetFlavor: ['Bright', 'Fruity', 'Complex', 'Juicy'],
    description: 'Extended extraction optimized for light roast single origins',
    waterTemp: 94,
    grindSize: 'Fine',
    ratio: '1:2.5',
    flavorProfile: 'Extended ratio and time to fully develop light roast complexity and sweetness',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Dose & WDT',
        technique: 'Dose 20g, use WDT tool for even distribution',
        scienceNote: 'WDT breaks up clumps for more even extraction'
      },
      {
        step: 2,
        time: '0:10',
        action: 'Tamp & Pre-infusion',
        technique: 'Light tamp, 5-second pre-infusion at 3 bars',
        scienceNote: 'Pre-infusion allows even saturation before full pressure'
      },
      {
        step: 3,
        time: '0:15',
        action: 'Full Extraction',
        technique: 'Ramp to 9 bars, extract 50g in 30-35 seconds',
        scienceNote: 'Extended time and ratio develops sweetness in light roasts'
      }
    ],
    science: {
      extraction: '20-24% to fully develop light roast complexity',
      agitation: 'WDT provides micro-agitation for even extraction',
      temperature: '94°C higher temperature helps light roast solubility',
      grind: 'Fine but not powder - allows extended extraction without choking'
    },
    tips: [
      'Requires capable grinder for light roast espresso',
      'Taste should be sweet and complex, not sour',
      'May need pressure profiling for best results'
    ]
  },

  // French Press Methods
  {
    id: 'french-press-classic',
    name: 'Classic French Press',
    method: 'French Press',
    difficulty: 'Beginner',
    brewTime: '4:00',
    targetFlavor: ['Full-body', 'Rich', 'Oily', 'Robust'],
    description: 'Traditional immersion method for full-bodied, rich coffee',
    waterTemp: 95,
    grindSize: 'Coarse',
    ratio: '1:15',
    flavorProfile: 'Full immersion with metal filter allows oils and fine particles for maximum body',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Add Coffee & Water',
        technique: 'Add coarse coffee, pour all water, stir once',
        scienceNote: 'Immersion ensures all coffee is in contact with water'
      },
      {
        step: 2,
        time: '0:30',
        action: 'Break Crust',
        technique: 'Break surface crust with spoon, remove foam',
        scienceNote: 'Breaking crust releases trapped gases and aromatics'
      },
      {
        step: 3,
        time: '4:00',
        action: 'Press & Serve',
        technique: 'Press slowly, serve immediately',
        scienceNote: 'Metal filter allows oils through for full body'
      }
    ],
    science: {
      extraction: '20-24% through long immersion time',
      agitation: 'Minimal agitation to avoid over-extraction',
      temperature: '95°C maintains heat throughout long brew time',
      grind: 'Coarse prevents over-extraction and clogging of metal filter'
    },
    tips: [
      'Use timer for consistent results',
      'Serve immediately after pressing',
      'Clean filter regularly for best taste'
    ]
  },
  {
    id: 'french-press-cupping',
    name: 'French Press Cupping Style',
    method: 'French Press',
    difficulty: 'Intermediate',
    brewTime: '4:30',
    targetFlavor: ['Clean', 'Analytical', 'Origin-forward', 'Balanced'],
    description: 'Cupping-inspired method for tasting coffee characteristics clearly',
    waterTemp: 96,
    grindSize: 'Medium-Coarse',
    ratio: '1:16.7',
    flavorProfile: 'Cupping technique allows clear evaluation of coffee characteristics',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Dry Fragrance',
        technique: 'Smell dry coffee grounds before adding water',
        scienceNote: 'Dry fragrance reveals volatiles before extraction'
      },
      {
        step: 2,
        time: '0:30',
        action: 'Wet Aroma & Break',
        technique: 'Pour water, wait 4 minutes, break crust and smell',
        scienceNote: 'Wet aroma shows how extraction is developing'
      },
      {
        step: 3,
        time: '4:30',
        action: 'Skim & Taste',
        technique: 'Skim surface, wait for cool, taste with spoon',
        scienceNote: 'Cooling reveals different flavor compounds at different temperatures'
      }
    ],
    science: {
      extraction: '18-21% optimized for flavor clarity over body',
      agitation: 'Controlled agitation only during crust breaking',
      temperature: '96°C standard cupping temperature for consistency',
      grind: 'Medium-coarse for balanced extraction without over-extraction'
    },
    tips: [
      'Use cupping protocol ratios and timing',
      'Taste at multiple temperatures',
      'Great for coffee evaluation and comparison'
    ]
  },

  // Chemex Methods  
  {
    id: 'chemex-clean',
    name: 'Chemex Ultra Clean',
    method: 'Chemex',
    difficulty: 'Beginner',
    brewTime: '4:00-5:00',
    targetFlavor: ['Clean', 'Bright', 'Tea-like', 'Delicate'],
    description: 'Emphasizes clarity and cleanliness with minimal oils and sediment',
    waterTemp: 95,
    grindSize: 'Medium-Coarse',
    ratio: '1:15',
    flavorProfile: 'Ultra-clean extraction with emphasis on clarity and bright acidity',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Bloom',
        technique: 'Even saturation, no stirring, 45-second bloom',
        scienceNote: 'Thick Chemex filter removes oils and fine particles'
      },
      {
        step: 2,
        time: '0:45',
        action: 'Slow Build',
        technique: 'Very slow spiral pour to avoid disturbing bed',
        scienceNote: 'Slow pour rate allows filter to trap more particles'
      },
      {
        step: 3,
        time: '3:00',
        action: 'Final Drip',
        technique: 'Allow complete drawdown',
        scienceNote: 'Long contact time compensates for coarser grind'
      }
    ],
    science: {
      extraction: '18-20% for clean, bright profile',
      agitation: 'Minimal agitation preserves filter bed integrity',
      temperature: '95°C provides good extraction despite coarse grind',
      grind: 'Coarse grind prevents clogging thick Chemex filter'
    },
    tips: [
      'Rinse filter thoroughly to remove paper taste',
      'Keep water level below rim to maintain flow',
      'Perfect for showcasing origin characteristics'
    ]
  },
  {
    id: 'chemex-rich',
    name: 'Chemex Rich & Sweet',
    method: 'Chemex',
    difficulty: 'Intermediate',
    brewTime: '5:00-6:00',
    targetFlavor: ['Sweet', 'Rich', 'Chocolatey', 'Smooth'],
    description: 'Extended extraction method for maximum sweetness and body',
    waterTemp: 93,
    grindSize: 'Medium',
    ratio: '1:14',
    flavorProfile: 'Longer contact time and higher concentration for sweetness and body',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Aggressive Bloom',
        technique: 'Pour 3x coffee weight, stir twice, 60-second bloom',
        scienceNote: 'Aggressive bloom ensures complete saturation'
      },
      {
        step: 2,
        time: '1:00',
        action: 'Pulsed Pours',
        technique: 'Pour in 4-5 pulses, keeping water level consistent',
        scienceNote: 'Pulsed pours extend contact time for better extraction'
      },
      {
        step: 3,
        time: '4:00',
        action: 'Final Drawdown',
        technique: 'Allow very slow final drawdown',
        scienceNote: 'Extended contact extracts more sugars and body compounds'
      }
    ],
    science: {
      extraction: '20-23% for maximum sweetness extraction',
      agitation: 'Higher agitation during bloom, controlled pours after',
      temperature: '93°C balances extraction with smoothness',
      grind: 'Medium grind slows flow for extended contact time'
    },
    tips: [
      'Patience is key - slow drawdown is desirable',
      'Great for medium to medium-dark roasts',
      'Adjust grind finer if too weak, coarser if too bitter'
    ]
  },

  // Cold Brew Methods
  {
    id: 'cold-brew-concentrate',
    name: 'Cold Brew Concentrate',
    method: 'Cold Brew',
    difficulty: 'Beginner',
    brewTime: '12:00:00',
    targetFlavor: ['Smooth', 'Sweet', 'Chocolatey', 'Low-acid'],
    description: 'Traditional cold brew for smooth concentrate',
    waterTemp: 20,
    grindSize: 'Coarse',
    ratio: '1:8',
    flavorProfile: 'Cold extraction eliminates harsh acids and creates smooth, sweet concentrate',
    steps: [
      {
        step: 1,
        time: '0:00',
        action: 'Combine',
        technique: 'Mix coarse coffee with room temperature water',
        scienceNote: 'Cold water extracts different compounds than hot water'
      },
      {
        step: 2,
        time: '0:05',
        action: 'Steep',
        technique: 'Stir well, cover, steep for 12 hours at room temperature',
        scienceNote: 'Long extraction time compensates for low temperature'
      },
      {
        step: 3,
        time: '12:00:00',
        action: 'Filter & Store',
        technique: 'Filter through fine mesh, store concentrate refrigerated',
        scienceNote: 'Fine filtration removes all particles for smooth concentrate'
      }
    ],
    science: {
      extraction: '15-18% over extended time without heat',
      agitation: 'Initial mixing only, then undisturbed extraction',
      temperature: 'Room temperature prevents bitter compound extraction',
      grind: 'Coarse prevents over-extraction during long steeping'
    },
    tips: [
      'Dilute 1:1 or 2:1 with water or milk before serving',
      'Concentrate keeps 1-2 weeks refrigerated',
      'Can be served hot by adding hot water'
    ]
  }
];

export const getGuidesByMethod = (method: string): BrewingGuide[] => {
  return brewingGuides.filter(guide => guide.method === method);
};

export const getAllMethods = (): string[] => {
  return Array.from(new Set(brewingGuides.map(guide => guide.method)));
};