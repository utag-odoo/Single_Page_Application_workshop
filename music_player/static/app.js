const { Component, mount, xml ,useState} = owl

let audio= '';

class PlayList extends Component {
    static template = xml`
        <div style="float:right">
            <h2>Play List</h2>
            <t t-foreach="props.playlist" t-as="song" t-key="song_id">
                <div><p id="song_name"><t t-out="song.name"/></p></div>
            </t>
        </div>
    `;
    static props = ['playlist']
}

class Player extends Component {
    static template = xml`
        <div style="position:absolute; bottom:0px;">
            <h2 id="song-title">Song Title </h2>
            <div>
                <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
                <button id="play_btn" t-on-click="playThisSong">Play</button>
                <button id="stop-button" t-on-click="stopThisSong">Stop</button>
            </div>
        </div>
    `;
    pauseThisSong(){
        if(!audio){
            return;
        }
        audio.pause();
    }
    playThisSong(){
        if(!audio){
            return;
        }
        audio.play();
    }
    stopThisSong(){
        if(!audio){
            return;
        }
        audio.pause();
        audio.currentTime=0;
    }
}
class MusicList extends Component {
    static template = xml`
        <div id="MusicList" style="float:left">
        <t t-if="props.searchData[0] and props.searchData[0] !== 'Song Not Found'">
            <h2>List of songs </h2>
            <t t-foreach='props.searchData[0]' t-as='song' t-key='sond_id'>
                <p><t t-out="song.name"></t></p>
                <button t-att-value="song.url" t-on-click="addSongToPlayList">Add To playlist</button>
                <button t-att-value="song.url" t-on-click="playSong">Play Song</button>
            </t>
        </t>
            <Player/>        
        </div>
    `;
    playSong(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        console.log("----",selectedSongUrl);
        const selectedSong = this.props.searchData[0].find(
            song => song.url === selectedSongUrl
        );
        console.log("------",selectedSong);
        document.getElementById('song-title').textContent = selectedSong.name;
        audio = new Audio(selectedSongUrl);
        console.log(audio);
        audio.play();    
    }

    addSongToPlayList(ev) {
        const selectedSongUrl = ev.target.getAttribute('value');
        const selectedSong = this.props.searchData[0].find(
            song => song.url === selectedSongUrl
        );
        this.props.updateAddToPlayList(selectedSong)
    }
    
    static props = [ 'searchData', 'updateAddToPlayList' ];
    static components = { Player };
}
class Search extends Component {
    static template = xml`
        <div style="border:1px; text-align:center">
            <input type="text" id="searchSong" placeholder="Search here" value="Freedom"/>
            <button t-on-click="getMusic" is="searchButton">Search</button>
            <MusicList searchData='searchData' updateAddToPlayList="props.updateAddToPlayList"/>
        </div>
    `;

    setup(){
        this.searchData = useState([]);
    }    
    async getMusic() {
        const findSong = document.getElementById('searchSong').value;
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const {result : newData} = await response.json();
        this.searchData.push(newData);
    }

    static props = ['updateAddToPlayList'];
    static components = { MusicList };
}

class Root extends Component {
    static template = xml`
        <div>
            <Search updateAddToPlayList="this.updateAddToPlayList"/>
            <PlayList playlist="addToPlayList"/>
        </div>       
    `;

    setup(){
        this.addToPlayList = useState([]);
    }
    updateAddToPlayList = (newData) => {
        if (JSON.stringify(this.addToPlaylist).includes(JSON.stringify(newData))) {
            return;
        }
        this.addToPlaylist.push(newData);
    }
    
    static components = { Search, MusicList ,PlayList};
}

window.onload = function () {
    mount(Root, document.body);
}