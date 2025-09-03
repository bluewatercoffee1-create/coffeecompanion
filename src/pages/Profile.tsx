import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, MessageCircle, Plus, UserPlus, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = () => {
  const { user } = useAuth();
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

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });
  const [activeTab, setActiveTab] = useState('feed');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Profile</h1>
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in title and content');
      return;
    }

    const result = await createPost(newPost);
    if (result) {
      setNewPost({ title: '', content: '', image_url: '' });
      setShowCreatePost(false);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Coffee Community</h1>
        <p className="text-muted-foreground text-lg">Connect with fellow coffee enthusiasts</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-8">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="myposts">My Posts</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Community Feed</h2>
              <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="What's on your mind?"
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
                    <div>
                      <Label htmlFor="image">Image URL (optional)</Label>
                      <Input
                        id="image"
                        value={newPost.image_url}
                        onChange={(e) => setNewPost(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreatePost}>Create Post</Button>
                      <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="coffee-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          By {post.profiles?.display_name || 'Anonymous'} • {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePostLike(post.id)}
                        className={`${postLikes.has(post.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${postLikes.has(post.id) ? 'fill-current' : ''}`} />
                        {post.likes_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments_count}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && (
                <Card className="text-center p-8">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="myposts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">My Posts</h2>
              <Button onClick={() => setShowCreatePost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            <div className="grid gap-6">
              {userPosts.map((post) => (
                <Card key={post.id} className="coffee-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Posted {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
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
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes_count} likes
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments_count} comments
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {userPosts.length === 0 && (
                <Card className="text-center p-8">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven't created any posts yet.
                  </p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="friends">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Friends</h2>
              <Badge variant="secondary">{friends.length} friends</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friendship) => (
                <Card key={friendship.id} className="coffee-card">
                  <CardContent className="p-4 text-center">
                    <User className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">
                      {friendship.profiles?.display_name || 'Coffee Friend'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Friends since {formatDate(friendship.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {friends.length === 0 && (
                <Card className="col-span-full text-center p-8">
                  <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No friends yet. Start connecting with other coffee enthusiasts!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Friend Requests</h2>
              <Badge variant="secondary">{friendRequests.length} pending</Badge>
            </div>

            <div className="grid gap-4">
              {friendRequests.map((request) => (
                <Card key={request.id} className="coffee-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-10 w-10 text-primary" />
                        <div>
                          <h3 className="font-semibold">
                            {request.profiles?.display_name || 'Coffee Friend'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Sent {formatDate(request.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptFriendRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectFriendRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {friendRequests.length === 0 && (
                <Card className="text-center p-8">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No pending friend requests.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};