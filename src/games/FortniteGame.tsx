
import { useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FortniteGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!canvasRef.current) return

    // Create scene, camera, renderer
    const scene = new (window as any).THREE.Scene()
    scene.background = new (window as any).THREE.Color(0x87CEEB) // Sky blue
    scene.fog = new (window as any).THREE.Fog(0x87CEEB, 50, 200)
    
    const camera = new (window as any).THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new (window as any).THREE.WebGLRenderer({ canvas: canvasRef.current })
    
    renderer.setSize(window.innerWidth - 300, window.innerHeight)
    renderer.shadowMap.enabled = true

    // Add lighting
    const ambientLight = new (window as any).THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new (window as any).THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(20, 50, 20)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Create terrain
    const terrainGeometry = new (window as any).THREE.PlaneGeometry(100, 100, 20, 20)
    const terrainMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x228B22 })
    const terrain = new (window as any).THREE.Mesh(terrainGeometry, terrainMaterial)
    terrain.rotation.x = -Math.PI / 2
    terrain.receiveShadow = true
    
    // Add height variation to terrain
    const vertices = terrainGeometry.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] = Math.random() * 3 // Z coordinate (height)
    }
    terrainGeometry.attributes.position.needsUpdate = true
    terrainGeometry.computeVertexNormals()
    
    scene.add(terrain)

    // Create building structures
    const buildings = []
    const buildingColors = [0x8B4513, 0x696969, 0x2F4F4F, 0x800080]
    
    for (let i = 0; i < 20; i++) {
      const height = Math.random() * 8 + 2
      const buildingGeometry = new (window as any).THREE.BoxGeometry(
        Math.random() * 3 + 2,
        height,
        Math.random() * 3 + 2
      )
      const buildingMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)]
      })
      const building = new (window as any).THREE.Mesh(buildingGeometry, buildingMaterial)
      building.position.set(
        Math.random() * 80 - 40,
        height / 2,
        Math.random() * 80 - 40
      )
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)
      buildings.push(building)
    }

    // Create trees
    const trees = []
    for (let i = 0; i < 30; i++) {
      // Tree trunk
      const trunkGeometry = new (window as any).THREE.CylinderGeometry(0.3, 0.5, 4, 8)
      const trunkMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x8B4513 })
      const trunk = new (window as any).THREE.Mesh(trunkGeometry, trunkMaterial)
      
      // Tree leaves
      const leavesGeometry = new (window as any).THREE.SphereGeometry(2, 8, 6)
      const leavesMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x228B22 })
      const leaves = new (window as any).THREE.Mesh(leavesGeometry, leavesMaterial)
      leaves.position.y = 3
      
      const tree = new (window as any).THREE.Group()
      tree.add(trunk)
      tree.add(leaves)
      
      tree.position.set(
        Math.random() * 60 - 30,
        2,
        Math.random() * 60 - 30
      )
      
      trunk.castShadow = true
      leaves.castShadow = true
      scene.add(tree)
      trees.push(tree)
    }

    // Create supply drops (chests)
    const chests = []
    for (let i = 0; i < 8; i++) {
      const chestGeometry = new (window as any).THREE.BoxGeometry(1, 0.8, 1)
      const chestMaterial = new (window as any).THREE.MeshLambertMaterial({ 
        color: 0xFFD700,
        emissive: 0x111100
      })
      const chest = new (window as any).THREE.Mesh(chestGeometry, chestMaterial)
      chest.position.set(
        Math.random() * 70 - 35,
        0.4,
        Math.random() * 70 - 35
      )
      chest.castShadow = true
      scene.add(chest)
      chests.push(chest)
    }

    // Create storm wall effect
    const stormGeometry = new (window as any).THREE.RingGeometry(80, 120, 32)
    const stormMaterial = new (window as any).THREE.MeshLambertMaterial({ 
      color: 0x800080,
      transparent: true,
      opacity: 0.3,
      side: (window as any).THREE.DoubleSide
    })
    const storm = new (window as any).THREE.Mesh(stormGeometry, stormMaterial)
    storm.rotation.x = -Math.PI / 2
    storm.position.y = 0.1
    scene.add(storm)

    // Position camera
    camera.position.set(0, 15, 25)

    // Mouse controls
    let mouseX = 0
    let mouseY = 0
    let mouseDown = false

    const onMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY
        
        camera.position.x += deltaX * 0.05
        camera.position.y -= deltaY * 0.05
      }
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const onMouseDown = () => { mouseDown = true }
    const onMouseUp = () => { mouseDown = false }
    const onWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.05
      camera.position.z = Math.max(10, Math.min(100, camera.position.z))
    }

    canvasRef.current.addEventListener('mousemove', onMouseMove)
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    canvasRef.current.addEventListener('wheel', onWheel)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Animate chests (glowing effect)
      chests.forEach((chest, index) => {
        chest.rotation.y += 0.02
        const glow = 0.5 + Math.sin(Date.now() * 0.005 + index) * 0.3
        chest.material.emissive.setScalar(glow * 0.1)
      })

      // Animate storm wall
      storm.rotation.z += 0.005
      storm.material.opacity = 0.2 + Math.sin(Date.now() * 0.002) * 0.1

      // Sway trees slightly
      trees.forEach((tree, index) => {
        tree.rotation.z = Math.sin(Date.now() * 0.001 + index) * 0.05
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
      <div className="min-h-screen flex w-full bg-blue-200">
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
          
          <div className="absolute top-4 right-4 z-10 bg-black/80 text-yellow-400 p-4 rounded-xl border border-yellow-400">
            <h2 className="text-xl font-bold mb-2">🏆 3D Battle Royale</h2>
            <p className="text-sm">Battle royale arena</p>
            <p className="text-sm">Golden chests contain loot!</p>
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
