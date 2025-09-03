import { CoffeeEntry } from "@/hooks/useCoffeeData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CoffeeEntryFormProps {
  onSubmit: (e: React.FormEvent, entryId?: string) => void;
  isSubmitting: boolean;
  editingEntry?: CoffeeEntry | null;
  onCancel?: () => void;
}

export const CoffeeEntryForm = ({ onSubmit, isSubmitting, editingEntry, onCancel }: CoffeeEntryFormProps) => {
  return (
    <form onSubmit={(e) => onSubmit(e, editingEntry?.id)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="coffeeName">Coffee Name *</Label>
          <Input
            id="coffeeName"
            name="coffeeName"
            defaultValue={editingEntry?.coffee_name || ""}
            placeholder="Ethiopian Yirgacheffe"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="roaster">Roaster *</Label>
          <Input
            id="roaster"
            name="roaster"
            defaultValue={editingEntry?.roaster || ""}
            placeholder="Blue Bottle Coffee"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            name="origin"
            defaultValue={editingEntry?.origin || ""}
            placeholder="Ethiopia, Yirgacheffe"
          />
        </div>
        
        <div>
          <Label htmlFor="process">Process</Label>
          <Select name="process" defaultValue={editingEntry?.process || ""}>
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
          <Select name="roastLevel" defaultValue={editingEntry?.roast_level || ""}>
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
          <Select name="brewMethod" defaultValue={editingEntry?.brew_method || ""}>
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
            defaultValue={editingEntry?.grind_size || ""}
            placeholder="Medium-Fine"
          />
        </div>
        
        <div>
          <Label htmlFor="waterTemp">Water Temperature (°C)</Label>
          <Input
            id="waterTemp"
            name="waterTemp"
            type="number"
            defaultValue={editingEntry?.water_temp || ""}
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
            defaultValue={editingEntry?.brew_time || ""}
            placeholder="2:45"
          />
        </div>
        
        <div>
          <Label htmlFor="ratio">Ratio</Label>
          <Input
            id="ratio"
            name="ratio"
            defaultValue={editingEntry?.ratio || ""}
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
            defaultValue={editingEntry?.rating || ""}
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
            defaultValue={editingEntry?.price || ""}
            placeholder="24.99"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="flavorProfile">Flavor Profile (comma-separated)</Label>
        <Input
          id="flavorProfile"
          name="flavorProfile"
          defaultValue={editingEntry?.flavor_profile?.join(", ") || ""}
          placeholder="Floral, Citrus, Tea-like, Bright"
        />
      </div>
      
      <div>
        <Label htmlFor="tastingNotes">Tasting Notes</Label>
        <Textarea
          id="tastingNotes"
          name="tastingNotes"
          defaultValue={editingEntry?.tasting_notes || ""}
          placeholder="Describe the flavor, aroma, and overall experience..."
          rows={3}
        />
      </div>
      
      <div className="flex space-x-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {editingEntry ? "Updating Entry..." : "Adding Entry..."}
            </>
          ) : (
            editingEntry ? "Update Coffee Entry" : "Add Coffee Entry"
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};