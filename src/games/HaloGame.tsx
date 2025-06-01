
import { useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HaloGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!canvasRef.current) return

    // Create scene, camera, renderer
    const scene = new (window as any).THREE.Scene()
    scene.fog = new (window as any).THREE.Fog(0x000033, 10, 100)
    
    const camera = new (window as any).THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new (window as any).THREE.WebGLRenderer({ canvas: canvasRef.current })
    
    renderer.setSize(window.innerWidth - 300, window.innerHeight)
    renderer.shadowMap.enabled = true

    // Add lighting
    const ambientLight = new (window as any).THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)
    
    const directionalLight = new (window as any).THREE.DirectionalLight(0x00ffff, 1)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Create futuristic arena
    const arenaGeometry = new (window as any).THREE.RingGeometry(5, 25, 8)
    const arenaMaterial = new (window as any).THREE.MeshLambertMaterial({ 
      color: 0x333333,
      transparent: true,
      opacity: 0.8
    })
    const arena = new (window as any).THREE.Mesh(arenaGeometry, arenaMaterial)
    arena.rotation.x = -Math.PI / 2
    scene.add(arena)

    // Create energy barriers
    const barriers = []
    for (let i = 0; i < 8; i++) {
      const barrierGeometry = new (window as any).THREE.BoxGeometry(0.2, 3, 2)
      const barrierMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7
      })
      const barrier = new (window as any).THREE.Mesh(barrierGeometry, barrierMaterial)
      const angle = (i / 8) * Math.PI * 2
      barrier.position.set(
        Math.cos(angle) * 15,
        1.5,
        Math.sin(angle) * 15
      )
      scene.add(barrier)
      barriers.push(barrier)
    }

    // Create floating platforms
    const platforms = []
    for (let i = 0; i < 6; i++) {
      const platformGeometry = new (window as any).THREE.CylinderGeometry(2, 2, 0.3, 8)
      const platformMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x666666 })
      const platform = new (window as any).THREE.Mesh(platformGeometry, platformMaterial)
      platform.position.set(
        Math.random() * 20 - 10,
        Math.random() * 5 + 2,
        Math.random() * 20 - 10
      )
      scene.add(platform)
      platforms.push(platform)
    }

    // Create energy orbs
    const orbs = []
    for (let i = 0; i < 12; i++) {
      const orbGeometry = new (window as any).THREE.SphereGeometry(0.3, 8, 6)
      const orbMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: 0x00ff00,
        emissive: 0x002200
      })
      const orb = new (window as any).THREE.Mesh(orbGeometry, orbMaterial)
      orb.position.set(
        Math.random() * 30 - 15,
        Math.random() * 8 + 1,
        Math.random() * 30 - 15
      )
      scene.add(orb)
      orbs.push(orb)
    }

    // Position camera
    camera.position.set(0, 8, 20)

    // Mouse controls
    let mouseX = 0
    let mouseY = 0
    let mouseDown = false

    const onMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY
        
        camera.position.x += deltaX * 0.02
        camera.position.y -= deltaY * 0.02
      }
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const onMouseDown = () => { mouseDown = true }
    const onMouseUp = () => { mouseDown = false }
    const onWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.02
      camera.position.z = Math.max(5, Math.min(50, camera.position.z))
    }

    canvasRef.current.addEventListener('mousemove', onMouseMove)
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    canvasRef.current.addEventListener('wheel', onWheel)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Animate barriers
      barriers.forEach((barrier, index) => {
        barrier.rotation.y += 0.02
        barrier.material.opacity = 0.5 + Math.sin(Date.now() * 0.005 + index) * 0.3
      })

      // Animate orbs
      orbs.forEach((orb, index) => {
        orb.position.y += Math.sin(Date.now() * 0.003 + index) * 0.02
        orb.rotation.y += 0.05
      })

      // Animate platforms
      platforms.forEach((platform, index) => {
        platform.position.y += Math.sin(Date.now() * 0.002 + index) * 0.01
      })

      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', onMouseMove)
        canvasRef.current.removeEventListener('mousedown', onMouseDown)
        canvasRef.current.removeEventListener('mouseup', onMouseUp)
        canvasRef.current.removeEventListener('wheel', onWheel)
      }
    }
  }, [])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
            <SidebarTrigger className="bg-white/80 hover:bg-white rounded-xl" />
            <Button
              onClick={() => navigate('/games')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 bg-black/80 text-cyan-400 p-4 rounded-xl border border-cyan-400">
            <h2 className="text-xl font-bold mb-2">🚀 3D Halo Arena</h2>
            <p className="text-sm">Futuristic combat arena</p>
            <p className="text-sm">Click and drag to explore</p>
            <p className="text-sm">Scroll to zoom</p>
          </div>

          <canvas ref={canvasRef} className="w-full h-full" />
          
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        </main>
      </div>
    </SidebarProvider>
  )
}
