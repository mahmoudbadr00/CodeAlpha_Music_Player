class MusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.volumeSlider = document.getElementById('volume');
        this.progressBar = document.querySelector('.progress');
        this.currentTimeSpan = document.getElementById('current-time');
        this.durationSpan = document.getElementById('duration');
        this.playlistContainer = document.getElementById('playlist-items');
        
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        
        this.playlist = [
            {
                title: "Lovely",
                artist: "Billie Eilish",
                cover: "https://www.rollingstone.com/wp-content/uploads/2018/06/3045823-90797c37-aed9-4b70-8eb5-3aa14b7f0186.jpg",
                url: "songs/1.mp3"
            },
            {
                title: "Rockabye",
                artist: "Anne Marie",
                cover: "https://eddie11.com/wp-content/uploads/2016/11/Clean-Bandit-ft-Sean-Paul-Anne-Marie-Rockabye.jpg",
                url: "songs/2.mp3"
            },
            {
                title: "Mi Gente",
                artist: "J. Balvin & Willy Williams",
                cover: "https://m.media-amazon.com/images/M/MV5BZTEwN2MyNjgtNjA5Mi00MmYwLTk2MTAtMWYwZmIwNzMwODdiXkEyXkFqcGc@._V1_.jpg",
                url: "songs/3.mp3"
            },
            {
                title: "La Vie en rose",
                artist: "Édith Piaf",
                cover: "https://i.scdn.co/image/ab67616d0000b2738be513cb84934747b7d6abab",
                url: "songs/4.mp3"
            },
            {
                title: "Beggin'",
                artist: "Måneskin",
                cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqvdBqJnHMfh2eT63opRRy9Ip_8NIj6zmTRQ&s",
                url: "songs/5.mp3"
            },
            {
                title: "Million years ago",
                artist: "Adele",
                cover: "https://f4.bcbits.com/img/a4130086820_10.jpg",
                url: "songs/6.mp3"
            }
        ];
        
        this.initializePlayer();
        this.setupEventListeners();
        this.renderPlaylist();
    }
    
    initializePlayer() {
        this.loadTrack(this.currentTrackIndex);
        this.volumeSlider.value = 100;
        this.audioPlayer.volume = 1;
    }
    
    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        this.prevBtn.addEventListener('click', () => this.playPrevTrack());
        
        this.nextBtn.addEventListener('click', () => this.playNextTrack());
        
        this.volumeSlider.addEventListener('input', (e) => {
            this.audioPlayer.volume = e.target.value / 100;
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        
        const progressBarContainer = document.querySelector('.progress-bar');
        progressBarContainer.addEventListener('click', (e) => {
            const clickPosition = e.offsetX;
            const totalWidth = progressBarContainer.offsetWidth;
            const clickedTime = (clickPosition / totalWidth) * this.audioPlayer.duration;
            this.audioPlayer.currentTime = clickedTime;
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.playNextTrack();
        });

        this.audioPlayer.addEventListener('loadstart', () => {
            console.log('Loading track...');
        });

        this.audioPlayer.addEventListener('canplay', () => {
            console.log('Track loaded and ready to play');
        });

        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Error loading track:', e);
            alert('Error loading track. Trying next track...');
            this.playNextTrack();
        });
    }
    
    loadTrack(index) {
        const track = this.playlist[index];
        
        document.getElementById('title').textContent = track.title;
        document.getElementById('artist').textContent = track.artist;
        document.getElementById('cover').src = track.cover;
        
        this.audioPlayer.src = track.url;
        this.audioPlayer.load();
        
        this.progressBar.style.width = '0%';
        this.currentTimeSpan.textContent = '0:00';
        
        const playlistItems = this.playlistContainer.querySelectorAll('li');
        playlistItems.forEach(item => item.classList.remove('active'));
        if (playlistItems[index]) {
            playlistItems[index].classList.add('active');
        }

        if (this.isPlaying) {
            this.audioPlayer.play()
                .then(() => {
                    this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    this.isPlaying = false;
                    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                });
        }
    }
    
    async togglePlayPause() {
        try {
            if (this.isPlaying) {
                await this.audioPlayer.pause();
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                await this.audioPlayer.play();
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            this.isPlaying = !this.isPlaying;
        } catch (error) {
            console.error('Error toggling play/pause:', error);
            alert('Error playing track. Please try again.');
        }
    }
    
    playPrevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }
    
    playNextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }
    
    updateProgress() {
        if (!this.audioPlayer.duration) return;
        
        const duration = this.audioPlayer.duration;
        const currentTime = this.audioPlayer.currentTime;
        
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;
        
        this.currentTimeSpan.textContent = this.formatTime(currentTime);
        this.durationSpan.textContent = this.formatTime(duration);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    renderPlaylist() {
        this.playlistContainer.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${track.title} - ${track.artist}`;
            li.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.isPlaying = true;
                this.audioPlayer.play()
                    .then(() => {
                        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    })
                    .catch(error => {
                        console.error('Error playing track:', error);
                        this.isPlaying = false;
                        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    });
            });
            this.playlistContainer.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});