
import { useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MinecraftGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!canvasRef.current) return

    // Create scene, camera, renderer
    const scene = new (window as any).THREE.Scene()
    const camera = new (window as any).THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new (window as any).THREE.WebGLRenderer({ canvas: canvasRef.current })
    
    renderer.setSize(window.innerWidth - 300, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = (window as any).THREE.PCFSoftShadowMap

    // Add lighting
    const ambientLight = new (window as any).THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new (window as any).THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Create ground
    const groundGeometry = new (window as any).THREE.PlaneGeometry(20, 20)
    const groundMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x228B22 })
    const ground = new (window as any).THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Create blocks (cubes)
    const blockGeometry = new (window as any).THREE.BoxGeometry(1, 1, 1)
    const blockMaterials = [
      new (window as any).THREE.MeshLambertMaterial({ color: 0x8B4513 }), // Brown (dirt)
      new (window as any).THREE.MeshLambertMaterial({ color: 0x808080 }), // Gray (stone)
      new (window as any).THREE.MeshLambertMaterial({ color: 0x654321 }), // Dark brown (wood)
    ]

    const blocks = []
    for (let i = 0; i < 50; i++) {
      const block = new (window as any).THREE.Mesh(
        blockGeometry, 
        blockMaterials[Math.floor(Math.random() * blockMaterials.length)]
      )
      block.position.set(
        Math.random() * 20 - 10,
        Math.random() * 5 + 0.5,
        Math.random() * 20 - 10
      )
      block.castShadow = true
      block.receiveShadow = true
      scene.add(block)
      blocks.push(block)
    }

    // Position camera
    camera.position.set(0, 5, 10)

    // Mouse controls
    let mouseX = 0
    let mouseY = 0
    let mouseDown = false

    const onMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY
        
        camera.position.x += deltaX * 0.01
        camera.position.y -= deltaY * 0.01
      }
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const onMouseDown = () => { mouseDown = true }
    const onMouseUp = () => { mouseDown = false }
    const onWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.01
      camera.position.z = Math.max(2, Math.min(50, camera.position.z))
    }

    canvasRef.current.addEventListener('mousemove', onMouseMove)
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    canvasRef.current.addEventListener('wheel', onWheel)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Rotate some blocks
      blocks.forEach((block, index) => {
        if (index % 3 === 0) {
          block.rotation.y += 0.01
        }
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
          
          <div className="absolute top-4 right-4 z-10 bg-black/80 text-white p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-2">3D Minecraft</h2>
            <p className="text-sm">Click and drag to rotate view</p>
            <p className="text-sm">Scroll to zoom in/out</p>
          </div>

          <canvas ref={canvasRef} className="w-full h-full" />
          
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        </main>
      </div>
    </SidebarProvider>
  )
}
