import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Music,
  Type,
  Smile,
  Sparkles,
  Subtitles,
  Sliders,
  Check,
  Video,
  StopCircle,
  HelpCircle,
  Film,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/seedData';
import { FeedCategory, QuizQuestion } from '../types';

export const VideoCreatorModal: React.FC = () => {
  const { createModalOpen, setCreateModalOpen, addVideo, setActiveFeedTab, setCurrentScreen } = useApp();
  const { currentUser } = useAuth();

  // Mode: 'record' or 'upload'
  const [sourceMode, setSourceMode] = useState<'record' | 'upload'>('upload');
  const [durationLimit, setDurationLimit] = useState<15 | 30 | 60 | 180>(30);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Video media
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80');

  // Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeedCategory>('Science');
  const [hashtags, setHashtags] = useState<string>('#Science #Learning #EduShorts');
  const [musicTitle, setMusicTitle] = useState('Original Audio - ' + currentUser.name);

  // Editing overlays
  const [activeFilter, setActiveFilter] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [hasSubtitles, setHasSubtitles] = useState(true);
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 30]);

  // Quiz attachment
  const [attachQuiz, setAttachQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState<[string, string, string, string]>([
    'Option A',
    'Option B',
    'Option C',
    'Option D'
  ]);
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(1);
  const [quizExplanation, setQuizExplanation] = useState('');

  // Recording Stream Ref
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Stop camera when closing
  useEffect(() => {
    if (!createModalOpen) {
      stopCamera();
    }
  }, [createModalOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        cameraVideoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable in sandbox, falling back to simulated studio preview:', err);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    recordedChunksRef.current = [];

    if (mediaStreamRef.current) {
      try {
        const recorder = new MediaRecorder(mediaStreamRef.current);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          setPreviewVideoUrl(url);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.warn('MediaRecorder error:', err);
      }
    }

    timerRef.current = window.setInterval(() => {
      setRecordSeconds((sec) => {
        if (sec >= durationLimit - 1) {
          handleStopRecording();
          return durationLimit;
        }
        return sec + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewVideoUrl(url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your educational reel.');
      return;
    }

    const tagList = hashtags
      .split(' ')
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    let attachedQuizData: QuizQuestion | undefined = undefined;
    if (attachQuiz && quizQuestion.trim()) {
      attachedQuizData = {
        id: `quiz_${Date.now()}`,
        question: quizQuestion.trim(),
        options: quizOptions,
        correctIndex: quizCorrectIdx,
        explanation: quizExplanation.trim() || 'Great job answering correctly!',
        points: 50,
        category
      };
    }

    await addVideo({
      title: title.trim(),
      description: description.trim() || 'Watch and learn in 60 seconds with ' + currentUser.name,
      videoUrl: previewVideoUrl,
      thumbnailUrl: thumbnailUrl,
      creatorId: currentUser.id,
      creator: currentUser,
      category,
      hashtags: tagList.length > 0 ? tagList : ['#Education', '#Learning'],
      musicTitle,
      duration: durationLimit,
      filterEffect: activeFilter,
      quiz: attachedQuizData
    });

    stopCamera();
    setCreateModalOpen(false);
    setActiveFeedTab('latest');
    setCurrentScreen('home');
  };

  const STICKER_OPTIONS = ['🧠 Fact', '💡 Quiz Inside', '🔥 Trending', '📚 Exam Prep', '⭐ Pro Tip', '🎯 Must Know'];
  const FILTER_OPTIONS = [
    { name: 'Normal', class: '' },
    { name: 'Vibrant', class: 'contrast-125 saturate-150' },
    { name: 'Warm Sunset', class: 'sepia-[0.3] hue-rotate-15' },
    { name: 'Cyber Noir', class: 'grayscale contrast-125' },
    { name: 'Glow Tech', class: 'brightness-110 contrast-110' }
  ];
  const MUSIC_TRACKS = [
    'Original Audio - ' + currentUser.name,
    'Study Beats - Lo-Fi Chill',
    'Epic Knowledge - Orchestral',
    'Tech Synthwave - Futuristic',
    'Vedic Flute - Calming Focus'
  ];

  if (!createModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Creator Studio • Short Video
              </h2>
              <p className="text-xs text-zinc-400">
                Record, edit, attach quiz & share knowledge with the community
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setCreateModalOpen(false);
            }}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Duration Selector */}
          <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
            <span className="text-xs font-semibold text-zinc-300">Video Duration:</span>
            <div className="flex items-center gap-2">
              {([15, 30, 60, 180] as const).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDurationLimit(dur)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    durationLimit === dur
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {dur >= 60 ? `${dur / 60}m` : `${dur}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs: Camera vs Upload */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSourceMode('record');
                startCamera();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                sourceMode === 'record'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Record with Camera</span>
            </button>

            <button
              onClick={() => {
                setSourceMode('upload');
                stopCamera();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                sourceMode === 'upload'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload from Gallery</span>
            </button>
          </div>

          {/* Video Preview & Canvas viewport */}
          <div className="relative w-full aspect-[9/10] sm:aspect-[16/10] bg-black rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
            {sourceMode === 'record' ? (
              <video
                ref={cameraVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${activeFilter}`}
              />
            ) : (
              <video
                src={previewVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover ${activeFilter}`}
              />
            )}

            {/* Sticker overlay on preview */}
            {selectedSticker && (
              <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg border border-white/20 animate-pulse">
                {selectedSticker}
              </div>
            )}

            {/* Text overlay on preview */}
            {overlayText && (
              <div className="absolute bottom-16 left-4 right-4 text-center">
                <span className="bg-black/70 backdrop-blur-sm text-white font-extrabold text-sm sm:text-base px-4 py-1.5 rounded-xl border border-white/20 shadow-xl inline-block">
                  {overlayText}
                </span>
              </div>
            )}

            {/* Captions Preview */}
            {hasSubtitles && (
              <div className="absolute bottom-6 left-4 right-4 text-center">
                <span className="bg-amber-400/90 text-black font-mono font-bold text-xs px-2.5 py-0.5 rounded shadow">
                  [CC] {title ? `"${title}"` : 'Auto-generated educational subtitles'}
                </span>
              </div>
            )}

            {/* Recording Controls in Camera Mode */}
            {sourceMode === 'record' && (
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="w-14 h-14 rounded-full bg-rose-500 border-4 border-white flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
                    title="Start Recording"
                  >
                    <div className="w-5 h-5 rounded-full bg-white" />
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="w-14 h-14 rounded-full bg-red-600 border-4 border-white flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform animate-pulse"
                    title="Stop Recording"
                  >
                    <StopCircle className="w-8 h-8" />
                  </button>
                )}
                {isRecording && (
                  <span className="bg-black/60 backdrop-blur-sm text-red-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-red-500/30">
                    {recordSeconds}s / {durationLimit}s
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Upload File Input */}
          {sourceMode === 'upload' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <span className="text-xs text-zinc-400">Select MP4/WebM video file from device:</span>
              <label className="cursor-pointer px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
                <Film className="w-4 h-4 text-rose-400" />
                <span>Browse Files</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Creative Studio Overlays Toolset */}
          <div className="space-y-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Editing & Overlay Tools</span>
            </h4>

            {/* Filter Effects */}
            <div>
              <span className="text-xs text-zinc-400 block mb-1.5 font-medium">Visual Filter:</span>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFilter(f.class)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      activeFilter === f.class
                        ? 'bg-rose-500 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Overlay */}
            <div>
              <span className="text-xs text-zinc-400 block mb-1.5 font-medium">Custom Text Overlay:</span>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="e.g. 5 Science Secrets in 30s!"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Stickers / Badges */}
            <div>
              <span className="text-xs text-zinc-400 block mb-1.5 font-medium">Stickers & Callouts:</span>
              <div className="flex flex-wrap gap-2">
                {STICKER_OPTIONS.map((stk) => (
                  <button
                    key={stk}
                    onClick={() => setSelectedSticker(selectedSticker === stk ? null : stk)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      selectedSticker === stk
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitles & Music Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-xs text-zinc-400 block mb-1.5 font-medium">Audio / Soundtrack:</span>
                <select
                  value={musicTitle}
                  onChange={(e) => setMusicTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {MUSIC_TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs text-zinc-300 font-medium">Auto Subtitles [CC]</span>
                <button
                  type="button"
                  onClick={() => setHasSubtitles(!hasSubtitles)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    hasSubtitles ? 'bg-rose-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      hasSubtitles ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Video Metadata Form */}
          <div className="space-y-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Educational Details & Category
            </h4>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Reel Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How Photosynthesis Powers All Life on Earth"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the key takeaways, formulas, or retention summary..."
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedCategory)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">Hashtags</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#Science #Physics #ExamPrep"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Interactive Quiz Builder */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Attach In-Video Quiz Question</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachQuiz(!attachQuiz)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  attachQuiz ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    attachQuiz ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {attachQuiz && (
              <div className="space-y-3 pt-2 border-t border-zinc-800 animate-in fade-in">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    placeholder="e.g. What is the chemical formula for water?"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {quizOptions.map((opt, idx) => (
                    <div key={idx}>
                      <label className="text-[11px] text-zinc-400 flex items-center justify-between mb-0.5">
                        <span>Option {['A', 'B', 'C', 'D'][idx]}</span>
                        <button
                          type="button"
                          onClick={() => setQuizCorrectIdx(idx)}
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            quizCorrectIdx === idx
                              ? 'bg-emerald-500 text-white'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {quizCorrectIdx === idx ? '✓ Correct' : 'Mark Correct'}
                        </button>
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const copy = [...quizOptions] as [string, string, string, string];
                          copy[idx] = e.target.value;
                          setQuizOptions(copy);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Answer Explanation</label>
                  <input
                    type="text"
                    value={quizExplanation}
                    onChange={(e) => setQuizExplanation(e.target.value)}
                    placeholder="Explain why this answer is correct..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <button
            onClick={() => {
              stopCamera();
              setCreateModalOpen(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handlePublish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Educational Reel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
