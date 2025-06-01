
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Users, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

export default function HaloGame() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const [isOnline, setIsOnline] = useState(false)
  const [playerCount, setPlayerCount] = useState(1)
  const [score, setScore] = useState(0)
  const [kills, setKills] = useState(0)
  const [health, setHealth] = useState(100)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000011) // Dark space
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 5, 10)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x4080ff, 1)
    directionalLight.position.set(50, 100, 50)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Create Halo ring structure
    const ringGeometry = new THREE.RingGeometry(200, 250, 64)
    const ringMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    })
    const haloRing = new THREE.Mesh(ringGeometry, ringMaterial)
    haloRing.rotation.x = Math.PI / 2
    haloRing.position.y = -50
    scene.add(haloRing)

    // Ground platform
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Covenant structures
    const structureGeometry = new THREE.BoxGeometry(8, 12, 8)
    const structureMaterial = new THREE.MeshLambertMaterial({ color: 0x4B0082 })
    
    for (let i = 0; i < 8; i++) {
      const structure = new THREE.Mesh(structureGeometry, structureMaterial)
      const angle = (i / 8) * Math.PI * 2
      structure.position.set(
        Math.cos(angle) * 30,
        6,
        Math.sin(angle) * 30
      )
      structure.castShadow = true
      scene.add(structure)
    }

    // Player (Master Chief)
    const playerGeometry = new THREE.CapsuleGeometry(1, 3)
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x008000 })
    const player = new THREE.Mesh(playerGeometry, playerMaterial)
    player.position.set(0, 2, 0)
    player.castShadow = true
    scene.add(player)

    // Weapon (Energy Sword effect)
    const swordGeometry = new THREE.BoxGeometry(0.2, 4, 0.1)
    const swordMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8
    })
    const sword = new THREE.Mesh(swordGeometry, swordMaterial)
    sword.position.set(1.5, 2, 0)
    player.add(sword)

    // Enemy Covenant (moving targets)
    const enemies: THREE.Mesh[] = []
    const enemyGeometry = new THREE.CapsuleGeometry(0.8, 2.5)
    const enemyMaterial = new THREE.MeshLambertMaterial({ color: 0x800080 })
    
    for (let i = 0; i < 6; i++) {
      const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)
      const angle = (i / 6) * Math.PI * 2
      enemy.position.set(
        Math.cos(angle) * 25,
        1.5,
        Math.sin(angle) * 25
      )
      enemy.castShadow = true
      scene.add(enemy)
      enemies.push(enemy)
    }

    // Particle effects for atmosphere
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 500
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 200
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

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
      
      // Shooting mechanic
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      
      const intersects = raycaster.intersectObjects(enemies)
      if (intersects.length > 0) {
        const hitEnemy = intersects[0].object as THREE.Mesh
        scene.remove(hitEnemy)
        enemies.splice(enemies.indexOf(hitEnemy), 1)
        setKills(prev => prev + 1)
        setScore(prev => prev + 100)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', handleClick)

    // Game loop
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

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

      // Enemy AI (simple patrol)
      enemies.forEach((enemy, index) => {
        const angle = time + (index * Math.PI / 3)
        enemy.position.x = Math.cos(angle) * 25
        enemy.position.z = Math.sin(angle) * 25
      })

      // Camera follows player with FPS view
      camera.position.copy(player.position)
      camera.position.y += 1.5
      camera.rotation.y = mouseX
      camera.rotation.x = mouseY

      // Animate particles
      particles.rotation.y += 0.001

      // Animate Halo ring
      haloRing.rotation.z += 0.002

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
    setKills(0)
    setHealth(100)
    window.location.reload() // Simple reset
  }

  const toggleOnlineMode = () => {
    setIsOnline(!isOnline)
    setPlayerCount(isOnline ? 1 : Math.floor(Math.random() * 16) + 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              className="border-2 border-blue-300 text-blue-300 hover:bg-blue-900 text-xl font-black rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-5xl text-blue-300 font-black">HALO: Ring Defense</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleOnlineMode}
              className={`text-xl font-black rounded-2xl px-6 py-3 ${
                isOnline 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              {isOnline ? 'Online' : 'Offline'} ({playerCount})
            </Button>
            <Button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-900 border-2 border-blue-400 text-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-300 text-xl font-black">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-blue-200">{score}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-900 border-2 border-green-400 text-green-100">
            <CardHeader>
              <CardTitle className="text-green-300 text-xl font-black">Kills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-green-200">{kills}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-900 border-2 border-red-400 text-red-100">
            <CardHeader>
              <CardTitle className="text-red-300 text-xl font-black">Health</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-red-200">{health}%</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-900 border-2 border-purple-400 text-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-300 text-xl font-black">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-purple-200">{playerCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-black/80 backdrop-blur-sm border-4 border-blue-400 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <CardTitle className="text-2xl font-black flex items-center">
              <Target className="w-6 h-6 mr-2" />
              🎮 WASD to move, click to look around and shoot!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mountRef} 
              className="w-full h-[600px] bg-gradient-to-b from-purple-900 to-black"
              style={{ cursor: 'crosshair' }}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-blue-900 border-2 border-blue-400 text-blue-100">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-blue-300 mb-4">Mission Briefing:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="font-bold text-blue-200">🎯 Controls:</p>
                <ul className="list-disc list-inside text-blue-300 space-y-1">
                  <li>WASD - Move Master Chief</li>
                  <li>Mouse - Look around (click first)</li>
                  <li>Click - Fire energy weapon</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-blue-200">🏆 Mission:</p>
                <ul className="list-disc list-inside text-blue-300 space-y-1">
                  <li>Eliminate Covenant forces</li>
                  <li>Protect the Halo ring</li>
                  <li>Survive as long as possible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
