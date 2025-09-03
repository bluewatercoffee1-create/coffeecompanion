import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, MessageCircle, Plus, Check, X, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';
import { BrewGuidesSection } from '@/components/BrewGuidesSection';
import { FriendSearch } from '@/components/FriendSearch';
import MobileHeader from '@/components/MobileHeader';

export const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    posts,
    userPosts,
    friends,
    friendRequests,
    postLikes,
    loading,
    createPost,
    togglePostLike,
    acceptFriendRequest,
    rejectFriendRequest
  } = useProfileData();

  const {
    profile,
    loading: profileLoading,
    updateProfile,
    updateAvatar,
    updateBackground
  } = useProfile();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });
  const [activeTab, setActiveTab] = useState('feed');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editingProfile, setEditingProfile] = useState({ display_name: '' });

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    try {
      await createPost({
        title: newPost.title,
        content: newPost.content,
        image_url: newPost.image_url || null
      });
      setNewPost({ title: '', content: '', image_url: '' });
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleProfileUpdate = async () => {
    if (!editingProfile.display_name.trim()) return;
    
    try {
      await updateProfile({ display_name: editingProfile.display_name });
      setShowProfileEdit(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <MobileHeader
        title="Profile"
        showBack={true}
        onBack={() => navigate('/')}
        onSignOut={() => {
          signOut();
        }}
      />

      {/* Content */}
      <div className="pt-14 px-4">
        {/* Profile Header */}
        <div className="text-center py-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
              <User className="h-12 w-12 text-primary" />
            </div>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
              onClick={() => {
                setEditingProfile({ display_name: profile?.display_name || '' });
                setShowProfileEdit(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">
            {profile?.display_name || 'Coffee Lover'}
          </h1>
          
          {user?.email === 'creator@example.com' && (
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-coffee-gold to-coffee-orange text-white">
              Creator ✨
            </Badge>
          )}
          
          <div className="flex justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{userPosts.length}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{friends.length}</div>
              <div className="text-sm text-muted-foreground">Friends</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="feed" className="text-xs">Feed</TabsTrigger>
            <TabsTrigger value="posts" className="text-xs">My Posts</TabsTrigger>
            <TabsTrigger value="friends" className="text-xs">Friends</TabsTrigger>
            <TabsTrigger value="guides" className="text-xs">Guides</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="w-full h-12 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Share your coffee journey
            </Button>

            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {post.profiles?.display_name || 'Coffee Friend'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePostLike(post.id)}
                      className={`p-2 ${postLikes[post.id] ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${postLikes[post.id] ? 'fill-current' : ''}`} />
                      <span className="text-xs">{post.likes_count || 0}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="p-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">0</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Your Coffee Stories</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Share your brewing adventures with the community
              </p>
              <Button onClick={() => setShowCreatePost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" />
                      {post.likes_count || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="space-y-4">
              <FriendSearch />
              
              {friendRequests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Friend Requests</h3>
                  {friendRequests.map((request) => (
                    <Card key={request.id} className="mb-3">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {request.profiles?.display_name || 'Coffee Friend'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(request.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => acceptFriendRequest(request.id)}
                              className="h-8 px-3"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectFriendRequest(request.id)}
                              className="h-8 px-3"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3 text-sm">Your Coffee Friends ({friends.length})</h3>
                
                <div className="space-y-3">
                  {friends.map((friendship) => {
                    const friendId = friendship.user_id === user?.id ? friendship.friend_id : friendship.user_id;
                    
                    return (
                      <Card 
                        key={friendship.id} 
                        className="cursor-pointer transition-all active:scale-95"
                        onClick={() => navigate(`/profile/${friendId}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {friendship.profiles?.display_name || 'Coffee Friend'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Friends since {formatDate(friendship.created_at)}
                                </div>
                              </div>
                            </div>
                            <div className="text-muted-foreground">
                              <Users className="h-4 w-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {friends.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No friends yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Search for coffee enthusiasts to connect with!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides">
            <BrewGuidesSection userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Share Your Coffee Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's brewing?"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your coffee experience..."
                rows={4}
              />
            </div>
            <Button 
              onClick={handleCreatePost}
              disabled={!newPost.title.trim() || !newPost.content.trim()}
              className="w-full"
            >
              Share Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Edit Dialog */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editingProfile.display_name}
                onChange={(e) => setEditingProfile(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="Your display name"
              />
            </div>
            <Button 
              onClick={handleProfileUpdate}
              disabled={!editingProfile.display_name.trim()}
              className="w-full"
            >
              Update Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};