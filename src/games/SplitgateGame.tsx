
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Users, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

export default function SplitgateGame() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const [isOnline, setIsOnline] = useState(false)
  const [playerCount, setPlayerCount] = useState(1)
  const [score, setScore] = useState(0)
  const [eliminations, setEliminations] = useState(0)
  const [portalsUsed, setPortalsUsed] = useState(0)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)
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
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1)
    directionalLight.position.set(50, 100, 50)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Neon lighting effects
    const neonLight1 = new THREE.PointLight(0xff00ff, 2, 50)
    neonLight1.position.set(-20, 10, -20)
    scene.add(neonLight1)

    const neonLight2 = new THREE.PointLight(0x00ffff, 2, 50)
    neonLight2.position.set(20, 10, 20)
    scene.add(neonLight2)

    // Arena floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100)
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2a2a4a,
      transparent: true,
      opacity: 0.8
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Arena walls with portal spots
    const wallGeometry = new THREE.BoxGeometry(2, 15, 20)
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x404060 })
    
    // Create arena walls
    const walls = [
      { x: 0, z: 40, ry: 0 },
      { x: 0, z: -40, ry: 0 },
      { x: 40, z: 0, ry: Math.PI/2 },
      { x: -40, z: 0, ry: Math.PI/2 }
    ]

    walls.forEach(wall => {
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)
      wallMesh.position.set(wall.x, 7.5, wall.z)
      wallMesh.rotation.y = wall.ry
      wallMesh.castShadow = true
      scene.add(wallMesh)
    })

    // Portal rings
    const portals: THREE.Mesh[] = []
    const portalGeometry = new THREE.RingGeometry(3, 4, 32)
    const portalMaterial1 = new THREE.MeshBasicMaterial({ 
      color: 0xff6600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    })
    const portalMaterial2 = new THREE.MeshBasicMaterial({ 
      color: 0x0066ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    })

    // Orange portal
    const portal1 = new THREE.Mesh(portalGeometry, portalMaterial1)
    portal1.position.set(-35, 8, 0)
    portal1.rotation.y = Math.PI / 2
    scene.add(portal1)
    portals.push(portal1)

    // Blue portal
    const portal2 = new THREE.Mesh(portalGeometry, portalMaterial2)
    portal2.position.set(35, 8, 0)
    portal2.rotation.y = Math.PI / 2
    scene.add(portal2)
    portals.push(portal2)

    // Player
    const playerGeometry = new THREE.CapsuleGeometry(1, 3)
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
    const player = new THREE.Mesh(playerGeometry, playerMaterial)
    player.position.set(0, 2, 0)
    player.castShadow = true
    scene.add(player)

    // Enemies
    const enemies: THREE.Mesh[] = []
    const enemyGeometry = new THREE.CapsuleGeometry(0.8, 2.5)
    const enemyMaterial = new THREE.MeshLambertMaterial({ color: 0xff4444 })
    
    for (let i = 0; i < 5; i++) {
      const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)
      const angle = (i / 5) * Math.PI * 2
      enemy.position.set(
        Math.cos(angle) * 20,
        1.5,
        Math.sin(angle) * 20
      )
      enemy.castShadow = true
      scene.add(enemy)
      enemies.push(enemy)
    }

    // Weapon trail effect
    const trailGeometry = new THREE.BufferGeometry()
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    })
    const weaponTrail = new THREE.Line(trailGeometry, trailMaterial)
    scene.add(weaponTrail)

    // Controls
    const keys: { [key: string]: boolean } = {}
    let mouseX = 0
    let mouseY = 0

    const handleKeyDown = (event: KeyboardEvent) => {
      keys[event.code] = true
      
      // Portal placement
      if (event.code === 'KeyQ') {
        // Place orange portal
        const direction = new THREE.Vector3()
        camera.getWorldDirection(direction)
        const newPos = player.position.clone().add(direction.multiplyScalar(10))
        portal1.position.copy(newPos)
        setPortalsUsed(prev => prev + 1)
      }
      if (event.code === 'KeyE') {
        // Place blue portal
        const direction = new THREE.Vector3()
        camera.getWorldDirection(direction)
        const newPos = player.position.clone().add(direction.multiplyScalar(10))
        portal2.position.copy(newPos)
        setPortalsUsed(prev => prev + 1)
      }
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
      
      // Shooting
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      
      const intersects = raycaster.intersectObjects(enemies)
      if (intersects.length > 0) {
        const hitEnemy = intersects[0].object as THREE.Mesh
        scene.remove(hitEnemy)
        enemies.splice(enemies.indexOf(hitEnemy), 1)
        setEliminations(prev => prev + 1)
        setScore(prev => prev + 150)
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
      time += 0.02

      // Player movement
      const moveSpeed = 0.4
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

      // Portal teleportation
      const distanceToPortal1 = player.position.distanceTo(portal1.position)
      const distanceToPortal2 = player.position.distanceTo(portal2.position)
      
      if (distanceToPortal1 < 5) {
        player.position.copy(portal2.position)
        player.position.y = 2
        setScore(prev => prev + 50)
      } else if (distanceToPortal2 < 5) {
        player.position.copy(portal1.position)
        player.position.y = 2
        setScore(prev => prev + 50)
      }

      // Enemy AI
      enemies.forEach((enemy, index) => {
        const angle = time + (index * Math.PI / 2.5)
        enemy.position.x = Math.cos(angle) * 15
        enemy.position.z = Math.sin(angle) * 15
      })

      // Camera follows player
      camera.position.copy(player.position)
      camera.position.y += 1.5
      camera.rotation.y = mouseX
      camera.rotation.x = mouseY

      // Animate portals
      portals.forEach(portal => {
        portal.rotation.z += 0.02
      })

      // Animate lights
      neonLight1.intensity = 2 + Math.sin(time * 2) * 0.5
      neonLight2.intensity = 2 + Math.cos(time * 2) * 0.5

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
    setEliminations(0)
    setPortalsUsed(0)
    window.location.reload()
  }

  const toggleOnlineMode = () => {
    setIsOnline(!isOnline)
    setPlayerCount(isOnline ? 1 : Math.floor(Math.random() * 12) + 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              className="border-2 border-cyan-300 text-cyan-300 hover:bg-cyan-900 text-xl font-black rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-5xl text-cyan-300 font-black">SPLITGATE: Portal Arena</h1>
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
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-xl font-black rounded-2xl px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-cyan-900 border-2 border-cyan-400 text-cyan-100">
            <CardHeader>
              <CardTitle className="text-cyan-300 text-xl font-black">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-cyan-200">{score}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-900 border-2 border-orange-400 text-orange-100">
            <CardHeader>
              <CardTitle className="text-orange-300 text-xl font-black">Eliminations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-orange-200">{eliminations}</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-900 border-2 border-purple-400 text-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-300 text-xl font-black">Portals Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-purple-200">{portalsUsed}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-900 border-2 border-blue-400 text-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-300 text-xl font-black">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-blue-200">{playerCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-black/80 backdrop-blur-sm border-4 border-cyan-400 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-purple-700 text-white">
            <CardTitle className="text-2xl font-black flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              🎮 WASD to move, Q/E for portals, click to shoot!
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
        <Card className="mt-6 bg-cyan-900 border-2 border-cyan-400 text-cyan-100">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-cyan-300 mb-4">Portal Combat Guide:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="font-bold text-cyan-200">🎯 Controls:</p>
                <ul className="list-disc list-inside text-cyan-300 space-y-1">
                  <li>WASD - Move player</li>
                  <li>Q - Place orange portal</li>
                  <li>E - Place blue portal</li>
                  <li>Click - Shoot enemies</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-cyan-200">🏆 Strategy:</p>
                <ul className="list-disc list-inside text-cyan-300 space-y-1">
                  <li>Use portals for tactical movement</li>
                  <li>Eliminate all enemies</li>
                  <li>Master portal placement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
