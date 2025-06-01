
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

export default function MinecraftGame() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const [isOnline, setIsOnline] = useState(false)
  const [playerCount, setPlayerCount] = useState(1)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB) // Sky blue
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 10, 20)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 100, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Create Minecraft-style world
    const blockGeometry = new THREE.BoxGeometry(2, 2, 2)
    
    // Grass blocks
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x7CFC00 })
    for (let x = -20; x <= 20; x += 2) {
      for (let z = -20; z <= 20; z += 2) {
        const grassBlock = new THREE.Mesh(blockGeometry, grassMaterial)
        grassBlock.position.set(x, 0, z)
        grassBlock.castShadow = true
        grassBlock.receiveShadow = true
        scene.add(grassBlock)
      }
    }

    // Stone blocks (underground)
    const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 })
    for (let x = -20; x <= 20; x += 2) {
      for (let z = -20; z <= 20; z += 2) {
        for (let y = -4; y < 0; y += 2) {
          const stoneBlock = new THREE.Mesh(blockGeometry, stoneMaterial)
          stoneBlock.position.set(x, y, z)
          stoneBlock.castShadow = true
          stoneBlock.receiveShadow = true
          scene.add(stoneBlock)
        }
      }
    }

    // Trees
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 })
    
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 30
      const z = (Math.random() - 0.5) * 30
      
      // Trunk
      const trunk = new THREE.Mesh(blockGeometry, trunkMaterial)
      trunk.position.set(x, 4, z)
      trunk.castShadow = true
      scene.add(trunk)
      
      // Leaves
      for (let ly = 6; ly <= 10; ly += 2) {
        for (let lx = -2; lx <= 2; lx += 2) {
          for (let lz = -2; lz <= 2; lz += 2) {
            if (Math.random() > 0.3) {
              const leaf = new THREE.Mesh(blockGeometry, leafMaterial)
              leaf.position.set(x + lx, ly, z + lz)
              leaf.castShadow = true
              scene.add(leaf)
            }
          }
        }
      }
    }

    // Player character (simple cube)
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x0066CC })
    const player = new THREE.Mesh(blockGeometry, playerMaterial)
    player.position.set(0, 4, 0)
    player.castShadow = true
    scene.add(player)

    // Controls
    const keys: { [key: string]: boolean } = {}
    let mouseX = 0
    let mouseY = 0

    const handleKeyDown = (event: KeyboardEvent) => {
      keys[event.code] = true
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keys[event.code] = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === renderer.domElement) {
        mouseX += event.movementX * 0.002
        mouseY += event.movementY * 0.002
        mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, mouseY))
      }
    }

    const handleClick = () => {
      renderer.domElement.requestPointerLock()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', handleClick)

    // Game loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Player movement
      const moveSpeed = 0.3
      if (keys['KeyW']) {
        player.position.z -= Math.cos(mouseX) * moveSpeed
        player.position.x -= Math.sin(mouseX) * moveSpeed
      }
      if (keys['KeyS']) {
        player.position.z += Math.cos(mouseX) * moveSpeed
        player.position.x += Math.sin(mouseX) * moveSpeed
      }
      if (keys['KeyA']) {
        player.position.z -= Math.sin(mouseX) * moveSpeed
        player.position.x += Math.cos(mouseX) * moveSpeed
      }
      if (keys['KeyD']) {
        player.position.z += Math.sin(mouseX) * moveSpeed
        player.position.x -= Math.cos(mouseX) * moveSpeed
      }
      if (keys['Space']) {
        player.position.y += 0.2
      }

      // Apply gravity
      if (player.position.y > 4) {
        player.position.y -= 0.1
      } else {
        player.position.y = 4
      }

      // Camera follows player
      camera.position.x = player.position.x - Math.sin(mouseX) * 10
      camera.position.z = player.position.z + Math.cos(mouseX) * 10
      camera.position.y = player.position.y + 5
      camera.lookAt(player.position)

      // Update score based on movement
      setScore(prev => prev + 0.1)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  const handleReset = () => {
    setScore(0)
    if (sceneRef.current && cameraRef.current) {
      // Reset player position
      const player = sceneRef.current.children.find(child => 
        child instanceof THREE.Mesh && (child.material as THREE.MeshLambertMaterial).color.getHex() === 0x0066CC
      )
      if (player) {
        player.position.set(0, 4, 0)
      }
    }
  }

  const toggleOnlineMode = () => {
    setIsOnline(!isOnline)
    setPlayerCount(isOnline ? 1 : Math.floor(Math.random() * 8) + 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              className="border-2 border-green-300 text-green-600 hover:bg-green-50 text-xl font-black rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-5xl text-green-600 font-black">Minecraft World</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleOnlineMode}
              className={`text-xl font-black rounded-2xl px-6 py-3 ${
                isOnline 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              {isOnline ? 'Online' : 'Offline'} ({playerCount})
            </Button>
            <Button
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-black rounded-2xl px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-100 border-2 border-green-300">
            <CardHeader>
              <CardTitle className="text-green-600 text-xl font-black">Exploration Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-green-700">{Math.floor(score)}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-100 border-2 border-blue-300">
            <CardHeader>
              <CardTitle className="text-blue-600 text-xl font-black">Players Online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-blue-700">{playerCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-yellow-600 text-xl font-black">Game Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-black text-yellow-700">{isOnline ? 'Multiplayer' : 'Single Player'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-white/80 backdrop-blur-sm border-4 border-green-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardTitle className="text-2xl font-black">
              🎮 Use WASD to move, SPACE to jump, click to look around!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mountRef} 
              className="w-full h-[600px] bg-gradient-to-b from-blue-200 to-green-200"
              style={{ cursor: 'pointer' }}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-green-50 border-2 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-green-600 mb-4">How to Play:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="font-bold text-green-700">🎯 Controls:</p>
                <ul className="list-disc list-inside text-green-600 space-y-1">
                  <li>WASD - Move around</li>
                  <li>SPACE - Jump</li>
                  <li>Mouse - Look around (click first)</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-green-700">🏆 Objectives:</p>
                <ul className="list-disc list-inside text-green-600 space-y-1">
                  <li>Explore the world</li>
                  <li>Collect blocks (coming soon)</li>
                  <li>Build structures (coming soon)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
