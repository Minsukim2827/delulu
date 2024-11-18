import os
from pathlib import Path
from openai import OpenAI
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.conf import settings
from PyPDF2 import PdfReader
from moviepy.editor import vfx, VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip
from pydub import AudioSegment
from moviepy.config import change_settings
import PIL



IMAGEMAGICK_BINARY = os.getenv('IMAGEMAGICK_BINARY', 'C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\\magick.exe')
change_settings({"IMAGEMAGICK_BINARY": IMAGEMAGICK_BINARY})
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@api_view(['POST'])
def upload_pdf(request):
    print("uploading pdf")
    if 'pdf' not in request.FILES:
        return JsonResponse({'error': 'No file provided.'}, status=400)

    pdf_file = request.FILES['pdf']
    # Extract text from the PDF
    print("extracting text")
    text = extract_text_from_pdf(pdf_file)
    print("text extraction successful")
    # Summarize the text
    print("summarizing text")
    summary = summarize_text(text)
    print("summarization successful")
    # Generate the video
    print("generating video")
    video_url = generate_video_with_subtitles(summary)
    print("generating video successful")
    return JsonResponse({'video_url': video_url})

def extract_text_from_pdf(pdf_file):
    reader = PdfReader(pdf_file)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
        
    return text

def summarize_text(text):
    response = client.chat.completions.create(
        model='gpt-4o',
        messages=[
            {'role': 'system', 'content': 'Summarize the following text in 100 words or less.'},
            {'role': 'user', 'content': text},
        ]
    )
    summary = response.choices[0].message.content
    print("this is the summary:", summary)
    words = summary.split()
    if len(words) > 100:
        summary = ' '.join(words[:100])
    return summary

def generate_voiceover(summary_text):
    speech_file_path = Path(__file__).parent / "speech.mp3"
    response = client.audio.speech.create(
        input=summary_text,
        voice='onyx', 
        model='tts-1'  
    )
    response.stream_to_file(str(speech_file_path))

    # Load the audio and cut it to 1 minute if necessary
    audio = AudioSegment.from_file(str(speech_file_path))
    if len(audio) > 60000:  # 1 minute in milliseconds
        audio = audio[:60000]
        audio.export(str(speech_file_path), format='mp3')
    return str(speech_file_path)

def generate_subtitles(summary_text, audio_duration, video_clip):
    # Split the text into words and convert to uppercase
    words = summary_text.upper().split()
    chunks = []
    i = 0  # Initialize word index

    while i < len(words):
        if i % 2 == 0:
            # Even index: single word chunk
            chunks.append([words[i]])
            i += 1
        else:
            # Odd index: attempt to create a multi-word chunk within 18 characters
            group = []
            total_length = 0
            while i < len(words):
                word = words[i]
                # Calculate the length if this word is added
                if not group:
                    new_length = len(word)
                else:
                    new_length = total_length + 1 + len(word)  # 1 for space

                if new_length <= 18:
                    group.append(word)
                    total_length = new_length
                    i += 1
                else:
                    break  # Cannot add more words without exceeding limit

            # If no words were added (word itself exceeds 18), add it anyway
            if not group:
                group.append(words[i])
                i += 1

            chunks.append(group)

    # Convert list of word lists into list of strings
    chunk_strings = [' '.join(chunk) for chunk in chunks]

    # Calculate total number of characters
    total_chars = sum(len(chunk.replace(" ", "")) for chunk in chunk_strings)

    # Estimate the duration of each chunk
    chunk_durations = []
    for chunk in chunk_strings:
        num_chars = len(chunk.replace(" ", ""))
        duration = (num_chars / total_chars) * audio_duration
        chunk_durations.append(duration)

    subtitle_clips = []
    start_time = 0

    for idx, chunk in enumerate(chunk_strings):
        duration = chunk_durations[idx]

        txt_clip = TextClip(
            txt=chunk,
            fontsize=80,
            font='Arial-Bold',
            color='yellow',
            stroke_color='black',
            stroke_width=2,
            size=(video_clip.w * 0.8, None),
            method='caption',
            align='center',
            bg_color='transparent'
        )

        # Add popup (scaling) effect
        popup_clip = txt_clip.set_position('center').set_start(start_time).set_duration(duration)

        # Define the scaling animation: start at 50% size and scale to 100%
        popup_duration = 0.1  # Ensure popup animation doesn't exceed half of the chunk duration
        popup_clip = popup_clip.resize(lambda t: 0.5 + 0.5 * min(1, t / popup_duration))

        # Optionally, add a slight fade-in for a smoother effect
        popup_clip = popup_clip.crossfadein(0.05)

        subtitle_clips.append(popup_clip)
        start_time += duration

    return subtitle_clips

def generate_video_with_subtitles(summary_text):
    # Paths
    demo_video_path = os.path.join(settings.BASE_DIR, 'media', 'demo.mp4')
    output_video_path = os.path.join(settings.MEDIA_ROOT, 'output.mp4')

    # Generate voiceover and get audio duration
    print("generating voiceover")
    audio_path = generate_voiceover(summary_text)
    audio_clip = AudioFileClip(audio_path)
    audio_duration = audio_clip.duration

    # Load and trim the video clip
    print("trimming video clip")
    video_clip = VideoFileClip(demo_video_path).subclip(0, audio_duration)

    # Generate subtitles
    print("generating subtitles")
    subtitle_clips = generate_subtitles(summary_text, audio_duration, video_clip)

    if not subtitle_clips:
        print("Warning: No subtitle clips were generated")

    print("combining video, subtitles and audio")
    # Combine video, subtitles, and audio
    final_clip = CompositeVideoClip([video_clip] + subtitle_clips).set_audio(audio_clip)
    final_clip.write_videofile(output_video_path, codec='libx264', audio_codec='aac')
    print("saving and returning video")
    # Return the URL to access the video
    video_url = f'/media/output.mp4'
    return video_url
