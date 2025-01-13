// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    // Check if Phaser is available
    if (typeof Phaser === 'undefined') {
        console.error('Phaser is not loaded. Make sure you have included the Phaser library in your HTML file.');
        return;
    }

    // Game variables
    let gameCanvas;
    let player;
    let tubes;          // New: for tube obstacles
    let logos;          // New: for collectible logos
    let stars;
    let clouds;
    let cursors;
    let score = 0;
    let totalWins = 0;
    let scoreText;
    let gameOverText;
    let howToPlayText;
    let getReadyContainer;
    let getReadyVisible = false;
    let tapInstruction;
    let countdownText;
    let gameActive = false;
    let gameStarted = false;
    let winsText;
    let gameSpeed = 1;
    let leaderboardText;
    let obstacleSize = 50;
    let hallOfFameObstacleSize = 75;
    let hallOfFameObstacleFrequency = 100;
    let raysLogo;
    let gameMode = '';
    let allStarLeaderboard = [];
    let hallOfFameLeaderboard = [];
    let powerUpActive = false;
    let powerUpTimer;
    let powerUpText;
    let invisibilityActive = false;
    let invisibilityTimer;
    let invisibilityText;
    let regularBackground;
    let currentObstacleIndex = 0;
    let lastTubeTime = 0;      // New: tracking tube spawn timing

    // New variables for enhanced game over screen
    let gameOverContainer;
    let gameOverOverlay;
    let finalScoreText;
    let totalWinsText;
    let gamertagText;
    let achievementIcons;
    let statsGrid;

    // New variables for user data
    let userOktaId = null;
    let userGamertag = null;
    let optInScreen;

    // Game constants
    const FLAP_VELOCITY = -350;
    const GRAVITY = 800;
    const MASCOT_START_X = 200;
    const MASCOT_START_Y = 300;
    const GAP_SIZE_INITIAL = 200;
    const GAP_MIN_SIZE = 150;
    const OBSTACLE_SPEED = -200;
    let gapSize = GAP_SIZE_INITIAL;

    // New: Tube and Logo Configuration
    const TUBE_CONFIG = {
        WIDTH: 25,              // Slightly wider for better visibility
        HEIGHT: 400,
        GAP: GAP_SIZE_INITIAL,
        MIN_GAP: GAP_MIN_SIZE,
        COLOR: 0xFFD700,        // Bright yellow for foul poles
        SPAWN_INTERVAL: 2000,
        SPEED: OBSTACLE_SPEED,
        SHADOW_COLOR: 0xCCAA00  // Color for shading
    };

    const LOGO_CONFIG = {
        SIZE: 50,
        POINTS: 25,
        ROTATION_SPEED: 1
    };
    // Game Mode Configuration
    const GAME_MODES = {
        'ALL STAR': {
            initialSpeed: 1,
            maxSpeed: 2,
            speedIncrease: 0.1,
            scorePerSpeedIncrease: 1000,
            initialGapSize: GAP_SIZE_INITIAL,
            minGapSize: GAP_MIN_SIZE,
            gapDecrease: 10
        },
        'HALL OF FAME': {
            initialSpeed: 1.33,  // 33% faster to start
            maxSpeed: 2.5,      // Higher max speed
            speedIncrease: 0.15, // Faster speed progression
            scorePerSpeedIncrease: 800, // More frequent speed increases
            initialGapSize: GAP_SIZE_INITIAL * 0.67, // 33% smaller gap
            minGapSize: GAP_MIN_SIZE * 0.67, // 33% smaller minimum gap
            gapDecrease: 15    // Faster gap size reduction
        }
    };

    // Maintain original obstacle order
    const obstacleOrder = [
        'rockies', 'rockies', 'rockies', 'pirates', 'pirates', 'pirates', 'rangers', 'rangers', 'rangers',
        'angels', 'angels', 'angels', 'braves', 'braves', 'braves', 'redsox', 'redsox', 'redsox',
        'yankees', 'yankees', 'yankees', 'yankees', 'diamondbacks', 'diamondbacks', 'diamondbacks',
        'padres', 'padres', 'padres', 'royals', 'royals', 'royals', 'yankees', 'yankees', 'yankees',
        'phillies', 'phillies', 'phillies', 'brewers', 'brewers', 'brewers', 'bluejays', 'bluejays', 'bluejays',
        'marlins', 'marlins', 'marlins', 'astros', 'astros', 'astros', 'bluejays', 'bluejays', 'bluejays',
        'twins', 'twins', 'twins', 'astros', 'astros', 'astros', 'astros', 'rangers', 'rangers', 'rangers',
        'marlins', 'marlins', 'marlins', 'redsox', 'redsox', 'redsox', 'mets', 'mets', 'mets',
        'orioles', 'orioles', 'orioles', 'orioles', 'tigers', 'tigers', 'tigers', 'royals', 'royals', 'royals',
        'orioles', 'orioles', 'orioles', 'athletics', 'athletics', 'athletics', 'twins', 'twins', 'twins',
        'tigers', 'tigers', 'tigers', 'redsox', 'redsox', 'redsox', 'redsox', 'orioles', 'orioles', 'orioles',
        'whitesox', 'whitesox', 'whitesox', 'reds', 'reds', 'reds', 'yankees', 'yankees', 'yankees', 'yankees',
        'dodgers', 'dodgers', 'dodgers', 'angels', 'angels', 'angels', 'mariners', 'mariners', 'mariners',
        'athletics', 'athletics', 'athletics', 'giants', 'giants', 'giants', 'yankees', 'yankees',
        'cardinals', 'cardinals', 'cardinals', 'guardians', 'guardians', 'guardians', 'nationals', 'nationals', 'nationals',
        'mariners', 'mariners', 'mariners', 'guardians', 'guardians', 'guardians', 'whitesox', 'whitesox', 'whitesox',
        'cubs', 'cubs', 'cubs', 'bluejays', 'bluejays', 'bluejays', 'bluejays', 'redsox', 'redsox', 'redsox',
        'orioles', 'orioles', 'orioles', 'bluejays', 'bluejays', 'bluejays'
    ];
    // Game configuration with updated physics for Flappy Bird style
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600,
            parent: 'game-container',
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: GRAVITY },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    // Initialize the game
    const game = new Phaser.Game(config);

    // Game size and dimension functions
    function calculateGameSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = Math.min(width / 800, height / 600);
        return {
            width: 800,
            height: 600,
            zoom: ratio
        };
    }
    
    function getGameDimensions() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const baseWidth = 800;
        const baseHeight = 600;
        let width = baseWidth;
        let height = baseHeight;
    
        const ratioW = windowWidth / baseWidth;
        const ratioH = windowHeight / baseHeight;
        const ratio = Math.min(ratioW, ratioH);
    
        width = baseWidth * ratio;
        height = baseHeight * ratio;
    
        return { width, height, ratio };
    }

    // Handle resize events
    function handleResize() {
        if (!gameCanvas) {
            gameCanvas = document.querySelector('canvas');
        }
        
        if (game && gameCanvas) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const wratio = width / height;
            const ratio = 800 / 600;
            
            if (wratio < ratio) {
                const newWidth = width;
                const newHeight = Math.floor(width / ratio);
                gameCanvas.style.width = `${newWidth}px`;
                gameCanvas.style.height = `${newHeight}px`;
            } else {
                const newWidth = Math.floor(height * ratio);
                const newHeight = height;
                gameCanvas.style.width = `${newWidth}px`;
                gameCanvas.style.height = `${newHeight}px`;
            }
        }
    }

    // Add resize event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });

    // Core game functions
    function preload() {
        console.log('Preload function called');
        this.load.image('mascot', 'assets/blue_mascot.png');
        this.load.image('rays', 'assets/rays.png');
        this.load.image('pizza', 'assets/pizza.png');
        
        // Game over screen assets
        this.load.image('trophy', 'assets/trophy.png');
        this.load.image('medal-gold', 'assets/medal-gold.png');
        this.load.image('medal-silver', 'assets/medal-silver.png');
        this.load.image('medal-bronze', 'assets/medal-bronze.png');
        
        // Load all team logos
        const obstacleImages = [
            'angels', 'astros', 'athletics', 'braves', 'cardinals', 'cubs', 'dodgers', 'giants',
            'guardians', 'mariners', 'mets', 'nationals', 'padres', 'phillies', 'pirates',
            'rangers', 'reds', 'rockies', 'royals', 'tigers', 'twins', 'whitesox', 'yankees',
            'diamondbacks', 'redsox', 'bluejays', 'orioles', 'marlins', 'brewers'
        ];
        
        obstacleImages.forEach(img => {
            this.load.image(img, `assets/${img}.png`);
        });
    
        // Create foul pole texture with enhanced visual details
        const graphics = this.add.graphics();
        
        // Draw the main pole body
        graphics.fillStyle(TUBE_CONFIG.COLOR, 1);  // Bright yellow
        graphics.fillRect(0, 0, TUBE_CONFIG.WIDTH, TUBE_CONFIG.HEIGHT);
        
        // Add 3D effect with darker shading on the right side
        graphics.fillStyle(0xCCAA00, 1);  // Darker yellow for depth
        graphics.lineStyle(1, 0xCCAA00);  // Thin line for edge definition
        graphics.fillRect(TUBE_CONFIG.WIDTH - 5, 0, 5, TUBE_CONFIG.HEIGHT);
        
        // Add decorative horizontal bands every 50 pixels
        graphics.lineStyle(1, 0xCCAA00);
        for (let y = 0; y < TUBE_CONFIG.HEIGHT; y += 50) {
            graphics.beginPath();
            graphics.moveTo(0, y);
            graphics.lineTo(TUBE_CONFIG.WIDTH, y);
            graphics.strokePath();
        }
        
        // Add pole caps (top and bottom)
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillRect(-5, 0, TUBE_CONFIG.WIDTH + 10, 10);  // Top cap
        graphics.fillRect(-5, TUBE_CONFIG.HEIGHT - 10, TUBE_CONFIG.WIDTH + 10, 10);  // Bottom cap
        
        // Generate the texture and clean up
        graphics.generateTexture('tube', TUBE_CONFIG.WIDTH, TUBE_CONFIG.HEIGHT);
        graphics.destroy();  // Important: Clean up the graphics object
    }
    

    function createMascot(scene, x, y) {
        let mascot = scene.add.image(x, y, 'mascot');
        mascot.setDisplaySize(80, 80);
        mascot.setDepth(10);
        
        // Add physics body with more generous size for better collision detection
        scene.physics.add.existing(mascot);
        mascot.body.setSize(120, 120); // Much larger collision box
        mascot.body.setOffset(-20, -20); // Center the larger collision box
        
        return mascot;
    }

    function create() {
        // Set up resize handling
        if (game.scale) {
            game.scale.on('resize', (gameSize) => {
                const width = gameSize.width;
                const height = gameSize.height;
                
                if (this.cameras && this.cameras.main) {
                    this.cameras.main.setViewport(0, 0, width, height);
                }
                
                if (player) {
                    const ratioX = width / 800;
                    const ratioY = height / 600;
                    updateGameElementsPosition(ratioX, ratioY);
                }
            });
        }

        // Create the gradient background first
        const gradientBackground = this.add.graphics();
        gradientBackground.fillGradientStyle(
            0x092C5C, 0x092C5C,  // Navy Blue
            0x061830, 0x061830,  // Darker Navy
            1, 1,                // Full opacity at top
            1, 1                 // Full opacity at bottom
        );
        gradientBackground.fillRect(0, 0, 800, 600);
        regularBackground = gradientBackground;

        // Add a subtle gradient overlay using Navy Blue
        const gradientOverlay = this.add.graphics();
        gradientOverlay.fillGradientStyle(
            0x092C5C, 0x092C5C,  // Navy Blue
            0x8FBCE6, 0x8FBCE6,  // Columbia Blue
            0.1, 0.1,            // Alpha values (transparency)
            0.3, 0.3             // Alpha values (transparency)
        );
        gradientOverlay.fillRect(0, 0, 800, 600);
        
        // Initialize player
        player = createMascot(this, MASCOT_START_X, MASCOT_START_Y);
        this.physics.add.existing(player);
        player.body.setCollideWorldBounds(true);
        player.setVisible(false);

        // Set up input for Flappy Bird controls
        this.input.on('pointerdown', function() {
            if (gameActive) {
                flapMascot.call(this);
            }
        }, this);

        this.input.keyboard.on('keydown-SPACE', function() {
            if (gameActive) {
                flapMascot.call(this);
            }
        }, this);

        // Initialize game groups
        tubes = this.physics.add.group();    // New: tube group
        logos = this.physics.add.group();    // New: logo group
        stars = this.physics.add.group();
        clouds = this.physics.add.group();

        // Set up UI elements
        setupGameUI.call(this);
        
        // Create the rays logo
        raysLogo = this.add.image(10, 8, 'rays');
        raysLogo.setOrigin(0, 0);
        raysLogo.setDisplaySize(100, 100);
        raysLogo.setDepth(20);

        // Set up physics and collisions
        setupPhysics.call(this);
        
        // Create game mode buttons and opt-in screen
        createGameModeButtons.call(this);
        createOptInScreen.call(this);

        // Pause physics initially
        this.physics.pause();
    }

    function setupGameUI() {
        // Score text
        scoreText = this.add.text(400, 30, 'SCORE: 0', { 
            fontSize: '24px', 
            fill: '#FFFFFF',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold'
        });
        scoreText.setOrigin(0.5);
        scoreText.setVisible(false);
        scoreText.setDepth(20);
        
        // Wins text
        winsText = this.add.text(790, 20, 'WINS: 0/162', {
            fontSize: '20px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            fill: '#FFFFFF',
            align: 'right'
        });
        winsText.setOrigin(1, 0);
        winsText.setVisible(false);
        winsText.setDepth(20);
        
        // How to play text - Updated with Navy Blue background
        howToPlayText = this.add.text(400, 300, 
            'HOW TO PLAY:\n\n' +
            'TAP your screen or press SPACE to make Raymond fly up!\n\n' +
            'Navigate and avoid jumping into tubes\n' +
            'Collect team logos for bonus points\n\n' +
            'Complete ALL 162 tubes to WIN the game!\n' +
            'Opponent Logos: +25 points\n' +
            'Yellow Stars: +100 bonus points + Boost\n' +
            'Blue Stars: 500 bonus points + Zero Gravity\n' +
            'Pizza: 1000 bonus points + Invisibility\n', 
            {
                fontSize: '16px',
                fontFamily: 'comic sans ms',
                fill: '#000000',  // Changed to black text
                align: 'center',
                backgroundColor: '#F5D130',  // Changed to Rays Yellow
                padding: { x: 20, y: 20 },
                wordWrap: { width: 600 }
            }
        );
        howToPlayText.setOrigin(0.5);
        howToPlayText.setDepth(20);
    }

    function setupPhysics() {
        // Add collision detection
        this.physics.add.overlap(player, tubes, handleCollision, null, this);
        this.physics.add.overlap(player, logos, collectLogo, 
            function(player, logo) {
                return true; // Always check for collision (removes default bounds check)
            }, this);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        
        // Add world bounds collision
        player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', function(body) {
            if (body.gameObject === player) {
                gameOver.call(this);
            }
        }, this);
    }

    function update(time) {
        if (!gameActive) return;
    
        // Get mode-specific settings
        const modeSettings = GAME_MODES[gameMode];
        
        // Spawn new tubes and logos with mode-specific timing
        if (time - lastTubeTime >= TUBE_CONFIG.SPAWN_INTERVAL) {
            createTubeAndLogo.call(this);
            lastTubeTime = time;
        }
    
        // Spawn stars occasionally
        if (Phaser.Math.Between(1, 250) === 1) {
            createStar.call(this);
        }
    
        // Update game elements
        updateGameElements.call(this);
    
        // Update score
        score += 1;
        scoreText.setText('SCORE: ' + score);
    
        // Update game speed based on mode-specific settings
        gameSpeed = Math.min(
            modeSettings.maxSpeed,
            modeSettings.initialSpeed + Math.floor(score / modeSettings.scorePerSpeedIncrease) * modeSettings.speedIncrease
        );
    
        // Adjust star spawn velocity based on game speed
        stars.getChildren().forEach((star) => {
            star.body.setVelocityX(-150 * gameSpeed);
        });
    }

    function updateGameElements() {
        // Clean up off-screen tubes
        tubes.getChildren().forEach((tube) => {
            if (tube.x < -tube.width) {
                tube.destroy();
            }
        });

        // Clean up off-screen logos
        logos.getChildren().forEach((logo) => {
            if (logo.x < -logo.width) {
                logo.destroy();
            }
        });

        // Update stars
        stars.getChildren().forEach((star) => {
            if (star.x < -star.width) {
                stars.remove(star, true, true);
            }
        });
    }

    function updateGameElementsPosition(ratioX, ratioY) {
        player.x *= ratioX;
        player.y *= ratioY;
        
        if (scoreText) scoreText.setPosition(400 * ratioX, 30);
        if (winsText) winsText.setPosition((800 - 10) * ratioX, 20);
    }

    function flapMascot() {
        if (!player || !gameActive) return;
        
        player.body.setVelocityY(FLAP_VELOCITY);
        // No rotation animations - Raymond stays upright
    }

    function handleCollision(player, obstacle) {
        if (!invisibilityActive) {
            gameOver.call(this);
        }
    }

    // New: Create tube and logo pair
    function createTubeAndLogo() {
        if (currentObstacleIndex >= obstacleOrder.length) {
            currentObstacleIndex = 0;
        }
    
        const modeSettings = GAME_MODES[gameMode];
        
        // Calculate gap size that decreases with score based on game mode
        const gapSize = Math.max(
            modeSettings.minGapSize,
            modeSettings.initialGapSize - Math.floor(score / 1000) * modeSettings.gapDecrease
        );
        
        // Calculate random position for gap
        const minY = 150;  // Increased minimum to ensure poles are visible
        const maxY = this.game.config.height - 150 - gapSize;  // Adjusted for better spacing
        const gapCenter = Phaser.Math.Between(minY, maxY);
        
        // Create top tube with adjusted origin for better positioning
        const topTube = this.add.image(800, gapCenter - gapSize/2, 'tube');
        topTube.setOrigin(0.5, 1);
        this.physics.add.existing(topTube);
        tubes.add(topTube);
    
        // Create bottom tube
        const bottomTube = this.add.image(800, gapCenter + gapSize/2, 'tube');
        bottomTube.setOrigin(0.5, 0);
        this.physics.add.existing(bottomTube);
        tubes.add(bottomTube);
    
        // Enhanced tube physics setup with mode-specific speed
        [topTube, bottomTube].forEach(tube => {
            tube.body.setVelocityX(TUBE_CONFIG.SPEED * gameSpeed);
            tube.body.setImmovable(true);
            tube.body.setAllowGravity(false);
            // Slightly smaller collision box than visual
            tube.body.setSize(TUBE_CONFIG.WIDTH - 6, TUBE_CONFIG.HEIGHT);
            tube.body.setOffset(3, 0);  // Center the collision box
        });
    
        // Create team logo with enhanced collision detection
        const logoName = obstacleOrder[currentObstacleIndex];
        
        // Create a container for the logo and its collision area
        const logoContainer = this.add.container(800, gapCenter);
        
        // Create the visible logo
        const logo = this.add.image(0, 0, logoName);
        logo.setDisplaySize(LOGO_CONFIG.SIZE, LOGO_CONFIG.SIZE);
        logo.setOrigin(0.5, 0.5);
        
        // Create an invisible collision rectangle (1x1 multiplier of the logo size)
        const collisionArea = this.add.rectangle(
            0, 0,                              // Center position relative to container
            LOGO_CONFIG.SIZE * 2,              // Width is 2x the logo size
            LOGO_CONFIG.SIZE * 2,              // Height is 2x the logo size
            0x000000, 0                        // Transparent color
        );
        
        // Add both to the container
        logoContainer.add([collisionArea, logo]);
        
        // Add physics to the container
        this.physics.world.enable(logoContainer);
        
        // Set up the physics body for the entire container
        const containerBody = logoContainer.body;
        containerBody.setSize(
            LOGO_CONFIG.SIZE * 6,            
            LOGO_CONFIG.SIZE * 6             
        );
        containerBody.setOffset(
            -LOGO_CONFIG.SIZE * 3,          
            -LOGO_CONFIG.SIZE * 3           
        );
        
        // Set data on the container
        logoContainer.setData('collected', false);
        logoContainer.setData('lastChecked', 0);
        logoContainer.setData('logo', logo); // Store reference to the logo image
        
        // Add to logos group
        logos.add(logoContainer);
        
        // Set movement
        containerBody.setVelocityX(TUBE_CONFIG.SPEED * gameSpeed);
        containerBody.setAllowGravity(false);
    }

    function collectLogo(player, logoContainer) {
        const currentTime = Date.now();
        const lastChecked = logoContainer.getData('lastChecked') || 0;
        
        // Prevent double collection and ensure minimum time between checks
        if (logoContainer.getData('collected') || currentTime - lastChecked < 8) {
            return;
        }

        // Get container bounds with padding
        const containerBounds = logoContainer.getBounds();
        containerBounds.x -= 50;
        containerBounds.y -= 50;
        containerBounds.width += 100;
        containerBounds.height += 100;
        
        // Get player bounds with padding
        const playerBounds = player.getBounds();
        playerBounds.x -= 50;
        playerBounds.y -= 50;
        playerBounds.width += 100;
        playerBounds.height += 100;
    
        // If bounds overlap even slightly, collect the logo
        if (Phaser.Geom.Rectangle.Overlaps(playerBounds, containerBounds)) {
            logoContainer.setData('collected', true);
            totalWins++;
        
        logoContainer.setData('lastChecked', currentTime);
        
        // Get the actual logo image from the container
        const logo = logoContainer.getData('logo');
        
        // We don't need additional bounds checking since we have a generous invisible collision area
        logoContainer.setData('collected', true);
        totalWins++;
        
        // Update displays
        winsText.setText('WINS: ' + totalWins + '/162');
        
        // Show point popup
        showPointPopup(this, logoContainer.x, logoContainer.y, "WIN!");
        
        // Enhanced visual feedback
        this.tweens.add({
            targets: logo,
            alpha: 0,
            scale: 1.5,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                logoContainer.destroy();
            }
        });
        
        // Add extra visual feedback (optional)
        const flashEffect = this.add.circle(logoContainer.x, logoContainer.y, 40, 0xFFD700, 0.5);
        this.tweens.add({
            targets: flashEffect,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                flashEffect.destroy();
            }
        });
    }

    function createStar() {
        let itemType = Phaser.Math.Between(1, 100);
        let item;
        
        // Random height for stars in Flappy Bird style
        const starHeight = Phaser.Math.Between(100, 500);
        
        if (itemType <= 15) {  // Blue star - Power Up
            item = this.add.star(800, starHeight, 5, 15, 30, 0x0000FF);
            item.setData('points', 500);
            item.setData('type', 'blueStar');
        } else if (itemType <= 30) {  // Pizza - Invisibility
            item = this.add.image(800, starHeight, 'pizza');
            item.setDisplaySize(50, 50);
            item.setData('points', 1000);
            item.setData('type', 'pizza');
        } else {  // Regular yellow star
            item = this.add.star(800, starHeight, 5, 15, 20, 0xFFFF00);
            item.setData('points', 100);
            item.setData('type', 'yellowStar');
        }

        this.physics.add.existing(item);
        stars.add(item);
        item.body.setVelocityX(-150 * gameSpeed);
        item.body.setAllowGravity(false);
    }
    function createCloud(x, y) {
        let cloud = this.add.graphics();
        cloud.fillStyle(0xFFFFFF, 1);
        cloud.fillCircle(x, y, 20);
        cloud.fillCircle(x + 15, y + 10, 20);
        cloud.fillCircle(x + 30, y, 20);
        cloud.fillCircle(x + 15, y - 10, 20);

        let cloudHitArea = new Phaser.Geom.Circle(x + 15, y, 30);
        let cloudSprite = this.add.graphics({ fillStyle: { color: 0xFFFFFF, alpha: 0 } })
            .fillCircleShape(cloudHitArea);
        
        this.physics.add.existing(cloudSprite);
        cloudSprite.body.setCircle(30);
        cloudSprite.body.setOffset(-15, -30);
        cloudSprite.setData('lastCollected', 0);
        cloudSprite.setData('visualCloud', cloud);
        clouds.add(cloudSprite);
    }

    function collectStar(player, item) {
        let points = item.getData('points');
        let itemType = item.getData('type');
        
        showPointPopup(this, item.x, item.y, points);
        
        item.destroy();
        score += points;
        scoreText.setText('SCORE: ' + score);

        // Handle different power-ups
        if (itemType === 'blueStar') {
            activatePowerUp.call(this);
        } else if (itemType === 'pizza') {
            activatePizzaPowerUp.call(this);
        } else {
            // Yellow star boost
            player.body.setVelocityY(FLAP_VELOCITY * 1.2);
            this.tweens.add({
                targets: player,
                y: player.y - 20,
                duration: 200,
                ease: 'Power1',
                yoyo: true
            });
        }
    }

    function activatePowerUp() {
        powerUpActive = true;
        player.body.setGravityY(GRAVITY * 0.5); // Reduced gravity during power-up
        
        if (powerUpTimer) {
            powerUpTimer.remove();
        }
        
        let remainingTime = 5;
        
        if (!powerUpText) {
            powerUpText = this.add.text(400, 100, '', {
                fontSize: '32px',
                fontFamily: 'comic sans ms',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
        }
        
        updatePowerUpTextPosition();
        
        powerUpText.setText(`Power Up: ${remainingTime}`);
        powerUpText.setVisible(true);
        
        powerUpTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                remainingTime--;
                powerUpText.setText(`Power Up: ${remainingTime}`);
                
                if (remainingTime <= 0) {
                    deactivatePowerUp.call(this);
                }
            },
            repeat: 4
        });
    }

    function activatePizzaPowerUp() {
        invisibilityActive = true;
        player.setAlpha(0.5);
        
        if (invisibilityTimer) {
            invisibilityTimer.remove();
        }
        
        let remainingTime = 5;
        
        if (!invisibilityText) {
            invisibilityText = this.add.text(400, 100, '', {
                fontSize: '32px',
                fontFamily: 'comic sans ms',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
        }
        
        updatePowerUpTextPosition();
        
        invisibilityText.setText(`Invisible Mode: ${remainingTime}`);
        invisibilityText.setVisible(true);
        
        invisibilityTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                remainingTime--;
                invisibilityText.setText(`Invisible Mode: ${remainingTime}`);
                
                if (remainingTime <= 0) {
                    deactivatePizzaPowerUp.call(this);
                }
            },
            repeat: 4
        });
    }

    function deactivatePowerUp() {
        powerUpActive = false;
        player.body.setGravityY(GRAVITY);
        powerUpText.setVisible(false);
        if (powerUpTimer) {
            powerUpTimer.remove();
        }
        updatePowerUpTextPosition();
    }

    function deactivatePizzaPowerUp() {
        invisibilityActive = false;
        player.setAlpha(1);
        invisibilityText.setVisible(false);
        if (invisibilityTimer) {
            invisibilityTimer.remove();
        }
        updatePowerUpTextPosition();
    }

    function updatePowerUpTextPosition() {
        if (powerUpText && invisibilityText && powerUpText.visible && invisibilityText.visible) {
            powerUpText.setPosition(400, 70);
            invisibilityText.setPosition(400, 130);
        } else {
            if (powerUpText) powerUpText.setPosition(400, 100);
            if (invisibilityText) invisibilityText.setPosition(400, 100);
        }
    }

    function showPointPopup(scene, x, y, points) {
        let pointText = scene.add.text(x, y, `+${points}`, {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        scene.tweens.add({
            targets: pointText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: function() {
                pointText.destroy();
            }
        });
    }

    function startGame() {
        console.log('Start Game function called');
        
        // Reset game state
        score = 0;
        totalWins = 0;
        winsText.setText('WINS: 0/162');
        currentObstacleIndex = 0;
        lastTubeTime = 0;
        
        // Apply mode-specific settings
        const modeSettings = GAME_MODES[gameMode];
        gameSpeed = modeSettings.initialSpeed;
        gapSize = modeSettings.initialGapSize;
        
        // Reset and show player
        player.setPosition(MASCOT_START_X, MASCOT_START_Y);
        player.setAngle(0);
        player.setVisible(true);
        player.body.setGravityY(GRAVITY);
        
        // Show UI elements but keep score hidden until gameplay starts
        winsText.setVisible(true);
        scoreText.setVisible(false);
        
        // Set background
        regularBackground.setVisible(true);
        
        // Create and show Get Ready screen
        createGetReadyScreen.call(this);
        
        // Keep physics paused until player starts
        this.physics.pause();
    }
    
    function createGetReadyScreen() {
    
        // Create container for Get Ready elements
        getReadyContainer = this.add.container(400, 300);
        
        // Create semi-transparent background
        const overlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.3);
        
        // Create Get Ready text with pixel art style
        const getReadyText = this.add.text(0, -80, 'GET READY', {
            fontSize: '48px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            fill: '#F5D130',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        
        // Create countdown text
        const countdownText = this.add.text(0, -20, '3', {
            fontSize: '64px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Create tap/space instruction with animation
        tapInstruction = this.add.text(0, 40, 'TAP OR PRESS SPACE', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        // Add tap icon
        const tapIcon = this.add.text(0, 100, '👆', {
            fontSize: '40px'
        }).setOrigin(0.5);
        
        // Add elements to container
        getReadyContainer.add([overlay, getReadyText, countdownText, tapInstruction, tapIcon]);
        
        // Add pulsing animation to tap instruction
        this.tweens.add({
            targets: tapInstruction,
            scale: { from: 1, to: 1.1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Add bouncing animation to tap icon
        this.tweens.add({
            targets: tapIcon,
            y: { from: tapIcon.y, to: tapIcon.y + 20 },
            duration: 600,
            yoyo: true,
            repeat: -1
        });
        
        getReadyVisible = true;
    
        // Create a flag to track if game has started
        let hasGameStarted = false;
        let countdownActive = true;
        
        // Start game function
        const startGame = () => {
            if (hasGameStarted) return;
            hasGameStarted = true;
            countdownActive = false;
    
            // Fade out Get Ready screen
            this.tweens.add({
                targets: getReadyContainer,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    getReadyContainer.destroy();
                    
                    // Start actual gameplay
                    gameActive = true;
                    gameStarted = true;
                    scoreText.setVisible(true);
                    this.physics.resume();
                }
            });
        };
    
        // Set up countdown sequence
        let count = 3;
        
        const updateCountdown = () => {
            if (!countdownActive) return;
            
            // Scale animation for current number
            this.tweens.add({
                targets: countdownText,
                scale: { from: 1.2, to: 1 },
                duration: 300,
                ease: 'Power2'
            });
    
            if (count > 1) {
                count--;
                countdownText.setText(count.toString());
                this.time.delayedCall(1000, updateCountdown);
            } else {
                countdownText.setText('START!');
                this.tweens.add({
                    targets: countdownText,
                    scale: { from: 1.5, to: 1 },
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        if (countdownActive && !hasGameStarted) {
                            startGame();
                        }
                    }
                });
            }
        };
    
        // Delay adding input listeners until after a short delay
        this.time.delayedCall(500, () => {
            // Manual start handlers (for early start)
            const manualStart = () => {
                if (!hasGameStarted) {
                    startGame();
                }
            };
    
            // Add input listeners
            this.input.on('pointerdown', manualStart);
            this.input.keyboard.on('keydown-SPACE', manualStart);
        });
    
        // Start the countdown sequence
        updateCountdown();
    }

    function gameOver() {
        if (!gameActive || invisibilityActive) return;
        
        console.log('Game Over function called');
        this.physics.pause();
        gameActive = false;

        // Clean up UI elements
        scoreText.destroy();
        winsText.setVisible(false);

        // Deactivate any active power-ups
        if (powerUpActive) {
            deactivatePowerUp.call(this);
        }
        if (invisibilityActive) {
            deactivatePizzaPowerUp.call(this);
        }

        // Generate gamertag if needed
        if (!userGamertag) {
            userGamertag = generateBaseballGamertag();
        }

        // Add game over animations
        this.tweens.add({
            targets: player,
            x: player.x + 10,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.tweens.add({
                    targets: player,
                    y: 800,
                    angle: 360,
                    duration: 1000,
                    ease: 'Power1',
                    onComplete: () => {
                        player.destroy();
                        
                        // Clean up previous game over screen
                        if (gameOverContainer) {
                            gameOverContainer.destroy();
                        }
                        if (gameOverOverlay) {
                            gameOverOverlay.destroy();
                        }
                        
                        // Show new game over screen
                        this.time.delayedCall(100, () => {
                            createEnhancedGameOverScreen.call(this);
                        });
                    }
                });
            }
        });
    }

    function createEnhancedGameOverScreen() {
        // Create overlay
        gameOverOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
        // Create container
        gameOverContainer = this.add.container(400, 300);
        
        // Create panel background
        const panel = this.add.rectangle(0, 0, 400, 550, 0xFFFFFF, 1);
        panel.setStrokeStyle(2, 0x092C5C);
        
        // Add header
        const headerText = this.add.text(0, -240, 'GAME OVER', {
            fontSize: '40px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            color: '#092C5C'
        }).setOrigin(0.5);
        
        // Add trophy
        const trophy = this.add.image(0, -190, 'trophy');
        trophy.setScale(0.15);
        
        // Create stats section
        const statsBackground = this.add.rectangle(0, -130, 350, 80, 0xF0F4F8);
        
        // Add score display
        finalScoreText = this.add.text(-100, -150, 'FINAL SCORE', {
            fontSize: '20px',
            fontFamily: 'comic sans ms',
            color: '#092C5C'
        }).setOrigin(0.5);
        
        const scoreValue = this.add.text(-100, -120, '0', {
            fontSize: '32px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            color: '#092C5C'
        }).setOrigin(0.5);
        
        // Animate score
        this.tweens.addCounter({
            from: 0,
            to: score,
            duration: 1500,
            onUpdate: function (tween) {
                scoreValue.setText(Math.floor(tween.getValue()));
            }
        });
        
        // Add wins display
        totalWinsText = this.add.text(100, -150, 'TOTAL WINS', {
            fontSize: '20px',
            fontFamily: 'comic sans ms',
            color: '#092C5C'
        }).setOrigin(0.5);
        
        const winsValue = this.add.text(100, -120, totalWins.toString(), {
            fontSize: '32px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            color: '#092C5C'
        }).setOrigin(0.5);
        
        // Add gamertag display
        const gamertagBackground = this.add.rectangle(0, -60, 350, 50, 0xFFF9E6);
        gamertagText = this.add.text(0, -60, userGamertag, {
            fontSize: '28px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            color: '#092C5C'
        }).setOrigin(0.5);

        // Add medals based on score
        const medalContainer = this.add.container(0, -10);
        if (score >= 1000) {
            const goldMedal = this.add.image(-60, 0, 'gold-medal').setScale(0.12);
            medalContainer.add(goldMedal);
        }
        if (score >= 500) {
            const silverMedal = this.add.image(0, 0, 'medal-silver').setScale(0.12);
            medalContainer.add(silverMedal);
        }
        if (score >= 100) {
            const bronzeMedal = this.add.image(60, 0, 'medal-bronze').setScale(0.12);
            medalContainer.add(bronzeMedal);
        }
        
        // Update and show leaderboard
        updateLeaderboard(score);
        const leaderboardBackground = this.add.rectangle(0, 120, 350, 200, 0xF5F5F5);
        
        const leaderboardTitle = this.add.text(0, 40, 'TOP SCORES', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            color: '#092C5C',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    
        // Create leaderboard entries
        const leaderboardContainer = this.add.container(0, 0);
        const currentLeaderboard = gameMode === 'ALL STAR' ? allStarLeaderboard : hallOfFameLeaderboard;
        
        if (currentLeaderboard.length > 0) {
            const topScores = currentLeaderboard.slice(0, 5);
            topScores.forEach((entry, index) => {
                const yPos = 70 + (index * 35);
                const scoreEntry = this.add.text(0, yPos, 
                    `${index + 1}. ${entry.name} - ${entry.score}`, {
                    fontSize: '18px',
                    fontFamily: 'comic sans ms',
                    color: '#092C5C',
                    align: 'center'
                }).setOrigin(0.5);
                leaderboardContainer.add(scoreEntry);
            });
        }
        // Continuing createEnhancedGameOverScreen function...
        
        // Add play again button
        const playAgainButton = this.add.rectangle(0, 220, 200, 50, 0x092C5C);
        const playAgainText = this.add.text(0, 220, 'PLAY AGAIN', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Make button interactive
        playAgainButton.setInteractive()
            .on('pointerover', () => playAgainButton.setFillStyle(0x1a365d))
            .on('pointerout', () => playAgainButton.setFillStyle(0x092C5C));
        
        playAgainButton.on('pointerdown', () => {
            this.tweens.add({
                targets: gameOverContainer,
                scale: 0,
                duration: 300,
                ease: 'Back.in',
                onComplete: () => {
                    gameOverContainer.destroy();
                    gameOverOverlay.destroy();
                    restartGame.call(this);
                }
            });
        });
        
        // Add all elements to container
        gameOverContainer.add([
            panel,
            headerText,
            trophy,
            statsBackground,
            finalScoreText,
            scoreValue,
            totalWinsText,
            winsValue,
            gamertagBackground,
            gamertagText,
            medalContainer,
            leaderboardBackground,
            leaderboardTitle,
            leaderboardContainer,
            playAgainButton,
            playAgainText
        ]);
        
        // Add entry animation
        gameOverContainer.setScale(0);
        this.tweens.add({
            targets: gameOverContainer,
            scale: 1,
            duration: 500,
            ease: 'Back.out'
        });
    }

    function updateLeaderboard(score) {
        let leaderboard = gameMode === 'ALL STAR' ? allStarLeaderboard : hallOfFameLeaderboard;
        leaderboard.push({ name: userGamertag, score: score, wins: totalWins });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 15);
        console.log('Leaderboard updated:', { name: userGamertag, score: score, wins: totalWins });
    }

    function generateBaseballGamertag() {
        const adjectives = ['Slugging', 'Speedy', 'Mighty', 'Golden', 'Iron', 'Flying', 'Swift', 'Crafty', 'Clutch', 'Smooth'];
        const nouns = ['Bat', 'Glove', 'Arm', 'Eye', 'Cleats', 'Slider', 'Fastball', 'Homer', 'Catch', 'Steal'];
        const numbers = Math.floor(Math.random() * 100);

        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${adjective}${noun}${numbers}`;
    }

    function createGameModeButtons() {
        console.log("Game mode buttons created");
        let allStarButton = this.add.text(300, 510, 'ALL STAR', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fill: '#000000',  // Changed to black text
            backgroundColor: '#F5D130',  // Changed to Rays Yellow
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        let hallOfFameButton = this.add.text(500, 510, 'HALL OF FAME', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fill: '#000000',  // Changed to black text
            backgroundColor: '#F5D130',  // Changed to Rays Yellow
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        allStarButton.on('pointerdown', () => showOptInScreen.call(this, 'ALL STAR'));
        hallOfFameButton.on('pointerdown', () => showOptInScreen.call(this, 'HALL OF FAME'));
    }

    function showOptInScreen(mode) {
        gameMode = mode;
        optInScreen.setVisible(true);
        howToPlayText.setVisible(false);
        
        // Hide mode selection buttons
        this.children.getAll().forEach(child => {
            if (child.text === 'ALL STAR' || child.text === 'HALL OF FAME') {
                child.setVisible(false);
            }
        });
    }

    function createOptInScreen() {
        optInScreen = this.add.container(400, 300);
        optInScreen.setVisible(false);

        let bg = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.8);
        
        let title = this.add.text(0, -150, 'READY TO PLAY?', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            fill: '#000',
            align: 'center',
            backgroundColor: '#F5D130',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Create checkbox
        let checkbox = this.add.rectangle(-150, 0, 30, 30, 0xF5D130);
        checkbox.setStrokeStyle(2, 0x000000);
        checkbox.setOrigin(0.5);
        checkbox.setInteractive();
        
        let checkmark = this.add.text(-150, 0, '✓', { 
            fontSize: '24px', 
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            fill: '#000000' 
        }).setOrigin(0.5);
        checkmark.setVisible(false);

        let checkboxText = this.add.text(-120, 0, 'Player agrees to the game rules,\nprivacy policies, terms and conditions', {
            fontSize: '16px',
            fontFamily: 'comic sans ms',
            fill: '#000',
            align: 'left',
            backgroundColor: '#F5D130',
            padding: { x: 10, y: 5 },
            wordWrap: { width: 400 }
        }).setOrigin(0, 0.5);

        checkbox.on('pointerdown', function() {
            checkmark.setVisible(!checkmark.visible);
        });

        let playButton = this.add.text(0, 100, 'PLAY!', {
            fontSize: '24px',
            fontFamily: 'comic sans ms',
            fontStyle: 'bold',
            fill: '#000',
            backgroundColor: '#F5D130',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        optInScreen.add([bg, title, checkbox, checkmark, checkboxText, playButton]);

        playButton.on('pointerdown', () => {
            if (checkmark.visible) {
                userOktaId = generateMockOktaId();
                console.log('User OKTA ID:', userOktaId);
                optInScreen.setVisible(false);
                startGame.call(this);
            } else {
                let errorText = this.add.text(0, 150, 'Please agree to the game policies and rules', {
                    fontSize: '16px',
                    fontFamily: 'comic sans ms',
                    fill: '#FF0000',
                    backgroundColor: '#F5D130',
                    padding: { x: 10, y: 5 }
                }).setOrigin(0.5);
                optInScreen.add(errorText);
                this.time.delayedCall(2000, () => errorText.destroy());
            }
        });
    }

    function generateMockOktaId() {
        return 'OKTA_' + Math.random().toString(36).substr(2, 9);
    }

    function restartGame() {
        try {
            // Reset game state flags first
            gameActive = false;
            gameStarted = false;
            getReadyVisible = false;
            
            // Get mode-specific settings
            const modeSettings = GAME_MODES[gameMode];
            
            // Reset core game variables
            score = 0;
            totalWins = 0;
            currentObstacleIndex = 0;
            lastTubeTime = 0;
            gameSpeed = modeSettings.initialSpeed;
            gapSize = modeSettings.initialGapSize;
            powerUpActive = false;
            invisibilityActive = false;
    
            // Clean up all existing game elements
            this.tweens.killAll(); // Stop all running tweens
            
            // Clear all game groups
            if (tubes) tubes.clear(true, true);
            if (logos) logos.clear(true, true);
            if (stars) stars.clear(true, true);
            if (clouds) clouds.clear(true, true);

            // Clean up text elements
            if (scoreText) scoreText.destroy();
            if (winsText) winsText.destroy();
            if (powerUpText) powerUpText.destroy();
            if (invisibilityText) invisibilityText.destroy();
            if (gameOverContainer) gameOverContainer.destroy();
            if (gameOverOverlay) gameOverOverlay.destroy();
            if (getReadyContainer) getReadyContainer.destroy();

            // Clean up timers
            if (powerUpTimer) powerUpTimer.remove();
            if (invisibilityTimer) invisibilityTimer.remove();

            // Reset player
            if (player) player.destroy();
            
            // Recreate essential game elements
            // Recreate wins text
            winsText = this.add.text(790, 20, 'WINS: 0/162', {
                fontSize: '20px',
                fontFamily: 'comic sans ms',
                fontStyle: 'bold',
                fill: '#FFFFFF',
                align: 'right'
            });
            winsText.setOrigin(1, 0);
            winsText.setVisible(true);
            winsText.setDepth(20);

            // Recreate score text
            scoreText = this.add.text(400, 30, 'SCORE: 0', { 
                fontSize: '24px', 
                fill: '#FFFFFF',
                fontFamily: 'comic sans ms',
                fontStyle: 'bold'
            });
            scoreText.setOrigin(0.5);
            scoreText.setVisible(false);
            scoreText.setDepth(20);

            // Create new player
            player = createMascot(this, MASCOT_START_X, MASCOT_START_Y);
            this.physics.add.existing(player);
            player.body.setSize(60, 60);
            player.body.setCollideWorldBounds(true);
            player.setDepth(10);
            player.setAlpha(1);
            player.setVisible(true);
            player.setAngle(0);
            player.body.setGravityY(GRAVITY);

            // Reset null references
            powerUpTimer = null;
            invisibilityTimer = null;
            powerUpText = null;
            invisibilityText = null;
            getReadyContainer = null;
    
            // Reset physics and collisions
            setupPhysics.call(this);
    
            // Make sure physics is paused before showing Get Ready screen
            this.physics.pause();
    
            // Small delay before showing Get Ready screen
            this.time.delayedCall(100, () => {
                createGetReadyScreen.call(this);
            });
    
            console.log(`Game restarted in ${gameMode} mode with speed: ${gameSpeed} and gap size: ${gapSize}`);
    
        } catch (error) {
            console.error('Critical error during game restart:', error);
            
            const errorText = this.add.text(400, 300, 'Error restarting game\nPlease refresh the page', {
                fontSize: '24px',
                fontFamily: 'comic sans ms',
                fill: '#FF0000',
                align: 'center'
            }).setOrigin(0.5);
            
            setTimeout(() => window.location.reload(), 3000);
        }
    }

    // Orientation handling
    function checkOrientation() {
        const message = document.getElementById('orientation-message');
        if (!message) return;
        
        const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        if (orientation === 'portrait') {
            message.style.display = 'flex';
            if (game && game.scene && game.scene.scenes.length > 0) {
                game.scene.scenes[0].scene.pause();
            }
        } else {
            message.style.display = 'none';
            if (game && game.scene && game.scene.scenes.length > 0) {
                game.scene.scenes[0].scene.resume();
            }
        }
    }

    // Set up orientation handlers
    window.addEventListener('orientationchange', () => {
        setTimeout(checkOrientation, 100);
    });
    window.addEventListener('resize', checkOrientation);

    // Initial orientation check
    checkOrientation();

    // Final console log
    console.log('Game script finished loading');
}})