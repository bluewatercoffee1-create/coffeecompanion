import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, UserPlus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
}

export const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .ilike('display_name', `%${searchTerm}%`)
        .neq('id', user?.id || '')
        .limit(10);

      if (error) throw error;
      
      // Filter out users who are already friends or have pending requests
      const { data: existingRelations, error: relationError } = await supabase
        .from('friendships')
        .select('friend_id, user_id')
        .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`);

      if (relationError) throw relationError;

      const relatedUserIds = new Set(
        existingRelations?.flatMap(rel => [rel.user_id, rel.friend_id]) || []
      );

      const filteredResults = (data || []).filter(profile => 
        !relatedUserIds.has(profile.id)
      );

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) {
      toast.error('Please sign in to send friend requests');
      return;
    }

    try {
      const { error } = await supabase
        .from('friendships')
        .insert([{ user_id: user.id, friend_id: friendId }]);

      if (error) throw error;
      
      setSentRequests(prev => new Set([...prev, friendId]));
      toast.success('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by display name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {searchResults.map((profile) => (
          <Card key={profile.id} className="coffee-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {profile.display_name || 'Coffee Enthusiast'}
                    </h3>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => sendFriendRequest(profile.id)}
                  disabled={sentRequests.has(profile.id)}
                  className={sentRequests.has(profile.id) ? 'bg-gray-400' : ''}
                >
                  {sentRequests.has(profile.id) ? (
                    'Sent'
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {searchTerm && searchResults.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No users found matching "{searchTerm}"</p>
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Search for users by their display name</p>
          </div>
        )}
      </div>
    </div>
  );
};