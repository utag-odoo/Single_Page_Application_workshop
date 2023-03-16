/** @odoo-module**/

const { Component, xml, mount, setup, useState }  = owl;

let audio = '';
class Player extends Component {
    static template = xml`
        <div style="position:absolute;bottom:0px">
            <h2 id="song-title">Song Title</h2>
            <div>
                <button id="pause-button" t-on-click="pauseThisSong">Pause</button>
                <button id="play_btn" t-on-click="playThisSong">Play</button>
                <button id="stop-button" t-on-click="stopThisSong">Stop</button>
            </div>
        </div>`;

            playThisSong() {
            if (!audio) {
              return;
            }
            audio.play();
          }
          pauseThisSong() {
            if (!audio) {
              return;
            }
            audio.pause();
          }
          stopThisSong() {
            if (!audio) {
              return;
            }
            audio.pause();
            audio.currentTime = 0;
        }
}

// class PlayList extends Component {
//     static template = xml`
//         <div style="float:right">

//         </div>
//         `;

// }

class MusicList extends Component {
    static template = xml`
        <div id="MusicList" style="float:left">
        <t t-if="props.searchData[0] and props.searchData[0] !== 'Song not Found'">
        <h2>List of Songs</h2>
        <t t-foreach="props.searchData[0]" t-as="song" t-key="song.id">
            <p><t t-out="song.name"/></p>
            <button t-att-value="song.url" t-on-click="addSongToPlaylist">Add to playlist</button>
            <button t-att-value="song.url" t-on-click="playSong">Play song</button>
        </t>
        </t>
        <Player/>
        </div>
        `;

        addSongToPlaylist () {
            //TAsk:
            // add Playlist component as the child of root component and when addSongToPlaylist method is called update the 
            //PlayList component template with the song thats added.
            // hint use callback method as which update the props u are passing to PlayList component.
        }

        playSong(ev) {
            // in case a audio is already playing stop it to play another.
            if (audio) {
              audio.pause();
              audio.currentTime = 0;
            }
              const selectedSongUrl = ev.target.getAttribute('value');
              const selectedSong = this.props.searchData[0].find(song => song.url === selectedSongUrl);
              document.getElementById('song-title').textContent = selectedSong.name;
              audio = new Audio(selectedSongUrl);
              audio.play();
          }
    static props = ['searchData'];

    static components = { Player }; 
}

class Search extends Component {
    static template = xml `
    <div style="text-align:center">
            <input type="text" id="searchSong" placeholder="Search a music" value="Akon"/>
            <button t-on-click="getMusic" id="SearchButton">Search</button>
            <MusicList searchData="searchData"/>
    </div>
    `;
    setup() {
        this.searchData = useState([]);
    }

    async getMusic() {
        const findSong = document.getElementById('searchSong').value;
        const response = await fetch(`/music/search?song_name=${findSong}`);
        const {result : newData}= await response.json();
        this.searchData.pop(); // add pop to remove previously searched data.
        this.searchData.push(newData);
    }

    static components = { MusicList }
}

class Root extends Component { // import from owl
    // import from owl
    static template = xml ` 
    <style>
    body {
        margin: 0;
        padding: 0;
        height: 100vh;
    }
    </style>
    <div id="Container" style="position:relative;height:100%">
        <Search/>
    </div>
    `;

    static components = { Search }; 
}

window.onload = function() {
    mount(Root, document.body);
};