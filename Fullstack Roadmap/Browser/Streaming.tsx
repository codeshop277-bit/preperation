import { useState, useRef } from 'react';

export default function VideoStreamDemo() {
  const [streaming, setStreaming] = useState(false);
  const [logs, setLogs] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [bytesReceived, setBytesReceived] = useState(0);
  const videoRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const streamVideo = async () => {
    setStreaming(true);
    setLogs([]);
    setBytesReceived(0);
    setVideoUrl(null);

    try {
      // Using a sample video from the internet
      const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      addLog('Starting video stream request...', 'info');
      addLog(`Requesting: ${videoSource}`, 'info');

      const response = await fetch(videoSource);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      addLog(`Response received - Status: ${response.status}`, 'success');
      addLog(`Content-Type: ${response.headers.get('content-type')}`, 'info');
      addLog(`Content-Length: ${response.headers.get('content-length')} bytes`, 'info');

      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      addLog('Starting to read chunks...', 'info');

      while (true) {
        const { done, value } = await reader.read();//It pauses here once new set of chunks are recieved it proceeds further

        if (done) {
          addLog('Stream complete!', 'success');
          break;
        }

        chunks.push(value);
        receivedLength += value.length;
        setBytesReceived(receivedLength);

        addLog(`Chunk received: ${value.length} bytes (Total: ${receivedLength} bytes)`, 'chunk');
      }

      // Combine chunks into a single Uint8Array
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      // Create blob and URL for video
      const blob = new Blob([chunksAll], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      addLog('Creating video blob and object URL...', 'info');
      setVideoUrl(url);
      addLog('Video ready to play!', 'success');

    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    } finally {
      setStreaming(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Video Streaming Demo</h1>
        <p className="text-gray-400 mb-8">Watch how video data is fetched in chunks and processed</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Player Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Video Player</h2>
            
            <button
              onClick={streamVideo}
              disabled={streaming}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white mb-4 transition-all ${
                streaming
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {streaming ? 'Streaming...' : 'Get Stream'}
            </button>

            {bytesReceived > 0 && (
              <div className="mb-4 p-3 bg-gray-700 rounded">
                <p className="text-sm text-gray-300">
                  Bytes Received: <span className="text-green-400 font-mono">{formatBytes(bytesReceived)}</span>
                </p>
              </div>
            )}

            {videoUrl && (
              <div className="mt-4">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg"
                  onLoadedMetadata={() => addLog('Video metadata loaded', 'success')}
                  onCanPlay={() => addLog('Video can start playing', 'success')}
                />
              </div>
            )}

            {!videoUrl && !streaming && (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center text-gray-500">
                Click "Get Stream" to load video
              </div>
            )}
          </div>

          {/* Logs Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Stream Logs</h2>
            
            <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Click "Get Stream" to start.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-2">
                    <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                    <span
                      className={
                        log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'success'
                          ? 'text-green-400'
                          : log.type === 'chunk'
                          ? 'text-blue-400'
                          : 'text-gray-300'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
          <div className="text-gray-300 space-y-2">
            <p><strong className="text-blue-400">1. API Request:</strong> Fetch API initiates a request to the video URL</p>
            <p><strong className="text-blue-400">2. Response Headers:</strong> Server responds with headers including content-type and content-length</p>
            <p><strong className="text-blue-400">3. Chunk Reading:</strong> ReadableStream reader processes the body in chunks using reader.read()</p>
            <p><strong className="text-blue-400">4. Chunk Processing:</strong> Each chunk (Uint8Array) is collected and total bytes are tracked</p>
            <p><strong className="text-blue-400">5. Blob Creation:</strong> All chunks are combined into a Blob with proper MIME type</p>
            <p><strong className="text-blue-400">6. Display:</strong> Blob URL is created and set as video source for playback</p>
          </div>
        </div>
      </div>
    </div>
  );
}


What is a Streaming Response?
A streaming response sends data from the server incrementally (in chunks) over a single HTTP request instead of waiting for the full response.

One request → many chunks → same connection

✅ Browser makes ONE API call
✅ Server keeps the connection open
✅ Data arrives chunk by chunk
❌ Browser does NOT re-hit the API
❌ No polling or repeated requests

How the Browser Receives Data
Uses fetch() which exposes a ReadableStream
Each incoming chunk resolves reader.read()
The UI can update per chunk

What the Server Must Do
Send headers early:
Transfer-Encoding: chunked
Flush data in parts (write / flush)
Close the connection when done
Forgetting { stream: true } in TextDecoder(server)