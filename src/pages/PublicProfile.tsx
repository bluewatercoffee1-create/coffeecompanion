import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus, ArrowLeft, Users, Coffee, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BrewGuidesSection } from '@/components/BrewGuidesSection';

interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  background_url?: string;
  created_at: string;
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Friendship {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'friends' | 'sent'>('none');
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error('User not found');
        navigate('/profile');
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const fetchUserPosts = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const checkFriendshipStatus = async () => {
    if (!user || !userId || user.id === userId) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${user.id})`)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        if (data.status === 'accepted') {
          setFriendshipStatus('friends');
        } else if (data.user_id === user.id) {
          setFriendshipStatus('sent');
        } else {
          setFriendshipStatus('pending');
        }
      } else {
        setFriendshipStatus('none');
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  const sendFriendRequest = async () => {
    if (!user || !userId) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert([{ user_id: user.id, friend_id: userId }]);

      if (error) throw error;
      
      setFriendshipStatus('sent');
      toast.success('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (userId) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          fetchProfile(),
          fetchUserPosts(),
          checkFriendshipStatus()
        ]);
        setLoading(false);
      };
      loadData();
    }
  }, [userId, user]);

  // Redirect to own profile if viewing own user ID
  useEffect(() => {
    if (user && userId === user.id) {
      navigate('/profile');
    }
  }, [user, userId, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Profile Not Found</h1>
        <p className="text-muted-foreground">This user profile could not be found.</p>
        <Button onClick={() => navigate('/profile')} className="mt-4">
          Back to My Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Button>
            <h1 className="text-xl font-semibold">{profile.display_name || 'User Profile'}</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Profile Background */}
      <div 
        className="relative h-64 bg-gradient-to-r from-primary/20 to-primary/40 bg-cover bg-center"
        style={profile.background_url ? { backgroundImage: `url(${profile.background_url})` } : {}}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Avatar & Info */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-foreground md:drop-shadow-none">
                {profile.display_name || 'Coffee Enthusiast'}
              </h2>
              
              {user && user.id !== userId && (
                <Button
                  size="sm"
                  onClick={sendFriendRequest}
                  disabled={friendshipStatus !== 'none'}
                  className={friendshipStatus === 'friends' ? 'bg-green-600' : ''}
                >
                  {friendshipStatus === 'friends' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Friends
                    </>
                  ) : friendshipStatus === 'sent' ? (
                    'Request Sent'
                  ) : friendshipStatus === 'pending' ? (
                    'Request Pending'
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] md:text-muted-foreground md:drop-shadow-none md:font-normal">
              <span>{userPosts.length} Posts</span>
              <span>Member since {new Date(profile.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            {profile.display_name || 'Coffee Enthusiast'}'s Profile
          </h1>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="brewguides">Brew Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">Posts</h2>

              <div className="grid gap-6">
                {userPosts.map((post) => (
                  <Card key={post.id} className="coffee-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Posted {formatDate(post.created_at)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{post.content}</p>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt="Post image"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-muted-foreground">
                          <span>{post.likes_count} likes</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <span>{post.comments_count} comments</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {userPosts.length === 0 && (
                  <Card className="text-center p-8">
                    <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      This user hasn't created any posts yet.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="brewguides">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">Brew Guides</h2>
              <BrewGuidesSection userId={userId!} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};