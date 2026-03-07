import React, { useState, useRef } from "react";
import { Bold, Italic, Underline, X } from "lucide-react";

const BlogEditor = ({ onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("OUTSOURCING");
  const editorRef = useRef(null);

  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = editorRef.current.innerHTML.trim();

    if (!title || !author || !content) {
      alert("All fields are required.");
      return;
    }

    onSubmit({
      title,
      excerpt: content.replace(/<[^>]+>/g, "").slice(0, 150) + "...",
      content,
      category,
      author,
      image: "https://via.placeholder.com/600",
      date: new Date().toISOString(),
	  status: "PUBLISHED",
    });
  };

  return (
    <div className="bg-dark-800 w-full max-w-3xl rounded-3xl shadow-2xl p-8 relative animate-fade-in">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-white"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-6">Create Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-xl bg-dark-900 border border-dark-600 focus:border-primary outline-none"
        />

        {/* Author */}
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-3 rounded-xl bg-dark-900 border border-dark-600 focus:border-primary outline-none"
        />

        {/* Toolbar */}
        <div className="flex gap-2 border border-dark-600 rounded-xl p-2 bg-dark-900">
          <button type="button" onClick={() => formatText("bold")} className="p-2 hover:bg-dark-700 rounded">
            <Bold size={16} />
          </button>
          <button type="button" onClick={() => formatText("italic")} className="p-2 hover:bg-dark-700 rounded">
            <Italic size={16} />
          </button>
          <button type="button" onClick={() => formatText("underline")} className="p-2 hover:bg-dark-700 rounded">
            <Underline size={16} />
          </button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[180px] p-4 rounded-xl bg-dark-900 border border-dark-600 focus:outline-none focus:border-primary overflow-y-auto"
        ></div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-xl bg-dark-900 border border-dark-600 focus:border-primary outline-none"
        >
          <option value="OUTSOURCING">OUTSOURCING</option>
          <option value="TECHNOLOGY">TECHNOLOGY</option>
          <option value="CASE STUDY">CASE STUDY</option>
          <option value="SECURITY">SECURITY</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;