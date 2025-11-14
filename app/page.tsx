'use client';

import { useState } from 'react';
import { Sparkles, Download, Copy, RefreshCw, Linkedin } from 'lucide-react';

interface GeneratedContent {
  post: string;
  imageUrl: string;
  topic: string;
}

export default function Home() {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating content:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (content) {
      await navigator.clipboard.writeText(content.post);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadImage = () => {
    if (content) {
      const link = document.createElement('a');
      link.href = content.imageUrl;
      link.download = `linkedin-ai-post-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Linkedin className="w-12 h-12 text-linkedin-blue" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI Content Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate engaging LinkedIn posts about trending AI topics with custom images.
            One click, ready to publish.
          </p>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={generateContent}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-linkedin-blue text-white text-lg font-semibold rounded-lg hover:bg-linkedin-hover transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Today's Post
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Generated Content */}
        {content && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            {/* Post Content */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Your Post</h2>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">Topic:</p>
                <p className="text-blue-700">{content.topic}</p>
              </div>

              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                  {content.post}
                </pre>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linkedin-blue text-white rounded-lg hover:bg-linkedin-hover transition-colors font-semibold"
                >
                  <Copy className="w-4 h-4" />
                  Copy Post
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Your Image</h2>
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={content.imageUrl}
                  alt="Generated AI content"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {!content && !loading && (
          <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How it works</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-linkedin-blue font-bold">1.</span>
                <span>AI analyzes current trending topics in artificial intelligence</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-linkedin-blue font-bold">2.</span>
                <span>Generates an engaging, professional LinkedIn post optimized for maximum engagement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-linkedin-blue font-bold">3.</span>
                <span>Creates a relevant, eye-catching image to accompany your post</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-linkedin-blue font-bold">4.</span>
                <span>Copy the post text and download the image - ready to publish!</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
