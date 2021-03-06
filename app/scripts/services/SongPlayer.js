 (function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        var currentAlbum = Fixtures.getAlbum();
 /**
 * @desc Buzz object audio file
 * @type {Object}
 */
        var currentBuzzObject = null;
    /**
 * @function setSong
 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
 * @param {Object} song
 */     
    var setSong = function(song) {
        if (currentBuzzObject) {
           stopSong(SongPlayer.currentSong);
        }
 
        currentBuzzObject = new buzz.sound(song.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
        
        currentBuzzObject.bind('timeupdate', function() {
         $rootScope.$apply(function() {
             SongPlayer.currentTime = currentBuzzObject.getTime();
         });
     });
 
        SongPlayer.currentSong = song;
    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;
    SongPlayer.volume = 40;    
        
    };
    var stopSong = function(song){
        currentBuzzObject.stop();
        song.playing = null;
        
    };    
    /**
 * @function playSong
 * @desc Plays the current buzz object 
 * @param {Object} song
 */
var playSong = function(song){
        currentBuzzObject.play();
        song.playing = true;
        
    };
 var getSongIndex = function(song) {
     return currentAlbum.songs.indexOf(song);
 };        
 /**
 * @desc Active song object from list of songs
 * @type {Object}
 */        
    SongPlayer.currentSong = null;
   
     SongPlayer.play = function(song) {
         song = song || SongPlayer.currentSong;
         if (SongPlayer.currentSong !== song) {
             setSong(song);
             playSong(song);
              } else if (SongPlayer.currentSong === song) {
                    if (currentBuzzObject.isPaused()) {
                        playSong(song);
            }
        }      
     };
    
     SongPlayer.pause = function(song) {
        song = song || SongPlayer.currentSong; 
        currentBuzzObject.pause();
        song.playing = false;
     };
     SongPlayer.previous = function() {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex--;
        if (currentSongIndex < 0) {
         stopSong(SongPlayer.currentSong);
        } else {
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
          }     
    };  
    SongPlayer.next = function() {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex++;
        if (currentSongIndex > currentAlbum.songs.length - 1 ) {
                stopSong(SongPlayer.currentSong);
        } else {
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
          }     
    };  
     /**
 * @function setCurrentTime
 * @desc Set current time (in seconds) of currently playing song
 * @param {Number} time
 */
    SongPlayer.setCurrentTime = function(time) {
        if (currentBuzzObject) {
            currentBuzzObject.setTime(time);
        }
    }; 
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
            SongPlayer.volume = volume
    };

     return SongPlayer;
 }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();