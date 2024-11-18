
import VideoPlayer from './components/VideoPlayer'
import TextCarousel from './components/TextCarousel';
import { useState } from 'react';
import PDFUploader from './components/PdfUploader';
export default function Home() {

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const carouselItems = [
    '100+ Languages',
    'PDF to MP4',
    'AI Powered',
    'More Features Coming Soon',

  ];

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const timestamp = new Date().getTime();
        setVideoUrl(`${import.meta.env.VITE_BACKEND_URL}${data.video_url}?t=${timestamp}`);
      } else {
        // Handle error
        console.error('Failed to upload file.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="flex flex-col md:flex-row gap-8 justify-center container m-auto px-4 py-8 bg-background text-foreground">
          <div className="flex justify-center">
          {videoUrl ? (
  <VideoPlayer src={videoUrl} muted={false} />
) : (
  <VideoPlayer src="/demo.mp4" muted={true} />
  
)}
          </div>
          
          <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-center">
            <TextCarousel items={carouselItems} animationDuration={35} />
            <h2 className="text-3xl font-bold">Transform PDFs into Viral Shorts!</h2>
            <p className="text-xl text-muted-foreground">
              Unleash your content's potential with AI-powered video summaries.
            </p>
            {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-2xl">Processing your video, please wait...</p>
          </div>
        ) : (
          <PDFUploader onUpload={handleFileUpload} />
        )}
          </div>
        </div>
  )
}