
import { useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SplitgateGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!canvasRef.current) return

    // Create scene, camera, renderer
    const scene = new (window as any).THREE.Scene()
    scene.background = new (window as any).THREE.Color(0x000011)
    
    const camera = new (window as any).THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new (window as any).THREE.WebGLRenderer({ canvas: canvasRef.current })
    
    renderer.setSize(window.innerWidth - 300, window.innerHeight)
    renderer.shadowMap.enabled = true

    // Add lighting
    const ambientLight = new (window as any).THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)
    
    const spotLight = new (window as any).THREE.SpotLight(0xff6600, 1)
    spotLight.position.set(0, 20, 0)
    spotLight.castShadow = true
    scene.add(spotLight)

    // Create portal arena
    const floorGeometry = new (window as any).THREE.PlaneGeometry(30, 30)
    const floorMaterial = new (window as any).THREE.MeshLambertMaterial({ 
      color: 0x222222,
      transparent: true,
      opacity: 0.8
    })
    const floor = new (window as any).THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Create portal frames
    const portals = []
    const portalPositions = [
      { x: -10, z: -10 },
      { x: 10, z: 10 },
      { x: -10, z: 10 },
      { x: 10, z: -10 }
    ]

    portalPositions.forEach((pos, index) => {
      // Portal frame
      const frameGeometry = new (window as any).THREE.RingGeometry(1.5, 2, 16)
      const frameMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: index % 2 === 0 ? 0x0066ff : 0xff6600,
        emissive: index % 2 === 0 ? 0x001133 : 0x331100
      })
      const frame = new (window as any).THREE.Mesh(frameGeometry, frameMaterial)
      frame.position.set(pos.x, 3, pos.z)
      frame.rotation.y = Math.random() * Math.PI * 2
      scene.add(frame)

      // Portal effect
      const portalGeometry = new (window as any).THREE.CircleGeometry(1.5, 16)
      const portalMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: index % 2 === 0 ? 0x0088ff : 0xff8800,
        transparent: true,
        opacity: 0.3
      })
      const portal = new (window as any).THREE.Mesh(portalGeometry, portalMaterial)
      portal.position.set(pos.x, 3, pos.z)
      scene.add(portal)

      portals.push({ frame, portal })
    })

    // Create energy walls
    const walls = []
    for (let i = 0; i < 8; i++) {
      const wallGeometry = new (window as any).THREE.PlaneGeometry(4, 6)
      const wallMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: 0x6600ff,
        transparent: true,
        opacity: 0.4
      })
      const wall = new (window as any).THREE.Mesh(wallGeometry, wallMaterial)
      wall.position.set(
        Math.random() * 24 - 12,
        3,
        Math.random() * 24 - 12
      )
      wall.rotation.y = Math.random() * Math.PI * 2
      scene.add(wall)
      walls.push(wall)
    }

    // Create floating energy cubes
    const cubes = []
    for (let i = 0; i < 15; i++) {
      const cubeGeometry = new (window as any).THREE.BoxGeometry(0.5, 0.5, 0.5)
      const cubeMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: 0x00ffff,
        emissive: 0x003333
      })
      const cube = new (window as any).THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(
        Math.random() * 20 - 10,
        Math.random() * 8 + 1,
        Math.random() * 20 - 10
      )
      scene.add(cube)
      cubes.push(cube)
    }

    // Position camera
    camera.position.set(0, 10, 15)

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
      camera.position.z = Math.max(5, Math.min(40, camera.position.z))
    }

    canvasRef.current.addEventListener('mousemove', onMouseMove)
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    canvasRef.current.addEventListener('wheel', onWheel)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Animate portals
      portals.forEach((portal, index) => {
        portal.frame.rotation.z += 0.02
        portal.portal.rotation.z -= 0.03
        portal.portal.material.opacity = 0.2 + Math.sin(Date.now() * 0.005 + index) * 0.2
      })

      // Animate walls
      walls.forEach((wall, index) => {
        wall.material.opacity = 0.2 + Math.sin(Date.now() * 0.003 + index) * 0.2
      })

      // Animate cubes
      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.02
        cube.rotation.y += 0.02
        cube.position.y += Math.sin(Date.now() * 0.004 + index) * 0.02
      })

      camera.lookAt(0, 3, 0)
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
          
          <div className="absolute top-4 right-4 z-10 bg-black/80 text-purple-400 p-4 rounded-xl border border-purple-400">
            <h2 className="text-xl font-bold mb-2">🌀 3D Splitgate Portal</h2>
            <p className="text-sm">Portal-based arena shooter</p>
            <p className="text-sm">Click and drag to navigate</p>
            <p className="text-sm">Scroll to zoom</p>
          </div>

          <canvas ref={canvasRef} className="w-full h-full" />
          
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        </main>
      </div>
    </SidebarProvider>
  )
}
