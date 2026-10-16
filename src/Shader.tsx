import { useEffect, useRef } from 'react'

const VS = 'attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }'
const FS = `precision highp float;
uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse;
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.4;
  vec2 mNorm = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float distToMouse = length(p - mNorm);
  float mouseWave = sin(distToMouse * 8.0 - t * 2.0) * exp(-distToMouse * 1.5) * 0.25;
  float wave1 = sin(p.x * 2.5 + t + sin(p.y * 3.0 + t * 0.5));
  float wave2 = cos(p.y * 3.2 - t * 0.7 + cos(p.x * 2.0 - t * 0.3));
  float wave3 = sin((p.x + p.y) * 2.0 + t * 1.2 + mouseWave);
  float combined = (wave1 + wave2 + wave3) / 3.0;
  vec3 bgBase = vec3(0.024, 0.043, 0.098);
  vec3 blueGlow = vec3(0.145, 0.388, 0.922);
  vec3 cyanGlow = vec3(0.024, 0.714, 0.831);
  vec3 col = bgBase;
  float glow1 = smoothstep(0.1, 0.9, combined * 0.5 + 0.5);
  float glow2 = smoothstep(0.4, 1.0, sin(p.x * 3.0 - t + combined) * 0.5 + 0.5);
  col = mix(col, blueGlow, glow1 * 0.45);
  col = mix(col, cyanGlow, glow2 * (0.35 + 0.2 * (1.0 - clamp(distToMouse, 0.0, 1.0))));
  float line = smoothstep(0.03, 0.0, abs(sin(p.y * 8.0 + t + wave1 * 0.5) - p.x * 0.2));
  col += cyanGlow * line * 0.3;
  col *= 0.85 + 0.15 * (1.0 - st.y);
  float vignette = 1.0 - smoothstep(0.5, 1.6, length(p));
  col *= vignette * 0.95;
  gl_FragColor = vec4(col, 1.0);
}`

/** Ambient WebGL wave background. Pauses off-screen and renders one frame for reduced-motion users. */
export default function Shader() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl')
    if (!canvas || !gl) return
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    const uT = gl.getUniformLocation(prog, 'u_time'), uR = gl.getUniformLocation(prog, 'u_resolution'), uM = gl.getUniformLocation(prog, 'u_mouse')
    const mouse = { x: 0, y: 0 }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, visible = true
    const draw = (t: number) => {
      const w = canvas.clientWidth || 1280, h = canvas.clientHeight || 720
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
      gl.viewport(0, 0, w, h)
      gl.uniform1f(uT, t * 0.001)
      gl.uniform2f(uR, w, h)
      gl.uniform2f(uM, mouse.x || w / 2, mouse.y || h / 2)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!reduce && visible) raf = requestAnimationFrame(draw)
    }
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      if (r.width && r.height) { mouse.x = ((e.clientX - r.left) / r.width) * canvas.width; mouse.y = (1 - (e.clientY - r.top) / r.height) * canvas.height }
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(draw) })
    io.observe(canvas)
    addEventListener('mousemove', onMove)
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('mousemove', onMove) }
  }, [])
  return <canvas ref={ref} aria-hidden className="block size-full" />
}
