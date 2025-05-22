'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }
);

// Import Quill styles
import 'react-quill/dist/quill.snow.css';
import './editor.css';

// Toolbar options for the editor
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean'],
    [{ 'align': [] }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
  ],
};

// Placeholder formatting options
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link',
  'align',
  'indent',
];

const RichTextEditor = ({ value, onChange, placeholder = 'Write something...' }) => {
  // State for React Quill value with client-side initialization
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state to true when component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle editor change
  const handleChange = (content) => {
    onChange(content);
  };

  // Only render ReactQuill on client
  if (!mounted) {
    return <div className="min-h-[150px] border rounded p-2 bg-gray-50">Loading editor...</div>;
  }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      className="min-h-[200px]"
    />
  );
};

export default RichTextEditor; 