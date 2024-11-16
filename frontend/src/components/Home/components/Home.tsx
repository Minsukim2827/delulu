
import { Upload } from 'lucide-react' 
import VideoPlayer from './VideoPlayer'
import TextCarousel from './TextCarousel';

export default function Home() {

  const carouselItems = [
    '100+ Languages',
    'PDF to MP4',
    'AI Powered',
    'More Features Coming Soon',

  ];

  return (
        <div className="flex flex-col md:flex-row gap-8 justify-center container m-auto px-4 py-8 bg-background text-foreground">
          <div className="flex justify-end">
          <VideoPlayer src="/demo.mp4"/>
          </div>
          <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-center">
            <TextCarousel items={carouselItems} animationDuration={35} />
            <h2 className="text-3xl font-bold">Transform PDFs into Viral Shorts!</h2>
            <p className="text-xl text-muted-foreground">
              Unleash your content's potential with AI-powered video summaries.
            </p>
            <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors w-96">
              <Upload className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
              <p>Drag-and-drop a PDF or click here</p>
            </div>
          </div>
        </div>
  )
}