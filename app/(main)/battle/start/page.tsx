"use client";

import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useSearchParams, useRouter } from 'next/navigation';

const CodeBattlePage: React.FC = () => {
  const searchParams = useSearchParams(); // Hook to get query params
  const router = useRouter();

  const name = searchParams.get('name') || 'Player 1';
  const opponent = searchParams.get('opponent') || 'Opponent';
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const editorRef = useRef<any>(null); // Explicitly define the type as 'any' to avoid TypeScript errors

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      alert('Time is up!');
      router.push('/'); // Go back to homepage after time runs out
    }
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const logContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{name} vs {opponent}</h2>
          <div className="text-xl font-bold">Time Left: {formatTime(timeLeft)}</div>
        </div>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Your Coding Challenge</h3>
          <p className="mt-2">Write a function that reverses a string without using built-in methods.</p>
        </div>

        <Editor
          apiKey="yzar68kgun2pxkz9v08pu0nckfxueozsktn6raoie3muvl0g"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue="<p>// Start coding here...</p>"
          init={{
            height: 400,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />

        <button
          onClick={logContent}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-blue-700"
        >
          Log Code Content
        </button>
      </div>
    </div>
  );
};

export default CodeBattlePage;
