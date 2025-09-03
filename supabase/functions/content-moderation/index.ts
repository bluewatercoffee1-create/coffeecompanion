import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Blacklist of inappropriate words (partial list for demonstration)
const BLACKLISTED_WORDS = [
  // Profanity
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitting', 'shitted', 'shits',
  'bitch', 'bitching', 'bitches',
  'damn', 'damned', 'dammit',
  'hell', 'bloody', 'crap', 'crappy',
  'ass', 'arse', 'asshole', 'arsehole',
  'piss', 'pissed', 'pissing',
  'bastard', 'bastards',
  
  // Racial slurs and discriminatory language
  'nigger', 'nigga', 'nword',
  'chink', 'gook', 'spic', 'wetback',
  'kike', 'hymie', 'sheeny',
  'raghead', 'towelhead', 'sandnigger',
  'cracker', 'honky', 'whitey',
  'beaner', 'greaser', 'coconut',
  'curry', 'dothead', 'paki',
  'jap', 'nip', 'yellow',
  'redskin', 'injun', 'savage',
  
  // Hate speech terms
  'faggot', 'fag', 'dyke', 'tranny',
  'retard', 'retarded', 'spastic',
  'nazi', 'hitler', 'genocide',
  
  // Additional offensive terms
  'whore', 'slut', 'hooker', 'prostitute',
  'gay' // when used as derogatory
].map(word => word.toLowerCase());

function containsBlacklistedWord(text: string): { isBlacklisted: boolean; foundWord?: string } {
  const normalizedText = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Check for exact word matches (with word boundaries)
  for (const word of BLACKLISTED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return { isBlacklisted: true, foundWord: word };
    }
    
    // Also check for the word with common character substitutions
    const leetWord = word
      .replace(/a/g, '@')
      .replace(/e/g, '3')
      .replace(/i/g, '1')
      .replace(/o/g, '0')
      .replace(/s/g, '$');
    
    const leetRegex = new RegExp(`\\b${leetWord}\\b`, 'i');
    if (leetRegex.test(normalizedText)) {
      return { isBlacklisted: true, foundWord: word };
    }
  }

  return { isBlacklisted: false };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { text, context = 'general' } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Content moderation check for context: ${context}, text length: ${text.length}`);

    const moderationResult = containsBlacklistedWord(text);

    if (moderationResult.isBlacklisted) {
      console.log(`Blocked content in ${context}: found word "${moderationResult.foundWord}"`);
      
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: 'Content contains inappropriate language',
          context
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Content approved for ${context}`);

    return new Response(
      JSON.stringify({
        allowed: true,
        context
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Content moderation error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})