import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

export interface PostComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

export const useProfileData = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [postLikes, setPostLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_posts')
        .select(`
          *,
          profiles(display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const fetchUserPosts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_posts')
        .select(`
          *,
          profiles(display_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load your posts');
    }
  };

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friendships_friend_id_fkey(display_name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setFriends(data || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles!friendships_user_id_fkey(display_name)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      setFriendRequests(data || []);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchPostLikes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const likeSet = new Set(data?.map(like => like.post_id) || []);
      setPostLikes(likeSet);
    } catch (error) {
      console.error('Error fetching post likes:', error);
    }
  };

  const createPost = async (postData: { title: string; content: string; image_url?: string }) => {
    if (!user) {
      toast.error('Please sign in to create a post');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_posts')
        .insert([{
          ...postData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Post created successfully!');
      await Promise.all([fetchPosts(), fetchUserPosts()]);
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const togglePostLike = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    const isLiked = postLikes.has(postId);
    
    try {
      if (isLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) throw error;
        
        setPostLikes(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert([{ user_id: user.id, post_id: postId }]);

        if (error) throw error;
        
        setPostLikes(prev => new Set([...prev, postId]));
      }
      
      // Refresh posts to update like counts
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling post like:', error);
      toast.error('Failed to update like');
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
      
      toast.success('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Friend request accepted!');
      await Promise.all([fetchFriends(), fetchFriendRequests()]);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Friend request rejected');
      await fetchFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPosts(), 
        fetchUserPosts(), 
        fetchFriends(),
        fetchFriendRequests(),
        fetchPostLikes()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    posts,
    userPosts,
    friends,
    friendRequests,
    postLikes,
    loading,
    createPost,
    togglePostLike,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    refetch: () => Promise.all([
      fetchPosts(), 
      fetchUserPosts(), 
      fetchFriends(),
      fetchFriendRequests(),
      fetchPostLikes()
    ])
  };
};