import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Edges, Line, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import { COUNTERTOP, MODULES, type ModuleDef } from './modules'

const C = {
  desk: '#1A1424',
  face: '#2B2339',
  hi: '#5A4A78',
  lo: '#0F0A17',
  tl: '#6B58A6',
  to: '#3D3454',
  txt: '#EDE8F5',
  mut: '#B3A8C8',
  acc: '#A58FE0',
  dot: '#2A2038',
}

type Props = {
  selected: string | null
  onSelect: (id: string | null) => void
}

export default function RoomScene({ selected, onSelect }: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [3, 1.9, 3.1], fov: 50 }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[C.desk]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />

      <Room />
      {MODULES.map((m) => (
        <Module key={m.id} def={m} selected={selected === m.id} onSelect={onSelect} />
      ))}
      <Countertop />

      <OrbitControls
        makeDefault
        target={[-0.6, 1.2, -0.9]}
        enablePan={false}
        enableDamping={false}
        minDistance={2.5}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-0.15}
        maxAzimuthAngle={Math.PI / 2 + 0.15}
      />
    </Canvas>
  )
}

function Room() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0.5]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial color={C.face} />
      </mesh>
      <gridHelper args={[4, 16, C.hi, C.to]} position={[0, 0.002, 0.5]} />

      <mesh position={[0, 1.3, -1.53]}>
        <boxGeometry args={[4.06, 2.6, 0.06]} />
        <meshBasicMaterial color={C.dot} />
        <Edges color={C.hi} />
      </mesh>
      <mesh position={[-2.03, 1.3, 0.5]}>
        <boxGeometry args={[0.06, 2.6, 4]} />
        <meshBasicMaterial color={C.desk} />
        <Edges color={C.hi} />
      </mesh>

      <Line
        points={[
          [0.4, 1.2, -1.499],
          [1.2, 1.2, -1.499],
          [1.2, 2.0, -1.499],
          [0.4, 2.0, -1.499],
          [0.4, 1.2, -1.499],
        ]}
        color={C.mut}
        lineWidth={1}
        dashed
        dashSize={0.06}
        gapSize={0.05}
      />
    </group>
  )
}

function Countertop() {
  const { from, to, y, thickness, depth, z } = COUNTERTOP
  return (
    <mesh position={[(from + to) / 2, y, z]}>
      <boxGeometry args={[to - from, thickness, depth]} />
      <meshStandardMaterial color={C.hi} />
      <Edges color={C.acc} />
    </mesh>
  )
}

type ModuleProps = { def: ModuleDef; selected: boolean; onSelect: (id: string) => void }

function Module({ def, selected, onSelect }: ModuleProps) {
  const [hovered, setHovered] = useState(false)
  const [w, h, d] = def.size
  const lines = useMemo(() => frontLines(def), [def])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    setHovered(false)
    document.body.style.cursor = ''
  }

  return (
    <group position={def.position}>
      <mesh
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(def.id)
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={selected ? C.tl : hovered ? C.hi : C.to} />
        <Edges color={selected ? C.txt : C.acc} />
      </mesh>
      <Line points={lines} segments color={selected ? C.txt : C.acc} lineWidth={1} transparent opacity={0.8} />
    </group>
  )
}

type V3 = [number, number, number]

function frontLines({ size: [w, h, d], front, kind }: ModuleDef): V3[] {
  const z = d / 2 + 0.002
  const pts: V3[] = []
  const seg = (x1: number, y1: number, x2: number, y2: number) => pts.push([x1, y1, z], [x2, y2, z])
  const handleV = (x: number) => (kind === 'upper' ? seg(x, -h / 2 + 0.06, x, -h / 2 + 0.2) : seg(x, h / 2 - 0.2, x, h / 2 - 0.06))

  switch (front) {
    case 'doors1':
      handleV(w / 2 - 0.06)
      break
    case 'doors2':
      seg(0, -h / 2, 0, h / 2)
      handleV(-0.05)
      handleV(0.05)
      break
    case 'drawers3':
      for (let i = 1; i < 3; i++) seg(-w / 2, -h / 2 + (h * i) / 3, w / 2, -h / 2 + (h * i) / 3)
      for (let i = 0; i < 3; i++) {
        const y = -h / 2 + (h * (i + 1)) / 3 - 0.06
        seg(-0.1, y, 0.1, y)
      }
      break
    case 'oven': {
      const y0 = 0.85 - h / 2
      const y1 = 1.45 - h / 2
      seg(-w / 2, y0, w / 2, y0)
      seg(-w / 2, y1, w / 2, y1)
      const ix = w / 2 - 0.08
      seg(-ix, y0 + 0.08, ix, y0 + 0.08)
      seg(ix, y0 + 0.08, ix, y1 - 0.14)
      seg(ix, y1 - 0.14, -ix, y1 - 0.14)
      seg(-ix, y1 - 0.14, -ix, y0 + 0.08)
      seg(-0.15, y1 - 0.07, 0.15, y1 - 0.07)
      handleV(w / 2 - 0.06)
      seg(w / 2 - 0.06, -h / 2 + 0.6, w / 2 - 0.06, -h / 2 + 0.74)
      break
    }
  }
  return pts
}
