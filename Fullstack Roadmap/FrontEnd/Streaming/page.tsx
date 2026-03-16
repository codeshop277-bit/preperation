"use client";

/**
 * Video Streaming Page — Next.js
 * ================================
 * Learning Demo: How the browser consumes a chunked HTTP stream.
 *
 * Key concepts demonstrated:
 * - Native <video> element with a src pointing at the Python backend
 * - fetch() + ReadableStream to observe raw bytes as they arrive
 * - EventSource (SSE) for the live heartbeat from the server
 * - Visual chunk log so you can watch the stream happen in real-time
 *
 * Install deps then run:
 *   npm install   (or pnpm / yarn)
 *   npm run dev
 */

import { useEffect, useRef, useState, useCallback } from "react";

const BACKEND = "http://localhost:8000";
const STREAM_URL = `${BACKEND}/video/stream`;
const INFO_URL = `${BACKEND}/video/info`;
const SSE_URL = `${BACKEND}/video/stats-stream`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoInfo {
  title: string;
  size_mb: number;
  size_bytes: number;
  content_type: string;
  chunk_size_bytes: number;
}

interface ChunkLog {
  id: number;
  timestamp: string;
  size: number;
  total: number;
}

interface SseHeartbeat {
  tick: number;
  server: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_048_576
    ? `${(n / 1_048_576).toFixed(2)} MB`
    : `${(n / 1024).toFixed(1)} KB`;

const now = () => new Date().toISOString().split("T")[1].replace("Z", "");

// ─── Component ────────────────────────────────────────────────────────────────
export default function VideoStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [infoError, setInfoError] = useState<string | null>(null);

  // Chunk inspector state (driven by a parallel fetch, not the <video> tag)
  const [chunks, setChunks] = useState<ChunkLog[]>([]);
  const [bytesReceived, setBytesReceived] = useState(0);
  const [inspecting, setInspecting] = useState(false);
  const [inspectDone, setInspectDone] = useState(false);
  const chunkIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // SSE heartbeat
  const [heartbeat, setHeartbeat] = useState<SseHeartbeat | null>(null);
  const [sseConnected, setSseConnected] = useState(false);

  // Video player state
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  // ── Fetch video metadata ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(INFO_URL)
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfoError("Could not reach backend – is it running on :8000?"));
  }, []);

  // ── SSE heartbeat connection ────────────────────────────────────────────────
  useEffect(() => {
    const es = new EventSource(SSE_URL);

    es.onopen = () => setSseConnected(true);
    es.onmessage = (e) => setHeartbeat(JSON.parse(e.data));
    es.onerror = () => setSseConnected(false);

    return () => es.close();
  }, []);

  // ── Track video buffer progress ─────────────────────────────────────────────
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    const b = videoRef.current.buffered;
    if (b.length > 0) setBuffered(b.end(b.length - 1));
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setPlayerReady(true);
  }, []);

  // ── Chunk inspector ─────────────────────────────────────────────────────────
  // We open a *separate* fetch just to observe the raw byte stream.
  // The <video> tag handles actual playback independently.
  const startInspecting = useCallback(async () => {
    if (inspecting) return;
    setChunks([]);
    setBytesReceived(0);
    setInspecting(true);
    setInspectDone(false);
    chunkIdRef.current = 0;

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(STREAM_URL, { signal: ctrl.signal });
      const reader = res.body!.getReader();
      let total = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        total += value.byteLength;
        setBytesReceived(total);

        const entry: ChunkLog = {
          id: ++chunkIdRef.current,
          timestamp: now(),
          size: value.byteLength,
          total,
        };

        setChunks((prev) => [entry, ...prev].slice(0, 120)); // keep last 120
      }

      setInspectDone(true);
    } catch {
      // AbortError is expected when user clicks Stop
    } finally {
      setInspecting(false);
    }
  }, [inspecting]);

  const stopInspecting = useCallback(() => {
    abortRef.current?.abort();
    setInspecting(false);
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* ── Grid noise texture overlay */}
      <div style={styles.grain} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>▶</span>
          <div>
            <h1 style={styles.title}>HTTP Stream Lab</h1>
            <p style={styles.subtitle}>Watch bytes arrive in real-time</p>
          </div>
        </div>

        {/* SSE badge */}
        <div style={styles.sseBadge}>
          <span
            style={{
              ...styles.sseDot,
              background: sseConnected ? "#22c55e" : "#ef4444",
              boxShadow: sseConnected ? "0 0 8px #22c55e" : "none",
            }}
          />
          <span style={styles.sseLabel}>
            {sseConnected
              ? `SSE ✓  tick ${heartbeat?.tick ?? 0}`
              : "SSE disconnected"}
          </span>
        </div>
      </header>

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      {infoError && (
        <div style={styles.errorBanner}>
          ⚠ {infoError}
        </div>
      )}

      {/* ── Main two-column layout ─────────────────────────────────────────── */}
      <main style={styles.main}>
        {/* LEFT – video player */}
        <section style={styles.playerCol}>
          {/* Concept explainer */}
          <div style={styles.conceptBox}>
            <h2 style={styles.conceptTitle}>How It Works</h2>
            <ol style={styles.conceptList}>
              <li>Browser sends <code>GET /video/stream</code> to FastAPI</li>
              <li>FastAPI proxies the remote MP4, yielding <strong>{info ? fmt(info.chunk_size_bytes) : "256 KB"}</strong> chunks</li>
              <li>Uvicorn flushes each chunk immediately (chunked transfer encoding)</li>
              <li>The TCP connection stays <em>open</em> until the last byte</li>
              <li>The <code>&lt;video&gt;</code> element plays as soon as enough is buffered</li>
              <li>Range requests let you seek to any timestamp</li>
            </ol>
          </div>

          {/* Video */}
          <div style={styles.videoWrapper}>
            <video
              ref={videoRef}
              src={STREAM_URL}
              controls
              style={styles.video}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              Your browser does not support HTML5 video.
            </video>
          </div>

          {/* Progress info */}
          {playerReady && (
            <div style={styles.progressInfo}>
              <ProgressBar label="Playback" value={currentTime} max={duration} color="#6366f1" />
              <ProgressBar label="Buffered" value={buffered} max={duration} color="#22c55e" />
              <div style={styles.timeRow}>
                <span>{fmtTime(currentTime)} / {fmtTime(duration)}</span>
                <span>Buffered: {fmtTime(buffered)}</span>
              </div>
            </div>
          )}

          {/* Video metadata */}
          {info && (
            <div style={styles.metaGrid}>
              <MetaCard label="File" value={info.title} />
              <MetaCard label="Size" value={`${info.size_mb} MB`} />
              <MetaCard label="Type" value={info.content_type} />
              <MetaCard label="Chunk" value={fmt(info.chunk_size_bytes)} />
            </div>
          )}
        </section>

        {/* RIGHT – chunk inspector */}
        <section style={styles.inspectorCol}>
          <div style={styles.inspectorHeader}>
            <h2 style={styles.inspectorTitle}>Chunk Inspector</h2>
            <p style={styles.inspectorDesc}>
              Opens a <em>separate</em> fetch to <code>/video/stream</code> and logs
              every chunk as it arrives — so you can see the stream without affecting playback.
            </p>

            <div style={styles.inspectorControls}>
              <button
                onClick={startInspecting}
                disabled={inspecting}
                style={{ ...styles.btn, ...(inspecting ? styles.btnDisabled : styles.btnGreen) }}
              >
                {inspecting ? "⏳ Streaming…" : "▶ Start Inspection"}
              </button>
              <button
                onClick={stopInspecting}
                disabled={!inspecting}
                style={{ ...styles.btn, ...(!inspecting ? styles.btnDisabled : styles.btnRed) }}
              >
                ■ Stop
              </button>
            </div>

            {/* Running totals */}
            <div style={styles.statsRow}>
              <StatPill label="Chunks" value={String(chunks.length)} />
              <StatPill label="Received" value={fmt(bytesReceived)} />
              {inspectDone && <StatPill label="Status" value="Complete ✓" color="#22c55e" />}
              {inspecting && <StatPill label="Status" value="Live ●" color="#f97316" />}
            </div>
          </div>

          {/* Chunk log */}
          <div style={styles.chunkLog}>
            {chunks.length === 0 && (
              <div style={styles.emptyState}>
                Click <strong>Start Inspection</strong> to begin watching chunks arrive
              </div>
            )}
            {chunks.map((c) => (
              <div key={c.id} style={styles.chunkRow}>
                <span style={styles.chunkId}>#{c.id}</span>
                <span style={styles.chunkTime}>{c.timestamp}</span>
                <span style={styles.chunkSize}>{fmt(c.size)}</span>
                <span style={styles.chunkTotal}>{fmt(c.total)} total</span>
                {/* Visual width bar */}
                <span
                  style={{
                    ...styles.chunkBar,
                    width: `${Math.min(100, (c.size / (info?.chunk_size_bytes ?? 262144)) * 100)}%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Connection diagram */}
          <div style={styles.diagram}>
            <DiagramNode label="Browser" icon="🌐" active={inspecting || playerReady} />
            <DiagramArrow label="GET /video/stream" active={inspecting} />
            <DiagramNode label="FastAPI" icon="🐍" active={inspecting} />
            <DiagramArrow label="Proxy upstream" active={inspecting} />
            <DiagramNode label="CDN/MP4" icon="☁" active />
          </div>
          <p style={styles.diagramCaption}>
            The HTTP connection (browser ↔ FastAPI) stays open for the duration of the stream.
            FastAPI pulls from the CDN and forwards chunks as they arrive.
          </p>
        </section>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.metaCard}>
      <span style={styles.metaLabel}>{label}</span>
      <span style={styles.metaValue}>{value}</span>
    </div>
  );
}

function StatPill({
  label,
  value,
  color = "#6366f1",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ ...styles.statPill, borderColor: color }}>
      <span style={{ fontSize: 10, color: "#64748b", marginRight: 4 }}>{label}</span>
      <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

function DiagramNode({
  label,
  icon,
  active,
}: {
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: active ? 1 : 0.35,
        transition: "opacity 0.4s",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: active ? "#1e293b" : "#0f172a",
          border: `2px solid ${active ? "#6366f1" : "#334155"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          boxShadow: active ? "0 0 12px #6366f180" : "none",
          transition: "all 0.4s",
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>{label}</span>
    </div>
  );
}

function DiagramArrow({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        opacity: active ? 1 : 0.25,
        transition: "opacity 0.4s",
      }}
    >
      <div
        style={{
          width: 40,
          height: 2,
          background: active
            ? "linear-gradient(90deg, #6366f1, #22c55e)"
            : "#334155",
          position: "relative",
          transition: "all 0.4s",
        }}
      >
        {active && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: -3,
              width: 0,
              height: 0,
              borderLeft: "6px solid #22c55e",
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
            }}
          />
        )}
      </div>
      <span style={{ fontSize: 9, color: "#475569", fontFamily: "monospace", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function fmtTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#020817",
    color: "#e2e8f0",
    fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
    position: "relative",
    overflow: "hidden",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse 80% 50% at 50% -20%, #6366f120 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 32px",
    borderBottom: "1px solid #1e293b",
    backdropFilter: "blur(8px)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  logo: {
    fontSize: 28,
    color: "#6366f1",
    filter: "drop-shadow(0 0 8px #6366f1)",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#f1f5f9",
  },
  subtitle: {
    margin: 0,
    fontSize: 12,
    color: "#64748b",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  sseBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 20,
    padding: "6px 14px",
  },
  sseDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
    transition: "all 0.3s",
  },
  sseLabel: { fontSize: 11, color: "#94a3b8", fontFamily: "monospace" },
  errorBanner: {
    position: "relative",
    zIndex: 1,
    background: "#450a0a",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    padding: "12px 32px",
    fontSize: 13,
  },
  main: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    padding: 24,
    maxWidth: 1400,
    margin: "0 auto",
  },
  playerCol: { display: "flex", flexDirection: "column", gap: 16 },
  conceptBox: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 20,
  },
  conceptTitle: {
    margin: "0 0 12px",
    fontSize: 13,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  conceptList: {
    margin: 0,
    padding: "0 0 0 18px",
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 2,
  },
  videoWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #1e293b",
    background: "#000",
  },
  video: { width: "100%", display: "block", maxHeight: 320 },
  progressInfo: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 16,
  },
  timeRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#64748b",
    marginTop: 4,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  metaCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  metaLabel: { fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" },
  metaValue: { fontSize: 13, color: "#e2e8f0", fontWeight: 600 },
  inspectorCol: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#0a0f1a",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 20,
    overflow: "hidden",
  },
  inspectorHeader: { display: "flex", flexDirection: "column", gap: 10 },
  inspectorTitle: {
    margin: 0,
    fontSize: 13,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  inspectorDesc: {
    margin: 0,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.6,
  },
  inspectorControls: { display: "flex", gap: 10 },
  btn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    fontSize: 12,
    fontFamily: "monospace",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  btnGreen: { background: "#166534", color: "#86efac" },
  btnRed: { background: "#7f1d1d", color: "#fca5a5" },
  btnDisabled: { background: "#1e293b", color: "#475569", cursor: "not-allowed" },
  statsRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  statPill: {
    display: "flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 20,
    border: "1px solid",
    background: "#0f172a",
  },
  chunkLog: {
    flex: 1,
    overflowY: "auto",
    maxHeight: 320,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: 2,
  },
  emptyState: {
    textAlign: "center",
    color: "#334155",
    fontSize: 12,
    padding: "40px 0",
  },
  chunkRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "5px 10px",
    background: "#0f172a",
    borderRadius: 6,
    fontSize: 11,
    fontFamily: "monospace",
    position: "relative",
    overflow: "hidden",
    animation: "fadeIn 0.2s ease",
  },
  chunkId: { color: "#6366f1", minWidth: 32, fontWeight: 700 },
  chunkTime: { color: "#475569", minWidth: 90 },
  chunkSize: { color: "#22c55e", minWidth: 65 },
  chunkTotal: { color: "#94a3b8", flex: 1 },
  chunkBar: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 2,
    background: "linear-gradient(90deg, #6366f1, #22c55e)",
    borderRadius: 1,
    transition: "width 0.3s",
  },
  diagram: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "16px 0 8px",
  },
  diagramCaption: {
    margin: 0,
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    lineHeight: 1.6,
  },
};
