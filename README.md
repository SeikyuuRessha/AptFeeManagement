# BÁO CÁO: CƠ CHẾ HOẠT ĐỘNG HỆ THỐNG TOWER DEFENSE

## I. TỔNG QUAN HỆ THỐNG

### 1.1. Kiến trúc tổng thể
Hệ thống Tower Defense được xây dựng trên Unity Engine với kiến trúc **Component-Based Architecture** và **Event-Driven Programming**. Dự án được tổ chức thành 6 module chính:

- **Managers**: Quản lý các hệ thống core
- **Enemy**: Hệ thống kẻ thù và AI
- **Turret**: Hệ thống tháp phòng thủ
- **Spawner**: Hệ thống sinh enemy
- **Waypoints**: Hệ thống đường đi
- **UI/Editor Tools**: Giao diện và công cụ hỗ trợ

### 1.2. Design Patterns được sử dụng
- **Singleton Pattern**: Cho các manager (LevelManager, CurrencySystem, UIManager)
- **Object Pooling Pattern**: Tối ưu hiệu năng cho enemy và projectile
- **Observer Pattern**: Sử dụng C# Events để giao tiếp giữa các component
- **State Pattern**: Quản lý trạng thái game và animation
- **Factory Pattern**: Tạo enemies và turrets

## II. LUỒNG HOẠT ĐỘNG CHÍNH

### 2.1. Game Loop Flow
```
[Game Start] → [Spawn Wave] → [Enemy Movement] → [Turret Detection] 
     ↓              ↓              ↓                    ↓
[Initialize] → [Enemy Pool] → [Follow Waypoints] → [Auto Targeting]
     ↓              ↓              ↓                    ↓
[UI Setup]   → [Timer System] → [Health System] → [Projectile Fire]
     ↓              ↓              ↓                    ↓
[Currency]   → [Continuous] → [Damage/Death] → [Damage Calculation]
     ↓              ↓              ↓                    ↓
[Shop Ready] → [Until Wave End] → [Rewards] → [Return to Pool]
```

### 2.2. Initialization Sequence
1. **Singleton Managers khởi tạo**
   - LevelManager: Đặt lives = 10, currentWave = 1
   - CurrencySystem: Khởi tạo coins = 60
   - UIManager: Setup UI panels

2. **Object Poolers được tạo**
   - Enemy pools cho từng loại enemy
   - Projectile pools cho từng loại đạn
   - Damage text pool cho hiệu ứng UI

3. **Waypoint system setup**
   - Load đường đi từ ScriptableObject
   - Tính toán vị trí tương đối

## III. HỆ THỐNG ENEMY

### 3.1. Enemy Lifecycle
```
[Spawn from Pool] → [Set Waypoint] → [Movement Loop] → [Health Monitoring]
       ↓                ↓               ↓                    ↓
[Reset State] → [First Position] → [Path Following] → [Damage Response]
       ↓                ↓               ↓                    ↓
[Activate] → [Direction Update] → [Collision Check] → [Death/End Reached]
       ↓                ↓               ↓                    ↓
[Visual Update] → [Sprite Flip] → [Trigger Events] → [Return to Pool]
```

### 3.2. Movement System
**Cơ chế di chuyển:**
```csharp
// Update cycle trong Enemy.cs
private void Update() {
    Move();           // Di chuyển tới waypoint
    Rotate();         // Xoay sprite theo hướng
    CheckReached();   // Kiểm tra đến đích
}
```

**Path Following Algorithm:**
1. Lấy waypoint hiện tại từ Waypoint array
2. Sử dụng `Vector3.MoveTowards()` để di chuyển smooth
3. Tính distance để detect đã đến waypoint
4. Update index để chuyển waypoint tiếp theo

### 3.3. Health System
**Cơ chế máu:**
- CurrentHealth được quản lý bởi EnemyHealth component
- UI Health Bar được tạo động và cập nhật real-time
- Khi nhận damage: `CurrentHealth -= damageReceived`
- Death trigger: `CurrentHealth <= 0`

### 3.4. Animation System
**State Management:**
- **Idle**: Trạng thái di chuyển bình thường
- **Hurt**: Animation khi bị tấn công (tạm dừng movement)
- **Die**: Animation chết (disable movement, reset state)

## IV. HỆ THỐNG TURRET

### 4.1. Turret Combat Flow
```
[Enemy Detection] → [Target Selection] → [Aiming] → [Fire Projectile]
       ↓                    ↓              ↓            ↓
[CircleCollider2D] → [First in List] → [Rotation] → [Object Pool]
       ↓                    ↓              ↓            ↓
[Add to List] → [Update Target] → [Angle Check] → [Set Target]
       ↓                    ↓              ↓            ↓
[Range Check] → [Remove if Exit] → [IsAimed] → [Fire when Ready]
```

### 4.2. Target Detection
**Phát hiện mục tiêu:**
```csharp
// Sử dụng Unity Physics2D
OnTriggerEnter2D() → Thêm enemy vào _enemies list
OnTriggerExit2D()  → Xóa enemy khỏi _enemies list
GetCurrentTarget() → Chọn enemy[0] làm target
```

### 4.3. Aiming System
**Cơ chế nhắm:**
1. Tính vector direction từ turret đến enemy
2. Convert sang góc: `Mathf.Atan2(direction.y, direction.x)`
3. Smooth rotation: `Quaternion.RotateTowards()`
4. Check độ chính xác: `CurrentAngleToTarget <= 0.1f`

### 4.4. Projectile System
**Firing Mechanism:**
- Delay system: `Time.time >= _nextAttackTime`
- Condition check: Target exists + Turret aimed + Enemy alive
- Object pooling: Lấy projectile từ pool thay vì Instantiate
- Parent management: Projectile được "thả" khỏi turret khi fire

## V. HỆ THỐNG PROJECTILE

### 5.1. Projectile Movement
**Thuật toán theo đuổi:**
```csharp
// Trong Projectile.Update()
MoveProjectile() {
    target_position = enemy.bodyAim.position;
    current_position = Vector2.MoveTowards(current, target, speed * deltaTime);
    
    // Collision detection bằng distance
    if (distance < minDistanceToDealDamage) {
        DealDamage();
        ReturnToPool();
    }
}
```

### 5.2. Damage System
**Xử lý sát thương:**
1. Projectile hit enemy → Trigger event `OnEnemyHit`
2. Enemy nhận damage: `EnemyHealth.DealDamage()`
3. Visual feedback: Damage text xuất hiện
4. Animation: Enemy hurt animation
5. Audio/FX: Particle effects (nếu có)

## VI. HỆ THỐNG OBJECT POOLING

### 6.1. Pool Management
**Cơ chế hoạt động:**
```csharp
// Initialization
CreatePooler() {
    for (int i = 0; i < poolSize; i++) {
        pool.Add(CreateInstance());
        instance.SetActive(false);
    }
}

// Runtime
GetInstanceFromPool() {
    // Tìm object inactive trong pool
    // Nếu không có → Tạo mới
    // Return object đã setup
}

ReturnToPool() {
    instance.SetActive(false);
    // Object ready để reuse
}
```

### 6.2. Performance Benefits
- **Giảm Garbage Collection**: Không tạo/hủy objects liên tục
- **Consistent Frame Rate**: Không có spike khi spawn
- **Memory Efficiency**: Tái sử dụng memory đã allocate

## VII. HỆ THỐNG CURRENCY & ECONOMY

### 7.1. Currency Flow
```
[Enemy Death] → [Reward Calculation] → [Add Coins] → [Save to PlayerPrefs]
      ↓               ↓                    ↓              ↓
[Event Trigger] → [DeathCoinReward] → [TotalCoins++] → [Persistent Data]
      ↓               ↓                    ↓              ↓
[UI Update] → [Based on Enemy Type] → [Real-time] → [Cross-sessions]
```

### 7.2. Shop System
**Purchase Flow:**
1. Player click Node → Open turret shop
2. Player select turret → Check sufficient funds
3. If enough coins → Deduct cost + Place turret
4. Update UI → Close shop

## VIII. HỆ THỐNG UI & UX

### 8.1. UI Architecture
- **Canvas Hierarchy**: World Space cho health bars, Screen Space cho UI
- **Event System**: Button clicks → Manager methods
- **Real-time Updates**: Currency, health, wave info

### 8.2. User Interaction Flow
```
[Click Node] → [Open Shop] → [Select Turret] → [Purchase] → [Place Turret]
     ↓            ↓             ↓              ↓            ↓
[Node.OnClick] → [UIManager] → [TurretCard] → [Currency] → [TurretShopManager]
```

## IX. HỆ THỐNG EVENT-DRIVEN

### 9.1. Event Architecture
**Core Events:**
```csharp
// Enemy Events
Enemy.OnEndReached    → LevelManager.ReduceLives()
EnemyHealth.OnEnemyKilled → CurrencySystem.AddCoins()
EnemyHealth.OnEnemyHit    → EnemyAnimations.PlayHurt()

// Turret Events  
Node.OnNodeSelected → TurretShopManager.HandleNodeSelected()
TurretCard.OnPlaceTurret → TurretShopManager.HandlePlaceTurret()

// Projectile Events
Projectile.OnEnemyHit → EnemyFX.EnemyHit() (Damage text)
```

### 9.2. Decoupling Benefits
- **Loose Coupling**: Components không phụ thuộc trực tiếp
- **Extensibility**: Dễ thêm listeners mới
- **Maintainability**: Dễ debug và modify

## X. TỐI ƯU HÓA PERFORMANCE

### 10.1. Optimization Techniques
**Object Pooling:**
- Enemies: Tái sử dụng thay vì Instantiate/Destroy
- Projectiles: Pool per turret type
- UI Elements: Damage text pooling

**Update Optimization:**
- Turret targeting: Chỉ update khi có enemy trong range
- Animation: Coroutine thay vì Update liên tục
- UI: Event-driven updates thay vì polling

**Memory Management:**
- PlayerPrefs cho persistent data
- Efficient collections (List vs Array)
- Proper object lifecycle

### 10.2. Scalability Considerations
- **Wave System**: Có thể mở rộng với ScriptableObject
- **Turret Types**: Modular design cho easy expansion
- **Enemy Varieties**: Component-based cho flexibility

## XI. ĐIỂM MẠNH & ĐIỂM YẾU

### 11.1. Điểm Mạnh
✅ **Kiến trúc tốt**: Separation of concerns rõ ràng
✅ **Performance**: Object pooling hiệu quả
✅ **Maintainability**: Event-driven, modular design
✅ **Extensibility**: Dễ thêm turret/enemy types mới
✅ **Code Quality**: Consistent naming, proper encapsulation

### 11.2. Điểm Cần Cải Thiện
⚠️ **Enemy Rotation Logic**: Hiện tại có bug trong sprite flipping
⚠️ **Damage Text**: SetParent(null) có thể gây memory leak
⚠️ **Magic Numbers**: Hardcode values (0.1f, delay times)
⚠️ **Error Handling**: Thiếu null checks và exception handling
⚠️ **Audio System**: Chưa có sound effects

## XII. KẾT LUẬN

Hệ thống Tower Defense này thể hiện một kiến trúc game solid với các design patterns phù hợp. Việc sử dụng Object Pooling, Event System, và Component-based design tạo nên một codebase dễ maintain và extend.

**Điểm nổi bật:**
- Performance optimization tốt
- Code organization rõ ràng
- Scalable architecture
- Unity best practices

**Khuyến nghị cải thiện:**
1. Sửa logic flip enemy rotation
2. Implement proper audio system  
3. Add more error handling
4. Create data-driven wave configuration
5. Implement save/load system

Nhìn chung, đây là một implementation chất lượng cao của Tower Defense genre với potential để phát triển thành một game product hoàn chỉnh.

---
*Báo cáo được tạo bởi: AI Code Analyzer*  
*Ngày: 1 tháng 6, 2025*  
*Phiên bản: v1.0*
