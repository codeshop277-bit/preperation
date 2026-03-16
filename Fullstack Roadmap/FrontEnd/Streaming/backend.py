"""
Video Streaming Backend - FastAPI
===================================
Learning Demo: How HTTP streaming / chunked transfer encoding works.

Key concepts demonstrated:
- StreamingResponse with chunked transfer encoding
- Range requests (HTTP 206 Partial Content) for video seeking
- CORS headers to allow the Next.js frontend to connect
- The connection stays open while chunks are being sent

Run with:
    pip install fastapi uvicorn httpx
    python backend.py
"""

import httpx
import asyncio
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Video Streaming Demo")

# -----------------------------------------------------------------
# CORS – allow the Next.js dev server (port 3000) to call us
# -----------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"],
)

# -----------------------------------------------------------------
# Public Big Buck Bunny video (Blender Foundation, CC-BY license)
# -----------------------------------------------------------------
VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

# How many bytes we read from the upstream source per iteration.
# Smaller = more chunks, easier to observe the stream in DevTools.
CHUNK_SIZE = 256 * 1024  # 256 KB


# -----------------------------------------------------------------
# /video/info  – lightweight metadata endpoint
# -----------------------------------------------------------------
@app.get("/video/info")
async def video_info():
    """
    HEAD the upstream video to discover its total size, then return
    metadata the frontend can display before playback starts.
    """
    async with httpx.AsyncClient() as client:
        head = await client.head(VIDEO_URL, follow_redirects=True)

    content_length = int(head.headers.get("content-length", 0))
    return {
        "title": "Big Buck Bunny",
        "source": VIDEO_URL,
        "size_bytes": content_length,
        "size_mb": round(content_length / (1024 * 1024), 1),
        "content_type": head.headers.get("content-type", "video/mp4"),
        "chunk_size_bytes": CHUNK_SIZE,
    }


# -----------------------------------------------------------------
# /video/stream  – the main streaming endpoint
# -----------------------------------------------------------------
@app.get("/video/stream")
async def stream_video(request: Request):
    """
    Proxies the remote video to the browser using chunked streaming.

    How the connection stays open
    ─────────────────────────────
    1. FastAPI wraps our async generator in a StreamingResponse.
    2. Uvicorn keeps the TCP connection open and flushes each yielded
       chunk immediately (Transfer-Encoding: chunked).
    3. The browser's <video> element feeds on the arriving bytes and
       starts playing before the download is complete.
    4. If the browser sends a Range header (for seeking), we forward
       it upstream and reply with HTTP 206 Partial Content so the
       video element can jump to any timestamp.
    """

    # ── Forward any Range header the browser sends (enables seeking) ──
    range_header = request.headers.get("range")
    upstream_headers = {}
    if range_header:
        upstream_headers["Range"] = range_header

    async with httpx.AsyncClient(timeout=None) as client:
        upstream = await client.get(
            VIDEO_URL,
            headers=upstream_headers,
            follow_redirects=True,
        )

        if upstream.status_code not in (200, 206):
            raise HTTPException(status_code=502, detail="Could not fetch upstream video")

        # ── Build response headers ──────────────────────────────────
        response_headers = {
            "Accept-Ranges": "bytes",
            "Content-Type": upstream.headers.get("content-type", "video/mp4"),
        }

        # Pass through range / content-length so the browser knows
        # how much data to expect and can render a seek bar.
        if "content-range" in upstream.headers:
            response_headers["Content-Range"] = upstream.headers["content-range"]
        if "content-length" in upstream.headers:
            response_headers["Content-Length"] = upstream.headers["content-length"]

        status_code = 206 if upstream.status_code == 206 else 200

        # ── Async generator – this is what keeps the connection open ─
        async def chunk_generator():
            """
            Yields CHUNK_SIZE slices of the upstream response body.

            Each `yield` causes Uvicorn to flush that chunk to the
            client immediately – this is chunked transfer encoding in
            action.  The HTTP connection stays alive until the generator
            is exhausted (or the client disconnects).
            """
            bytes_sent = 0
            async for chunk in upstream.aiter_bytes(chunk_size=CHUNK_SIZE):
                # Simulate a tiny delay so the chunked behaviour is
                # more visible in the browser's Network tab.
                # Remove this line in production!
                await asyncio.sleep(0.01)

                bytes_sent += len(chunk)
                yield chunk

        return StreamingResponse(
            chunk_generator(),
            status_code=status_code,
            headers=response_headers,
        )


# -----------------------------------------------------------------
# /video/stats  – server-sent events for live chunk stats (bonus!)
# -----------------------------------------------------------------
@app.get("/video/stats-stream")
async def stats_stream():
    """
    A Server-Sent Events (SSE) endpoint that pushes a JSON heartbeat
    every second.  The frontend can display live connection statistics
    without polling.

    SSE is another great example of a long-lived HTTP connection –
    text/event-stream tells the browser to keep reading forever.
    """

    async def event_generator():
        counter = 0
        while True:
            counter += 1
            data = f'{{"tick": {counter}, "server": "alive", "endpoint": "/video/stream"}}'
            # SSE wire format: "data: <payload>\n\n"
            yield f"data: {data}\n\n"
            await asyncio.sleep(1)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable Nginx buffering if proxied
        },
    )


# -----------------------------------------------------------------
# Entry point
# -----------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    print("\n🎬  Video Streaming Demo – Backend")
    print("=" * 40)
    print(f"  Stream URL : http://localhost:8000/video/stream")
    print(f"  Info URL   : http://localhost:8000/video/info")
    print(f"  Docs       : http://localhost:8000/docs")
    print("=" * 40)
    print("  Open the Next.js app at http://localhost:3000\n")

    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
