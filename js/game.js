class CookieGame {
    constructor() {
        this.playerName = localStorage.getItem('playerName') || '';
        this.isLoggedIn = false;
        this.loadGame();
        this.setupEventListeners();
        this.startGameLoop();
        this.updateUI();
        this.spawnGoldenCookieLoop();
        this.autoSaveInterval = setInterval(() => this.saveGame(), 60000);
        this.rankingUpdateInterval = setInterval(() => this.updateServerRanking(), 30000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showLogin() {
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    }

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('api/auth.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.isLoggedIn = true;
                this.playerName = data.username;
                localStorage.setItem('playerName', data.username);

                // Charger la progression si elle existe
                if (data.progress) {
                    this.loadProgress(data.progress);
                }

                this.showNotification('Connexion réussie!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                this.updateUI();
            } else {
                this.showNotification(data.error, 'danger');
            }
        } catch (error) {
            this.showNotification('Erreur de connexion', 'danger');
        }

        return false;
    }

    async handleRegister() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('api/auth.php?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Compte créé! Vous pouvez vous connecter.', 'success');
            } else {
                this.showNotification(data.error, 'danger');
            }
        } catch (error) {
            this.showNotification('Erreur lors de l\'inscription', 'danger');
        }
    }

    loadProgress(progress) {
        this.cookies = parseFloat(progress.score) || 0;
        this.level = parseInt(progress.level) || 1;
        if (progress.buildings) {
            this.buildings = JSON.parse(progress.buildings);
        }
        if (progress.achievements) {
            this.achievements = JSON.parse(progress.achievements);
        }
        this.updateUI();
    }

    async updatePlayerName() {
        const input = document.getElementById('playerName');
        const newName = input.value.trim();

        if (newName && newName !== this.playerName) {
            this.playerName = newName;
            localStorage.setItem('playerName', newName);
            await this.updateServerRanking();
            this.showAchievement('Pseudo mis à jour! 👤', 'success');
        }
    }

    async updateServerRanking() {
        if (!this.isLoggedIn || !this.playerName) return;

        try {
            const response = await fetch('api/update_score.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName: this.playerName,
                    score: Math.floor(this.cookies),
                    level: this.level,
                    buildings: JSON.stringify(this.buildings),
                    achievements: JSON.stringify(this.achievements)
                })
            });

            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du classement:', error);
        }
    }

    async showRanking() {
        try {
            const response = await fetch('api/get_ranking.php');
            const ranking = await response.json();

            const container = document.getElementById('rankingList');
            container.innerHTML = ranking
                .map((score, index) => `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1">#${index + 1} - ${score.player_name}</h5>
                                <small>Niveau ${score.level} - ${new Date(score.timestamp).toLocaleDateString()}</small>
                            </div>
                            <span class="badge bg-primary rounded-pill">
                                ${parseInt(score.score).toLocaleString()} 🍪
                            </span>
                        </div>
                    </div>
                `).join('') || '<div class="list-group-item">Aucun score enregistré</div>';

            new bootstrap.Modal(document.getElementById('rankingModal')).show();
        } catch (error) {
            console.error('Erreur lors de la récupération du classement:', error);
            this.showAchievement('Erreur de chargement du classement', 'danger');
        }
    }
}
