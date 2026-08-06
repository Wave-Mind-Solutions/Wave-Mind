import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, Square, Mic, MicOff, Paperclip, Image as ImageIcon, X, 
  Sparkles, FileText, Plus
} from 'lucide-react';

export default function ChatInput({ onSendMessage, isGenerating, onStopGenerating }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto resize textarea while keeping ideal initial height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${Math.max(32, newHeight)}px`;
    }
  }, [input]);

  // Speech Recognition
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!isListening) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setInput(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', file: f }))]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview({ name: file.name, url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0 && !imagePreview) || isGenerating) return;

    onSendMessage({
      text: input.trim(),
      files: attachedFiles,
      image: imagePreview
    });

    setInput('');
    setAttachedFiles([]);
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = (input.trim() || attachedFiles.length > 0 || imagePreview) && !isGenerating;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 z-20 font-sans">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        className="hidden" 
        accept=".pdf,.txt,.docx,.js,.jsx,.ts,.tsx,.json" 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageChange} 
        className="hidden" 
        accept="image/*" 
      />

      {/* Primary Input Container with 64-72px height, 20px radius, Glassmorphism & Focus Glow */}
      <form 
        onSubmit={handleSubmit}
        className={`relative rounded-[20px] transition-all duration-300 backdrop-blur-2xl bg-[#0b081c]/90 border ${
          isFocused 
            ? 'border-purple-500/70 shadow-[0_0_35px_rgba(168,85,247,0.3)] ring-1 ring-purple-500/40' 
            : 'border-purple-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:border-purple-500/45'
        } p-3 sm:p-3.5`}
      >
        {/* Previews Bar */}
        <AnimatePresence>
          {(attachedFiles.length > 0 || imagePreview) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2.5 px-2 pt-1 pb-2.5 border-b border-purple-500/15 mb-2.5"
            >
              {imagePreview && (
                <div className="relative group rounded-xl overflow-hidden border border-purple-500/40 w-14 h-14 bg-black/40">
                  <img src={imagePreview.url} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {attachedFiles.map((f, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs font-medium text-purple-200"
                >
                  <FileText className="w-4 h-4 shrink-0 text-purple-400" />
                  <span className="truncate max-w-[140px]">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="hover:text-red-400 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speech Recognition Active Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between px-3.5 py-2 mb-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Listening... Speak into your microphone now</span>
              </div>
              <button 
                type="button" 
                onClick={toggleVoiceInput}
                className="text-xs text-purple-300 hover:text-white font-semibold underline"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar: Attachment, Textarea, Voice, Send Button */}
        <div className="flex items-center gap-3 min-h-[48px] sm:min-h-[52px]">
          {/* Attachment / File Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach Document or File"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/15 transition-all"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>
            
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              title="Upload Image"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/15 transition-all hidden sm:flex"
            >
              <ImageIcon className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Text Area Input with Breathing Room & Larger Font */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about AI, automation, software, or your business..."
            className="w-full bg-transparent text-white placeholder-purple-300/40 text-base sm:text-lg px-2 py-1.5 outline-none resize-none min-h-[40px] max-h-[180px] leading-relaxed font-sans"
          />

          {/* Right Actions: Voice & Circular Gradient Send */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Voice Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title="Voice Input"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 animate-pulse' 
                  : 'text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/15'
              }`}
            >
              {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </button>

            {/* Circular Gradient Send / Stop Button - Larger 11x11 Size */}
            {isGenerating ? (
              <motion.button
                type="button"
                onClick={onStopGenerating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Stop Generating"
                className="w-11 h-11 rounded-full bg-purple-900/80 border border-purple-400/40 text-white flex items-center justify-center hover:bg-purple-800 transition-all shadow-md"
              >
                <Square className="w-4 h-4 fill-current text-purple-200" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.08 } : {}}
                whileTap={canSubmit ? { scale: 0.94 } : {}}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  !canSubmit
                    ? 'bg-purple-950/40 text-purple-400/30 border border-purple-500/10 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] hover:shadow-[0_0_32px_rgba(168,85,247,0.65)] border border-purple-300/30'
                }`}
              >
                <ArrowUp className="w-5.5 h-5.5 stroke-[2.5]" />
              </motion.button>
            )}
          </div>
        </div>
      </form>

      {/* Subtext Disclaimer */}
      <p className="text-[11px] text-center text-purple-300/45 mt-2.5 font-medium tracking-wide">
        WaveMind AI enterprise engine. Double check critical outputs.
      </p>
    </div>
  );
}


