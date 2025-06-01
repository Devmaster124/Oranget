import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Users, Hammer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

export default function FortniteGame() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const [isOnline, setIsOnline] = useState(false)
  const [playerCount, setPlayerCount] = useState(1)
  const [playersLeft, setPlayersLeft] = useState(100)
  const [eliminations, setEliminations] = useState(0)
  const [materials, setMaterials] = useState({ wood: 100, stone: 50, metal: 25 })

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb) // Sky blue
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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(50, 100, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Island terrain
    const islandGeometry = new THREE.CircleGeometry(80, 32)
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 })
    const island = new THREE.Mesh(islandGeometry, islandMaterial)
    island.rotation.x = -Math.PI / 2
    island.receiveShadow = true
    scene.add(island)

    // Storm circle (shrinking)
    const stormGeometry = new THREE.RingGeometry(70, 75, 64)
    const stormMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x8B00FF,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    })
    const stormCircle = new THREE.Mesh(stormGeometry, stormMaterial)
    stormCircle.rotation.x = -Math.PI / 2
    stormCircle.position.y = 0.1
    scene.add(stormCircle)

    // Buildings and structures
    const buildingGeometry = new THREE.BoxGeometry(8, 15, 8)
    const buildingMaterials = [
      new THREE.MeshLambertMaterial({ color: 0x8B4513 }), // Wood
      new THREE.MeshLambertMaterial({ color: 0x808080 }), // Stone
      new THREE.MeshLambertMaterial({ color: 0xC0C0C0 })  // Metal
    ]

    const buildings: THREE.Mesh[] = []
    for (let i = 0; i < 15; i++) {
      const building = new THREE.Mesh(buildingGeometry, buildingMaterials[i % 3])
      const angle = (i / 15) * Math.PI * 2
      const distance = 20 + Math.random() * 40
      building.position.set(
        Math.cos(angle) * distance,
        7.5,
        Math.sin(angle) * distance
      )
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)
      buildings.push(building)
    }

    // Player character
    const playerGeometry = new THREE.CapsuleGeometry(1, 3)
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xFF6B35 })
    const player = new THREE.Mesh(playerGeometry, playerMaterial)
    player.position.set(0, 2, 0)
    player.castShadow = true
    scene.add(player)

    // Pickaxe
    const pickaxeGeometry = new THREE.BoxGeometry(0.3, 3, 0.3)
    const pickaxeMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 })
    const pickaxe = new THREE.Mesh(pickaxeGeometry, pickaxeMaterial)
    pickaxe.position.set(1.5, 2, 0)
    player.add(pickaxe)

    // Other players (enemies)
    const enemies: THREE.Mesh[] = []
    const enemyGeometry = new THREE.CapsuleGeometry(0.8, 2.5)
    
    for (let i = 0; i < 8; i++) {
      const enemyMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
      })
      const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)
      const angle = (i / 8) * Math.PI * 2
      enemy.position.set(
        Math.cos(angle) * 30,
        1.5,
        Math.sin(angle) * 30
      )
      enemy.castShadow = true
      scene.add(enemy)
      enemies.push(enemy)
    }

    // Build structures (walls)
    const wallGeometry = new THREE.BoxGeometry(4, 6, 0.5)
    const builtStructures: THREE.Mesh[] = []

    // Loot boxes
    const lootGeometry = new THREE.BoxGeometry(2, 2, 2)
    const lootMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 })
    
    for (let i = 0; i < 10; i++) {
      const loot = new THREE.Mesh(lootGeometry, lootMaterial)
      loot.position.set(
        (Math.random() - 0.5) * 60,
        1,
        (Math.random() - 0.5) * 60
      )
      loot.castShadow = true
      scene.add(loot)
    }

    // Controls
    const keys: { [key: string]: boolean } = {}
    let mouseX = 0
    let mouseY = 0
    let isBuilding = false

    const handleKeyDown = (event: KeyboardEvent) => {
      keys[event.code] = true
      
      // Building controls
      if (event.code === 'KeyF') {
        isBuilding = !isBuilding
      }
      
      // Build wall
      if (event.code === 'KeyB' && materials.wood > 0) {
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        const wall = new THREE.Mesh(wallGeometry, wallMaterial)
        
        const direction = new THREE.Vector3()
        camera.getWorldDirection(direction)
        const buildPos = player.position.clone().add(direction.multiplyScalar(3))
        buildPos.y = 3
        
        wall.position.copy(buildPos)
        wall.castShadow = true
        scene.add(wall)
        builtStructures.push(wall)
        
        setMaterials(prev => ({ ...prev, wood: prev.wood - 10 }))
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
      
      // Shooting/harvesting
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      
      // Check for enemy hits
      const enemyIntersects = raycaster.intersectObjects(enemies)
      if (enemyIntersects.length > 0) {
        const hitEnemy = enemyIntersects[0].object as THREE.Mesh
        scene.remove(hitEnemy)
        enemies.splice(enemies.indexOf(hitEnemy), 1)
        setEliminations(prev => prev + 1)
        setPlayersLeft(prev => prev - 1)
        return
      }
      
      // Check for building hits (harvesting)
      const buildingIntersects = raycaster.intersectObjects(buildings)
      if (buildingIntersects.length > 0) {
        const hitBuilding = buildingIntersects[0].object as THREE.Mesh
        const material = hitBuilding.material as THREE.MeshLambertMaterial
        
        if (material.color.getHex() === 0x8B4513) { // Wood
          setMaterials(prev => ({ ...prev, wood: prev.wood + 20 }))
        } else if (material.color.getHex() === 0x808080) { // Stone
          setMaterials(prev => ({ ...prev, stone: prev.stone + 15 }))
        } else { // Metal
          setMaterials(prev => ({ ...prev, metal: prev.metal + 10 }))
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', handleClick)

    // Game loop
    let time = 0
    let stormSize = 70
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

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
      if (keys['Space']) {
        player.position.y += 0.3
      }

      // Apply gravity
      if (player.position.y > 2) {
        player.position.y -= 0.2
      } else {
        player.position.y = 2
      }

      // Storm shrinking
      stormSize -= 0.01
      if (stormSize < 10) stormSize = 70 // Reset storm
      stormCircle.geometry = new THREE.RingGeometry(stormSize, stormSize + 5, 64)

      // Enemy AI
      enemies.forEach((enemy, index) => {
        const angle = time + (index * Math.PI / 4)
        enemy.position.x = Math.cos(angle) * (25 - time * 0.5)
        enemy.position.z = Math.sin(angle) * (25 - time * 0.5)
      })

      // Camera follows player
      camera.position.x = player.position.x - Math.sin(mouseX) * 12
      camera.position.z = player.position.z + Math.cos(mouseX) * 12
      camera.position.y = player.position.y + 8
      camera.lookAt(player.position.x, player.position.y + 2, player.position.z)

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
    setPlayersLeft(100)
    setEliminations(0)
    setMaterials({ wood: 100, stone: 50, metal: 25 })
    window.location.reload()
  }

  const toggleOnlineMode = () => {
    setIsOnline(!isOnline)
    setPlayerCount(isOnline ? 1 : 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-xl font-black rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-5xl text-white font-black">BATTLE ROYALE</h1>
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
              className="bg-orange-500 hover:bg-orange-600 text-white text-xl font-black rounded-2xl px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-red-500 border-2 border-red-300 text-white">
            <CardHeader>
              <CardTitle className="text-red-100 text-xl font-black">Players Left</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-white">{playersLeft}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-500 border-2 border-orange-300 text-white">
            <CardHeader>
              <CardTitle className="text-orange-100 text-xl font-black">Eliminations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-white">{eliminations}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-600 border-2 border-yellow-400 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-100 text-lg font-black">Wood</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-white">{materials.wood}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-500 border-2 border-gray-300 text-white">
            <CardHeader>
              <CardTitle className="text-gray-100 text-lg font-black">Stone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-white">{materials.stone}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 border-2 border-blue-400 text-white">
            <CardHeader>
              <CardTitle className="text-blue-100 text-lg font-black">Metal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-white">{materials.metal}</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="text-2xl font-black flex items-center">
              <Hammer className="w-6 h-6 mr-2" />
              🎮 WASD to move, B to build, F to harvest, click to shoot!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mountRef} 
              className="w-full h-[600px] bg-gradient-to-b from-blue-400 to-green-400"
              style={{ cursor: 'crosshair' }}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-white mb-4">Battle Royale Guide:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <p className="font-bold text-yellow-200">🎯 Controls:</p>
                <ul className="list-disc list-inside text-white space-y-1">
                  <li>WASD - Move around</li>
                  <li>SPACE - Jump</li>
                  <li>B - Build wall (costs wood)</li>
                  <li>F - Toggle build mode</li>
                  <li>Click - Shoot/Harvest</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-yellow-200">🏆 Objectives:</p>
                <ul className="list-disc list-inside text-white space-y-1">
                  <li>Eliminate other players</li>
                  <li>Harvest materials from buildings</li>
                  <li>Build defenses</li>
                  <li>Stay in the safe zone</li>
                  <li>Be the last player standing!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
