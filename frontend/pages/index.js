import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);
const OrbitControls = dynamic(
  () => import("@react-three/drei").then((mod) => mod.OrbitControls),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-teal-100 to-white pt-32">
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-md h-64 mb-8">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1, 0.4, 16, 100]} />
                <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.2} />
              </mesh>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>
          <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Your Mental Health Tracker</h1>
            <p className="text-lg text-gray-700 mb-6">
              Track your daily mood, reflect on your progress, and take steps towards a healthier mind.
            </p>
            <a href="/daily-log" className="px-6 py-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition font-semibold inline-block">
              Get Started
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 